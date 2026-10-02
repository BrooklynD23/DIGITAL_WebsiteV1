// W2-CRIT-HOME: reproduce the Signal timebase keyboard path; log hero state after each ArrowRight.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100/design-lab/r2/signal/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForSelector('[data-enhanced]'); await page.waitForTimeout(1000);
const state = () => page.evaluate(() => {
  const sec = document.querySelector('[data-enhanced]');
  const big = [...document.querySelectorAll('[class*="stageBigItem"]')].map((e) => (e.dataset.active ? 'A:' : '') + e.textContent.slice(0, 9) + ':' + getComputedStyle(e).visibility);
  const div = [...document.querySelectorAll('[class*="divisions"] li')].findIndex((l) => l.dataset.active);
  const orbs = [...document.querySelectorAll('[class*="orbStack"] > *')].map((o) => o.style.opacity);
  return { y: Math.round(scrollY), phase: sec.dataset.phase, p: getComputedStyle(sec).getPropertyValue('--p'), read: document.querySelector('[class*="cursorRead"]').textContent, divActive: div, orbs: orbs.join(','), big: big.join(' | '), stageBigOpacity: getComputedStyle(document.querySelector('[class*="stageBig"]')).opacity };
});
await page.locator('input[type=range]').focus();
console.log('focus', JSON.stringify(await state()));
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1800);
  console.log('right', i + 1, JSON.stringify(await state()));
}
await page.keyboard.press('Home'); await page.waitForTimeout(1800);
console.log('home', JSON.stringify(await state()));
await browser.close();
