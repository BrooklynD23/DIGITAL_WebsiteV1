// MICRO agent: in-page anchor continuity. Keyboard-activates a nav anchor, then checks where scroll and the next Tab land.
// Usage: node design-lab/scripts/micro-anchor.mjs a b c d e f
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const slug of process.argv.slice(2)) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(`${process.env.LAB_URL ?? 'http://localhost:3100'}/design-lab/${slug}/`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1500);
  const href = await page.evaluate(() => {
    const links = [...document.querySelectorAll('header a[href^="#"], nav a[href^="#"]')]
      .filter((a) => { const h = a.getAttribute('href'); const b = a.getBoundingClientRect(); return h.length > 1 && !/^#(top|main|content)/.test(h) && b.width > 0 && getComputedStyle(a).visibility !== 'hidden'; });
    const a = links[1] ?? links[0];
    if (!a) return null;
    a.setAttribute('data-anchor-test', '1');
    return a.getAttribute('href');
  });
  if (!href) { console.log(slug, 'no in-page nav anchor'); continue; }
  await page.focus('[data-anchor-test]');
  const t0 = Date.now();
  await page.keyboard.press('Enter');
  let settledAt = null; let last = -1;
  for (let i = 0; i < 40; i += 1) { await page.waitForTimeout(100); const y = await page.evaluate(() => scrollY); if (y === last && y > 0) { settledAt = Date.now() - t0; break; } last = y; }
  await page.keyboard.press('Tab');
  const res = await page.evaluate((h) => {
    const target = document.querySelector(h);
    const a = document.activeElement;
    const tb = target?.getBoundingClientRect();
    return {
      hash: location.hash, targetTop: tb ? Math.round(tb.top) : null,
      nextTab: `${a.tagName.toLowerCase()} "${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 30)}"`,
      nextTabInsideTarget: !!target && target.contains(a), nextTabTop: Math.round(a.getBoundingClientRect().top),
      scrollMarginTop: target ? getComputedStyle(target).scrollMarginTop : null,
    };
  }, href);
  console.log(slug, href, JSON.stringify({ settledMs: settledAt, ...res }));
  await page.close();
}
await browser.close();
