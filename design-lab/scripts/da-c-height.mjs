// DA-C: measure /design-lab/c page height + horizontal overflow per viewport.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = d ? join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') : '';
const query = process.argv[2] ?? '';
const b = await chromium.launch({
  executablePath: existsSync(exe) ? exe : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
for (const [w, h, mobile] of [[390, 844, true], [834, 1112, false], [1440, 900, false]]) {
  const mode = process.env.MODE ?? '';
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, javaScriptEnabled: mode !== 'nojs', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(`http://localhost:3100/design-lab/c/${query}`, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    live: Boolean(document.querySelector('[data-live="true"]')),
  }));
  if (process.env.SHOT_DIR) await p.screenshot({ path: `${process.env.SHOT_DIR}/c-${w}${process.env.MODE ? '-' + process.env.MODE : ''}.png`, fullPage: !process.env.VIEWPORT_ONLY });
  console.log(w, JSON.stringify(r), `errors=${errors.length}`, errors.slice(0, 2).join(' | '));
  await ctx.close();
}
await b.close();
