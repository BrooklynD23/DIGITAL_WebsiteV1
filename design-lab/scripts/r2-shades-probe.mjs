// SHADES layout probe: prints each main chapter's top/height (px) for a route and viewport.
// Usage: node design-lab/scripts/r2-shades-probe.mjs <route> [width] [height]
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route, w = '1440', h = '900'] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('http://localhost:3100' + route, { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(2500);
console.log(await p.evaluate(() => [...document.querySelectorAll('main > section')].filter((s) => getComputedStyle(s).display !== 'none').map((s) => `${(s.getAttribute('aria-labelledby') || s.id).padEnd(16)} top ${Math.round(s.getBoundingClientRect().top + scrollY)} h ${Math.round(s.getBoundingClientRect().height)}`).join('\n')));
await b.close();
