// SIDEKICK parity: page length + visible word count with JS off, reduced motion, and normal (1440).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs'; import { homedir } from 'node:os'; import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const out = process.argv[2] ?? 'design-lab/renders/r2/sidekick/v2';
for (const w of ['signal', 'apple']) for (const mode of ['js', 'nojs', 'rm']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: mode !== 'nojs', reducedMotion: mode === 'rm' ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:3100/design-lab/r2/${w}/sidekick/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, words: document.querySelector('#r2-main').innerText.split(/\s+/).filter(Boolean).length }));
  if (mode !== 'js') await p.screenshot({ path: `${out}/${w}-${mode}-band.png`, fullPage: true, clip: { x: 0, y: 900, width: 1440, height: 1800 } });
  console.log(w, mode, r);
  await ctx.close();
}
await b.close();
