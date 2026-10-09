// Usage: node design-lab/scripts/sidekick-mainboard.mjs <path/to/zynq_sdr_dongle.kicad_pcb>
// Reads the SIDEKICK FPGA main-board KiCad file (treated as data: parsed, never executed) and emits
//   public/boards/sidekick-mainboard/<layer>.svg        one isometric SVG per copper layer + core
//   public/boards/sidekick-mainboard/parts-<group>-<f|b>.svg   one extruded body per footprint
//   public/boards/sidekick-mainboard/components.json    every footprint: ref, value, package, x/y/w/h, rot, side, group
//   app/(apple)/_sidekick/mainboard-manifest.json               viewBox, tiers, labels, counts (numbers and ids only)
// Every file paints with currentColor through <use href="…#l">, like kicad-to-svg.mjs. All coordinates are already
// projected (x right-down, y left-down, z up), so pages move whole boxes and never touch paths.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { parseSexpr, kids, kid, val, num } from './kicad-sexpr.mjs';
import { toBoard } from './kicad-geom.mjs';

const SRC = process.argv[2];
if (!SRC) throw new Error('usage: node design-lab/scripts/sidekick-mainboard.mjs <file.kicad_pcb>');
const OUT = 'public/boards/sidekick-mainboard';
const MANIFEST = 'app/(apple)/_sidekick/mainboard-manifest.json';
const BUDGET = 250 * 1024;

/** Copper layers top → bottom with their tier in the exploded stack (the 0.127 mm centre core sits at tier 0). */
const COPPER = [
  ['F.Cu', 3],
  ['In1.Cu', 2],
  ['In2.Cu', 1],
  ['In3.Cu', -1],
  ['In4.Cu', -2],
  ['B.Cu', -3],
];
/** Functional group per schematic sheet (the footprint's own `sheetname`). Root-sheet parts are board I/O. */
const GROUP_OF = {
  'PS Config': 'compute',
  'PL Config': 'compute',
  'PL Connector': 'compute',
  'PL Transceiver': 'compute',
  'PS DDR': 'memory',
  'Power Manage': 'power',
  'Transceiver Powr': 'power',
  'USB Connector': 'usb',
  'Transceiver RF': 'rf',
  'BTB Connector': 'io',
  '': 'io',
};
const GROUPS = ['compute', 'memory', 'power', 'usb', 'rf', 'io'];
/** Drawn body height in mm by package class. Artwork only: never printed as a spec. */
const HEIGHTS = [
  [/USB_C/, 3.2],
  [/USB_Micro/, 2.6],
  [/BM03B/, 2.2],
  [/microSD|EVQ9P/, 1.5],
  [/BGA|CLG/, 1.3],
  [/U\.FL|SlimStack|L_Murata/, 1.1],
  [/Oscillator|QFN|DFN|VQFN/, 0.8],
  [/PinHeader/, 0.15], // through-hole land pattern; J11 is marked DNP in the schematic
  [/WLCSP|WCSP|wlp|Balun/, 0.6],
];
const Z = 1.6; // vertical exaggeration of body heights

const root = parseSexpr(readFileSync(SRC, 'utf8'));
const r = (v) => {
  const s = (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
  return s === '-0' || s === '' ? '0' : s.replace(/^(-?)0\./, '$1.');
};

// ---------------------------------------------------------------- footprints
const footprints = kids(root, 'footprint')
  .map((f) => {
    const props = Object.fromEntries(kids(f, 'property').map((p) => [p[1], p[2]]));
    const at = kid(f, 'at');
    return { node: f, ref: props.Reference, value: props.Value, footprint: f[1], at: [num(at[1]), num(at[2])], rot: num(at[3] ?? '0'), side: val(f, 'layer') === 'B.Cu' ? 'b' : 'f', sheet: val(f, 'sheetname') ?? '' };
  })
  .filter((f) => !/^FID/.test(f.ref)); // panel fiducials sit on the rails, outside the board

// ---------------------------------------------------------------- board unit inside the fabrication panel
// ponytail: assumes a rectangular unit; the file is a 4-up panel with only one unit populated. The unit edge is the
// nearest long Edge.Cuts line on each side of the footprints. A non-rectangular board needs real loop chaining.
const cuts = kids(root, 'gr_line')
  .filter((g) => val(g, 'layer') === 'Edge.Cuts')
  .map((g) => [kid(g, 'start'), kid(g, 'end')].map((p) => [num(p[1]), num(p[2])]));
const xs = footprints.map((f) => f.at[0]);
const ys = footprints.map((f) => f.at[1]);
const horiz = cuts.filter(([a, b]) => Math.abs(a[1] - b[1]) < 0.01 && Math.abs(a[0] - b[0]) > 20).map(([a]) => a[1]);
const vert = cuts.filter(([a, b]) => Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) > 5).map(([a]) => a[0]);
const X0 = Math.max(...vert.filter((x) => x <= Math.min(...xs)));
const X1 = Math.min(...vert.filter((x) => x >= Math.max(...xs)));
const Y0 = Math.max(...horiz.filter((y) => y <= Math.min(...ys)));
const Y1 = Math.min(...horiz.filter((y) => y >= Math.max(...ys)));
const W = Math.round((X1 - X0) * 100) / 100;
const H = Math.round((Y1 - Y0) * 100) / 100;
assert(W > 10 && H > 10 && Number.isFinite(W + H), `board unit not found (${W} × ${H})`);
const inUnit = ([x, y], m = 0.5) => x >= X0 - m && x <= X1 + m && y >= Y0 - m && y <= Y1 + m;

/** Board mm (file coordinates) + height → projected isometric point. */
const proj = ([x, y], z = 0) => [0.866 * (x - X0 - (y - Y0) + H), 0.5 * (x - X0 + (y - Y0)) - z];
const P = (p, z) => proj(p, z).map(r).join(' ');
const poly = (pts, z = 0) => `M${pts.map((p) => P(p, z)).join('L')}Z`;
const RECT = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]];
const OUTLINE = poly(RECT);

// ---------------------------------------------------------------- copper: tracks chained into polylines
function tracks(layer) {
  const byWidth = new Map();
  const add = (w, a, b) => {
    if (!inUnit(a) || !inUnit(b)) return;
    if (!byWidth.has(w)) byWidth.set(w, []);
    byWidth.get(w).push([a, b]);
  };
  for (const s of kids(root, 'segment')) {
    if (val(s, 'layer') !== layer) continue;
    const [a, b] = ['start', 'end'].map((k) => [num(kid(s, k)[1]), num(kid(s, k)[2])]);
    add(val(s, 'width'), a, b);
  }
  for (const s of kids(root, 'arc')) {
    if (val(s, 'layer') !== layer) continue;
    const [a, m, b] = ['start', 'mid', 'end'].map((k) => [num(kid(s, k)[1]), num(kid(s, k)[2])]);
    add(val(s, 'width'), a, m); // arc as two chords: the radii are a few tenths of a millimetre
    add(val(s, 'width'), m, b);
  }
  let out = '';
  let count = 0;
  for (const [w, segs] of [...byWidth].sort((a, b) => num(a[0]) - num(b[0]))) {
    count += segs.length;
    const key = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
    const ends = new Map();
    segs.forEach((s, i) => s.forEach((p) => ends.set(key(p), [...(ends.get(key(p)) ?? []), i])));
    const used = new Set();
    let d = '';
    const grow = (chain) => {
      for (;;) {
        const tail = chain[chain.length - 1];
        const next = (ends.get(key(tail)) ?? []).find((i) => !used.has(i));
        if (next === undefined) return chain;
        used.add(next);
        const [a, b] = segs[next];
        chain.push(key(a) === key(tail) ? b : a);
      }
    };
    segs.forEach((s, i) => {
      if (used.has(i)) return;
      used.add(i);
      const chain = grow(grow([s[0], s[1]]).reverse());
      d += `M${chain.map((p) => P(p)).join('L')}`;
    });
    out += `<path d="${d}" stroke-width="${r(num(w) * 0.9)}"/>`;
  }
  return { svg: `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".9">${out}</g>`, count };
}

// ---------------------------------------------------------------- copper: planes (zone outlines clipped to the unit)
function clip(pts) {
  // Sutherland–Hodgman against the axis-aligned unit rectangle.
  const edges = [
    [(p) => p[0] >= X0, (a, b) => [X0, a[1] + ((b[1] - a[1]) * (X0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= X1, (a, b) => [X1, a[1] + ((b[1] - a[1]) * (X1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= Y0, (a, b) => [a[0] + ((b[0] - a[0]) * (Y0 - a[1])) / (b[1] - a[1]), Y0]],
    [(p) => p[1] <= Y1, (a, b) => [a[0] + ((b[0] - a[0]) * (Y1 - a[1])) / (b[1] - a[1]), Y1]],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const src = out;
    out = [];
    src.forEach((p, i) => {
      const q = src[(i + 1) % src.length];
      if (inside(p)) out.push(p);
      if (inside(p) !== inside(q)) out.push(cut(p, q));
    });
    if (!out.length) return out;
  }
  return out;
}
function planes(layer) {
  const nets = new Set();
  const d = kids(root, 'zone')
    .filter((z) => val(z, 'net_name') && (val(z, 'layer') === layer || (kid(z, 'layers') ?? []).some((l) => l === layer || l === 'F&B.Cu')))
    .map((z) => {
      // ponytail: outline vertices only (arc corners in a zone outline are skipped)
      const pts = clip(kids(kid(kid(z, 'polygon'), 'pts'), 'xy').map((p) => [num(p[1]), num(p[2])]));
      if (pts.length < 3) return '';
      nets.add(val(z, 'net_name'));
      return poly(pts);
    })
    .join('');
  return { svg: d ? `<path d="${d}" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".4" stroke-width="1" vector-effect="non-scaling-stroke"/>` : '', nets: [...nets] };
}

// ---------------------------------------------------------------- copper: via and pad dots
const allVias = kids(root, 'via').map((v) => ({ at: [num(kid(v, 'at')[1]), num(kid(v, 'at')[2])], size: num(val(v, 'size')), drill: num(val(v, 'drill')) }));
const vias = allVias.filter((v) => v.size < 1 && inUnit(v.at));
const holes = allVias.filter((v) => v.size >= 1 && inUnit(v.at)); // the four 2.0 mm mounting holes
const padsOf = (f) =>
  kids(f.node, 'pad').map((p) => {
    const at = kid(p, 'at');
    const size = kid(p, 'size');
    return { at: toBoard([num(at[1]), num(at[2])], f.at, f.rot), w: Math.min(num(size[1]), num(size[2])), thru: p[2] === 'thru_hole' };
  });
function dots(layer) {
  const side = layer === 'F.Cu' ? 'f' : layer === 'B.Cu' ? 'b' : null;
  const byW = new Map();
  const add = (w, at) => byW.set(w, [...(byW.get(w) ?? []), at]);
  vias.forEach((v) => add(0.4, v.at));
  // ponytail: every pad is a round dot at its short dimension (QFN and passive lands lose their length)
  if (side) for (const f of footprints) for (const p of padsOf(f)) if (p.thru || f.side === side) add(Math.min(1.6, Math.round(p.w * 10) / 10), p.at);
  return [...byW]
    .map(([w, list]) => `<path d="${list.map((p) => `M${proj(p).map((v) => r(Math.round(v * 10) / 10)).join(' ')}h0`).join('')}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="${r(w * 0.8)}" stroke-opacity=".7"/>`)
    .join('');
}

// ---------------------------------------------------------------- parts: one extruded body per footprint
function body(f) {
  const pts = [];
  const take = (re) => {
    for (const g of [...kids(f.node, 'fp_line'), ...kids(f.node, 'fp_rect'), ...kids(f.node, 'fp_poly'), ...kids(f.node, 'fp_circle')]) {
      if (!re.test(val(g, 'layer') ?? '')) continue;
      for (const c of g) {
        if (!Array.isArray(c)) continue;
        if (c[0] === 'start' || c[0] === 'end') pts.push([num(c[1]), num(c[2])]);
        if (c[0] === 'pts') for (const p of kids(c, 'xy')) pts.push([num(p[1]), num(p[2])]);
      }
    }
  };
  take(/\.Fab$/);
  if (pts.length < 2) take(/\.CrtYd$/);
  assert(pts.length >= 2, `${f.ref}: no body outline`);
  const x0 = Math.min(...pts.map((p) => p[0]));
  const x1 = Math.max(...pts.map((p) => p[0]));
  const y0 = Math.min(...pts.map((p) => p[1]));
  const y1 = Math.max(...pts.map((p) => p[1]));
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map((p) => toBoard(p, f.at, f.rot));
  return { corners, w: x1 - x0, h: y1 - y0, c: toBoard([(x0 + x1) / 2, (y0 + y1) / 2], f.at, f.rot) };
}
const FACE = (pct) => `style="fill:color-mix(in srgb,currentColor ${pct}%,var(--board-hole,#000))"`;
function prism(p) {
  const zTop = p.side === 'f' ? p.height * Z : 0;
  const zBot = p.side === 'f' ? 0 : -p.height * Z;
  const cs = p.corners;
  const small = Math.max(p.w, p.h) < 2.4;
  const cx = cs.reduce((a, c) => a + c[0], 0) / 4;
  const cy = cs.reduce((a, c) => a + c[1], 0) / 4;
  let sides = '';
  if (!small && p.height > 0.2) {
    cs.forEach((a, i) => {
      const b = cs[(i + 1) % 4];
      const mx = (a[0] + b[0]) / 2 - cx;
      const my = (a[1] + b[1]) / 2 - cy;
      if (mx + my > 1e-6) sides += `M${P(a, zTop)}L${P(b, zTop)}L${P(b, zBot)}L${P(a, zBot)}Z`; // faces the viewer
    });
  }
  let out = sides ? `<path d="${sides}" ${FACE(9)}/>` : '';
  // flat land patterns (pin headers) stay see-through so their pads read
  out += `<path d="${poly(cs, zTop)}" ${p.height <= 0.2 ? 'fill="currentColor" fill-opacity=".08"' : FACE(small ? 30 : 18)}/>`;
  if (Math.min(p.w, p.h) >= 3.5 && p.height > 0.2) {
    const [tx, ty] = proj(p.c, zTop);
    const fs = Math.min(2, Math.max(p.w, p.h) / (p.ref.length * 1.1));
    out += `<text transform="matrix(.866 .5 -.866 .5 ${r(tx)} ${r(ty)})" font-size="${r(fs)}" text-anchor="middle" dy=".35em" fill="currentColor" stroke="none" font-family="ui-monospace,monospace">${p.ref}</text>`;
  }
  return out;
}

const parts = footprints
  .map((f) => {
    const b = body(f);
    const group = GROUP_OF[f.sheet];
    assert(group, `${f.ref}: unmapped schematic sheet "${f.sheet}"`);
    const height = (HEIGHTS.find(([re]) => re.test(f.footprint)) ?? [null, 0.4])[1];
    return { ...f, ...b, group, height };
  })
  .sort((a, b) => a.c[0] + a.c[1] - (b.c[0] + b.c[1])); // painter's order: far corner first

// ---------------------------------------------------------------- write
const pad = 1.2;
const maxUp = Math.max(...parts.filter((p) => p.side === 'f').map((p) => p.height * Z));
const maxDown = Math.max(...parts.filter((p) => p.side === 'b').map((p) => p.height * Z));
const allPts = parts.flatMap((p) => p.corners.map((c) => proj(c)));
const vx = Math.min(0, ...allPts.map((p) => p[0])) - pad;
const vy = Math.min(0, ...allPts.map((p) => p[1])) - maxUp - pad;
const vw = Math.max(0.866 * (W + H), ...allPts.map((p) => p[0])) + pad - vx;
const vh = Math.max(0.5 * (W + H), ...allPts.map((p) => p[1])) + maxDown + pad - vy;
const viewBox = [vx, vy, vw, vh].map((v) => Math.round(v * 100) / 100);
const wrap = (inner, colour) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}"><g id="l" style="color:var(${colour},currentColor)">${inner}</g></svg>`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
let total = 0;
const write = (name, text) => {
  writeFileSync(join(OUT, name), text);
  total += Buffer.byteLength(text);
  console.log(`${String(Buffer.byteLength(text)).padStart(7)}  ${name}`);
};
const slug = (l) => l.toLowerCase().replace('.', '-');
const EDGE = `<path d="${OUTLINE}" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1" vector-effect="non-scaling-stroke"/>`;

const layers = COPPER.map(([layer, tier]) => {
  const t = tracks(layer);
  const z = planes(layer);
  write(`${slug(layer)}.svg`, wrap(`${EDGE}${z.svg}${t.svg}${dots(layer)}`, '--board-copper'));
  return { id: slug(layer), name: layer, tier, tracks: t.count, planes: z.nets };
});
const ring = (c, rad) => `M${Array.from({ length: 16 }, (_, i) => P([c[0] + rad * Math.cos((i * Math.PI) / 8), c[1] + rad * Math.sin((i * Math.PI) / 8)])).join('L')}Z`;
write(
  'core.svg',
  wrap(
    `<path d="${OUTLINE}" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-width="1.25" vector-effect="non-scaling-stroke"/><path d="${holes.map((h) => ring(h.at, h.drill / 2)).join('')}" style="fill:var(--board-hole,#000)" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>`,
    '--board-substrate',
  ),
);
const groups = GROUPS.map((id) => {
  const mine = parts.filter((p) => p.group === id);
  const sides = ['f', 'b'].filter((side) => mine.some((p) => p.side === side));
  for (const side of sides) {
    const list = mine.filter((p) => p.side === side);
    // bottom parts hang below the board: nearer bodies still paint last
    write(`parts-${id}-${side}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}"><g id="l" stroke="currentColor" stroke-width=".16" stroke-linejoin="round">${list.map(prism).join('')}</g></svg>`);
  }
  return { id, sides, count: mine.length };
});

const round2 = (v) => Math.round(v * 100) / 100;
write(
  'components.json',
  JSON.stringify(
    parts
      .slice()
      .sort((a, b) => a.ref.localeCompare(b.ref, 'en', { numeric: true }))
      .map((p) => ({ ref: p.ref, value: p.value, footprint: p.footprint, x: round2(p.c[0] - X0), y: round2(p.c[1] - Y0), w: round2(p.w), h: round2(p.h), rot: p.rot, side: p.side === 'f' ? 'F.Cu' : 'B.Cu', group: p.group, sheet: p.sheet || '(root)' })),
  ),
);
const svgTotal = total;
const stackup = kids(kid(kid(root, 'setup'), 'stackup'), 'layer').filter((l) => val(l, 'thickness'));
const manifest = {
  source: 'zynq_sdr_dongle.kicad_pcb',
  size: { w: W, h: H },
  viewBox,
  /** Projected right corner of the board at z = 0: where the layer labels attach. */
  anchor: proj([X1, Y0]).map(round2),
  layers,
  groups,
  counts: {
    footprints: parts.length,
    vias: vias.length,
    mountingHoles: holes.length,
    mountingHoleDrill: holes[0]?.drill ?? 0,
    copperLayers: COPPER.length,
    tracks: layers.reduce((a, l) => a + l.tracks, 0),
    minTrack: Math.min(...kids(root, 'segment').map((s) => num(val(s, 'width')))),
    stackupThickness: round2(stackup.reduce((a, l) => a + num(val(l, 'thickness')), 0) * 1000) / 1000,
  },
};
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

// ---------------------------------------------------------------- self-check
assert.equal(manifest.layers.length, 6, 'six copper layers');
assert.equal(holes.length, 4, 'four mounting holes');
assert(parts.every((p) => inUnit(p.at, 1)), 'every footprint sits on the board unit');
assert(svgTotal - Buffer.byteLength(readFileSync(join(OUT, 'components.json'))) <= BUDGET, `SVG over budget: ${svgTotal} bytes`);
console.log(`board ${W} × ${H} mm · ${parts.length} footprints · ${vias.length} vias · ${total} bytes written`);
