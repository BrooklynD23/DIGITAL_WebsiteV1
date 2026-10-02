// DA-C interaction check + motion recording for /design-lab/c.
// Usage: node design-lab/scripts/da-c-interact.mjs <outDir> [--video] [--mobile] [--query=?fx=off]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [outDir = 'design-lab/renders/c/v1', ...flags] = process.argv.slice(2);
const video = flags.includes('--video');
const mobile = flags.includes('--mobile');
const qFlag = flags.find((f) => f.startsWith('--query='));
const query = qFlag ? qFlag.slice('--query='.length) : '';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const tag = mobile ? 'm' : 'd';

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

mkdirSync(outDir, { recursive: true });
const vidDir = join(outDir, '_video');
const browser = await chromium.launch({
  executablePath: findHeadlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const ctx = await browser.newContext({
  viewport,
  isMobile: mobile,
  hasTouch: mobile,
  deviceScaleFactor: 1,
  ...(video ? { recordVideo: { dir: vidDir, size: viewport } } : {}),
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const shot = (name) => page.screenshot({ path: join(outDir, `state-${tag}-${name}.png`) });

await page.goto(`${base}/design-lab/c/${query}`, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3500);
const liveOn = await page.locator('[data-live="true"]').count();
console.log(`live canvas ready: ${liveOn > 0}`);

const stage = page.locator('[data-live]').first();
const box = await stage.boundingBox();
if (box && !mobile) {
  for (let i = 0; i <= 30; i += 1) {
    await page.mouse.move(box.x + box.width * (0.2 + 0.6 * (i / 30)), box.y + box.height * (0.35 + 0.3 * Math.sin(i / 5)));
    await page.waitForTimeout(40);
  }
  await shot('probe');
  await page.mouse.move(10, 10);
}

const legend = page.getByRole('button', { name: /Hardware \/ PCB/ });
if (await legend.count()) {
  await legend.first().click();
  await page.waitForTimeout(700);
  await shot('layer');
  await legend.first().click();
}

await page.locator('label', { hasText: 'Smart Reading' }).first().click();
await page.waitForTimeout(900);
await shot('reading-mid');
await page.waitForTimeout(1600);
await shot('reading');

await page.locator('label', { hasText: 'Unsigned' }).first().click();
await page.waitForTimeout(2000);
await shot('unsigned');
const input = page.locator('#c-sign');
if (await input.count()) {
  await input.fill('Your Name');
  await page.waitForTimeout(2400);
  await shot('signed');
}

await page.locator('label', { hasText: 'The Modular Smartphone' }).first().click();
await page.waitForTimeout(1800);

for (let y = 0; y < 2600; y += 120) {
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(800);
const orb = page.getByRole('button', { name: /Stage 03/ });
if (await orb.count()) {
  await orb.first().scrollIntoViewIfNeeded();
  await orb.first().hover();
  await page.waitForTimeout(1500);
  await shot('stage');
}

await page.close();
await ctx.close();
await browser.close();

if (video) {
  const files = readdirSync(vidDir).filter((f) => f.endsWith('.webm'));
  if (files.length) {
    renameSync(join(vidDir, files[0]), join(outDir, mobile ? 'motion-mobile.webm' : 'motion.webm'));
  }
  rmSync(vidDir, { recursive: true, force: true });
}
console.log(errors.length ? `console errors (${errors.length}): ${errors.slice(0, 5).join(' | ')}` : 'console errors: 0');
