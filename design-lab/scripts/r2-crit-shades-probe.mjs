// W2-CRIT-SHADES probe: typography (measure, spacing, font), contrast, keyboard path, spacing toggle,
// RSVP flash analysis (per-word luminance deltas on the reader screen), touch targets.
// Usage: node design-lab/scripts/r2-crit-shades-probe.mjs [--worlds=signal,apple]
import { chromium } from 'playwright';
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const flags = process.argv.slice(2);
const worlds = (flags.find((f) => f.startsWith('--worlds='))?.split('=')[1] ?? 'signal,apple').split(',');
const OUT = 'design-lab/renders/r2/crit/shades';
mkdirSync(OUT, { recursive: true });
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

const TYPO = () => {
  const lum = (c) => {
    const m = c.match(/[\d.]+/g); if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const alpha = (c) => { const m = c.match(/[\d.]+/g); return m && m.length > 3 ? Number(m[3]) : 1; };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor;
      if (bg && alpha(bg) > 0.5) return bg;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  const ratio = (a, b) => { const x = lum(a); const y = lum(b); if (x == null || y == null) return null; const [hi, lo] = x > y ? [x, y] : [y, x]; return +((hi + 0.05) / (lo + 0.05)).toFixed(2); };
  const rows = [];
  const els = [...document.querySelectorAll('main p, main li, main dd, main dt, main h1, main h2, main h3, main span[class*=confirm], main a, main button, main output, main svg text')];
  const seen = new Set();
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (el.closest('.sr-only')) continue;
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
    if (!txt) continue;
    const cls = (el.getAttribute('class') || el.tagName).toString().split(' ')[0].replace(/^.*?_/, '').replace(/__.*$/, '');
    const key = `${el.tagName}.${cls}`;
    const isSvg = el instanceof SVGElement;
    const color = isSvg ? cs.fill : cs.color;
    const fs = parseFloat(cs.fontSize);
    const renderedFs = isSvg ? +(fs * (el.ownerSVGElement.getBoundingClientRect().width / el.ownerSVGElement.viewBox.baseVal.width)).toFixed(1) : fs;
    // chars per line for multi-line blocks
    let cpl = null; let lines = null;
    if (!isSvg && ['P', 'LI', 'DD'].includes(el.tagName)) {
      const range = document.createRange(); range.selectNodeContents(el);
      const tops = new Set([...range.getClientRects()].map((q) => Math.round(q.top)));
      lines = tops.size; cpl = Math.round(txt.length / Math.max(1, lines));
      if (lines === 1) cpl = null;
    }
    const opacity = (() => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return +o.toFixed(2); })();
    const row = {
      key, txt: txt.slice(0, 48), family: cs.fontFamily.split(',')[0].replace(/"/g, '').slice(0, 30), fs: renderedFs, fw: cs.fontWeight,
      lh: cs.lineHeight, ls: cs.letterSpacing, ws: cs.wordSpacing, w: Math.round(r.width), lines, cpl,
      cr: ratio(color, bgOf(el)), opacity,
    };
    const sig = `${key}|${row.fs}|${row.cr}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    rows.push(row);
  }
  return rows;
};

const results = {};
for (const world of worlds) {
  const url = `${base}/design-lab/r2/${world}/shades/`;
  const res = { world };
  for (const vp of [{ n: '1440', width: 1440, height: 900 }, { n: '390', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(1500);
    res[`typo${vp.n}`] = await page.evaluate(TYPO);
    // touch targets
    res[`targets${vp.n}`] = await page.evaluate(() => [...document.querySelectorAll('a[href], button, input, [tabindex="0"]')].map((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) return null;
      return { t: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) };
    }).filter((x) => x && (x.w < 44 || x.h < 44)));
    // spacing toggle effect (first toggle on the page)
    const probeSel = 'main p';
    const before = await page.evaluate((sel) => { const p = [...document.querySelectorAll(sel)].find((e) => e.textContent.length > 40 && getComputedStyle(e).display !== 'none'); const cs = getComputedStyle(p); return { txt: p.textContent.slice(0, 30), ls: cs.letterSpacing, ws: cs.wordSpacing, lh: cs.lineHeight, fs: cs.fontSize }; }, probeSel);
    await page.locator('button[aria-pressed]').first().click();
    await page.waitForTimeout(400);
    const after = await page.evaluate((sel) => { const p = [...document.querySelectorAll(sel)].find((e) => e.textContent.length > 40 && getComputedStyle(e).display !== 'none'); const cs = getComputedStyle(p); return { txt: p.textContent.slice(0, 30), ls: cs.letterSpacing, ws: cs.wordSpacing, lh: cs.lineHeight }; }, probeSel);
    res[`spacing${vp.n}`] = { before, after, typoMore: vp.n === '1440' ? await page.evaluate(TYPO) : undefined };
    await ctx.close();
  }

  // keyboard path (1440, motion on)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2500);
    const path = [];
    for (let k = 0; k < 40; k += 1) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ? `outline ${cs.outlineWidth} ${cs.outlineColor}` : (cs.boxShadow !== 'none' ? 'box-shadow' : 'NONE');
        return { tag: e.tagName, t: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28), ring, inView: r.top >= 0 && r.bottom <= innerHeight };
      });
      path.push(f);
      if (k === 0) await page.screenshot({ path: `${OUT}/${world}-kbd-first.png` });
    }
    res.keyboard = path;
    // reader keyboard: focus primary, press K, wait, K, arrows
    const primary = page.locator('#reader [aria-keyshortcuts="K"]');
    await primary.focus();
    await page.keyboard.press('k');
    await page.waitForTimeout(1500);
    const playing = await page.evaluate(() => document.querySelector('#reader [data-phase]')?.dataset.phase);
    await page.keyboard.press('k');
    const paused = await page.evaluate(() => document.querySelector('#reader [data-phase]')?.dataset.phase);
    await page.keyboard.press('ArrowRight');
    const idxAfterRight = await page.evaluate(() => document.querySelector('#reader [aria-current="true"]')?.textContent);
    await page.screenshot({ path: `${OUT}/${world}-kbd-reader.png` });
    const live = await page.evaluate(() => document.querySelector('#reader [aria-live]')?.textContent);
    res.readerKeys = { playing, paused, idxAfterRight, live };
    // shortcut discoverability: is "K" visible anywhere?
    res.kVisible = await page.evaluate(() => /\bK\b/.test(document.querySelector('#reader')?.innerText ?? ''));
    await ctx.close();
  }

  // RSVP flash analysis: step every word, screenshot the screen, measure luminance deltas
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => document.querySelector('#reader')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(600);
    const screen = page.locator('#reader [class*=screen]').first();
    const box = await screen.boundingBox();
    const next = page.locator('#reader button[aria-label="Next word"]');
    const frames = [];
    const n = await page.evaluate(() => document.querySelectorAll('#reader [class*="tw"]').length);
    for (let i = 0; i < n; i += 1) {
      const buf = await screen.screenshot();
      const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const L = new Float32Array(info.width * info.height);
      for (let p = 0; p < L.length; p += 1) {
        const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        L[p] = 0.2126 * lin(data[p * 3]) + 0.7152 * lin(data[p * 3 + 1]) + 0.0722 * lin(data[p * 3 + 2]);
      }
      frames.push(L);
      if (i < n - 1) { await next.click(); await page.waitForTimeout(60); }
    }
    let maxPx = 0; let maxMean = 0;
    const mean = (L) => L.reduce((a, b) => a + b, 0) / L.length;
    for (let i = 1; i < frames.length; i += 1) {
      let c = 0;
      for (let p = 0; p < frames[i].length; p += 1) {
        const a = frames[i - 1][p]; const b = frames[i][p];
        if (Math.abs(a - b) >= 0.1 && Math.min(a, b) < 0.8) c += 1;
      }
      maxPx = Math.max(maxPx, c);
      maxMean = Math.max(maxMean, Math.abs(mean(frames[i]) - mean(frames[i - 1])));
    }
    res.flash = { screenCss: { w: Math.round(box.width), h: Math.round(box.height) }, words: n, maxChangedPx: maxPx, threshold25pct10deg: 21824, maxMeanLumDelta: +maxMean.toFixed(4), fastestMs600wpm: Math.round(60000 / 600) };
    await ctx.close();
  }
  results[world] = res;
}
writeFileSync(`${OUT}/probe.json`, JSON.stringify(results, null, 1));
await browser.close();
console.log('wrote', `${OUT}/probe.json`);
