// R2-SIGNATURE: attribute rAF callers at rest (desktop). Usage: node design-lab/scripts/r2-sig-rafsrc.mjs <route> [scrollSel] [hoverSel]
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route, sel, hover] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const browser = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  window.__src = {}; window.__on = false;
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    if (window.__on) { const s = (new Error().stack || '').split('\n').slice(2, 4).map((l) => l.replace(/^\s+at\s+/, '').replace(/https?:\/\/[^/]+/, '').replace(/\?[^:]*/, '').slice(0, 110)).join(' <- '); window.__src[s] = (window.__src[s] || 0) + 1; }
    return orig(cb);
  };
});
const page = await ctx.newPage();
await page.goto('http://localhost:3100' + route, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1500);
if (sel) { await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel); }
if (hover) await page.hover(hover); else await page.mouse.move(2, 2);
await page.waitForTimeout(2500);
await page.evaluate(() => { window.__on = true; });
await page.waitForTimeout(2000);
const src = await page.evaluate(() => window.__src);
console.log(route, sel ?? '', hover ?? '', Object.entries(src).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${(v / 2).toFixed(0)}/s  ${k}`).join('\n'));
await browser.close();
