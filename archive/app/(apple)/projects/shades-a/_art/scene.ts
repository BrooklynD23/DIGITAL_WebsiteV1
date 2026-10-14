/**
 * SHADES concept (mockup A) · the one artwork. An original glasses frame authored as 3D geometry in millimetres
 * (origin at the bridge centre, x right, y up, z toward the viewer), projected orthographically. Seven poses of the
 * same parts; `sceneAt(pos, view)` lerps two neighbouring poses and returns screen-space paths, so the server
 * stills and the played pin share one drawing. Pure and deterministic: no DOM, no randomness.
 * Not traced from any product. No part, panel or optic is specified: the "display" is a dashed region.
 */
export type V3 = readonly [number, number, number];
export type P2 = readonly [number, number];

export const PATH_KEYS = ['matte', 'cons', 'tL', 'tR', 'pads', 'back', 'lugs', 'bridge', 'rimL', 'rimR', 'hinges', 'lensL', 'lensR', 'glint', 'disp', 'chipT', 'chipC'] as const;
export type PathKey = (typeof PATH_KEYS)[number];
export const TAG_KEYS = ['frame', 'display', 'optics', 'timing', 'control'] as const;
export type TagKey = (typeof TAG_KEYS)[number];

type Ch = 'ghost' | 'cons' | 'lensR' | 'rest' | 'disp' | 'chips' | 'tint' | 'dim' | 'photo' | 'tagSys' | 'tagOpt';
type Channels = Readonly<Record<Ch, number>>;

interface Pose {
  readonly yaw: number;
  readonly pitch: number;
  /** Separation, 0..1: the lenses drop out of the rims, the display region lifts above its lens, the temples release at the hinge. */
  readonly ex: number;
  readonly focus: V3;
  readonly focusNarrow?: V3;
  /** World millimetres the camera must contain, [wide, narrow] boxes. */
  readonly span: P2;
  readonly spanNarrow: P2;
  readonly ch: Channels;
}

export interface View {
  readonly w: number;
  readonly h: number;
  /** Pixels kept free at the bottom of the box (the stage's panel). */
  readonly inset: number;
}

export interface Scene {
  readonly d: Readonly<Record<PathKey, string>>;
  readonly o: Readonly<Record<PathKey, number>>;
  readonly tags: Readonly<Record<TagKey, { readonly x: number; readonly y: number; readonly o: number }>>;
  readonly word: { readonly x: number; readonly y: number; readonly size: number };
  readonly dot: { readonly x: number; readonly y: number; readonly r: number };
  /** Screen box of the right lens opening: the book photograph sits behind it. */
  readonly lens: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  readonly photo: number;
  readonly ghost: number;
  readonly tint: number;
}

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const LENS_X = 34;
const LENS_Y = 1;
/** Face wrap: the front curves back toward the temples. */
const wz = (x: number): number => -0.0011 * x * x;
/** The fixed point: where the word is held, in the right lens. */
const FIX: V3 = [LENS_X, 3, wz(LENS_X)];

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/* ------------------------------------------------------------------ geometry */

/** Lens outline: a soft square (superellipse), wider at the brow, with a slight upsweep. grow > 0 = the rim. */
function loop(side: 1 | -1, grow: number, dz: number, dy = 0, n = 72): V3[] {
  const a = 26 + grow;
  const b = 17 + grow;
  const e = 2 / 3;
  const out: V3[] = [];
  for (let i = 0; i < n; i++) {
    const th = (i / n) * TAU;
    const c = Math.cos(th);
    const s = Math.sin(th);
    let x = a * Math.sign(c) * Math.abs(c) ** e;
    let y = b * Math.sign(s) * Math.abs(s) ** e;
    x *= 1 + 0.06 * (y / b);
    y += 0.045 * x + (y > 0 ? grow * 0.22 * (y / b) : 0);
    const wx = side * (LENS_X + x);
    out.push([wx, LENS_Y + y + dy, wz(wx) + dz]);
  }
  return out;
}

/** A temple as a ribbon: straight from the hinge, then down behind the ear. */
function temple(side: 1 | -1, ex: number): V3[] {
  const top: V3[] = [];
  const bot: V3[] = [];
  const n = 30;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const z = wz(66) - 3 - 136 * u - 9 * ex;
    const drop = u > 0.7 ? 22 * ((u - 0.7) / 0.3) ** 1.7 : 0;
    const yc = 10.4 - 1.5 * u - drop;
    const x = side * (66.5 + 5 * Math.sin(Math.PI * u * 0.9) - (u > 0.75 ? 6 * ((u - 0.75) / 0.25) ** 2 : 0) + 9 * ex);
    const hh = (3.7 - 1.7 * Math.min(1, u / 0.5) + (u > 0.75 ? 1.1 * ((u - 0.75) / 0.25) : 0)) * (i === n ? 0.55 : 1);
    top.push([x, yc + hh, z]);
    bot.push([x, yc - hh, z]);
  }
  return [...top, ...bot.reverse()];
}

function roundRect(cx: number, cy: number, z: number, w: number, h: number, r: number): V3[] {
  const out: V3[] = [];
  const corners: readonly P2[] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  corners.forEach(([sx, sy], q) => {
    for (let i = 0; i <= 6; i++) {
      const th = (q + i / 6) * (TAU / 4);
      out.push([cx + sx * (w / 2 - r) + r * Math.cos(th), cy + sy * (h / 2 - r) + r * Math.sin(th), z]);
    }
  });
  return out;
}

function bridge(): V3[] {
  const q = (p0: P2, c: P2, p1: P2, n: number): V3[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const x = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t ** 2 * p1[0];
      const y = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t ** 2 * p1[1];
      return [x, y, wz(x)] as const;
    });
  return [...q([-8, 13.6], [0, 10.6], [8, 13.6], 12), ...q([6.9, 2.4], [0, 9.6], [-6.9, 2.4], 12)];
}

/* ------------------------------------------------------------------ poses */

const CH0: Channels = { ghost: 0, cons: 0, lensR: 1, rest: 1, disp: 0, chips: 0, tint: 0, dim: 1, photo: 0, tagSys: 0, tagOpt: 0 };
const THREE_Q = { yaw: -30 * DEG, pitch: 13 * DEG } as const;

/** hero · idea · form · system · optics · view · glasses */
const POSES: readonly Pose[] = [
  { yaw: 0, pitch: 0, ex: 0, focus: FIX, span: [96, 40], spanNarrow: [70, 60], ch: { ...CH0, ghost: 1, lensR: 0, rest: 0 } },
  { yaw: 0, pitch: 0, ex: 0, focus: [0, 1, 0], span: [168, 62], spanNarrow: [150, 62], ch: { ...CH0, cons: 1 } },
  { ...THREE_Q, ex: 0, focus: [0, 0, -66], span: [212, 92], spanNarrow: [204, 92], ch: CH0 },
  { ...THREE_Q, ex: 1, focus: [0, -13, -18], focusNarrow: [0, -34, -70], span: [262, 114], spanNarrow: [210, 140], ch: { ...CH0, disp: 1, chips: 1, tint: 1, tagSys: 1, tagOpt: 1 } },
  { yaw: -14 * DEG, pitch: 6 * DEG, ex: 0, focus: [LENS_X, LENS_Y, 0], span: [112, 56], spanNarrow: [74, 60], ch: { ...CH0, disp: 1, dim: 0.26, tagOpt: 1 } },
  { yaw: 0, pitch: 0, ex: 0, focus: [LENS_X, LENS_Y + 0.6, 0], span: [64, 48.5], spanNarrow: [60, 50], ch: { ...CH0, dim: 0.26, photo: 1 } },
  { yaw: -17 * DEG, pitch: 7 * DEG, ex: 0, focus: [0, 0, -68], span: [190, 76], spanNarrow: [182, 80], ch: CH0 },
];
export const STAGE_COUNT = POSES.length;

/** Staggering inside a transition i → i+1: [from, to] share of the tween in which a channel moves. */
const WINDOWS: Readonly<Record<number, Partial<Record<Ch, P2>>>> = {
  0: { ghost: [0, 0.35], cons: [0, 0.5], lensR: [0.05, 0.55], rest: [0.45, 1] },
  2: { chips: [0.35, 1], disp: [0.2, 0.8], tagSys: [0.65, 1], tagOpt: [0.65, 1] },
  3: { tagSys: [0, 0.3], chips: [0, 0.4] },
  4: { photo: [0.4, 1], disp: [0, 0.5], tagOpt: [0, 0.3] },
  5: { photo: [0, 0.45] },
};

function poseAt(pos: number, narrow: boolean): { yaw: number; pitch: number; ex: number; focus: V3; span: P2; ch: Channels } {
  const i = clamp(Math.floor(pos), 0, POSES.length - 1);
  const j = Math.min(POSES.length - 1, i + 1);
  const t = clamp(pos - i, 0, 1);
  const a = POSES[i];
  const b = POSES[j];
  const win = WINDOWS[i] ?? {};
  const ch = Object.fromEntries(
    (Object.keys(CH0) as Ch[]).map((k) => {
      const w = win[k];
      const u = w ? clamp((t - w[0]) / (w[1] - w[0]), 0, 1) : t;
      return [k, mix(a.ch[k], b.ch[k], u)];
    }),
  ) as Record<Ch, number>;
  const fa = (narrow && a.focusNarrow) || a.focus;
  const fb = (narrow && b.focusNarrow) || b.focus;
  const sa = narrow ? a.spanNarrow : a.span;
  const sb = narrow ? b.spanNarrow : b.span;
  return {
    yaw: mix(a.yaw, b.yaw, t),
    pitch: mix(a.pitch, b.pitch, t),
    ex: mix(a.ex, b.ex, t),
    focus: [mix(fa[0], fb[0], t), mix(fa[1], fb[1], t), mix(fa[2], fb[2], t)],
    span: [mix(sa[0], sb[0], t), mix(sa[1], sb[1], t)],
    ch,
  };
}

/* ------------------------------------------------------------------ scene */

const f1 = (v: number): string => (Math.round(v * 10) / 10).toString();

export function sceneAt(pos: number, view: View): Scene {
  const narrow = view.w < 600;
  const p = poseAt(pos, narrow);
  const { ex } = p;
  /* Phones: the legend under the figure names the groups, so the in-figure tags stay out of the exploded view. */
  const ch = narrow ? { ...p.ch, tagSys: 0, tagOpt: p.ch.tagOpt * (1 - ex) } : p.ch;
  const room = Math.max(40, view.h - view.inset);
  const s = Math.min((view.w * 0.94) / p.span[0], (room * 0.94) / p.span[1]);
  const cy0 = Math.cos(p.yaw);
  const sy0 = Math.sin(p.yaw);
  const cp = Math.cos(p.pitch);
  const sp = Math.sin(p.pitch);
  const raw = ([x, y, z]: V3): P2 => [x * cy0 + z * sy0, y * cp - (z * cy0 - x * sy0) * sp];
  const [fx, fy] = raw(p.focus);
  const pr = (v: V3): P2 => {
    const [x, y] = raw(v);
    return [view.w / 2 + (x - fx) * s, room / 2 - (y - fy) * s];
  };
  const poly = (pts: readonly V3[], close = true): string =>
    pts.map((v, i) => { const [x, y] = pr(v); return `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`; }).join('') + (close ? 'Z' : '');

  const lensDz = -2 + 14 * ex;
  const lensDy = -42 * ex;
  const fix: V3 = [FIX[0], FIX[1] + 31 * ex, FIX[2]];
  const lensR = loop(1, 0, lensDz, lensDy);
  const lensL = loop(-1, 0, lensDz, lensDy);
  const openR = loop(1, 0, 0);
  const lug = (side: 1 | -1): string => {
    const z0 = wz(67);
    const zh = z0 - 5.5;
    return (
      poly([[side * 59, 15.6, wz(59)], [side * 67, 14.5, z0], [side * 67, 6.3, z0], [side * 59, 5.4, wz(59)]]) +
      poly([[side * 67, 14.5, z0], [side * 67, 14.3, zh], [side * 67, 6.5, zh], [side * 67, 6.3, z0]])
    );
  };
  const hinge = (side: 1 | -1): string => {
    const x = side * (66.6 + 9 * ex);
    const z = wz(66) - 8.5 - 9 * ex;
    return poly([[x, 14.1, z], [x, 6.8, z]], false) + poly([[x, 14.0, z - 2.4], [x, 6.9, z - 2.4]], false);
  };
  const pad = (side: 1 | -1): V3[] =>
    Array.from({ length: 16 }, (_, i) => {
      const th = (i / 16) * TAU;
      return [side * (7 + 1.2 * Math.cos(th) + 0.2 * Math.sin(th) * 3.2), -9 + 3.2 * Math.sin(th), -7] as const;
    });
  const glint = (side: 1 | -1): string => {
    const cx = side * LENS_X - 13;
    const g = (dx: number, len: number): string =>
      poly([[cx + dx, LENS_Y + 5 + lensDy, wz(cx + dx) + lensDz], [cx + dx + len, LENS_Y + 5 + len + lensDy, wz(cx + dx + len) + lensDz]], false);
    return g(0, 7) + g(4, 4);
  };
  const cons =
    poly([[-98, FIX[1], 0], [98, FIX[1], 0]], false) +
    [0, LENS_X, -LENS_X].map((x) => poly([[x, -31, 0], [x, 33, 0]], false)).join('') +
    poly([[-98, 22.2, 0], [98, 22.2, 0]], false) +
    poly([[-98, -19.8, 0], [98, -19.8, 0]], false);

  /* Word timing and control: no source places them on the glasses, so they are drawn off the frame (beside it; below it on phones). */
  const chipAt: readonly [V3, V3] = narrow ? [[-20, -76, 10], [20, -76, 10]] : [[-116, 11, 10], [-116, -8, 10]];
  const chip = (c: V3): V3[] => roundRect(c[0], c[1], c[2], 38, 13, 3);
  const openBox = openR.map(pr);
  const xs = openBox.map((q) => q[0]);
  const ys = openBox.map((q) => q[1]);
  const lens = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };

  const d: Record<PathKey, string> = {
    matte: `M-9 -9H${f1(view.w + 9)}V${f1(view.h + 9)}H-9Z${poly(openR)}`,
    cons,
    tL: poly(temple(-1, ex)),
    tR: poly(temple(1, ex)),
    pads: poly(pad(-1)) + poly(pad(1)),
    back: poly(loop(-1, 3.6, -4.6)) + poly(loop(1, 3.6, -4.6)),
    lugs: lug(-1) + lug(1),
    bridge: poly(bridge()),
    rimL: poly(loop(-1, 3.6, 0)) + poly(loop(-1, 0, 0)),
    rimR: poly(loop(1, 3.6, 0)) + poly(openR),
    hinges: hinge(-1) + hinge(1),
    lensL: poly(lensL),
    lensR: poly(lensR),
    glint: glint(-1) + glint(1),
    disp: poly(roundRect(fix[0], fix[1] - 0.6, fix[2], 27, 14.5, 3)),
    chipT: poly(chip(chipAt[0])),
    chipC: poly(chip(chipAt[1])),
  };
  const rest = ch.rest * ch.dim;
  /* Seen straight on, a temple is end-on behind the rim: it is drawn only once the frame turns. */
  const side = rest * clamp(Math.abs(p.yaw) / (9 * DEG), 0, 1);
  const o: Record<PathKey, number> = {
    matte: ch.photo > 0.001 ? 1 : 0,
    cons: ch.cons * 0.22,
    tL: side, tR: side, pads: rest * 0.5, back: rest * 0.38, lugs: rest, bridge: rest, rimL: rest, hinges: side * 0.8,
    rimR: ch.lensR,
    lensL: rest * (0.22 + 0.7 * ex),
    lensR: ch.lensR * (0.22 + 0.7 * ex),
    glint: rest * 0.32,
    disp: ch.disp,
    chipT: ch.chips,
    chipC: ch.chips,
  };

  const size = clamp(5.2 * s, 11, 72);
  const [wx, wy] = pr(fix);
  const tag = (v: V3, dy: number, op: number): { x: number; y: number; o: number } => {
    const [x, y] = pr(v);
    return { x, y: y + dy, o: op };
  };
  return {
    d,
    o,
    tags: {
      frame: tag([82, 13, -82], -16, ch.tagSys),
      optics: tag([LENS_X + 37 * ex, LENS_Y - 22.5 * (1 - ex) + lensDy, wz(LENS_X) + lensDz], 14 * (1 - ex), ch.tagOpt),
      display: tag([fix[0], fix[1] + 6.8, fix[2]], -12, ch.tagOpt),
      timing: tag(chipAt[0], 0, ch.tagSys),
      control: tag(chipAt[1], 0, ch.tagSys),
    },
    word: { x: wx, y: wy + size * 0.34, size },
    dot: { x: wx, y: wy - size * 0.92, r: clamp(size * 0.085 + 1.4, 2.4, 5) },
    lens,
    photo: ch.photo,
    ghost: ch.ghost,
    tint: ch.tint,
  };
}

/** Nominal box for the server stills and the first paint before hydration. */
export const STILL_VIEW: View = { w: 960, h: 440, inset: 0 };
