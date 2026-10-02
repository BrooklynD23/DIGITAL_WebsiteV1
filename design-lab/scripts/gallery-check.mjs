// Usage: node design-lab/scripts/gallery-check.mjs
// Verifies /design-lab (gallery) and /design-lab/components: console errors, horizontal page overflow at
// 390/834/1440, tablist keyboard behaviour + deep links, no-JS rendering, live specimen fonts, contained grid scroll.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}
const browser = await chromium.launch({ executablePath: findHeadlessShell() });
let fails = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}`);
  if (!cond) fails += 1;
};
const open = async (path, opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: opts.w ?? 1440, height: 900 }, javaScriptEnabled: opts.js ?? true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(800);
  return { ctx, page, errors };
};

for (const path of ['/design-lab/', '/design-lab/components/']) {
  for (const w of [390, 834, 1440]) {
    const { ctx, page, errors } = await open(path, { w });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(errors.length === 0, `${path} @${w}: console errors ${errors.length} ${errors.slice(0, 2).join(' | ')}`);
    ok(over <= 0, `${path} @${w}: horizontal page overflow ${over}px`);
    if (path.includes('components')) {
      const s = await page.evaluate(() => {
        const el = document.querySelector('[role="region"]');
        return { sw: el.scrollWidth, cw: el.clientWidth };
      });
      console.log(`     grid scroller @${w}: scrollWidth ${s.sw} / clientWidth ${s.cw}${w === 390 ? ' (stacked fallback)' : ''}`);
    }
    await ctx.close();
  }
}

// Tablist keyboard + hash
{
  const { ctx, page } = await open('/design-lab/');
  const sel = () => page.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]')?.id);
  const visible = () => page.evaluate(() => [...document.querySelectorAll('[role="tabpanel"]')].filter((p) => !p.hidden).map((p) => p.id).join(','));
  ok((await sel()) === 'tab-a' && (await visible()) === 'a', 'initial: tab A selected, only panel a visible');
  await page.focus('#tab-a');
  await page.keyboard.press('ArrowRight');
  ok((await sel()) === 'tab-b' && (await page.evaluate(() => document.activeElement?.id)) === 'tab-b', 'ArrowRight moves focus + selection to B');
  ok((await visible()) === 'b' && (await page.evaluate(() => location.hash)) === '#b', 'panel b visible, URL hash #b');
  await page.keyboard.press('End');
  ok((await sel()) === 'tab-f', 'End selects F');
  await page.keyboard.press('ArrowRight');
  ok((await sel()) === 'tab-a', 'ArrowRight wraps F -> A');
  await page.keyboard.press('ArrowLeft');
  ok((await sel()) === 'tab-f', 'ArrowLeft wraps A -> F');
  await page.keyboard.press('Home');
  ok((await sel()) === 'tab-a', 'Home selects A');
  const tabindex = await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].map((t) => t.tabIndex).join(''));
  ok(tabindex === '0-1-1-1-1-1', `roving tabindex ${tabindex}`);
  // live fonts per concept
  const fams = { a: 'Zodiak', b: 'IBM Plex Sans Condensed', c: 'Clash Display', d: 'Fraunces', e: 'Cabinet Grotesk', f: 'Bricolage Grotesque' };
  for (const [id, fam] of Object.entries(fams)) {
    await page.click(`#tab-${id}`);
    await page.waitForTimeout(1200);
    // next/font renames families to "__<Name>_<hash>", Fontshare keeps the plain name.
    const loaded = await page.evaluate((fam) => [...document.fonts].some((f) => {
      const n = f.family.replace(/['"]/g, '');
      return (n.startsWith(fam) || n.startsWith(`__${fam.replace(/ /g, '_')}_`)) && f.status === 'loaded';
    }), fam);
    ok(loaded, `panel ${id}: display face "${fam}" loaded live`);
  }
  await ctx.close();
}
{
  const { ctx, page } = await open('/design-lab/#d');
  const st = await page.evaluate(() => ({
    sel: document.querySelector('[role="tab"][aria-selected="true"]')?.id,
    vis: [...document.querySelectorAll('[role="tabpanel"]')].filter((p) => !p.hidden).map((p) => p.id).join(','),
  }));
  ok(st.sel === 'tab-d' && st.vis === 'd', `deep link #d -> ${st.sel} / ${st.vis}`);
  await ctx.close();
}
{
  const { ctx, page } = await open('/design-lab/', { js: false });
  const st = await page.evaluate(() => ({
    panels: [...document.querySelectorAll('section[id]')].filter((s) => /^[a-f]$/.test(s.id) && s.offsetHeight > 0).length,
    links: document.querySelectorAll('nav[aria-label="Concepts"] a[href^="#"]').length,
    tabs: document.querySelectorAll('[role="tab"]').length,
    video: !!document.querySelector('video[poster]'),
  }));
  ok(st.panels === 6 && st.links === 6 && st.tabs === 0, `no-JS: ${st.panels} panels visible, ${st.links} anchor links, ${st.tabs} tabs`);
  ok(st.video, 'no-JS: reel video with poster present');
  await ctx.close();
}
{
  const { ctx, page } = await open('/design-lab/components/', { js: false });
  const n = await page.evaluate(() => ({
    imgs: document.querySelectorAll('td img').length,
    rowHeads: document.querySelectorAll('th[scope="row"]').length,
    colHeads: document.querySelectorAll('th[scope="col"]').length,
  }));
  ok(n.imgs === 30 && n.rowHeads === 5 && n.colHeads === 6, `components no-JS: ${n.imgs} crops, ${n.rowHeads} row headers, ${n.colHeads} column headers`);
  await ctx.close();
}
const v = await (await browser.newContext()).newPage();
const r = await v.request.get(`${base}/design-lab/gallery/reel.mp4`);
ok(r.status() === 200, `reel.mp4 served (${r.status()})`);
await browser.close();
console.log(fails ? `${fails} FAIL` : 'ALL PASS');
process.exit(fails ? 1 : 0);
