// CRIT-4 (D critiques E): motion recording + measurements for /design-lab/e. Read-only against the page.
// Usage: node design-lab/scripts/crit4-e-record.mjs [outDir]
// 1. 1440x900 recordVideo: load (hold) -> wheel through the DG-001 scroll story at a human pace ->
//    back to top -> ledger row -> case-brief shared-layout dialog -> close -> RSVP demo play/pace/pause.
// 2. Same journey under prefers-reduced-motion (second video) for parity.
// 3. Measurements: layout shifts (CLS) on desktop load + enhancement; RSVP view vs container width at 390;
//    font swap timing (document.fonts) for Cabinet Grotesk; step heights before/after GSAP enhancement.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/renders/e/crit';
const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/e/';
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = d ? join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') : '';
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const errors = [];
const log = [];
const t0 = Date.now();
const mark = (label) => log.push(`${((Date.now() - t0) / 1000).toFixed(1)}s ${label}`);
const watch = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message.slice(0, 200)}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${tag} console: ${m.text().slice(0, 200)}`));
};

async function journey(page, tag) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  mark(`${tag}: loaded`);
  await page.waitForTimeout(2200);
  await page.mouse.move(720, 450);
  const caseTop = await page.evaluate(() => document.querySelector('#case-dg-001')?.getBoundingClientRect().top ?? 0);
  mark(`${tag}: scroll to DG-001`);
  for (let y = 0; y < caseTop + 500; y += 200) { await page.mouse.wheel(0, 200); await page.waitForTimeout(90); }
  await page.waitForTimeout(1000);
  mark(`${tag}: scroll story start`);
  const stepsEnd = await page.evaluate(() => {
    const el = document.querySelector('[data-steps]');
    return el ? el.getBoundingClientRect().bottom : 2000;
  });
  for (let y = 0; y < stepsEnd; y += 120) { await page.mouse.wheel(0, 120); await page.waitForTimeout(110); }
  await page.waitForTimeout(1200);
  mark(`${tag}: scroll story end`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  mark(`${tag}: open DG-001 brief`);
  await page.locator('button[aria-haspopup="dialog"]').first().click();
  await page.waitForTimeout(2200);
  mark(`${tag}: close brief (button)`);
  await page.getByRole('button', { name: 'Close brief' }).click();
  await page.waitForTimeout(1600);
  mark(`${tag}: open DG-002 brief`);
  await page.locator('button[aria-haspopup="dialog"]').nth(1).click();
  await page.waitForTimeout(1800);
  mark(`${tag}: brief CTA -> jump to case`);
  await page.getByRole('link', { name: 'Read the case study' }).click();
  await page.waitForTimeout(2200);
  const rsvp = page.locator('figure').filter({ has: page.getByRole('button', { name: 'Play' }) });
  await rsvp.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  mark(`${tag}: RSVP play 450`);
  await page.getByRole('button', { name: 'Play' }).click();
  await page.waitForTimeout(3200);
  mark(`${tag}: RSVP pace 250`);
  await page.getByRole('button', { name: '250' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Pause' }).click();
  mark(`${tag}: RSVP paused, step x2`);
  await page.getByRole('button', { name: 'Next word' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Next word' }).click();
  await page.waitForTimeout(1200);
  mark(`${tag}: end`);
}

async function recorded(name, ctxOpts) {
  const vidDir = join(outDir, `_video-${name}`);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: vidDir, size: { width: 1440, height: 900 } }, ...ctxOpts });
  const page = await ctx.newPage();
  watch(page, name);
  await journey(page, name);
  const video = page.video();
  await ctx.close();
  if (video) {
    renameSync(await video.path(), join(outDir, `${name}.webm`));
    rmSync(vidDir, { recursive: true, force: true });
  }
}

try {
  await recorded('motion', {});
  await recorded('motion-reduced', { reducedMotion: 'reduce' });

  // --- measurements: desktop CLS + font swap + step heights
  const mctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mp = await mctx.newPage();
  await mp.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ v: e.value, t: Math.round(e.startTime) });
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await mp.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await mp.waitForTimeout(2500);
  const m = await mp.evaluate(() => {
    const shifts = window.__shifts;
    const cls = shifts.reduce((a, s) => a + s.v, 0);
    const cabinet = [...document.fonts].filter((f) => f.family.includes('Cabinet')).map((f) => `${f.weight}:${f.status}`);
    const steps = [...document.querySelectorAll('[data-step]')].map((el) => Math.round(el.getBoundingClientRect().height));
    const docH = document.documentElement.scrollHeight;
    return { cls: cls.toFixed(4), shifts: shifts.slice(0, 8), cabinet, steps, docH };
  });
  log.push(`desktop: CLS=${m.cls} shifts=${JSON.stringify(m.shifts)} cabinet=${m.cabinet.join(',')} stepHeights=${m.steps.join(',')} docH=${m.docH}`);
  await mctx.close();

  // no-JS desktop step heights + doc height (to quantify enhancement reflow)
  const nctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await nctx.newPage();
  await np.goto(url, { waitUntil: 'load', timeout: 90000 });
  await np.waitForTimeout(1500);
  const nm = await np.evaluate(() => ({
    steps: [...document.querySelectorAll('[data-step]')].map((el) => Math.round(el.getBoundingClientRect().height)),
    docH: document.documentElement.scrollHeight,
  }));
  log.push(`desktop no-JS: stepHeights=${nm.steps.join(',')} docH=${nm.docH}`);
  await nctx.close();

  // --- mobile RSVP geometry
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mpg = await mob.newPage();
  watch(mpg, 'mobile');
  await mpg.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await mpg.waitForTimeout(1500);
  const r = await mpg.evaluate(() => {
    const fig = document.querySelector('figure');
    const view = fig?.firstElementChild;
    const hud = view?.querySelector('[aria-hidden="true"]');
    const word = [...(view?.querySelectorAll('span') ?? [])].find((s) => s.textContent && s.textContent.trim().length > 0 && getComputedStyle(s).fontSize.startsWith('3'));
    const rect = (el) => (el ? el.getBoundingClientRect() : null);
    const f = rect(fig), v = rect(view), h = rect(hud), w = rect(word);
    return {
      figure: f && [Math.round(f.left), Math.round(f.right)],
      view: v && [Math.round(v.left), Math.round(v.right), Math.round(v.height)],
      hudRight: h && Math.round(h.right),
      wordCenter: w && Math.round((w.left + w.right) / 2),
      figureCenter: f && Math.round((f.left + f.right) / 2),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  log.push(`mobile 390 RSVP: ${JSON.stringify(r)}`);
  await mpg.locator('figure').first().scrollIntoViewIfNeeded();
  await mpg.waitForTimeout(500);
  await mpg.locator('figure').first().screenshot({ path: join(outDir, 'mobile-rsvp.png') });
  await mob.close();
} finally {
  await browser.close();
}
console.log(log.join('\n'));
console.log(errors.length ? `ERRORS (${errors.length}):\n${errors.join('\n')}` : 'console errors: 0');
