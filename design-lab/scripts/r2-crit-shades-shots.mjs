// W2-CRIT-SHADES evidence: 10 evenly spaced viewport stills per world at 1440x900 and 390x844,
// plus a 1440x900 recordVideo webm per world: load -> full scroll -> reader (Read, Pause, step, More spacing).
// Usage: node design-lab/scripts/r2-crit-shades-shots.mjs [--reduced] [--novideo] [--worlds=signal,apple]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const flags = process.argv.slice(2);
const reduced = flags.includes('--reduced');
const noVideo = flags.includes('--novideo');
const worlds = (flags.find((f) => f.startsWith('--worlds='))?.split('=')[1] ?? 'signal,apple').split(',');
const OUT = 'design-lab/renders/r2/crit/shades';
mkdirSync(OUT, { recursive: true });
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const tag = reduced ? '-rm' : '';
const VPS = [
  { n: '1440', width: 1440, height: 900 },
  { n: '390', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

for (const world of worlds) {
  const url = `${base}/design-lab/r2/${world}/shades/`;
  for (const vp of VPS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch,
      deviceScaleFactor: vp.deviceScaleFactor ?? 1, reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(3000);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const max = H - vp.height;
    for (let i = 0; i < 10; i += 1) {
      const target = Math.round((i / 9) * max);
      // walk there in 4 hops so IO / scroll drives settle like a real scroll
      const from = await page.evaluate(() => window.scrollY);
      for (let k = 1; k <= 4; k += 1) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(from + ((target - from) * k) / 4));
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/${world}-${vp.n}${tag}-step${String(i).padStart(2, '0')}.png` });
    }
    console.log(JSON.stringify({ world, vp: vp.n, reduced, scrollHeight: H, vh: (H / vp.height).toFixed(2), errors }));
    await ctx.close();
  }

  if (noVideo) continue;
  const vdir = `${OUT}/video-tmp-${world}${tag}`;
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference',
    recordVideo: { dir: vdir, size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(3000);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H - 900; y += 45) {
    await page.mouse.wheel(0, 45);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(800);
  // reader interaction
  await page.evaluate(() => document.querySelector('#reader')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(900);
  const primary = page.locator('#reader [aria-keyshortcuts="K"]');
  await primary.click();
  await page.waitForTimeout(reduced ? 600 : 4200);
  if (reduced) {
    for (let k = 0; k < 4; k += 1) { await primary.click(); await page.waitForTimeout(500); }
  } else {
    await primary.click(); // pause
    await page.waitForTimeout(700);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
  }
  await page.locator('#reader button[aria-pressed]').first().click(); // More spacing
  await page.waitForTimeout(1200);
  await page.locator('#reader input[type=range]').focus();
  for (let k = 0; k < 8; k += 1) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); }
  if (!reduced) { await primary.click(); await page.waitForTimeout(2500); await primary.click(); }
  await page.waitForTimeout(800);
  const vpath = await page.video().path();
  await ctx.close();
  renameSync(vpath, `${OUT}/${world}${tag}.webm`);
  console.log('video', `${OUT}/${world}${tag}.webm`);
}
await browser.close();
