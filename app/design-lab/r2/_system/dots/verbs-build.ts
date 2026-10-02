/**
 * Build verbs: the state of a subsystem in the build cycle.
 * Contract for every verb: t in [0, 1]; t = 1 is the deterministic REST pose.
 * Cyclic verbs (orbit, scramble, hold) also equal their rest pose at t = 0, so loops are seamless.
 */
import {
  TAU,
  clamp,
  dot,
  easeInOut,
  easeOut,
  easeOutBack,
  fibDir,
  hash,
  lerp,
  line,
  partial,
  project,
  seg,
  shade,
  shapePoint,
  shapeVerts,
  shash,
} from './math';
import type { Dot, Frame, Line, VerbContext } from './types';

const n = (base: number, c: VerbContext, min = 4): number => Math.max(min, Math.round(base * c.d));
const nSqrt = (base: number, c: VerbContext, min = 4): number => Math.max(min, Math.round(base * Math.sqrt(c.d)));

/** form — a dotted outline settles from a loose circle onto its target shape. Plan / concept. */
export function form(t: number, c: VerbContext): Frame {
  const shape = c.opts.shape ?? 'triangle';
  const count = nSqrt(30, c, 12);
  const e = easeInOut(t);
  const spin = (1 - e) * 0.9;
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const s = i / count;
    const jr = 1 + shash(i, c.seed, 1) * 0.22;
    const a0 = s * TAU - Math.PI / 2 + spin;
    const sx = Math.cos(a0) * 0.62 * jr;
    const sy = Math.sin(a0) * 0.62 * jr;
    const [tx, ty] = shapePoint(shape, s, 0.66);
    dots.push(dot(lerp(sx, tx, e), lerp(sy, ty, e), c.r * 1.15, 0.55 + 0.45 * e));
  }
  return { dots, lines: [] };
}

/** orbit — parts circle on tilted orbits and park. Prototyping / in progress. */
export function orbit(t: number, c: VerbContext): Frame {
  const rings = [
    { R: 0.78, inc: 1.15, node: 0.3, lap: 1, park: 0.2 },
    { R: 0.6, inc: 1.3, node: -0.9, lap: -1, park: 2.4 },
    { R: 0.42, inc: 0.95, node: 1.7, lap: 2, park: 4.1 },
  ];
  const ringDots = n(30, c, 14);
  const partDots = nSqrt(9, c, 5);
  const dots: Dot[] = [];
  // core
  dots.push(...coreOrb(0, 0, 0.1, nSqrt(14, c, 6), c.r, 0.9));
  for (let k = 0; k < rings.length; k++) {
    const g = rings[k];
    const place = (ang: number, rad: number, lift = 0): [number, number, number] => {
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;
      // incline about X, then rotate the node line about Y
      const y1 = -z * Math.sin(g.inc) + lift;
      const z1 = z * Math.cos(g.inc);
      return project(x, y1, z1, g.node, 0.25);
    };
    const m = Math.round(ringDots * (g.R / 0.78));
    for (let i = 0; i < m; i++) {
      const [x, y, z] = place((i / m) * TAU, g.R);
      dots.push(dot(x, y, c.r * 0.8, shade(z, 0.32), 'dot', z));
    }
    const ang = g.park + TAU * g.lap * t;
    for (let j = 0; j < partDots; j++) {
      const [dx, dy, dz] = fibDir(j, partDots);
      const [x, y, z] = place(ang, g.R);
      dots.push(dot(x + dx * 0.055, y + dy * 0.055, c.r * (1.1 + 0.3 * dz), shade(z + dz * 0.1, 1), 'dot', z + dz * 0.05));
    }
  }
  return { dots, lines: [] };
}

/** scramble → solve — lattice bands turn out of place, then click back into rows. Testing / verification. */
export function scramble(t: number, c: VerbContext): Frame {
  const rows = nSqrt(11, c, 7);
  const cols = nSqrt(22, c, 12);
  // out over [0, .35], hold to .55, click back with a small overshoot by .9
  const out = easeInOut(seg(t, 0, 0.35));
  const back = easeOutBack(seg(t, 0.55, 0.9));
  const amt = out * (1 - back);
  const dots: Dot[] = [];
  for (let b = 0; b < rows; b++) {
    const lat = ((b + 0.5) / rows) * Math.PI - Math.PI / 2;
    const q = Math.round(shash(b, c.seed, 3) * 2) || (b % 2 ? 1 : -1);
    const off = q * (Math.PI / 2) * amt;
    const lift = shash(b, c.seed, 4) * 0.08 * amt;
    for (let k = 0; k < cols; k++) {
      const lon = (k / cols) * TAU + off;
      const x = Math.cos(lat) * Math.cos(lon) * 0.78;
      const y = Math.sin(lat) * 0.78 + lift;
      const z = Math.cos(lat) * Math.sin(lon) * 0.78;
      const [px, py, pz] = project(x, y, z, 0.5, 0.42);
      dots.push(dot(px, py, c.r * (0.8 + 0.3 * (pz + 1) * 0.5), shade(pz, 0.55 + 0.45 * (1 - amt)), 'dot', pz));
    }
  }
  return { dots, lines: [] };
}

/** wire — separate nodes move home and connect into one graph. Integration. */
export function wire(t: number, c: VerbContext): Frame {
  const count = c.size < 96 ? 5 : 7;
  const home = Array.from({ length: count }, (_, i) => shapePoint('circle', i / count, 0.7));
  const settle = easeOut(seg(t, 0, 0.4));
  const nodes = home.map(([x, y], i) => [
    lerp(x + shash(i, c.seed, 5) * 0.35, x, settle),
    lerp(y + shash(i, c.seed, 6) * 0.35, y, settle),
  ]);
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) edges.push([i, (i + 1) % count]);
  for (let i = 0; i < count; i += 2) edges.push([i, (i + 3) % count]);
  const lines: Line[] = [];
  const draw = seg(t, 0.3, 1) * edges.length;
  edges.forEach(([a, b], k) => {
    const f = clamp(draw - k);
    if (f > 0) lines.push(partial(nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], f, k < count ? 0.7 : 0.35));
  });
  const dots: Dot[] = nodes.map(([x, y]) => dot(x, y, c.r * 1.8, 0.6 + 0.4 * settle));
  // lattice dots along each finished edge (2-unit pitch feel)
  const pitch = nSqrt(5, c, 3);
  edges.slice(0, count).forEach(([a, b], k) => {
    if (draw - k < 1) return;
    for (let j = 1; j < pitch; j++) {
      const f = j / pitch;
      dots.push(dot(lerp(nodes[a][0], nodes[b][0], f), lerp(nodes[a][1], nodes[b][1], f), c.r * 0.7, 0.4));
    }
  });
  return { dots, lines };
}

/** explode — iso layers separate along one axis. Teardown / scope reveal. */
export function explode(t: number, c: VerbContext): Frame {
  const L = Math.max(2, Math.min(9, c.opts.layers ?? 5));
  const e = easeInOut(t);
  const gap = lerp(0.07, 1.5 / (L - 1), e);
  const per = nSqrt(28, c, 12);
  // Flatter, narrower slabs for tall stacks so open gaps stay readable.
  const k = L <= 5 ? 1 : 5 / L;
  const w = 0.62 * (0.8 + 0.2 * k);
  const h = 0.3 * k;
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const top = -((L - 1) / 2) * gap;
  for (let l = 0; l < L; l++) {
    const cy = top + l * gap;
    const corners: Array<[number, number]> = [
      [0, cy - h],
      [w, cy],
      [0, cy + h],
      [-w, cy],
    ];
    const z = 1 - (l / (L - 1)) * 2; // top layer nearest
    const a = 0.45 + 0.55 * ((z + 1) / 2);
    for (let i = 0; i < per; i++) {
      const s = (i / per) * 4;
      const k = Math.floor(s);
      const f = s - k;
      const p0 = corners[k];
      const p1 = corners[(k + 1) % 4];
      dots.push(dot(lerp(p0[0], p1[0], f), lerp(p0[1], p1[1], f), c.r, a, 'dot', z));
    }
    dots.push(dot(0, cy, c.r * 1.5, a, 'dot', z));
  }
  // axis of explosion, dashed
  lines.push(line(0, top - 0.12, 0, top + (L - 1) * gap + 0.12, 0.3 * e + 0.1, 'dashed'));
  return { dots, lines };
}

/** pulse — one packet runs a leader from A to B. Handoff / review path. */
export function pulse(t: number, c: VerbContext): Frame {
  const path: Array<[number, number]> = [
    [-0.72, 0.42],
    [-0.08, 0.42],
    [0.08, -0.42],
    [0.72, -0.42],
  ];
  const lens = [0.64, Math.hypot(0.16, 0.84), 0.64];
  const total = lens.reduce((s, v) => s + v, 0);
  const at = (u: number): [number, number] => {
    let d = clamp(u) * total;
    for (let k = 0; k < 3; k++) {
      if (d <= lens[k] || k === 2) {
        const f = clamp(d / lens[k]);
        return [lerp(path[k][0], path[k + 1][0], f), lerp(path[k][1], path[k + 1][1], f)];
      }
      d -= lens[k];
    }
    return path[3];
  };
  const e = easeInOut(t);
  const done = seg(t, 0.92, 1);
  const lines: Line[] = [];
  for (let k = 0; k < 3; k++) {
    lines.push(line(path[k][0], path[k][1], path[k + 1][0], path[k + 1][1], 0.3 + 0.4 * done, done > 0.5 ? 'solid' : 'dotted'));
  }
  const dots: Dot[] = [];
  const pitch = nSqrt(18, c, 10);
  for (let i = 0; i <= pitch; i++) {
    const u = i / pitch;
    const near = Math.max(0, 1 - Math.abs(u - e) * 6);
    const [x, y] = at(u);
    dots.push(dot(x, y, c.r * (0.7 + 0.4 * near), 0.25 + 0.6 * near));
  }
  dots.push(dot(path[0][0], path[0][1], c.r * 2, 0.9));
  const [bx, by] = path[3];
  if (c.opts.anchor) dots.push(dot(bx, by, c.r * 2.4, 1, 'anchor'));
  else dots.push(dot(bx, by, c.r * 2, 0.5 + 0.5 * done));
  for (let k = 0; k < 3; k++) {
    const [x, y] = at(e - k * 0.035);
    dots.push(dot(x, y, c.r * (1.7 - k * 0.35), 1 - k * 0.3));
  }
  return { dots, lines };
}

/** fixate — scattered dots converge to one point inside a reticle. Focus / reading (RSVP). */
export function fixate(t: number, c: VerbContext): Frame {
  const count = n(40, c, 14);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  for (let i = 0; i < count; i++) {
    const ang = hash(i, c.seed, 7) * TAU;
    const rad = 0.3 + hash(i, c.seed, 8) * 0.58;
    const delay = hash(i, c.seed, 9) * 0.35;
    const f = easeInOut(seg(t, delay, delay + 0.6));
    const a = (1 - f) * 0.85;
    if (a > 0.02) dots.push(dot(Math.cos(ang) * rad * (1 - f), Math.sin(ang) * rad * (1 - f), c.r, a));
  }
  const ret = easeOut(seg(t, 0.55, 1));
  const R = 0.26;
  const tick = 0.12;
  lines.push(line(0, -R - tick, 0, -R, ret * 0.8), line(0, R, 0, R + tick, ret * 0.8));
  lines.push(line(-R - tick, 0, -R, 0, ret * 0.8), line(R, 0, R + tick, 0, ret * 0.8));
  const ringN = nSqrt(16, c, 10);
  for (let i = 0; i < ringN; i++) {
    const a = (i / ringN) * TAU;
    dots.push(dot(Math.cos(a) * (R + 0.1), Math.sin(a) * (R + 0.1), c.r * 0.6, 0.35 * ret));
  }
  const point = seg(t, 0.6, 1);
  dots.push(dot(0, 0, c.r * (1.4 + 1.2 * point), 0.4 + 0.6 * point, c.opts.anchor && point >= 1 ? 'anchor' : 'dot'));
  return { dots, lines };
}

/** seat — a ring of seats; one slot opens (dashed). Recruiting / open role. */
export function seat(t: number, c: VerbContext): Frame {
  const count = 8;
  const R = 0.62;
  const e = easeInOut(t);
  const turn = (1 - e) * (TAU / count);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const pts = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU - Math.PI / 2 + turn;
    return [Math.cos(a) * R, Math.sin(a) * R] as [number, number];
  });
  for (let i = 0; i < count; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % count];
    lines.push(line(x0, y0, x1, y1, 0.22, 'dotted'));
  }
  pts.forEach(([x, y], i) => {
    if (i === 0) {
      dots.push(dot(x, y, c.r * 2.2, 0.9 * (1 - e)));
      // Open slot: a dashed ring. With `anchor`, the red trigger fills the slot at seat size, ring around it.
      dots.push(dot(x, y, c.r * (c.opts.anchor ? 3.4 : 2.6), 0.85 * e, 'hollow'));
      if (c.opts.anchor && e > 0.5) dots.push(dot(x, y, c.r * 2.2, (e - 0.5) * 2, 'anchor'));
    } else {
      dots.push(dot(x, y, c.r * 2.2, 0.9));
    }
  });
  dots.push(dot(0, 0, c.r * 1.2, 0.4));
  return { dots, lines };
}

/** hold — dots drift in place and make no progress. Blocked / needs owner. Rest = 40% ink. */
export function hold(t: number, c: VerbContext): Frame {
  const slots = latticeDisc(nSqrt(9, c, 6), 0.7);
  const dots: Dot[] = slots.map(([x, y], i) => {
    const k = 1 + Math.floor(hash(i, c.seed, 10) * 2);
    const ang = hash(i, c.seed, 11) * TAU;
    const amp = 0.045 * Math.sin(TAU * k * t);
    return dot(x + Math.cos(ang) * amp, y + Math.sin(ang) * amp, c.r, 0.4);
  });
  return { dots, lines: [] };
}

/** settle — motion stops and the outline goes solid. Done / shipped. */
export function settle(t: number, c: VerbContext): Frame {
  const shape = c.opts.shape ?? 'square';
  const count = nSqrt(28, c, 12);
  const calm = easeOut(t);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const [x, y] = shapePoint(shape, i / count, 0.64);
    const k = 1 + Math.floor(hash(i, c.seed, 12) * 3);
    const amp = 0.09 * (1 - calm) * Math.sin(TAU * k * t + hash(i, c.seed, 13) * TAU);
    const amp2 = 0.09 * (1 - calm) * Math.cos(TAU * k * t);
    dots.push(dot(x + amp, y + amp2, c.r, 0.6 + 0.4 * calm));
  }
  const solid = seg(t, 0.6, 1);
  const verts = shapeVerts(shape, 0.64);
  const lines: Line[] = verts.map(([x0, y0], i) => {
    const [x1, y1] = verts[(i + 1) % verts.length];
    return partial(x0, y0, x1, y1, solid, 0.85);
  });
  verts.forEach(([x, y]) => dots.push(dot(x, y, c.r * 1.8 * (0.5 + 0.5 * solid), solid)));
  dots.push(dot(0, 0, c.r * 2, solid * 0.9));
  return { dots, lines };
}

/* helpers shared with agentic verbs */

export function latticeDisc(g: number, R: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const step = (2 * R) / (g - 1);
  for (let row = 0; row < g; row++) {
    for (let col = 0; col < g; col++) {
      const x = -R + col * step;
      const y = -R + row * step;
      if (x * x + y * y <= R * R * 1.04) out.push([x, y]);
    }
  }
  return out;
}

export function coreOrb(cx: number, cy: number, rad: number, count: number, r: number, a: number): Dot[] {
  const out: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const [x, y, z] = fibDir(i, count);
    const [px, py, pz] = project(x, y, z, 0.6, 0.35);
    out.push(dot(cx + px * rad, cy + py * rad, r * (0.8 + 0.25 * (pz + 1)), shade(pz, a), 'dot', pz));
  }
  return out;
}
