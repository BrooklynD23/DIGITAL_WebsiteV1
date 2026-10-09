// DA-A: full-page capture in ≤3000px clipped bands, stitched with ffmpeg.
// Works around the repeat-tile artifact shoot.mjs shows on pages taller than ~8192 device px.
// Usage: node design-lab/scripts/da-a-fullpage.mjs <outDir> <label>
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [outDir = 'design-lab/renders/a/v1', label = 'a'] = process.argv.slice(2);
const VPS = [
  { name: 'desktop', width: 1440, height: 900, dpr: 1 },
  { name: 'tablet', width: 834, height: 1112, dpr: 1 },
  { name: 'mobile', width: 390, height: 844, dpr: 2, isMobile: true },
];
const root = join(homedir(), '.cache', 'ms-playwright');
const dir = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const browser = await chromium.launch({ executablePath: join(root, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
mkdirSync(outDir, { recursive: true });
for (const vp of VPS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.isMobile ?? false, hasTouch: vp.isMobile ?? false });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://localhost:3100/design-lab/a/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2000);
  // scroll once so in-view reveals have played
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.7) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const band = Math.floor(3000 / vp.dpr);
  const parts = [];
  for (let y = 0, i = 0; y < total; y += band, i++) {
    const h = Math.min(band, total - y);
    const p = join(outDir, `_part-${vp.name}-${i}.png`);
    await page.screenshot({ path: p, fullPage: true, clip: { x: 0, y, width: vp.width, height: h } });
    parts.push(p);
  }
  const out = join(outDir, `${label}-${vp.name}.png`);
  const args = ['-loglevel', 'error', '-y'];
  parts.forEach((p) => args.push('-i', p));
  args.push('-filter_complex', `vstack=inputs=${parts.length}`, out);
  if (parts.length === 1) execFileSync('cp', [parts[0], out]);
  else execFileSync('ffmpeg', args);
  parts.forEach((p) => rmSync(p));
  console.log(`saved ${out} (${total}px css) · console errors: ${errors.length}`, errors.slice(0, 3));
  await page.close();
}
await browser.close();
