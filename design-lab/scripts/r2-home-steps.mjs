// Usage: node design-lab/scripts/r2-home-steps.mjs <outDir>
// Home (both worlds): viewport captures every 0.9 viewport from the top (≤16 steps) at 1440×900 and 390×844,
// after a natural wheel scroll so scroll drives run; plus console errors. For the finish reviewer.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [outDir = 'design-lab/renders/r2/home/v2/steps'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const VPS = [
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: '390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const errors = [];
for (const world of ['signal', 'apple']) {
  for (const vp of VPS) {
    const ctx = await browser.newContext(vp);
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`${world}@${vp.name}: ${m.text().slice(0, 200)}`));
    page.on('pageerror', (e) => errors.push(`${world}@${vp.name}: ${String(e).slice(0, 200)}`));
    await page.goto(`${base}/design-lab/r2/${world}/`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(1500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = vp.viewport.height;
    let k = 0;
    for (let y = 0; y < total && k < 16; y += Math.round(vh * 0.9), k += 1) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${outDir}/${world}-${vp.name}-${String(k).padStart(2, '0')}.png` });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? `console errors (${errors.length}):\n${errors.join('\n')}` : 'console errors: 0');
