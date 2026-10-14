/**
 * The anatomy skill's audit for the SHADES Concept X figure.
 *   node --no-warnings --import ./ts-hooks.mjs audit.mjs [--settle] [--audit]   (run from this folder; ts-hooks.mjs adds .ts resolution)
 * --settle  ray-casts every overlapping pair (both layouts, rest to apart) and writes the painter's order into
 *           geometry.ts between the <settled-order> markers.
 * --audit   runs every kit check per layout (clearance at rest, apart and in flight, supports, terminals, folds,
 *           crowding, coverage, depth order) against that order. Exits 1 on any failure.
 * ANATOMY_KIT points at the skill's kit folder (default ~/.claude/skills/anatomy/kit).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../..');
const GEO = join(root, 'app/(apple)/projects/shades-concept-x/geometry.ts');
const KIT = process.env.ANATOMY_KIT ?? join(homedir(), '.claude/skills/anatomy/kit');
const A = await import(pathToFileURL(join(KIT, 'audit.mjs')).href);
const L = await import(pathToFileURL(join(KIT, 'lathe.mjs')).href);
const geo = await import(pathToFileURL(GEO).href);

const P = geo.FIGURE_P;
const { items, routes } = geo.itemsOf(P);
const STATES = A.uniformStates(10);
const AXES = { x: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], y: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], z: [[0, 0, 1], [1, 0, 0], [0, 1, 0]] };
const frameOn = (axis) => L.frameOf([0, 0, 0], ...AXES[axis]);

function shapeOf(s, meta) {
  const cut = s.cut ? { cut: s.cut.map((c) => shapeOf(c, {})) } : {};
  if (s.k === 'extruded') return A.extruded(s.ring, s.z, s.h, { ...meta, ...cut });
  if (s.k === 'prism') return A.prism(frameOn(s.axis), s.polygon, s.s0, s.s1, { ...meta, ...cut });
  if (s.k === 'solid') return A.solid(L.frameAlong(s.o, s.a), s.profile, meta);
  if (s.k === 'disc') return A.disc(L.frameAlong(s.o, s.a), s.s0, s.s1, s.r, meta);
  if (s.k === 'tube') return A.tube(s.points, s.radii, meta);
  throw new Error(`unknown shape ${s.k}`);
}

const crossLayout = (a, b) => Boolean(a.only && b.only && a.only !== b.only);
const skip = (a, b) => A.sameRun(a, b) || crossLayout(a, b);

function recorderFor(layout) {
  const R = A.recorder(P);
  const keep = (it) => it.part !== 'eye' && (!layout || !it.only || it.only === layout);
  for (const it of items.filter(keep)) {
    const shapes = it.shapes.map((s, i) => {
      const meta = { name: it.shapes.length > 1 ? `${it.name}.${i}` : it.name, ground: Boolean(it.ground) };
      const shape = shapeOf(s, meta);
      return s.k === 'tube' ? shape : R.solid(shape);
    });
    R.put({ at: it.at, bias: it.bias, name: it.name, piece: it.part, ride: 'all', move: [0, 0, it.lift], shapes, only: it.only, route: it.route, chunk: it.chunk });
  }
  for (const r of routes.filter((r) => keep({ part: r.part }))) R.route(r.name, r.points, r.r, { gaps: r.gaps, limp: r.limp, free: r.free, piece: r.part, ride: 'all', move: [0, 0, r.lift] });
  return R;
}

const argv = process.argv.slice(2);
if (argv.includes('--settle')) {
  const R = recorderFor(null);
  const t = Date.now();
  const settled = A.settle(R, P, { states: STATES, skip });
  const names = [...R.items].sort((a, b) => a.key - b.key).map((it) => it.name);
  const eye = items.find((it) => it.part === 'eye');
  if (eye) names.unshift(eye.name);
  const src = readFileSync(GEO, 'utf8');
  const block = `const SETTLED: readonly string[] = [\n${names.map((n) => `  '${n}',`).join('\n')}\n];`;
  const next = src.replace(/const SETTLED: readonly string\[\] = \[[\s\S]*?\];/, block);
  writeFileSync(GEO, next);
  console.log(`settled ${names.length} items · ${settled.overlaps.pairs.length} overlaps · ${settled.solved.rules} rules · dropped ${settled.solved.dropped.length} · cycles ${settled.solved.cycles.length} · ${((Date.now() - t) / 1000).toFixed(1)} s`);
  const seen = new Set();
  for (const c of settled.solved.cycles) {
    const key = `${settled.items[c.a].name} <> ${settled.items[c.b].name}`;
    if (!seen.has(key)) seen.add(key), console.log('cycle', key, 'at state', c.state);
  }
  for (const d of settled.solved.dropped.slice(0, 12)) console.log('dropped', JSON.stringify(d).slice(0, 200));
}
if (argv.includes('--audit')) {
  const rank = new Map(geo.FIGURE.pieces.map((p, i) => [p.key, i]));
  let failed = 0;
  for (const layout of ['potential', 'planned']) {
    const R = recorderFor(layout);
    /* The page paints in one fixed order (the settled one), so every state is checked against that order. */
    for (const it of R.items) (it.key = (rank.get(it.name) ?? 0) * 1000), (it.move = it.move);
    const overlaps = A.overlapsOf(R.items, P, { states: STATES, skip });
    R.settled = { items: R.items, overlaps, solved: { keys: R.items.map((it) => it.key), dropped: [], cycles: [], rules: 0 }, states: STATES };
    const result = A.audit(R, P, { frames: A.uniformStates(20), apart: true, allow: [['lensL', 'rimL'], ['lensR', 'rimR']] });
    console.log(`\n== ${layout} ==`);
    console.log(A.report(result));
    const count = A.failures(result);
    console.log(count ? `audit failed: ${count} problem${count === 1 ? '' : 's'}` : 'audit passed');
    failed += count;
  }
  if (failed) process.exitCode = 1;
}
