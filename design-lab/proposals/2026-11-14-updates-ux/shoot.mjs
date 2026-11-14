// Screenshots the prototype. Run from the repo root: node design-lab/proposals/2026-11-14-updates-ux/shoot.mjs
import { chromium } from '../../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(dir, 'updates-ux-proto.html');
const browser = await chromium.launch({ executablePath: '/home/danny/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell' });
for (const [name, width, height] of [['d', 1440, 900], ['m', 375, 667]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const view of ['index', 'post']) {
    await page.goto(`${url}#${view}`);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `${name}-${view}-fold.png`) });
    await page.screenshot({ path: path.join(dir, `${name}-${view}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, view, 'overflow-x px:', overflow, 'errors:', errors.length ? errors : 'none');
  }
  await page.close();
}
await browser.close();
