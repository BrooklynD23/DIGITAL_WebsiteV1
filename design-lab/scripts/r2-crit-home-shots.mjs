// W2-CRIT-HOME evidence: viewport stills at ~10 scroll steps (1440x900, 390x844) per world, plus one webm per world
// (1440x900: load -> full scroll -> main interactions), reduced-motion + no-JS stills, keyboard path probe.
// Usage: node design-lab/scripts/r2-crit-home-shots.mjs [steps|video|reduced|nojs|keys|all] [signal|apple|both]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [mode = 'all', which = 'both'] = process.argv.slice(2);
const worlds = which === 'both' ? ['signal', 'apple'] : [which];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const OUT = 'design-lab/renders/r2/crit/home';
mkdirSync(OUT, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const VPS = [
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: '390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const url = (w) => `${base}/design-lab/r2/${w}/`;
const log = [];

async function steps(world, vp, extra = {}, tag = '') {
  const { name, ...opts } = vp;
  const ctx = await browser.newContext({ ...opts, ...extra });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await page.goto(url(world), { waitUntil: extra.javaScriptEnabled === false ? 'domcontentloaded' : 'networkidle', timeout: 60000 });
  // Hydration flips the static layout to the pinned one after first paint; wait for it (JS runs only).
  if (extra.javaScriptEnabled !== false && !extra.reducedMotion) await page.waitForSelector('[data-enhanced]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const n = 10;
  for (let i = 0; i <= n; i++) {
    const y = Math.round((total * i) / n);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${world}-${name}${tag}-${String(i).padStart(2, '0')}.png` });
  }
  log.push({ world, vp: name, tag, scrollMax: total, errors: errs });
  await ctx.close();
}

async function video(world) {
  const dir = `${OUT}/vid-tmp-${world}`;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir, size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.goto(url(world), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[data-enhanced]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  // Slow wheel scroll through the whole page (~ 14 s).
  for (let y = 0; y < total; y += 120) { await page.mouse.wheel(0, 120); await page.waitForTimeout(55); }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  if (world === 'signal') {
    // Timebase: arrow keys on the ruler, then the strip tiles, then a channel hover.
    const r = page.locator('input[type=range]');
    await r.focus();
    for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1600); }
    const tiles = page.locator('button[aria-pressed]');
    await tiles.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    for (let i = 0; i < 4; i++) { await tiles.nth(i).hover(); await page.waitForTimeout(1800); }
    const row = page.locator('[data-stage-host]').first();
    await row.scrollIntoViewIfNeeded(); await row.hover(); await page.waitForTimeout(2500);
  } else {
    const tr = page.locator('nav[aria-label="Build stages"] button');
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await page.waitForTimeout(600);
    for (let i = 0; i < 4; i++) { await tr.nth(i).click(); await page.waitForTimeout(1800); }
    const nx = page.locator('button[aria-label="Next highlight"]');
    await nx.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    for (let i = 0; i < 4; i++) { await nx.click(); await page.waitForTimeout(1100); }
    await page.locator('#join').scrollIntoViewIfNeeded(); await page.waitForTimeout(2500);
  }
  const v = page.video();
  await ctx.close();
  const p = await v.path();
  renameSync(p, `${OUT}/${world}-1440.webm`);
}

async function keys(world) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url(world), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[data-enhanced]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const seq = [];
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    seq.push(await page.evaluate(() => {
      const a = document.activeElement;
      if (!a) return 'none';
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      const name = (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      const visible = r.bottom > 0 && r.top < innerHeight;
      return `${a.tagName.toLowerCase()}${a.type ? '[' + a.type + ']' : ''} "${name}" ${Math.round(r.width)}x${Math.round(r.height)} y=${Math.round(r.top)} outline=${cs.outlineStyle}/${cs.outlineWidth}${visible ? '' : ' OFFSCREEN'}`;
    }));
    if (i === 3 || i === 8) await page.screenshot({ path: `${OUT}/${world}-1440-focus-${i}.png` });
  }
  log.push({ world, keys: seq });
  await ctx.close();
}

for (const w of worlds) {
  if (mode === 'steps' || mode === 'all') for (const vp of VPS) await steps(w, vp);
  if (mode === 'reduced' || mode === 'all') for (const vp of VPS) await steps(w, vp, { reducedMotion: 'reduce' }, '-rm');
  if (mode === 'nojs' || mode === 'all') await steps(w, VPS[0], { javaScriptEnabled: false }, '-nojs');
  if (mode === 'keys' || mode === 'all') await keys(w);
  if (mode === 'video' || mode === 'all') await video(w);
}
writeFileSync(`${OUT}/shots-log-${mode}-${which}.json`, JSON.stringify(log, null, 2));
console.log(JSON.stringify(log, null, 1).slice(0, 4000));
await browser.close();
