// W2-CRIT-HOME: pinned-hero geometry at 390x844 and 1440x900 (gap between stage copy, readout, orb, ruler).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell });
for (const [w, h] of [[390, 844], [1440, 900], [834, 1112]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:3100/design-lab/r2/signal/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[data-enhanced]');
  await page.evaluate(() => scrollTo(0, innerHeight * 1.6)); await page.waitForTimeout(800);
  const g = await page.evaluate(() => {
    const q = (s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? [Math.round(r.top), Math.round(r.bottom), Math.round(r.width)] : null; };
    const cls = (p) => `[class*="${p}"]`;
    const active = [...document.querySelectorAll(cls('stageBigItem'))].find((e) => e.dataset.active);
    const ar = active?.getBoundingClientRect();
    const canvas = [...document.querySelectorAll(`${cls('orbStack')} canvas`)].map((c) => c.getBoundingClientRect()).find((r) => r.width);
    return { stageCopy: ar ? [Math.round(ar.top), Math.round(ar.bottom)] : null, readout: q(cls('readout')), orbStack: q(cls('orbStack')), ruler: q(cls('ruler')), canvas: canvas ? [Math.round(canvas.top), Math.round(canvas.bottom)] : null };
  });
  console.log(`${w}x${h}`, JSON.stringify(g));
  await page.screenshot({ path: `design-lab/renders/r2/crit/home/signal-${w}-pin-mid.png` });
  await page.close();
}
await browser.close();
