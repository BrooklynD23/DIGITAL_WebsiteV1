// Debug: pin state (data-late, rect) per BRAIN chapter at given scroll offsets (viewport index × height).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route, w, h, ...idx] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('http://localhost:3100' + route, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
for (const i of idx) {
  await p.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), +i * +h);
  await p.waitForTimeout(300);
  console.log(i, JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('section[data-pin]')].map((s) => {
    const r = s.getBoundingClientRect();
    return `${s.id || s.getAttribute('aria-label')}:${s.dataset.late}:${Math.round(r.top)}..${Math.round(r.bottom)}`;
  }).filter((x) => { const [a, b2] = x.split(':')[2].split('..').map(Number); return b2 > 0 && a < innerHeight; }))));
}
await b.close();
