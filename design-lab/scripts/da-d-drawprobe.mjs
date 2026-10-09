// Probe the How-rail draw-on order on a fresh 1440 page: first path (rail line) vs circles 1 and 6.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const dir = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto((process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/d/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const before = await page.evaluate(() => getComputedStyle(document.querySelector('#how svg[data-sketch] path')).strokeDashoffset);
await page.evaluate(() => document.getElementById('how').scrollIntoView());
const t0 = Date.now();
const rows = [];
for (const at of [200, 600, 1200, 2200]) {
  await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
  rows.push(await page.evaluate((ms) => {
    const svg = document.querySelector('#how svg[data-sketch]');
    const ps = [...svg.querySelectorAll('path:not([data-fill])')];
    const v = (p) => Number.parseFloat(getComputedStyle(p).strokeDashoffset).toFixed(2);
    return `${ms}ms rail=${v(ps[0])} c1=${v(ps[1])} c6=${v(ps[ps.length - 1])}`;
  }, at));
}
console.log(`before scroll rail=${before}\n` + rows.join('\n'));
await browser.close();
