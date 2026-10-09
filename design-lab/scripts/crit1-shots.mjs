// CRIT-1 (A critiques B): section crops, measurements and a short motion recording of /design-lab/b.
// Usage: node design-lab/scripts/crit1-shots.mjs [outDir]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const out = process.argv[2] ?? 'design-lab/renders/b/crit';
mkdirSync(out, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const URL = 'http://localhost:3100/design-lab/b';

async function crops(width, height, label, ids, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: join(out, `${label}-fold.png`) });
  for (const id of ids) {
    const el = await page.$(`#${id}`);
    if (!el) continue;
    await el.scrollIntoViewIfNeeded();
    await page.evaluate((i) => document.getElementById(i).scrollIntoView({ block: 'start' }), id);
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(out, `${label}-${id}.png`) });
  }
  const m = await page.evaluate(() => {
    const vis = (el) => el.getBoundingClientRect().width > 0;
    const svgTexts = [...document.querySelectorAll('figure svg text')].filter(vis);
    const px = svgTexts.map((t) => +(t.getBoundingClientRect().height).toFixed(1));
    const fig1 = [...document.querySelectorAll('#top figure svg')].find(vis);
    const fig1Texts = fig1 ? [...fig1.querySelectorAll('text')].map((t) => t.getBoundingClientRect().height) : [];
    const targets = [...document.querySelectorAll('#lab-b a, #lab-b button, #lab-b summary')]
      .filter(vis)
      .map((e) => ({ t: (e.textContent || '').trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height) }))
      .filter((x) => x.h < 44);
    const fig = document.querySelector('#top figure');
    const body = document.body.innerText;
    return {
      height: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      fig1Top: fig ? Math.round(fig.getBoundingClientRect().top + window.scrollY) : null,
      workTop: Math.round(document.getElementById('work').getBoundingClientRect().top + window.scrollY),
      joinTop: Math.round(document.getElementById('join').getBoundingClientRect().top + window.scrollY),
      fig1TextPxMin: fig1Texts.length ? Math.min(...fig1Texts).toFixed(1) : null,
      svgTextPxMin: px.length ? Math.min(...px) : null,
      confirmCount: (body.match(/\[confirm\]/g) || []).length,
      placeholderCount: (body.match(/\[placeholder\]/g) || []).length,
      blankCount: (body.match(/______/g) || []).length,
      redOpenCount: (body.match(/\bopen\b/gi) || []).length,
      smallTargets: targets,
      h1Size: getComputedStyle(document.querySelector('h1')).fontSize,
    };
  });
  console.log(label, JSON.stringify(m), `errors=${errors.length}`);
  await ctx.close();
}

try {
  await crops(1440, 900, 'd', ['work', 'dg-001', 'dg-002', 'vs', 'process', 'join']);
  await crops(834, 1112, 't', ['work', 'process']);
  await crops(390, 844, 'm', ['work', 'dg-001', 'dg-002', 'process', 'join'], { isMobile: true, hasTouch: true });

  // motion: hero draw-in + RSVP readout, recorded at 1440
  const vctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
  const vp = await vctx.newPage();
  await vp.goto(URL, { waitUntil: 'domcontentloaded' });
  await vp.waitForTimeout(2600);
  await vp.hover('svg[aria-describedby$="-w-desc"] a[href="#sub-apps-ux"]').catch(() => {});
  await vp.waitForTimeout(900);
  await vp.mouse.move(10, 880);
  await vp.evaluate(() => document.querySelector('#fig3-title')?.scrollIntoView({ block: 'center' }));
  await vp.waitForTimeout(3500);
  const video = vp.video();
  await vctx.close();
  if (video) {
    const p = await video.path();
    renameSync(p, join(out, 'b-motion.webm'));
    console.log('video', join(out, 'b-motion.webm'));
  }
} finally {
  await browser.close();
}
