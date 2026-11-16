// Captures README screenshots from a live site.
// Usage: node docs/readme/capture.mjs [baseUrl]
// Default baseUrl: https://digitalcpp.vercel.app
// Writes JPEGs next to this script (docs/readme/). Needs playwright + chromium:
//   npx playwright install chromium
import { chromium } from 'playwright';
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = (process.argv[2] || 'https://digitalcpp.vercel.app').replace(/\/$/, '');
const OUT = dirname(fileURLToPath(import.meta.url));
const MAX_BYTES = 250 * 1024;
const QUALITIES = [70, 60, 50];
const SETTLE_MS = 1500;

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

const SHOTS = [
  { file: 'home.jpg', path: '/', viewport: DESKTOP },
  { file: 'sidekick.jpg', path: '/projects/sidekick/', viewport: DESKTOP },
  { file: 'shades.jpg', path: '/projects/shades/', viewport: DESKTOP },
  { file: 'brain.jpg', path: '/projects/brain/', viewport: DESKTOP },
  { file: 'updates.jpg', path: '/updates/', viewport: DESKTOP },
  { file: 'about.jpg', path: '/about/', viewport: DESKTOP },
  { file: 'updates-dark.jpg', path: '/updates/', viewport: DESKTOP, dark: true },
  { file: 'home-phone.jpg', path: '/', viewport: PHONE, dpr: 1 },
];

async function captureOne(browser, shot) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: shot.dpr ?? 1,
  });
  try {
    if (shot.dark) {
      await context.addInitScript(() => {
        try {
          localStorage.setItem('r2-theme', 'dark');
        } catch {
          /* storage blocked: capture light theme instead */
        }
      });
    }
    const page = await context.newPage();
    await page.goto(BASE + shot.path, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForTimeout(SETTLE_MS);
    const target = join(OUT, shot.file);
    let size = 0;
    for (const quality of QUALITIES) {
      await page.screenshot({ path: target, type: 'jpeg', quality, fullPage: false });
      size = statSync(target).size;
      if (size <= MAX_BYTES) break;
    }
    return { file: shot.file, bytes: size };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();
const failures = [];
try {
  for (const shot of SHOTS) {
    try {
      const { file, bytes } = await captureOne(browser, shot);
      const flag = bytes > MAX_BYTES ? ' (over 250 KB at quality 50)' : '';
      console.log(`ok   ${file.padEnd(16)} ${(bytes / 1024).toFixed(1)} KB${flag}`);
    } catch (error) {
      failures.push(shot.file);
      console.error(`FAIL ${shot.file} (${shot.path}): ${error.message}`);
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(`${failures.length} of ${SHOTS.length} captures failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log(`done: ${SHOTS.length} images written to ${OUT} from ${BASE}`);
