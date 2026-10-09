// MICRO agent: concept-specific interaction scenarios (read-only; never edits app code).
// Usage: node design-lab/scripts/micro-scenarios.mjs <slug>
// Exercises each concept's signature interactions (toggles, dialogs, pickers, sign input, drag, RSVP) and saves
// evidence crops to design-lab/renders/micro/<slug>/sc-*.png plus scenarios.json.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const slug = process.argv[2];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const url = `${base}/design-lab/${slug}/`;
const out = `design-lab/renders/micro/${slug}`;
mkdirSync(out, { recursive: true });
const HIDE_CURSOR = '[style*="ds-z-cursor"]{display:none !important} html,body{scroll-behavior:auto !important}';

function headlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}
const browser = await chromium.launch({ executablePath: headlessShell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const R = { slug, steps: [] };
const log = (k, v) => { R.steps.push({ k, v }); console.log(k, JSON.stringify(v)); };

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: HIDE_CURSOR });
  await page.waitForTimeout(1500);
  return { ctx, page, errs };
}
const shot = async (loc, name) => { try { await loc.scrollIntoViewIfNeeded({ timeout: 3000 }); await loc.screenshot({ path: `${out}/sc-${name}.png`, timeout: 5000 }); return `${out}/sc-${name}.png`; } catch (e) { return `ERR ${e.message.slice(0, 60)}`; } };
const active = (page) => page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''} "${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40)}"` : null; });
const css = (loc, props) => loc.evaluate((el, p) => Object.fromEntries(p.map((k) => [k, getComputedStyle(el)[k]])), props);

const scenarios = {
  async a() {
    const { ctx, page } = await open();
    const btn = page.getByRole('button', { name: /read it|pause/i }).first();
    const fig = page.locator('figure', { has: btn });
    log('rsvp.before', { label: await btn.textContent(), pressed: await btn.getAttribute('aria-pressed'), crop: await shot(fig, 'rsvp-idle') });
    await btn.click(); await page.waitForTimeout(700);
    log('rsvp.playing', { label: await btn.textContent(), pressed: await btn.getAttribute('aria-pressed'), crop: await shot(fig, 'rsvp-playing') });
    await page.waitForTimeout(6000);
    log('rsvp.end', { label: await btn.textContent(), pressed: await btn.getAttribute('aria-pressed'), crop: await shot(fig, 'rsvp-end') });
    const pace = page.getByRole('button', { name: /^300/ }).first();
    await pace.click();
    log('rsvp.pace', { pressed: await pace.getAttribute('aria-pressed'), style: await css(pace, ['backgroundColor', 'color', 'borderColor', 'cursor']) });
    const row = page.locator('[class*="ledgerRow"]').first();
    log('ledger.row', await css(row, ['transitionProperty', 'transitionDuration']));
    await row.hover(); await page.waitForTimeout(400);
    log('ledger.hover', { crop: await shot(row, 'ledger-hover') });
    const cta = page.locator('[class*="primaryCta"]').first();
    if (await cta.count()) { await cta.hover(); await page.waitForTimeout(300); await page.mouse.down(); await page.waitForTimeout(100); log('cta.active', { crop: await shot(cta, 'cta-active') }); await page.mouse.up(); }
    await ctx.close();
  },
  async b() {
    const { ctx, page } = await open();
    const live = page.locator('[aria-live="polite"]').first();
    const openF = page.getByRole('button', { name: /^Open/ }).first();
    await openF.click(); await page.waitForTimeout(300);
    log('filter.open', { live: await live.textContent(), rows: await page.locator('table tbody tr').first().locator('xpath=..').locator('tr').count(), crop: await shot(page.locator('table').first(), 'filter-open') });
    await page.getByRole('button', { name: /^All/ }).first().click();
    const runLive = page.locator('[aria-live="polite"]').nth(1);
    const tab = page.getByRole('button', { name: /Firmware/ }).first();
    await tab.click(); await page.waitForTimeout(300);
    const runText = (await runLive.textContent()) ?? '';
    log('buildrun.tab', { liveChars: runText.length, crop: await shot(runLive, 'buildrun-firmware') });
    // Fig.1 keyboard trace vs hover trace
    const map = page.locator('[class*="mapLink"]').nth(1);
    await map.hover(); await page.waitForTimeout(400);
    const svg = page.locator('svg', { has: map }).first();
    log('map.hover', { crop: await shot(svg, 'map-hover') });
    await page.mouse.move(2, 2); await map.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(400);
    log('map.focus', { active: await active(page), crop: await shot(svg, 'map-focus') });
    await map.click(); await page.waitForTimeout(500);
    log('map.target', { hash: await page.evaluate(() => location.hash), crop: await shot(page.locator(':target').first(), 'register-target') });
    const pause = page.getByRole('button', { name: /word stream/ }).first();
    log('rsvp', { label: await pause.getAttribute('aria-label'), pressed: await pause.getAttribute('aria-pressed') });
    await ctx.close();
    const m = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const sum = m.page.locator('summary').first();
    if (await sum.count()) {
      await sum.click(); await m.page.waitForTimeout(400);
      log('mobile.menu', { expanded: await sum.getAttribute('aria-expanded'), crop: await shot(m.page.locator('details').first(), 'mobile-menu-open') });
    }
    await m.ctx.close();
  },
  async c() {
    const { ctx, page } = await open({ hasTouch: false });
    const hero = page.locator('section').first();
    log('hero.default', { crop: await shot(hero, 'hero-phone') });
    const reading = page.locator('input[value="reading"]');
    await reading.focus(); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(1600);
    log('radio.keyboard', { checked: await page.evaluate(() => document.querySelector('input[name]:checked')?.value), active: await active(page), crop: await shot(hero, 'hero-after-arrow') });
    await page.locator('label', { has: page.locator('input[value="unsigned"]') }).click(); await page.waitForTimeout(1600);
    const sign = page.locator('#c-sign');
    if (await sign.count()) {
      await sign.focus(); log('sign.focus', { style: await css(sign, ['outlineStyle', 'outlineColor', 'borderBottomColor', 'caretColor']), crop: await shot(sign.locator('xpath=..'), 'sign-focus') });
      await sign.fill('Danny Tran'); await page.waitForTimeout(400);
      log('sign.filled', { crop: await shot(hero, 'hero-signed') });
      await sign.fill('X'.repeat(40)); log('sign.max', { len: (await sign.inputValue()).length });
    }
    const still = page.getByRole('button', { name: 'Still' });
    const liveB = page.getByRole('button', { name: 'Live' });
    log('render.toggle', { liveDisabled: await liveB.isDisabled(), livePressed: await liveB.getAttribute('aria-pressed'), crop: await shot(liveB.locator('xpath=../..'), 'render-toggle') });
    await page.locator('input[value="phone"]').check({ force: true }); await page.waitForTimeout(1500);
    const legend = page.locator('[aria-label="Subsystem layers"] button').nth(2);
    if (await legend.count()) { await legend.click(); await page.waitForTimeout(300); log('legend.pin', { pressed: await legend.getAttribute('aria-pressed'), readout: await page.locator('[class*="legendReadout"]').first().textContent(), crop: await shot(legend.locator('xpath=ancestor::ul'), 'legend-pinned') }); }
    await ctx.close();
    const rm = await open({ reducedMotion: 'reduce' });
    const lb = rm.page.getByRole('button', { name: 'Live' });
    log('rm.live', { disabled: await lb.isDisabled(), title: await lb.getAttribute('title'), describedby: await lb.getAttribute('aria-describedby'), cursor: (await css(lb, ['cursor'])).cursor, crop: await shot(lb.locator('xpath=../..'), 'rm-render-toggle') });
    await rm.ctx.close();
  },
  async d() {
    const { ctx, page } = await open();
    const first = page.locator('input[name="d-seat"]').first();
    await first.focus(); await page.waitForTimeout(200);
    const grid = page.locator('[class*="seatGrid"]').first();
    log('seat.focus', { active: await active(page), crop: await shot(grid, 'seat-focus') });
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    log('seat.arrow', { checked: await page.evaluate(() => document.querySelector('input[name="d-seat"]:checked')?.value), liveRegions: await page.locator('#seats [aria-live]').count(), crop: await shot(page.locator('#seats'), 'seats-after-arrow') });
    const seat = page.locator('[class*="seat"]:has(input[name="d-seat"])').nth(4);
    await seat.hover(); await page.waitForTimeout(400);
    log('seat.hover', { crop: await shot(seat, 'seat-hover') });
    const btn = page.locator('[class*="button"]').first();
    await btn.hover(); await page.waitForTimeout(300); await page.mouse.down(); await page.waitForTimeout(120);
    log('button.active', { style: await css(btn, ['transform', 'backgroundColor']), crop: await shot(btn, 'button-active') }); await page.mouse.up();
    await ctx.close();
    const rm = await open({ reducedMotion: 'reduce' });
    await rm.page.locator('#how').scrollIntoViewIfNeeded();
    log('rm.drawon', { crop: await shot(rm.page.locator('#how'), 'rm-how') });
    await rm.ctx.close();
  },
  async e() {
    const { ctx, page } = await open();
    const trig = page.locator('button[aria-haspopup="dialog"]').first();
    await trig.scrollIntoViewIfNeeded(); await trig.focus();
    await page.keyboard.press('Enter');
    const t0 = Date.now(); await page.locator('[role="dialog"]').waitFor(); const openMs = Date.now() - t0;
    await page.waitForTimeout(150);
    log('dialog.opening', { crop: await shot(page.locator('body'), 'dialog-midmorph').catch(() => null) });
    await page.waitForTimeout(700);
    const dlg = page.locator('[role="dialog"]');
    log('dialog.open', { openMs, active: await active(page), crop: await shot(dlg, 'dialog-open') });
    await page.screenshot({ path: `${out}/sc-dialog-viewport.png` });
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.move(100, 450); await page.mouse.wheel(0, 800); await page.waitForTimeout(800);
    const y1 = await page.evaluate(() => scrollY);
    const inertish = await page.evaluate(() => ({ mainInert: !!document.querySelector('main')?.inert, bodyOverflow: getComputedStyle(document.body).overflow, htmlOverflow: getComputedStyle(document.documentElement).overflow }));
    log('dialog.scrollLock', { scrolledBy: y1 - y0, ...inertish });
    const stops = [];
    for (let i = 0; i < 8; i += 1) { await page.keyboard.press('Tab'); stops.push(await active(page)); }
    log('dialog.tabCycle', stops);
    await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    log('dialog.closed', { open: await dlg.count(), returnFocus: await active(page), expanded: await trig.getAttribute('aria-expanded') });
    const play = page.getByRole('button', { name: /^(Play|Pause)$/ }).first();
    if (await play.count()) {
      const panel = play.locator('xpath=ancestor::div[contains(@class,"rsvp")][last()]');
      log('rsvp.idle', { label: (await play.textContent()).trim(), crop: await shot(panel, 'rsvp-idle') });
      const pace = page.getByRole('group', { name: 'Pace' }).getByRole('button').nth(1);
      await pace.click(); log('rsvp.pace', { pressed: await pace.getAttribute('aria-pressed'), style: await css(pace, ['backgroundColor', 'color', 'borderColor']), crop: await shot(pace.locator('xpath=..'), 'rsvp-pace') });
    }
    await ctx.close();
  },
  async f() {
    const { ctx, page } = await open();
    const bench = page.locator('#bench, [id*="bench"]').first();
    const seatBtn = page.getByRole('button', { name: /Put .* here/ }).first();
    log('unsigned', { seatBtn: await seatBtn.count() ? (await seatBtn.textContent()).trim() : null, crop: await shot(page.locator('[class*="tray"]').first(), 'tray-unsigned') });
    const input = page.locator('#f-sign');
    await input.focus();
    log('sign.focus', { style: await css(input, ['outlineStyle', 'outlineWidth', 'outlineColor', 'borderBottomColor', 'caretColor']), crop: await shot(input.locator('xpath=..'), 'sign-focus') });
    await input.fill('Danny'); await page.waitForTimeout(400);
    log('sign.filled', { tray: (await page.locator('[class*="trayText"]').first().textContent())?.trim(), crop: await shot(page.locator('[class*="tray"]').first(), 'tray-signed') });
    const put = page.getByRole('button', { name: /Put Danny here|Put my name here/ }).first();
    await put.scrollIntoViewIfNeeded(); await put.click(); await page.waitForTimeout(700);
    log('seat.placed', { tray: (await page.locator('[class*="trayText"]').first().textContent())?.trim(), active: await active(page), crop: await shot(put.locator('xpath=ancestor::*[contains(@class,"seat")][1]'), 'seat-placed') });
    // keyboard drag
    const tag = page.getByRole('button', { name: /Your name tag/ }).first();
    if (await tag.count()) {
      await tag.focus(); await page.keyboard.press('Space'); await page.waitForTimeout(300); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
      const ann = await page.evaluate(() => [...document.querySelectorAll('[role=status],[aria-live]')].map((n) => n.textContent.trim()).filter(Boolean).slice(-2));
      await page.keyboard.press('Space'); await page.waitForTimeout(600);
      log('kbd.drag', { announcements: ann, tray: (await page.locator('[class*="trayText"]').first().textContent())?.trim(), active: await active(page) });
    } else log('kbd.drag', 'tag not focusable after placement (tag lives in seat)');
    const tabs = page.getByRole('navigation', { name: 'Page index' });
    await page.locator('#thursday, [id*="thursday"]').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    log('tabs.current', { current: await tabs.locator('[aria-current="true"]').textContent().catch(() => null), crop: await shot(tabs, 'tabs-thursday') });
    await page.reload({ waitUntil: 'networkidle' }); await page.addStyleTag({ content: HIDE_CURSOR }); await page.waitForTimeout(1200);
    log('persist.reload', { value: await page.locator('#f-sign').inputValue() });
    const listBtn = page.getByRole('button', { name: /List/ }).first();
    if (await listBtn.count()) { await listBtn.click(); await page.waitForTimeout(400); log('list.view', { pressed: await listBtn.getAttribute('aria-pressed'), crop: await shot(listBtn.locator('xpath=ancestor::section[1]'), 'list-view') }); }
    await ctx.close();
    const m = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await m.page.screenshot({ path: `${out}/sc-mobile-tabbar.png` });
    log('mobile.tabbar', { crop: `${out}/sc-mobile-tabbar.png` });
    await m.ctx.close();
  },
};

try { await scenarios[slug](); } catch (e) { log('FATAL', e.message.slice(0, 300)); }
await browser.close();
writeFileSync(`${out}/scenarios.json`, JSON.stringify(R, null, 2));
