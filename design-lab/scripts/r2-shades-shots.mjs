// SHADES review shots: viewport captures at each chapter and at pinned-chapter states, both worlds, 1440 + 390.
// Usage: node design-lab/scripts/r2-shades-shots.mjs <outDir> [--reduced] [--nojs]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [out = 'design-lab/renders/r2/shades/v1/shots', ...flags] = process.argv.slice(2);
const reduced = flags.includes('--reduced');
const nojs = flags.includes('--nojs');
mkdirSync(out, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const b = await chromium.launch({ executablePath: shell });
const tag = reduced ? '-reduced' : nojs ? '-nojs' : '';

for (const world of ['signal', 'apple']) {
  for (const vp of [{ n: '1440', width: 1440, height: 900 }, { n: '390', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1, reducedMotion: reduced ? 'reduce' : 'no-preference', javaScriptEnabled: !nojs });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
    await page.goto(`${base}/design-lab/r2/${world}/shades/`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(3500);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    // chapter tops
    const tops = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('main#r2-main > section, main#r2-main > *')];
      const seen = new Set();
      return nodes.map((n) => {
        const r = n.getBoundingClientRect();
        if (r.height < 40 || getComputedStyle(n).display === 'none') return null;
        const y = Math.round(r.top + window.scrollY);
        if (seen.has(y)) return null;
        seen.add(y);
        return { y, h: Math.round(r.height), id: n.id || n.getAttribute('aria-labelledby') || n.className.toString().slice(0, 24) };
      }).filter(Boolean);
    });
    let i = 0;
    for (const t of tops) {
      const stops = t.h > vp.height * 2 ? [0, 0.2, 0.45, 0.7, 0.95].map((f) => t.y + f * (t.h - vp.height)) : [t.y - (world === 'apple' ? 104 : 52)];
      for (const y of stops) {
        await page.evaluate((top) => window.scrollTo(0, top), Math.max(0, Math.round(y)));
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${out}/${world}-${vp.n}${tag}-${String(i).padStart(2, '0')}.png` });
        i += 1;
      }
    }
    console.log(world, vp.n, tag || 'normal', 'shots', i, 'console errors', errors.length, errors.join(' | '));
    await ctx.close();
  }
}
await b.close();
