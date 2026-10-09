/**
 * SHADES glasses · geometry. An original frame authored in millimetres (origin at the bridge centre, x to the
 * viewer's right in the front view, y up, z toward the viewer), projected through a long-lens camera for a yaw / pitch.
 * Pure and deterministic: the server still and the client render share one drawing.
 *
 * Proportions follow ordinary eyewear: lens 50 × 39 mm, bridge 19 mm, front 5.2 mm deep, temples ~142 mm.
 * Not traced from any product. The display region is a placeholder: no panel or optic is specified.
 * The display sits in the lens on the viewer's right in the front view (+x), as in the round-1 mockups.
 */
export type ViewName = 'front' | 'three-quarter' | 'side';
export type V3 = readonly [number, number, number];
export type P2 = readonly [number, number];

/** Camera angles per named view, degrees. Positive yaw turns the display lens toward the viewer. */
export const VIEW_ANGLES: Readonly<Record<ViewName, { readonly yaw: number; readonly pitch: number }>> = {
  front: { yaw: 0, pitch: 7 },
  'three-quarter': { yaw: 36, pitch: 13 },
  side: { yaw: 82, pitch: 7 },
};

const DEG = Math.PI / 180;
/** Camera distance, mm: a long product lens. Far parts shrink a little; temples tuck behind the front in the front view. */
const CAMERA = 430;
const TAU = Math.PI * 2;

const LENS_CX = 34.5;
const LENS_A = 25;
const LENS_B = 19.5;
const RIM = { top: 4.9, bottom: 2.5, side: 3.4 } as const;
export const DEPTH = 5.2;
/** Lenses and the display sit this far behind the front face. */
const LENS_Z = -DEPTH * 0.45;
/** Face wrap: the front curves back toward the temples. */
const K = 0.0019;
const wrap = (x: number): number => -K * x * x;

const HINGE_X = 63.6;
const HINGE_Y = 13;
/** Temple half-height at the hinge. The front third is a deep housing; it tapers hard to a slim ear piece. */
const TEMPLE_H = 5.2;
/** Temple thickness at the hinge (the housing). */
const TEMPLE_T = 8;

/** Display region in the right lens: centre and size, mm in the lens plane. */
const DISPLAY = { x: LENS_CX + 1.5, y: 9.2, w: 19, h: 7.4 } as const;

/* ------------------------------------------------------------------ 2D front-plane outlines */

function lensRight(grow = 0, n = 144): P2[] {
  const pts: P2[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const e = 2 / (s > 0 ? 4.4 : 2.6); // flat, crisp brow; softer, rounder bottom
    let x = LENS_A * Math.sign(c) * Math.abs(c) ** e;
    let y = LENS_B * Math.sign(s) * Math.abs(s) ** e;
    x *= 1 + 0.06 * (y / LENS_B); // top a touch wider than the bottom
    if (x < 0 && y < 0) x *= 1 - 0.12 * (-y / LENS_B) ** 1.6; // the nose side cut away below
    if (y > 0 && x > 0) y += 1.6 * (x / LENS_A) ** 3 * (y / LENS_B); // the outer brow corner lifts a little
    if (y < 0) y *= 1 - 0.07 * Math.max(0, -x / LENS_A); // bottom rises toward the nose: a slight downward taper outward
    pts.push([LENS_CX + x, y]);
  }
  return grow ? offset(pts, [LENS_CX, 0], () => grow) : pts;
}

/** Offset a closed convex curve along its outward normals; width depends on the normal direction. */
function offset(pts: readonly P2[], centre: P2, width: (nx: number, ny: number) => number): P2[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    let nx = b[1] - a[1];
    let ny = -(b[0] - a[0]);
    const len = Math.hypot(nx, ny) || 1;
    nx /= len;
    ny /= len;
    if (nx * (p[0] - centre[0]) + ny * (p[1] - centre[1]) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const w = width(nx, ny);
    return [p[0] + nx * w, p[1] + ny * w] as P2;
  });
}

/** Rim width by normal direction: a brow that thickens toward the temple, a fine lower rim. */
const rimWidth = (fraction: number) => (nx: number, ny: number): number =>
  fraction *
  (ny > 0
    ? RIM.side + (RIM.top * (1 + 0.16 * nx) - RIM.side) * ny ** 2
    : RIM.side + (RIM.bottom - RIM.side) * Math.abs(ny) ** 1.4);

const mirror = (pts: readonly P2[]): P2[] => pts.map(([x, y]) => [-x, y] as P2).reverse();

function cubic(p0: P2, p1: P2, p2: P2, p3: P2, n = 14): P2[] {
  const out: P2[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

function roundedRect(x0: number, y0: number, x1: number, y1: number, r: number): P2[] {
  const pts: P2[] = [];
  const corners: [number, number, number][] = [
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, 90],
    [x0 + r, y0 + r, 180],
    [x1 - r, y0 + r, 270],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let k = 0; k <= 6; k++) {
      const a = (a0 + (k / 6) * 90) * DEG;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

interface Front {
  readonly lensHoleR: P2[];
  readonly lensHoleL: P2[];
  readonly rimR: P2[];
  readonly rimL: P2[];
  readonly bridge: P2[];
  readonly wingR: P2[];
  readonly wingL: P2[];
  readonly lensR: P2[];
  readonly lensL: P2[];
  readonly padR: P2[];
  readonly padL: P2[];
}

function buildFront(): Front {
  const hole = lensRight();
  const rim = offset(hole, [LENS_CX, 0], rimWidth(1));
  const mid = offset(hole, [LENS_CX, 0], rimWidth(0.55));
  const n = hole.length;
  const at = (deg: number): number => Math.round((deg / 360) * n) % n;
  const iTop = at(112);
  const iBot = at(174);
  const oT = rim[iTop];
  const oB = rim[iBot];
  const yT = 22.4;
  const yB = 13.6;
  // Right half of the bridge: top-centre → into the rim body → bottom-centre, then mirrored.
  const half: P2[] = [
    [0, yT],
    ...cubic([0, yT], [4, yT + 0.1], [oT[0] - 4, oT[1] + 0.6], oT),
    ...mid.slice(iTop, iBot + 1),
    oB,
    ...cubic(oB, [oB[0] - 2.2, oB[1] + 4], [3, yB], [0, yB]),
  ];
  const bridge = [...half, ...mirror(half).slice(1, -1)];
  // End piece: as tall as the temple it carries, so the hinge reads as one block, not a hook.
  const wingR = roundedRect(57.8, HINGE_Y - TEMPLE_H - 0.3, HINGE_X + TEMPLE_T / 2 + 0.2, HINGE_Y + TEMPLE_H + 0.3, 2.4);
  const lens = lensRight(0.9);
  const pad: P2[] = [];
  for (let i = 0; i < 24; i++) {
    const t = (i / 24) * TAU;
    const yy = -6.5 + 4.2 * Math.sin(t);
    const w = 1.05 * (1 - 0.25 * Math.sin(t)); // slim teardrop, fuller at the bottom
    pad.push([5.5 + w * Math.cos(t), yy]);
  }
  return {
    lensHoleR: hole,
    lensHoleL: mirror(hole),
    rimR: rim,
    rimL: mirror(rim),
    bridge,
    wingR,
    wingL: mirror(wingR),
    lensR: lens,
    lensL: mirror(lens),
    padR: pad,
    padL: mirror(pad),
  };
}

const FRONT = buildFront();

/* ------------------------------------------------------------------ temples (3D ribbons) */

interface TempleSample {
  readonly c: V3;
  readonly up: V3;
  readonly h: number;
  readonly t: number;
  /** 0 at the hinge, 1 at the tip. */
  readonly q: number;
}

function templeSamples(side: 1 | -1, bend: boolean): TempleSample[] {
  const STRAIGHT = 108;
  const BEND = 34;
  const total = STRAIGHT + BEND;
  const z0 = wrap(HINGE_X) - DEPTH + 0.6;
  const raw: { c: V3; tan: V3; q: number }[] = [];
  const N1 = 44;
  for (let i = 0; i <= N1; i++) {
    const s = i / N1;
    raw.push({
      c: [side * (HINGE_X + 1.4 * s), HINGE_Y - 2.2 * s, z0 - STRAIGHT * s],
      tan: [0, -2.2 / STRAIGHT, -1],
      q: (STRAIGHT * s) / total,
    });
  }
  const N2 = bend ? 26 : 0;
  let [x, y, z] = raw[raw.length - 1].c;
  const t0 = Math.atan2(-2.2, STRAIGHT);
  for (let i = 1; i <= N2; i++) {
    const u = i / N2;
    const th = t0 - 52 * DEG * (u * u * (3 - 2 * u));
    const step = BEND / N2;
    y += Math.sin(th) * step;
    z -= Math.cos(th) * step;
    x -= side * (1.6 / N2);
    raw.push({ c: [x, y, z], tan: [0, Math.sin(th), -Math.cos(th)], q: (STRAIGHT + BEND * u) / total });
  }
  return raw.map(({ c, tan, q }) => {
    const len = Math.hypot(tan[1], tan[2]);
    const up: V3 = [0, -tan[2] / len, tan[1] / len];
    // Housing (q < HOUSING), a short firm step down, then the slim ear piece.
    let h: number;
    let t: number;
    if (q < HOUSING) {
      h = TEMPLE_H + 0.55 * Math.sin((Math.PI * q) / HOUSING) ** 0.6 - 0.3 * (q / HOUSING); // a slight belly: the pod
      t = TEMPLE_T - 0.5 * (q / HOUSING);
    } else if (q < HOUSING + 0.13) {
      const u = smooth((q - HOUSING) / 0.13);
      h = TEMPLE_H - 0.3 - (TEMPLE_H - 0.3 - 2.2) * u;
      t = TEMPLE_T - 0.5 - (TEMPLE_T - 0.5 - 3.3) * u;
    } else {
      const u = (q - HOUSING - 0.13) / (1 - HOUSING - 0.13);
      h = 2.2 - 0.5 * u;
      t = 3.3 - 0.6 * u;
    }
    if (q > 0.965) h *= Math.sqrt(Math.max(0, 1 - ((q - 0.965) / 0.035) ** 2)) * 0.8 + 0.2;
    return { c, up, h, t, q };
  });
}

const smooth = (u: number): number => u * u * (3 - 2 * u);
/** Share of the temple length that is the component housing. */
const HOUSING = 0.34;

/* ------------------------------------------------------------------ projection */

export interface Projector {
  readonly proj: (v: V3) => P2;
  readonly facing: (n: V3) => boolean;
  readonly lambert: (n: V3) => number;
}

export function projector(yawDeg: number, pitchDeg: number): Projector {
  const a = yawDeg * DEG;
  const p = pitchDeg * DEG;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const cp = Math.cos(p);
  const sp = Math.sin(p);
  const rot = ([x, y, z]: V3): V3 => {
    const x1 = x * ca - z * sa;
    const z1 = x * sa + z * ca;
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  };
  // Key light: above, front, from the viewer's left (world space).
  const L: V3 = norm([-0.45, 0.8, 0.4]);
  return {
    proj: (v) => {
      const r = rot(v);
      const k = CAMERA / (CAMERA - r[2]);
      return [r[0] * k, -r[1] * k];
    },
    facing: (n) => rot(n)[2] > 1e-4,
    lambert: (n) => Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]),
  };
}

function norm(v: V3): V3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/* ------------------------------------------------------------------ path helpers */

const f2 = (n: number): string => (Math.round(n * 100) / 100).toString();

export function pathOf(pts: readonly P2[], close = true): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p[0])} ${f2(p[1])}`).join('') + (close ? 'Z' : '');
}

function area(pts: readonly P2[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

/** Orient a ring for the nonzero fill rule: +1 = solid, -1 = hole. */
const orient = (pts: P2[], sign: 1 | -1): P2[] => (Math.sign(area(pts)) === sign ? pts : [...pts].reverse());

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

function bboxOf(sets: readonly (readonly P2[])[]): Box {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const s of sets)
    for (const [x, y] of s) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/* ------------------------------------------------------------------ the drawing */

export type FaceKind = 'outer' | 'inner' | 'top' | 'bottom';

export interface Face {
  readonly d: string;
  readonly kind: FaceKind;
  /** Lambert term 0..1 under the key light (used for tone steps). */
  readonly light: number;
}

export interface Drawing {
  /** Front frame as one nonzero path: both rims with lens holes, the bridge and the two end pieces. */
  readonly face: string;
  /** Screen vector for the full depth of the front (front face → back face). Extrude by translating `face`. */
  readonly depth: P2;
  readonly lensR: string;
  readonly lensL: string;
  /** Lens holes only (for the line drawing's inner edge and clip paths). */
  readonly holeR: string;
  readonly holeL: string;
  readonly pads: readonly string[];
  /** Far temple first. Each temple's faces are already back-face culled. */
  readonly temples: readonly (readonly Face[])[];
  /** Affine matrix mapping display-plane mm (origin at the region centre, y down) to screen. */
  readonly display: { readonly m: readonly [number, number, number, number, number, number]; readonly w: number; readonly h: number; readonly visible: number };
  readonly shadow: readonly string[];
  /** Tight box: front, temples and shadow. */
  readonly box: Box;
  /** Front face only. */
  readonly frontBox: Box;
  readonly lensRBox: Box;
  readonly lensLBox: Box;
  readonly displayAt: P2;
  /** Parting lines on the outer face of each housing that faces the camera (open polylines). */
  readonly seams: readonly string[];
  /** Present only when `draw` is asked for the tether. */
  readonly tether?: Tether;
}

/** A rounded slab (the controller box or a part of it): visible side strips, already culled, and the top face. */
export interface Slab {
  /** Silhouette (convex hull): one clean outline and an underlay that hides seams between strips. */
  readonly hull: string;
  readonly top: string;
  readonly topLight: number;
  readonly sides: readonly Face[];
}

/** Cable and external controller box. Drawn only when the consumer asks for the tether. */
export interface Tether {
  /** Open polyline, the cable's centre line (temple end → box). Stroke it `width` wide. */
  readonly cable: string;
  /** The strain-relief boot at the temple end. Stroke it `bootWidth` wide. */
  readonly boot: string;
  /** Exploded: the cable unplugged, ending in its plug behind the box (stroke `cable` style; `plug` at `bootWidth`). */
  readonly cableOpen: string;
  readonly plug: string;
  readonly width: number;
  readonly bootWidth: number;
  /** The whole box (solid and line). */
  readonly box: Slab;
  /** Unlabelled port openings on the front face; empty when that face is turned away. */
  readonly ports: readonly string[];
  readonly shadow: string;
  /** Exploded: the lid stays, the two internal modules and the body drop away below it, each moved by `lift`. */
  readonly body: Slab;
  readonly lid: Slab;
  readonly modules: Readonly<Record<'timing' | 'control', Slab>>;
  readonly lift: Readonly<Record<'body' | 'timing' | 'control', P2>>;
  /** Rightmost point of each module's top, at rest (add `lift` for the exploded label anchor). */
  readonly moduleEnd: Readonly<Record<'timing' | 'control', P2>>;
  /** Cable, box and its shadow, at rest. */
  readonly bounds: Box;
  /** Also covers the lifted exploded parts. */
  readonly explodedBounds: Box;
}

const to3 = (pts: readonly P2[], dz = 0): V3[] => pts.map(([x, y]) => [x, y, wrap(x) + dz] as V3);

/** `tether`: also build the cable and controller box (off by default; the frame output is identical either way). */
export function draw(yaw: number, pitch: number, tether = false): Drawing {
  const P = projector(yaw, pitch);
  const flat = (pts: readonly P2[], dz = 0): P2[] => to3(pts, dz).map(P.proj);

  const rings: P2[][] = [
    orient(flat(FRONT.rimR), 1),
    orient(flat(FRONT.lensHoleR), -1),
    orient(flat(FRONT.rimL), 1),
    orient(flat(FRONT.lensHoleL), -1),
    orient(flat(FRONT.bridge), 1),
    orient(flat(FRONT.wingR), 1),
    orient(flat(FRONT.wingL), 1),
  ];
  const face = rings.map((r) => pathOf(r)).join('');
  const o = P.proj([0, 0, 0]);
  const b = P.proj([0, 0, -DEPTH]);
  const depth: P2 = [b[0] - o[0], b[1] - o[1]];

  const lensRp = flat(FRONT.lensR, LENS_Z);
  const lensLp = flat(FRONT.lensL, LENS_Z);
  const padZ = -DEPTH + 0.2;
  const pads = [FRONT.padR, FRONT.padL].map((p) => pathOf(flat(p, padZ)));

  const temples: Face[][] = [];
  const order: (1 | -1)[] = yaw >= 0 ? [-1, 1] : [1, -1];
  const allTemplePts: P2[] = [];
  const seams: string[] = [];
  let tipEnd: readonly V3[] = [];
  for (const side of order) {
    // Near-frontal views drop the ear bend: it would otherwise show through the lens holes as stray hooks.
    const S = templeSamples(side, Math.abs(yaw) >= 15);
    if (side === 1) tipEnd = S.slice(-3).map((q) => q.c);
    const out: V3 = [side, 0, 0];
    const corner = (s: TempleSample, o2: number, u: number): P2 =>
      P.proj([s.c[0] + out[0] * o2 * s.t * 0.5, s.c[1] + s.up[1] * u * s.h, s.c[2] + s.up[2] * u * s.h]);
    const OT = S.map((s) => corner(s, 1, 1));
    const OB = S.map((s) => corner(s, 1, -1));
    const IT = S.map((s) => corner(s, -1, 1));
    const IB = S.map((s) => corner(s, -1, -1));
    allTemplePts.push(...OT, ...OB);
    const faces: Face[] = [];
    // Bands (top / bottom) first: their normals turn along the ear bend, so emit visible runs.
    const bands: [FaceKind, P2[], P2[], 1 | -1][] = [
      ['bottom', OB, IB, -1],
      ['top', OT, IT, 1],
    ];
    for (const [kind, A, B, sgn] of bands) {
      let run: number[] = [];
      const flush = () => {
        if (run.length) {
          const i0 = run[0];
          const i1 = run[run.length - 1] + 1;
          const n: V3 = [0, S[i0].up[1] * sgn, S[i0].up[2] * sgn];
          faces.push({ d: pathOf([...A.slice(i0, i1 + 1), ...B.slice(i0, i1 + 1).reverse()]), kind, light: P.lambert(n) });
        }
        run = [];
      };
      for (let i = 0; i < S.length - 1; i++) {
        const n: V3 = [0, S[i].up[1] * sgn, S[i].up[2] * sgn];
        if (P.facing(n)) run.push(i);
        else flush();
      }
      flush();
    }
    for (const [kind, nx, A, B] of [
      ['outer', side, OT, OB],
      ['inner', -side, IT, IB],
    ] as const) {
      const n: V3 = [nx, 0, 0];
      if (P.facing(n)) faces.push({ d: pathOf([...A, ...[...B].reverse()]), kind, light: P.lambert(n) });
    }
    if (P.facing(out)) {
      // An L-shaped parting line: the housing's cover, along the lower third and down its back edge.
      const run = S.filter((q) => q.q > 0.035 && q.q < HOUSING - 0.03);
      const end = run[run.length - 1];
      seams.push(
        pathOf(
          [...run.map((q) => corner(q, 1.02, -0.42)), corner(end, 1.02, 0.78)],
          false,
        ),
      );
    }
    temples.push(faces);
  }

  // Display plane: tangent to the wrapped lens at the region centre.
  const c3: V3 = [DISPLAY.x, DISPLAY.y, wrap(DISPLAY.x) + LENS_Z + 0.05];
  const u3 = norm([1, 0, -2 * K * DISPLAY.x]);
  const p0 = P.proj(c3);
  const pu = P.proj([c3[0] + u3[0], c3[1] + u3[1], c3[2] + u3[2]]);
  const pv = P.proj([c3[0], c3[1] - 1, c3[2]]);
  const displayNormal = norm([2 * K * DISPLAY.x, 0, 1]);
  const vis = P.facing(displayNormal) ? Math.min(1, Math.max(0, (Math.cos(yaw * DEG) - 0.35) / 0.3)) : 0;

  // Contact shadow on a table just under the rims.
  const yG = -LENS_B - RIM.bottom - 0.6;
  const ellipse = (cz: number, rx: number, rz: number): P2[] => {
    const pts: P2[] = [];
    for (let i = 0; i < 48; i++) {
      const t = (i / 48) * TAU;
      pts.push(P.proj([rx * Math.cos(t), yG, cz + rz * Math.sin(t)]));
    }
    return pts;
  };
  const sh1 = ellipse(-3, 62, 7);
  const sh2 = ellipse(-62, 58, 62);

  const frontPts = rings.flat();
  const backPts = frontPts.map(([x, y]) => [x + depth[0], y + depth[1]] as P2);
  const frontBox = bboxOf([frontPts]);
  return {
    face,
    depth,
    lensR: pathOf(lensRp),
    lensL: pathOf(lensLp),
    holeR: pathOf(flat(FRONT.lensHoleR)),
    holeL: pathOf(flat(FRONT.lensHoleL)),
    pads,
    temples,
    display: { m: [pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]], w: DISPLAY.w, h: DISPLAY.h, visible: vis },
    shadow: [pathOf(sh2), pathOf(sh1)],
    box: bboxOf([frontPts, backPts, allTemplePts, sh1]),
    frontBox,
    lensRBox: bboxOf([lensRp]),
    lensLBox: bboxOf([lensLp]),
    displayAt: p0,
    seams,
    ...(tether ? { tether: buildTether(P, tipEnd, yG) } : {}),
  };
}

/* ------------------------------------------------------------------ tether: cable + controller box */

/** The controller box, mm: centre on the table, footprint, height, corner radius, turn about y (degrees).
 *  The turn keeps the port face toward the camera in all three views. Original form: a flat, matte slab. */
const BOX = { x: 118, z: -50, w: 60, d: 37, h: 12, r: 6.5, turn: 41, lid: 2.6 } as const;
const CABLE_W = 3.1;

function cubic3(p0: V3, p1: V3, p2: V3, p3: V3, n: number): V3[] {
  const out: V3[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const at = (k: 0 | 1 | 2): number => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k];
    out.push([at(0), at(1), at(2)]);
  }
  return out;
}

/** Convex hull (monotone chain). */
function hull(pts: readonly P2[]): P2[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P2, a: P2, b: P2): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: P2[]): P2[] => {
    const out: P2[] = [];
    for (const q of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...half(p), ...half([...p].reverse())];
}

function buildTether(P: Projector, tipEnd: readonly V3[], yG: number): Tether {
  const a = BOX.turn * DEG;
  const ex: V3 = [Math.cos(a), 0, -Math.sin(a)]; // box long axis
  const ez: V3 = [Math.sin(a), 0, Math.cos(a)]; // port-face normal
  const W = (lx: number, ly: number, lz: number): V3 => [BOX.x + lx * ex[0] + lz * ez[0], yG + ly, BOX.z + lx * ex[2] + lz * ez[2]];

  const slab = (x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, r: number): { s: Slab; pts: P2[]; right: P2 } => {
    const ring = roundedRect(x0, z0, x1, z1, r);
    const top = ring.map(([lx, lz]) => P.proj(W(lx, y1, lz)));
    const bot = ring.map(([lx, lz]) => P.proj(W(lx, y0, lz)));
    const sides: Face[] = [];
    const cx = (x0 + x1) / 2;
    const cz = (z0 + z1) / 2;
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      const [ax, az] = ring[i];
      const [bx, bz] = ring[j];
      if (Math.hypot(bx - ax, bz - az) < 1e-6) continue;
      let nx = bz - az;
      let nz = -(bx - ax);
      if (nx * ((ax + bx) / 2 - cx) + nz * ((az + bz) / 2 - cz) < 0) {
        nx = -nx;
        nz = -nz;
      }
      const n = norm([nx * ex[0] + nz * ez[0], 0, nx * ex[2] + nz * ez[2]]);
      if (!P.facing(n)) continue;
      sides.push({ d: pathOf([top[i], top[j], bot[j], bot[i]]), kind: 'outer', light: P.lambert(n) });
    }
    const right = top.reduce((m, p) => (p[0] > m[0] ? p : m), top[0]);
    return { s: { hull: pathOf(hull([...top, ...bot])), top: pathOf(top), topLight: P.lambert([0, 1, 0]), sides }, pts: [...top, ...bot], right };
  };

  const { w, d, h, r, lid } = BOX;
  const box = slab(-w / 2, -d / 2, w / 2, d / 2, 0, h, r);
  const body = slab(-w / 2, -d / 2, w / 2, d / 2, 0, h - lid, r);
  const lidS = slab(-w / 2, -d / 2, w / 2, d / 2, h - lid, h, r);
  // Internal modules, inset in the body: control (the larger board) below, word timing above it.
  const control = slab(-w * 0.38, -d * 0.35, w * 0.38, d * 0.35, h - lid - 2.8, h - lid, 3);
  const timing = slab(-w * 0.3, -d * 0.28, w * 0.18, d * 0.28, h - lid - 2.8, h - lid, 2.4);

  // Ports: openings on the front face, only when it faces the camera.
  const front: V3 = ez;
  const ports: string[] = [];
  if (P.facing(front)) {
    const onFace = (pts: readonly P2[]): string => pathOf(pts.map(([lx, ly]) => P.proj(W(lx, ly, d / 2 + 0.05))));
    const py = (h - lid) * 0.5;
    ports.push(onFace(roundedRect(-18, py - 1.5, -9.4, py + 1.5, 1.45)));
    ports.push(onFace(roundedRect(-6.4, py - 1.5, 2.2, py + 1.5, 1.45)));
    const jack: P2[] = [];
    for (let i = 0; i < 24; i++) jack.push([10 + 1.75 * Math.cos((i / 24) * TAU), py + 1.75 * Math.sin((i / 24) * TAU)]);
    ports.push(onFace(jack));
  }

  // Cable: out of the temple end along its line, a gravity drop to the table, a lazy S along it, into the back port.
  const T = tipEnd[tipEnd.length - 1];
  const Tp = tipEnd[0];
  const tan = norm([T[0] - Tp[0], T[1] - Tp[1], T[2] - Tp[2]]);
  const rc = CABLE_W / 2;
  const bootEnd: V3 = [T[0] + tan[0] * 8, T[1] + tan[1] * 8, T[2] + tan[2] * 8];
  // One smooth chain: fall along the temple's line, touch the table a little outboard, swing forward along it,
  // straighten behind the box, rise into the back port. Matching tangents at each joint: no kinks or hooks.
  const port = W(0, (h - lid) * 0.5, -d / 2);
  const before = W(0, rc, -d / 2 - 14);
  const land: V3 = [T[0] + 15, yG + rc, T[2] + 4];
  const dir = norm([before[0] - ez[0] * 20 - land[0], 0, before[2] - ez[2] * 20 - land[2]]);
  const along = (p: V3, v: V3, k: number): V3 => [p[0] + v[0] * k, p[1] + v[1] * k, p[2] + v[2] * k];
  const toBefore = [
    T,
    bootEnd,
    ...cubic3(bootEnd, along(bootEnd, tan, 9), along(land, dir, -11), land, 16),
    ...cubic3(land, along(land, dir, 18), along(before, ez, -22), before, 24),
  ];
  const pts3: V3[] = [...toBefore, ...cubic3(before, along(before, ez, 6), [port[0] - ez[0] * 5, port[1], port[2] - ez[2] * 5], port, 6)];
  const plugEnd = toBefore[toBefore.length - 1];
  const plugStart = along(plugEnd, ez, -6);
  const cable2 = pts3.map(P.proj);
  const boot2 = [T, bootEnd].map(P.proj);

  // Contact shadow: the footprint, grown, on the table.
  const sh = roundedRect(-w / 2 - 3, -d / 2 - 3, w / 2 + 3, d / 2 + 3, r + 3).map(([lx, lz]) => P.proj(W(lx, 0, lz)));

  const o = P.proj(W(0, 0, 0));
  const up = (k: number): P2 => {
    const q = P.proj(W(0, k, 0));
    return [q[0] - o[0], q[1] - o[1]];
  };
  const lift = { timing: up(-15), control: up(-30), body: up(-46) };
  const shift = (pts: readonly P2[], v: P2): P2[] => pts.map(([x, y]) => [x + v[0], y + v[1]] as P2);
  const restPts = [...box.pts, ...cable2, ...sh];
  return {
    cable: pathOf(cable2, false),
    boot: pathOf(boot2, false),
    cableOpen: pathOf(toBefore.slice(0, -1).map(P.proj), false),
    plug: pathOf([plugStart, plugEnd].map(P.proj), false),
    width: CABLE_W,
    bootWidth: CABLE_W * 1.55,
    box: box.s,
    ports,
    shadow: pathOf(sh),
    body: body.s,
    lid: lidS.s,
    modules: { timing: timing.s, control: control.s },
    lift,
    moduleEnd: { timing: timing.right, control: control.right },
    bounds: bboxOf([restPts]),
    explodedBounds: bboxOf([restPts, shift(body.pts, lift.body), shift(timing.pts, lift.timing), shift(control.pts, lift.control)]),
  };
}
