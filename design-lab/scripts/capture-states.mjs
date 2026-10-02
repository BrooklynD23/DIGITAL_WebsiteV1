// One-off capture (W1-AUDIT). Does NOT replace shoot.mjs.
// Captures what scroll-driven / reveal-gated sections actually look like:
//   1. home: wait out the loader, instant-scroll so IntersectionObserver reveals fire, then full-page.
//   2. about / get-involved / projects / community: their [data-reveal] blocks never get revealed
//      (no useReveal call), so we FORCE .is-visible to show the intended content. Files are suffixed "-forced".
//   3. modular-smartphone + smart-reading: viewport shots at representative scroll positions
//      (sticky/pinned stages cannot be represented by a full-page capture).
// Usage: node design-lab/scripts/capture-states.mjs [outDir]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/renders/current/states';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
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

const VP = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const browser = await chromium.launch({
  executablePath: headlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

async function open(route, vpName) {
  const page = await browser.newPage(VP[vpName]);
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  return page;
}

async function instantScrollThrough(page, pause = 220) {
  await page.evaluate(async (ms) => {
    const step = window.innerHeight * 0.6;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, ms));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, pause);
}

const log = (m) => console.log(m);

try {
  // 1. Home — revealed state.
  for (const vp of ['desktop', 'mobile']) {
    const page = await open('/', vp);
    await page.waitForTimeout(2600); // loader (1900ms) + observer start (+200ms)
    await instantScrollThrough(page);
    await page.waitForTimeout(1800);
    const hidden = await page.evaluate(() => document.querySelectorAll('[data-reveal]:not(.is-visible)').length);
    await page.screenshot({ path: join(outDir, `home-revealed-${vp}.png`), fullPage: true });
    log(`home-revealed-${vp}.png (unrevealed after scroll: ${hidden})`);
    await page.close();
  }

  // 2. Secondary routes — forced reveal.
  for (const [route, label] of [
    ['/about/', 'about'],
    ['/get-involved/', 'get-involved'],
    ['/projects/', 'projects'],
    ['/community/', 'community'],
  ]) {
    for (const vp of ['desktop', 'mobile']) {
      const page = await open(route, vp);
      await page.waitForTimeout(800);
      const n = await page.evaluate(() => {
        const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
        els.forEach((el) => el.classList.add('is-visible'));
        return els.length;
      });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: join(outDir, `${label}-forced-${vp}.png`), fullPage: true });
      log(`${label}-forced-${vp}.png (forced ${n} hidden blocks visible)`);
      await page.close();
    }
  }

  // 3a. Modular smartphone — viewport states per subsystem article.
  for (const vp of ['desktop', 'mobile']) {
    const page = await open('/projects/modular-smartphone/', vp);
    await page.waitForTimeout(3500); // loader sequence
    await page.screenshot({ path: join(outDir, `phone-${vp}-00-hero.png`) });
    const tops = await page.evaluate(() =>
      [...document.querySelectorAll('article')].map((a) => a.getBoundingClientRect().top + window.scrollY)
    );
    const picks = vp === 'desktop' ? tops : tops.filter((_, i) => i % 3 === 0);
    let i = 1;
    for (const y of picks) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), Math.max(0, y - 80));
      await page.waitForTimeout(1400);
      await page.screenshot({ path: join(outDir, `phone-${vp}-${String(i).padStart(2, '0')}-article.png`) });
      i += 1;
    }
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(1800);
    await page.screenshot({ path: join(outDir, `phone-${vp}-99-end.png`) });
    log(`phone-${vp}: ${picks.length} article states (${tops.length} articles found)`);
    await page.close();
  }

  // 3b. Smart Reading — fractions of the 460vh scroll container.
  for (const vp of ['desktop', 'mobile']) {
    const page = await open('/projects/smart-reading/', vp);
    await page.waitForTimeout(3000);
    const fonts = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        h1Family: h1 ? getComputedStyle(h1).fontFamily : null,
        archivoLoaded: document.fonts.check('700 40px Archivo'),
      };
    });
    log(`smart-reading ${vp} fonts: ${JSON.stringify(fonts)}`);
    const fracs = vp === 'desktop' ? [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] : [0, 0.3, 0.6, 0.9, 1];
    for (const f of fracs) {
      await page.evaluate((fr) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.round(max * fr), behavior: 'instant' });
      }, f);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: join(outDir, `glasses-${vp}-${String(Math.round(f * 100)).padStart(3, '0')}.png`) });
    }
    log(`glasses-${vp}: ${fracs.length} states`);
    await page.close();
  }
} finally {
  await browser.close();
}
