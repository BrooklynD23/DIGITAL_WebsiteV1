// Usage: node design-lab/scripts/da-d-section.mjs <width> <selector> <out.png>
// Element screenshot of one section of /design-lab/d (avoids full-page tiling on tall pages).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [w = '834', sel = '#join', out = 'design-lab/renders/d/v1/checks/section.png'] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const dir = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const page = await browser.newPage({ viewport: { width: Number(w), height: 1000 } });
await page.goto((process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/d/', { waitUntil: 'networkidle' });
const el = page.locator(sel);
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')));
await page.waitForTimeout(800);
await el.screenshot({ path: out });
await browser.close();
console.log('saved', out);
