// DA-E: viewport frames of the DG-001 scrub at 3 progress points (desktop). Usage: node design-lab/scripts/da-e-scrub.mjs <outDir>
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs'; import { homedir } from 'node:os'; import { join } from 'node:path';
const outDir = process.argv[2] ?? 'design-lab/renders/e/v2';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const browser = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100/design-lab/e/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
for (const p of [0.08, 0.5, 0.95]) {
  await page.evaluate((prog) => {
    const list = document.querySelector('[data-steps]');
    const top = list.getBoundingClientRect().top + window.scrollY;
    const y = top + prog * list.getBoundingClientRect().height - window.innerHeight * 0.65;
    window.scrollTo({ top: y, behavior: 'instant' });
  }, p);
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, `scrub-${Math.round(p * 100)}.png`) });
}
await browser.close();
