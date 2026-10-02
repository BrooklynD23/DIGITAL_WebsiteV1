// W2-CRIT-SHADES no-JS check, time-boxed: javaScriptEnabled:false, waitUntil 'commit' + fixed wait (networkidle can hang
// on dev-server HMR sockets). Captures 1440 viewport stills at 6 scroll steps and reports text parity facts.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const OUT = 'design-lab/renders/r2/crit/shades';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const kill = setTimeout(() => { console.log('TIMEOUT 60s'); process.exit(2); }, 60000);
for (const world of ['signal', 'apple']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(`http://localhost:3100/design-lab/r2/${world}/shades/`, { waitUntil: 'commit', timeout: 20000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => console.log(world, 'domcontentloaded timeout'));
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight,
    readerTextVisible: (() => { const p = document.querySelector('#reader [id] [class*=tw]')?.closest('p'); return p ? getComputedStyle(p).position !== 'absolute' : null; })(),
    buttons: document.querySelectorAll('#reader button').length,
    hasAllStages: document.body.innerText.includes('The word lands where you already look'),
    hasBoundary: document.body.innerText.includes('Not a medical device'),
    pinVisible: [...document.querySelectorAll('section')].filter((s) => getComputedStyle(s).display === 'none').map((s) => s.getAttribute('aria-labelledby') || s.className.slice(0, 20)),
  }));
  console.log(world, `${Date.now() - t0}ms`, JSON.stringify(info));
  for (let i = 0; i < 6; i += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((i / 5) * (info.h - 900)));
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/${world}-1440-nojs-step${i}.png` });
  }
  await ctx.close();
}
clearTimeout(kill);
await b.close();
