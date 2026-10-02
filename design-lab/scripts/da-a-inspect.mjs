// DA-A helper: viewport-sized slices of /design-lab/a + layout probes + optional interaction checks.
// Usage: node design-lab/scripts/da-a-inspect.mjs <outDir> <width> <height> [--slices=n] [--reduced] [--nojs] [--interact]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [outDir = 'design-lab/renders/a/inspect', w = '1440', h = '900', ...flags] = process.argv.slice(2);
const slices = Number((flags.find((f) => f.startsWith('--slices=')) ?? '--slices=0').split('=')[1]);
const reduced = flags.includes('--reduced');
const nojs = flags.includes('--nojs');
const interact = flags.includes('--interact');
const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/a/';

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  for (const d of readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: shell() });
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  javaScriptEnabled: !nojs,
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1800);

const probe = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  colophonTop: document.querySelector('footer')?.getBoundingClientRect().top ?? null,
  smallTargets: [...document.querySelectorAll('a, button')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.height < 44 || r.width < 24);
    })
    .map((el) => `${el.tagName}:${(el.textContent ?? '').trim().slice(0, 30)}:${Math.round(el.getBoundingClientRect().height)}`),
}));
console.log(JSON.stringify(probe, null, 1));

for (let i = 0; i < slices; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * Number(h));
  await page.waitForTimeout(1300);
  await page.screenshot({ path: join(outDir, `slice-${w}-${String(i).padStart(2, '0')}.png`) });
}

if (interact) {
  await page.evaluate(() => document.querySelector('#work')?.scrollIntoView());
  const btn = page.getByRole('button', { name: /Read it/ });
  await btn.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /^300/ }).click();
  await btn.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(outDir, `rsvp-playing-${w}.png`) });
  console.log('rsvp word mid-play:', await page.locator('p[aria-live]').innerText());
  await page.keyboard.press('Tab');
  await page.screenshot({ path: join(outDir, `focus-${w}.png`) });
}

console.log('console errors:', errors.length, errors.slice(0, 5));
await browser.close();
