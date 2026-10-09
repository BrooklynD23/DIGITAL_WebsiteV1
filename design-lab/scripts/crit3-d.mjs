// CRIT-3 (C critiques D): fresh section captures + measurements for /design-lab/d.
// Usage: node design-lab/scripts/crit3-d.mjs [outDir]
// Read-only: loads the page, screenshots sections at 1440 and 390, prints JSON metrics.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/critiques/crit3-d';
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

const SECTIONS = [
  ['hero', 'section[aria-labelledby="d-hero-h"]'],
  ['become', 'section[aria-labelledby="d-become-h"]'],
  ['work', '#work'],
  ['how', '#how'],
  ['seats', '#seats'],
  ['join', '#join'],
  ['footer', 'footer'],
];

const browser = await chromium.launch({ executablePath: shell() });
const report = {};
try {
  for (const [label, vp] of [
    ['desk', { width: 1440, height: 900 }],
    ['mob', { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')));
    // scroll-prime the draw-on
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);

    // first-viewport capture
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(outDir, `${label}-fold.png`) });

    for (const [name, sel] of SECTIONS) {
      const el = page.locator(sel).first();
      if ((await el.count()) === 0) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await el.screenshot({ path: join(outDir, `${label}-${name}.png`) });
    }

    const metrics = await page.evaluate((sections) => {
      const px = (el, p) => (el ? getComputedStyle(el).getPropertyValue(p) : null);
      const out = { scrollHeight: document.documentElement.scrollHeight };
      out.sectionHeights = Object.fromEntries(
        sections.map(([n, s]) => {
          const el = document.querySelector(s);
          return [n, el ? Math.round(el.getBoundingClientRect().height) : null];
        }),
      );
      const h1 = document.querySelector('h1');
      out.h1 = { size: px(h1, 'font-size'), lh: px(h1, 'line-height'), family: px(h1, 'font-family')?.slice(0, 40) };
      const h2 = document.querySelector('h2');
      out.h2 = { size: px(h2, 'font-size') };
      // hand font usage count
      out.handFontEls = [...document.querySelectorAll('#concept-d *')].filter((e) => {
        const f = getComputedStyle(e).fontFamily;
        return /caveat|hand/i.test(f) && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      }).map((e) => e.textContent.trim().slice(0, 30));
      // blank signature lines
      out.blanks = document.querySelectorAll('[class*="blank"]').length;
      out.builtByText = (document.body.innerText.match(/built by/gi) || []).length;
      out.placeholderText = (document.body.innerText.match(/\[placeholder\]/g) || []).length;
      // smallest font sizes in visible text
      const sizes = {};
      for (const e of document.querySelectorAll('#concept-d *')) {
        if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const r = e.getBoundingClientRect();
        if (!r.width) continue;
        const fs = parseFloat(getComputedStyle(e).fontSize);
        if (fs < 13) sizes[fs] = (sizes[fs] || 0) + 1;
      }
      out.textUnder13px = sizes;
      // touch targets
      const small = [];
      for (const a of document.querySelectorAll('#concept-d a, #concept-d button, #concept-d label')) {
        const r = a.getBoundingClientRect();
        if (r.width && (r.height < 44 || r.width < 24)) small.push(`${a.tagName}:${a.textContent.trim().slice(0, 24)}:${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      out.smallTargets = small;
      out.overflowX = document.documentElement.scrollWidth - window.innerWidth;
      // photo caption sizes
      const cap = document.querySelector('figcaption');
      out.captionSize = px(cap, 'font-size');
      out.captionColor = px(cap, 'color');
      // nav visible links
      out.navLinksVisible = [...document.querySelectorAll('header nav a')].filter((a) => a.getBoundingClientRect().width > 0).length;
      // record field label sizes
      const dt = document.querySelector('dt');
      out.dt = { size: px(dt, 'font-size'), color: px(dt, 'color') };
      const ph = document.querySelector('[class*="ph"]');
      out.placeholderStyle = { size: px(ph, 'font-size'), color: px(ph, 'color') };
      return out;
    }, SECTIONS);

    // keyboard: focus ring on first seat radio
    const seat = page.locator('input[name="d-seat"]').first();
    await seat.scrollIntoViewIfNeeded();
    await seat.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    await page.locator('#seats').screenshot({ path: join(outDir, `${label}-seats-key.png`) });
    metrics.focusedSeat = await page.evaluate(() => document.activeElement?.getAttribute('value'));

    metrics.consoleErrors = errors;
    report[label] = metrics;
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
