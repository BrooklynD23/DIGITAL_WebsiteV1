// CRIT-6 (F critiques A): fold checks, load-motion frames, scroll video, DOM facts.
// Read-only against /design-lab/a. Usage: node design-lab/scripts/crit6-a-check.mjs [outDir]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/critiques/a-by-f';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const route = '/design-lab/a/';
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

const DESK = { viewport: { width: 1440, height: 900 } };
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const browser = await chromium.launch({ executablePath: headlessShell() });
const errors = [];

async function facts(page) {
  return page.evaluate(() => {
    const vh = window.innerHeight;
    const box = (el) => (el ? el.getBoundingClientRect() : null);
    const thesis = box(document.querySelector('h1'));
    const links = [...document.querySelectorAll('a')]
      .map((a) => ({ t: a.textContent.trim(), r: a.getBoundingClientRect(), vis: a.offsetParent !== null }))
      .filter((l) => l.vis && l.r.top < vh && l.r.bottom > 0 && l.r.height > 0)
      .map((l) => `${l.t} @${Math.round(l.r.top)}`);
    const text = document.body.innerText;
    const count = (s) => text.split(s).length - 1;
    return {
      vh,
      docHeight: document.documentElement.scrollHeight,
      thesisTop: thesis && Math.round(thesis.top),
      thesisBottom: thesis && Math.round(thesis.bottom),
      thesisFont: getComputedStyle(document.querySelector('h1')).fontSize,
      linksInFold: links,
      joinTop: Math.round(document.querySelector('#join')?.getBoundingClientRect().top ?? -1),
      mentions: {
        'Systems Architecture': count('Systems Architecture'),
        'Integration / Testing': count('Integration / Testing'),
        'Built by / owner blanks': document.querySelectorAll('[class*="signLine"]').length,
      },
    };
  });
}

try {
  // 1. Desktop: load frames of the hero cut reveal + signature rule.
  {
    const ctx = await browser.newContext({ ...DESK, recordVideo: { dir: outDir, size: { width: 1440, height: 900 } } });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`desk: ${m.text()}`));
    const t0 = Date.now();
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    for (const ms of [150, 600, 1200, 2200]) {
      const wait = ms - (Date.now() - t0);
      if (wait > 0) await page.waitForTimeout(wait);
      await page.screenshot({ path: join(outDir, `load-desk-${ms}ms.png`) });
    }
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(outDir, 'fold-desk.png') });
    console.log('DESK', JSON.stringify(await facts(page), null, 1));
    // Smooth scroll through the page for the motion video.
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      for (let y = 0; y <= max; y += 60) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForTimeout(600);
    // Rules spread state after reveal.
    await page.locator('#rules').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(outDir, 'rules-desk.png') });
    const v = page.video();
    await ctx.close();
    if (v) renameSync(await v.path(), join(outDir, 'scroll-desk.webm'));
  }
  // 2. Mobile fold.
  {
    const ctx = await browser.newContext(MOB);
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`mob: ${m.text()}`));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: join(outDir, 'fold-mob.png') });
    console.log('MOB', JSON.stringify(await facts(page), null, 1));
    await ctx.close();
  }
  // 3. Reduced-motion desktop fold (should be final at first frame).
  {
    const ctx = await browser.newContext({ ...DESK, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    await page.screenshot({ path: join(outDir, 'load-desk-reduced-150ms.png') });
    await ctx.close();
  }
} finally {
  await browser.close();
  console.log('console errors:', errors.length, errors.slice(0, 5));
}
