// R2-APPLE: scroll through an apple.com page, screenshot 8 positions, measure copy density / type / sticky / motion.
// Usage: node design-lab/scripts/r2-apple-measure.mjs <slug> <url> <desktop|mobile> [maxSteps]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [slug, url, mode, maxStepsArg] = process.argv.slice(2);
const mobile = mode === 'mobile';
const vp = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const outDir = join('design-lab/round2/references/apple', slug);
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const ctx = await browser.newContext({
  viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, locale: 'en-US',
  userAgent: mobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
});
const page = await ctx.newPage();
const net = { media: [], seq: {} };
page.on('response', (r) => {
  const u = r.url();
  if (/\.(mp4|m3u8|webm|mov)(\?|$)/i.test(u) || /\/(video|hls)\//i.test(u)) net.media.push(u.replace(/\?.*/, '').slice(0, 160));
  const m = u.match(/^(.*\/)([^/]*?)(\d{3,5})(_2x)?\.(jpg|jpeg|png|webp|heic|avif)/i);
  if (m) { const k = m[1] + m[2]; (net.seq[k] ||= new Set()).add(m[3]); }
});
const result = { slug, url, mode, vp, errors: [] };
try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
} catch (e) { result.errors.push('goto ' + e.message.slice(0, 150)); }
await page.waitForTimeout(4000);
result.finalUrl = page.url(); result.title = await page.title();
result.status = 'loaded';

// ---- in-page instrumentation ----
await page.evaluate(() => {
  window.__ids = new WeakMap(); window.__n = 0; window.__reg = new Map();
  window.__gaTimings = {};
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return { r, g, b, a }; };
  window.__lum = (c) => { const o = lum(c); return o ? +(0.2126 * o.r + 0.7152 * o.g + 0.0722 * o.b).toFixed(0) : null; };
  window.__bgAt = (x, y) => {
    let el = document.elementFromPoint(x, y);
    while (el) { const bg = getComputedStyle(el).backgroundColor; const o = lum(bg); if (o && o.a > 0.5) return bg; el = el.parentElement; }
    return 'rgb(255,255,255)';
  };
  window.__effOpacity = (el) => { let o = 1; let e = el; for (let i = 0; i < 12 && e; i++) { const s = getComputedStyle(e); o *= parseFloat(s.opacity); if (s.visibility === 'hidden' || s.display === 'none') return 0; e = e.parentElement; } return o; };
  window.__skip = (el) => !!el.closest('nav,footer,[role="navigation"],#localnav-container,#localnav,#ac-localnav,.ac-localnav,#globalnav,[class*="ac-gn"],[class*="footnote"],[class*="legal"],script,style,noscript,[hidden],[aria-hidden="true"]:not([class*="headline"])');
  window.__visibleWords = () => {
    const vw = innerWidth, vh = innerHeight; let raw = 0, hit = 0; const blocks = new Set(); let maxFs = 0, headline = '';
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; const rg = document.createRange();
    while ((n = tw.nextNode())) {
      const t = n.nodeValue.trim(); if (!t) continue; const p = n.parentElement; if (!p || window.__skip(p)) continue;
      rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      const s = getComputedStyle(p); if (parseFloat(s.fontSize) < 6) continue;
      if (window.__effOpacity(p) < 0.5) continue;
      const w = t.split(/\s+/).length; raw += w;
      const cx = Math.min(Math.max(r.left + r.width / 2, 1), vw - 1), cy = Math.min(Math.max(r.top + r.height / 2, 1), vh - 1);
      const el = document.elementFromPoint(cx, cy);
      const ok = el && (p.contains(el) || el.contains(p));
      if (ok) { hit += w; blocks.add(p); const fs = parseFloat(s.fontSize); if (fs > maxFs) { maxFs = fs; const h = p.closest('h1,h2,h3,[class*="headline"]') || p; headline = h.innerText.trim().replace(/\s+/g, ' ').slice(0, 120); } }
    }
    return { raw, hit, blocks: blocks.size, maxFs, headline };
  };
  window.__sample = (y) => {
    const vh = innerHeight, vw = innerWidth; const out = [];
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50 || r.width * r.height < 6000) continue;
      const s = getComputedStyle(el);
      const hasT = s.transform !== 'none', op = parseFloat(s.opacity), pos = s.position;
      if (!hasT && op === 1 && pos !== 'sticky' && pos !== 'fixed') continue;
      let id = window.__ids.get(el);
      if (!id) { id = ++window.__n; window.__ids.set(el, id);
        const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
        const anim = [...el.attributes].filter((a) => a.name.startsWith('data-anim') || a.name === 'data-component-list').map((a) => a.name).slice(0, 2).join(',');
        window.__reg.set(id, { d: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '') + (anim ? '[' + anim + ']' : ''), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40), pos, w: Math.round(r.width), h: Math.round(r.height), s: [] }); }
      window.__reg.get(id).s.push([Math.round(y), Math.round(r.top), Math.round(r.height), s.transform === 'none' ? '' : s.transform.slice(0, 70), +op.toFixed(2)]);
    }
  };
  window.__anims = () => document.getAnimations().map((a) => { const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : {}; return { d: t.duration, e: t.easing, i: t.iterations, n: a.animationName || a.transitionProperty || 'wa', k: a.constructor.name }; });
});

const H = await page.evaluate(() => document.documentElement.scrollHeight);
result.docHeight = H; result.docVh = +(H / vp.height).toFixed(1);
const stepPx = Math.round(vp.height * 0.4);
const maxSteps = +(maxStepsArg || 260);
const steps = Math.min(Math.ceil((H - vp.height) / stepPx) + 1, maxSteps);
result.steps = steps; result.stepPx = stepPx;
const perStep = [];
const animAgg = {};
for (let i = 0; i < steps; i++) {
  const y = Math.min(i * stepPx, H - vp.height);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(220);
  const rec = await page.evaluate((y) => {
    window.__sample(y);
    const vw = innerWidth, vh = innerHeight;
    const w = window.__visibleWords();
    const bg = window.__bgAt(vw / 2, vh / 2);
    const anims = window.__anims().filter((a) => a.i !== Infinity);
    return { y: Math.round(scrollY), ...w, bg, lum: window.__lum(bg), anims };
  }, y);
  for (const a of rec.anims) { const k = `${a.k}|${a.d}|${a.e}`; animAgg[k] = (animAgg[k] || 0) + 1; }
  delete rec.anims; perStep.push(rec);
}
result.perStep = perStep;
result.runningAnimations = Object.entries(animAgg).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, c]) => ({ k, c }));

// ---- screenshots at 8 positions ----
const Hn = await page.evaluate(() => document.documentElement.scrollHeight);
for (let i = 0; i < 8; i++) {
  const y = Math.round((Hn - vp.height) * (i / 7));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: join(outDir, `${mode}-${i}.jpg`), type: 'jpeg', quality: 72 });
}

// ---- final DOM-wide measurements ----
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
const dom = await page.evaluate(() => {
  const vh = innerHeight, vw = innerWidth;
  const css = (el) => { const s = getComputedStyle(el); return { fs: s.fontSize, fw: s.fontWeight, ls: s.letterSpacing, lh: s.lineHeight, ff: s.fontFamily.split(',')[0].replace(/["']/g, '') }; };
  const wc = (t) => t.trim().split(/\s+/).filter(Boolean).length;
  // type scale over every text-parent element
  const scale = {}; const parents = new Set();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) { if (n.nodeValue.trim() && n.parentElement && !window.__skip(n.parentElement)) parents.add(n.parentElement); }
  const blocks = [];
  for (const p of parents) {
    const s = css(p); const w = wc(p.textContent); const r = p.getBoundingClientRect();
    if (r.width === 0 || parseFloat(s.fs) < 6) continue;
    const k = `${s.fs}|${s.fw}|${s.ls}|${s.lh}`; (scale[k] ||= { words: 0, n: 0, ex: p.textContent.trim().slice(0, 40) }); scale[k].words += w; scale[k].n++;
    if (w >= 8) blocks.push({ w: Math.round(r.width), fs: parseFloat(s.fs), words: w });
  }
  const topScale = Object.entries(scale).sort((a, b) => b[1].words - a[1].words).slice(0, 14).map(([k, v]) => ({ k, ...v }));
  const widths = blocks.map((b) => b.w).sort((a, b) => a - b);
  const cpl = blocks.map((b) => Math.round(b.w / (b.fs * 0.5))).sort((a, b) => a - b);
  // headline-ish elements
  const take = (sel) => { const seen = new Set(); const out = []; for (const el of document.querySelectorAll(sel)) { if (window.__skip(el)) continue; const t = el.innerText.trim().replace(/\s+/g, ' '); if (!t || seen.has(t)) continue; seen.add(t); out.push({ t: t.slice(0, 90), w: wc(t), ...css(el) }); } return out; };
  const headlines = take('h1,h2,[class*="headline"]:not(h1):not(h2)');
  const subheads = take('[class*="subhead"],[class*="intro"]:not(section)');
  const eyebrows = take('[class*="eyebrow"]');
  const h3 = take('h3,h4');
  // sections
  const secs = [...document.querySelectorAll('section')].filter((s) => !s.parentElement.closest('section')).map((s) => {
    const r = s.getBoundingClientRect(); const cs = getComputedStyle(s);
    const h = s.querySelector('h1,h2,[class*="headline"]');
    return { id: s.id || '', cls: (s.className || '').toString().split(/\s+/)[0].slice(0, 40), label: s.getAttribute('aria-label') || '', head: h ? h.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) : '', hVh: +(r.height / vh).toFixed(2), bg: cs.backgroundColor, lum: window.__lum(cs.backgroundColor), video: s.querySelectorAll('video').length, canvas: s.querySelectorAll('canvas').length, img: s.querySelectorAll('img').length, words: wc(s.innerText || '') };
  }).filter((s) => s.hVh > 0.15);
  // media
  const videos = [...document.querySelectorAll('video')].map((v) => ({ src: (v.currentSrc || v.src || (v.querySelector('source') || {}).src || '').replace(/\?.*/, '').slice(-90), auto: v.autoplay, loop: v.loop, muted: v.muted, poster: !!v.poster, preload: v.preload, w: Math.round(v.getBoundingClientRect().width) }));
  const canvases = [...document.querySelectorAll('canvas')].map((c) => ({ w: c.width, h: c.height, cls: (c.className || '').toString().slice(0, 40) }));
  // sticky / fixed
  const sticky = []; const fixed = [];
  for (const el of document.body.querySelectorAll('*')) { const s = getComputedStyle(el); if (s.position === 'sticky') { const r = el.getBoundingClientRect(); sticky.push({ d: el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(/\s+/)[0], top: s.top, h: Math.round(r.height), parentH: Math.round(el.parentElement.getBoundingClientRect().height) }); } else if (s.position === 'fixed') { const r = el.getBoundingClientRect(); fixed.push({ d: el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(/\s+/)[0], h: Math.round(r.height), w: Math.round(r.width) }); } }
  // CTAs
  const ctaRe = /^(buy|learn more|order|shop|pre-?order|compare|watch the film|play|try|find out|get started|see all|explore|trade in|get (the|your)|select|discover)/i;
  const ctas = [...document.querySelectorAll('a,button')].filter((a) => !a.closest('footer') && !a.closest('#globalnav,[class*="ac-gn"]')).map((a) => ({ t: (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), y: +((a.getBoundingClientRect().top + scrollY) / document.documentElement.scrollHeight).toFixed(3), inLocal: !!a.closest('#localnav,#ac-localnav,.ac-localnav'), cls: (a.className || '').toString().slice(0, 40) })).filter((a) => ctaRe.test(a.t));
  // local nav
  const ln = document.querySelector('#localnav,#ac-localnav,.ac-localnav'); let local = null;
  if (ln) { const r = ln.getBoundingClientRect(); const s = getComputedStyle(ln); local = { cls: (ln.className || '').toString().slice(0, 60), pos: s.position, top: Math.round(r.top), h: Math.round(r.height), bg: s.backgroundColor, backdrop: s.backdropFilter || s.webkitBackdropFilter, links: [...ln.querySelectorAll('a')].map((a) => a.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 14) }; }
  const gn = document.querySelector('#globalnav,#ac-globalnav'); let glob = null;
  if (gn) { const s = getComputedStyle(gn); const r = gn.getBoundingClientRect(); glob = { pos: s.position, h: Math.round(r.height), bg: s.backgroundColor, backdrop: s.backdropFilter || s.webkitBackdropFilter }; }
  // CSS motion tokens: computed transitions + stylesheet scan
  const tr = {}; for (const el of document.body.querySelectorAll('*')) { const s = getComputedStyle(el); if (s.transitionDuration !== '0s') { const ds = s.transitionDuration.split(', '), es = s.transitionTimingFunction.split(/,\s(?![^()]*\))/); ds.forEach((dd, i) => { if (dd === '0s') return; const k = `${dd}|${es[i % es.length]}`; tr[k] = (tr[k] || 0) + 1; }); } }
  const an = {}; for (const el of document.body.querySelectorAll('*')) { const s = getComputedStyle(el); if (s.animationName !== 'none') { const k = `${s.animationName}|${s.animationDuration}|${s.animationTimingFunction}|${s.animationIterationCount}`; an[k] = (an[k] || 0) + 1; } }
  const sheetTxt = []; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) sheetTxt.push(r.cssText); } catch (e) {} }
  const all = sheetTxt.join('\n');
  const bez = {}; (all.match(/cubic-bezier\([^)]*\)/g) || []).forEach((b) => (bez[b] = (bez[b] || 0) + 1));
  const durs = {}; (all.match(/(?:transition|animation)(?:-duration)?:[^;}]*/g) || []).forEach((rule) => (rule.match(/\b\d*\.?\d+m?s\b/g) || []).forEach((x) => (durs[x] = (durs[x] || 0) + 1)));
  const tokens = {}; (all.match(/--[a-z0-9-]*(?:duration|easing|ease|timing)[a-z0-9-]*:[^;]+/gi) || []).slice(0, 25).forEach((t, i) => (tokens[i] = t));
  const scrollTimeline = /animation-timeline|scroll-timeline|view-timeline/.test(all);
  const globals = { gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, Lenis: !!window.Lenis, AC: !!window.AC, acAnim: !!document.querySelector('[data-anim-keyframe],[data-anim-scroll-group],[data-anim-timeline]'), animKeyframe: document.querySelectorAll('[data-anim-keyframe]').length, animGroups: document.querySelectorAll('[data-anim-scroll-group]').length };
  const imgs = document.images.length;
  const caps = [...document.querySelectorAll('[class*="gallery"],[class*="carousel"],[class*="slider"],[class*="tile"],[class*="bento"]')].length;
  const tables = document.querySelectorAll('table,[class*="compare"],[class*="comparison"]').length;
  return { topScale, widths: { n: widths.length, med: widths[widths.length >> 1], max: widths[widths.length - 1], p90: widths[Math.floor(widths.length * 0.9)], cplMed: cpl[cpl.length >> 1], cplMax: cpl[cpl.length - 1] }, headlines, subheads, eyebrows, h3, secs, videos, canvases, sticky, fixed, ctas, local, glob, tr, an, bez, durs, tokens, scrollTimeline, globals, imgs, caps, tables, totalWords: wc(document.body.innerText) };
});
Object.assign(result, dom);
// ---- local nav behaviour across scroll ----
const lnb = [];
for (const f of [0, 0.05, 0.1, 0.2, 0.4, 0.7, 1]) {
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), f);
  await page.waitForTimeout(450);
  lnb.push(await page.evaluate((f) => { const ln = document.querySelector('#localnav,#ac-localnav,.ac-localnav'); if (!ln) return { f, none: true }; const r = ln.getBoundingClientRect(); const s = getComputedStyle(ln); const buy = [...ln.querySelectorAll('a,button')].filter((a) => /buy|order|shop/i.test(a.innerText)); return { f, top: Math.round(r.top), h: Math.round(r.height), pos: s.position, opacity: s.opacity, bg: s.backgroundColor, buyVisible: buy.some((b) => { const q = b.getBoundingClientRect(); return q.width > 0 && getComputedStyle(b).visibility !== 'hidden' && parseFloat(getComputedStyle(b).opacity) > 0.5; }), cls: (ln.className || '').toString().slice(0, 90) }; }, f));
}
result.localNavScroll = lnb;
// ---- analyse sampled registry ----
const reg = await page.evaluate(() => [...window.__reg.values()]);
const vhPx = vp.height;
const analysed = reg.map((e) => {
  const s = e.s; const tvals = new Set(s.map((x) => x[3] + '|' + x[4]));
  let run = 0, best = 0; // longest run of constant top while scrollY moves
  for (let i = 1; i < s.length; i++) { if (Math.abs(s[i][1] - s[i - 1][1]) < 2 && s[i][0] !== s[i - 1][0]) { run++; best = Math.max(best, run); } else run = 0; }
  const scaleVals = s.map((x) => { const m = x[3].match(/matrix\(([^)]*)\)/); if (!m) return 1; return +parseFloat(m[1].split(',')[0]).toFixed(3); });
  const tyVals = s.map((x) => { const m = x[3].match(/matrix\(([^)]*)\)/); if (!m) return 0; return +parseFloat(m[1].split(',')[5]).toFixed(1); });
  return { ...e, distinct: tvals.size, pinnedSteps: best, pinnedVh: +(best * 0.4).toFixed(1), scaleRange: [Math.min(...scaleVals), Math.max(...scaleVals)], tyRange: [Math.min(...tyVals), Math.max(...tyVals)], opRange: [Math.min(...s.map((x) => x[4])), Math.max(...s.map((x) => x[4]))], n: s.length };
});
result.pinned = analysed.filter((e) => e.pinnedSteps >= 3 && e.h >= vhPx * 0.3).sort((a, b) => b.pinnedSteps - a.pinnedSteps).slice(0, 12).map(({ s, ...r }) => r);
result.scrollLinked = analysed.filter((e) => e.distinct >= 5 && e.n >= 5).sort((a, b) => b.distinct - a.distinct).slice(0, 14).map((e) => ({ ...e, series: e.s.filter((_, i, a) => i % Math.max(1, Math.floor(a.length / 10)) === 0).slice(0, 10).map((x) => ({ y: x[0], top: x[1], tf: x[3].slice(0, 60), op: x[4] })), s: undefined }));
result.scrollLinkedCount = analysed.filter((e) => e.distinct >= 5 && e.n >= 5).length;
result.imageSequences = Object.entries(net.seq).filter(([, s]) => s.size >= 12).map(([k, s]) => ({ k: k.slice(-100), frames: s.size })).slice(0, 8);
result.mediaRequests = [...new Set(net.media)].slice(0, 12);
writeFileSync(join(outDir, `metrics-${mode}.json`), JSON.stringify(result, null, 1));
console.log(slug, mode, 'ok', 'docVh', result.docVh, 'steps', steps, 'pinned', result.pinned.length, 'linked', result.scrollLinkedCount);
await browser.close();
