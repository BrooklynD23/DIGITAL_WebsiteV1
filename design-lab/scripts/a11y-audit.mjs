// A11Y-RESP audit. Usage: node design-lab/scripts/a11y-audit.mjs [slug ...]   (default: a b c d e f mascot)
// Per route x viewport (390 touch, 834 touch, 1440): axe WCAG 2.1 AA, horizontal overflow, touch targets < 44x44,
// heading order, img alt, min font-size, chars/line. At 1440: 25-stop Tab walk with focused-vs-blurred pixel diff.
// Extra runs at 1440: reducedMotion 'reduce' and javaScriptEnabled false.
// Writes design-lab/renders/a11y/<slug>/{results.json, axe-<vp>.json, *.png}. Read-only against the app.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.LAB_URL ?? 'http://localhost:3100';
const AXE = 'node_modules/axe-core/axe.min.js';
const OUT_ROOT = 'design-lab/renders/a11y';
const SLUGS = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c', 'd', 'e', 'f', 'mascot'];
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: '834', width: 834, height: 1112, isMobile: true, hasTouch: true },
  { name: '1440', width: 1440, height: 900, isMobile: false, hasTouch: false },
];
const TAB_STOPS = 25;
const MAX_CHUNK = 6000;

function headlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

async function load(page, route, prime = true) {
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(2500);
  if (!prime) return;
  await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' }).catch(() => {});
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(1200);
}

async function fullPage(page, file, width) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  if (h <= MAX_CHUNK) return page.screenshot({ path: file, fullPage: true });
  const parts = [];
  for (let y = 0, i = 0; y < h; y += MAX_CHUNK, i += 1) {
    const p = `${file}.part${i}.png`;
    await page.screenshot({ path: p, fullPage: true, clip: { x: 0, y, width, height: Math.min(MAX_CHUNK, h - y) } });
    parts.push(p);
  }
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...parts.flatMap((p) => ['-i', p]), '-filter_complex', `vstack=inputs=${parts.length}`, file]);
  parts.forEach((p) => rmSync(p));
}

async function runAxe(page) {
  await page.addScriptTag({ path: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      resultTypes: ['violations', 'incomplete'],
    });
    const slim = (v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 8).map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').slice(0, 300) })),
    });
    const cc = r.incomplete.find((v) => v.id === 'color-contrast');
    const ccTargets = cc ? cc.nodes.slice(0, 40).map((n) => n.target.join(' ')) : [];
    return { violations: r.violations.map(slim), incomplete: r.incomplete.map(slim), ccTargets };
  });
}

/** All DOM checks that run inside the page. */
async function domChecks(page, vp) {
  return page.evaluate(({ touch }) => {
    const vw = document.documentElement.clientWidth;
    const desc = (el) => {
      if (!el) return null;
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '';
      const txt = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return `${el.tagName.toLowerCase()}${id}${cls}${txt ? ` "${txt}"` : ''}`;
    };
    const shown = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const srOnly = (el) => {
      const r = el.getBoundingClientRect();
      return r.width <= 2 || r.height <= 2;
    };

    // Overflow
    const scrollW = document.documentElement.scrollWidth;
    const overflowOffenders = [];
    if (scrollW > vw + 1) {
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 0 && shown(el)) overflowOffenders.push({ el: desc(el), right: Math.round(r.right) });
        if (overflowOffenders.length > 12) break;
      }
    }

    // Targets
    const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [tabindex]:not([tabindex="-1"])';
    const small = [];
    let targetCount = 0;
    for (const el of document.querySelectorAll(sel)) {
      let box = el;
      const cs = getComputedStyle(el);
      if (el.tagName === 'INPUT' && (cs.opacity === '0' || srOnly(el))) box = el.closest('label') || el;
      if (!shown(box) || box.closest('[aria-hidden="true"]') && el.tabIndex < 0) continue;
      if (srOnly(box)) continue; // skip links etc. — checked in the focus walk
      targetCount += 1;
      const r = box.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) {
        const parent = box.parentElement;
        const inline = getComputedStyle(box).display === 'inline' && parent && (parent.textContent || '').trim().length > (box.textContent || '').trim().length + 15;
        small.push({ el: desc(el), w: Math.round(r.width), h: Math.round(r.height), inline, x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY) });
      }
    }

    // Headings (include sr-only ones; exclude display:none)
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]')]
      .filter((h) => getComputedStyle(h).display !== 'none' && !h.closest('[hidden]'))
      .map((h) => ({ level: h.getAttribute('aria-level') ? Number(h.getAttribute('aria-level')) : Number(h.tagName[1]), text: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60) }));
    const skips = [];
    for (let i = 1; i < heads.length; i += 1) {
      if (heads[i].level > heads[i - 1].level + 1) skips.push(`${heads[i - 1].level}->${heads[i].level} at "${heads[i].text}"`);
    }
    if (heads.length && heads[0].level !== 1) skips.unshift(`first heading is h${heads[0].level} "${heads[0].text}"`);

    // Images
    const imgNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map(desc);
    const roleImgNoName = [...document.querySelectorAll('[role=img]')]
      .filter((i) => !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !i.closest('[aria-hidden="true"]'))
      .map(desc);
    const svgUnlabelled = [...document.querySelectorAll('svg')].filter(
      (s) => !s.closest('[aria-hidden="true"]') && s.getAttribute('aria-hidden') !== 'true' && !s.getAttribute('role') && !s.querySelector('title') && !s.getAttribute('aria-label') && shown(s) && s.getBoundingClientRect().width > 40,
    ).length;

    // Font sizes (text-bearing elements)
    const sizes = [];
    const tiny = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode;
      if (!t.textContent.trim()) continue;
      const el = t.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      if (!shown(el) || srOnly(el) || el.closest('[aria-hidden="true"]') || el.closest('script,style,noscript')) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      sizes.push(fs);
      if (fs < 12) tiny.push({ el: desc(el), px: fs });
    }
    sizes.sort((a, b) => a - b);

    // Line length of body paragraphs
    const lines = [];
    for (const p of document.querySelectorAll('p, li, dd')) {
      const text = (p.textContent || '').trim().replace(/\s+/g, ' ');
      if (text.length < 90 || !shown(p) || srOnly(p) || p.closest('[aria-hidden="true"]')) continue;
      if (p.tagName !== 'P' && p.querySelector('p')) continue;
      const range = document.createRange();
      range.selectNodeContents(p);
      const tops = new Set([...range.getClientRects()].filter((r) => r.width > 1).map((r) => Math.round(r.top / 4)));
      const n = Math.max(1, tops.size);
      if (n < 2) continue;
      lines.push({ el: desc(p), cpl: Math.round(text.length / n), lines: n, px: parseFloat(getComputedStyle(p).fontSize) });
    }
    lines.sort((a, b) => b.cpl - a.cpl);
    const cpls = lines.map((l) => l.cpl).sort((a, b) => a - b);

    // Landmarks (lab limitation context)
    const landmarks = {
      main: document.querySelectorAll('main, [role=main]').length,
      headerInsideMain: [...document.querySelectorAll('header')].filter((h) => h.closest('main') && shown(h)).length,
      footerInsideMain: [...document.querySelectorAll('footer')].filter((h) => h.closest('main') && shown(h)).length,
      navs: [...document.querySelectorAll('nav')].filter(shown).map((n) => n.getAttribute('aria-label') || '(unlabelled)'),
    };

    return {
      vw,
      scrollWidth: scrollW,
      overflow: scrollW > vw + 1,
      overflowOffenders,
      targets: { checked: targetCount, small: small.length, smallNonInline: small.filter((s) => !s.inline).length, list: small.slice(0, 40), touch },
      headings: { count: heads.length, h1: heads.filter((h) => h.level === 1).length, skips, outline: heads.map((h) => `h${h.level} ${h.text}`) },
      images: { imgNoAlt, roleImgNoName, svgUnlabelled },
      fonts: { min: sizes[0] ?? null, p10: sizes[Math.floor(sizes.length * 0.1)] ?? null, under12: tiny.length, tinyList: tiny.slice(0, 15) },
      lineLength: { paragraphs: lines.length, maxCpl: cpls[cpls.length - 1] ?? null, medianCpl: cpls[Math.floor(cpls.length / 2)] ?? null, over80: lines.filter((l) => l.cpl > 80).length, over90: lines.filter((l) => l.cpl > 90).length, worst: lines.slice(0, 5) },
      landmarks,
    };
  }, { touch: vp.hasTouch });
}

/** Estimate contrast for axe-incomplete color-contrast nodes from pixels (2nd vs 98th luminance percentile). */
async function contrastProbe(page, targets, vpW, vpH) {
  const out = [];
  const lum = (r, g, b) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  for (const t of targets) {
    const info = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { x: r.left, y: r.top, w: r.width, h: r.height, fs: parseFloat(cs.fontSize), fw: cs.fontWeight, color: cs.color, text: (el.textContent || '').trim().slice(0, 30) };
    }, t).catch(() => null);
    if (!info || info.w < 4 || info.h < 4) continue;
    await page.waitForTimeout(80);
    const clip = { x: Math.max(0, info.x), y: Math.max(0, info.y), width: Math.min(info.w, vpW - Math.max(0, info.x)), height: Math.min(info.h, vpH - Math.max(0, info.y)) };
    if (clip.width < 4 || clip.height < 4) continue;
    const buf = await page.screenshot({ clip });
    const { data, info: meta } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ls = [];
    for (let k = 0; k < data.length; k += meta.channels) ls.push(lum(data[k], data[k + 1], data[k + 2]));
    ls.sort((a, b) => a - b);
    const lo = ls[Math.floor(ls.length * 0.02)], hi = ls[Math.floor(ls.length * 0.98)];
    const ratio = (hi + 0.05) / (lo + 0.05);
    const large = info.fs >= 24 || (info.fs >= 18.66 && Number(info.fw) >= 700);
    out.push({ target: t, text: info.text, px: info.fs, ratio: Number(ratio.toFixed(2)), need: large ? 3 : 4.5, fail: ratio < (large ? 3 : 4.5) });
  }
  return out;
}

/** Outline undersized targets and save a stitched full-page PNG. */
async function targetEvidence(page, list, file, width) {
  if (!list.length) return false;
  await page.evaluate((items) => {
    const layer = document.createElement('div');
    layer.id = '__a11y_layer';
    layer.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none';
    for (const it of items) {
      const b = document.createElement('div');
      b.style.cssText = `position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;outline:2px solid ${it.inline ? '#f0a000' : '#e00'};background:${it.inline ? 'rgba(240,160,0,.15)' : 'rgba(230,0,0,.18)'}`;
      layer.appendChild(b);
    }
    document.body.appendChild(layer);
  }, list);
  await fullPage(page, file, width);
  await page.evaluate(() => document.getElementById('__a11y_layer')?.remove());
  return true;
}

/** Tab walk: focused vs blurred crop diff; contact sheet. */
async function focusWalk(page, dir) {
  // Reset the sequential-focus starting point to the top of <body> (a focused node that is removed resets it).
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const t = document.createElement('div');
    t.tabIndex = -1;
    document.body.prepend(t);
    t.focus({ preventScroll: true });
    t.remove();
  });
  await page.mouse.move(1, 1);
  const stops = [];
  const tiles = [];
  for (let i = 0; i < TAB_STOPS; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(220);
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      el.setAttribute('data-a11y-focus', '1');
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const txt = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('value') || '').trim().replace(/\s+/g, ' ').slice(0, 50);
      return {
        el: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : ''} "${txt}"`,
        rect: { x: r.left, y: r.top, w: r.width, h: r.height },
        inView: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 2 && r.height > 2,
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        focusVisible: el.matches(':focus-visible'),
      };
    });
    if (!info) { stops.push({ i, el: '(body / left page)' }); continue; }
    let visible = null;
    if (info.inView) {
      const pad = 8;
      const clip = {
        x: Math.max(0, info.rect.x - pad),
        y: Math.max(0, info.rect.y - pad),
        width: Math.min(info.rect.w + pad * 2, 1440 - Math.max(0, info.rect.x - pad)),
        height: Math.min(info.rect.h + pad * 2, 900 - Math.max(0, info.rect.y - pad)),
      };
      if (clip.width > 2 && clip.height > 2) {
        const focused = await page.screenshot({ clip });
        await page.evaluate(() => document.activeElement?.blur());
        await page.waitForTimeout(220);
        const blurred = await page.screenshot({ clip });
        await page.evaluate(() => document.querySelector('[data-a11y-focus]')?.focus());
        await page.waitForTimeout(150);
        const [a, b] = await Promise.all([sharp(focused).raw().toBuffer(), sharp(blurred).raw().toBuffer()]);
        let diff = 0;
        for (let k = 0; k < a.length; k += 1) if (Math.abs(a[k] - b[k]) > 24) diff += 1;
        const ratio = diff / a.length;
        visible = ratio > 0.004;
        tiles.push({ buf: focused, label: `${String(i + 1).padStart(2, '0')} ${visible ? 'OK' : 'NO RING'}` });
        info.diffRatio = Number(ratio.toFixed(4));
      }
    }
    await page.evaluate(() => document.querySelector('[data-a11y-focus]')?.removeAttribute('data-a11y-focus'));
    stops.push({ i: i + 1, ...info, visibleIndicator: visible });
  }
  // Contact sheet: 5 columns, 300x120 cells.
  if (tiles.length) {
    const cw = 300, ch = 130, cols = 5, rows = Math.ceil(tiles.length / cols);
    const comps = [];
    for (let t = 0; t < tiles.length; t += 1) {
      const img = await sharp(tiles[t].buf).resize(cw - 8, ch - 30, { fit: 'inside', background: '#fff' }).png().toBuffer();
      const x = (t % cols) * cw, y = Math.floor(t / cols) * ch;
      const bad = tiles[t].label.includes('NO');
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="22"><rect width="100%" height="100%" fill="${bad ? '#c00' : '#222'}"/><text x="6" y="16" font-family="monospace" font-size="13" fill="#fff">${tiles[t].label}</text></svg>`);
      comps.push({ input: svg, left: x, top: y }, { input: img, left: x + 4, top: y + 26 });
    }
    await sharp({ create: { width: cw * cols, height: ch * rows, channels: 3, background: '#e8e8e8' } }).composite(comps).png().toFile(join(dir, 'focus-1440.png'));
  }
  return stops;
}

async function reducedRun(browser, route, dir) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await load(page, route);
  const r = await page.evaluate(() => {
    const anims = document.getAnimations().filter((a) => a.playState === 'running');
    const infinite = anims.filter((a) => a.effect?.getComputedTiming?.().iterations === Infinity);
    const hidden = [...(document.querySelector('main') || document.body).querySelectorAll('h1,h2,h3,p,li')].filter((el) => {
      let n = el;
      while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden') return true; n = n.parentElement; }
      return false;
    }).filter((el) => !el.closest('[aria-hidden="true"]') && (el.textContent || '').trim().length > 0).length;
    const desc = (a) => { const t = a.effect?.target; return `${a.animationName || a.constructor.name} on ${t ? t.tagName.toLowerCase() + (typeof t.className === 'string' && t.className ? '.' + t.className.split(' ')[0] : '') : '?'}`; };
    return { running: anims.length, infinite: infinite.length, infiniteList: [...new Set(infinite.map(desc))].slice(0, 10), hiddenTextBlocks: hidden, canvases: document.querySelectorAll('canvas').length };
  });
  await page.screenshot({ path: join(dir, 'reduced-1440.png') });
  await ctx.close();
  return r;
}

async function noJsRun(browser, route, dir, jsText) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const blocks = [...root.querySelectorAll('h1,h2,h3,p,li')].filter((el) => (el.textContent || '').trim() && !el.closest('[aria-hidden="true"]'));
    const hidden = blocks.filter((el) => {
      let n = el;
      while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') return true; n = n.parentElement; }
      return false;
    });
    return {
      textLen: document.body.innerText.length,
      blocks: blocks.length,
      hiddenBlocks: hidden.length,
      hiddenSample: hidden.slice(0, 6).map((e) => `${e.tagName.toLowerCase()} "${e.textContent.trim().slice(0, 40)}"`),
      h1: document.querySelectorAll('h1').length,
    };
  });
  r.textRatioVsJs = jsText ? Number((r.textLen / jsText).toFixed(2)) : null;
  await fullPage(page, join(dir, 'nojs-1440.png'), 1440);
  await ctx.close();
  return r;
}

const browser = await chromium.launch({ executablePath: headlessShell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const slug of SLUGS) {
    const route = `/design-lab/${slug}/`;
    const dir = join(OUT_ROOT, slug);
    mkdirSync(dir, { recursive: true });
    const result = { slug, route, at: new Date().toISOString(), viewports: {} };
    let jsText = null;
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
      await load(page, route);
      const axe = await runAxe(page);
      writeFileSync(join(dir, `axe-${vp.name}.json`), JSON.stringify(axe, null, 2));
      const contrast = await contrastProbe(page, axe.ccTargets, vp.width, vp.height);
      await page.evaluate(() => window.scrollTo(0, 0));
      const dom = await domChecks(page, vp);
      if (vp.name === '1440') jsText = await page.evaluate(() => document.body.innerText.length);
      const out = {
        consoleErrors: errors,
        axe: {
          critical: axe.violations.filter((v) => v.impact === 'critical').length,
          serious: axe.violations.filter((v) => v.impact === 'serious').length,
          moderate: axe.violations.filter((v) => v.impact === 'moderate').length,
          minor: axe.violations.filter((v) => v.impact === 'minor').length,
          rules: axe.violations.map((v) => `${v.impact}:${v.id}(${v.nodes})`),
          incomplete: axe.incomplete.map((v) => `${v.id}(${v.nodes})`),
        },
        ...dom,
        contrastProbe: { probed: contrast.length, estFails: contrast.filter((c) => c.fail), all: contrast },
      };
      if (vp.hasTouch && dom.targets.list.length) {
        out.targetsPng = (await targetEvidence(page, dom.targets.list, join(dir, `targets-${vp.name}.png`), vp.width)) ? `targets-${vp.name}.png` : null;
      }
      if (dom.overflow) {
        await page.screenshot({ path: join(dir, `overflow-${vp.name}.png`), fullPage: false });
        out.overflowPng = `overflow-${vp.name}.png`;
      }
      if (vp.name === '1440') out.focus = await focusWalk(page, dir);
      result.viewports[vp.name] = out;
      await ctx.close();
      console.log(`${slug} ${vp.name}: axe c${out.axe.critical}/s${out.axe.serious}/m${out.axe.moderate} overflow=${dom.overflow} small=${dom.targets.smallNonInline}/${dom.targets.small} h1=${dom.headings.h1} skips=${dom.headings.skips.length} minFont=${dom.fonts.min} maxCpl=${dom.lineLength.maxCpl} ccEstFail=${contrast.filter((c) => c.fail).length}/${contrast.length} errs=${errors.length}`);
    }
    result.reducedMotion = await reducedRun(browser, route, dir);
    result.noJs = await noJsRun(browser, route, dir, jsText);
    console.log(`${slug} reduced: ${JSON.stringify(result.reducedMotion)}`);
    console.log(`${slug} nojs: ${JSON.stringify(result.noJs)}`);
    writeFileSync(join(dir, 'results.json'), JSON.stringify(result, null, 2));
  }
} finally {
  await browser.close();
}
