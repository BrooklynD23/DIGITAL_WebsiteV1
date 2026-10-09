// Geometry helpers for kicad-to-json: rounding, KiCad rotation, arc → SVG, loop chaining, simplification.

export const r2 = (v) => Math.round(v * 100) / 100;
export const fmt = (v) => {
  const s = r2(v).toFixed(2);
  return s.replace(/\.?0+$/, '').replace(/^-0$/, '0') || '0';
};
const P = (p) => `${fmt(p[0])} ${fmt(p[1])}`;

/** KiCad angles are degrees CCW on a Y-down canvas. Rotate local point and translate. */
export function toBoard(local, at, rotDeg) {
  const t = (rotDeg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [at[0] + local[0] * c + local[1] * s, at[1] - local[0] * s + local[1] * c];
}

/** Circle through three points → { c, r } (null when collinear). */
export function circle3(a, b, c) {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  if (Math.abs(d) < 1e-12) return null;
  const a2 = a[0] ** 2 + a[1] ** 2;
  const b2 = b[0] ** 2 + b[1] ** 2;
  const c2 = c[0] ** 2 + c[1] ** 2;
  const ux = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d;
  const uy = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d;
  return { c: [ux, uy], r: Math.hypot(a[0] - ux, a[1] - uy) };
}

/** SVG "A" command for a KiCad start/mid/end arc (start point is assumed current). */
export function arcCmd(s, m, e) {
  const circ = circle3(s, m, e);
  if (!circ) return `L${P(e)}`;
  const cross = (m[0] - s[0]) * (e[1] - m[1]) - (m[1] - s[1]) * (e[0] - m[0]);
  const sweep = cross > 0 ? 1 : 0;
  const ang = (p) => Math.atan2(p[1] - circ.c[1], p[0] - circ.c[0]);
  const tau = Math.PI * 2;
  const span = sweep ? (((ang(e) - ang(s)) % tau) + tau) % tau : (((ang(s) - ang(e)) % tau) + tau) % tau;
  const large = span > Math.PI ? 1 : 0;
  return `A${fmt(circ.r)} ${fmt(circ.r)} 0 ${large} ${sweep} ${P(e)}`;
}

/** Arc sampled to points (for bounding boxes). */
export function sampleArc(s, m, e, steps = 16) {
  const circ = circle3(s, m, e);
  if (!circ) return [s, e];
  const ang = (p) => Math.atan2(p[1] - circ.c[1], p[0] - circ.c[0]);
  const a0 = ang(s);
  let a1 = ang(m);
  let a2 = ang(e);
  // unwrap so a0 → a1 → a2 is monotonic
  const tau = Math.PI * 2;
  const cross = (m[0] - s[0]) * (e[1] - m[1]) - (m[1] - s[1]) * (e[0] - m[0]);
  if (cross > 0) {
    while (a1 < a0) a1 += tau;
    while (a2 < a1) a2 += tau;
  } else {
    while (a1 > a0) a1 -= tau;
    while (a2 > a1) a2 -= tau;
  }
  const out = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = a0 + ((a2 - a0) * i) / steps;
    out.push([circ.c[0] + circ.r * Math.cos(a), circ.c[1] + circ.r * Math.sin(a)]);
  }
  return out;
}

export const linePath = (a, b) => `M${P(a)}L${P(b)}`;
export const arcPath = (s, m, e) => `M${P(s)}${arcCmd(s, m, e)}`;
export const polyPath = (pts, close = true) =>
  pts.length ? `M${P(pts[0])}${pts.slice(1).map((p) => `L${P(p)}`).join('')}${close ? 'Z' : ''}` : '';
export const circlePath = (c, r) =>
  `M${P([c[0] - r, c[1]])}A${fmt(r)} ${fmt(r)} 0 1 1 ${P([c[0] + r, c[1]])}A${fmt(r)} ${fmt(r)} 0 1 1 ${P([c[0] - r, c[1]])}Z`;

/** Chain open edge primitives ({kind:'line'|'arc', s, e, m?}) into closed loops of SVG path data. */
export function chainLoops(prims, tol = 0.01) {
  const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol;
  const left = [...prims];
  const loops = [];
  while (left.length) {
    const first = left.shift();
    const start = first.s;
    let cur = first.e;
    let d = `M${P(first.s)}${first.kind === 'arc' ? arcCmd(first.s, first.m, first.e) : `L${P(first.e)}`}`;
    let closed = near(cur, start);
    while (!closed) {
      const idx = left.findIndex((p) => near(p.s, cur) || near(p.e, cur));
      if (idx < 0) break;
      const [p] = left.splice(idx, 1);
      const fwd = near(p.s, cur);
      const s = fwd ? p.s : p.e;
      const e = fwd ? p.e : p.s;
      d += p.kind === 'arc' ? arcCmd(s, p.m, e) : `L${P(e)}`;
      cur = e;
      closed = near(cur, start);
    }
    loops.push({ d: `${d}${closed ? 'Z' : ''}`, closed });
  }
  return loops;
}

/** Douglas–Peucker on a closed ring (keeps shape within tol mm). */
export function simplifyRing(pts, tol) {
  if (pts.length < 8 || tol <= 0) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0;
    let at = -1;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const len = Math.hypot(bx - ax, by - ay) || 1e-9;
    for (let i = a + 1; i < b; i += 1) {
      const dd = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
      if (dd > max) {
        max = dd;
        at = i;
      }
    }
    if (max > tol && at > 0) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Drop consecutive duplicates after rounding to 0.01 mm. */
export function dedupe(pts) {
  const out = [];
  for (const p of pts) {
    const q = [r2(p[0]), r2(p[1])];
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  return out;
}
