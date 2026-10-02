// R2-SIGNATURE: record + measure the two liked round-1 pieces.
// Usage: node design-lab/scripts/r2-sig-record.mjs [outDir]
// C: /design-lab/c/#process (BuildStages + "1" rules). E: /design-lab/e/#case-dg-001 (PhoneSequence).
// Per piece: 1440×900 video + state shots, 390×844 video + state shots, words-in-viewport, rAF/s at rest and active.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/round2/references/signature';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const metrics = {};

// Count rAF callbacks; installed before any page script.
const RAF_PROBE = () => {
  window.__raf = 0;
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => orig((t) => { window.__raf += 1; cb(t); });
};
const rafPerSec = async (page, ms = 2000) => {
  const a = await page.evaluate(() => window.__raf);
  await page.waitForTimeout(ms);
  const b = await page.evaluate(() => window.__raf);
  return Math.round(((b - a) * 1000) / ms);
};
// Words whose text node box intersects the viewport (visible, non-zero opacity chain ignored for SVG fill).
const wordsInViewport = (page, scopeSel) =>
  page.evaluate((sel) => {
    const scope = sel ? document.querySelector(sel) : document.body;
    if (!scope) return { words: -1 };
    const vw = innerWidth, vh = innerHeight;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let words = 0; const sample = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"] title, title')) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      const b = r.getBoundingClientRect();
      if (b.width === 0 || b.bottom < 0 || b.top > vh || b.right < 0 || b.left > vw) continue;
      const w = t.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
      words += w; if (sample.length < 60) sample.push(t.slice(0, 40));
    }
    return { words, sample };
  }, scopeSel);
const finishVideo = async (ctx, page, name) => {
  const v = page.video(); await ctx.close();
  if (v) { renameSync(await v.path(), join(outDir, name)); }
};
const newCtx = (vp, vidDir) => browser.newContext({
  viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dpr ?? 1, isMobile: vp.mobile ?? false, hasTouch: vp.mobile ?? false,
  recordVideo: { dir: vidDir, size: { width: vp.w, height: vp.h } },
});
const VPS = [{ tag: '1440', w: 1440, h: 900 }, { tag: '390', w: 390, h: 844, mobile: true, dpr: 2 }];

for (const vp of VPS) {
  // ---------- C: build stages ----------
  {
    const vidDir = join(outDir, `_vid-c-${vp.tag}`);
    const ctx = await newCtx(vp, vidDir); await ctx.addInitScript(RAF_PROBE);
    const page = await ctx.newPage();
    await page.goto(`${base}/design-lab/c/`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important}' });
    await page.waitForTimeout(1500);
    const m = { rafRestTop: await rafPerSec(page) };
    await page.evaluate(() => document.querySelector('#process').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(1200);
    await page.mouse.move(5, 5);
    m.rafRestProcess = await rafPerSec(page);
    m.wordsProcessTop = await wordsInViewport(page);
    await page.screenshot({ path: join(outDir, `c-${vp.tag}-00-rest.png`) });
    const btns = page.locator('#process button[aria-pressed]');
    const n = await btns.count();
    for (let i = 0; i < n; i++) {
      if (vp.mobile) await btns.nth(i).scrollIntoViewIfNeeded();
      if (vp.mobile) await btns.nth(i).tap(); else await btns.nth(i).hover();
      await page.waitForTimeout(400);
      if (i === 0) m.rafActive = await rafPerSec(page, 1500);
      await page.waitForTimeout(vp.mobile ? 1600 : 2000);
      await page.screenshot({ path: join(outDir, `c-${vp.tag}-0${i + 1}-stage${i + 1}${vp.mobile ? '-pinned' : '-hover'}.png`) });
      if (vp.mobile) await btns.nth(i).tap(); // unpin
    }
    if (!vp.mobile) {
      await btns.nth(1).click(); await page.mouse.move(5, 5); await page.waitForTimeout(1500);
      await page.screenshot({ path: join(outDir, `c-${vp.tag}-05-pinned-stage2.png`) });
      const box = await page.locator('#process').boundingBox();
      await page.screenshot({ path: join(outDir, `c-${vp.tag}-06-section-full.png`), fullPage: true, clip: { x: 0, y: box.y + (await page.evaluate(() => scrollY)), width: vp.w, height: box.height } });
    } else {
      await page.evaluate(() => document.querySelector('#process ul[aria-label="Ownership rules"]').scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(600);
      m.wordsRules = await wordsInViewport(page);
      await page.screenshot({ path: join(outDir, `c-${vp.tag}-05-rules.png`) });
    }
    metrics[`c-${vp.tag}`] = m;
    await finishVideo(ctx, page, `c-build-stages-${vp.tag}.webm`);
    rmSync(vidDir, { recursive: true, force: true });
  }
  // ---------- E: DG-001 sequence ----------
  {
    const vidDir = join(outDir, `_vid-e-${vp.tag}`);
    const ctx = await newCtx(vp, vidDir); await ctx.addInitScript(RAF_PROBE);
    const page = await ctx.newPage();
    await page.goto(`${base}/design-lab/e/`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1500);
    const m = { rafRestTop: await rafPerSec(page) };
    const seqSel = '[data-steps]';
    const top = await page.evaluate((s) => document.querySelector(s).closest('div').parentElement.getBoundingClientRect().top + scrollY, seqSel);
    const len = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().height, seqSel);
    // wheel (desktop, Lenis) / touch-like stepping (mobile) through the band
    const target = top - 80;
    if (!vp.mobile) {
      await page.mouse.move(700, 450);
      for (let y = 0; y < target; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(40); }
    } else {
      for (let y = 0; y < target; y += 500) { await page.evaluate((dy) => scrollBy(0, dy), 500); await page.waitForTimeout(60); }
    }
    await page.waitForTimeout(1200);
    m.rafRestSeq = await rafPerSec(page);
    m.wordsSeqStart = await wordsInViewport(page);
    await page.screenshot({ path: join(outDir, `e-${vp.tag}-00-band-top.png`) });
    const shots = vp.mobile ? 6 : 8;
    const step = (len + 400) / shots;
    for (let k = 1; k <= shots; k++) {
      if (!vp.mobile) { for (let s = 0; s < Math.ceil(step / 120); s++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(55); } }
      else { for (let s = 0; s < Math.ceil(step / 160); s++) { await page.evaluate(() => scrollBy(0, 160)); await page.waitForTimeout(80); } }
      await page.waitForTimeout(900);
      if (k === 3) { m.wordsSeqMid = await wordsInViewport(page); m.rafRestSeqMid = await rafPerSec(page, 1500); }
      await page.screenshot({ path: join(outDir, `e-${vp.tag}-0${k}-scrub.png`) });
    }
    metrics[`e-${vp.tag}`] = m;
    await finishVideo(ctx, page, `e-dg001-sequence-${vp.tag}.webm`);
    rmSync(vidDir, { recursive: true, force: true });
  }
}
// rAF while actively scrolling E (desktop): count during a 2s wheel burst
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(RAF_PROBE);
  const page = await ctx.newPage();
  await page.goto(`${base}/design-lab/e/`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.mouse.move(700, 450);
  const a = await page.evaluate(() => window.__raf); const t0 = Date.now();
  while (Date.now() - t0 < 2000) { await page.mouse.wheel(0, 120); await page.waitForTimeout(50); }
  const b = await page.evaluate(() => window.__raf);
  metrics['e-1440'].rafScrolling = Math.round(((b - a) * 1000) / (Date.now() - t0));
  await ctx.close();
}
writeFileSync(join(outDir, 'metrics.json'), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, (k, v) => (k === 'sample' ? undefined : v), 2));
await browser.close();
