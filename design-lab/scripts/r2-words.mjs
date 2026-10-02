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
    let words = 0;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent.trim();
      if (!text) continue;
      const el = n.parentElement;
      const cs = el && getComputedStyle(el);
      if (!cs || cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
      if (el.closest('[aria-hidden="true"], script, style, noscript, .sr-only, [data-chrome]')) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= vh) continue;
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height;
      words += Math.round(text.split(/\s+/).length * visible);
    }
    return words;
  }));
}
await browser.close();
const sorted = [...counts].sort((a, b) => a - b);
const avg = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))];
const quiet = Math.round((100 * counts.filter((c) => c <= 12).length) / counts.length);
console.log(`${route} @${width}x${height}: ${counts.length} viewports, ${(total / height).toFixed(1)} vh`);
console.log(`per viewport: ${counts.join(' ')}`);
console.log(`avg ${avg} · p90 ${p90} · max ${sorted.at(-1)} · quiet(<=12) ${quiet}%  [budget: avg<=30, p90<=70, max<=100, quiet>=45%]`);
