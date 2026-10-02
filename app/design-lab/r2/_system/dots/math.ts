/**
 * Deterministic math for the dot engine. No Math.random anywhere: every
 * "random" value is an integer hash of (index, seed), so SSR and client
 * produce the same frame. Fibonacci-sphere idea after thinking-orbs (MIT,
 * (c) 2026 Jakub Antalik); implementation is our own.
 */
import type { Dot, DotKind, Line, LineForm, Shape } from './types';

export const TAU = Math.PI * 2;

export const clamp = (v: number, lo = 0, hi = 1): number => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, f: number): number => a + (b - a) * f;

/** Map t from [a, b] to [0, 1], clamped. */
export const seg = (t: number, a: number, b: number): number => clamp((t - a) / (b - a));

export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number): number => 1 - (1 - t) ** 3;
export const easeIn = (t: number): number => t * t * t;
/** Small overshoot for the scramble "click back". */
export const easeOutBack = (t: number): number => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

/** String or number seed → uint32. */
export function seedOf(seed: number | string | undefined): number {
  if (seed === undefined) return 0x0a795440;
  if (typeof seed === 'number') return seed >>> 0;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Integer hash of (i, seed, salt) → [0, 1). Pure integer math: identical on every engine. */
export function hash(i: number, seed: number, salt = 0): number {
  let h = (Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(seed + salt * 0x85ebca6b, 0xc2b2ae35)) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Signed hash in [-1, 1). */
export const shash = (i: number, seed: number, salt = 0): number => hash(i, seed, salt) * 2 - 1;

/** Stable unit-sphere directions (Fibonacci lattice). */
export function fibDir(i: number, n: number): [number, number, number] {
  const y = 1 - ((i + 0.5) / n) * 2;
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const th = i * 2.399963229728653;
  return [Math.cos(th) * rad, y, Math.sin(th) * rad];
}

/** Rotate about Y (yaw) then X (tilt). Orthographic. */
export function project(x: number, y: number, z: number, yaw: number, tilt: number): [number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
}

/** Depth shading: far dots dim, near dots full. */
export const shade = (z: number, a = 1): number => a * (0.42 + 0.58 * clamp((z + 1) / 2));

export const dot = (x: number, y: number, r: number, a: number, kind: DotKind = 'dot', z = 0): Dot => ({
  x,
  y,
  z,
  r,
  a: clamp(a),
  kind,
});

export const line = (x1: number, y1: number, x2: number, y2: number, a: number, form: LineForm = 'solid'): Line => ({
  x1,
  y1,
  x2,
  y2,
  a: clamp(a),
  form,
});

/** Partial line from (x1,y1) toward (x2,y2), drawn to fraction f. */
export const partial = (x1: number, y1: number, x2: number, y2: number, f: number, a: number, form: LineForm = 'solid'): Line =>
  line(x1, y1, lerp(x1, x2, f), lerp(y1, y2, f), a, form);

/** Point on a closed shape outline, s in [0, 1). Radius R. Starts at 12 o'clock, clockwise. */
export function shapePoint(shape: Shape, s: number, R: number): [number, number] {
  const u = ((s % 1) + 1) % 1;
  if (shape === 'circle') {
    const a = u * TAU - Math.PI / 2;
    return [Math.cos(a) * R, Math.sin(a) * R];
  }
  const sides = shape === 'triangle' ? 3 : shape === 'square' ? 4 : 6;
  // Square starts at its top-left corner so edges stay axis-aligned; the rest start at 12 o'clock.
  const rot = shape === 'square' ? (-3 * Math.PI) / 4 : -Math.PI / 2;
  // Optical sizing: polygons are scaled so they read as large as the circle.
  const rr = shape === 'square' ? R * 1.12 : shape === 'triangle' ? R * 1.1 : R;
  const k = Math.floor(u * sides);
  const f = u * sides - k;
  const a0 = rot + (k / sides) * TAU;
  const a1 = rot + ((k + 1) / sides) * TAU;
  // Triangle sits optically centred: nudge down by a quarter of its inradius.
  const dy = shape === 'triangle' ? rr * 0.12 : 0;
  return [lerp(Math.cos(a0) * rr, Math.cos(a1) * rr, f), lerp(Math.sin(a0) * rr, Math.sin(a1) * rr, f) + dy];
}

/** Vertices of a closed shape (for solid outlines). */
export function shapeVerts(shape: Shape, R: number): Array<[number, number]> {
  const sides = shape === 'triangle' ? 3 : shape === 'square' ? 4 : shape === 'hex' ? 6 : 24;
  return Array.from({ length: sides }, (_, k) => shapePoint(shape, k / sides, R));
}

/** Round to 2 decimals (SVG attribute stability). */
export const r2 = (v: number): number => Math.round(v * 100) / 100;
