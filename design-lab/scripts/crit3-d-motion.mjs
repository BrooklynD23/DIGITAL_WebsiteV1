// CRIT-3: record a scroll + interaction pass of /design-lab/d (webm) and a real-viewport
// check of the translucent sticky nav over the dark Join band at 390.
// Usage: node design-lab/scripts/crit3-d-motion.mjs [outDir]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/critiques/crit3-d';
const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/d/';
mkdirSync(outDir, { recursive: true });

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  for (const d of readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: shell() });
try {
  // 1) video at 1440
  const vdir = join(outDir, 'video-tmp');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: vdir, size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.hover('a[href="#join"] >> nth=1').catch(() => {});
  await page.waitForTimeout(600);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 120) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(90);
    const seats = await page.evaluate(() => document.getElementById('seats')?.getBoundingClientRect().top ?? 9999);
    if (seats > 0 && seats < 150) break;
  }
  await page.waitForTimeout(800);
  for (const i of [2, 4, 6]) {
    await page.locator('input[name="d-seat"]').nth(i).locator('xpath=..').click();
    await page.waitForTimeout(700);
  }
  for (let k = 0; k < 20; k++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(800);
  const vid = page.video();
  await ctx.close();
  if (vid) {
    const p = await vid.path();
    renameSync(p, join(outDir, 'd-motion-1440.webm'));
  }

  // 2) real viewport at 390 with join step 2 under the nav
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await m.newPage();
  await mp.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await mp.evaluate(() => {
    const el = document.querySelector('#join ol li:nth-child(2)');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
  });
  await mp.waitForTimeout(800);
  await mp.screenshot({ path: join(outDir, 'mob-nav-over-join.png'), clip: { x: 0, y: 0, width: 390, height: 200 } });
  await m.close();
} finally {
  await browser.close();
}
console.log('done');
