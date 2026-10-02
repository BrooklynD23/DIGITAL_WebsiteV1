// R2 BRAIN gate: 0 rAF callbacks at rest + console errors + keyboard demos, on one BRAIN route.
// Usage: node design-lab/scripts/r2-brain-raf.mjs /design-lab/r2/signal/brain/ [--json=out.json]
// Adapted from r2-sys-raf.mjs (same attribution: "production cursor" vs r2 callbacks).
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const route = args.find((a) => !a.startsWith('--')) ?? '/design-lab/r2/signal/brain/';
const jsonOut = args.find((a) => a.startsWith('--json='))?.split('=')[1];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const REST_MS = 3000;

function headless() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
  const p = d && join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  return p && existsSync(p) ? p : undefined;
}

const INIT = () => {
  const w = window;
  w.__raf = { on: false, r2: 0, cursor: 0, src: {}, maxTicks: 0 };
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
  await page.evaluate(() => Object.assign(window.__raf, { on: true, r2: 0, cursor: 0, src: {} }));
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
  return { ctx, page, errors };
}

const readout = (page, id) => page.locator(`#ch-${id} p[aria-live="polite"]`).first().innerText();

async function scrollAll(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(90);
  }
}

async function interact(page) {
  const log = {};
  // ch3: toggle a server
  await page.locator('#ch-mcp').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('#ch-mcp [role="switch"]').nth(2).click();
  await page.waitForTimeout(2800);
  log.mcp = await readout(page, 'mcp');
  // ch5: add the document (keyboard), pick Compact
  await page.locator('#ch-engineering').scrollIntoViewIfNeeded();
  await page.locator('#ch-engineering button[aria-label^="Add document"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  log.engWaiting = await readout(page, 'engineering');
  await page.locator('#ch-engineering button', { hasText: 'Compact' }).click();
  await page.waitForTimeout(3000);
  log.engDone = await readout(page, 'engineering');
  // ch6: wait for the hold, then Esc on the gate group (deny), Again, then Enter (approve)
  await page.locator('#ch-harness').scrollIntoViewIfNeeded();
  await page.waitForTimeout(4200);
  const gate = page.locator('#ch-harness [aria-label^="Pending Edit call"]');
  await gate.focus();
  log.gatePending = await readout(page, 'harness');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1800);
  log.gateDenied = await readout(page, 'harness');
  await page.locator('#ch-harness button', { hasText: 'Again' }).click();
  await page.waitForTimeout(4200);
  await gate.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1800);
  log.gateApproved = await readout(page, 'harness');
  // ch8: slider by keyboard
  await page.locator('#ch-evals input[type=range]').focus();
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(4500);
  log.evals = await readout(page, 'evals');
  return log;
}

const browser = await chromium.launch({ executablePath: headless() });
const desktop = { viewport: { width: 1440, height: 900 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const results = [];
let log = {};

{
  const { ctx, page, errors } = await open(browser, desktop);
  await page.waitForTimeout(9000); // hero beat is 7.2 s
  results.push({ scenario: 'desktop · load (hero beat ends) → rest', ...(await measure(page)), errors: errors.length });
  await scrollAll(page);
  await page.waitForTimeout(6000);
  results.push({ scenario: 'desktop · scroll whole page (every beat fires) → rest', ...(await measure(page)), errors: errors.length });
  log = await interact(page);
  await page.waitForTimeout(1500);
  results.push({ scenario: 'desktop · interactions (MCP, doc+compact, gate Esc/Enter, k slider) → rest', ...(await measure(page)), errors: errors.length });
  if (errors.length) console.log('console errors:', errors);
  await ctx.close();
}
{
  const { ctx, page, errors } = await open(browser, { ...desktop, reducedMotion: 'reduce' });
  await page.waitForTimeout(1500);
  results.push({ scenario: 'desktop · reduced motion · load → rest', ...(await measure(page)), errors: errors.length });
  await scrollAll(page);
  await page.waitForTimeout(800);
  results.push({ scenario: 'desktop · reduced motion · scroll → rest', ...(await measure(page)), errors: errors.length });
  if (errors.length) console.log('console errors (reduced):', errors);
  await ctx.close();
}
{
  const { ctx, page, errors } = await open(browser, mobile);
  await page.waitForTimeout(9000);
  results.push({ scenario: 'mobile 390 · load → rest', ...(await measure(page)), errors: errors.length });
  await scrollAll(page);
  await page.waitForTimeout(6000);
  results.push({ scenario: 'mobile 390 · scroll → rest', ...(await measure(page)), errors: errors.length });
  if (errors.length) console.log('console errors (mobile):', errors);
  await ctx.close();
}
await browser.close();

let pass = true;
for (const r of results) {
  if (r.r2 !== 0 || r.errors) pass = false;
  console.log(`${r.r2 === 0 ? 'PASS' : 'FAIL'}  r2 rAF ${String(r.r2).padStart(3)} / 3 s · cursor ${String(r.cursor).padStart(3)} · ticks ${r.ticks} · console errors ${r.errors} · ${r.scenario}`);
  if (r.r2 && r.top.length) for (const [k, v] of r.top) console.log(`        ${v}  ${k}`);
}
console.log('readouts:', JSON.stringify(log, null, 1));
console.log(pass ? 'GATE PASS: 0 r2 rAF at rest, 0 console errors' : 'GATE FAIL');
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ results, log }, null, 2));
process.exit(pass ? 0 : 1);
