// W2-CRIT-HOME: is the hero h1 visible under reduced motion and without JS? (both worlds, 1440 + 390)
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell });
for (const world of ['signal', 'apple']) for (const mode of ['default', 'reduce', 'nojs']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'nojs' });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:3100/design-lab/r2/${world}/`, { waitUntil: mode === 'nojs' ? 'domcontentloaded' : 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const h = document.querySelector('#hero-title'); const sec = h.closest('section');
    const cs = getComputedStyle(h.parentElement);
    return { phase: sec.dataset.phase ?? null, enhanced: sec.dataset.enhanced ?? null, parentVisibility: cs.visibility, parentOpacity: cs.opacity, checkVis: h.checkVisibility({ visibilityProperty: true, opacityProperty: true }), h: document.documentElement.scrollHeight };
  });
  console.log(world, mode, JSON.stringify(r));
  await ctx.close();
}
await browser.close();
