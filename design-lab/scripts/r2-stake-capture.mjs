// Usage: node design-lab/scripts/r2-stake-capture.mjs <jobFilter...>
// Stakeholder comparison captures: first viewport + scroll steps at 1440x900 (4 frames) and 390x844 (3 frames),
// taken at real scroll positions (fractions of the scrollable height), progressive scroll so reveals/pins fire.
// Jobs: prod-home prod-sidekick prod-shades | signal-home apple-home signal-sidekick ... apple-brain
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const OUT = 'design-lab/round2/stakeholder/captures';
const PROD = process.env.PROD_URL ?? 'https://digitalcpp.vercel.app';
const LAB = process.env.LAB_URL ?? 'http://localhost:3100';

const JOBS = {
  'prod-home': `${PROD}/`,
  'prod-sidekick': `${PROD}/projects/modular-smartphone/`,
  'prod-shades': `${PROD}/projects/smart-reading/`,
};
for (const w of ['signal', 'apple']) {
  JOBS[`${w}-home`] = `${LAB}/design-lab/r2/${w}/`;
  for (const p of ['sidekick', 'shades', 'brain']) JOBS[`${w}-${p}`] = `${LAB}/design-lab/r2/${w}/${p}/`;
}

const VIEWPORTS = [
  { tag: 'd', width: 1440, height: 900, steps: [0, 0.25, 0.5, 0.75] },
  { tag: 'm', width: 390, height: 844, steps: [0, 0.33, 0.66], isMobile: true, hasTouch: true },
];

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

async function scrollTo(page, target) {
  await page.evaluate(async (t) => {
    const step = window.innerHeight * 0.4;
    let y = window.scrollY;
    while (Math.abs(t - y) > 1) {
      y = t > y ? Math.min(t, y + step) : Math.max(t, y - step);
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 90));
    }
  }, target);
}

const filters = process.argv.slice(2);
const jobs = Object.entries(JOBS).filter(([k]) => filters.length === 0 || filters.some((f) => k.startsWith(f)));
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: findHeadlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  for (const [key, url] of jobs) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile ?? false,
        hasTouch: vp.hasTouch ?? false,
        deviceScaleFactor: 1,
      });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 }).catch((e) => ({ status: () => `ERR ${e.message}` }));
      await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' }).catch(() => {});
      await page.waitForTimeout(4500); // loaders, hero clips (play once), intro reveals
      const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      for (let i = 0; i < vp.steps.length; i += 1) {
        const target = Math.round(max * vp.steps[i]);
        if (i > 0) {
          await scrollTo(page, target);
          await page.waitForTimeout(2200);
        }
        const file = join(OUT, `${key}-${vp.tag}-${i}.png`);
        await page.screenshot({ path: file });
        const y = await page.evaluate(() => Math.round(window.scrollY));
        console.log(`${file} status=${res.status()} y=${y}/${max}${errors.length ? ` errors=${errors.length}: ${errors[0].slice(0, 120)}` : ''}`);
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
