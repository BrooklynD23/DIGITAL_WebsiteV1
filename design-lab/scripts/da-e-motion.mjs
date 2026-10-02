// DA-E interaction + motion check for /design-lab/e.
// Usage: node design-lab/scripts/da-e-motion.mjs <outDir>
// 1. desktop with recordVideo: load → wheel-scroll through DG-001 scrub (frames) → open ledger brief (shared layout) → Esc.
// 2. reduced motion: DG-001 section frame (static, fully exploded).
// 3. JS disabled: hero frame + check that case-study text is in the HTML.
// 4. keyboard: Tab to first ledger row, Enter opens dialog, focus lands on close, Esc returns focus.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/renders/e/v1';
const url = (process.env.LAB_URL ?? 'http://localhost:3100') + '/design-lab/e/';
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const errors = [];
const watch = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message.slice(0, 200)}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${tag} console: ${m.text().slice(0, 200)}`));
};
const shot = (page, name) => page.screenshot({ path: join(outDir, `${name}.png`) });

try {
  // 1. motion run with video
  const vidDir = join(outDir, '_video');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: vidDir, size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  watch(page, 'desktop');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1600);
  await shot(page, 'motion-01-hero');
  await page.mouse.move(700, 450);
  const caseTop = await page.evaluate(() => document.querySelector('#case-dg-001')?.getBoundingClientRect().top ?? 0);
  // wheel down to the DG-001 band, then through the 7 steps
  for (let y = 0; y < caseTop + 400; y += 240) { await page.mouse.wheel(0, 240); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
  await shot(page, 'motion-02-seq-start');
  for (let n = 0; n < 3; n++) {
    for (let k = 0; k < 7; k++) { await page.mouse.wheel(0, 140); await page.waitForTimeout(70); }
    await page.waitForTimeout(800);
    await shot(page, `motion-0${3 + n}-seq-${n}`);
  }
  for (let k = 0; k < 18; k++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  await page.waitForTimeout(800);
  await shot(page, 'motion-06-seq-end');
  // back to top, open the brief
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(900);
  await page.locator('button[aria-haspopup="dialog"]').first().click();
  await page.waitForTimeout(160);
  await shot(page, 'motion-07-brief-morphing');
  await page.waitForTimeout(700);
  await shot(page, 'motion-08-brief-open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  await page.locator('button[aria-haspopup="dialog"]').nth(1).click();
  await page.waitForTimeout(900);
  await shot(page, 'motion-09-brief-dg002');
  await page.getByRole('link', { name: 'Read the case study' }).click();
  await page.waitForTimeout(1800);
  await shot(page, 'motion-10-jump-to-case');
  await page.getByRole('button', { name: 'Play' }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Pause' }).click();
  await shot(page, 'motion-11-rsvp');
  const video = page.video();
  await ctx.close();
  if (video) {
    const p = await video.path();
    renameSync(p, join(outDir, 'motion.webm'));
    rmSync(vidDir, { recursive: true, force: true });
  }

  // 2. reduced motion
  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await rm.newPage();
  watch(rp, 'reduced');
  await rp.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await rp.evaluate(() => document.querySelector('#case-dg-001 [data-schematic]')?.scrollIntoView({ block: 'center' }));
  await rp.waitForTimeout(700);
  await shot(rp, 'reduced-seq');
  const lenisOn = await rp.evaluate(() => document.documentElement.classList.contains('lenis'));
  console.log('reduced motion: lenis active =', lenisOn);
  await rm.close();

  // 3. no JS
  const nj = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, isMobile: true, deviceScaleFactor: 2 });
  const np = await nj.newPage();
  await np.goto(url, { waitUntil: 'load', timeout: 90000 });
  await np.waitForTimeout(1200);
  await shot(np, 'nojs-mobile-hero');
  const txt = await np.evaluate(() => document.body.innerText);
  console.log('no-JS content present:', ['One phone, owned in seven parts.', 'One word, held still.', 'Seven owner seats. All unassigned.', 'Add your row to the ledger.'].map((t) => `${t} ${txt.includes(t)}`).join(' | '));
  const rowHref = await np.locator('a[href="#case-dg-001"]').count();
  console.log('no-JS ledger rows are links:', rowHref > 0);
  await nj.close();

  // 4. keyboard
  const kb = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const kp = await kb.newPage();
  watch(kp, 'keyboard');
  await kp.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await kp.waitForTimeout(800);
  await kp.locator('button[aria-haspopup="dialog"]').first().focus();
  await kp.keyboard.press('Enter');
  await kp.waitForTimeout(700);
  const focusIn = await kp.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await kp.keyboard.press('Tab');
  await kp.keyboard.press('Tab');
  await kp.keyboard.press('Tab');
  const trapped = await kp.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  await kp.keyboard.press('Escape');
  await kp.waitForTimeout(700);
  const back = await kp.evaluate(() => document.activeElement?.getAttribute('aria-haspopup'));
  console.log(`keyboard: focus on open = ${focusIn} | focus trapped after 3 tabs = ${trapped} | focus returned to row = ${back === 'dialog'}`);
  await kb.close();
} finally {
  await browser.close();
}
console.log(errors.length ? `ERRORS (${errors.length}):\n${errors.join('\n')}` : 'console errors: 0');
