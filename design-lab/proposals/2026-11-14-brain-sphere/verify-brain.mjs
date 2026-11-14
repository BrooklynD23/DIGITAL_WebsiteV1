// Run from the repo root: node design-lab/proposals/2026-11-14-brain-sphere/verify-brain.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url)), url = pathToFileURL(path.join(dir, 'brain-page-proto.html')).href, img = (n) => path.join(dir, 'images', n);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/home/danny/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell' });
const errors = [], out = {};
const open = async (opts) => { const ctx = await browser.newContext(opts); const p = await ctx.newPage(); p.on('console', (m) => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', (e) => errors.push(String(e))); await p.goto(url); await p.waitForTimeout(1000); return p; };
const sec = (p) => p.locator('#layers');
const E = (p, fn, a) => p.evaluate(fn, a);

for (const [name, vp] of [['1440', { width: 1440, height: 900 }], ['375', { width: 375, height: 667 }]]) {
  const p = await open({ viewport: vp, deviceScaleFactor: name === '375' ? 2 : 1 });
  for (const lay of ['cols', 'switch']) {
    await E(p, (l) => { window.__proto.setPaused(false); window.__proto.setLayout(l); window.__proto.setDir('A'); }, lay);
    await sec(p).scrollIntoViewIfNeeded(); await p.evaluate(() => document.getElementById('layers').scrollIntoView()); await p.waitForTimeout(400);
    await E(p, () => window.__proto.stats()); await p.waitForTimeout(2000);
    const live = await E(p, () => ({ ...window.__proto.stats(), canvases: window.__proto.visible() }));
    await E(p, () => window.__proto.setPaused(true)); await p.waitForTimeout(200);
    const still = await E(p, () => window.__proto.STILL); await E(p, (t) => window.__proto.setT(t), still);
    await p.screenshot({ path: img(`brain-${name}-${lay}-viewport.png`) });
    await sec(p).screenshot({ path: img(`brain-${name}-${lay}.png`) });
    if (lay === 'switch') for (const d of ['B', 'C']) { await E(p, (d) => window.__proto.setDir(d), d); await E(p, (t) => window.__proto.setT(t), still); await sec(p).screenshot({ path: img(`brain-${name}-switch-${d}.png`) }); }
    out[`${name}-${lay}`] = { avgMs: +live.avgMs.toFixed(2), maxMs: +live.maxMs.toFixed(2), frames: live.frames, canvases: live.canvases, pausedRunning: await E(p, () => window.__proto.stats().running), overflowPx: await E(p, () => document.documentElement.scrollWidth - innerWidth) };
  }
  if (name === '1440') {
    await E(p, () => { window.__proto.setLayout('cols'); window.__proto.setDir('A'); });
    const t = await E(p, () => { const o = window.__proto.TL[0]; return { held: o.think + 4 * 1300 + 600, think: 800, check: o.think + 1300 + 200 }; });
    for (const [n, v] of Object.entries(t)) { await E(p, (v) => window.__proto.setT(v), v); await sec(p).screenshot({ path: img(`brain-1440-cols-${n}.png`) }); }
    await p.screenshot({ path: img('brain-1440-fullpage.png'), fullPage: true });
    // off screen: scroll to the top, the loop must stop
    await p.setViewportSize({ width: 1440, height: 300 }); await E(p, () => { window.__proto.setPaused(false); scrollTo(0, 0); }); await p.waitForTimeout(500);
    out.offscreen = await E(p, () => ({ canvases: window.__proto.visible(), running: window.__proto.stats().running }));
    const small = await E(p, () => [...document.querySelectorAll('#layers button')].filter((b) => b.offsetParent && (b.offsetWidth < 44 || b.offsetHeight < 44)).length);
    out.targetsUnder44 = small;
  }
  await p.context().close();
}
const p = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.evaluate(() => document.getElementById('layers').scrollIntoView()); await p.waitForTimeout(400);
out.reduced = await p.evaluate(() => ({ running: window.__proto.stats().running, pause: getComputedStyle(document.getElementById('pause')).display }));
await sec(p).screenshot({ path: img('brain-reduced-motion.png') });
await browser.close();
console.log(JSON.stringify({ errors, ...out }));
