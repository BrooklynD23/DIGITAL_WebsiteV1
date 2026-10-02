// MICRO agent: ad-hoc state peek. Runs a JS snippet in the page, then saves a viewport screenshot.
// Usage: node design-lab/scripts/micro-peek.mjs <slug> <name> <mobile|desktop|rm> "<async js body; may return JSON>" [waitMs]
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [slug, name, vp = 'desktop', body = '', wait = '600'] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const opts = vp === 'mobile' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  : { viewport: { width: 1440, height: 900 }, ...(vp === 'rm' ? { reducedMotion: 'reduce' } : {}) };
const page = await (await browser.newContext(opts)).newPage();
await page.goto(`${process.env.LAB_URL ?? 'http://localhost:3100'}/design-lab/${slug}/`, { waitUntil: 'networkidle', timeout: 90000 });
await page.addStyleTag({ content: '[style*="ds-z-cursor"]{display:none !important} html,body{scroll-behavior:auto !important}' });
await page.waitForTimeout(1200);
const res = await page.evaluate(`(async () => { ${body} })()`);
await page.waitForTimeout(Number(wait));
await page.screenshot({ path: `design-lab/renders/micro/${slug}/peek-${name}.png` });
console.log(JSON.stringify(res ?? null));
await browser.close();
