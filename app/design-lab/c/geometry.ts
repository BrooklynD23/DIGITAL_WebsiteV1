/**
 * Concept C — deterministic point clouds for the formation hero.
 *
 * One generator feeds both the static SVG poster (server-rendered, no-JS /
 * reduced-motion / low-power fallback) and the WebGL particle buffer, so the
 * fallback and the first WebGL frame are the same picture.
 *
 * Coordinates are "world" units in a 6:5 frame: x ∈ [-1.2, 1.2], y ∈ [-1, 1]
 * (y up). z is depth after the view rotation, normalised to roughly [-1, 1].
 *
 * Every shape is computed from real structure:
 * - phone: 7 layers = the 7 subsystems in `phoneV2Copy.subsystemSections`
 * - glasses: frame + HUD window + FPGA module (Smart Reading, `projects.ts`)
 * - unsigned: a blank signature line (DG-003 does not exist yet)
 */

export const POINT_COUNT = 4900; // 7 subsystems × 700
export const PER_LAYER = 700;
export const WORLD_W = 2.4;
export const WORLD_H = 2.0;

type Seg = readonly [number, number, number, number, number, number];
type P2 = readonly [number, number];

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Polyline (2D, in a plane) → segments, lifted to 3D by `lift`. */
function polySegs(pts: readonly P2[], lift: (p: P2) => readonly [number, number, number], closed = false): Seg[] {
  const out: Seg[] = [];
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i += 1) {
    const a = lift(pts[i]);
    const b = lift(pts[(i + 1) % pts.length]);
    out.push([a[0], a[1], a[2], b[0], b[1], b[2]]);
  }
  return out;
}

function roundedRect(cx: number, cy: number, w: number, h: number, r: number, steps = 6): P2[] {
  const pts: P2[] = [];
  const corners: Array<[number, number, number]> = [
    [cx + w / 2 - r, cy + h / 2 - r, 0],
    [cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2],
    [cx - w / 2 + r, cy - h / 2 + r, Math.PI],
    [cx + w / 2 - r, cy - h / 2 + r, (3 * Math.PI) / 2],
  ];
  for (const [ox, oy, a0] of corners) {
    for (let s = 0; s <= steps; s += 1) {
      const a = a0 + (s / steps) * (Math.PI / 2);
      pts.push([ox + Math.cos(a) * r, oy + Math.sin(a) * r]);
    }
  }
  return pts;
}

function circle(cx: number, cy: number, r: number, steps = 24): P2[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as P2;
  });
}

/** Stratified sampling along segments by arc length. */
function sampleSegs(segs: readonly Seg[], n: number, rand: () => number, jitter = 0.004): number[] {
  const lens = segs.map((s) => Math.hypot(s[3] - s[0], s[4] - s[1], s[5] - s[2]));
  const total = lens.reduce((a, b) => a + b, 0);
  const out: number[] = [];
  let segIdx = 0;
  let acc = 0;
  for (let i = 0; i < n; i += 1) {
    const d = ((i + rand() * 0.9) / n) * total;
    while (segIdx < segs.length - 1 && acc + lens[segIdx] < d) {
      acc += lens[segIdx];
      segIdx += 1;
    }
    const s = segs[segIdx];
    const t = lens[segIdx] > 0 ? Math.min(1, Math.max(0, (d - acc) / lens[segIdx])) : 0;
    out.push(
      s[0] + (s[3] - s[0]) * t + (rand() - 0.5) * jitter,
      s[1] + (s[4] - s[1]) * t + (rand() - 0.5) * jitter,
      s[2] + (s[5] - s[2]) * t + (rand() - 0.5) * jitter,
    );
  }
  return out;
}

function rotateYX(p: readonly [number, number, number], yaw: number, pitch: number): [number, number, number] {
  const [x, y, z] = p;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

interface Fit {
  readonly scale: number;
  readonly ox: number;
  readonly oy: number;
  readonly oz: number;
  readonly zs: number;
}

/** Fit a rotated cloud into a box (half-extents hx, hy), centred at (cx, cy). */
function fitCloud(arr: number[], hx: number, hy: number, cx = 0, cy = 0): Fit {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < arr.length; i += 3) {
    minX = Math.min(minX, arr[i]); maxX = Math.max(maxX, arr[i]);
    minY = Math.min(minY, arr[i + 1]); maxY = Math.max(maxY, arr[i + 1]);
    minZ = Math.min(minZ, arr[i + 2]); maxZ = Math.max(maxZ, arr[i + 2]);
  }
  const scale = Math.min((2 * hx) / (maxX - minX), (2 * hy) / (maxY - minY));
  const fit: Fit = {
    scale,
    ox: (minX + maxX) / 2 - cx / scale,
    oy: (minY + maxY) / 2 - cy / scale,
    oz: (minZ + maxZ) / 2,
    zs: 2 / Math.max(1e-6, maxZ - minZ),
  };
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = (arr[i] - fit.ox) * scale;
    arr[i + 1] = (arr[i + 1] - fit.oy) * scale;
    arr[i + 2] = (arr[i + 2] - fit.oz) * fit.zs;
  }
  return fit;
}

/** Fisher–Yates over point triplets (+ an optional per-point companion array). */
function shuffle(arr: number[], rand: () => number, companion?: number[]): void {
  const n = arr.length / 3;
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    for (let k = 0; k < 3; k += 1) {
      const t = arr[i * 3 + k];
      arr[i * 3 + k] = arr[j * 3 + k];
      arr[j * 3 + k] = t;
    }
    if (companion) {
      const t = companion[i];
      companion[i] = companion[j];
      companion[j] = t;
    }
  }
}


/** Share of points drawn on small screens (setDrawRange). */
export const SPARSE_SHARE = 0.55;

/**
 * Order points for morphing: after the shuffle, sort each draw segment
 * (sparse head, dense tail) by x then y. Every cloud is ordered the same way,
 * so point i sits at a similar x-rank in every formation: morphs read as a
 * directed left-to-right sweep instead of a scramble, and the head segment is
 * still a representative subset for the sparse mobile draw.
 */
function orderForMorph(arr: number[], companion?: number[]): void {
  const n = arr.length / 3;
  const split = Math.floor(n * SPARSE_SHARE);
  for (const [a, b] of [[0, split], [split, n]] as const) {
    const idx = Array.from({ length: b - a }, (_, k) => a + k);
    idx.sort((p, q) => arr[p * 3] - arr[q * 3] || arr[p * 3 + 1] - arr[q * 3 + 1]);
    const pos = idx.flatMap((i) => [arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]]);
    const comp = companion ? idx.map((i) => companion[i]) : null;
    for (let k = 0; k < idx.length; k += 1) {
      arr[(a + k) * 3] = pos[k * 3];
      arr[(a + k) * 3 + 1] = pos[k * 3 + 1];
      arr[(a + k) * 3 + 2] = pos[k * 3 + 2];
      if (comp && companion) companion[a + k] = comp[k];
    }
  }
}

/* ------------------------------------------------------------------ */
/* DG-001 — the 7-subsystem stack                                      */
/* ------------------------------------------------------------------ */

const PHONE_W = 0.86;
const PHONE_D = 1.72;
const LAYER_GAP = 0.3;
const PHONE_YAW = (-38 * Math.PI) / 180;
const PHONE_PITCH = (56 * Math.PI) / 180;

function layerPattern(i: number, rand: () => number): P2[][] {
  const W = PHONE_W;
  const D = PHONE_D;
  const outline = roundedRect(0, 0, W, D, 0.11);
  switch (i) {
    case 0: // Systems Architecture — boundaries between parts
      return [outline, [[-W / 2, -0.3], [W / 2, -0.3]], [[-W / 2, 0.36], [W / 2, 0.36]], [[0, -0.3], [0, 0.36]], [[-W / 2, -0.62], [W / 2, -0.62]]];
    case 1: { // Hardware / PCB — manhattan traces + pads
      const lines: P2[][] = [roundedRect(0, 0, W - 0.04, D - 0.04, 0.04, 2)];
      for (let t = 0; t < 11; t += 1) {
        const x0 = -W / 2 + 0.06 + rand() * (W - 0.12);
        const y0 = -D / 2 + 0.08 + rand() * (D - 0.16);
        const x1 = -W / 2 + 0.06 + rand() * (W - 0.12);
        const y1 = Math.max(-D / 2 + 0.08, Math.min(D / 2 - 0.08, y0 + (rand() - 0.5) * 0.9));
        lines.push([[x0, y0], [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2], [x1, y1]]);
      }
      for (const [px, py] of [[-0.24, 0.6], [0.22, 0.58], [-0.2, -0.55], [0.25, -0.62]] as const) {
        lines.push(roundedRect(px, py, 0.08, 0.08, 0.005, 1));
      }
      return lines;
    }
    case 2: { // Firmware / Embedded — chips with pins, joined by a boot path
      const chips: Array<[number, number, number]> = [[-0.14, 0.42, 0.26], [0.16, -0.05, 0.2], [-0.12, -0.5, 0.16]];
      const lines: P2[][] = [outline];
      for (const [cx, cy, s] of chips) {
        lines.push(roundedRect(cx, cy, s, s, 0.01, 1));
        for (let k = 0; k < 5; k += 1) {
          const o = -s / 2 + ((k + 0.5) / 5) * s;
          lines.push([[cx - s / 2, cy + o], [cx - s / 2 - 0.035, cy + o]], [[cx + s / 2, cy + o], [cx + s / 2 + 0.035, cy + o]]);
        }
      }
      lines.push([[-0.14, 0.29], [-0.14, 0.12], [0.16, 0.12], [0.16, 0.05]], [[0.16, -0.15], [0.16, -0.3], [-0.12, -0.3], [-0.12, -0.42]]);
      return lines;
    }
    case 3: // Operating System — nested service layers
      return [1, 0.78, 0.56, 0.34].map((k) => roundedRect(0, 0, W * k, D * k, 0.11 * k));
    case 4: { // Apps / UX — screen + tile grid
      const lines: P2[][] = [outline, roundedRect(0, 0.04, W - 0.12, D - 0.26, 0.05)];
      for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          lines.push(roundedRect(-0.27 + c * 0.18, 0.56 - r * 0.24, 0.1, 0.1, 0.025, 2));
        }
      }
      return lines;
    }
    case 5: // Mechanical / CAD — doubled wall, screw bosses, camera cut-out
      return [
        outline,
        roundedRect(0, 0, W - 0.06, D - 0.06, 0.085),
        circle(-W / 2 + 0.09, D / 2 - 0.09, 0.028, 12),
        circle(W / 2 - 0.09, D / 2 - 0.09, 0.028, 12),
        circle(-W / 2 + 0.09, -D / 2 + 0.09, 0.028, 12),
        circle(W / 2 - 0.09, -D / 2 + 0.09, 0.028, 12),
        roundedRect(-0.18, 0.6, 0.26, 0.3, 0.06),
        circle(-0.18, 0.66, 0.06, 18),
      ];
    default: { // Integration / Testing — probe points where parts meet
      const lines: P2[][] = [outline];
      for (let r = 0; r < 7; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          const x = -0.3 + c * 0.2;
          const y = 0.66 - r * 0.22;
          lines.push([[x - 0.025, y], [x + 0.025, y]], [[x, y - 0.025], [x, y + 0.025]]);
        }
      }
      return lines;
    }
  }
}

export interface PhoneCloud {
  readonly positions: Float32Array;
  readonly layers: Float32Array;
  /** Screen-space direction of the stack axis (for the scroll "explode"). */
  readonly axis: readonly [number, number, number];
}

let phoneCache: PhoneCloud | null = null;

export function phoneCloud(): PhoneCloud {
  if (phoneCache) return phoneCache;
  const rand = mulberry32(1001);
  const pos: number[] = [];
  const layers: number[] = [];
  for (let i = 0; i < 7; i += 1) {
    const y = (3 - i) * LAYER_GAP;
    // Outlines (rects, circles) have > 4 vertices and close; traces and ticks stay open.
    const segs = layerPattern(i, rand).flatMap((poly) =>
      polySegs(poly, ([u, v]) => rotateYX([u, y, v], PHONE_YAW, PHONE_PITCH), poly.length > 4),
    );
    const pts = sampleSegs(segs, PER_LAYER, rand);
    pos.push(...pts);
    for (let k = 0; k < PER_LAYER; k += 1) layers.push(i);
  }
  const fit = fitCloud(pos, 1.02, 0.94, 0.04, 0);
  shuffle(pos, mulberry32(77), layers);
  orderForMorph(pos, layers);
  const a = rotateYX([0, 1, 0], PHONE_YAW, PHONE_PITCH);
  phoneCache = {
    positions: Float32Array.from(pos),
    layers: Float32Array.from(layers),
    axis: [a[0] * fit.scale, a[1] * fit.scale, a[2] * fit.zs],
  };
  return phoneCache;
}

/* ------------------------------------------------------------------ */
/* DG-002 — Smart Reading glasses                                      */
/* ------------------------------------------------------------------ */

const G_YAW = (26 * Math.PI) / 180;
const G_PITCH = (12 * Math.PI) / 180;

function superellipse(cx: number, cy: number, rx: number, ry: number, n = 4, steps = 72): P2[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n), cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n)] as P2;
  });
}

export interface GlassesCloud {
  readonly positions: Float32Array;
  /** HUD window centre in % of the stage (left, top) — for the RSVP overlay. */
  readonly hud: { readonly left: number; readonly top: number };
}

let glassesCache: GlassesCloud | null = null;

export function glassesCloud(): GlassesCloud {
  if (glassesCache) return glassesCache;
  const rand = mulberry32(2002);
  const front = (p: P2) => rotateYX([p[0], p[1], 0], G_YAW, G_PITCH);
  const groups: Array<[Seg[], number]> = [];
  const rims = [-0.5, 0.5].flatMap((cx) => [
    ...polySegs(superellipse(cx, 0, 0.4, 0.27), front, true),
    ...polySegs(superellipse(cx, 0, 0.44, 0.31), front, true),
  ]);
  groups.push([rims, 2200]);
  const bridge: P2[] = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return [-0.06 + 0.12 * t, 0.1 + Math.sin(t * Math.PI) * 0.07] as P2;
  });
  groups.push([polySegs(bridge, front), 140]);
  const temples: Seg[] = [];
  for (const sx of [-1, 1]) {
    const pts: Array<readonly [number, number, number]> = [
      [sx * 0.94, 0.14, 0], [sx * 0.98, 0.13, -0.6], [sx * 1.0, 0.11, -1.3], [sx * 0.98, -0.05, -1.55], [sx * 0.95, -0.16, -1.62],
    ];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = rotateYX(pts[i], G_YAW, G_PITCH);
      const b = rotateYX(pts[i + 1], G_YAW, G_PITCH);
      temples.push([a[0], a[1], a[2], b[0], b[1], b[2]]);
    }
  }
  groups.push([temples, 820]);
  // HUD window inside the right lens (dashed)
  const hudSegs: Seg[] = [];
  const hudRect = roundedRect(0.5, 0.0, 0.34, 0.13, 0.015, 2);
  polySegs(hudRect, front, true).forEach((s, i) => { if (i % 2 === 0) hudSegs.push(s); });
  hudSegs.push(...polySegs([[0.5, 0.085], [0.5, 0.11]], front), ...polySegs([[0.5, -0.085], [0.5, -0.11]], front));
  groups.push([hudSegs, 360]);
  // FPGA module on the right temple, in the temple's side plane
  const side = (p: P2) => rotateYX([1.0, p[1], p[0]], G_YAW, G_PITCH);
  const fpga: Seg[] = [...polySegs(roundedRect(-0.62, 0.12, 0.44, 0.16, 0.01, 1), side, true)];
  for (let k = 1; k < 6; k += 1) {
    const z = -0.84 + (k / 6) * 0.44;
    fpga.push(...polySegs([[z, 0.06], [z, 0.18]], side));
  }
  groups.push([fpga, 520]);
  // optics: faint scan lines inside each lens
  const optics: Seg[] = [];
  for (const cx of [-0.5, 0.5]) {
    for (let r = -2; r <= 2; r += 1) {
      const y = r * 0.085;
      const half = 0.36 * Math.pow(1 - Math.pow(Math.abs(y) / 0.27, 4), 0.25);
      if (cx > 0 && Math.abs(y) < 0.08) continue; // leave the HUD window clear
      optics.push(...polySegs([[cx - half, y], [cx + half, y]], front));
    }
  }
  groups.push([optics, 560]);
  const pos: number[] = [];
  for (const [segs, n] of groups) pos.push(...sampleSegs(segs, n, rand, 0.005));
  // loose material around the object
  const rest = POINT_COUNT - pos.length / 3;
  for (let i = 0; i < rest; i += 1) {
    const a = rand() * Math.PI * 2;
    const r = 0.5 + rand() * 0.9;
    pos.push(Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.55, (rand() - 0.5) * 0.6);
  }
  const fit = fitCloud(pos, 1.08, 0.7, 0, 0.05);
  const h = front([0.5, 0]);
  const hx = (h[0] - fit.ox) * fit.scale;
  const hy = (h[1] - fit.oy) * fit.scale;
  shuffle(pos, mulberry32(88));
  orderForMorph(pos);
  glassesCache = {
    positions: Float32Array.from(pos),
    hud: { left: ((hx + WORLD_W / 2) / WORLD_W) * 100, top: ((WORLD_H / 2 - hy) / WORLD_H) * 100 },
  };
  return glassesCache;
}

/* ------------------------------------------------------------------ */
/* DG-003 — the unsigned line                                          */
/* ------------------------------------------------------------------ */

export const SIGN_BASELINE_Y = -0.34;
export const SIGN_LINE_POINTS = 700;
export const SIGN_CROSS_POINTS = 160;
export const SIGN_DUST_POINTS = 720;
export const SIGN_NAME_POINTS = POINT_COUNT - SIGN_LINE_POINTS - SIGN_CROSS_POINTS - SIGN_DUST_POINTS;

const BASELINE_SEG: Seg = [-1.02, SIGN_BASELINE_Y, 0, 1.02, SIGN_BASELINE_Y, 0];

function signLineAndCross(rand: () => number, namePoints: Float32Array | null): number[] {
  const pos: number[] = [];
  pos.push(...sampleSegs([BASELINE_SEG], SIGN_LINE_POINTS, rand, 0.006));
  const cx = -0.98;
  const cy = SIGN_BASELINE_Y + 0.13;
  pos.push(...sampleSegs([[cx - 0.05, cy - 0.05, 0, cx + 0.05, cy + 0.05, 0], [cx - 0.05, cy + 0.05, 0, cx + 0.05, cy - 0.05, 0]], SIGN_CROSS_POINTS, rand, 0.004));
  if (namePoints && namePoints.length === SIGN_NAME_POINTS * 3) {
    pos.push(...Array.from(namePoints));
  } else {
    // Unsigned: the name's material waits on the line, so the line is literally blank.
    pos.push(...sampleSegs([BASELINE_SEG], SIGN_NAME_POINTS, rand, 0.008));
  }
  return pos;
}

/**
 * Signature cloud. `namePoints` (world coords, flat xyz) forms the name above
 * the line when a visitor signs; null = a blank line.
 */
export function signCloud(namePoints: Float32Array | null): Float32Array {
  const rand = mulberry32(3003);
  const pos = signLineAndCross(rand, namePoints);
  for (let i = 0; i < SIGN_DUST_POINTS; i += 1) {
    pos.push((rand() - 0.5) * 2.3, (rand() - 0.5) * 1.9, (rand() - 0.5) * 1.6);
  }
  shuffle(pos, mulberry32(99));
  orderForMorph(pos);
  return Float32Array.from(pos);
}

/** Line + cross + name only (no loose material): the footer's remembered signature. */
export function signatureDots(namePoints: Float32Array | null): Float32Array {
  const pos = signLineAndCross(mulberry32(3003), namePoints);
  shuffle(pos, mulberry32(99));
  return Float32Array.from(pos);
}

/** viewBoxes for the signature band, in SVG space: signed (line + name) and blank (line + × only). */
export const SIGNATURE_VIEWBOX = `-1.06 ${(-(SIGN_BASELINE_Y + 0.62)).toFixed(2)} 2.12 0.72`;
export const SIGNATURE_VIEWBOX_BLANK = `-1.06 ${(-(SIGN_BASELINE_Y + 0.2)).toFixed(2)} 2.12 0.26`;

/* ------------------------------------------------------------------ */
/* SVG poster helpers                                                  */
/* ------------------------------------------------------------------ */

const POSTER_STRIDE = 4;

/** "M x y h0" dot path in SVG space (y down). Takes every `stride`-th point. */
export function dotPath(positions: Float32Array, filter?: (i: number) => boolean, stride = POSTER_STRIDE): string {
  const parts: string[] = [];
  const n = positions.length / 3;
  for (let i = 0; i < n; i += stride) {
    if (filter && !filter(i)) continue;
    parts.push(`M${positions[i * 3].toFixed(3)} ${(-positions[i * 3 + 1]).toFixed(3)}h0`);
  }
  return parts.join('');
}

export const POSTER_VIEWBOX = `${-WORLD_W / 2} ${-WORLD_H / 2} ${WORLD_W} ${WORLD_H}`;
