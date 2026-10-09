// W2-CRIT-SYSTEM: CineClip behaviour in a real browser on the Apple pages that use it.
// Usage: LAB_URL=http://localhost:3100 node design-lab/scripts/r2-crit-system-cine.mjs
// Per page: (a) 1440 default motion: per clip state at load, after scrolling it into view, and rAF callbacks
// attributed to CineClip while scrubbing vs at rest; (b) 1440 reduced motion: video elements present? poster shown?
// (c) 390: poster/video aspect actually picked. Output: design-lab/renders/r2/crit/system/cine.json
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.LAB_URL ?? 'http://localhost:3100';
const OUT = 'design-lab/renders/r2/crit/system';
mkdirSync(OUT, { recursive: true });
const PAGES = ['/design-lab/r2/apple/', '/design-lab/r2/apple/sidekick/', '/design-lab/r2/apple/shades/', '/design-lab/r2/apple/brain/'];
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);

const INIT = () => {
  const w = window;
  w.__raf = { on: false, cine: 0, other: 0 };
  const orig = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => {
    const st = new Error().stack || '';
    const cine = /CineClip/.test(st);
    const cursor = /CursorProvider/.test(st);
    return orig((t) => { if (w.__raf.on && !cursor) { if (cine) w.__raf.cine += 1; else w.__raf.other += 1; } cb(t); });
  };
};
const clips = () => [...document.querySelectorAll('[data-cine]')].map((el) => {
  const v = el.querySelector('video'); const img = el.querySelector('img'); const r = el.getBoundingClientRect();
  return {
    name: el.getAttribute('data-cine'), mode: el.getAttribute('data-mode'), aspectProp: el.getAttribute('data-aspect'), status: el.getAttribute('data-status'),
    top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width),
    poster: img ? (img.currentSrc || img.src).split('/').pop() : null, posterLoading: img?.loading,
    video: v ? { src: (v.currentSrc || '').split('/').pop(), preload: v.preload, readyState: v.readyState, paused: v.paused, t: Number(v.currentTime.toFixed(2)), visible: v.dataset.visible } : null,
    button: el.querySelector('button')?.getAttribute('aria-label') ?? null,
  };
});
async function count(page, fn) {
  await page.evaluate(() => { window.__raf.on = true; window.__raf.cine = 0; window.__raf.other = 0; });
  await fn();
  return page.evaluate(() => { window.__raf.on = false; return { cine: window.__raf.cine, other: window.__raf.other }; });
}

const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const out = [];
for (const path of PAGES) {
  const rec = { path };
  // (a) default motion, 1440
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2000);
    rec.load = await page.evaluate(clips);
    rec.perClip = [];
    for (const c of rec.load) {
      const entry = { name: c.name, mode: c.mode };
      const target = Math.max(0, c.top - 450 + c.h / 2);
      // approach in small wheel steps (scrub sees a moving progress)
      entry.rafWhileScrolling = await count(page, async () => {
        const from = await page.evaluate(() => scrollY);
        const n = 12;
        for (let i = 1; i <= n; i += 1) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), from + ((target - from) * i) / n); await page.waitForTimeout(90); }
      });
      if (c.mode === 'scrub') {
        const t0 = await page.evaluate((nm) => document.querySelector(`[data-cine="${nm}"] video`)?.currentTime ?? null, c.name);
        entry.rafScrubbing = await count(page, async () => { for (let i = 0; i < 10; i += 1) { await page.mouse.wheel(0, 120); await page.waitForTimeout(80); } });
        const t1 = await page.evaluate((nm) => document.querySelector(`[data-cine="${nm}"] video`)?.currentTime ?? null, c.name);
        entry.scrubTime = [t0, t1];
      } else {
        await page.waitForTimeout(800);
        entry.afterEnter = (await page.evaluate(clips)).find((x) => x.name === c.name);
        await page.waitForTimeout(6000);
      }
      await page.waitForTimeout(1200);
      entry.rafAtRest = await count(page, () => page.waitForTimeout(2000));
      entry.settled = (await page.evaluate(clips)).find((x) => x.name === c.name);
      rec.perClip.push(entry);
    }
    await ctx.close();
  }
  // (b) reduced motion, 1440
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
    await page.waitForTimeout(1500);
    rec.reduced = await page.evaluate(clips);
    await ctx.close();
  }
  // (c) 390
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
    await page.waitForTimeout(1500);
    rec.mobile = await page.evaluate(clips);
    await ctx.close();
  }
  out.push(rec);
  console.log(path, JSON.stringify(rec.perClip.map((c) => ({ n: c.name, m: c.mode, scroll: c.rafWhileScrolling, scrub: c.rafScrubbing, rest: c.rafAtRest, t: c.scrubTime, st: c.settled?.status }))));
}
await browser.close();
writeFileSync(join(OUT, 'cine.json'), JSON.stringify(out, null, 1));
console.log('wrote cine.json');
