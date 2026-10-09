// W2-CRIT-HOME probe: page heights, section offsets and misc measurements.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const [world = 'signal', w = '1440', h = '900', ...fl] = process.argv.slice(2);
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, reducedMotion: fl.includes('rm') ? 'reduce' : 'no-preference' });
const page = await ctx.newPage();
await page.goto(`http://localhost:3100/design-lab/r2/${world}/`, { waitUntil: 'networkidle', timeout: 60000 });
for (const t of [0, 1500, 4000]) {
  await page.waitForTimeout(t);
  console.log(t, await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, body: document.body.scrollHeight,
    secs: [...document.querySelectorAll('main > section, main > *, footer')].map((s) => `${s.tagName}#${s.id}.${(s.className||'').toString().slice(0,18)}@${Math.round(s.getBoundingClientRect().top + scrollY)}h${Math.round(s.getBoundingClientRect().height)}`) })));
}
if (fl.includes('end')) { await page.evaluate(() => scrollTo(0, 1e6)); await page.waitForTimeout(800); console.log('end', await page.evaluate(() => ({ y: scrollY, sh: document.documentElement.scrollHeight }))); }
await browser.close();
