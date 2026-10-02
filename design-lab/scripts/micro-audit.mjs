// MICRO agent: generic micro-interaction audit for a design-lab concept (read-only; never edits app code).
// Usage: node design-lab/scripts/micro-audit.mjs <slug> [--max=70]
// Writes design-lab/renders/micro/<slug>/audit.json + evidence crops (hover-*, focus-*, active-*, mobile-*, rm-*).
// Checks: hover pixel-diff + cursor, Tab focus ring pixel-diff + obscured focus, :active press diff, transition
// inventory, heading wrap + measure, idle animations / rAF loops, hidden-at-first-paint text, mobile targets +
// overflow, reduced-motion (emulated) and no-JS behaviour.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [slug, ...flags] = process.argv.slice(2);
if (!slug) throw new Error('usage: micro-audit.mjs <slug>');
const MAX = Number((flags.find((f) => f.startsWith('--max=')) ?? '--max=70').split('=')[1]);
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const url = `${base}/design-lab/${slug}/`;
const out = `design-lab/renders/micro/${slug}`;
mkdirSync(out, { recursive: true });

function headlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const browser = await chromium.launch({
  executablePath: headlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const RAF_COUNTER = () => {
  window.__raf = 0;
  const orig = window.requestAnimationFrame.bind(window);
  window.__rafCursor = 0;
  window.requestAnimationFrame = (cb) => {
    const st = new Error().stack || '';
    if (st.includes('CursorProvider')) window.__rafCursor += 1; else window.__raf += 1;
    return orig(cb);
  };
};

async function diffRatio(a, b) {
  const [ra, rb] = await Promise.all([sharp(a).raw().toBuffer({ resolveWithObject: true }), sharp(b).raw().toBuffer({ resolveWithObject: true })]);
  if (ra.info.width !== rb.info.width || ra.info.height !== rb.info.height) return 1;
  let changed = 0;
  const ch = ra.info.channels;
  for (let i = 0; i < ra.data.length; i += ch) {
    const d = Math.abs(ra.data[i] - rb.data[i]) + Math.abs(ra.data[i + 1] - rb.data[i + 1]) + Math.abs(ra.data[i + 2] - rb.data[i + 2]);
    if (d > 24) changed += 1;
  }
  return changed / (ra.info.width * ra.info.height);
}

async function clipFor(page, sel, pad = 10) {
  const r = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height, vw: innerWidth, vh: innerHeight };
  }, sel);
  if (!r || r.w < 1 || r.h < 1) return null;
  const x = Math.max(0, r.x - pad);
  const y = Math.max(0, r.y - pad);
  const w = Math.min(r.vw - x, r.w + pad * 2);
  const h = Math.min(r.vh - y, r.h + pad * 2);
  if (w < 2 || h < 2) return null;
  return { x, y, width: w, height: h };
}

async function settle(page) {
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: 'html,body{scroll-behavior:auto !important}' });
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += innerHeight * 0.6) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [role=button], [role=tab], [role=radio], [role=switch], [role=slider], [draggable=true]';

async function tagInteractive(page) {
  return page.evaluate((sel) => {
    const els = [...document.querySelectorAll(sel)];
    return els.map((el, i) => {
      el.setAttribute('data-micro', String(i));
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('value') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      const visible = b.width > 2 && b.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
      return {
        id: i, tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), role: el.getAttribute('role'), label,
        href: el.getAttribute('href'), cursor: cs.cursor, disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
        pressed: el.getAttribute('aria-pressed'), expanded: el.getAttribute('aria-expanded'), visible,
        w: Math.round(b.width), h: Math.round(b.height),
        transition: cs.transitionDuration !== '0s' ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : null,
      };
    });
  }, SEL);
}

const report = { slug, url, when: new Date().toISOString(), errors: [] };

// ---------- DESKTOP: hover, cursor, focus, active, inventory ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(RAF_COUNTER);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && report.errors.push(`console: ${m.text().slice(0, 200)}`));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });

  // first-paint hidden text (before any scroll)
  report.hiddenAtFirstPaint = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,figcaption,a,button')) {
      const t = (el.textContent || '').trim();
      if (!t) continue;
      let n = el; let hidden = false;
      while (n && n !== document.body) { const c = getComputedStyle(n); if (Number(c.opacity) < 0.05 || c.visibility === 'hidden') { hidden = true; break; } n = n.parentElement; }
      const cs = getComputedStyle(el);
      const srOnly = cs.position === 'absolute' && el.getBoundingClientRect().width <= 1;
      if (hidden && !srOnly && !el.closest('[aria-hidden=true]')) out.push({ tag: el.tagName.toLowerCase(), text: t.slice(0, 50), top: Math.round(el.getBoundingClientRect().top + scrollY) });
    }
    return { count: out.length, sample: out.slice(0, 8) };
  });

  await settle(page);

  // production CursorProvider (app/layout.tsx) leaks into lab routes: record it, then hide it so hover diffs are clean
  await page.mouse.move(700, 450); await page.mouse.move(720, 460); await page.waitForTimeout(300);
  report.globalCursor = await page.evaluate(() => {
    const els = [...document.querySelectorAll('[style*="ds-z-cursor"]')];
    return { present: els.length, visible: els.filter((e) => getComputedStyle(e).opacity !== '0' && getComputedStyle(e).display !== 'none').length, htmlCursor: document.documentElement.style.cursor || 'unset' };
  });
  await page.mouse.move(2, 450); await page.waitForTimeout(300);
  report.idleWithCursor = await page.evaluate(async () => { const c0 = window.__rafCursor; await new Promise((r) => setTimeout(r, 2000)); return { cursorRafPerSec: Math.round((window.__rafCursor - c0) / 2) }; });
  await page.addStyleTag({ content: '[style*="ds-z-cursor"]{display:none !important}' });

  report.idle = await page.evaluate(async () => {
    const r0 = window.__raf; await new Promise((r) => setTimeout(r, 3000)); const rafPerSec = (window.__raf - r0) / 3;
    const anims = document.getAnimations().filter((a) => a.playState === 'running').map((a) => ({
      name: a.animationName || a.transitionProperty || a.constructor.name,
      target: a.effect?.target ? `${a.effect.target.tagName.toLowerCase()}.${String(a.effect.target.className).slice(0, 40)}` : '?',
      iterations: a.effect?.getTiming?.().iterations,
    }));
    return { rafPerSecAtTop: Math.round(rafPerSec), runningAnimations: anims.length, sample: anims.slice(0, 6), canvases: document.querySelectorAll('canvas').length };
  });

  report.inventory = await page.evaluate(() => {
    const trans = new Map(); const anim = new Map();
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.transitionDuration && cs.transitionDuration !== '0s') {
        const k = `${cs.transitionDuration} | ${cs.transitionTimingFunction}`; trans.set(k, (trans.get(k) || 0) + 1);
      }
      if (cs.animationName && cs.animationName !== 'none') {
        const k = `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} x${cs.animationIterationCount}`; anim.set(k, (anim.get(k) || 0) + 1);
      }
    }
    const sortTop = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${v}x ${k}`);
    const headings = [...document.querySelectorAll('h1,h2,h3')].map((h) => {
      const cs = getComputedStyle(h); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      return { tag: h.tagName.toLowerCase(), text: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 50), wrap: cs.textWrapStyle || cs.textWrap || '?', lines: Math.round(h.getBoundingClientRect().height / lh), fs: cs.fontSize };
    });
    const c = document.createElement('canvas').getContext('2d');
    const measures = [...document.querySelectorAll('p')].filter((p) => p.textContent.trim().length > 140 && p.getBoundingClientRect().width > 0).map((p) => {
      const cs = getComputedStyle(p); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const t = p.textContent.trim(); const avg = c.measureText(t).width / t.length;
      return { text: t.slice(0, 40), cpl: Math.round(p.getBoundingClientRect().width / avg), wrap: cs.textWrapStyle || cs.textWrap || '?' };
    });
    const sel = getComputedStyle(document.body, '::selection');
    return {
      transitions: sortTop(trans), animations: sortTop(anim), headings, measures,
      selectionBg: sel.backgroundColor, caret: getComputedStyle(document.body).caretColor, accent: getComputedStyle(document.body).accentColor,
      smoothScroll: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  const els = await tagInteractive(page);
  report.interactive = { total: els.length, visible: els.filter((e) => e.visible).length };
  report.linkVsButton = {
    hashLinks: els.filter((e) => e.tag === 'a' && (e.href === '#' || e.href === '')).map((e) => e.label),
    roleButtonNonButton: els.filter((e) => e.role === 'button' && e.tag !== 'button').map((e) => `${e.tag}:${e.label}`),
    buttonsCursor: [...new Set(els.filter((e) => e.tag === 'button' && e.visible && !e.disabled).map((e) => e.cursor))],
    linksCursor: [...new Set(els.filter((e) => e.tag === 'a' && e.visible).map((e) => e.cursor))],
    disabled: els.filter((e) => e.disabled).map((e) => `${e.tag}:${e.label}:${e.cursor}`),
    toggles: els.filter((e) => e.pressed !== null || e.expanded !== null).map((e) => `${e.label} pressed=${e.pressed} expanded=${e.expanded}`).slice(0, 12),
    noTransition: els.filter((e) => e.visible && !e.transition && (e.tag === 'a' || e.tag === 'button')).length,
  };

  // hover
  const hover = [];
  let hoverCrops = 0;
  for (const e of els.filter((x) => x.visible).slice(0, MAX)) {
    const sel = `[data-micro="${e.id}"]`;
    try {
      await page.locator(sel).scrollIntoViewIfNeeded({ timeout: 2000 });
      await page.mouse.move(2, 450); await page.waitForTimeout(250);
      const clip = await clipFor(page, sel, 14);
      if (!clip) continue;
      const before = await page.screenshot({ clip });
      await page.hover(sel, { timeout: 2000, force: true });
      await page.waitForTimeout(450);
      const after = await page.screenshot({ clip });
      const ratio = await diffRatio(before, after);
      const row = { id: e.id, tag: e.tag, label: e.label, cursor: e.cursor, transition: e.transition, hoverDiff: Number(ratio.toFixed(4)) };
      if ((ratio < 0.002 || hoverCrops < 6) && hoverCrops < 14) {
        const f = `${out}/hover-${String(e.id).padStart(3, '0')}-${ratio < 0.002 ? 'NONE' : 'ok'}.png`;
        // side by side: default | hover, magenta gutter
        const meta = await sharp(after).metadata();
        await sharp({ create: { width: meta.width * 2 + 6, height: meta.height, channels: 4, background: '#ff00ff' } })
          .composite([{ input: before, left: 0, top: 0 }, { input: after, left: meta.width + 6, top: 0 }]).png().toFile(f);
        row.crop = f; hoverCrops += 1;
      }
      hover.push(row);
    } catch (err) { hover.push({ id: e.id, label: e.label, error: String(err.message).slice(0, 80) }); }
  }
  report.hover = hover;

  // focus via Tab
  await page.mouse.move(2, 450);
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
  const focus = []; const seen = new Set(); let focusCrops = 0;
  for (let i = 0; i < 140; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(220);
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      if (!el.hasAttribute('data-micro-f')) el.setAttribute('data-micro-f', String(document.querySelectorAll('[data-micro-f]').length));
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      const cx = b.x + b.width / 2; const cy = b.y + b.height / 2;
      const top = document.elementFromPoint(Math.min(Math.max(cx, 0), innerWidth - 1), Math.min(Math.max(cy, 0), innerHeight - 1));
      const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('value') || el.id || '').replace(/\s+/g, ' ').trim().slice(0, 50);
      return {
        key: el.getAttribute('data-micro-f'), tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), label,
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} off ${cs.outlineOffset}`, boxShadow: cs.boxShadow !== 'none',
        inView: b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth,
        obscured: !!top && top !== el && !el.contains(top) && !(top.closest('label') && top.closest('label').contains(el)) && !(el.labels && [...el.labels].some((l) => l.contains(top))),
        obscuredBy: top && top !== el && !el.contains(top) ? `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 30)}` : null,
        tiny: b.width < 3 || b.height < 3,
      };
    });
    if (!info) continue;
    if (seen.has(info.key)) break;
    seen.add(info.key);
    const sel = `[data-micro-f="${info.key}"]`;
    let ring = null;
    try {
      // tiny (visually hidden) inputs: measure the label / parent instead
      const target = info.tiny ? await page.evaluate((s) => { const el = document.querySelector(s); const host = (el.labels && el.labels[0]) || el.parentElement; host.setAttribute('data-micro-fh', '1'); return '[data-micro-fh="1"]'; }, sel) : sel;
      const clip = await clipFor(page, target, 10);
      if (clip) {
        const on = await page.screenshot({ clip });
        await page.evaluate((s) => document.querySelector(s).blur(), sel);
        await page.waitForTimeout(260);
        const off = await page.screenshot({ clip });
        ring = Number((await diffRatio(on, off)).toFixed(4));
        if ((ring < 0.003 || focusCrops < 6) && focusCrops < 16) {
          const f = `${out}/focus-${String(info.key).padStart(3, '0')}-${ring < 0.003 ? 'NONE' : 'ok'}.png`;
          await sharp(on).toFile(f); info.crop = f; focusCrops += 1;
        }
        await page.evaluate((s) => document.querySelector(s).focus({ preventScroll: true }), sel);
      }
      if (info.tiny) await page.evaluate(() => document.querySelector('[data-micro-fh]')?.removeAttribute('data-micro-fh'));
    } catch (err) { info.err = String(err.message).slice(0, 80); }
    focus.push({ ...info, ringDiff: ring });
  }
  report.focus = focus;

  // active / pressed (buttons only, last because it changes state)
  const active = [];
  for (const e of els.filter((x) => x.visible && x.tag === 'button' && !x.disabled).slice(0, 12)) {
    const sel = `[data-micro="${e.id}"]`;
    try {
      await page.locator(sel).scrollIntoViewIfNeeded({ timeout: 2000 });
      const clip = await clipFor(page, sel, 6);
      if (!clip) continue;
      await page.hover(sel, { force: true }); await page.waitForTimeout(350);
      const hov = await page.screenshot({ clip });
      await page.mouse.down(); await page.waitForTimeout(140);
      const down = await page.screenshot({ clip });
      await page.mouse.up(); await page.waitForTimeout(150);
      await page.keyboard.press('Escape');
      const ratio = Number((await diffRatio(hov, down)).toFixed(4));
      const row = { id: e.id, label: e.label, activeDiff: ratio };
      if (active.length < 4) { const f = `${out}/active-${String(e.id).padStart(3, '0')}.png`; await sharp(down).toFile(f); row.crop = f; }
      active.push(row);
    } catch (err) { active.push({ id: e.id, label: e.label, error: String(err.message).slice(0, 80) }); }
  }
  report.active = active;
  await ctx.close();
}

// ---------- MOBILE: targets + overflow ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await settle(page);
  report.mobile = await page.evaluate((sel) => {
    const small = [];
    for (const el of document.querySelectorAll(sel)) {
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      if (b.width < 3 || b.height < 3 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p');
      if ((b.width < 44 || b.height < 44) && !inline) small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    const over = [];
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      if (b.right > innerWidth + 1 && b.width > 0) {
        let clipped = false; let n = el.parentElement;
        while (n && n !== document.body) { const o = getComputedStyle(n); if (/(hidden|auto|scroll|clip)/.test(o.overflowX)) { clipped = true; break; } n = n.parentElement; }
        if (!clipped) over.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} right=${Math.round(b.right)}`);
      }
    }
    return { scrollWidth: document.documentElement.scrollWidth, innerWidth, smallTargets: small.length, smallSample: small.slice(0, 10), overflow: over.slice(0, 6) };
  }, SEL);
  await ctx.close();
}

// ---------- REDUCED MOTION ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(RAF_COUNTER);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.screenshot({ path: `${out}/rm-hero.png` });
  await settle(page);
  report.reducedMotion = await page.evaluate(async () => {
    const r0 = window.__raf; await new Promise((r) => setTimeout(r, 3000));
    const running = document.getAnimations().filter((a) => a.playState === 'running');
    let nonZero = 0; const sample = new Set();
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.transitionDuration.split(',').some((d) => parseFloat(d) > 0.02)) { nonZero += 1; if (sample.size < 5) sample.add(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 25)} ${cs.transitionDuration}`); }
    }
    return {
      rafPerSec: Math.round((window.__raf - r0) / 3), runningAnimations: running.length,
      runningSample: running.slice(0, 5).map((a) => a.animationName || a.constructor.name),
      transitionsStillOn: nonZero, transitionSample: [...sample], canvases: document.querySelectorAll('canvas').length,
    };
  });
  await ctx.close();
}

// ---------- NO JS (loading / progressive enhancement) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/nojs-hero.png` });
  report.noJs = await page.evaluate(() => {
    let hidden = 0; const sample = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p,li')) {
      const t = (el.textContent || '').trim(); if (!t) continue;
      let n = el; let h = false;
      while (n && n !== document.body) { const c = getComputedStyle(n); if (Number(c.opacity) < 0.05 || c.visibility === 'hidden') { h = true; break; } n = n.parentElement; }
      if (h && !el.closest('[aria-hidden=true]')) { hidden += 1; if (sample.length < 5) sample.push(t.slice(0, 40)); }
    }
    return { hiddenText: hidden, sample, height: document.documentElement.scrollHeight };
  });
  await ctx.close();
}

await browser.close();
writeFileSync(`${out}/audit.json`, JSON.stringify(report, null, 2));
const h = report.hover.filter((r) => r.hoverDiff !== undefined);
const f = report.focus;
console.log(JSON.stringify({
  slug, errors: report.errors.length, interactive: report.interactive,
  hoverNone: h.filter((r) => r.hoverDiff < 0.002).length + '/' + h.length,
  focusStops: f.length, focusNone: f.filter((r) => r.ringDiff !== null && r.ringDiff < 0.003).length,
  focusObscured: f.filter((r) => r.obscured).length, focusOffscreen: f.filter((r) => !r.inView).length,
  activeNone: report.active.filter((r) => r.activeDiff !== undefined && r.activeDiff < 0.002).length + '/' + report.active.length,
  idle: report.idle, rm: report.reducedMotion, noJs: report.noJs, mobile: { sw: report.mobile.scrollWidth, small: report.mobile.smallTargets },
  hiddenFirstPaint: report.hiddenAtFirstPaint.count,
}, null, 1));
