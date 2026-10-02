// Usage: node design-lab/scripts/r2-sidekick-probe.mjs <outDir>
// SIDEKICK (both worlds): console errors + viewport shots at chosen scroll anchors, desktop and mobile, live motion (not static).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const out = process.argv[2] ?? 'design-lab/renders/r2/sidekick/probe';
mkdirSync(out, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

const plans = {
  signal: ['#teardown', 'PIN:#teardown > div:nth-child(2)@0.05', 'PIN:#teardown > div:nth-child(2)@0.3', 'PIN:#teardown > div:nth-child(2)@0.45', 'PIN:#teardown > div:nth-child(2)@0.75', 'PIN:#teardown > div:nth-child(2)@0.95', 'SWAP', '#status-title', '#rules-title', '#join'],
  apple: ['#overview', 'PIN:#teardown > div@0.1', 'PIN:#teardown > div@0.42', 'PIN:#teardown > div@0.6', 'PIN:#teardown > div@0.8', '#swap-title', '#boards-title', '#highlights', '#status-title', '#rules-title', '#join'],
};
const vps = [{ name: 'd', width: 1440, height: 900 }, { name: 'm', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }];

for (const world of ['signal', 'apple']) for (const vp of vps) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(out, `${world}-${vp.name}-00-top.png`) });
  let n = 1;
  for (const a of plans[world]) {
    if (a === 'SWAP') {
      await page.click('label[for="sk-swap"]');
      await page.waitForTimeout(900);
    } else if (a.startsWith('PIN:')) {
      const [sel, fs] = a.slice(4).split('@');
      const f = Number(fs);
      await page.evaluate(([sel, f]) => {
        const t = document.querySelector(sel);
        const r = t.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + r.top + f * (r.height - window.innerHeight), behavior: 'instant' });
      }, [sel, f]);
    } else {
      const [sel, frac] = a.split('@');
      await page.evaluate(([sel, frac]) => {
        const el = document.querySelector(sel);
        const r = el.getBoundingClientRect();
        const line = window.innerHeight * (frac ? 0.58 : 0.1);
        window.scrollTo({ top: window.scrollY + r.top - line + (frac ? Number(frac) * r.height : 0), behavior: 'instant' });
      }, [sel, frac]);
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(out, `${world}-${vp.name}-${String(n++).padStart(2, '0')}.png`) });
  }
  console.log(`${world} ${vp.name}: ${errors.length} console errors/warnings`);
  for (const e of errors.slice(0, 8)) console.log('  ', e);
  await ctx.close();
}
await browser.close();
