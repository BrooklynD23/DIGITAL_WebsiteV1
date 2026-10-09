import { chromium } from 'playwright';
import { readdirSync } from 'node:fs'; import { homedir } from 'node:os'; import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const browser = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { window.__st = {}; const o = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { const st = (new Error().stack ?? '').split('\n').slice(2, 5).map(l => l.trim().replace(/\(.*\/(_next|node_modules)\//, '(').slice(0, 110)).join(' < '); window.__st[st] = (window.__st[st] ?? 0) + 1; return o(cb); }; });
const page = await ctx.newPage();
await page.goto('http://localhost:3100/design-lab/e/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.mouse.move(700, 450);
for (let k = 0; k < 15; k++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(40); }
await page.waitForTimeout(2500);
await page.evaluate(() => { window.__st = {}; });
await page.waitForTimeout(2000);
console.log(JSON.stringify(await page.evaluate(() => window.__st), null, 1));
await browser.close();
