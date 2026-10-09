// DA-E: print console errors for /design-lab/e at one viewport. Usage: node design-lab/scripts/da-e-errors.mjs [width]
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const width = Number(process.argv[2] ?? 1440);
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const page = await browser.newPage({ viewport: { width, height: 900 } });
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log(`[${m.type()}]`, m.text().slice(0, 600)));
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 600)));
await page.goto('http://localhost:3100/design-lab/e/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);
await browser.close();
