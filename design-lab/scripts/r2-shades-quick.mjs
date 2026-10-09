// SHADES quick probe: viewport shots at given scroll offsets + console errors.
// Usage: node design-lab/scripts/r2-shades-quick.mjs <route> <outPrefix> [w] [h] [y1,y2,...]
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route, out, w = '1440', h = '900', scrollY = '0'] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 300)));
p.on('pageerror', (e) => errs.push(String(e).slice(0, 300)));
await p.goto('http://localhost:3100' + route, { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(3500);
for (const y of scrollY.split(',')) {
  await p.evaluate((t) => window.scrollTo(0, t), +y);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}-${y}.png` });
}
console.log('errors', errs.length, errs.join('\n'));
await b.close();
