// CRIT-2 (B critiques C): motion recording + fresh state shots for /design-lab/c.
// Usage: node design-lab/scripts/crit2-motion.mjs [--reduced] [--mobile]
// Writes design-lab/renders/c/crit/{motion.webm | motion-reduced.webm | motion-mobile.webm} + crit-*.png
// and prints frame-timing + mid-morph-interrupt measurements.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const flags = process.argv.slice(2);
const reduced = flags.includes('--reduced');
const mobile = flags.includes('--mobile');
const outDir = 'design-lab/renders/c/crit';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const tag = `${mobile ? 'm' : 'd'}${reduced ? '-rm' : ''}`;
const t0 = Date.now();
const log = (m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] ${m}`);

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
const vidDir = join(outDir, `_video-${tag}`);
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
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  recordVideo: { dir: vidDir, size: viewport },
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const shot = (name) => page.screenshot({ path: join(outDir, `crit-${tag}-${name}.png`) });

log('load');
await page.goto(`${base}/design-lab/c`, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3500);
log(`live canvas: ${(await page.locator('[data-live="true"]').count()) > 0}`);
await shot('load');

// pointer probe over the phone (desktop only)
const stage = page.locator('[data-live]').first();
const box = await stage.boundingBox();
if (box && !mobile) {
  log('probe sweep');
  for (let i = 0; i <= 24; i += 1) {
    await page.mouse.move(box.x + box.width * (0.25 + 0.5 * (i / 24)), box.y + box.height * (0.4 + 0.2 * Math.sin(i / 4)));
    await page.waitForTimeout(50);
  }
  await page.mouse.move(10, 10);
  await page.waitForTimeout(600);
}

// interaction 1: select a subsystem layer
const legend = page.getByRole('button', { name: /Operating System/ });
if (await legend.count()) {
  log('select layer 04 Operating System');
  await legend.first().scrollIntoViewIfNeeded();
  await legend.first().click();
  await page.waitForTimeout(1200);
  await shot('layer');
  await legend.first().click();
  await page.waitForTimeout(600);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);

// interaction 2: pick DG-002
log('pick DG-002');
await page.locator('label', { hasText: 'Smart Reading' }).first().click();
await page.waitForTimeout(600);
await shot('reading-600ms');
await page.waitForTimeout(3200);
await shot('reading');

// interaction 3: interrupt a morph mid-flight (DG-003 then DG-001 after 400ms)
log('interrupt: DG-003 then DG-001 after 400ms');
await page.locator('label', { hasText: 'Unsigned' }).first().click();
await page.waitForTimeout(400);
await page.locator('label', { hasText: 'The Modular Smartphone' }).first().click();
await page.waitForTimeout(80);
await shot('interrupt-80ms');
await page.waitForTimeout(1800);

// interaction 4: sign the line
log('pick DG-003 + sign');
await page.locator('label', { hasText: 'Unsigned' }).first().click();
await page.waitForTimeout(1600);
const input = page.locator('#c-sign');
if (await input.count()) {
  await input.scrollIntoViewIfNeeded();
  await input.pressSequentially('Ada Okonkwo-Ramirez', { delay: 70 });
  await page.waitForTimeout(2200);
  await shot('signed-long');
}
await page.locator('label', { hasText: 'The Modular Smartphone' }).first().click();
await page.waitForTimeout(1500);

// scroll the page (layer spread, then records, stages)
log('scroll');
for (let y = 0; y < 3800; y += 100) {
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(50);
}
await page.waitForTimeout(600);
const orb = page.getByRole('button', { name: /Stage 03/ });
if (await orb.count()) {
  log('hover stage 03 orb');
  await orb.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await orb.first().hover();
  await page.waitForTimeout(1800);
  await shot('stage');
}
// the RSVP reader in the DG-002 record
const play = page.getByRole('button', { name: /^Play/ });
if (await play.count()) {
  log('record RSVP play');
  await play.first().scrollIntoViewIfNeeded();
  await play.first().click();
  await page.waitForTimeout(2200);
  await shot('rsvp-record');
}
log('end');

await page.close();
await ctx.close();
await browser.close();
const files = readdirSync(vidDir).filter((f) => f.endsWith('.webm'));
const name = `motion${mobile ? '-mobile' : ''}${reduced ? '-reduced' : ''}.webm`;
if (files.length) renameSync(join(vidDir, files[0]), join(outDir, name));
rmSync(vidDir, { recursive: true, force: true });
console.log(`video: ${join(outDir, name)}`);
console.log(errors.length ? `console errors (${errors.length}): ${errors.slice(0, 5).join(' | ')}` : 'console errors: 0');
