// R2-SIGNATURE: viewport frames along the scroll of the two production project pages + rAF at rest + words/viewport.
// Usage: node design-lab/scripts/r2-sig-prod.mjs [outDir]
import { chromium } from 'playwright';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const outDir = process.argv[2] ?? 'design-lab/round2/references/signature/prod';
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const browser = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell'), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const RAF = () => { window.__raf = 0; const o = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => o((t) => { window.__raf += 1; cb(t); }); };
const words = (page) => page.evaluate(() => {
  const vh = innerHeight, vw = innerWidth; let n = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = w.nextNode(); t; t = w.nextNode()) {
    const s = t.textContent.trim(); if (!s) continue;
    let el = t.parentElement, op = 1; for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
    if (op < 0.2 || getComputedStyle(el).visibility === 'hidden') continue;
    const r = document.createRange(); r.selectNodeContents(t); const b = r.getBoundingClientRect();
    if (!b.width || b.bottom < 0 || b.top > vh || b.right < 0 || b.left > vw) continue;
    n += s.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
  }
  return n;
});
const out = {};
const PAGES = [
  { tag: 'phone', route: '/projects/modular-smartphone/', fr: [0, 0.08, 0.16, 0.25, 0.35, 0.45, 0.55, 0.65, 0.8, 0.95], pre: 6000 },
  { tag: 'glasses', route: '/projects/smart-reading/', fr: [0, 0.1, 0.25, 0.4, 0.47, 0.55, 0.65, 0.78, 0.9, 0.98], pre: 4000 },
];
for (const vp of [{ t: '1440', w: 1440, h: 900 }, { t: '390', w: 390, h: 844, m: true }]) {
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m, deviceScaleFactor: vp.m ? 2 : 1 });
    await ctx.addInitScript(RAF);
    const page = await ctx.newPage();
    await page.goto('http://localhost:3100' + p.route, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(p.pre);
    await page.mouse.move(3, 3);
    const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(2000); const b = await page.evaluate(() => window.__raf);
    const m = { rafRestTop: Math.round((b - a) / 2), frames: [] };
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let i = 0; i < p.fr.length; i++) {
      const y = Math.round(H * p.fr[i]);
      await page.evaluate((yy) => { const l = window.__lenis; if (l) l.scrollTo(yy, { immediate: true }); else window.scrollTo({ top: yy, behavior: 'instant' }); }, y);
      await page.waitForTimeout(1600);
      const f = `${p.tag}-${vp.t}-f${String(i).padStart(2, '0')}-${Math.round(p.fr[i] * 100)}.png`;
      await page.screenshot({ path: join(outDir, f) });
      m.frames.push({ f, frac: p.fr[i], words: await words(page) });
    }
    const c = await page.evaluate(() => window.__raf); await page.waitForTimeout(2000); const e = await page.evaluate(() => window.__raf);
    m.rafRestEnd = Math.round((e - c) / 2);
    out[`${p.tag}-${vp.t}`] = m;
    await ctx.close();
  }
}
writeFileSync(join(outDir, 'prod-metrics.json'), JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out)) console.log(k, 'rafTop', v.rafRestTop, 'rafEnd', v.rafRestEnd, 'words', v.frames.map((f) => f.words).join(','));
await browser.close();
