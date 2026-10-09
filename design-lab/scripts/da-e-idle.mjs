// DA-E: idle-loop + layout-shift + RSVP-centre probe for /design-lab/e.
// Counts requestAnimationFrame calls per second at rest (after load, and after a wheel scroll settles),
// split into production CursorProvider vs everything else (by call stack), in normal and reduced motion.
// Also: document height before/after hydration (reflow), and RSVP word centre vs figure centre at 390.
// Usage: node design-lab/scripts/da-e-idle.mjs
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/e/';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });

const COUNTER = () => {
  window.__raf = { cursor: 0, other: 0 };
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    const st = new Error().stack ?? '';
    if (st.includes('CursorProvider')) window.__raf.cursor++;
    else window.__raf.other++;
    return orig(cb);
  };
};
const sample = async (page, ms = 2000) => {
  await page.evaluate(() => { window.__raf.cursor = 0; window.__raf.other = 0; });
  await page.waitForTimeout(ms);
  return page.evaluate((s) => ({ cursor: Math.round(window.__raf.cursor / s), other: Math.round(window.__raf.other / s) }), ms / 1000);
};

try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
    await ctx.addInitScript(COUNTER);
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(2500);
    const rest = await sample(page);
    await page.mouse.move(700, 450);
    for (let k = 0; k < 15; k++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(40); }
    await page.waitForTimeout(2500);
    const afterScroll = await sample(page);
    console.log(`[${reducedMotion}] rAF/s at rest: E=${rest.other} (prod cursor=${rest.cursor}) | after scroll settles: E=${afterScroll.other} (prod cursor=${afterScroll.cursor})`);
    await ctx.close();
  }

  // reflow: no-JS height vs hydrated height
  const nj = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await nj.newPage();
  await np.goto(url, { waitUntil: 'load' });
  const hNoJs = await np.evaluate(() => document.documentElement.scrollHeight);
  await nj.close();
  const js = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const jp = await js.newPage();
  await jp.goto(url, { waitUntil: 'networkidle' });
  await jp.waitForTimeout(2500);
  const hJs = await jp.evaluate(() => document.documentElement.scrollHeight);
  console.log(`doc height 1440: no-JS ${hNoJs}px, hydrated ${hJs}px, delta ${hJs - hNoJs}px`);
  await js.close();

  // RSVP centre at 390
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mp = await m.newPage();
  await mp.goto(url, { waitUntil: 'networkidle' });
  const r = await mp.evaluate(() => {
    const fig = document.querySelector('figure');
    const view = fig?.firstElementChild;
    const word = fig?.querySelector('[aria-hidden="true"] + span, span[class*="rsvpWord"]');
    const b = (el) => el?.getBoundingClientRect();
    const f = b(fig), v = b(view), w = b(word);
    return { fig: f && [Math.round(f.left), Math.round(f.width)], view: v && Math.round(v.width), wordCentre: w && Math.round(w.left + w.width / 2), figCentre: f && Math.round(f.left + f.width / 2), overflowX: document.documentElement.scrollWidth };
  });
  console.log(`RSVP 390: figure ${JSON.stringify(r.fig)} view ${r.view}px, word centre ${r.wordCentre} vs figure centre ${r.figCentre}, doc scrollWidth ${r.overflowX}`);
  await m.close();
} finally {
  await browser.close();
}
