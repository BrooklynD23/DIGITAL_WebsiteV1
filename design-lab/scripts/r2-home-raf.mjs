// R2 Home gate (adapted from r2-sys-raf.mjs): count rAF callbacks at rest on /design-lab/r2/{signal,apple}/.
// Usage: node design-lab/scripts/r2-home-raf.mjs [signal|apple|both]
// Scenarios per world: load → rest; scrub the whole pin + hover/press demos → rest; reduced motion → rest; mobile scroll → rest.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const which = process.argv[2] ?? 'both';
const worlds = which === 'both' ? ['signal', 'apple'] : [which];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const REST_MS = 3000;
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);

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
        else { w.__raf.r2 += 1; w.__raf.src[key] = (w.__raf.src[key] || 0) + 1; }
      }
      cb(t);
    });
  };
};
async function measure(page, ms = REST_MS) {
  await page.evaluate(() => { window.__raf.on = true; window.__raf.r2 = 0; window.__raf.cursor = 0; window.__raf.src = {}; });
  await page.waitForTimeout(ms);
  return page.evaluate(() => {
    window.__raf.on = false;
    return { r2: window.__raf.r2, cursor: window.__raf.cursor, top: Object.entries(window.__raf.src).sort((a, b) => b[1] - a[1]).slice(0, 3) };
  });
}
async function open(browser, world, opts) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(`${base}/design-lab/r2/${world}/`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(2000);
  return { ctx, page, errors };
}
async function interact(page, world) {
  let during = 0;
  await page.evaluate(() => { window.__raf.on = true; window.__raf.r2 = 0; });
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(40); }
  during = await page.evaluate(() => window.__raf.r2);
  if (world === 'signal') {
    const row = page.locator('[data-stage-host]').first();
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    await page.waitForTimeout(600);
    await page.mouse.move(2, 400);
  } else {
    await page.locator('#builds article').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('button[aria-label="Next highlight"]').scrollIntoViewIfNeeded();
    await page.locator('button[aria-label="Next highlight"]').click();
    await page.locator('#join').scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(4000);
  return during;
}

const browser = await chromium.launch({ executablePath: shell });
const desktop = { viewport: { width: 1440, height: 900 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
let pass = true;
for (const world of worlds) {
  const rows = [];
  {
    const { ctx, page, errors } = await open(browser, world, desktop);
    rows.push({ s: 'desktop · load → rest', ...(await measure(page)), e: errors.length });
    const during = await interact(page, world);
    rows.push({ s: `desktop · scrub pin + demos → rest (while scrolling: ${during} rAF)`, ...(await measure(page)), e: errors.length });
    if (errors.length) console.log(world, 'errors:', errors);
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await open(browser, world, { ...desktop, reducedMotion: 'reduce' });
    for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(30); }
    await page.waitForTimeout(1200);
    rows.push({ s: 'desktop · reduced motion · scroll → rest', ...(await measure(page)), e: errors.length });
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await open(browser, world, mobile);
    rows.push({ s: 'mobile 390 · load → rest', ...(await measure(page)), e: errors.length });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
    await page.waitForTimeout(1500);
    rows.push({ s: 'mobile 390 · after scroll → rest', ...(await measure(page)), e: errors.length });
    await ctx.close();
  }
  for (const r of rows) {
    if (r.r2 !== 0) pass = false;
    console.log(`${r.r2 === 0 ? 'PASS' : 'FAIL'}  ${world} · r2 rAF ${String(r.r2).padStart(3)} / 3 s · console errors ${r.e} · ${r.s}`);
    if (r.r2) for (const [k, v] of r.top) console.log(`        ${v}  ${k}`);
  }
}
await browser.close();
console.log(pass ? 'GATE PASS: 0 rAF at rest' : 'GATE FAIL');
process.exit(pass ? 0 : 1);
