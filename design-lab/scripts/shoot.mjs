// Usage: node design-lab/scripts/shoot.mjs <route> <outDir> [label] [--viewport-only] [--wait=ms] [--prewait=ms]
// Captures desktop (1440), tablet (834) and mobile (390) screenshots of http://localhost:3100<route>.
// Full-page by default; --viewport-only captures just the first screen (useful for heroes / WebGL).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [route = '/', outDir = 'design-lab/renders/tmp', label = 'shot', ...flags] = process.argv.slice(2);
const viewportOnly = flags.includes('--viewport-only');
const waitFlag = flags.find((f) => f.startsWith('--wait='));
const settleMs = waitFlag ? Number(waitFlag.split('=')[1]) : 1500;
// Some pages arm their reveal observers after an intro delay (home: 2.1s), so wait before the scroll pass.
const preFlag = flags.find((f) => f.startsWith('--prewait='));
const preScrollMs = preFlag ? Number(preFlag.split('=')[1]) : 2500;
const base = process.env.LAB_URL ?? 'http://localhost:3100';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: findHeadlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
      deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
    if (!viewportOnly) {
      await page.waitForTimeout(preScrollMs);
      // Scroll through once so IntersectionObserver / scroll-triggered reveals fire before capture.
      // `html { scroll-behavior: smooth }` would make each scrollTo animate and stall partway, so force instant jumps.
      await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 150));
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    await page.waitForTimeout(settleMs);
    const file = join(outDir, `${label}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: !viewportOnly });
    console.log(`saved ${file}${errors.length ? `  (${errors.length} console errors: ${errors.slice(0, 3).join(' | ')})` : ''}`);
    await page.close();
  }
} finally {
  await browser.close();
}
