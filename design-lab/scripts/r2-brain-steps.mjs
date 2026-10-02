// R2 BRAIN per-viewport captures + console (errors AND warnings) for both worlds at 1440×900 and 390×844.
// Usage: node design-lab/scripts/r2-brain-steps.mjs [outDir=design-lab/renders/r2/brain/v2/steps] [--steps=12]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--')) ?? 'design-lab/renders/r2/brain/v2/steps';
const stepsWanted = Number((args.find((a) => a.startsWith('--steps=')) ?? '--steps=12').split('=')[1]);
const base = process.env.LAB_URL ?? 'http://localhost:3100';
mkdirSync(out, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const world of ['signal', 'apple']) {
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844, mobile: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const msgs = [];
    page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && msgs.push(`${m.type()}: ${m.text().slice(0, 160)}`));
    page.on('pageerror', (e) => msgs.push(`pageerror: ${String(e).slice(0, 160)}`));
    await page.goto(`${base}/design-lab/r2/${world}/brain/`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const n = Math.max(stepsWanted, Math.ceil(total / vp.h));
    for (let i = 0; i < n; i++) {
      const y = Math.round((i * (total - vp.h)) / (n - 1));
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(out, `${world}-${vp.w}-step${String(i).padStart(2, '0')}.png`) });
    }
    console.log(`${world} ${vp.w}: ${n} steps, ${(total / vp.h).toFixed(2)} vh, console: ${msgs.length ? msgs.join(' | ') : 'clean'}`);
    await ctx.close();
  }
}
await browser.close();
