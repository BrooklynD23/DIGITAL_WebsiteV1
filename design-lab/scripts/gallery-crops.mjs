// Usage: node design-lab/scripts/gallery-crops.mjs
// Measures each concept's NAVIGATION / HERO / PROJECT CARD / CTA / TYPOGRAPHY blocks in the live DOM at 1440
// (getBoundingClientRect + scrollY), checks the document height still matches the v2 render, then cuts the
// crops out of renders/<x>/v2/<x>-desktop.png. Sources -> design-lab/comparison/crops/*.png,
// web copies -> public/design-lab/gallery/crops/*.webp, measured boxes -> design-lab/comparison/crops/regions.json.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
const SRC_DIR = 'design-lab/comparison/crops';
const WEB_DIR = 'public/design-lab/gallery/crops';
mkdirSync(SRC_DIR, { recursive: true });
mkdirSync(WEB_DIR, { recursive: true });

// Per concept: selector of each block. `typeBox` overrides the heading+paragraph heuristic where the
// heading is followed by a table (A) or the work heading is too small to show the face (B).
const SPEC = {
  a: { hero: 'section[class*="cover"]', project: 'article#dg-001', cta: '#join', type: '#work-title', typeBox: { sel: '#fit', dy: 40, h: 700 } },
  b: { hero: 'section#top', project: 'article#dg-001', cta: '#join', type: '#work-title', typeBox: { sel: '#process', dy: 80, h: 620 } },
  c: { hero: 'section[class*="hero"]', project: '#work article', cta: '#join', type: '#c-work-title' },
  d: { hero: 'section[class*="hero"]', project: '#work article', cta: '#join', type: '#d-work-h' },
  e: { hero: 'section[class*="hero"]', project: 'article#case-dg-001', cta: '#join', type: '#e-cases-title' },
  f: { hero: 'section#sign', project: '#bench article', cta: '#thursday', type: '#bench-title' },
};
const CAP = { hero: 1000, project: 1300, cta: 1000, type: 460 };

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}
const pngSize = (f) =>
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f])
    .toString().trim().split(',').map(Number);

const browser = await chromium.launch({
  executablePath: findHeadlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const regions = {};
for (const [x, spec] of Object.entries(SPEC)) {
  await page.goto(`${base}/design-lab/${x}/`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1500);
  const m = await page.evaluate(({ spec, CAP }) => {
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
    };
    const q = (s) => document.querySelector(`#main-content ${s}`) ?? document.querySelector(s);
    const out = { docH: document.documentElement.scrollHeight };
    const nav = document.querySelector('#main-content header');
    out.nav = { ...box(nav), x: 0, w: 1440 };
    for (const k of ['hero', 'cta']) {
      const b = box(q(spec[k]));
      out[k] = { x: 0, w: 1440, y: b.y, h: Math.min(b.h, CAP[k]) };
    }
    const p = box(q(spec.project));
    out.project = { x: p.x - 16, w: p.w + 32, y: p.y - 16, h: Math.min(p.h + 32, CAP.project) };
    // Typography: the section heading plus the elements that follow it (eyebrow above if it shares a parent).
    const h2 = q(spec.type);
    const parts = [h2];
    let host = h2;
    while (!host.nextElementSibling && host.parentElement) host = host.parentElement;
    let sib = host.nextElementSibling;
    for (let i = 0; sib && i < 2; i += 1, sib = sib.nextElementSibling) parts.push(sib);
    const prev = h2.previousElementSibling;
    if (prev) parts.push(prev);
    const bs = parts.map(box).filter((b) => b.h > 0);
    const y0 = Math.min(...bs.map((b) => b.y));
    const x0 = Math.min(...bs.map((b) => b.x));
    const x1 = Math.max(...bs.map((b) => b.x + b.w));
    const y1 = Math.max(...bs.map((b) => b.y + b.h));
    if (spec.typeBox) {
      const t = box(q(spec.typeBox.sel));
      out.type = { x: 0, w: 1440, y: t.y + spec.typeBox.dy, h: spec.typeBox.h };
      return out;
    }
    out.type = { x: x0 - 24, w: Math.max(x1 - x0 + 48, 640), y: y0 - 24, h: Math.min(y1 - y0 + 48, CAP.type) };
    return out;
  }, { spec, CAP });
  const png = `design-lab/renders/${x}/v2/${x}-desktop.png`;
  const [W, H] = pngSize(png);
  if (H !== m.docH) console.warn(`!! ${x}: render height ${H} != live document height ${m.docH} (crops may drift)`);
  regions[x] = m;
  for (const row of ['nav', 'hero', 'project', 'cta', 'type']) {
    const r = m[row];
    const cx = Math.max(0, Math.round(r.x));
    const cy = Math.max(0, Math.round(r.y));
    const cw = Math.min(W - cx, Math.round(r.w));
    const ch = Math.min(H - cy, Math.round(r.h));
    const src = `${SRC_DIR}/${row}-${x}.png`;
    // Nav bars are 1440×~60: stack the left and right halves so the bar stays legible in a narrow cell.
    const vf = row === 'nav'
      ? `crop=${cw}:${ch}:${cx}:${cy},split[l][r];[l]crop=iw/2:ih:0:0[L];[r]crop=iw/2:ih:iw/2:0[R];[L][R]vstack`
      : `crop=${cw}:${ch}:${cx}:${cy}`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-filter_complex', vf, src]);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', "scale='min(960,iw)':-2:flags=lanczos",
      '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6', `${WEB_DIR}/${row}-${x}.webp`]);
    const [w, h] = pngSize(src);
    console.log(`${row}-${x}: y ${cy}..${cy + ch} x ${cx}..${cx + cw} -> ${w}x${h}`);
  }
}
writeFileSync(`${SRC_DIR}/regions.json`, JSON.stringify(regions, null, 2));
await browser.close();
