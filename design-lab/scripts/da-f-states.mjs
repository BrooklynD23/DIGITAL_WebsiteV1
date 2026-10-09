// DA-F: no-JS render + "signed" state captures for /design-lab/f
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const url = 'http://localhost:3100/design-lab/f/';
const out = process.env.F_OUT ?? 'design-lab/renders/f/v2';
const browser = await chromium.launch({ executablePath: shell });
// no-JS
let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, deviceScaleFactor: 1 });
let page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.screenshot({ path: `${out}/f-nojs-mobile.png`, fullPage: true });
const text = await page.locator('[data-lab-f]').innerText();
console.log('no-JS: DG-001', text.includes('DG-001'), '· Thursday', text.includes('Claim it in person'), '· seats', (text.match(/^Ask$/gm) || []).length);
await ctx.close();
// signed state, desktop
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.fill('#f-sign', 'Danny');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/f-signed-hero.png` });
await page.locator('[data-record="dg-001"] li').nth(1).getByRole('button').click();
await page.waitForTimeout(600);
await page.locator('[data-record="dg-001"] li').nth(1).hover();
await page.locator('[data-record="dg-001"] li').first().scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, 260));
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/f-signed-bench.png` });
for (const [sel, name] of [['#sheet', 'sheet'], ['[data-lab-f] footer', 'footer']]) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/f-signed-${name}.png` });
}
await ctx.close();
await browser.close();
