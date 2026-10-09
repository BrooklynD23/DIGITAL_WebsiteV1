// DA-B interaction checks for /design-lab/b: hover, filters, tabs, RSVP, keyboard, reduced motion, no-JS, overflow.
// Usage: node design-lab/scripts/da-b-states.mjs <outDir>
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const out = process.argv[2] ?? 'design-lab/renders/b/v1/states';
mkdirSync(out, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const URL = 'http://localhost:3100/design-lab/b';
const results = [];
const check = (name, ok, info = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? ' — ' + info : ''}`);
try {
  // 1. desktop interactions
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.hover('svg[aria-describedby$="-w-desc"] a[href="#sub-hardware-pcb"]');
  await page.waitForTimeout(300);
  const lit = await page.$$eval('svg[aria-describedby$="-w-desc"] path[class*="wireLit"]', (n) => n.length);
  check('map hover lights S2 wires', lit === 2, `${lit} lit`);
  await page.screenshot({ path: join(out, 'hover-s2.png'), clip: { x: 640, y: 100, width: 800, height: 520 } });
  await page.mouse.move(10, 890);
  // keyboard: first tab hits skip link (global), then brand, nav links...
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('keyboard reaches nav', !!focused, `focus on "${focused}"`);
  await page.screenshot({ path: join(out, 'focus-nav.png'), clip: { x: 0, y: 0, width: 1440, height: 80 } });
  // filters
  await page.click('button:has-text("Open")');
  const rows = await page.$$eval('table[class*="ledger"] tbody tr', (n) => n.length);
  check('filter Open → 1 row', rows === 1, `${rows} rows`);
  await page.click('button:has-text("All")');
  // build run tab S7
  await page.click('button:has-text("Integration / Testing")');
  const note = await page.textContent('[class*="runDiagram"]');
  check('S7 has no shared part note', /no shared part/.test(note ?? ''));
  await page.click('button:has-text("Operating System")');
  const note4 = await page.textContent('[class*="runDiagram"]');
  check('S4 lists H3 + H4 with S5', /H3/.test(note4 ?? '') && /H4/.test(note4 ?? '') && /S5 Apps/.test(note4 ?? ''));
  await page.locator('#process').screenshot({ path: join(out, 'process-s4.png') });
  // rsvp: single shot, then hold on the last word
  await page.locator('#dg-002').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const w1 = await page.textContent('[class*="rsvpWord"]');
  await page.waitForTimeout(2200);
  const w2 = await page.textContent('[class*="rsvpWord"]');
  await page.waitForTimeout(800);
  const w3 = await page.textContent('[class*="rsvpWord"]');
  check('RSVP runs one pass then holds on last word', w2 === 'look.' && w3 === 'look.', `${w1} → ${w2} → ${w3}`);
  await page.click('button:has-text("Run again")');
  await page.waitForTimeout(300);
  const w4 = await page.textContent('[class*="rsvpWord"]');
  check('Run again replays', w4 !== 'look.', w4 ?? '');
  // anchor jump keeps record strip visible under the 56px nav
  await page.evaluate(() => { window.scrollTo(0, 0); location.hash = ''; });
  await page.click('a[href="#dg-002"]');
  await page.waitForTimeout(400);
  const top = await page.evaluate(() => document.getElementById('dg-002').getBoundingClientRect().top);
  check('index jump lands record below nav', top >= 56, `top ${Math.round(top)}px`);
  check('0 console errors (desktop)', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();

  // 2. reduced motion
  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(URL, { waitUntil: 'networkidle' });
  await rp.locator('#dg-002').scrollIntoViewIfNeeded();
  await rp.waitForTimeout(700);
  const r1 = await rp.textContent('[class*="rsvpWord"]');
  await rp.waitForTimeout(500);
  const r2 = await rp.textContent('[class*="rsvpWord"]');
  check('reduced motion: RSVP static', r1 === r2, r1 ?? '');
  const anim = await rp.$$eval('path', (ps) => ps.filter((p) => getComputedStyle(p).animationName !== 'none').length);
  check('reduced motion: no wire animation', anim === 0, `${anim} animated`);
  await rctx.close();

  // 3. no JS
  const nctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const np = await nctx.newPage();
  await np.goto(URL, { waitUntil: 'load' });
  const text = await np.textContent('body');
  check('no-JS: hero + records + join present', /YOUR NAME ON/i.test(text) && /Seven subsystems/i.test(text) && /Take a subsystem/i.test(text));
  const wires = await np.$$eval('svg path', (n) => n.length);
  check('no-JS: schematic paths rendered', wires > 20, `${wires} paths`);
  await np.screenshot({ path: join(out, 'nojs-mobile.png') });
  await nctx.close();

  // 4. overflow at 390 / 834
  for (const w of [390, 834]) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p = await c.newPage();
    await p.goto(URL, { waitUntil: 'networkidle' });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`no horizontal overflow @${w}`, ov <= 0, `${ov}px`);
    // touch targets
    const small = await p.$$eval('#lab-b a, #lab-b button, #lab-b summary', (els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); const inline = getComputedStyle(e).display === 'inline'; return !inline && r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30)),
    );
    const hits = await p.$$eval('#lab-b svg a', (as) => as.map((a) => a.getBoundingClientRect()).filter((r) => r.width > 0).map((r) => Math.round(r.height)));
    check(`Fig. 1 link hit areas ≥44px @${w}`, hits.every((h) => h >= 44), hits.join(','));
    check(`non-inline targets ≥44px @${w}`, small.length === 0, small.join(' | '));
    const tiny = await p.$$eval('#lab-b *', (els) => els.filter((e) => !e.closest('[class*="srOnly"]') && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && e.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(e).fontSize) * (e.ownerSVGElement ? Math.hypot(e.getScreenCTM().a, e.getScreenCTM().b) : 1) < 11.5).map((e) => `${e.tagName}:${e.textContent.trim().slice(0, 12)}:${(parseFloat(getComputedStyle(e).fontSize) * (e.ownerSVGElement ? Math.hypot(e.getScreenCTM().a, e.getScreenCTM().b) : 1)).toFixed(1)}`));
    check(`rendered text ≥12px @${w}`, tiny.length === 0, `${tiny.length} under ${tiny.slice(0, 6).join(' | ')}`);
    await c.close();
  }
} finally {
  await browser.close();
}
console.log(results.join('\n'));
