// DA-F interaction check + motion capture for /design-lab/f
// Usage: node design-lab/scripts/da-f-interact.mjs [--video] [--reduced] [--mobile]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const flags = process.argv.slice(2);
const video = flags.includes('--video');
const reduced = flags.includes('--reduced');
const mobile = flags.includes('--mobile');
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const outDir = process.env.F_OUT ?? 'design-lab/renders/f/v2';
const tmpVid = join(outDir, '_vid');

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
const laptop = flags.includes('--1366');
const viewport = mobile ? { width: 390, height: 844 } : laptop ? { width: 1366, height: 768 } : { width: 1440, height: 900 };
const ctx = await browser.newContext({
  viewport,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  hasTouch: mobile,
  ...(video ? { recordVideo: { dir: tmpVid, size: viewport } } : {}),
});
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
const pause = (ms) => page.waitForTimeout(ms);
const results = [];
const check = (label, ok) => results.push(`${ok ? 'PASS' : 'FAIL'} ${label}`);

await page.goto(`${base}/design-lab/f/`, { waitUntil: 'networkidle' });
await pause(1200);
const fold = await page.evaluate(() => {
  const r = (sel) => document.querySelector(sel)?.getBoundingClientRect();
  return { input: Math.round(r('#f-sign')?.bottom ?? -1), cta: Math.round(r('#sign a[href="#bench"]')?.bottom ?? -1), h: innerHeight, docH: document.documentElement.scrollHeight };
});
check(`sign input + CTA above the fold (input bottom ${fold.input}, CTA bottom ${fold.cta}, viewport ${fold.h}, page ${fold.docH}px)`, fold.input < fold.h && fold.cta < fold.h);

// 1. Sign
await page.fill('#f-sign', '');
await page.locator('#f-sign').pressSequentially('Danny', { delay: 110 });
await pause(500);
const heroVal = await page.locator('[data-value]').first().getAttribute('data-value');
check(`hero tag holds typed name (${heroVal})`, heroVal === 'Danny');

// 2. Scroll to the bench
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 140);
  await pause(60);
}
await page.locator('#bench-title').scrollIntoViewIfNeeded();
await pause(600);

// 3. Keyboard drag: focus tag, Space, ArrowRight x2, Space
const tag = page.locator('[aria-roledescription="draggable"]').first();
await tag.focus();
await page.keyboard.press('Space');
await pause(250);
await page.keyboard.press('ArrowRight');
await pause(350);
await page.keyboard.press('ArrowRight');
await pause(350);
await page.keyboard.press('Space');
await pause(700);
const mineAfterKeys = await page.locator('li[data-mine]').count();
const live = await page.locator('[id^="DndLiveRegion"]').textContent().catch(() => '');
check(`keyboard drop placed tag (${mineAfterKeys} seat mine; live: "${(live ?? '').trim().slice(0, 80)}")`, mineAfterKeys === 1);

// 4. Pointer drag the tag from its seat to the first DG-002 seat
if (!mobile) {
  const from = await page.locator('li[data-mine] [aria-roledescription="draggable"]').boundingBox();
  const target = page.locator('[data-record="dg-002"] li').first();
  await target.scrollIntoViewIfNeeded();
  await pause(300);
  const fromBox = await page.locator('li[data-mine] [aria-roledescription="draggable"]').boundingBox();
  const toBox = await target.boundingBox();
  if (fromBox && toBox) {
    await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2);
    await page.mouse.down();
    const steps = 24;
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        fromBox.x + fromBox.width / 2 + ((toBox.x + toBox.width / 2 - fromBox.x - fromBox.width / 2) * i) / steps,
        fromBox.y + fromBox.height / 2 + ((toBox.y + toBox.height / 2 - fromBox.y - fromBox.height / 2) * i) / steps,
      );
      await pause(25);
    }
    await pause(200);
    await page.mouse.up();
    await pause(700);
  }
  const onGlasses = await page.locator('[data-record="dg-002"] li[data-mine]').count();
  check(`pointer drag moved tag to DG-002 (from ${from ? 'found' : 'missing'})`, onGlasses === 1);
}

// 5. Non-drag path: seat button
const btn = page.locator('[data-record="dg-001"] li').nth(1).getByRole('button');
await btn.scrollIntoViewIfNeeded();
await btn.click();
await pause(600);
check('seat button places tag on Hardware / PCB', (await page.locator('[data-record="dg-001"] li[data-mine]').count()) === 1);

// 6. Sheet filled
await page.locator('#sheet').scrollIntoViewIfNeeded();
await pause(900);
const sheetH2 = await page.locator('#sheet h2').textContent();
check(`sheet heading = "${sheetH2}"`, sheetH2 === 'Your sheet.');

// 7. List view
await page.locator('#bench-title').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'List' }).click();
await pause(500);
const rows = await page.locator('table tbody tr').count();
check(`list view shows ${rows} seat rows`, rows === 14);
await page.getByRole('button', { name: 'Bench' }).click();
await pause(300);

// 8. Footer signature
await page.locator('[data-lab-f] footer').scrollIntoViewIfNeeded();
await pause(900);
const sig = await page.locator('[data-lab-f] footer').textContent();
check('footer signature shows the name', (sig ?? '').includes('Danny'));

// 9. Horizontal overflow
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check(`no horizontal overflow (${overflow}px)`, overflow <= 0);

await page.screenshot({ path: join(outDir, `f-interact-${mobile ? 'mobile' : laptop ? '1366' : 'desktop'}${reduced ? '-reduced' : ''}.png`) });
await ctx.close();
await browser.close();

if (video) {
  const files = readdirSync(tmpVid).filter((f) => f.endsWith('.webm'));
  if (files[0]) renameSync(join(tmpVid, files[0]), join(outDir, 'motion.webm'));
  rmSync(tmpVid, { recursive: true, force: true });
}
console.log(results.join('\n'));
console.log(`console errors: ${errors.length}`);
errors.forEach((e) => console.log('  ' + e));
