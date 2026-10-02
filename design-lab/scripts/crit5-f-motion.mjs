// CRIT-5: record concept F motion for the §34 critique (E-lens cross-critique).
// Usage: node design-lab/scripts/crit5-f-motion.mjs [--reduced]
// Output: design-lab/renders/f/crit/motion.webm (or motion-reduced.webm) + a timestamped beat log.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const reduced = process.argv.includes('--reduced');
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const outDir = 'design-lab/renders/f/crit';
const tmpVid = join(outDir, reduced ? '_vid_r' : '_vid');
const label = reduced ? 'motion-reduced' : 'motion';

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  for (const d of readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

mkdirSync(outDir, { recursive: true });
const viewport = { width: 1440, height: 900 };
const browser = await chromium.launch({ executablePath: shell() });
const ctx = await browser.newContext({
  viewport,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  recordVideo: { dir: tmpVid, size: viewport },
});
const page = await ctx.newPage();
const t0 = Date.now();
const beats = [];
const beat = (s) => beats.push(`${((Date.now() - t0) / 1000).toFixed(1)}s  ${s}`);
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
const pause = (ms) => page.waitForTimeout(ms);

beat('navigate (load)');
await page.goto(`${base}/design-lab/f/`, { waitUntil: 'networkidle' });
await pause(1500);

beat('type name "Danny" into the sign field');
await page.locator('#f-sign').click();
await page.locator('#f-sign').pressSequentially('Danny', { delay: 160 });
await pause(1200);

beat('wheel-scroll to the bench');
for (let i = 0; i < 9; i++) {
  await page.mouse.wheel(0, 120);
  await pause(90);
}
await page.locator('#bench-title').scrollIntoViewIfNeeded();
await pause(800);

// Wheel on until the DG-001 seats are on screen (the tray is sticky, so the tag travels with us).
const target = page.locator('[data-record="dg-001"] li').nth(1);
for (let i = 0; i < 30; i++) {
  const box = await target.boundingBox();
  if (box && box.y < 520) break;
  await page.mouse.wheel(0, 120);
  await pause(90);
}
await pause(700);

beat('pointer drag: sticky tray tag -> DG-001 Hardware / PCB seat (on screen)');
const tag = page.locator('[aria-roledescription="draggable"]').first();
const a = await tag.boundingBox();
const b = await target.boundingBox();
if (a && b) {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  await page.mouse.move(ax, ay);
  await pause(300);
  await page.mouse.down();
  const steps = 40;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(ax + ((bx - ax) * i) / steps, ay + ((by - ay) * i) / steps);
    await pause(30);
  }
  await pause(500);
  await page.mouse.up();
}
await pause(1200);
beat(`drop done (mine seats: ${await page.locator('li[data-mine]').count()})`);

beat('hover DG-001 Firmware seat (phone layer highlight)');
await page.locator('[data-record="dg-001"] li').nth(2).hover();
await pause(1000);

beat('keyboard: focus DG-002 Optics "Put Danny here" button, press Enter');
const optics = page.locator('[data-record="dg-002"] li').nth(1).getByRole('button');
await optics.scrollIntoViewIfNeeded();
await pause(400);
await optics.focus();
await pause(700);
await page.keyboard.press('Enter');
await pause(1200);
beat(`keyboard placement done (on DG-002: ${await page.locator('[data-record="dg-002"] li[data-mine]').count()})`);

beat('wheel-scroll to the sheet (fill)');
for (let i = 0; i < 14; i++) {
  await page.mouse.wheel(0, 160);
  await pause(80);
}
await page.locator('#sheet').scrollIntoViewIfNeeded();
await pause(2000);

beat('scroll to Thursday + footer signature');
for (let i = 0; i < 16; i++) {
  await page.mouse.wheel(0, 180);
  await pause(80);
}
await pause(1800);
beat('end');

await ctx.close();
await browser.close();
const files = readdirSync(tmpVid).filter((f) => f.endsWith('.webm'));
if (files[0]) renameSync(join(tmpVid, files[0]), join(outDir, `${label}.webm`));
rmSync(tmpVid, { recursive: true, force: true });
writeFileSync(join(outDir, `${label}-beats.txt`), beats.join('\n') + '\n');
console.log(beats.join('\n'));
console.log(`console errors: ${errors.length}`);
errors.forEach((e) => console.log('  ' + e));
