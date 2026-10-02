// DA-D interaction + fallback checks for /design-lab/d (concept D).
// Usage: node design-lab/scripts/da-d-check.mjs <outDir>
// 1) mobile 390 full page at DPR 1 (avoids the >16k px tiling glitch at DPR 2)
// 2) seat picker: click + keyboard arrows change the visible panel
// 3) JS disabled: content + sketches render; 4) reduced motion: sketches fully drawn
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/renders/d/v1/checks';
const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/d/';
mkdirSync(outDir, { recursive: true });

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  for (const d of readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: shell() });
const results = [];
const visibleSeat = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-seat]')].filter((el) => getComputedStyle(el).display !== 'none').map((el) => el.getAttribute('data-seat')),
  );

try {
  // 1 + 2: mobile, JS on
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(outDir, 'mobile-dpr1.png'), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    results.push(`mobile: horizontal overflow ${overflow}px, console errors ${errors.length}${errors.length ? ' → ' + errors.join(' | ') : ''}`);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('#concept-d a, #concept-d label')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height < 44; }).map((el) => (el.textContent ?? '').trim().slice(0, 30)),
    );
    results.push(`mobile: targets <44px tall: ${small.length}${small.length ? ' → ' + small.join(' | ') : ''}`);
    await ctx.close();
  }
  // 2: desktop seat picker
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    const before = await visibleSeat(page);
    await page.click('label:has(input[value="mechanical-cad"])');
    const afterClick = await visibleSeat(page);
    await page.focus('input[value="mechanical-cad"]');
    await page.keyboard.press('ArrowRight');
    const afterKey = await visibleSeat(page);
    await page.locator('#seats').screenshot({ path: join(outDir, 'seats-after-key.png') });
    results.push(`seats: initial ${before} → click ${afterClick} → ArrowRight ${afterKey}`);
    // keyboard focus visibility on first nav link
    await page.keyboard.press('Tab');
    await page.close();
  }
  // 3: JS disabled
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const h1 = await page.textContent('h1');
    const paths = await page.evaluate(() => document.querySelectorAll('[data-sketch] path').length);
    const seat = await visibleSeat(page);
    await page.screenshot({ path: join(outDir, 'nojs-desktop.png') });
    results.push(`no-JS: h1="${h1?.trim()}", sketch paths ${paths}, visible seat ${seat}`);
    await ctx.close();
  }
  // 4: reduced motion
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const armed = await page.evaluate(() => document.getElementById('concept-d')?.hasAttribute('data-armed'));
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-sketch] path')].filter((p) => getComputedStyle(p).strokeDashoffset !== '0px' && getComputedStyle(p).strokeDashoffset !== '0').length);
    results.push(`reduced motion: armed=${armed}, undrawn paths ${hidden}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(results.join('\n'));
