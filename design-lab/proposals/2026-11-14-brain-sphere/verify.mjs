// Run from the repo root: node design-lab/proposals/2026-11-14-brain-sphere/verify.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url)), url = pathToFileURL(path.join(dir, 'sphere-proto.html')).href, img = (n) => path.join(dir, 'images', n);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/home/danny/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell' });
const errors = [];
const open = async (opts) => { const ctx = await browser.newContext(opts); const p = await ctx.newPage(); p.on('console', (m) => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', (e) => errors.push(String(e))); await p.goto(url); await p.waitForTimeout(1200); return p; };
const row = (p) => p.locator('[data-row]').first();

let p = await open({ viewport: { width: 1440, height: 900 } });
await p.evaluate(() => window.__proto.stats()); await p.waitForTimeout(3000);
const live = await p.evaluate(() => window.__proto.stats());
await p.evaluate(() => window.__proto.setPaused(true)); await p.waitForTimeout(300);
const pausedRunning = await p.evaluate(() => window.__proto.stats().running);
const still = await p.evaluate(() => window.__proto.STILL), think = await p.evaluate(() => window.__proto.TL[0].think);
await p.evaluate((t) => window.__proto.setT(t), still);
await p.screenshot({ path: img('desktop-1440.png'), fullPage: true });
for (const d of ['B', 'C', 'A']) { await p.evaluate((d) => window.__proto.setDir(d), d); await row(p).screenshot({ path: img(`row-dark-${d}.png`) }); }
await p.locator('[data-row]').nth(1).screenshot({ path: img('row-light-A.png') });
// recommended direction over time: think, call out, at the tool, back + check; then the held call
const frames = { '1-think': 700, '2-call-out': think + 300, '3-at-tool': think + 620, '4-check': think + 1300 + 250, '5-held': await p.evaluate(() => { const o = window.__proto.TL[3]; return o.start + o.think + 1300 + 400; }) };
for (const [n, t] of Object.entries(frames)) { await p.evaluate((t) => window.__proto.setT(t), t); await row(p).screenshot({ path: img(`A-${n}.png`) }); }
// heavy-load frame cost: 60 forced paints of every canvas
const forced = await p.evaluate(() => { window.__proto.stats(); for (let i = 0; i < 60; i++) window.__proto.setT(i * 400); return window.__proto.stats(); });
const overflow1440 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
await p.context().close();

p = await open({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 });
await p.evaluate(() => window.__proto.setPaused(true)); await p.evaluate((t) => window.__proto.setT(t), still);
await p.screenshot({ path: img('phone-375.png'), fullPage: true });
const overflow375 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
await p.context().close();

p = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reduced = await p.evaluate(() => ({ ...window.__proto.stats(), pauseShown: getComputedStyle(document.querySelector('.pause')).display }));
await row(p).screenshot({ path: img('reduced-motion-A.png') });
await p.context().close();
await browser.close();
console.log(JSON.stringify({ errors, live, pausedRunning, forced, overflow1440, overflow375, reduced }, null, 1));
