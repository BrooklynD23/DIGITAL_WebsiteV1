// Usage: node design-lab/scripts/r2-home-frames.mjs <outDir> [round]
// Home (both worlds): viewport frames at scroll steps (pin scrub states), console errors, reduced-motion + no-JS first views.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [outDir = 'design-lab/renders/r2/home/v1'] = process.argv.slice(2);
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
    const pinH = await page.evaluate(() => {
      const el = document.querySelector('main > section');
      return el ? { top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight } : null;
    });
    const span = pinH ? pinH.h - innerHeightOf(vp) : 0;
    const steps = [0, 0.3, 0.55, 0.95];
    for (const p of steps) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(pinH.top + span * p) - (p === 0 ? pinH.top : 0));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${outDir}/${world}-${vp.name}-pin${String(Math.round(p * 100)).padStart(2, '0')}.png` });
    }
    // sections after the pin, one viewport each
    const after = await page.evaluate(() => [...document.querySelectorAll('main > section')].slice(1).map((s) => s.getBoundingClientRect().top + scrollY));
    let i = 0;
    for (const y of after) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y - 52);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${outDir}/${world}-${vp.name}-s${++i}.png` });
    }
    await ctx.close();
  }
  for (const mode of ['reduced', 'nojs']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'nojs' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${world}@${mode}: ${String(e).slice(0, 200)}`));
    await page.goto(`${base}/design-lab/r2/${world}/`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${outDir}/${world}-1440-${mode}.png` });
    await ctx.close();
  }
}
function innerHeightOf(vp) { return vp.viewport.height; }
await browser.close();
console.log(errors.length ? `console errors (${errors.length}):\n${errors.join('\n')}` : 'console errors: 0');
