// A11Y-RESP keyboard-only walk of each concept's primary interaction (1440x900, no mouse).
// Usage: node design-lab/scripts/a11y-keyboard.mjs [slug ...]
// Logs every live-region / role=status text change (what a screen reader would announce) and the focused element per step.
// Writes design-lab/renders/a11y/<slug>/keyboard.json + kbd-*.png. Read-only against the app.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.LAB_URL ?? 'http://localhost:3100';
const OUT = 'design-lab/renders/a11y';

function headlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const ANNOUNCE_HOOK = () => {
  window.__ann = [];
  const last = new WeakMap();
  const sel = '[aria-live]:not([aria-live="off"]), [role=status], [role=alert], [role=log]';
  const check = (node) => {
    const el = node.nodeType === 1 ? node : node.parentElement;
    const region = el?.closest?.(sel);
    if (!region) return;
    const text = (region.textContent || '').trim().replace(/\s+/g, ' ');
    if (text && last.get(region) !== text) {
      last.set(region, text);
      window.__ann.push(text.slice(0, 220));
    }
  };
  new MutationObserver((ms) => ms.forEach((m) => { check(m.target); m.addedNodes.forEach(check); })).observe(document, {
    subtree: true, childList: true, characterData: true,
  });
};

async function focused(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return '(body)';
    const a = (k) => (el.getAttribute(k) != null ? ` ${k}=${el.getAttribute(k)}` : '');
    const name = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const checked = el.type === 'radio' || el.type === 'checkbox' ? ` checked=${el.checked}` : '';
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''} "${name}"${a('aria-pressed')}${a('aria-expanded')}${a('aria-disabled')}${checked}`;
  });
}

async function drain(page) {
  return page.evaluate(() => { const a = window.__ann.slice(); window.__ann.length = 0; return a; });
}

/** Press Tab until the active element matches `test` (evaluated in page). Returns presses used or -1. */
async function tabTo(page, test, max = 120) {
  for (let i = 1; i <= max; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(60);
    const ok = await page.evaluate(test);
    if (ok) return i;
  }
  return -1;
}

function logger(steps) {
  return async (page, label, extra = {}) => {
    await page.waitForTimeout(extra.wait ?? 500);
    steps.push({ step: label, focus: await focused(page), announced: await drain(page), ...(extra.probe ? { state: await page.evaluate(extra.probe) } : {}) });
  };
}

const SCENARIOS = {
  async a(page, dir, log) {
    const n = await tabTo(page, () => document.activeElement?.textContent?.trim() === 'Read it');
    await log(page, `Tab x${n} to RSVP "Read it"`);
    await page.keyboard.press('Enter');
    await log(page, 'Enter (play)', { wait: 900, probe: () => document.querySelector('[class*=rsvpWord]')?.textContent });
    await page.screenshot({ path: join(dir, 'kbd-rsvp.png') });
    await page.keyboard.press('Enter');
    await log(page, 'Enter (pause)');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await log(page, 'Tab x2 + Space on pace 300', { probe: () => [...document.querySelectorAll('[aria-label="Pace in words per minute"] button')].map((b) => `${b.textContent}:${b.getAttribute('aria-pressed')}`).join(' ') });
  },
  async b(page, dir, log) {
    const n = await tabTo(page, () => /Hardware/.test(document.activeElement?.textContent || '') && document.activeElement?.closest('[role=group]'));
    await log(page, `Tab x${n} to build-run S2 Hardware tab`);
    await page.keyboard.press('Enter');
    await log(page, 'Enter (select S2)', { probe: () => [...document.querySelectorAll('[class*=runTab]')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent).join() });
    await page.keyboard.press('ArrowRight');
    await log(page, 'ArrowRight (no roving tabindex expected)');
    await page.screenshot({ path: join(dir, 'kbd-buildrun.png') });
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
    const m = await tabTo(page, () => document.activeElement?.closest('[class*=filters]') && /Open/i.test(document.activeElement.textContent || ''));
    await log(page, `Tab x${m} to project filter "Open"`);
    await page.keyboard.press('Enter');
    await log(page, 'Enter (filter)', { probe: () => document.querySelectorAll('table tbody tr:not([hidden])').length + ' rows visible' });
  },
  async c(page, dir, log) {
    const n = await tabTo(page, () => document.activeElement?.name === 'c-formation');
    await log(page, `Tab x${n} to formation radio`);
    await page.keyboard.press('ArrowDown');
    await log(page, 'ArrowDown (DG-002)', { wait: 900, probe: () => document.querySelector('[data-formation]')?.getAttribute('data-formation') });
    await page.screenshot({ path: join(dir, 'kbd-formation.png') });
    await page.keyboard.press('ArrowUp');
    await log(page, 'ArrowUp (back to DG-001)', { wait: 900, probe: () => document.querySelector('[data-formation]')?.getAttribute('data-formation') });
    const m = await tabTo(page, () => document.activeElement?.closest('[aria-label="Subsystem layers"]'), 30);
    await log(page, `Tab x${m} to first subsystem layer button`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await log(page, 'Tab + Enter (pin layer 2)', { probe: () => document.querySelector('[class*=legendReadout]')?.textContent?.slice(0, 80) });
    await page.screenshot({ path: join(dir, 'kbd-layer.png') });
    const k = await tabTo(page, () => /Still/.test(document.activeElement?.textContent || ''), 20);
    await page.keyboard.press('Enter');
    await log(page, `Tab x${k} + Enter on Render "Still"`, { probe: () => [...document.querySelectorAll('[aria-labelledby="c-render-label"] button')].map((b) => `${b.textContent}:${b.getAttribute('aria-pressed')}:${b.disabled}`).join(' ') });
  },
  async d(page, dir, log) {
    const n = await tabTo(page, () => document.activeElement?.name === 'd-seat');
    await log(page, `Tab x${n} to seat radio`, { probe: () => [...document.querySelectorAll('[data-seat]')].filter((p) => getComputedStyle(p).display !== 'none').map((p) => p.dataset.seat).join() });
    await page.keyboard.press('ArrowRight');
    await log(page, 'ArrowRight (seat 2)', { probe: () => [...document.querySelectorAll('[data-seat]')].filter((p) => getComputedStyle(p).display !== 'none').map((p) => p.dataset.seat).join() });
    await page.keyboard.press('ArrowRight');
    await log(page, 'ArrowRight (seat 3)', { probe: () => [...document.querySelectorAll('[data-seat]')].filter((p) => getComputedStyle(p).display !== 'none').map((p) => p.dataset.seat).join() });
    await page.evaluate(() => document.activeElement?.closest('fieldset')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(dir, 'kbd-seat.png') });
    await page.keyboard.press('Tab');
    await log(page, 'Tab (leaves group: where does focus go?)');
  },
  async e(page, dir, log) {
    const n = await tabTo(page, () => document.activeElement?.getAttribute('aria-haspopup') === 'dialog');
    await log(page, `Tab x${n} to ledger row`);
    await page.keyboard.press('Enter');
    await log(page, 'Enter (open brief)', { wait: 1000, probe: () => ({ dialog: !!document.querySelector('[role=dialog]'), focusInside: !!document.activeElement?.closest('[role=dialog]') }) });
    await page.screenshot({ path: join(dir, 'kbd-dialog.png') });
    const trap = [];
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(80);
      trap.push(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
    }
    await log(page, `Tab x6 inside dialog (all inside: ${trap.every(Boolean)})`);
    await page.keyboard.press('Shift+Tab');
    await log(page, 'Shift+Tab', { probe: () => !!document.activeElement?.closest('[role=dialog]') });
    await page.keyboard.press('Escape');
    await log(page, 'Escape', { wait: 1000, probe: () => ({ dialog: !!document.querySelector('[role=dialog]'), returnedTo: document.activeElement?.getAttribute('aria-haspopup') }) });
  },
  async f(page, dir, log) {
    const n = await tabTo(page, () => document.activeElement?.id === 'f-sign');
    await log(page, `Tab x${n} to sign field`);
    await page.keyboard.type('Ada');
    await log(page, 'Type "Ada"');
    const m = await tabTo(page, () => /^Your name tag/.test(document.activeElement?.getAttribute('aria-label') || ''), 40);
    await log(page, `Tab x${m} to draggable name tag`, { probe: () => document.activeElement?.getAttribute('aria-describedby') && document.getElementById(document.activeElement.getAttribute('aria-describedby'))?.textContent?.slice(0, 120) });
    await page.keyboard.press('Space');
    await log(page, 'Space (pick up)');
    await page.keyboard.press('ArrowRight');
    await log(page, 'ArrowRight');
    await page.keyboard.press('ArrowRight');
    await log(page, 'ArrowRight');
    await page.keyboard.press('Space');
    await log(page, 'Space (drop)', { wait: 800, probe: () => document.querySelector('[class*=seatDetail]')?.textContent?.slice(0, 100) });
    await page.screenshot({ path: join(dir, 'kbd-dropped.png') });
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
    const k = await tabTo(page, () => /^Put Ada here/.test(document.activeElement?.textContent || ''), 80);
    await page.keyboard.press('Enter');
    await log(page, `Tab x${k} + Enter on seat button "Put Ada here"`, { wait: 800, probe: () => document.querySelector('[class*=seatDetail]')?.textContent?.slice(0, 100) });
  },
  async mascot(page, dir, log) {
    const n = await tabTo(page, () => /^Mascot/.test(document.activeElement?.textContent || ''));
    await log(page, `Tab x${n} to Mascot toggle`);
    await page.keyboard.press('Enter');
    await log(page, 'Enter (toggle)', { wait: 1500, probe: () => document.getElementById('mascot-lab-status')?.textContent });
    await page.screenshot({ path: join(dir, 'kbd-mascot-on.png') });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await log(page, 'Tab + Enter (Pause motion)');
    const k = await tabTo(page, () => document.activeElement?.dataset?.mascot === 'join', 20);
    await log(page, `Tab x${k} to a mascot-reactive CTA (does mascot react to focus?)`, { wait: 800, probe: () => document.querySelector('[class*=mascot] [data-state], [data-mascot-state]')?.outerHTML?.slice(0, 120) ?? 'no state attr found' });
  },
};

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SCENARIOS);
const browser = await chromium.launch({ executablePath: headlessShell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const slug of slugs) {
    const dir = join(OUT, slug);
    mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(ANNOUNCE_HOOK);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
    await page.goto(`${BASE}/design-lab/${slug}/`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2500);
    await drain(page);
    const steps = [];
    let failure = null;
    try {
      await SCENARIOS[slug](page, dir, logger(steps));
    } catch (e) {
      failure = String(e).slice(0, 300);
    }
    writeFileSync(join(dir, 'keyboard.json'), JSON.stringify({ slug, steps, failure, errors }, null, 2));
    console.log(`\n== ${slug}${failure ? `  FAILURE: ${failure}` : ''}`);
    for (const s of steps) console.log(`- ${s.step} | ${s.focus} | ann=${JSON.stringify(s.announced)}${s.state !== undefined ? ` | state=${JSON.stringify(s.state)}` : ''}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
