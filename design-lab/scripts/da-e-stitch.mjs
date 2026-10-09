// DA-E: full-page captures for pages taller than headless Chromium's ~8192px capture limit
// (shoot.mjs full-page PNGs tile/repeat past that height). Scrolls viewport by viewport and stacks the tiles.
// Sticky nav + sticky schematic stage are made static so tiles join cleanly; reduced motion so the
// static (no-JS-equivalent) layout is captured.
// Usage: node design-lab/scripts/da-e-stitch.mjs <route> <outDir> <label>
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [route = '/design-lab/e/', outDir = 'design-lab/renders/e/v1', label = 'e'] = process.argv.slice(2);
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const VPS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
      deviceScaleFactor: vp.deviceScaleFactor ?? 1,
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
    await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important} header{position:static!important} [data-schematic]{} *{animation:none!important}' });
    await page.evaluate(() => {
      document.querySelectorAll('div, aside, header').forEach((el) => {
        if (getComputedStyle(el).position === 'sticky') el.style.position = 'static';
      });
    });
    await page.waitForTimeout(800);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const tmp = join(outDir, `_tiles-${vp.name}`);
    mkdirSync(tmp, { recursive: true });
    const files = [];
    for (let y = 0, n = 0; y < total; y += vp.height, n++) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(250);
      const scrolled = await page.evaluate(() => window.scrollY);
      const f = join(tmp, `t${String(n).padStart(2, '0')}.png`);
      // last tile: clip off the overlap with the previous one
      const overlap = y - scrolled;
      await page.screenshot({ path: f, clip: { x: 0, y: overlap, width: vp.width, height: vp.height - overlap } });
      files.push(f);
    }
    const out = join(outDir, `${label}-${vp.name}-stitched.png`);
    const args = files.flatMap((f) => ['-i', f]);
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...args, '-filter_complex', `vstack=inputs=${files.length}`, out]);
    rmSync(tmp, { recursive: true, force: true });
    console.log(`saved ${out} (${total}px css, ${files.length} tiles)`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
