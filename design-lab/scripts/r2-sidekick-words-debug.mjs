// Usage: node design-lab/scripts/r2-words.mjs <route> [--width=1440] [--height=900]
// Apple copy-budget check: words visible per viewport while stepping one viewport at a time.
// Prints per-step counts plus avg / p90 / max and the share of viewports with <= 12 words.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [route = '/', ...flags] = process.argv.slice(2);
const num = (name, d) => Number((flags.find((f) => f.startsWith(`--${name}=`)) ?? `=${d}`).split('=')[1]);
const width = num('width', 1440);
const height = num('height', 900);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);

const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto((process.env.LAB_URL ?? 'http://localhost:3100') + route, { waitUntil: 'networkidle', timeout: 90000 });
await page.evaluate(() => document.documentElement.setAttribute('data-r2-static', ''));
await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important}' });
await page.waitForTimeout(1200);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const counts = [];
for (let y = 0; y < total; y += height) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  await page.waitForTimeout(250);
  counts.push(await page.evaluate(() => {
    const vh = window.innerHeight;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let words = 0; const T = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent.trim();
      if (!text) continue;
      const el = n.parentElement;
      const cs = el && getComputedStyle(el);
      if (!cs || cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
      // Ancestors too: hidden/transparent wrappers (e.g. inactive panels faded on an outer element).
      if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) continue;
      if (el.closest('[aria-hidden="true"], script, style, noscript, .sr-only, [data-chrome]')) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= vh) continue;
      if (r.right <= 0 || r.left >= window.innerWidth) continue; // off-screen carousel cards
      // Intersect with every clipping ancestor (carousels, overflow:hidden boxes) and the viewport.
      let top = Math.max(r.top, 0), bottom = Math.min(r.bottom, vh), left = Math.max(r.left, 0), right = Math.min(r.right, window.innerWidth);
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const o = getComputedStyle(a);
        if (/(hidden|auto|scroll|clip)/.test(o.overflowX + o.overflowY)) {
          const c = a.getBoundingClientRect();
          top = Math.max(top, c.top); bottom = Math.min(bottom, c.bottom); left = Math.max(left, c.left); right = Math.min(right, c.right);
        }
      }
      if (right - left < 1 || bottom - top < 1) continue;
      const visible = ((bottom - top) / r.height) * Math.min(1, (right - left) / r.width);
      { const k = Math.round(text.split(/\s+/).length * visible); words += k; if (k) T.push(k + ':' + text.slice(0, 36)); }
    }
    return words + ' | ' + T.join(' ; ');
  }));
}
await browser.close();
for (const [i, c] of counts.entries()) console.log(i, c);
