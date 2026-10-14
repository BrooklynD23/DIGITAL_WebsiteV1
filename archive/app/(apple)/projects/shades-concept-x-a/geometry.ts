/**
 * SHADES Concept X anatomy: world model and every static path, computed once on the server.
 * World units are millimetres: x across the frame (wearer's right = +x), y forward (lenses face +y, temples run
 * to −y), z up from the bench. The camera sits front-right (azimuth 45°, elevation 30°). Sizes follow the Notion
 * targets (frame 144 mm, controller 70 × 140 × 10 mm); the optics are drawn to read, not to scale.
 *
 * Every drawn item is one depth-sortable piece with its true shape recorded (`shapes`, `routes`), so the skill's
 * audit (design-lab/shades-concept/round4/concept-x/v2/audit.mjs) can prove clearances, supports and painter's
 * order. Pieces move per pose by a 2D translate (the projection is linear): taking it apart lifts pieces along +z.
 * Each pose has its own camera (a CSS transform) so the object fills the card in every pose.
 */
import { PARTS, type Layout } from '../../_content/shades-concept-x';
import {
  boundsOfSvg,
  dotsSvg,
  fadedSvg,
  fitProjection,
  iso,
  lineSvg,
  loft,
  pathOf,
  radialTicks,
  ringSeam,
  rrRing,
  solidSvg,
  viewDir,
  worldOf,
  type Axis,
  type Faded,
  type Flat,
  type Plane,
  type Point3,
  type Projection,
  type SolidPaths,
} from './iso-kit';
import * as lathe from './kit/lathe.mjs';
import * as tubes from './kit/tube.mjs';

/* The skill kit (kit/*.mjs, copied verbatim) is plain ESM; these are the calls used here, with their real types. */
type Frame = { readonly o: Point3; readonly a: Point3; readonly u: Point3; readonly v: Point3 };
interface TubePiece {
  readonly mid: Point3;
  readonly points: Point3[];
  readonly radii: number[];
}
const G = lathe as unknown as {
  frameOf(o: Point3, a: Point3, u: Point3, v: Point3): Frame;
  solidOf(profile: number[][], F: Frame, P: Projection, options?: object): SolidPaths;
  disc(s0: number, s1: number, r: number, F: Frame, P: Projection, options?: object): SolidPaths;
  ringBand(s0: number, s1: number, rIn: number, rOut: number, F: Frame, P: Projection, options?: object): SolidPaths;
  sphereOf(centre: Point3, r: number, P: Projection, options?: object): SolidPaths;
  arcOf(F: Frame, s: number, r: number, P: Projection, options?: object): string;
  circleOf(F: Frame, s: number, r: number, P: Projection, steps?: number): string;
  ribsOf(F: Frame, s0: number, s1: number, r: number, count: number, P: Projection, options?: object): Faded[];
  fillet(points: Point3[], radius: number, perArc?: number, options?: object): Point3[];
  add3(a: Point3, b: Point3): Point3;
  dot3(a: Point3, b: Point3): number;
};
const tubePieces = tubes.tubePieces as unknown as (points: Point3[], radius: number, P: Projection, options?: object) => TubePiece[];
const tubeSvg = tubes.tubeSvg as unknown as (piece: TubePiece, options?: object) => string;

export type Pose = 'pa' | 'pe' | 'xa' | 'xe';
export const POSES: readonly Pose[] = ['pa', 'pe', 'xa', 'xe'];
const layoutOf = (pose: Pose): Layout => (pose[0] === 'p' ? 'planned' : 'potential');
const explodedOf = (pose: Pose) => pose[1] === 'e';

/** A recorded shape, in world units, for the audit. Plain data: the audit script maps it onto `kit/audit.mjs`. */
export type Shape =
  | { readonly k: 'extruded'; readonly ring: Plane[]; readonly z: number; readonly h: number; readonly cut?: Shape[] }
  | { readonly k: 'prism'; readonly axis: Axis; readonly polygon: Plane[]; readonly s0: number; readonly s1: number; readonly cut?: Shape[] }
  | { readonly k: 'solid'; readonly o: Point3; readonly a: Point3; readonly profile: number[][] }
  | { readonly k: 'disc'; readonly o: Point3; readonly a: Point3; readonly s0: number; readonly s1: number; readonly r: number }
  | { readonly k: 'tube'; readonly points: Point3[]; readonly radii: number[] };

export interface Route {
  readonly name: string;
  readonly part: string;
  readonly lift: number;
  readonly points: Point3[];
  readonly r: number;
  readonly gaps: [number, number][];
  readonly limp: boolean;
  /** Ends meant to come off their mount when taken apart. */
  readonly free: readonly [boolean, boolean];
}

/** One drawn, depth-sortable item. */
export interface Item {
  readonly name: string;
  readonly part: string;
  readonly only?: Layout;
  readonly ti?: boolean;
  readonly lift: number;
  /** World reference point for the natural depth key; `bias` nudges ties. */
  readonly at: Point3;
  readonly bias: number;
  readonly svg: string;
  readonly shapes: Shape[];
  readonly ground?: boolean;
  readonly route?: string;
  readonly chunk?: number;
  readonly cls?: string;
  /** Drawn at home, placed by this world offset (added to every pose translate). */
  readonly shift?: Point3;
}

/* ------------------------------------------------------------------ world layout */

const RIM_Y = [0, 5] as const;
const EYE_L = { outer: [2, 8, 66, 42, 9], hole: [8, 13, 60, 37, 5] } as const;
const EYE_R = { outer: [78, 8, 142, 42, 9], hole: [84, 13, 136, 37, 5] } as const;
const POD = { x0: 90, y0: -18, x1: 134, y1: 6, z0: 42, z1: 53, wall: 1.5 } as const;
const CASE = { x0: 175, y0: -50, x1: 245, y1: 90, r: 9, wall: 2, floor: 2, z1: 7, lid: 3 } as const;
const DIAL = { x: 218, y: -22, r: 12.2 } as const;
const SOCKET = { y: -30, z: 3.5 } as const;
/** Where the controller sits: drawn at CASE, moved back and right of the frame by this offset. */
const CTRL: Point3 = [45, -60, 0];
/** The wearer's eye, behind the right lens: context, not a part. */
export const EYE: Point3 = [111, -58, 20];

/** Lifts for the exploded pose (mm, +z). One axis only. */
const L = {
  /* The card has room above: the stack opens tall enough that each layer reads on its own. */
  hinge: 19,
  screwHinge: 35,
  bridge: 29,
  pads: 14,
  combiner: 22,
  splitter: 45,
  cage: 67,
  podBody: 80,
  display: 99,
  boardPod: 118,
  boardTemple: 38,
  pod: 144,
  latch: 160,
  /* The controller's boards and battery rise as one layer; chips lift off the processing board. */
  battery: 35,
  carrier: 35,
  proc: 35,
  ctrl: 35,
  chip: 54,
  /* Low enough that the lifted lid stays clear of the temple plug on screen. */
  lid: 72,
  controls: 88,
  screwLid: 99,
} as const;

/* ------------------------------------------------------------------ builders */

interface Scope {
  readonly P: Projection;
  readonly items: Item[];
  readonly routes: Route[];
  /** World offset for everything this scope puts (the controller is drawn at home and shifted into place). */
  readonly shift?: Point3;
}

const r2 = (v: number) => Math.round(v * 100) / 100;
const solid = (paths: SolidPaths, tone: 'hi' | 'mid' | 'lo' = 'hi', inner = '', cls?: string) => solidSvg(paths, { tone, inner, className: cls });
const pts = (list: Point3[], P: Projection) => list.map((p) => iso(p, P));

type ItemSpec = Omit<Item, 'bias' | 'shapes'> & { bias?: number; shapes?: Shape[] };
const add = (a: Point3, b: Point3): Point3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function shifted(s: Shape, d: Point3): Shape {
  const cut = 'cut' in s && s.cut ? { cut: s.cut.map((c) => shifted(c, d)) } : {};
  if (s.k === 'extruded') return { ...s, ring: s.ring.map(([x, y]) => [x + d[0], y + d[1]] as Plane), ...cut };
  if (s.k === 'prism') {
    const [du, dv, ds] = s.axis === 'x' ? [d[1], d[2], d[0]] : s.axis === 'y' ? [d[0], d[2], d[1]] : [d[0], d[1], d[2]];
    return { ...s, polygon: s.polygon.map(([u, v]) => [u + du, v + dv] as Plane), s0: s.s0 + ds, s1: s.s1 + ds, ...cut };
  }
  if (s.k === 'tube') return { ...s, points: s.points.map((p) => add(p, d)) };
  return { ...s, o: add(s.o, d) };
}
const put = (S: Scope, spec: ItemSpec) => {
  const item: Item = { bias: 0, shapes: [], ...spec };
  S.items.push(S.shift ? { ...item, at: add(item.at, S.shift), shapes: item.shapes.map((sh) => shifted(sh, S.shift!)), shift: S.shift } : item);
};

type Rect = readonly [number, number, number, number, number];

/** Loft of a rounded rectangle [u0, v0, u1, v1, r] along an axis from s0 to s1, chamfer `c` on the s1 face. */
function slabAlong(axis: Axis, rect: Rect, s0: number, s1: number, P: Projection, { c = 0.6, hole, walls, caps }: { c?: number; hole?: Rect; walls?: boolean[]; caps?: boolean } = {}) {
  const [u0, v0, u1, v1, r] = rect;
  const n = cornerSteps(r);
  const m = hole ? cornerSteps(hole[4]) : 0;
  const ringAt = (o: number) => [rrRing(u0 + o, v0 + o, u1 - o, v1 - o, r - o, n), ...(hole ? [rrRing(hole[0] - o, hole[1] - o, hole[2] + o, hole[3] + o, hole[4] + o, m)] : [])];
  const stations = c > 0 ? [{ s: s0, rings: ringAt(0) }, { s: s1 - c, rings: ringAt(0) }, { s: s1, rings: ringAt(c) }] : [{ s: s0, rings: ringAt(0) }, { s: s1, rings: ringAt(0) }];
  return loft(axis, stations, P, hole ? [false, true] : [], { walls, caps });
}

/**
 * An open box (case, pod body) as two items, so what sits inside paints between them: the floor and the far
 * walls behind, the near walls and the rim in front.
 */
function openBox(S: Scope, name: string, part: string, outer: Rect, cavity: Rect, z0: number, floor: number, z1: number, lift: number, c: number, under = '') {
  const { P } = S;
  const floorRing = rrRing(cavity[0], cavity[1], cavity[2], cavity[3], cavity[4], cornerSteps(cavity[4]));
  const { near, far } = wallBands(outer, cavity);
  const ground = lift === 0 && z0 === 0;
  put(S, {
    name, part, lift, at: centreOf(outer, 'z', z0), bias: -20, ground,
    svg: under + solid(loft('z', [{ s: z0, rings: [floorRing] }, { s: floor, rings: [floorRing] }], P), 'lo') + solid(slabAlong('z', outer, z0, z1, P, { c, hole: cavity, walls: [false, true], caps: false }), 'lo'),
    shapes: [{ k: 'extruded', ring: floorRing, z: z0, h: floor - z0 }, { k: 'extruded', ring: far, z: z0, h: z1 - z0 }],
  });
  put(S, {
    name: `${name}Front`, part, lift, at: [outer[2], outer[3], z1], bias: 20, ground,
    svg: solid(slabAlong('z', outer, z0, z1, P, { c, hole: cavity, walls: [true, false] })),
    shapes: [{ k: 'extruded', ring: near, z: z0, h: z1 - z0 }],
  });
}

/** The wall band between two rounded plans, split into the half facing the camera (normals −45°…135°) and the rest. */
function wallBands(outer: Rect, inner: Rect) {
  const half = (rect: Rect, near: boolean) => {
    const n = cornerSteps(rect[4]);
    const ring = rrRing(rect[0], rect[1], rect[2], rect[3], rect[4], n);
    const angle = (i: number) => -90 + Math.floor(i / (n + 1)) * 90 + ((i % (n + 1)) * 90) / n;
    const keep = ring.map((_, i) => angle(i)).map((a) => (near ? a >= -45 && a <= 135 : a >= 135 || a <= -45));
    const start = keep.findIndex((k, i) => k && !keep[(i - 1 + ring.length) % ring.length]);
    const out: Plane[] = [];
    for (let i = 0; i < ring.length; i++) {
      const j = (start + i) % ring.length;
      if (keep[j]) out.push(ring[j]);
    }
    return out;
  };
  const band = (near: boolean) => [...half(outer, near), ...half(inner, near).reverse()];
  return { near: band(true), far: band(false) };
}
/** Points per rounded corner: fewer on small radii. */
const cornerSteps = (r: number) => (r < 0.8 ? 1 : r < 2 ? 3 : r < 5 ? 4 : 6);
/** The recorded shape of `slabAlong`. */
function slabShape(axis: Axis, rect: Rect, s0: number, s1: number, hole?: Rect): Shape {
  const [u0, v0, u1, v1, r] = rect;
  const polygon = rrRing(u0, v0, u1, v1, r, cornerSteps(r));
  const cut = hole ? [{ k: 'prism', axis, polygon: rrRing(hole[0], hole[1], hole[2], hole[3], hole[4], cornerSteps(hole[4])), s0: s0 - 1, s1: s1 + 1 } as Shape] : undefined;
  return axis === 'z' ? { k: 'extruded', ring: polygon, z: s0, h: s1 - s0, cut } : { k: 'prism', axis, polygon, s0, s1, cut };
}
const box = (x0: number, y0: number, x1: number, y1: number, r: number): Rect => [x0, y0, x1, y1, r];

const frameZ = (x: number, y: number, z: number) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const centreOf = (rect: Rect, axis: Axis, s: number): Point3 => worldOf(axis, [(rect[0] + rect[2]) / 2, (rect[1] + rect[3]) / 2], s);

/** A turned part standing on z at (x, y), profile in [s, r] from z. */
function turnedZ(x: number, y: number, z: number, profile: number[][], P: Projection, tone: 'hi' | 'mid' = 'hi', inner = '', steps = 16) {
  return { svg: solid(G.solidOf(profile, frameZ(x, y, z), P, { steps, smooth: { rows: 2 } }), tone, inner), shape: { k: 'solid', o: [x, y, z], a: [0, 0, 1], profile } as Shape };
}

const cornersOf = (x0: number, y0: number, x1: number, y1: number, inset: number): Plane[] => [
  [x0 + inset, y0 + inset],
  [x1 - inset, y0 + inset],
  [x0 + inset, y1 - inset],
  [x1 - inset, y1 - inset],
];

function tube(S: Scope, name: string, part: string, route: Point3[], r: number, lift: number, { only, ti, gaps = [], maxLength = 18, tone = 'mid', limp = true, free = [false, false] }: { only?: Layout; ti?: boolean; gaps?: [number, number][]; maxLength?: number; tone?: 'hi' | 'mid'; limp?: boolean; free?: readonly [boolean, boolean] } = {}) {
  S.routes.push({ name, part, lift, points: route, r, gaps, limp, free });
  const pieces = tubePieces(route, r, S.P, { maxLength, spacing: 1, gaps });
  pieces.forEach((piece, index) =>
    put(S, { name: `${name}:${index}`, part, only, ti, lift, at: piece.mid, svg: tubeSvg(piece, { tone }), route: name, chunk: index, shapes: [{ k: 'tube', points: piece.points, radii: piece.radii }] }),
  );
}

/* ------------------------------------------------------------------ the frame */

/** Temple side profile in (y, z): from the hinge back, straight arm, ear bend, flat tip that seats the plug. */
const TEMPLE: Plane[] = [
  [-9, 33], [-110, 33], [-121, 30], [-131, 23], [-137, 16], [-142, 16], [-139, 21], [-133, 29], [-124, 36], [-112, 39], [-9, 39],
];

function temple(S: Scope, name: string, x0: number, x1: number) {
  const { P } = S;
  const paths = loft('x', [{ s: x0, rings: [TEMPLE] }, { s: x1, rings: [TEMPLE] }], P);
  /* The tip sleeve begins at y = −112: one seam over the outer face and the top, edge to edge. */
  const seam = lineSvg(pathOf(pts([[x1, -110, 33], [x1, -112, 39], [x0, -112, 39]], P)), { tone: 'lo' });
  put(S, { name, part: 'temple', lift: 0, at: [(x0 + x1) / 2, -70, 36], svg: solid(paths, 'hi', seam), shapes: [{ k: 'prism', axis: 'x', polygon: TEMPLE, s0: x0, s1: x1 }] });
}

function hinge(S: Scope, side: 'L' | 'R', x0: number, barrelX: number) {
  const { P } = S;
  const block = box(x0, -9, x0 + 6, 0, 1);
  put(S, { name: `hinge${side}`, part: 'hinge', ti: true, lift: L.hinge, at: centreOf(block, 'z', 35.5), svg: solid(slabAlong('z', block, 31, 40, P, { c: 0.5 })), shapes: [slabShape('z', block, 31, 40)] });
  const F = frameZ(barrelX, -5, 30.5);
  const seams = [3.4, 6.6].map((s) => G.arcOf(F, s, 1.6, P)).join('');
  put(S, {
    name: `barrel${side}`, part: 'hinge', ti: true, lift: L.hinge, at: [barrelX, -5, 35.5], bias: 0.3,
    svg: solid(G.disc(0, 10, 1.6, F, P, { steps: 16 }), 'hi', lineSvg(seams, { tone: 'lo' })),
    shapes: [{ k: 'disc', o: [barrelX, -5, 30.5], a: [0, 0, 1], s0: 0, s1: 10, r: 1.6 }],
  });
  const head = turnedZ(barrelX, -5, 40.5, [[0, 1.5], [0.4, 1.5], [0.8, 1.1, 1], [1.05, 0]], P);
  put(S, { name: `screwHinge${side}`, part: 'screws', only: 'potential', lift: L.screwHinge, at: [barrelX, -5, 41], bias: 0.4, svg: head.svg, shapes: [head.shape] });
}

function frame(S: Scope) {
  const { P } = S;
  temple(S, 'templeL', -1, 2);
  hinge(S, 'L', -1, -2.6);

  const eye = G.sphereOf(EYE, 10, P, { steps: 32 });
  const pupil = G.frameOf(G.add3(EYE, [0, 10, 0]), [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  put(S, { name: 'eye', part: 'eye', lift: 0, at: EYE, bias: -40, cls: 'cx-eye', svg: solid(eye, 'lo') + lineSvg(G.circleOf(pupil, 0, 3.6, P, 32), { tone: 'mid' }) });

  /* Nose pads on titanium arms, in the gap between the eye rims. */
  for (const [name, armX, padX] of [['padL', 63, 67.2], ['padR', 81, 74.4]] as const) {
    const profile = [[0, 0], [0.5, 2.3, 1], [1.2, 3, 1], [1.9, 2.3, 1], [2.4, 0]];
    const padF = G.frameOf([padX, -6, 17], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    /* A pad on a push-in holder: the holder's flat end seats on the post. */
    const holder = frameZ(padX + 1.2, -6, 12.9);
    put(S, {
      name, part: 'bridge', lift: L.pads, at: [padX + 1.2, -6, 16], bias: 0.2,
      svg: solid(G.disc(0, 1.3, 0.9, holder, P, { steps: 12 }), 'mid') + solid(G.solidOf(profile, padF, P, { steps: 20, smooth: { rows: 2 } }), 'mid'),
      shapes: [{ k: 'solid', o: [padX, -6, 17], a: [1, 0, 0], profile }, { k: 'disc', o: [padX + 1.2, -6, 12.9], a: [0, 0, 1], s0: 0, s1: 1.3, r: 0.9 }],
    });
    /* The post rises from below, so the pad pushes off it straight up when taken apart. */
    const route = G.fillet([[armX, 0, 11.5], [armX, -4, 11], [padX + 1.2, -6, 9.5], [padX + 1.2, -6, 12.9]], 1.6, 7, { P, tube: 0.6 });
    tube(S, `${name}Arm`, 'bridge', route, 0.6, 0, { ti: true, maxLength: 40, limp: false, free: [false, true] });
  }

  /* Lenses sit inside the rims; the hole walls hide their edges. */
  for (const [name, eyeRim] of [['lensL', EYE_L], ['lensR', EYE_R]] as const) {
    const [u0, v0, u1, v1, r] = eyeRim.hole;
    const face = pts(rrRing(u0, v0, u1, v1, r).map((p) => worldOf('y', p, 2.8)), P);
    const streak = (a: number, b: number) => lineSvg(pathOf(pts([[u0 + a, 2.8, v1], [u0 + b, 2.8, v0]], P)), { tone: 'faint', className: 'cx-streak' });
    put(S, {
      name, part: 'lens', lift: 0, at: [(u0 + u1) / 2, 2.5, (v0 + v1) / 2], bias: -2,
      svg: `<path class="cx-lens-face" d="${pathOf(face, true)}"/>` + streak(30, 16) + streak(38, 26),
      shapes: [{ k: 'prism', axis: 'y', polygon: rrRing(u0, v0, u1, v1, r), s0: 2.2, s1: 2.8 }],
    });
  }

  for (const [name, eyeRim] of [['rimL', EYE_L], ['rimR', EYE_R]] as const) {
    put(S, {
      name, part: 'rim', lift: 0, at: centreOf(eyeRim.outer, 'y', 2.5), ground: true,
      svg: solid(slabAlong('y', eyeRim.outer, RIM_Y[0], RIM_Y[1], P, { c: 0.8, hole: eyeRim.hole })),
      shapes: [slabShape('y', eyeRim.outer, RIM_Y[0], RIM_Y[1], eyeRim.hole)],
    });
  }

  const bridge = box(66, 29, 78, 34, 1);
  put(S, { name: 'bridge', part: 'bridge', ti: true, lift: L.bridge, at: centreOf(bridge, 'y', 2.5), bias: 0.5, svg: solid(slabAlong('y', bridge, 0.6, 4.4, P, { c: 0.4 })), shapes: [slabShape('y', bridge, 0.6, 4.4)] });

  hinge(S, 'R', 139, 146.6);
  temple(S, 'templeR', 142, 145);
  const tb = box(-78, 34, -40, 38, 0.6);
  const chip = box(-64, 34.8, -56, 37.2, 0.3);
  put(S, {
    name: 'boardTemple', part: 'dispboard', only: 'planned', lift: L.boardTemple, at: centreOf(tb, 'x', 145.6),
    svg: solid(slabAlong('x', tb, 145, 146.2, P, { c: 0.2 }), 'mid', '', 'cx-pcb') + solid(slabAlong('x', chip, 146.2, 147, P, { c: 0.2 })),
    shapes: [slabShape('x', tb, 145, 146.2), slabShape('x', chip, 146.2, 147)],
  });
}

/* ------------------------------------------------------------------ the optics pod */

const CAGE_RECT = box(-16, 14, -1, 42, 2);
const CAGE_HOLE = box(-13, 18, -4, 38, 1.5);
const DISPLAY = box(100, -16, 122, -8, 1);
const BOARD = box(94, -15, 130, 3, 1.2);
const BRIDGE_CHIP = box(108, -15, 114, -9, 0.4);
const POD_CONN = box(122, -12, 128, -4, 0.4);
/** Where the pod lid meets the pod body. */
const POD_SPLIT = 46.5;

/** Splitter: a 0.8 mm plate at 45° in (y, z). Combiner: a curved plate, concave toward the eye. */
const SPLITTER: Plane[] = [[-5, 21], [-14, 30], [-14.57, 29.43], [-5.57, 20.43]];
const COMBINER: Plane[] = (() => {
  const front: Plane[] = [];
  const back: Plane[] = [];
  for (let i = 0; i <= 12; i++) {
    const z = 16 + (24 * i) / 12;
    const sag = 1.4 * (1 - ((z - 28) / 12) ** 2);
    front.push([-1.6 - sag, z]);
    back.push([-2.4 - sag, z]);
  }
  return [...front, ...back.reverse()];
})();

function pod(S: Scope, cutaway = false) {
  const { P } = S;
  const cage = (name: string, x0: number) =>
    put(S, {
      name, part: 'pod', lift: L.cage, at: [x0 + 0.75, -8.5, 28], bias: name === 'cageR' ? 0.8 : -0.8,
      svg: solid(slabAlong('x', CAGE_RECT, x0, x0 + 1.5, P, { c: 0.3, hole: CAGE_HOLE })),
      shapes: [slabShape('x', CAGE_RECT, x0, x0 + 1.5, CAGE_HOLE)],
    });
  cage('cageL', 90);
  put(S, {
    name: 'splitter', part: 'splitter', lift: L.splitter, at: [111, -9.5, 25.5],
    svg: solid(loft('x', [{ s: 91.5, rings: [SPLITTER] }, { s: 132.5, rings: [SPLITTER] }], P), 'mid', '', 'cx-glass'),
    shapes: [{ k: 'prism', axis: 'x', polygon: SPLITTER, s0: 91.5, s1: 132.5 }],
  });
  put(S, {
    name: 'combiner', part: 'combiner', lift: L.combiner, at: [111, -2.6, 28], bias: 0.3,
    svg: solid(loft('x', [{ s: 91.5, rings: [COMBINER] }, { s: 132.5, rings: [COMBINER] }], P), 'mid', '', 'cx-glass'),
    shapes: [{ k: 'prism', axis: 'x', polygon: COMBINER, s0: 91.5, s1: 132.5 }],
  });
  if (!cutaway) cage('cageR', 132.5);

  const floor = POD.z0 + POD.wall;
  put(S, {
    name: 'display', part: 'display', lift: L.display, at: centreOf(DISPLAY, 'z', floor + 1.2),
    svg: solid(slabAlong('z', DISPLAY, floor, floor + 2.4, P, { c: 0.3 })),
    shapes: [slabShape('z', DISPLAY, floor, floor + 2.4)],
  });
  const top = 48.5;
  const standoffs = cornersOf(BOARD[0], BOARD[1], BOARD[2], BOARD[3], 2.5);
  put(S, {
    name: 'boardPod', part: 'dispboard', only: 'potential', lift: L.boardPod, at: centreOf(BOARD, 'z', top + 0.7),
    svg:
      standoffs.map(([x, y]) => solid(G.disc(0, top - floor, 1, frameZ(x, y, floor), P, { steps: 12 }), 'mid')).join('') +
      solid(slabAlong('z', BOARD, top, top + 1.4, P, { c: 0.2 }), 'mid', '', 'cx-pcb') +
      solid(slabAlong('z', BRIDGE_CHIP, top + 1.4, top + 2.6, P, { c: 0.25 })) +
      solid(slabAlong('z', POD_CONN, top + 1.4, top + 2.8, P, { c: 0.25 }), 'hi', '', 'cx-black') +
      dotsSvg(pts(standoffs.map(([x, y]) => [x, y, top + 1.4]), P), { size: 0.7, tone: 'hi' }),
    shapes: [
      ...standoffs.map(([x, y]) => ({ k: 'disc', o: [x, y, floor], a: [0, 0, 1], s0: 0, s1: top - floor, r: 1 }) as Shape),
      slabShape('z', BOARD, top, top + 1.4),
      slabShape('z', BRIDGE_CHIP, top + 1.4, top + 2.6),
      slabShape('z', POD_CONN, top + 1.4, top + 2.8),
    ],
  });

  const outer = box(POD.x0, POD.y0, POD.x1, POD.y1, 4);
  if (cutaway) {
    /* The housing cut open: the floor (with the light aperture), the left wall and the back wall. */
    const aperture = box(102, -15, 120, -9, 1);
    put(S, { name: 'podFloor', part: 'pod', lift: 0, at: centreOf(outer, 'z', POD.z0), bias: -6, svg: solid(slabAlong('z', outer, POD.z0, floor, P, { c: 0, hole: aperture })) });
    put(S, { name: 'podBack', part: 'pod', lift: 0, at: [112, POD.y0, 47], bias: -8, svg: solid(slabAlong('y', box(POD.x0, floor, POD.x1, POD.z1, 1), POD.y0, POD.y0 + POD.wall, P, { c: 0 })) });
    put(S, { name: 'podLeft', part: 'pod', lift: 0, at: [POD.x0, -6, 47], bias: -8, svg: solid(slabAlong('x', box(POD.y0 + POD.wall, floor, POD.y1, POD.z1, 1), POD.x0, POD.x0 + POD.wall, P, { c: 0 })) });
    return;
  }

  /* The housing: a body that holds the optics and a lid over the board, matte black, joined at z = SPLIT. */
  const inner = box(POD.x0 + POD.wall, POD.y0 + POD.wall, POD.x1 - POD.wall, POD.y1 - POD.wall, 2.5);
  openBox(S, 'podBody', 'pod', outer, inner, POD.z0, floor, POD_SPLIT, L.podBody, 0);
  const vents = [0, 1, 2, 3].map((i) => pathOf(pts(rrRing(-14 + i * 3.4, 48, -12.6 + i * 3.4, 51.2, 0.7).map((p) => worldOf('x', p, POD.x1)), P), true)).join('');
  put(S, {
    name: 'pod', part: 'pod', lift: L.pod, at: centreOf(outer, 'z', 50),
    svg: solid(slabAlong('z', outer, POD_SPLIT, POD.z1, P, { c: 1 }), 'hi', lineSvg(vents, { tone: 'lo' })),
    shapes: [{ ...(slabShape('z', outer, POD_SPLIT, POD.z1) as Extract<Shape, { k: 'extruded' }>), cut: [slabShape('z', inner, POD_SPLIT - 1, POD.z1 - POD.wall)] }],
  });

  /* The pod release: the one signal-red part, three closed grip grooves. */
  const latch = box(121, -1, 131, 4.5, 1.2);
  const grips = [0, 1, 2].map((i) => pathOf(pts(rrRing(123 + i * 2.4, 0, 124 + i * 2.4, 3.5, 0.4).map(([x, y]) => [x, y, 55.6] as Point3), P), true)).join('');
  put(S, {
    name: 'latch', part: 'latch', only: 'potential', lift: L.latch, at: centreOf(latch, 'z', 54.3),
    svg: solid(slabAlong('z', latch, POD.z1, 55.6, P, { c: 0.5 }), 'hi', '', 'cx-red') + lineSvg(grips, { tone: 'lo', className: 'cx-red-line' }),
    shapes: [slabShape('z', latch, POD.z1, 55.6)],
  });
}

/* ------------------------------------------------------------------ cable and ports */

const CABLE_R = 1.5;
const PLUG = box(141.5, -142.5, 145.5, -135.5, 1.4);
const PLUG_AT: Point3 = [143.5, -139, 8];
const SHELL_X = [246.4, 253] as const;

function link(S: Scope) {
  const { P } = S;
  const bootF = G.frameOf([143.5, -139, 16], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
  const boot = [[0, 3.2], [2.5, 3.1], [5, 2.6, 1], [8, 2.0]];
  put(S, {
    name: 'boot', part: 'port', only: 'planned', lift: 0, at: [143.5, -139, 12],
    svg: solid(G.solidOf(boot, bootF, P, { steps: 20, smooth: { rows: 3 } }), 'mid', lineSvg([2, 4].map((s) => G.arcOf(bootF, s, s < 3 ? 3.12 : 2.8, P)).join(''), { tone: 'lo' })),
    shapes: [{ k: 'solid', o: [143.5, -139, 16], a: [0, 0, -1], profile: boot }],
  });
  const plugRing = rrRing(PLUG[0], PLUG[1], PLUG[2], PLUG[3], PLUG[4]);
  put(S, {
    name: 'plug', part: 'port', only: 'potential', lift: 0, at: [143.5, -139, 12],
    svg: solid(loft('z', [{ s: 8, rings: [rrRing(PLUG[0] + 0.5, PLUG[1] + 0.5, PLUG[2] - 0.5, PLUG[3] - 0.5, 0.9)] }, { s: 8.5, rings: [plugRing] }, { s: 16, rings: [plugRing] }], P), 'hi', lineSvg(ringSeam(plugRing, 12, P), { tone: 'lo' })),
    shapes: [slabShape('z', PLUG, 8, 16)],
  });

  /* The cable drops from the temple tip to the bench, runs behind the controller and into its side. */
  const z = CABLE_R + 0.1;
  const [dx, dy] = CTRL;
  const legs: Point3[] = [PLUG_AT, [143.5, -139, z + 4], [154, -130, z], [SHELL_X[1] + dx + 10, -128, z], [SHELL_X[1] + dx + 14, SOCKET.y + dy, z], [SHELL_X[1] + dx + 6, SOCKET.y + dy, SOCKET.z], [SHELL_X[1] + dx, SOCKET.y + dy, SOCKET.z]];
  tube(S, 'cable', 'cable', G.fillet(legs, 7, 9, { P, tube: CABLE_R }), CABLE_R, 0, { maxLength: 16 });
  socketEnd({ ...S, shift: CTRL });
}

function socketEnd(S: Scope) {
  const { P } = S;
  const shellF = G.frameOf([SHELL_X[0], SOCKET.y, SOCKET.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const shell = [[0, 2.6], [5.2, 2.6], [5.8, 2.2, 1], [SHELL_X[1] - SHELL_X[0], 1.9]];
  put(S, {
    name: 'plugShell', part: 'port', only: 'potential', lift: 0, at: [249.7, SOCKET.y, SOCKET.z], bias: 0.3,
    svg: solid(G.solidOf(shell, shellF, P, { steps: 20, smooth: { rows: 3 } }), 'hi', lineSvg(G.arcOf(shellF, 2.6, 2.6, P), { tone: 'lo' })),
    shapes: [{ k: 'solid', o: [SHELL_X[0], SOCKET.y, SOCKET.z], a: [1, 0, 0], profile: shell }],
  });
  const gland = [[0, 3], [1.4, 3], [2.2, 2.4, 1], [SHELL_X[1] - CASE.x1, 1.8]];
  put(S, {
    name: 'gland', part: 'port', only: 'planned', lift: 0, at: [249.7, SOCKET.y, SOCKET.z], bias: 0.3,
    svg: solid(G.solidOf(gland, G.frameOf([CASE.x1, SOCKET.y, SOCKET.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 20, smooth: { rows: 3 } }), 'mid'),
    shapes: [{ k: 'solid', o: [CASE.x1, SOCKET.y, SOCKET.z], a: [1, 0, 0], profile: gland }],
  });
  const socket = box(SOCKET.y - 4.5, SOCKET.z - 3.2, SOCKET.y + 4.5, SOCKET.z + 3.2, 1.2);
  put(S, {
    name: 'socket', part: 'port', only: 'potential', lift: 0, at: [CASE.x1 + 0.7, SOCKET.y, SOCKET.z], bias: 0.2,
    svg: solid(slabAlong('x', socket, CASE.x1, SHELL_X[0], P, { c: 0.3 }), 'hi', '', 'cx-black'),
    shapes: [slabShape('x', socket, CASE.x1, SHELL_X[0])],
  });
}

/* ------------------------------------------------------------------ the controller */

interface Comp {
  readonly rect: Rect;
  readonly h: number;
  readonly tone: 'hi' | 'mid';
  readonly cls?: string;
}

/** A board on four standoffs, with its parts. */
function board(S: Scope, name: string, part: string, rect: Rect, lift: number, comps: Comp[]) {
  const { P } = S;
  const z0 = CASE.floor + 1.2;
  const top = z0 + 1.2;
  const studs = cornersOf(rect[0], rect[1], rect[2], rect[3], 2.6);
  put(S, {
    name, part, lift, at: centreOf(rect, 'z', z0 + 0.6),
    svg:
      studs.map(([x, y]) => solid(G.disc(0, z0 - CASE.floor, 1, frameZ(x, y, CASE.floor), P, { steps: 12 }), 'mid')).join('') +
      solid(slabAlong('z', rect, z0, top, P, { c: 0.2 }), 'mid', '', 'cx-pcb') +
      comps.map((c) => solid(slabAlong('z', c.rect, top, top + c.h, P, { c: 0.25 }), c.tone, '', c.cls)).join('') +
      dotsSvg(pts(studs.map(([x, y]) => [x, y, top]), P), { size: 0.7, tone: 'hi' }),
    shapes: [
      ...studs.map(([x, y]) => ({ k: 'disc', o: [x, y, CASE.floor], a: [0, 0, 1], s0: 0, s1: z0 - CASE.floor, r: 1 }) as Shape),
      slabShape('z', rect, z0, top),
      ...comps.map((c) => slabShape('z', c.rect, top, top + c.h)),
    ],
  });
}

/** A chip with pins on its two visible edges; each pin ends on a pad dot on the board. */
function chip(S: Scope, name: string, part: string, rect: Rect, z: number, h: number, lift: number, only?: Layout) {
  const { P } = S;
  const [x0, y0, x1, y1] = rect;
  const n = Math.max(4, Math.round((x1 - x0) / 2));
  const legs: string[] = [];
  const pads: Point3[] = [];
  for (let i = 1; i < n; i++) {
    const px = x0 + ((x1 - x0) * i) / n;
    const py = y0 + ((y1 - y0) * i) / n;
    legs.push(pathOf(pts([[px, y1 - 0.4, z + 0.5], [px, y1 + 1.1, z]], P)), pathOf(pts([[x1 - 0.4, py, z + 0.5], [x1 + 1.1, py, z]], P)));
    pads.push([px, y1 + 1.1, z], [x1 + 1.1, py, z]);
  }
  put(S, {
    name, part, only, lift, at: centreOf(rect, 'z', z + h / 2),
    svg: lineSvg(legs.join(''), { tone: 'lo' }) + dotsSvg(pts(pads, P), { size: 0.45, tone: 'mid' }) + solid(slabAlong('z', rect, z, z + h, P, { c: 0.3 })) + dotsSvg([iso([x0 + 2, y1 - 2, z + h], P)], { size: 0.6, tone: 'mid' }),
    shapes: [slabShape('z', rect, z, z + h)],
  });
}

function controller(S: Scope) {
  const { P } = S;
  const { x0, y0, x1, y1, r, wall, floor, z1, lid } = CASE;
  const outer = box(x0, y0, x1, y1, r);
  const cavity = box(x0 + wall, y0 + wall, x1 - wall, y1 - wall, r - wall);
  const haloRing = rrRing(x0 - 3, y0 - 3, x1 + 3, y1 + 3, r + 3);
  const halo = `<path class="iso-halo" d="${pathOf(pts(haloRing.map(([x, y]) => [x, y, 0] as Point3), P), true)}"/>`;
  openBox(S, 'case', 'shell', outer, cavity, 0, floor, z1, 0, 0.6, halo);

  /* Battery: a sled that slides out the front (Concept X) or held under straps (planned). */
  const batt = box(180, 56, 240, 86, 2);
  const battLabel = lineSvg(pathOf(pts(rrRing(186, 62, 206, 72, 1).map(([x, y]) => [x, y, 6.5] as Point3), P), true), { tone: 'lo' });
  const battRules = [65, 68].map((y) => lineSvg(pathOf(pts([[188, y, 6.5], [200, y, 6.5]], P)), { tone: 'faint', free: true })).join('');
  put(S, { name: 'battery', part: 'battery', lift: L.battery, at: centreOf(batt, 'z', 4.2), svg: solid(slabAlong('z', batt, floor, 6.5, P, { c: 0.5 }), 'mid') + battLabel + battRules, shapes: [slabShape('z', batt, floor, 6.5)] });
  for (const y of [61, 79]) {
    const strap = box(178, y, 242, y + 2.4, 0.4);
    put(S, { name: `strap${y}`, part: 'battery', only: 'planned', lift: L.battery, at: centreOf(strap, 'z', 6.7), bias: 0.2, svg: solid(slabAlong('z', strap, 6.5, 6.9, P, { c: 0.1 }), 'mid'), shapes: [slabShape('z', strap, 6.5, 6.9)] });
  }
  const tab = box(196, 1.2, 224, 5.8, 1.5);
  put(S, {
    name: 'sledTab', part: 'battery', only: 'potential', lift: 0, at: [210, y1 + 0.7, 3.5], bias: 0.4,
    svg: solid(slabAlong('y', tab, y1, y1 + 1.4, P, { c: 0.3 }), 'hi', lineSvg(pathOf(pts(rrRing(203, 2.6, 217, 4.4, 0.9).map((p) => worldOf('y', p, y1 + 1.4)), P), true), { tone: 'lo' })),
    shapes: [slabShape('y', tab, y1, y1 + 1.4)],
  });

  /* Three boards on standoffs. */
  board(S, 'carrier', 'carrier', box(180, 36, 240, 53, 1.2), L.carrier, [
    { rect: box(186, 40, 194, 48, 0.8), h: 2.4, tone: 'hi' },
    { rect: box(200, 41, 208, 47, 0.4), h: 1, tone: 'hi' },
    { rect: box(226, 39, 236, 45, 0.4), h: 2, tone: 'hi', cls: 'cx-black' },
  ]);
  board(S, 'proc', 'proc', box(180, 1, 240, 33, 1.2), L.proc, [
    { rect: box(186, 25, 192, 30, 0.3), h: 1, tone: 'mid' },
    { rect: box(196, 26, 200, 29, 0.3), h: 0.9, tone: 'mid' },
  ]);
  const procTop = floor + 2.4;
  chip(S, 'fpga', 'fpga', box(190, 5, 208, 23, 0.6), procTop, 1.6, L.chip);
  chip(S, 'mcu', 'mcu', box(214, 9, 224, 19, 0.4), procTop, 1.2, L.chip);
  const header = box(231, 4, 236, 30, 0.5);
  put(S, {
    name: 'header', part: 'header', only: 'potential', lift: L.chip, at: centreOf(header, 'z', procTop + 1.2),
    svg: solid(slabAlong('z', header, procTop, procTop + 2.4, P, { c: 0.3 }), 'hi', '', 'cx-black') + dotsSvg(pts(Array.from({ length: 8 }, (_, i) => [233.5, 6.5 + i * 3, procTop + 2.4] as Point3), P), { size: 0.55, tone: 'hi' }),
    shapes: [slabShape('z', header, procTop, procTop + 2.4)],
  });
  board(S, 'ctrl', 'ctrlboard', box(184, -46, 240, -4, 1.2), L.ctrl, [{ rect: box(DIAL.x - 6, DIAL.y - 6, DIAL.x + 6, DIAL.y + 6, 1), h: 2, tone: 'hi' }]);

  /* Lid: a pace scale round the dial, a label plate; four corner screws in Concept X. */
  const top = z1 + lid;
  const ticks = radialTicks(DIAL.x, DIAL.y, 17, 20, 5, top, [1.8, 3.4], P, -Math.PI * 0.75, Math.PI * 1.5);
  const scale = G.circleOf(frameZ(DIAL.x, DIAL.y, top), 0, 17, P, 72);
  const plate = pathOf(pts(rrRing(186, 60, 222, 80, 2).map(([x, y]) => [x, y, top] as Point3), P), true);
  const rules = [64.5, 68.5, 72.5].map((y, i) => lineSvg(pathOf(pts([[190, y, top], [i === 2 ? 204 : 214, y, top]], P)), { tone: 'lo', free: true })).join('');
  put(S, {
    name: 'lid', part: 'shell', lift: L.lid, at: centreOf(outer, 'z', z1 + 1.5),
    svg: solid(slabAlong('z', outer, z1, top, P, { c: 0.8 })) + lineSvg(scale, { tone: 'lo' }) + lineSvg(ticks.minor, { tone: 'lo' }) + lineSvg(ticks.major, { tone: 'mid', free: 'start' }) + lineSvg(plate, { tone: 'lo' }) + rules,
    shapes: [slabShape('z', outer, z1, top)],
  });
  cornersOf(x0, y0, x1, y1, 5).forEach(([x, y], i) => {
    const head = turnedZ(x, y, top, [[0, 1.8], [0.3, 1.8], [0.8, 1.3, 1], [1.1, 0]], P);
    const slot = pathOf(pts([[x - 1, y - 0.25, top + 1.08], [x + 1, y - 0.25, top + 1.08], [x + 1, y + 0.25, top + 1.08], [x - 1, y + 0.25, top + 1.08]], P), true);
    put(S, { name: `screwLid${i}`, part: 'screws', only: 'potential', lift: L.screwLid, at: [x, y, top + 0.5], bias: 0.3, svg: head.svg + lineSvg(slot, { tone: 'lo' }), shapes: [head.shape] });
  });

  /* Pace dial: knurled, with a titanium index bar. */
  const dialF = frameZ(DIAL.x, DIAL.y, top);
  const dialProfile = [[0, 11.4], [0.6, DIAL.r], [5.4, DIAL.r], [6, 11.4]];
  const knurl = G.ribsOf(dialF, 0.6, 5.4, DIAL.r, 54, P, { fade: [0.04, 0.4], seams: true });
  const face = G.circleOf(dialF, 6, 8.5, P, 48) + G.circleOf(dialF, 6, 3, P, 24);
  put(S, {
    name: 'dial', part: 'dial', lift: L.controls, at: [DIAL.x, DIAL.y, top + 3],
    svg: solid(G.solidOf(dialProfile, dialF, P, { steps: 48 }), 'hi', fadedSvg(knurl, { tone: 'lo' })) + lineSvg(face, { tone: 'lo' }),
    shapes: [{ k: 'solid', o: [DIAL.x, DIAL.y, top], a: [0, 0, 1], profile: dialProfile }],
  });
  const index = box(DIAL.x - 0.8, DIAL.y + 3.6, DIAL.x + 0.8, DIAL.y + 10.4, 0.6);
  put(S, { name: 'dialIndex', part: 'dial', ti: true, lift: L.controls, at: centreOf(index, 'z', top + 6.3), bias: 0.3, svg: solid(slabAlong('z', index, top + 6, top + 6.6, P, { c: 0.2 })), shapes: [slabShape('z', index, top + 6, top + 6.6)] });

  /* Play / pause and the larger rewind key, each domed in a bezel. */
  for (const [name, x, y, rk] of [['play', 196, 18, 5], ['rewind', 229, 18, 6.5]] as const) {
    const F = frameZ(x, y, top);
    const cap = [[0, rk], [1.2, rk], [1.8, rk - 0.6, 1], [2.1, rk - 1.8, 1], [2.2, 0]];
    const gz = top + 2.18;
    const t = (u: number, v: number): Flat => iso([x + u, y + v, gz], P);
    const glyph = name === 'play' ? pathOf([t(-1.6, -2), t(2, 0), t(-1.6, 2)], true) + pathOf([t(-3.4, -2), t(-2.6, -2), t(-2.6, 2), t(-3.4, 2)], true) : pathOf([t(0, -2.2), t(-3, 0), t(0, 2.2)], true) + pathOf([t(3, -2.2), t(0, 0), t(3, 2.2)], true);
    put(S, {
      name, part: 'buttons', lift: L.controls, at: [x, y, top + 1], bias: 0.2,
      svg: solid(G.ringBand(0, 0.5, rk + 0.4, rk + 1.6, F, P, { steps: 28 }), 'mid') + solid(G.solidOf(cap, F, P, { steps: 28, smooth: { rows: 3 } })) + lineSvg(glyph, { tone: 'mid' }),
      shapes: [{ k: 'solid', o: [x, y, top], a: [0, 0, 1], profile: cap }],
    });
  }
}

/* ------------------------------------------------------------------ light path */

/** World points of the light path (board, display, splitter, combiner, eye) and the lift each rides with. */
const LIGHT: readonly { readonly at: Point3; readonly lift: number | Readonly<Record<Layout, number>> }[] = [
  { at: [111, -12, 51.1], lift: { planned: L.boardTemple, potential: L.boardPod } },
  { at: [111, -12, POD.z0 + POD.wall], lift: L.display },
  { at: [111, -12, 28], lift: L.splitter },
  { at: [111, -2.6, 28], lift: L.combiner },
  { at: [EYE[0], EYE[1] + 10, EYE[2]], lift: 0 },
];
const LIGHT_PLANNED_BOARD: Point3 = [146.2, -59, 36];
/** In the cutaway the planned temple board is out of frame: its flex enters through the pod wall. */
const LIGHT_PLANNED_ENTRY: Point3 = [POD.x1, -12, 47];

function lightOf(P: Projection, layout: Layout, exploded: boolean, entry = false): Flat[] {
  return LIGHT.map(({ at, lift }, i) => {
    const base = i === 0 && layout === 'planned' ? (entry ? LIGHT_PLANNED_ENTRY : LIGHT_PLANNED_BOARD) : at;
    const l = exploded ? (typeof lift === 'number' ? lift : lift[layout]) : 0;
    const p = iso([base[0], base[1], base[2] + l], P);
    return [r2(p[0]), r2(p[1])] as Flat;
  });
}

/* ------------------------------------------------------------------ settled painter's order */

/* <settled-order> written by design-lab/shades-concept/round4/concept-x/v2/audit.mjs; do not edit by hand. */
const SETTLED: readonly string[] = [
  'eye',
  'templeL',
  'cable:0',
  'boot',
  'plug',
  'barrelL',
  'hingeL',
  'screwHingeL',
  'cable:1',
  'cable:2',
  'lensL',
  'cable:3',
  'padLArm:0',
  'rimL',
  'padL',
  'cable:4',
  'padRArm:0',
  'padR',
  'cable:5',
  'bridge',
  'templeR',
  'cageL',
  'cable:6',
  'boardTemple',
  'splitter',
  'cable:7',
  'combiner',
  'cable:8',
  'cageR',
  'cable:9',
  'lensR',
  'hingeR',
  'barrelR',
  'rimR',
  'podBody',
  'display',
  'boardPod',
  'cable:10',
  'screwHingeR',
  'case',
  'ctrl',
  'cable:11',
  'podBodyFront',
  'pod',
  'latch',
  'cable:12',
  'proc',
  'fpga',
  'mcu',
  'header',
  'carrier',
  'battery',
  'strap61',
  'strap79',
  'caseFront',
  'gland',
  'socket',
  'sledTab',
  'lid',
  'plugShell',
  'screwLid0',
  'screwLid1',
  'screwLid2',
  'screwLid3',
  'dial',
  'play',
  'rewind',
  'cable:13',
  'dialIndex',
];
/* </settled-order> */

/* ------------------------------------------------------------------ scene */

export function itemsOf(P: Projection, cutaway = false): { items: Item[]; routes: Route[] } {
  const S: Scope = { P, items: [], routes: [] };
  if (cutaway) {
    pod(S, true);
    return { items: [...S.items, ...itemsOf(P).items.filter((it) => it.name === 'eye')], routes: [] };
  }
  frame(S);
  pod(S);
  link(S);
  controller({ ...S, shift: CTRL });
  return { items: S.items, routes: S.routes };
}

/** Back to front: the settled order when it names every item, else the natural depth key. */
function order(items: Item[], P: Projection) {
  const V = viewDir(P);
  const rank = new Map(SETTLED.map((name, i) => [name, i]));
  if (items.every((it) => rank.has(it.name))) return [...items].sort((a, b) => (rank.get(a.name) ?? 0) - (rank.get(b.name) ?? 0));
  return [...items].sort((a, b) => G.dot3(a.at, V) + a.bias - (G.dot3(b.at, V) + b.bias));
}

export interface Piece {
  readonly key: string;
  readonly part: string;
  readonly only?: Layout;
  readonly ti?: boolean;
  readonly cls?: string;
  readonly svg: string;
  /** Screen translate per pose. */
  readonly at: Readonly<Record<Pose, string>>;
}

export interface Label {
  readonly part: string;
  readonly n: number;
  readonly text: string;
  readonly pose: Pose;
  readonly side: 'left' | 'right';
  /** Anchor on the part, text position, and phone callout centre, in final viewBox units. */
  readonly anchor: Flat;
  readonly at: Flat;
  readonly callout: Flat;
}

export interface Inset {
  readonly box: readonly [number, number, number, number];
  readonly pieces: readonly Piece[];
  readonly light: Readonly<Record<Layout, readonly Flat[]>>;
  /** Where the inset points to in the main figure (the pod), per assembled pose, in final viewBox units. */
  readonly marker: Readonly<Record<'pa' | 'xa', Flat>>;
}

export interface Scene {
  readonly width: number;
  readonly height: number;
  readonly pieces: readonly Piece[];
  readonly light: Readonly<Record<Pose, readonly Flat[]>>;
  /** CSS transform per pose that frames the object in the card. */
  readonly cams?: Readonly<Record<Pose, string>>;
  readonly labels?: readonly Label[];
  readonly inset?: Inset;
}

const liftIn = (it: Item, pose: Pose) => (explodedOf(pose) ? it.lift : 0);
const visibleIn = (it: Item, pose: Pose) => !it.only || it.only === layoutOf(pose);

function piecesOf(items: Item[], P: Projection): Piece[] {
  const o = iso([0, 0, 0], P);
  return order(items, P).map((it) => {
    const at = {} as Record<Pose, string>;
    const [sx, sy] = it.shift ?? [0, 0, 0];
    for (const pose of POSES) {
      const m = iso([sx, sy, liftIn(it, pose)], P);
      at[pose] = `translate(${r2(m[0] - o[0])}px, ${r2(m[1] - o[1])}px)`;
    }
    return { key: it.name, part: it.part, only: it.only, ti: it.ti, cls: it.cls, svg: it.svg, at };
  });
}

type Box = [number, number, number, number];

function poseBox(items: Item[], P: Projection, pose: Pose): Box {
  const out: Box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const it of items) {
    if (!visibleIn(it, pose) || it.part === 'eye') continue;
    const b = boundsOfSvg(it.svg);
    if (!b) continue;
    const [sx, sy] = it.shift ?? [0, 0, 0];
    const m = iso([sx, sy, liftIn(it, pose)], P);
    const o = iso([0, 0, 0], P);
    const [dx, dy] = [m[0] - o[0], m[1] - o[1]];
    out[0] = Math.min(out[0], b[0] + dx);
    out[1] = Math.min(out[1], b[1] + dy);
    out[2] = Math.max(out[2], b[2] + dx);
    out[3] = Math.max(out[3], b[3] + dy);
  }
  return out;
}

interface Cam {
  readonly k: number;
  readonly x: number;
  readonly y: number;
}
/** Fits a box into a region of the card, scale capped. */
function fit(b: Box, [x0, y0, x1, y1]: Box, cap = 2.2): Cam {
  const k = Math.min(cap, (x1 - x0) / (b[2] - b[0]), (y1 - y0) / (b[3] - b[1]));
  return { k: Math.round(k * 1000) / 1000, x: r2((x0 + x1) / 2 - (k * (b[0] + b[2])) / 2), y: r2((y0 + y1) / 2 - (k * (b[1] + b[3])) / 2) };
}
const camCss = (c: Cam) => `translate(${c.x}px, ${c.y}px) scale(${c.k})`;
const through = (c: Cam, [x, y]: Flat): Flat => [r2(c.k * x + c.x), r2(c.k * y + c.y)];

type LabelSpec = { readonly item: string; readonly text: string; readonly at: Point3; readonly side: 'left' | 'right' };
/** One label per part, anchored on its main item. Pod stack labels sit left of the stack, controller labels right. */
const LABELS: Readonly<Record<string, LabelSpec>> = {
  rim: { item: 'rimL', text: 'Front frame', at: [2, 2.5, 20], side: 'left' },
  lens: { item: 'lensL', text: 'Lenses', at: [20, 2.8, 30], side: 'left' }, // brand-reviewed 2026-10-12
  hinge: { item: 'hingeL', text: 'Hinges', at: [-1, -4.5, 36], side: 'left' }, // brand-reviewed 2026-10-12
  screws: { item: 'screwHingeL', text: 'Fasteners', at: [-4.1, -5, 41], side: 'left' },
  bridge: { item: 'bridge', text: 'Bridge and nose pads', at: [65.6, 2.5, 33], side: 'left' }, // brand-reviewed 2026-10-12
  temple: { item: 'templeL', text: 'Temples', at: [2, -40, 36], side: 'left' }, // brand-reviewed 2026-10-12
  combiner: { item: 'combiner', text: 'Curved combiner', at: [91.5, -2.6, 20], side: 'left' },
  splitter: { item: 'splitter', text: 'Beam splitter', at: [91.5, -9.5, 25.5], side: 'left' },
  display: { item: 'display', text: 'Microdisplay', at: [100, -12, 44.7], side: 'left' },
  dispboard: { item: 'boardPod', text: 'Display daughterboard', at: [94, -6, 49.2], side: 'left' }, // brand-reviewed 2026-10-12
  pod: { item: 'pod', text: 'Optics housing', at: [90, -6, 48], side: 'left' }, // brand-reviewed 2026-10-12
  latch: { item: 'latch', text: 'Pod release', at: [121, 1.75, 54.5], side: 'left' },
  port: { item: 'plug', text: 'Temple connector', at: [145.5, -139, 12], side: 'right' }, // brand-reviewed 2026-10-12
  cable: { item: 'cable:6', text: 'Cable', at: [255, -104, 1.6], side: 'right' },
  shell: { item: 'case', text: 'Controller case', at: [245, 60, 3.5], side: 'right' }, // brand-reviewed 2026-10-12
  battery: { item: 'battery', text: 'Battery', at: [240, 76, 4.2], side: 'right' },
  carrier: { item: 'carrier', text: 'Carrier / power board', at: [240, 44, 3.8], side: 'right' }, // brand-reviewed 2026-10-12
  proc: { item: 'proc', text: 'Processing board', at: [240, 26, 3.8], side: 'right' },
  fpga: { item: 'fpga', text: 'FPGA', at: [190, 14, 5.2], side: 'left' },
  mcu: { item: 'mcu', text: 'Microcontroller', at: [224, 14, 5], side: 'right' },
  header: { item: 'header', text: 'Expansion header', at: [236, 8, 5.6], side: 'right' },
  ctrlboard: { item: 'ctrl', text: 'Control daughterboard', at: [184, -25, 3.8], side: 'left' }, // brand-reviewed 2026-10-12
  dial: { item: 'dial', text: 'Pace dial', at: [DIAL.x + DIAL.r, DIAL.y, 13], side: 'right' },
  buttons: { item: 'rewind', text: 'Play / pause, rewind', at: [235.5, 18, 11], side: 'right' }, // brand-reviewed 2026-10-12
};
const PLANNED_LABELS: Readonly<Record<string, LabelSpec>> = {
  port: { item: 'boot', text: 'Temple connector', at: [146.7, -139, 12], side: 'right' }, // brand-reviewed 2026-10-12
  dispboard: { item: 'boardTemple', text: 'Display daughterboard', at: [147, -50, 36], side: 'right' }, // brand-reviewed 2026-10-12
};

/** Pushes sorted positions apart to at least `gap`, kept inside [lo, hi]. */
function spread(ys: number[], gap: number, lo: number, hi: number) {
  const out = ys.map((y) => Math.max(lo, Math.min(hi, y)));
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
  if (out.length && out[out.length - 1] > hi) {
    out[out.length - 1] = hi;
    for (let i = out.length - 2; i >= 0; i--) out[i] = Math.min(out[i], out[i + 1] - gap);
  }
  return out;
}

function labelsOf(items: Item[], P: Projection, pose: Pose, cam: Cam, W: number, H: number): Label[] {
  const layout = layoutOf(pose);
  const byName = new Map(items.map((it) => [it.name, it]));
  const raw = PARTS.flatMap((part, i) => {
    const spec = (layout === 'planned' && PLANNED_LABELS[part.id]) || LABELS[part.id];
    const it = spec ? byName.get(spec.item) : undefined;
    if (!spec || !it || !visibleIn(it, pose)) return [];
    const [sx, sy] = it.shift ?? [0, 0, 0];
    const anchor = through(cam, iso([spec.at[0] + sx, spec.at[1] + sy, spec.at[2] + liftIn(it, pose)], P));
    return [{ part: part.id, n: i + 1, text: spec.text, pose, anchor }];
  });
  /* Two columns at the card edges: names on desktop, numbered callouts on a phone. Side follows the anchor. */
  return (['left', 'right'] as const).flatMap((side) => {
    const list = raw.filter((l) => (l.anchor[0] < W / 2) === (side === 'left')).sort((a, b) => a.anchor[1] - b.anchor[1]);
    const ys = spread(list.map((l) => l.anchor[1]), 26, 22, H - 22);
    const cs = spread(list.map((l) => l.anchor[1]), 50, 30, H - 30);
    const textX = side === 'left' ? LABEL_COLUMN : W - LABEL_COLUMN;
    const callX = side === 'left' ? 30 : W - 30;
    return list.map((l, i): Label => ({ ...l, side, at: [textX, r2(ys[i])], callout: [callX, r2(cs[i])] }));
  });
}

/* ------------------------------------------------------------------ build */

const FIG_W = 960;
const FIG_H = 680;
/** Label columns sit this far in from the card edges; the taken-apart art keeps clear of them. */
const LABEL_COLUMN = 150;
const INSET = { w: 300, h: 236, pad: 18 } as const;

/** Every corner the assembled object reaches, for the base projection. */
function assembledBounds(): Point3[] {
  const out: Point3[] = [];
  for (const x of [-3, 147]) for (const y of [-142, 6]) for (const z of [8, 56]) out.push([x, y, z]);
  for (const x of [CASE.x0 + CTRL[0], 320]) for (const y of [-132, CASE.y1 + CTRL[1] + 2]) for (const z of [0, 17]) out.push([x, y, z]);
  return out;
}

/** The base projection of the figure (the audit script uses it too). */
export const FIGURE_P: Projection = fitProjection(assembledBounds(), FIG_W, FIG_H, { pad: 24 });

function build(): Scene {
  const P = FIGURE_P;
  const { items } = itemsOf(P);
  const insetBox: Box = [INSET.pad, FIG_H - INSET.h - INSET.pad, INSET.pad + INSET.w, FIG_H - INSET.pad];
  const camOf = {} as Record<Pose, Cam>;
  const cams = {} as Record<Pose, string>;
  for (const pose of POSES) {
    /* Assembled: fill the card (the inset takes the empty bottom-left). Apart: room for labels at both sides. */
    const region: Box = explodedOf(pose) ? [LABEL_COLUMN + 24, 24, FIG_W - LABEL_COLUMN - 24, FIG_H - 24] : [24, 24, FIG_W - 24, FIG_H - 24];
    camOf[pose] = fit(poseBox(items, P, pose), region);
    cams[pose] = camCss(camOf[pose]);
  }
  const labels = POSES.filter(explodedOf).flatMap((pose) => labelsOf(items, P, pose, camOf[pose], FIG_W, FIG_H));
  const light = {} as Record<Pose, Flat[]>;
  for (const pose of POSES) light[pose] = lightOf(P, layoutOf(pose), explodedOf(pose));

  /* The inset: the pod cut open at about four times the scale, with its own light path. */
  const base = fitProjection([[88, -60, 10], [136, -60, 10], [88, 8, 58], [136, 8, 58], [88, 8, 10], [136, -60, 58]], INSET.w, INSET.h, { pad: 16 });
  const Pi: Projection = { ...base, origin: [base.origin[0] + insetBox[0], base.origin[1] + insetBox[1]] };
  const pod = iso([112, -6, 47], P);
  const inset: Inset = {
    box: insetBox,
    pieces: piecesOf(itemsOf(Pi, true).items, Pi),
    light: { planned: lightOf(Pi, 'planned', false, true), potential: lightOf(Pi, 'potential', false) },
    marker: { pa: through(camOf.pa, pod), xa: through(camOf.xa, pod) },
  };
  return { width: FIG_W, height: FIG_H, pieces: piecesOf(items, P), light, cams, labels, inset };
}

function buildHero(): Scene {
  const W = 960;
  const H = 560;
  const P = fitProjection(assembledBounds(), W, H, { pad: 24 });
  const light = {} as Record<Pose, Flat[]>;
  for (const pose of POSES) light[pose] = lightOf(P, layoutOf(pose), explodedOf(pose));
  /* Assembled only, so the parts sealed inside the case and the pod are left out. */
  const inside = new Set(['battery', 'carrier', 'proc', 'fpga', 'mcu', 'header', 'ctrlboard', 'display', 'dispboard']);
  const items = itemsOf(P).items.filter((it) => !inside.has(it.part) || it.name === 'sledTab' || it.name === 'boardTemple');
  return { width: W, height: H, pieces: piecesOf(items, P), light };
}

/** The anatomy figure: one projection, a camera per pose. */
export const FIGURE: Scene = build();
/** The hero render: assembled only. */
export const HERO: Scene = buildHero();
