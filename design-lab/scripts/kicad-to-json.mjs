// Usage: node design-lab/scripts/kicad-to-json.mjs
// Converts the club's KiCad 9 boards (read-only lab copies) into small, privacy-stripped web geometry for
// app/design-lab/r2/_system/boards/. Whitelist extraction: only geometry, layer, pad and reference-designator
// data is copied. Title block, comments, net names, values, descriptions, library ids, paths, UUIDs and
// all text bodies are never read into the output. A final audit rejects any string outside the whitelist.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseSexpr, kids, kid, val, pt, num, isNode } from './kicad-sexpr.mjs';
import {
  toBoard, sampleArc, arcPath, linePath, polyPath, circlePath, chainLoops, simplifyRing, dedupe, r2,
} from './kicad-geom.mjs';

const SRC = 'design-lab/round2/assets/kb/source';
const OUT = 'app/design-lab/r2/_system/boards';

/** Site-facing metadata is authored here, never read from the files. */
const BOARDS = [
  {
    id: 'zynq-carrier-power',
    file: 'zynq-carrier-power/Zynq-Carrier-Power.kicad_pcb',
    title: 'Power carrier',
    status: 'partly-routed',
    statusLabel: 'Layout in progress (partly routed)',
  },
  {
    id: 'fingerprint',
    file: 'fingerprint/Fingerprint_Sensor.kicad_pcb',
    title: 'Fingerprint module',
    status: 'routed',
    statusLabel: 'Layout routed (not yet merged)',
  },
];

const REF_OK = /^[A-Z]{1,4}\d{1,4}$/;
const COPPER = { 'F.Cu': 'F', 'B.Cu': 'B' };
const SILK = { 'F.SilkS': 'F', 'B.SilkS': 'B' };
const ZONE_SIMPLIFY_MM = 0.03;

// ---------- board ----------

function edgePrims(root) {
  const prims = [];
  const loops = [];
  for (const g of root.filter(isNode)) {
    if (val(g, 'layer') !== 'Edge.Cuts') continue;
    const t = g[0];
    if (t === 'gr_line') prims.push({ kind: 'line', s: pt(g, 'start'), e: pt(g, 'end') });
    else if (t === 'gr_arc') prims.push({ kind: 'arc', s: pt(g, 'start'), m: pt(g, 'mid'), e: pt(g, 'end') });
    else if (t === 'gr_rect') {
      const [a, b] = [pt(g, 'start'), pt(g, 'end')];
      loops.push({ pts: [a, [b[0], a[1]], b, [a[0], b[1]]] });
    } else if (t === 'gr_poly') loops.push({ pts: kids(kid(g, 'pts'), 'xy').map((p) => pt(p)) });
    else if (t === 'gr_circle') {
      const c = pt(g, 'center');
      const e = pt(g, 'end');
      loops.push({ circle: { c, r: Math.hypot(e[0] - c[0], e[1] - c[1]) } });
    }
  }
  return { prims, loops };
}

function bboxOf(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function convertBoard(cfg) {
  const root = parseSexpr(readFileSync(join(SRC, cfg.file), 'utf8'));
  const thickness = num(kid(kid(root, 'general'), 'thickness')?.[1] ?? '1.6');

  // Edge.Cuts → origin + outline
  const { prims, loops } = edgePrims(root);
  const edgePts = [
    ...prims.flatMap((p) => (p.kind === 'arc' ? sampleArc(p.s, p.m, p.e) : [p.s, p.e])),
    ...loops.flatMap((l) => (l.pts ? l.pts : [[l.circle.c[0] - l.circle.r, l.circle.c[1] - l.circle.r], [l.circle.c[0] + l.circle.r, l.circle.c[1] + l.circle.r]])),
  ];
  if (!edgePts.length) throw new Error(`${cfg.id}: no Edge.Cuts outline`);
  const bb = bboxOf(edgePts);
  const O = [bb.x0, bb.y0];
  const mv = (p) => [p[0] - O[0], p[1] - O[1]];

  const loopDs = [
    ...chainLoops(prims.map((p) => ({ ...p, s: mv(p.s), e: mv(p.e), m: p.m && mv(p.m) }))).map((l) => ({ d: l.d, closed: l.closed })),
    ...loops.map((l) => ({ d: l.pts ? polyPath(l.pts.map(mv)) : circlePath(mv(l.circle.c), l.circle.r), closed: true })),
  ];
  // The longest path string is the outer outline; the rest are cutouts.
  loopDs.sort((a, b) => b.d.length - a.d.length);
  const [outline, ...cutouts] = loopDs;

  // Tracks
  const tracks = [];
  for (const t of root.filter(isNode)) {
    if (t[0] !== 'segment' && t[0] !== 'arc') continue;
    const l = COPPER[val(t, 'layer')];
    if (!l) continue;
    const w = r2(num(val(t, 'width')));
    const d = t[0] === 'segment'
      ? linePath(mv(pt(t, 'start')), mv(pt(t, 'end')))
      : arcPath(mv(pt(t, 'start')), mv(pt(t, 'mid')), mv(pt(t, 'end')));
    tracks.push({ l, w, d });
  }

  // Vias [x, y, size, drill]
  const vias = kids(root, 'via').map((v) => {
    const p = mv(pt(v, 'at'));
    return [r2(p[0]), r2(p[1]), r2(num(val(v, 'size'))), r2(num(val(v, 'drill')))];
  });

  // Footprints + pads + footprint silk
  const silk = { F: [], B: [] };
  const silkParked = { F: [], B: [] };
  const inBoard = (x, y) => x >= 0 && y >= 0 && x <= bb.x1 - bb.x0 && y <= bb.y1 - bb.y0;
  const footprints = kids(root, 'footprint').map((fp) => convertFootprint(fp, mv, silk, silkParked, inBoard));

  // Board-level silk graphics (never text)
  for (const g of root.filter(isNode)) {
    const side = SILK[val(g, 'layer')];
    if (side && g[0].startsWith('gr_')) {
      const d = graphicPath(g, (p) => mv(p));
      if (d) silk[side].push(d);
    }
  }

  // Zones
  const zones = [];
  let zonePtsIn = 0;
  let zonePtsOut = 0;
  for (const z of kids(root, 'zone')) {
    if (kid(z, 'keepout')) continue;
    const teardrop = Boolean(kid(z, 'attr') && kid(kid(z, 'attr'), 'teardrop'));
    const fills = kids(z, 'filled_polygon');
    const ring = (ptsNode) => {
      const raw = kids(ptsNode, 'xy').map((p) => mv(pt(p)));
      zonePtsIn += raw.length;
      const simp = dedupe(simplifyRing(raw, ZONE_SIMPLIFY_MM));
      zonePtsOut += simp.length;
      return polyPath(simp);
    };
    if (fills.length) {
      for (const f of fills) {
        const l = COPPER[val(f, 'layer')];
        if (l) zones.push({ l, filled: true, ...(teardrop ? { teardrop } : {}), d: ring(kid(f, 'pts')) });
      }
    } else {
      const layers = kid(z, 'layers') ? kid(z, 'layers').slice(1) : [val(z, 'layer')];
      const poly = kid(z, 'polygon');
      for (const ln of layers) {
        const l = COPPER[ln];
        if (l && poly) zones.push({ l, filled: false, ...(teardrop ? { teardrop } : {}), d: ring(kid(poly, 'pts')) });
      }
    }
  }

  const pads = footprints.reduce((n, f) => n + f.pads.length, 0);
  return {
    id: cfg.id,
    title: cfg.title,
    status: cfg.status,
    statusLabel: cfg.statusLabel,
    source: 'KiCad 9 board file (club knowledge base)',
    units: 'mm',
    size: { w: r2(bb.x1 - bb.x0), h: r2(bb.y1 - bb.y0) },
    thickness: r2(thickness),
    copperLayers: 2,
    counts: {
      tracks: tracks.length,
      vias: vias.length,
      footprints: footprints.length,
      pads,
      zones: zones.length,
      teardropZones: zones.filter((z) => z.teardrop).length,
      parked: footprints.filter((f) => f.parked).length,
    },
    outline: outline.d,
    cutouts: cutouts.map((c) => c.d),
    zones,
    tracks,
    vias,
    footprints,
    silk: { F: silk.F.join(''), B: silk.B.join('') },
    silkParked: { F: silkParked.F.join(''), B: silkParked.B.join('') },
    _zonePts: { in: zonePtsIn, out: zonePtsOut },
  };
}

function graphicPath(g, tf) {
  const t = g[0].replace(/^(gr|fp)_/, '');
  if (t === 'line') return linePath(tf(pt(g, 'start')), tf(pt(g, 'end')));
  if (t === 'arc') return arcPath(tf(pt(g, 'start')), tf(pt(g, 'mid')), tf(pt(g, 'end')));
  if (t === 'circle') {
    const c = pt(g, 'center');
    const e = pt(g, 'end');
    return circlePath(tf(c), Math.hypot(e[0] - c[0], e[1] - c[1]));
  }
  if (t === 'rect') {
    const [a, b] = [pt(g, 'start'), pt(g, 'end')];
    return polyPath([a, [b[0], a[1]], b, [a[0], b[1]]].map(tf));
  }
  if (t === 'poly') return polyPath(kids(kid(g, 'pts'), 'xy').map((p) => tf(pt(p))));
  return ''; // text, curves, images: never exported
}

function localPoints(g) {
  const t = g[0].replace(/^fp_/, '');
  if (t === 'line' || t === 'rect') return [pt(g, 'start'), pt(g, 'end')];
  if (t === 'arc') return sampleArc(pt(g, 'start'), pt(g, 'mid'), pt(g, 'end'), 8);
  if (t === 'circle') {
    const c = pt(g, 'center');
    const e = pt(g, 'end');
    const r = Math.hypot(e[0] - c[0], e[1] - c[1]);
    return [[c[0] - r, c[1] - r], [c[0] + r, c[1] + r]];
  }
  if (t === 'poly') return kids(kid(g, 'pts'), 'xy').map((p) => pt(p));
  return [];
}

function convertFootprint(fp, mv, silk, silkParked, inBoard) {
  const atNode = kid(fp, 'at');
  const at = [num(atNode[1]), num(atNode[2])];
  const rot = atNode[3] ? num(atNode[3]) : 0;
  const side = val(fp, 'layer') === 'B.Cu' ? 'B' : 'F';
  const refProp = kids(fp, 'property').find((p) => p[1] === 'Reference');
  const ref = refProp && REF_OK.test(refProp[2]) ? refProp[2] : null;
  const tf = (local) => mv(toBoard(local, at, rot));
  const attr = kid(fp, 'attr');
  const mount = attr && attr.includes('through_hole') ? 'th' : 'smd';

  // Body: courtyard bbox (fallback fab, then pads) as a rotated quad in board coords.
  const graphics = fp.filter((x) => isNode(x) && /^fp_(line|arc|circle|rect|poly)$/.test(x[0]));
  const onLayer = (re) => graphics.filter((g) => re.test(val(g, 'layer') ?? '')).flatMap(localPoints);
  let localBody = onLayer(/CrtYd$/);
  if (!localBody.length) localBody = onLayer(/Fab$/);

  const ownSilk = [];
  for (const g of graphics) {
    const s = SILK[val(g, 'layer')];
    if (s) ownSilk.push([s, graphicPath(g, tf)]);
  }

  const pads = [];
  const padLocal = [];
  for (const p of kids(fp, 'pad')) {
    const [, , type, shape] = p;
    const layers = kid(p, 'layers')?.slice(1) ?? [];
    const f = layers.some((l) => l === 'F.Cu' || l === '*.Cu');
    const b = layers.some((l) => l === 'B.Cu' || l === '*.Cu');
    const pAt = kid(p, 'at');
    const local = [num(pAt[1]), num(pAt[2])];
    const angle = pAt[3] ? num(pAt[3]) : 0; // KiCad ≥6: absolute pad orientation
    const size = kid(p, 'size');
    const w = num(size[1]);
    const h = num(size[2]);
    padLocal.push([local[0] - w / 2, local[1] - h / 2], [local[0] + w / 2, local[1] + h / 2]);
    const drillNode = kid(p, 'drill');
    const drill = drillNode ? num(drillNode.find((x, i) => i > 0 && !isNode(x) && x !== 'oval')) : 0;
    const l = type === 'np_thru_hole' ? 'H' : f && b ? 'FB' : f ? 'F' : b ? 'B' : null;
    if (!l) continue; // mask/paste-only apertures carry no copper
    const g = toBoard(local, at, rot);
    const pos = mv(g);
    const pad = { x: r2(pos[0]), y: r2(pos[1]), w: r2(w), h: r2(h), a: r2(angle), s: shape, l };
    if (drill) pad.d = r2(drill);
    const rr = val(p, 'roundrect_rratio');
    if (shape === 'roundrect' && rr) pad.rr = r2(num(rr));
    pads.push(pad);
  }
  if (!localBody.length) localBody = padLocal;
  let body = null;
  if (localBody.length) {
    const b = bboxOf(localBody);
    body = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]].map((q) => tf(q).map(r2));
  }
  const pos = mv(at);
  // Parked = every pad sits outside the board outline: the part has not been placed on the board yet.
  const parked = pads.length > 0 && pads.every((p) => !inBoard(p.x, p.y));
  for (const [sd, d] of ownSilk) (parked ? silkParked : silk)[sd].push(d);
  return { ref, side, mount, parked, x: r2(pos[0]), y: r2(pos[1]), rot: r2(rot), body, pads };
}

// ---------- schematic summary ----------

function summarizeSchematic(file) {
  const root = parseSexpr(readFileSync(join(SRC, file), 'utf8'));
  const placed = kids(root, 'symbol').filter((s) => kid(s, 'lib_id'));
  const refOf = (s) => kids(s, 'property').find((p) => p[1] === 'Reference')?.[2] ?? '';
  const power = placed.filter((s) => String(val(s, 'lib_id')).startsWith('power:') || refOf(s).startsWith('#'));
  const parts = placed.filter((s) => !power.includes(s));
  const netNames = new Set([
    ...['label', 'global_label', 'hierarchical_label'].flatMap((t) => kids(root, t).map((l) => l[1])),
    ...power.map((s) => kids(s, 'property').find((p) => p[1] === 'Value')?.[2]).filter(Boolean),
  ]);
  const subSheets = kids(root, 'sheet').map((s) => kids(s, 'property').find((p) => p[1] === 'Sheetname')?.[2]);
  return {
    id: 'thermometer',
    title: 'Sensor module',
    status: 'schematic-in-rework',
    statusLabel: 'Schematic in rework (no board layout yet)',
    source: 'KiCad 9 schematic file (club knowledge base)',
    paper: val(root, 'paper') ?? null,
    sheets: 1 + subSheets.length,
    sheetNames: ['Root', ...subSheets.map((n) => (n && /^[A-Za-z0-9 _-]{1,32}$/.test(n) ? n : 'Sheet'))],
    components: parts.length,
    refs: parts.map(refOf).filter((r) => REF_OK.test(r)).sort(),
    powerSymbols: power.length,
    namedNets: netNames.size,
    wires: kids(root, 'wire').length,
    junctions: kids(root, 'junction').length,
    note: 'Named nets = unique label and power-symbol names; a full netlist needs KiCad connectivity.',
  };
}

// ---------- privacy audit ----------

const ALLOWED_STRINGS = new Set([
  ...BOARDS.flatMap((b) => [b.id, b.title, b.status, b.statusLabel]),
  'thermometer', 'Sensor module', 'schematic-in-rework', 'Schematic in rework (no board layout yet)',
  'KiCad 9 board file (club knowledge base)', 'KiCad 9 schematic file (club knowledge base)', 'mm', 'A4', 'A3', 'Root',
  'F', 'B', 'FB', 'H', 'th', 'smd', 'rect', 'roundrect', 'circle', 'oval', 'trapezoid', 'custom',
  'Named nets = unique label and power-symbol names; a full netlist needs KiCad connectivity.',
]);
const PATH_RE = /^[MLAZ0-9 .-]*$/;

function audit(obj, where = '$') {
  if (typeof obj === 'string') {
    if (ALLOWED_STRINGS.has(obj) || PATH_RE.test(obj) || REF_OK.test(obj)) return;
    throw new Error(`privacy audit: unexpected string at ${where}: ${JSON.stringify(obj.slice(0, 40))}`);
  }
  if (Array.isArray(obj)) obj.forEach((v, i) => audit(v, `${where}[${i}]`));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) audit(v, `${where}.${k}`);
}

// ---------- main ----------

mkdirSync(OUT, { recursive: true });
for (const cfg of BOARDS) {
  const { _zonePts, ...board } = convertBoard(cfg);
  audit(board);
  const file = join(OUT, `${cfg.id}.json`);
  writeFileSync(file, JSON.stringify(board));
  const kb = (statSync(file).size / 1024).toFixed(1);
  console.log(`${cfg.id}: ${board.size.w} x ${board.size.h} mm | tracks ${board.counts.tracks} | vias ${board.counts.vias} | footprints ${board.counts.footprints} | pads ${board.counts.pads} | zones ${board.counts.zones} (${board.counts.teardropZones} teardrop) | zone pts ${_zonePts.in}→${_zonePts.out} | cutouts ${board.cutouts.length} | ${kb} KB`);
}
const sch = summarizeSchematic('thermometer/thermometer.kicad_sch');
audit(sch);
const schFile = join(OUT, 'thermometer-schematic-summary.json');
writeFileSync(schFile, `${JSON.stringify(sch, null, 2)}\n`);
console.log(`thermometer: ${sch.components} components, ${sch.namedNets} named nets, ${sch.sheets} sheet | ${(statSync(schFile).size / 1024).toFixed(1)} KB`);
