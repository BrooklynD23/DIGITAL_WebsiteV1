// W2-CRIT-SIDEKICK: locate the Signal teardown frame stall and test whether it repeats on a second pass.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os'; import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const route = process.argv[2] ?? '/design-lab/r2/signal/sidekick/';
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(`http://localhost:3100${route}`, { waitUntil: 'networkidle', timeout: 90000 });
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (const pass of [1, 2, 3]) {
  const slow = [];
  const ys = pass === 2 ? [...Array(Math.ceil(H / 48) + 1).keys()].map((i) => i * 48).reverse() : [...Array(Math.ceil(H / 48) + 1).keys()].map((i) => i * 48);
  for (const y of ys) {
    const ms = await p.evaluate(async (t) => { const s = performance.now(); scrollTo({ top: t, behavior: 'instant' }); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return performance.now() - s; }, y);
    if (ms > 120) slow.push([y, Math.round(ms), await p.evaluate(() => [...document.querySelectorAll('[data-step]')].findIndex((e) => e.dataset.active === 'true'))]);
  }
  console.log('pass', pass, pass === 2 ? '(up)' : '(down)', 'slow frames >120ms:', JSON.stringify(slow));
}
await b.close();
