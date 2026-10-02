/**
 * BRAIN scene kit: small pure helpers on top of the shared dot engine math.
 * Scenes compose several agentic verbs in one frame (orb + ring + ports + lattice), which the
 * single-verb `frame()` cannot express, so they emit the same Frame type and paint with the same painter.
 * Coordinates are normalised [-1, 1]; radii are CSS px for the rendered size.
 */
import { baseRadius, MAX_DOTS, type Dot, type Frame, type Line, type LineForm } from '../_system';
import { TAU, clamp, dot, fibDir, lerp, line, project, shade } from '../_system/dots/math';

export { TAU, clamp, dot, lerp, line };
export { seg, easeIn, easeOut, easeInOut, easeOutBack, partial, hash } from '../_system/dots/math';

export interface Ctx {
  readonly size: number;
  /** Base dot radius (px) at this size. */
  readonly r: number;
  /** Count scale: 1 at 480px, smaller stages draw fewer dots. */
  readonly k: number;
}

export const ctxOf = (size: number): Ctx => ({ size, r: baseRadius(size), k: clamp(size / 480, 0.55, 1.25) });

export const count = (base: number, c: Ctx, min = 6): number => Math.max(min, Math.round(base * c.k));

/** Fibonacci orb, yawed. Depth-shaded and z-tagged for sorting. */
export function orb(cx: number, cy: number, rad: number, n: number, r: number, a: number, yaw = 0.6, tilt = 0.35): Dot[] {
  const out: Dot[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fibDir(i, n);
    const [px, py, pz] = project(x, y, z, yaw, tilt);
    out.push(dot(cx + px * rad, cy + py * rad, r * (0.75 + 0.3 * (pz + 1)), shade(pz, a), 'dot', pz));
  }
  return out;
}

/** Dots on a circle, starting at angle a0, n dots. Optionally skip an angular gap around `gapAt`. */
export function ring(cx: number, cy: number, R: number, n: number, r: number, a: number, gapAt?: number, gap = 0): Dot[] {
  const out: Dot[] = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TAU;
    if (gapAt !== undefined) {
      const d = Math.abs(((ang - gapAt + Math.PI * 3) % TAU) - Math.PI);
      if (d < gap) continue;
    }
    out.push(dot(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, r, a));
  }
  return out;
}

/** Polyline circle (for dashed boundaries / solid locked rings). `f` draws a fraction clockwise from 12 o'clock. */
export function circleLines(cx: number, cy: number, R: number, segs: number, a: number, form: LineForm, f = 1, from = -Math.PI / 2): Line[] {
  const out: Line[] = [];
  const m = Math.ceil(segs * clamp(f));
  for (let i = 0; i < m; i++) {
    const a0 = from + (i / segs) * TAU;
    const a1 = from + (Math.min(i + 1, segs * f) / segs) * TAU;
    out.push(line(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R, cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, a, form));
  }
  return out;
}

/** Arc of a circle as line segments, from angle a0 to a1. */
export function arcLines(cx: number, cy: number, R: number, a0: number, a1: number, segs: number, a: number, form: LineForm): Line[] {
  const out: Line[] = [];
  for (let i = 0; i < segs; i++) {
    const u0 = lerp(a0, a1, i / segs);
    const u1 = lerp(a0, a1, (i + 1) / segs);
    out.push(line(cx + Math.cos(u0) * R, cy + Math.sin(u0) * R, cx + Math.cos(u1) * R, cy + Math.sin(u1) * R, a, form));
  }
  return out;
}

/** Axis-aligned rectangle outline. */
export function rectLines(x0: number, y0: number, x1: number, y1: number, a: number, form: LineForm): Line[] {
  return [line(x0, y0, x1, y0, a, form), line(x1, y0, x1, y1, a, form), line(x1, y1, x0, y1, a, form), line(x0, y1, x0, y0, a, form)];
}

/** cols × rows block of dots centred on (cx, cy). */
export function block(cx: number, cy: number, cols: number, rows: number, pitch: number, r: number, a: number, kind: Dot['kind'] = 'dot'): Dot[] {
  const out: Dot[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      out.push(dot(cx + (i - (cols - 1) / 2) * pitch, cy + (j - (rows - 1) / 2) * pitch, r, a, kind));
  return out;
}

/** MCP primitive marks: tool = filled 2×2 square, resource = 3-row dot stack, prompt = outline triangle. */
export function toolMark(cx: number, cy: number, s: number, r: number, a: number): Dot[] {
  return block(cx, cy, 2, 2, s, r, a);
}

export function resourceMark(cx: number, cy: number, s: number, r: number, a: number): Dot[] {
  return block(cx, cy, 3, 3, s, r * 0.85, a).map((d, i) => (Math.floor(i / 3) === 0 ? d : { ...d, a: d.a * 0.7 }));
}

export function promptMark(cx: number, cy: number, s: number, a: number): Line[] {
  const h = s * 1.2;
  return [
    line(cx, cy - h, cx + s * 1.2, cy + h * 0.7, a),
    line(cx + s * 1.2, cy + h * 0.7, cx - s * 1.2, cy + h * 0.7, a),
    line(cx - s * 1.2, cy + h * 0.7, cx, cy - h, a),
  ];
}

/** Point along a quadratic arc from A to B with a perpendicular bow. */
export function arcPoint(ax: number, ay: number, bx: number, by: number, u: number, bow: number): [number, number] {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bow;
  const cy = my + ny * bow;
  const v = 1 - u;
  return [v * v * ax + 2 * v * u * cx + u * u * bx, v * v * ay + 2 * v * u * cy + u * u * by];
}

/** A packet with a short tail (name + args ride behind the call). */
export function packet(path: (u: number) => [number, number], u: number, r: number, tail = 3, a = 1, kind: Dot['kind'] = 'dot'): Dot[] {
  const out: Dot[] = [];
  for (let k = tail; k >= 0; k--) {
    const [x, y] = path(clamp(u - k * 0.035));
    out.push(dot(x, y, k === 0 ? r * 1.9 : r * 1.1, k === 0 ? a : a * (0.7 - k * 0.15), k === 0 ? kind : 'dot', 0.9));
  }
  return out;
}

/** z-sort, cap, drop invisible: the same post-pass the engine applies. */
export function finish(dots: Dot[], lines: Line[]): Frame {
  const ds = dots.filter((p) => p.a > 0.01 && p.r > 0);
  if (ds.length > MAX_DOTS) ds.length = MAX_DOTS;
  ds.sort((p, q) => p.z - q.z || (p.kind === 'anchor' ? 1 : 0) - (q.kind === 'anchor' ? 1 : 0));
  return { dots: ds, lines: lines.filter((l) => l.a > 0.01) };
}

/** Normalised coordinate → percentage inside the stage box (matches the painter's 4% margin). */
export const pct = (v: number): string => `${(((v * 0.92 + 1) / 2) * 100).toFixed(2)}%`;
