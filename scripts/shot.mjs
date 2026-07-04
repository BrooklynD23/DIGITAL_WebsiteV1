// scripts/shot.mjs — deterministic scroll screenshots.
// Usage: node scripts/shot.mjs <url> <outPrefix> <frac1> [frac2 ...]
// Requires: npm i --no-save playwright && npx playwright install chromium
import { chromium } from 'playwright';

const [url, prefix, ...fracs] = process.argv.slice(2);
if (!url || !prefix || fracs.length === 0) {
  console.error('usage: node scripts/shot.mjs <url> <outPrefix> <frac...>');
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // R3F mount + FBX load
for (const f of fracs) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = max * Number(frac);
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, f);
  await page.waitForTimeout(1200); // let 60fps lerps settle
  await page.screenshot({ path: `${prefix}-${f}.png` });
  console.log(`${prefix}-${f}.png`);
}
await browser.close();
