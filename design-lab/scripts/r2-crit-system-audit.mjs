// W2-CRIT-SYSTEM evidence pass: one Playwright sweep over all 8 round-2 routes.
// Usage: node design-lab/scripts/r2-crit-system-audit.mjs [--base=http://localhost:3199] [--steps=10] [--only=signal/brain]
// Per route × viewport (1440×900, 390×844):
//   - network: bytes by type at load+2.5s ("eager") and after a full scroll ("total"); which cine files load eagerly
//   - chrome: nav / local nav position + height + CTA labels; fonts used by visible text; overflow-x
//   - N evenly spaced scroll steps: viewport PNG, red blobs (pixel scan), moving regions (2 frames 700ms apart),
//     DOM elements painted in a red token, running CSS animations, playing videos, words in viewport
// Output: design-lab/renders/r2/crit/system/{shots/<world>-<page>-<vp>-NN.png, audit.json}
import { chromium } from 'playwright';
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const flag = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? `=${d}`).split('=').slice(1).join('=');
const BASE = flag('base', 'http://localhost:3199');
const STEPS = Number(flag('steps', '10'));
const ONLY = flag('only', '');
const OUT = 'design-lab/renders/r2/crit/system';
mkdirSync(join(OUT, 'shots'), { recursive: true });

const ROUTES = ['signal', 'apple'].flatMap((w) => ['', 'sidekick/', 'shades/', 'brain/'].map((p) => ({ world: w, page: p ? p.slice(0, -1) : 'home', path: `/design-lab/r2/${w}/${p}` })))
  .filter((r) => !ONLY || `${r.world}/${r.page}` === ONLY);
const VPS = [
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: '390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];

const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);

const isRed = (r, g, b) => r >= 150 && g <= 125 && b <= 115 && r - g >= 85 && r - b >= 85;

/** Connected components on a boolean cell grid, with `dil` cells of dilation to merge near parts. */
function blobs(cells, cw, ch, cellPx, dil) {
  const grid = new Uint8Array(cw * ch);
  for (let y = 0; y < ch; y += 1) for (let x = 0; x < cw; x += 1) {
    if (!cells[y * cw + x]) continue;
    for (let dy = -dil; dy <= dil; dy += 1) for (let dx = -dil; dx <= dil; dx += 1) {
      const nx = x + dx; const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < cw && ny < ch) grid[ny * cw + nx] = 1;
    }
  }
  const seen = new Uint8Array(cw * ch);
  const out = [];
  for (let i = 0; i < grid.length; i += 1) {
    if (!grid[i] || seen[i]) continue;
    const stack = [i]; seen[i] = 1;
    let x0 = 1e9; let y0 = 1e9; let x1 = -1; let y1 = -1; let hits = 0;
    while (stack.length) {
      const j = stack.pop(); const x = j % cw; const y = (j / cw) | 0;
      if (cells[j]) { hits += 1; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx; const ny = y + dy; const k = ny * cw + nx;
        if (nx >= 0 && ny >= 0 && nx < cw && ny < ch && grid[k] && !seen[k]) { seen[k] = 1; stack.push(k); }
      }
    }
    if (hits) out.push({ x: x0 * cellPx, y: y0 * cellPx, w: (x1 - x0 + 1) * cellPx, h: (y1 - y0 + 1) * cellPx, cells: hits });
  }
  return out;
}

async function raw(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

async function redBlobs(buf) {
  const { data, w, h } = await raw(buf);
  const C = 4; const cw = Math.ceil(w / C); const ch = Math.ceil(h / C);
  const cnt = new Uint16Array(cw * ch);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    const i = (y * w + x) * 3;
    if (isRed(data[i], data[i + 1], data[i + 2])) cnt[((y / C) | 0) * cw + ((x / C) | 0)] += 1;
  }
  const cells = Array.from(cnt, (n) => (n >= 2 ? 1 : 0));
  return blobs(cells, cw, ch, C, 3).filter((b) => b.cells >= 1);
}

async function motionBlobs(a, b) {
  const A = await raw(a); const B = await raw(b);
  const C = 8; const cw = Math.ceil(A.w / C); const ch = Math.ceil(A.h / C);
  const sum = new Float64Array(cw * ch); const n = new Uint16Array(cw * ch);
  for (let y = 0; y < A.h; y += 1) for (let x = 0; x < A.w; x += 1) {
    const i = (y * A.w + x) * 3; const k = ((y / C) | 0) * cw + ((x / C) | 0);
    sum[k] += Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    n[k] += 1;
  }
  const cells = Array.from(sum, (s, k) => (s / (n[k] * 3) > 4 ? 1 : 0));
  return blobs(cells, cw, ch, C, 2).filter((bl) => bl.cells >= 2);
}

const PROBE = () => {
  const vh = innerHeight; const vw = innerWidth;
  const RED = new Set(['rgb(216, 65, 47)', 'rgb(239, 106, 85)', 'rgb(179, 50, 31)']);
  const inView = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  const visible = (el) => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
  const desc = (el) => `${el.tagName.toLowerCase()}${el.getAttribute('class') ? '.' + String(el.getAttribute('class')).split(' ')[0].slice(0, 40) : ''}${el.getAttribute('data-chrome') ? `[chrome=${el.getAttribute('data-chrome')}]` : ''}`;
  const reds = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!inView(r) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const hasText = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
    const hits = [];
    if (hasText && RED.has(cs.color)) hits.push('color');
    if (RED.has(cs.backgroundColor)) hits.push('bg');
    if (['Top', 'Right', 'Bottom', 'Left'].some((s) => RED.has(cs[`border${s}Color`]) && parseFloat(cs[`border${s}Width`]) > 0)) hits.push('border');
    if (el instanceof SVGElement && RED.has(cs.fill) && cs.fill !== 'none') hits.push('fill');
    if (el instanceof SVGElement && RED.has(cs.stroke) && cs.stroke !== 'none') hits.push('stroke');
    if (hits.length) reds.push(`${desc(el)}:${hits.join('+')}`);
  }
  // words in viewport
  let words = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const p = t.parentElement;
    if (!p || !t.textContent.trim() || !visible(p) || p.closest('[aria-hidden="true"]') && !p.closest('[data-chrome]')) continue;
    const range = document.createRange(); range.selectNodeContents(t);
    const r = range.getBoundingClientRect();
    if (inView(r) && !p.closest('script,style,noscript')) words += t.textContent.trim().split(/\s+/).length;
  }
  const anims = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target instanceof Element && inView(a.effect.target.getBoundingClientRect()))
    .map((a) => `${desc(a.effect.target)}:${a.animationName ?? a.constructor.name}${a.effect.getTiming().iterations === Infinity ? '(∞)' : ''}`);
  const vids = [...document.querySelectorAll('video')].map((v) => ({ v, r: v.getBoundingClientRect() }))
    .filter(({ r }) => inView(r)).map(({ v }) => ({ src: (v.currentSrc || '').split('/').pop(), paused: v.paused, t: Number(v.currentTime.toFixed(2)) }));
  const topEl = document.elementFromPoint(vw / 2, 8);
  const topChrome = topEl?.closest('[data-chrome]')?.getAttribute('data-chrome') ?? topEl?.closest('nav,header') ? (topEl.closest('[data-chrome]')?.getAttribute('data-chrome') ?? 'nav?') : null;
  return { reds, words, anims, vids, topChrome, overflowX: document.documentElement.scrollWidth - vw };
};

const CHROME = () => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { pos: cs.position, top: cs.top, h: Math.round(r.height), bg: cs.backgroundColor, font: cs.fontFamily.split(',')[0] }; };
  const nav = document.querySelector('[data-chrome="nav"]');
  const local = document.querySelector('[data-chrome="local-nav"],[data-chrome="localnav"],[data-chrome="local"]');
  const ctaLocal = local ? [...local.querySelectorAll('a,button')].map((a) => a.textContent.trim()).filter(Boolean) : [];
  const navLinks = nav ? [...nav.querySelectorAll('a')].map((a) => a.textContent.trim()) : [];
  const fam = new Map();
  for (const el of document.querySelectorAll('h1,h2,h3,p,li,span,a,button,figcaption,dt,dd,small,label,output,code')) {
    if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    if (el.closest('body > nav, body > footer')) continue;
    const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const tag = el.tagName.toLowerCase();
    const k = `${f}`; const v = fam.get(k) ?? { n: 0, tags: {} }; v.n += 1; v.tags[tag] = (v.tags[tag] ?? 0) + 1; fam.set(k, v);
  }
  const h1 = document.querySelector('h1');
  const fontsLoaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, ''));
  return {
    title: document.title, nav: box(nav), navLinks, local: box(local), localName: local?.getAttribute('data-chrome'), ctaLocal,
    h1: h1 ? { text: h1.textContent.trim().slice(0, 80), font: getComputedStyle(h1).fontFamily.split(',')[0], size: getComputedStyle(h1).fontSize, weight: getComputedStyle(h1).fontWeight } : null,
    families: Object.fromEntries([...fam.entries()].sort((a, b) => b[1].n - a[1].n)), fontsLoaded: [...new Set(fontsLoaded)],
    htmlBytes: document.documentElement.outerHTML.length, domNodes: document.getElementsByTagName('*').length,
    canvases: document.querySelectorAll('canvas').length, videos: document.querySelectorAll('video').length,
    pageH: document.documentElement.scrollHeight,
  };
};

const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const results = [];
for (const r of ROUTES) {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: vp.viewport, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const net = []; let phase = 'eager';
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    page.on('requestfinished', async (req) => {
      try {
        const s = await req.sizes();
        net.push({ phase, url: req.url().replace(BASE, ''), type: req.resourceType(), bytes: s.responseBodySize + s.responseHeadersSize });
      } catch { /* ignore */ }
    });
    const label = `${r.world}-${r.page}-${vp.name}`;
    const t0 = Date.now();
    try {
      await page.goto(BASE + r.path, { waitUntil: 'networkidle', timeout: 120000 });
    } catch (e) { errors.push(`goto: ${String(e).slice(0, 120)}`); }
    await page.waitForTimeout(2500);
    const chrome = await page.evaluate(CHROME);
    const eagerNet = net.slice();
    phase = 'scroll';
    const H = chrome.pageH; const vh = vp.viewport.height;
    const steps = [];
    for (let i = 0; i < STEPS; i += 1) {
      const y = Math.round(((H - vh) * i) / (STEPS - 1));
      // wheel-ish: scroll in 3 hops so scroll listeners and scroll timelines see movement
      for (const f of [0.34, 0.67, 1]) {
        await page.evaluate(([yy]) => window.scrollTo({ top: yy, behavior: 'instant' }), [Math.round(y * f + (steps.at(-1)?.y ?? 0) * (1 - f))]);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(1100);
      const a = await page.screenshot();
      await page.waitForTimeout(700);
      const b = await page.screenshot();
      const file = join(OUT, 'shots', `${label}-${String(i).padStart(2, '0')}.png`);
      writeFileSync(file, a);
      const probe = await page.evaluate(PROBE);
      steps.push({ i, y, red: (await redBlobs(a)).map((bl) => [bl.x, bl.y, bl.w, bl.h]), moving: (await motionBlobs(a, b)).map((bl) => [bl.x, bl.y, bl.w, bl.h]), ...probe });
    }
    await page.waitForTimeout(1500);
    const sum = (arr, pred) => arr.filter(pred).reduce((s, x) => s + x.bytes, 0);
    const byType = (arr) => Object.fromEntries(['document', 'script', 'stylesheet', 'font', 'image', 'media', 'fetch', 'other'].map((t) => [t, sum(arr, (x) => (t === 'other' ? !['document', 'script', 'stylesheet', 'font', 'image', 'media', 'fetch'].includes(x.type) : x.type === t))]));
    results.push({
      route: r.path, world: r.world, page: r.page, vp: vp.name, ms: Date.now() - t0, errors, chrome,
      net: { eager: byType(eagerNet), total: byType(net), eagerMedia: eagerNet.filter((x) => x.type === 'media' || /\.(mp4|webm)/.test(x.url)).map((x) => `${x.url} ${x.bytes}`), allMedia: net.filter((x) => /\.(mp4|webm)/.test(x.url)).map((x) => `${x.phase} ${x.url} ${x.bytes}`), fonts: net.filter((x) => x.type === 'font').map((x) => `${x.url.split('/').pop()} ${x.bytes}`) },
      steps,
    });
    console.log(`${label}: H=${H} steps=${steps.length} red/step=[${steps.map((s) => s.red.length).join(',')}] moving=[${steps.map((s) => s.moving.length).join(',')}] words=[${steps.map((s) => s.words).join(',')}] errors=${errors.length}`);
    await ctx.close();
  }
}
await browser.close();
const outFile = join(OUT, ONLY ? `audit-${ONLY.replace('/', '-')}.json` : 'audit.json');
writeFileSync(outFile, JSON.stringify(results, null, 1));
console.log(`wrote ${outFile}`);
