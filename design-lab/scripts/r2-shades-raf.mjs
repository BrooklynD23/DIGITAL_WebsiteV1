// R2 SHADES gate (adapted from r2-sys-raf.mjs): count requestAnimationFrame callbacks at rest on a SHADES route.
// Usage: node design-lab/scripts/r2-shades-raf.mjs [route=/design-lab/r2/signal/shades/] [--json=out.json]
// Every rAF callback that runs is counted and attributed to the stack that registered it.
// "production cursor" = components/ui/CursorProvider (a production loop outside the r2 system, only on fine pointers);
// "r2" = everything else. Gate: r2 at-rest count must be 0 in every scenario.
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const route = args.find((a) => !a.startsWith('--')) ?? '/design-lab/r2/signal/shades/';
const jsonOut = args.find((a) => a.startsWith('--json='))?.split('=')[1];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const REST_MS = 3000;
// Settle time after load before the first rest sample (the hero's one entry pass must finish first).
const SETTLE_MS = Number(process.env.SETTLE_MS ?? 2000);

function headless() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
  const p = d && join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  return p && existsSync(p) ? p : undefined;
}

const INIT = () => {
  const w = window;
  w.__raf = { on: false, r2: 0, cursor: 0, src: {} };
  const orig = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => {
    const stack = new Error().stack || '';
    const cursor = /CursorProvider/.test(stack);
    const key = stack.split('\n').slice(2, 4).map((l) => l.trim().replace(/https?:\/\/[^/]+/, '').replace(/\?[^:)]*/, '').slice(0, 100)).join(' <- ');
    return orig((t) => {
      if (w.__raf.on) {
        if (cursor) w.__raf.cursor += 1;
        else {
          w.__raf.r2 += 1;
          w.__raf.src[key] = (w.__raf.src[key] || 0) + 1;
        }
      }
      cb(t);
    });
  };
};

async function measure(page, ms = REST_MS) {
  await page.evaluate(() => {
    window.__raf.on = true;
    window.__raf.r2 = 0;
    window.__raf.cursor = 0;
    window.__raf.src = {};
  });
  await page.waitForTimeout(ms);
  return page.evaluate(() => {
    window.__raf.on = false;
    const top = Object.entries(window.__raf.src).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { r2: window.__raf.r2, cursor: window.__raf.cursor, ticks: window.__r2Ticker?.() ?? null, top };
  });
}

async function open(browser, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts);
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(SETTLE_MS);
  return { ctx, page, errors };
}

async function interact(page) {
  // run the RSVP reader for a moment, pause it, step it, scroll through both pins, then go to the bottom
  const during = {};
  await page.locator('#reader').scrollIntoViewIfNeeded();
  const read = page.locator('#reader button', { hasText: /^Read$/ }).first();
  await read.click();
  during.playing = await measure(page, 900);
  await page.locator('#reader button', { hasText: 'Pause' }).first().click();
  await page.locator('#reader button[aria-label="Next word"]').first().click();
  await page.keyboard.press('ArrowRight');
  const slider = page.locator('#reader input[type=range]');
  await slider.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  await page.locator('button[aria-pressed]').first().click(); // the spacing setting (hero chip, reader or LocalNav utility)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(2, 2);
  for (let y = 0; y < 30; y++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(50);
  }
  during.scroll = await page.evaluate(() => window.__raf.r2);
  await page.waitForTimeout(3500);
  return during;
}

const browser = await chromium.launch({ executablePath: headless() });
const desktop = { viewport: { width: 1440, height: 900 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const results = [];

{
  const { ctx, page, errors } = await open(browser, desktop);
  results.push({ scenario: 'desktop · load → rest', ...(await measure(page)), errors: errors.length });
  const during = await interact(page);
  results.push({ scenario: 'desktop · after interaction → rest', ...(await measure(page)), during, errors: errors.length });
  if (errors.length) console.log('console errors:', errors);
  await ctx.close();
}
{
  const { ctx, page, errors } = await open(browser, { ...desktop, reducedMotion: 'reduce' });
  results.push({ scenario: 'desktop · reduced motion · load → rest', ...(await measure(page)), errors: errors.length });
  await page.locator('#reader button', { hasText: 'Next word' }).first().click();
  await page.waitForTimeout(300);
  results.push({ scenario: 'desktop · reduced motion · after play → rest', ...(await measure(page)), errors: errors.length });
  if (errors.length) console.log('console errors (reduced):', errors);
  await ctx.close();
}
{
  const { ctx, page, errors } = await open(browser, mobile);
  results.push({ scenario: 'mobile 390 · load → rest', ...(await measure(page)), errors: errors.length });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
  await page.waitForTimeout(1500);
  results.push({ scenario: 'mobile 390 · after scroll → rest', ...(await measure(page)), errors: errors.length });
  if (errors.length) console.log('console errors (mobile):', errors);
  await ctx.close();
}
await browser.close();

let pass = true;
for (const r of results) {
  if (r.r2 !== 0) pass = false;
  const extra = r.during ? `  (while playing: ${r.during.playing.r2} in 0.6 s)` : '';
  console.log(`${r.r2 === 0 ? 'PASS' : 'FAIL'}  r2 rAF ${String(r.r2).padStart(3)} / 3 s · production cursor ${String(r.cursor).padStart(3)} · active ticks ${r.ticks} · console errors ${r.errors} · ${r.scenario}${extra}`);
  if (r.r2 && r.top.length) for (const [k, v] of r.top) console.log(`        ${v}  ${k}`);
}
console.log(pass ? 'GATE PASS: 0 r2 rAF callbacks at rest in every scenario' : 'GATE FAIL');
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 2));
process.exit(pass ? 0 : 1);
