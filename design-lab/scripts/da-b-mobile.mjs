// DA-B: mobile full-page capture at DPR 1 (shoot.mjs at DPR 2 exceeds Chromium's 16384px capture limit on long pages).
// Usage: node design-lab/scripts/da-b-mobile.mjs <route> <out.png>
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route = '/design-lab/b', out = 'design-lab/renders/b/v1/b-mobile-dpr1.png'] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto('http://localhost:3100' + route, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.screenshot({ path: out, fullPage: true });
console.log(`saved ${out} (${h}px tall, ${errors.length} console errors)`);
await browser.close();
