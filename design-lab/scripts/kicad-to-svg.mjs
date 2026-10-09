// Usage: node design-lab/scripts/kicad-to-svg.mjs   (run after kicad-to-json.mjs)
// Emits one static SVG per board × layer × projection into public/design-lab/r2/boards/<board>/<layer>-<proj>.svg,
// plus app/design-lab/r2/_system/boards/layers-manifest.json (viewBoxes + layer list, numbers only).
// Input is the already privacy-audited board JSON, so no KiCad text can reach these files.
// Colour: every file paints with currentColor and var(--board-*) inline styles. Pages reference the layer through
// <svg><use href="…svg#l"/></svg>, so colour and CSS variables inherit from the page (an <img> could not).
// Drawing attributes mirror BoardSvg.tsx layer by layer, so both renderers look the same.
import { readFileSync, writeFileSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const JSON_DIR = 'app/design-lab/r2/_system/boards';
const OUT = 'public/design-lab/r2/boards';
const BOARDS = ['zynq-carrier-power', 'fingerprint'];
const LAYERS = ['B.Silk', 'B.Pads', 'B.Cu', 'substrate', 'edge', 'vias', 'F.Cu', 'F.Pads', 'F.Silk', 'bodies'];
const ISO = 'matrix(.866 .5 -.866 .5 0 0)';
const NS = 'vector-effect="non-scaling-stroke"';

export const slug = (layer) => layer.toLowerCase().replace('.', '-');
const n = (v) => {
  const s = (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
  return s === '-0' || s === '' ? '0' : s.replace(/^(-?)0\./, '$1.');
};
const color = (v) => `style="color:var(${v},currentColor)"`;

function pad(p) {
  const t = p.a ? ` transform="rotate(${n(-p.a)} ${n(p.x)} ${n(p.y)})"` : '';
  if (p.s === 'circle') return `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(p.w / 2)}"/>`;
  const m = Math.min(p.w, p.h);
  const rx = p.s === 'oval' ? m / 2 : p.s === 'roundrect' ? (p.rr ?? 0.25) * m : 0;
  return `<rect x="${n(p.x - p.w / 2)}" y="${n(p.y - p.h / 2)}" width="${n(p.w)}" height="${n(p.h)}"${rx ? ` rx="${n(rx)}"` : ''}${t}/>`;
}

function pads(board, side) {
  const list = board.footprints.filter((f) => !f.parked).flatMap((f) => f.pads.filter((p) => p.l === side || p.l === 'FB'));
  if (!list.length) return '';
  const holes = list.filter((p) => p.d);
  return `<g ${color('--board-copper')} fill="currentColor" fill-opacity=".55" stroke="currentColor" stroke-width=".6">${list.map(pad).join('')}</g>${
    holes.length
      ? `<g style="fill:var(--board-hole,none);color:var(--board-ink,currentColor)" stroke="currentColor" stroke-width=".6">${holes.map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(p.d / 2)}"/>`).join('')}</g>`
      : ''
  }`;
}

function copper(board, side) {
  const zones = board.zones.filter((z) => z.l === side);
  const tracks = board.tracks.filter((t) => t.l === side);
  if (!zones.length && !tracks.length) return '';
  const z = zones.map((zn) => `<path d="${zn.d}"${zn.filled ? '' : ' fill="none" stroke-dasharray="3 3"'}/>`).join('');
  const t = tracks.map((tr) => `<path d="${tr.d}" stroke-width="${n(tr.w)}"/>`).join('');
  return `<g ${color('--board-copper')}><g fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".45" stroke-width=".5">${z}</g><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".9">${t}</g></g>`;
}

function content(board, layer) {
  const outline = [board.outline, ...board.cutouts].join('');
  switch (layer) {
    case 'substrate':
      return `<path d="${outline}" ${color('--board-substrate')} fill="currentColor" fill-opacity=".07" fill-rule="evenodd"/>`;
    case 'edge': {
      const npth = board.footprints.filter((f) => !f.parked).flatMap((f) => f.pads.filter((p) => p.l === 'H'));
      return `<g ${color('--board-ink')} fill="none" stroke="currentColor"><path d="${outline}" stroke-width="1.25" ${NS}/>${npth
        .map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n((p.d ?? p.w) / 2)}" stroke-width=".75" ${NS}/>`)
        .join('')}</g>`;
    }
    case 'B.Cu':
      return copper(board, 'B');
    case 'F.Cu':
      return copper(board, 'F');
    case 'B.Pads':
      return pads(board, 'B');
    case 'F.Pads':
      return pads(board, 'F');
    case 'B.Silk':
    case 'F.Silk': {
      const d = board.silk[layer[0]];
      return d ? `<path d="${d}" ${color('--board-silk')} fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width=".75" ${NS}/>` : '';
    }
    case 'vias':
      return board.vias.length
        ? `<g style="fill:var(--board-hole,none);color:var(--board-copper,currentColor)" stroke="currentColor" stroke-width=".75">${board.vias
            .map(([x, y, s, d]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(s / 2)}"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(d / 2)}" stroke-opacity=".6"/>`)
            .join('')}</g>`
        : '';
    case 'bodies': {
      const b = board.footprints.filter((f) => !f.parked && f.body);
      return b.length
        ? `<g ${color('--board-ink')} fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width=".6" stroke-dasharray="2 2">${b
            .map((f) => `<path d="M${f.body.map(([x, y]) => `${n(x)} ${n(y)}`).join('L')}Z"/>`)
            .join('')}</g>`
        : '';
    }
    default:
      return '';
  }
}

/** Shared base viewBox (explode = 0) per projection: board rect ∪ placed pads ∪ bodies, padded 4%. */
function viewBoxes(board) {
  const { w, h } = board.size;
  const xs = [0, w];
  const ys = [0, h];
  for (const f of board.footprints.filter((fp) => !fp.parked)) {
    for (const p of f.pads) xs.push(p.x - p.w / 2, p.x + p.w / 2) && ys.push(p.y - p.h / 2, p.y + p.h / 2);
    for (const [x, y] of f.body ?? []) xs.push(x) && ys.push(y);
  }
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pad = Math.max(w, h) * 0.04;
  const box = (pts) => {
    const px = pts.map((p) => p[0]);
    const py = pts.map((p) => p[1]);
    const mx = Math.min(...px) - pad;
    const my = Math.min(...py) - pad;
    return [mx, my, Math.max(...px) + pad - mx, Math.max(...py) + pad - my].map((v) => Math.round(v * 100) / 100);
  };
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  return { flat: box(corners), iso: box(corners.map(([x, y]) => [0.866 * (x - y), 0.5 * (x + y)])) };
}

const manifest = {};
let total = 0;
for (const id of BOARDS) {
  const board = JSON.parse(readFileSync(join(JSON_DIR, `${id}.json`), 'utf8'));
  const vb = viewBoxes(board);
  const dir = join(OUT, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const present = [];
  const sizes = {};
  for (const layer of LAYERS) {
    const body = content(board, layer);
    if (!body) continue;
    present.push(layer);
    for (const proj of ['flat', 'iso']) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb[proj].join(' ')}"><g id="l"${proj === 'iso' ? ` transform="${ISO}"` : ''}>${body}</g></svg>`;
      const file = join(dir, `${slug(layer)}-${proj}.svg`);
      writeFileSync(file, svg);
      const size = statSync(file).size;
      sizes[`${slug(layer)}-${proj}`] = size;
      total += size;
    }
  }
  manifest[id] = {
    size: board.size,
    layers: present,
    viewBox: vb,
    /** Right-hand board corner (w, 0) per projection, for layer labels. */
    anchor: { flat: [board.size.w, 0], iso: [Math.round(0.866 * board.size.w * 100) / 100, Math.round(0.5 * board.size.w * 100) / 100] },
  };
  console.log(id, Object.entries(sizes).map(([k, v]) => `${k} ${(v / 1024).toFixed(1)}K`).join(' | '));
}
writeFileSync(join(JSON_DIR, 'layers-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`total ${(total / 1024).toFixed(1)} KB across ${Object.values(manifest).reduce((a, m) => a + m.layers.length * 2, 0)} files`);
