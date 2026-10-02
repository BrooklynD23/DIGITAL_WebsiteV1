// Usage: node design-lab/scripts/kicad-boards-check.mjs
// Loads /design-lab/r2/boards/ at 1440 and 390, drags the explode slider, and reports console errors,
// horizontal overflow and the measured SVG outline aspect ratios (vs. KiCad board sizes).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell });
let failed = false;
try {
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(`${base}/design-lab/r2/boards/`, { waitUntil: 'networkidle', timeout: 90000 });
    const slider = page.locator('input[type=range]').first();
    await slider.fill('100');
    await page.locator('button[aria-pressed]').nth(2).click();
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      boards: [...document.querySelectorAll('svg[data-board]:not([data-iso])')].slice(0, 2).map((svg) => {
        const edge = svg.querySelector('[data-layer="edge"] path');
        const r = edge.getBoundingClientRect();
        return { id: svg.dataset.board, aspect: +(r.width / r.height).toFixed(3) };
      }),
      explodeOut: document.querySelector('output')?.textContent,
    }));
    console.log(vp.width, JSON.stringify(info), `errors=${errors.length}`, errors.slice(0, 3).join(' | '));
    if (errors.length || info.overflow > 0) failed = true;
    await page.close();
  }
} finally {
  await browser.close();
}
console.log('expected aspect: carrier 49/41 = 1.195, fingerprint 22.81/26.12 = 0.873');
process.exit(failed ? 1 : 0);
