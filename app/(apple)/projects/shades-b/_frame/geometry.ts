/**
 * SHADES mockup B · the glasses, authored as geometry. An original study frame: two softly squared lenses
 * (superellipses, slightly narrower at the bottom), a keyhole bridge, flat temples. No brand marks, no parts.
 * Units are millimetres. x runs to the viewer's right, y down, z toward the viewer. The frame front lies in z = 0.
 * Everything is projected orthographically from a yaw + pitch, so a stage is a real turn of one object, not a
 * swap between two drawings. Pure and deterministic: the same code draws the live figure and the stills.
 */

export type P3 = readonly [number, number, number];
type Poly = readonly P3[];

export interface Cam {
  /** px per mm */
  readonly s: number;
  readonly cx: number;
  readonly cy: number;
  readonly cyaw: number;
  readonly syaw: number;
  readonly cpitch: number;
  readonly spitch: number;
}

/** Centre of the lens that carries the word (the wearer's right lens, on the viewer's left). */
export const HELD: P3 = [-31, 0, 0];
const LENS_X = 31;
const LENS_A = 25;
const LENS_B = 19.5;
const RIM = 3.2;
const THICK = 4;
/** Exploded offsets along the view axis: optics blank, then the display. */
export const EX_OPTICS = 60;
export const EX_DISPLAY = 120;

/** Clockwise superellipse (screen sense, y down). `taper` narrows the lower half. */
function lens(cx: number, a: number, b: number, z: number, dy = 0): P3[] {
  const n = 2 / 3.4;
  const out: P3[] = [];
  for (let k = 0; k < 56; k += 1) {
    const t = (k / 56) * Math.PI * 2;
    const c = Math.cos(t);
    const sn = Math.sin(t);
    const y = b * Math.sign(sn) * Math.abs(sn) ** n;
    const x = a * Math.sign(c) * Math.abs(c) ** n * (1 - 0.09 * Math.max(0, y / b));
    out.push([cx + x, y + dy, z]);
  }
  return out;
}

const mirror = (p: Poly): P3[] => p.map(([x, y, z]) => [-x, y, z] as const).reverse();
const atZ = (p: Poly, z: number): P3[] => p.map(([x, y]) => [x, y, z] as const);

const LENS_L = lens(-LENS_X, LENS_A, LENS_B, 0);
const LENS_R = lens(LENS_X, LENS_A, LENS_B, 0);
const OUTER_L = lens(-LENS_X, LENS_A + RIM, LENS_B + RIM + 0.6, 0, -0.6);
const OUTER_R = lens(LENS_X, LENS_A + RIM, LENS_B + RIM + 0.6, 0, -0.6);
const BRIDGE: P3[] = [[-7, -13.5, 0], [7, -13.5, 0], [5.6, -5, 0], [3, -8.4, 0], [0, -9.4, 0], [-3, -8.4, 0], [-5.6, -5, 0]];
const END_R: P3[] = [[56, -16, 0], [64.5, -16, 0], [64.5, -8.5, 0], [56, -6, 0]];
const END_L = mirror(END_R);

/** Front silhouette: solids clockwise, lens openings counter-clockwise (fill-rule nonzero leaves them open). */
const FRONT: readonly Poly[] = [OUTER_L, OUTER_R, BRIDGE, END_L, END_R, [...LENS_L].reverse(), [...LENS_R].reverse()];
const BACK: readonly Poly[] = FRONT.map((p) => atZ(p, -THICK));

const TEMPLE_Z = [0, -30, -62, -96, -116, -130, -140];
const TEMPLE_TOP = [-16, -16, -15.8, -15.4, -12.5, -6.5, 2.5];
const TEMPLE_BOT = [-8.5, -9, -9.6, -10, -7.6, -2, 6.5];
function temple(side: 1 | -1): P3[] {
  const x = (k: number): number => side * (64.5 - 4.5 * (k / (TEMPLE_Z.length - 1)));
  const top = TEMPLE_Z.map((z, k) => [x(k), TEMPLE_TOP[k], z] as const);
  const bot = TEMPLE_Z.map((z, k) => [x(k), TEMPLE_BOT[k], z] as const).reverse();
  return [...top, ...bot];
}
const TEMPLE_L = temple(-1);
const TEMPLE_R = temple(1);

/** Construction lines of the idea drawing, in the plane of the front. */
const CONS: readonly Poly[] = [
  [[-84, 0, 0], [84, 0, 0]],
  [[0, -34, 0], [0, 34, 0]],
  [[-LENS_X, -34, 0], [-LENS_X, 34, 0]],
  [[LENS_X, -34, 0], [LENS_X, 34, 0]],
];

export function camera(yawDeg: number, pitchDeg: number, s: number, w: number, h: number, focus: P3): Cam {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const base: Cam = { s, cx: 0, cy: 0, cyaw: Math.cos(yaw), syaw: Math.sin(yaw), cpitch: Math.cos(pitch), spitch: Math.sin(pitch) };
  const [fx, fy] = project(focus, base);
  return { ...base, cx: w / 2 - fx, cy: h / 2 - fy };
}

/** World point to figure px. Far things rise on screen when the camera looks down (pitch > 0). */
export function project(p: P3, cam: Cam, dz = 0): readonly [number, number] {
  const z = p[2] + dz;
  const depth = -p[0] * cam.syaw + z * cam.cyaw;
  return [cam.cx + cam.s * (p[0] * cam.cyaw + z * cam.syaw), cam.cy + cam.s * (p[1] * cam.cpitch + depth * cam.spitch)];
}

function d(polys: readonly Poly[], cam: Cam, dz = 0, close = true): string {
  return polys
    .map((poly) => poly.map((p, k) => { const [x, y] = project(p, cam, dz); return `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join('') + (close ? 'Z' : ''))
    .join('');
}

export interface FramePaths {
  readonly templeL: string;
  readonly templeR: string;
  readonly back: string;
  readonly front: string;
  /** Both lens openings: the tint. */
  readonly lenses: string;
  /** The word lens alone: the see-through window. */
  readonly glass: string;
  /** The lens blank of the word lens (optics carry the word to one eye), lifted off the frame by `explode`. */
  readonly optics: string;
  /** The axis the parts lift along, from the word lens to the display. */
  readonly axis: string;
  readonly cons: string;
}

/** Every path of the figure for one camera. `explode` 0..1 lifts optics and display toward the viewer. */
export function framePaths(cam: Cam, explode: number): FramePaths {
  return {
    templeL: d([TEMPLE_L], cam),
    templeR: d([TEMPLE_R], cam),
    back: d(BACK, cam),
    front: d(FRONT, cam),
    lenses: d([LENS_L, LENS_R], cam),
    glass: d([LENS_L], cam),
    optics: d([LENS_L], cam, explode * EX_OPTICS),
    axis: d([[HELD, [HELD[0], HELD[1], explode * EX_DISPLAY]]], cam, 0, false),
    cons: d(CONS, cam, 0, false),
  };
}

/** The solid outlines only (the side elevation beside the idea drawing). */
export function outline(cam: Cam): string {
  return d([TEMPLE_L, TEMPLE_R, ...FRONT], cam);
}

/** CSS matrix that lays a flat DOM box in the plane of the front, centred on `at`, `k` px per box px. */
export function planeMatrix(cam: Cam, at: P3, k: number): string {
  const [x, y] = project(at, cam);
  return `matrix(${(k * cam.cyaw).toFixed(4)}, ${(-k * cam.syaw * cam.spitch).toFixed(4)}, 0, ${(k * cam.cpitch).toFixed(4)}, ${x.toFixed(1)}, ${y.toFixed(1)})`;
}

/* ------------------------------------------------------------------ poses */

export interface Pose {
  /** `whole`: the frame fits the figure. `lens`: one lens fits the figure. `k` scales that fit. */
  readonly fit: 'whole' | 'lens';
  readonly k: number;
  readonly yaw: number;
  readonly pitch: number;
  /** World point held at the centre of the figure. */
  readonly focus: P3;
  /** Whole-frame opacity. */
  readonly frame: number;
  /** Solid body (1) or dashed line drawing (0). Dashed = planned. */
  readonly fill: number;
  /** Lens tint: what makes a see-through word readable over a light page. */
  readonly tint: number;
  readonly explode: number;
  /** System tags, the off-frame functions and their chain. */
  readonly sys: number;
  /** Construction lines and the side / top elevations. */
  readonly cons: number;
  /** How far the book is dimmed (0 = paper, 1 = black). */
  readonly shade: number;
  /** Opacity of the live typeset page. */
  readonly page: number;
  /** Width of the word plate as a share of the lens width. */
  readonly word: number;
  /** The word lens as a bright window onto the page (0..1). */
  readonly glass: number;
  /** Display and optics tags. */
  readonly lab: number;
  /** 1: the live page is seen only through the word lens. */
  readonly clip: 0 | 1;
  /** Narrow figures (< 700px) frame the word side of the glasses closer. */
  readonly narrow?: { readonly k: number; readonly focus?: P3 };
}

const THREE_QUARTER: P3 = [3, 1, -58];

/** Seven poses: hero, idea, form, system, optics, view, glasses. */
export const POSES: readonly Pose[] = [
  { fit: 'lens', k: 1, yaw: 0, pitch: 0, focus: HELD, frame: 0, fill: 0, tint: 0, explode: 0, sys: 0, cons: 0, shade: 0, page: 1, word: 0.56, glass: 0, lab: 0, clip: 0 },
  { fit: 'whole', k: 0.84, yaw: 0, pitch: 0, focus: [22, 0, 0], frame: 1, fill: 0, tint: 0, explode: 0, sys: 0, cons: 1, shade: 0, page: 0.05, word: 0.7, glass: 0, lab: 0, clip: 0, narrow: { k: 0.84, focus: [0, 0, 0] } },
  { fit: 'whole', k: 0.94, yaw: -24, pitch: 10, focus: THREE_QUARTER, frame: 1, fill: 1, tint: 0.5, explode: 0, sys: 0, cons: 0, shade: 0, page: 0.05, word: 0.7, glass: 0, lab: 0, clip: 0, narrow: { k: 0.76 } },
  { fit: 'whole', k: 0.74, yaw: -40, pitch: 14, focus: [4, 6, -12], frame: 1, fill: 0, tint: 0, explode: 1, sys: 1, cons: 0, shade: 0.9, page: 0, word: 0.7, glass: 0, lab: 1, clip: 1, narrow: { k: 1.02, focus: [-50, 10, 10] } },
  { fit: 'lens', k: 0.94, yaw: -18, pitch: 6, focus: HELD, frame: 1, fill: 0, tint: 0, explode: 0, sys: 0, cons: 0, shade: 0.86, page: 1, word: 0.5, glass: 0.86, lab: 1, clip: 1 },
  { fit: 'lens', k: 0.98, yaw: 0, pitch: 0, focus: HELD, frame: 1, fill: 1, tint: 0.3, explode: 0, sys: 0, cons: 0, shade: 0, page: 1, word: 0.5, glass: 0, lab: 0, clip: 0 },
  { fit: 'whole', k: 1, yaw: -20, pitch: 8, focus: THREE_QUARTER, frame: 1, fill: 1, tint: 0.5, explode: 0, sys: 0, cons: 0, shade: 0, page: 0.05, word: 0.7, glass: 0, lab: 0, clip: 0, narrow: { k: 0.8 } },
];

const forWidth = (p: Pose, w: number): Pose => (w < 700 && p.narrow ? { ...p, k: p.narrow.k, focus: p.narrow.focus ?? p.focus } : p);

/** px per mm for a pose in a w × h figure. */
export function poseScale(p: Pose, w: number, h: number): number {
  if (p.fit === 'lens') return p.k * Math.min(w / 58, (h - 40) / 47.4); // the rim fits, and the note under the figure stays clear
  return p.k * Math.min(w / (w < 700 ? 150 : 196), h / 84);
}

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Pose between two stages. Scale is mixed in log space so a long zoom plays at an even rate. */
export function poseAt(pos: number, w: number, h: number): { readonly p: Pose; readonly cam: Cam } {
  const last = POSES.length - 1;
  const i = Math.min(last, Math.max(0, Math.floor(pos)));
  const j = Math.min(last, i + 1);
  const t = Math.min(1, Math.max(0, pos - i));
  const a = forWidth(POSES[i], w);
  const b = forWidth(POSES[j], w);
  const m = (key: 'k' | 'yaw' | 'pitch' | 'frame' | 'fill' | 'tint' | 'explode' | 'sys' | 'cons' | 'shade' | 'page' | 'word' | 'glass' | 'lab'): number => mix(a[key], b[key], t);
  const p: Pose = {
    fit: a.fit, k: m('k'), yaw: m('yaw'), pitch: m('pitch'),
    focus: [mix(a.focus[0], b.focus[0], t), mix(a.focus[1], b.focus[1], t), mix(a.focus[2], b.focus[2], t)],
    frame: m('frame'), fill: m('fill'), tint: m('tint'), explode: m('explode'), sys: m('sys'), cons: m('cons'), shade: m('shade'), page: m('page'), word: m('word'), glass: m('glass'), lab: m('lab'),
    clip: t === 0 ? a.clip : ((a.clip && b.clip) as 0 | 1), // released the moment a clipped stage is left
  };
  const s = Math.exp(mix(Math.log(poseScale(a, w, h)), Math.log(poseScale(b, w, h)), t));
  return { p, cam: camera(p.yaw, p.pitch, s, w, h, p.focus) };
}
