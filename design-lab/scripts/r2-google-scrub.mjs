// Usage: node design-lab/scripts/r2-google-scrub.mjs <url> -> does scroll position drive video.currentTime / transforms?
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const url = process.argv[2];
const root = join(homedir(), '.cache', 'ms-playwright');
let exe; for (const d of readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()) { const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell'); if (existsSync(p)) { exe = p; break; } }
const b = await chromium.launch({ executablePath: exe });
const page = await b.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(4000);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const stickies = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky').map((e) => ({ tag: e.tagName, cls: e.className.toString().slice(0, 30), top: getComputedStyle(e).top, parentH: e.parentElement.getBoundingClientRect().height | 0, h: e.getBoundingClientRect().height | 0 })));
console.log('sticky', JSON.stringify(stickies));
// sample: for every video with videoWidth>0 in viewport, record currentTime/paused at fine scroll steps
const rows = [];
for (let y = 0; y < H; y += 300) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(250);
  const s = await page.evaluate(() => [...document.querySelectorAll('video')].filter((v) => { const r = v.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 100; }).map((v) => `${(v.currentSrc || '').slice(-12)}:${v.paused ? 'P' : 'play'}:${v.currentTime.toFixed(2)}/${v.duration ? v.duration.toFixed(1) : '?'}:loop${v.loop ? 1 : 0}`));
  if (s.length) rows.push(y + ' ' + s.join(' | '));
}
console.log(rows.slice(0, 40).join('\n'));
const sc = await page.evaluate(() => ({ scrollTimelineApi: typeof ScrollTimeline, cssSupportsTimeline: CSS.supports('animation-timeline: scroll()'), vt: typeof document.startViewTransition, ioCount: 'n/a' }));
console.log(JSON.stringify(sc));
await b.close();
