// W2-CRIT-SIDEKICK: CineClip scrub check on /design-lab/r2/apple/sidekick/ (sidekick-explode).
// 1) rAF at rest parked mid-pin (25/50/75%), 2) scrub tracking: during a steady wheel pass through the pin, sample
// target progress vs video.currentTime each 50ms and count rAF per second while scrolling, 3) seek latency.
// Usage: node design-lab/scripts/r2-crit-sidekick-scrub.mjs
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  const w = window;
  w.__raf = { on: false, n: 0 };
  const orig = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => {
    const cursor = /CursorProvider/.test(new Error().stack || '');
    return orig((t) => {
      if (w.__raf.on && !cursor) w.__raf.n += 1;
      cb(t);
    });
  };
});
const page = await ctx.newPage();
await page.goto(`${base}/design-lab/r2/apple/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
await sleep(1500);
const geo = await page.evaluate(() => {
  const t = document.querySelector('#teardown > div');
  const r = t.getBoundingClientRect();
  return { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight };
});
const out = { geo, rest: [], track: [], seeks: 0 };
// Approach the pin and let the video load.
await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), geo.top - 900);
await sleep(2500);
await page.evaluate(() => {
  const v = document.querySelector('[data-cine="sidekick-explode"] video');
  window.__seeks = 0;
  window.__seekMs = [];
  if (v) {
    let s0 = 0;
    v.addEventListener('seeking', () => { window.__seeks += 1; s0 = performance.now(); });
    v.addEventListener('seeked', () => window.__seekMs.push(performance.now() - s0));
  }
});
// Steady wheel through the pin, sampling.
const travel = geo.h - geo.vh;
await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), geo.top - 50);
await sleep(600);
await page.evaluate(() => { window.__raf.n = 0; window.__raf.on = true; });
const t0 = Date.now();
for (let y = 0; y < travel + 100; y += 40) {
  await page.mouse.wheel(0, 40);
  await sleep(25);
  const s = await page.evaluate(({ top, h, vh }) => {
    const v = document.querySelector('[data-cine="sidekick-explode"] video');
    const p = Math.min(1, Math.max(0, (window.scrollY - top) / (h - vh)));
    return { p: +p.toFixed(3), ct: v ? +(v.currentTime / (v.duration || 1)).toFixed(3) : null, vis: v?.dataset.visible };
  }, geo);
  out.track.push(s);
}
const dur = (Date.now() - t0) / 1000;
out.scrollRafPerSec = +(await page.evaluate(() => window.__raf.n) / dur).toFixed(1);
out.seeks = await page.evaluate(() => window.__seeks);
out.seekMs = await page.evaluate(() => {
  const a = window.__seekMs.slice().sort((x, y) => x - y);
  return a.length ? { n: a.length, p50: Math.round(a[a.length >> 1]), p90: Math.round(a[Math.floor(a.length * 0.9)]), max: Math.round(a[a.length - 1]) } : null;
});
const lags = out.track.filter((s) => s.ct !== null).map((s) => Math.abs(s.p - s.ct));
out.lag = { mean: +(lags.reduce((a, b) => a + b, 0) / (lags.length || 1)).toFixed(3), max: +Math.max(...lags).toFixed(3) };
for (const f of [0.25, 0.5, 0.75]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(geo.top + travel * f));
  await sleep(1500);
  await page.evaluate(() => { window.__raf.n = 0; window.__raf.on = true; });
  await sleep(3000);
  const n = await page.evaluate(() => { window.__raf.on = false; return window.__raf.n; });
  await page.screenshot({ path: `design-lab/renders/r2/crit/sidekick/apple-pin-${Math.round(f * 100)}.png` });
  out.rest.push({ at: f, rafAtRest: n });
}
writeFileSync('design-lab/renders/r2/crit/sidekick/scrub-report.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify({ geo: out.geo, rest: out.rest, scrollRafPerSec: out.scrollRafPerSec, seeks: out.seeks, seekMs: out.seekMs, lag: out.lag, samples: out.track.length }, null, 1));
await browser.close();
