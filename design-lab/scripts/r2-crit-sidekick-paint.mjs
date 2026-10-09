// W2-CRIT-SIDEKICK: paint cost while scrolling. For each route, scroll in 48px instant steps and wait for 2 rAFs
// after each step (= a frame actually produced); report ms per step by page region + long tasks. SwiftShader, so
// absolute numbers are pessimistic; compare regions/worlds relatively.
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os'; import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const out = {};
for (const w of ['signal', 'apple']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:3100/design-lab/r2/${w}/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.startTime), Math.round(e.duration), Math.round(scrollY)]))).observe({ type: 'longtask', buffered: false }); });
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = [];
  for (let y = 0; y <= H; y += 48) {
    const ms = await p.evaluate(async (t) => { const s = performance.now(); scrollTo({ top: t, behavior: 'instant' }); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return performance.now() - s; }, y);
    steps.push([y, Math.round(ms)]);
  }
  const bands = {};
  const secs = await p.evaluate(() => [...document.querySelectorAll('main > section, main > div, #teardown')].map((s) => [s.id || s.getAttribute('aria-labelledby') || s.className.slice(0, 20), s.getBoundingClientRect().top + scrollY, s.getBoundingClientRect().bottom + scrollY]));
  for (const [y, ms] of steps) { const s = secs.filter((x) => y + 450 >= x[1] && y + 450 < x[2]).pop(); const k = s ? s[0] : 'other'; (bands[k] ||= []).push(ms); }
  const sum = Object.fromEntries(Object.entries(bands).map(([k, a]) => { a.sort((x, y) => x - y); return [k, { n: a.length, p50: a[a.length >> 1], p90: a[Math.floor(a.length * 0.9)], max: a[a.length - 1] }]; }));
  const lt = await p.evaluate(() => window.__lt);
  out[w] = { sum, longTasks: lt.length, longMs: lt.reduce((a, x) => a + x[1], 0), worst: lt.sort((a, b) => b[1] - a[1]).slice(0, 5) };
  await p.close();
}
writeFileSync('design-lab/renders/r2/crit/sidekick/paint-report.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await b.close();
