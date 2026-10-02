// MASCOT lab: capture with/without at 1440, mascot close-ups per reaction, and a11y/behavior checks.
// Usage: node design-lab/scripts/mascot-states.mjs [outDir]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/renders/mascot/v1';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const route = '/design-lab/mascot/';
mkdirSync(outDir, { recursive: true });

function headlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: headlessShell() });
const results = [];
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  await sleep(800);
  return { page, errors };
}

const toggle = (page) => page.getByRole('button', { name: 'Mascot', exact: true });
const layoutProbe = (page) =>
  page.evaluate(() =>
    ['#mascot-hero-title', '#builds', '#mascot-join-title'].map((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY)),
  );
const strip = (page) => page.locator('[data-mascot-root] text').last().textContent();
const litPins = (page) => page.evaluate(() => [...document.querySelectorAll('[data-mascot-root] rect')].filter((r) => getComputedStyle(r).fill === 'rgb(194, 142, 14)').length);

async function closeUp(page, name) {
  const box = await page.locator('[data-mascot-root]').boundingBox();
  await page.screenshot({ path: `${outDir}/closeup-${name}.png`, clip: { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: box.height + 40 } });
}

try {
  // 1. Desktop, fine pointer: default ON. with / without.
  {
    const { page, errors } = await open({ deviceScaleFactor: 1 });
    check('desktop default aria-pressed=true', (await toggle(page).getAttribute('aria-pressed')) === 'true');
    check('mascot root aria-hidden', (await page.locator('[data-mascot-root]').getAttribute('aria-hidden')) === 'true');
    check('no focusable inside mascot', (await page.locator('[data-mascot-root] a, [data-mascot-root] button, [data-mascot-root] [tabindex]').count()) === 0);
    await page.mouse.move(300, 620); // toward the primary CTA area so the eyes visibly look left
    await sleep(400);
    const withLayout = await layoutProbe(page);
    await page.screenshot({ path: `${outDir}/with.png`, fullPage: false });
    await toggle(page).click();
    await sleep(300);
    check('toggle off → aria-pressed=false', (await toggle(page).getAttribute('aria-pressed')) === 'false');
    check('mascot unmounted when off', (await page.locator('[data-mascot-root]').count()) === 0);
    const withoutLayout = await layoutProbe(page);
    check('no layout shift on toggle', JSON.stringify(withLayout) === JSON.stringify(withoutLayout), `${withLayout} vs ${withoutLayout}`);
    await page.mouse.move(300, 620);
    await page.screenshot({ path: `${outDir}/without.png`, fullPage: false });
    check('desktop console errors = 0', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // 2. Reactions, close-ups at 2x.
  {
    const { page, errors } = await open({ deviceScaleFactor: 2 });
    await page.evaluate(() => window.scrollTo(0, 260));
    await sleep(300);
    await page.mouse.move(1200, 200);
    await sleep(300);
    await closeUp(page, 'idle-look-up');
    await page.locator('[data-mascot="dg-001"]').hover();
    await sleep(700);
    check('hover DG-001 → strip DG-001', (await strip(page)) === 'DG-001');
    check('hover DG-001 → 7 pins lit', (await litPins(page)) === 7, `lit=${await litPins(page)}`);
    await closeUp(page, 'dg-001');
    await page.locator('[data-mascot="dg-002"]').hover();
    await sleep(150);
    const midWord = await strip(page);
    await sleep(1100);
    check('hover DG-002 → RSVP then DG-002', ['one', 'word', 'at', 'a', 'time'].includes(midWord) && (await strip(page)) === 'DG-002', `mid=${midWord}`);
    await closeUp(page, 'dg-002');
    await page.mouse.move(700, 120);
    await page.evaluate(() => document.querySelector('a[data-mascot="join"]').focus());
    await sleep(300);
    check('focus join CTA (keyboard) → THU 6PM', (await strip(page)) === 'THU 6PM');
    await closeUp(page, 'join');
    const m = await page.locator('[data-mascot-root]').boundingBox();
    await page.mouse.click(m.x + m.width / 2, m.y + m.height / 2);
    await sleep(300);
    const poke = await strip(page);
    check('poke → REVIEW', poke === 'REVIEW', poke);
    await closeUp(page, 'poke');
    for (let i = 0; i < 3; i += 1) {
      await page.mouse.click(m.x + m.width / 2, m.y + m.height / 2);
      await sleep(120);
    }
    check('4 quick pokes → RETEST', (await strip(page)) === 'RETEST');
    await closeUp(page, 'dizzy');
    await sleep(1300);
    // Pause freezes.
    await page.getByRole('button', { name: 'Pause motion' }).click();
    await page.locator('[data-mascot="dg-001"]').hover();
    await sleep(500);
    check('paused → ignores page events', (await strip(page)) === '—');
    check('console errors = 0 (reactions)', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // 3. Reduced motion: default OFF; opt-in renders a still version.
  {
    const { page, errors } = await open({ reducedMotion: 'reduce' });
    check('reduced motion default off', (await toggle(page).getAttribute('aria-pressed')) === 'false');
    await toggle(page).click();
    await sleep(300);
    check('reduced motion opt-in mounts mascot', (await page.locator('[data-mascot-root]').count()) === 1);
    check('reduced console errors = 0', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // 4. Touch / coarse pointer: OFF, toggle aria-disabled, never mounts.
  {
    const { page, errors } = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    check('touch: aria-disabled', (await toggle(page).getAttribute('aria-disabled')) === 'true');
    await toggle(page).click({ force: true });
    await sleep(300);
    check('touch: mascot never mounts', (await page.locator('[data-mascot-root]').count()) === 0);
    const touch44 = await toggle(page).boundingBox();
    check('touch target ≥ 44px', touch44.height >= 44, `${touch44.height}px`);
    check('touch console errors = 0', errors.length === 0, errors.join(' | '));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(results.join('\n'));
if (results.some((r) => r.startsWith('FAIL'))) process.exitCode = 1;
