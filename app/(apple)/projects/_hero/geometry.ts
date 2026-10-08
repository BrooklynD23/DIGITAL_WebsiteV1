/**
 * Apple world · phone hero: isometric helper + part outline data. Pure and deterministic: every coordinate is
 * rounded to 1 decimal, so server and client output are identical strings.
 *
 * Unit space: x runs along the phone's long axis (screen down-right), y along the short axis (screen down-left),
 * z is up. Every part is drawn at its ASSEMBLED position; EXPLODE holds the screen-space offsets the poses apply.
 */
import type { PartId } from './contract';

export type Pt = readonly [number, number];
type XY = readonly [number, number];
type P3 = readonly [number, number, number];

const COS = 0.866;
const SIN = 0.5;
/** Chosen so the phone footprint centre projects to the viewBox centre (800, 450). */
const ORIGIN: Pt = [622.5, 172.5];
const ZERO: Pt = [0, 0];

const r1 = (n: number): number => Math.round(n * 10) / 10;
const fmt = (p: Pt): string => `${p[0]} ${p[1]}`;

export function iso(x: number, y: number, z = 0, off: Pt = ZERO): Pt {
  return [r1(ORIGIN[0] + (x - y) * COS + off[0]), r1(ORIGIN[1] + (x + y) * SIN - z + off[1])];
}

const at = (x: number, y: number, z: number, off: Pt): string => fmt(iso(x, y, z, off));

/** Open or closed polyline through 3D points. */
function path3(points: readonly P3[], closed = false, off: Pt = ZERO): string {
  return `M${points.map((p) => at(p[0], p[1], p[2], off)).join('L')}${closed ? 'Z' : ''}`;
}

function poly(points: readonly XY[], z: number, off: Pt = ZERO): string {
  return path3(
    points.map((p) => [p[0], p[1], z] as const),
    true,
    off,
  );
}

const rectPts = (x0: number, y0: number, x1: number, y1: number): readonly XY[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

function rect(x0: number, y0: number, x1: number, y1: number, z: number, off: Pt = ZERO): string {
  return poly(rectPts(x0, y0, x1, y1), z, off);
}

/** Top face plus the two viewer-facing sides (normals with +x or +y) of an extruded polygon. */
function prism(points: readonly XY[], z0: number, z1: number, off: Pt = ZERO): string {
  const sides = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    const visible = q[1] - p[1] - (q[0] - p[0]) > 0;
    return visible
      ? path3(
          [
            [p[0], p[1], z1],
            [p[0], p[1], z0],
            [q[0], q[1], z0],
            [q[0], q[1], z1],
          ],
          false,
          off,
        )
      : '';
  });
  return poly(points, z1, off) + sides.join('');
}

function box(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, off: Pt = ZERO): string {
  return prism(rectPts(x0, y0, x1, y1), z0, z1, off);
}

/** Cubic segment for a circular arc in the x/y plane (degrees), assuming the pen is at the arc start. */
function arc(cx: number, cy: number, r: number, a0: number, a1: number, z: number, off: Pt): string {
  const t0 = (a0 * Math.PI) / 180;
  const t1 = (a1 * Math.PI) / 180;
  const k = (4 / 3) * Math.tan((t1 - t0) / 4) * r;
  const p0: XY = [cx + r * Math.cos(t0), cy + r * Math.sin(t0)];
  const p1: XY = [cx + r * Math.cos(t1), cy + r * Math.sin(t1)];
  const c1 = at(p0[0] - k * Math.sin(t0), p0[1] + k * Math.cos(t0), z, off);
  const c2 = at(p1[0] + k * Math.sin(t1), p1[1] - k * Math.cos(t1), z, off);
  return `C${c1} ${c2} ${at(p1[0], p1[1], z, off)}`;
}

function rrect(x0: number, y0: number, x1: number, y1: number, z: number, r: number, off: Pt = ZERO): string {
  return (
    `M${at(x0 + r, y0, z, off)}L${at(x1 - r, y0, z, off)}` +
    arc(x1 - r, y0 + r, r, -90, 0, z, off) +
    `L${at(x1, y1 - r, z, off)}` +
    arc(x1 - r, y1 - r, r, 0, 90, z, off) +
    `L${at(x0 + r, y1, z, off)}` +
    arc(x0 + r, y1 - r, r, 90, 180, z, off) +
    `L${at(x0, y0 + r, z, off)}` +
    arc(x0 + r, y0 + r, r, 180, 270, z, off) +
    'Z'
  );
}

function circle(cx: number, cy: number, r: number, z: number, off: Pt = ZERO): string {
  return rrect(cx - r, cy - r, cx + r, cy + r, z, r, off);
}

const D45 = Math.SQRT1_2;

/** The viewer-facing half of a rounded rect (silhouette point to silhouette point) plus the silhouette verticals up to z1. */
function rrectFront(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, r: number): string {
  const right: XY = [x1 - r + r * D45, y0 + r - r * D45];
  const left: XY = [x0 + r - r * D45, y1 - r + r * D45];
  return (
    `M${at(right[0], right[1], z1, ZERO)}L${at(right[0], right[1], z0, ZERO)}` +
    arc(x1 - r, y0 + r, r, -45, 0, z0, ZERO) +
    `L${at(x1, y1 - r, z0, ZERO)}` +
    arc(x1 - r, y1 - r, r, 0, 90, z0, ZERO) +
    `L${at(x0 + r, y1, z0, ZERO)}` +
    arc(x0 + r, y1 - r, r, 90, 135, z0, ZERO) +
    `L${at(left[0], left[1], z1, ZERO)}`
  );
}

const line = (a: P3, b: P3, off: Pt = ZERO): string => path3([a, b], false, off);
const raw = (a: Pt, b: Pt): string => `M${fmt([r1(a[0]), r1(a[1])])}L${fmt([r1(b[0]), r1(b[1])])}`;
const seq = (n: number): readonly number[] => Array.from({ length: n }, (_, i) => i);
const many = (n: number, f: (i: number) => string): string => seq(n).map(f).join('');

/* ------------------------------------------------------------------ part data */

/** One drawn element. `fill` = near-black occlusion fill (no stroke); otherwise a stroke at opacity `o`. */
export interface Tier {
  readonly d: string;
  readonly o?: number;
  readonly dash?: boolean;
  readonly fill?: number;
}
export interface PartArt {
  readonly plan: readonly Tier[];
  readonly build: readonly Tier[];
}

/** Screen-space explosion offsets (rig units) used by PLAN / PROTOTYPE / TEST. INTEGRATE is all zero. */
export const EXPLODE = {
  sheet: [0, 260], // the drawing stays under the frame: the parts read as lifting off the paper
  display: [0, -350],
  shield: [0, -210],
  sensor: [0, -115],
  connector: [0, -58],
  pcb: [0, 0],
  camera: [0, -120],
  module: [380, -330],
  battery: [0, 150],
  frame: [0, 260],
} as const satisfies Record<string, Pt>;

const L = 760;
const W = 350;
const T = 34; // frame height
const G = T + 5; // display glass top
const R = 58;
const IN = 14;

const BOSSES: readonly XY[] = [
  [40, 40],
  [L - 40, 40],
  [L - 40, W - 40],
  [40, W - 40],
];
const PCB: readonly XY[] = [
  [200, 40],
  [560, 40],
  [560, 200],
  [300, 200],
  [300, 176],
  [200, 176],
];
const PCB_HOLES: readonly XY[] = [
  [214, 54],
  [546, 54],
  [546, 186],
  [214, 162],
];
const SHIELD: readonly XY[] = [
  [80, 50],
  [300, 50],
  [300, 120],
  [270, 120],
  [270, 190],
  [80, 190],
];
const PAD = [452, 97, 518, 127] as const;
const circles = (pts: readonly XY[], r: number, z: number, off: Pt = ZERO): string =>
  pts.map((p) => circle(p[0], p[1], r, z, off)).join('');

const frame: PartArt = {
  plan: [
    { d: rrect(0, 0, L, W, T, R) + rrectFront(0, 0, L, W, 0, T, R), o: 0.55, dash: true },
    { d: rect(146, 210, 566, 330, 3), o: 0.3, dash: true },
  ],
  build: [
    { d: rrect(0, 0, L, W, T, R) + rrectFront(0, 0, L, W, 0, T, R), o: 1 },
    {
      d:
        rrect(IN, IN, L - IN, W - IN, T, R - IN) +
        [
          [150, 205],
          [230, 310],
          [440, 520],
        ]
          .map(([a, b]) =>
            path3(
              [
                [a, W, 11],
                [b, W, 11],
                [b, W, 23],
                [a, W, 23],
              ],
              true,
            ),
          )
          .join('') +
        [
          [140, 210],
          [96, 108],
          [242, 254],
        ]
          .map(([a, b]) =>
            path3(
              [
                [L, a, 11],
                [L, b, 11],
                [L, b, 23],
                [L, a, 23],
              ],
              true,
            ),
          )
          .join(''),
      o: 0.4,
    },
    {
      d: rrect(IN, IN, L - IN, W - IN, 3, R - IN) + rect(146, 210, 566, 330, 3) + circles(BOSSES, 7, 3),
      o: 0.16,
    },
  ],
};

const display: PartArt = {
  plan: [
    { d: rrect(0, 0, L, W, G, R), o: 0.55, dash: true },
    { d: rrect(16, 16, L - 16, W - 16, G, R - 16), o: 0.28, dash: true },
  ],
  build: [
    { d: rrect(0, 0, L, W, G, R) + rrectFront(0, 0, L, W, T, G, R), o: 1 },
    { d: rrect(16, 16, L - 16, W - 16, G, R - 16) + rrect(30, 140, 40, 210, G, 5), o: 0.3 },
  ],
};

const shield: PartArt = {
  plan: [{ d: poly(SHIELD, 27), o: 0.55, dash: true }],
  build: [
    { d: poly(SHIELD, 27), fill: 0.55 },
    { d: prism(SHIELD, 24, 27), o: 1 },
    {
      d:
        rect(104, 72, 250, 168, 27) +
        circles(
          [
            [92, 62],
            [288, 62],
            [92, 178],
            [258, 178],
          ],
          5,
          27,
        ),
      o: 0.4,
    },
  ],
};

const pcb: PartArt = {
  plan: [
    { d: poly(PCB, 17), o: 0.6, dash: true },
    { d: rect(330, 78, 410, 148, 17) + rect(232, 66, 296, 122, 17), o: 0.32, dash: true },
  ],
  build: [
    { d: poly(PCB, 17), fill: 0.65 },
    { d: prism(PCB, 14, 17) + circles(PCB_HOLES, 6, 17), o: 1 },
    {
      d:
        box(330, 78, 410, 148, 17, 22) +
        box(232, 66, 296, 122, 17, 21) +
        box(336, 160, 376, 190, 17, 20) +
        box(236, 138, 290, 160, 17, 20) +
        rect(PAD[0], PAD[1], PAD[2], PAD[3], 17),
      o: 0.45,
    },
    {
      d:
        rect(342, 90, 398, 136, 22) +
        many(5, (i) => rect(306, 72 + i * 16, 320, 80 + i * 16, 17)) +
        many(8, (i) => rect(396 + i * 18, 172, 406 + i * 18, 190, 17)) +
        line([410, 112, 17], [452, 112, 17]) +
        line([296, 94, 17], [330, 94, 17]) +
        path3([
          [356, 160, 17],
          [356, 154, 17],
          [362, 148, 17],
        ]),
      o: 0.2,
    },
  ],
};

const sensor: PartArt = {
  plan: [
    { d: rect(430, 50, 540, 130, 33), o: 0.6, dash: true },
    { d: rect(462, 64, 512, 100, 33), o: 0.32, dash: true },
  ],
  build: [
    { d: rect(430, 50, 540, 130, 33), fill: 0.8 },
    {
      d:
        box(430, 50, 540, 130, 30, 33) +
        circles(
          [
            [440, 60],
            [530, 60],
            [530, 120],
            [440, 120],
          ],
          4,
          33,
        ),
      o: 1,
    },
    { d: box(462, 64, 512, 100, 33, 38) + rect(470, 70, 504, 94, 38), o: 0.55 },
    {
      d:
        many(3, (i) => rect(520, 74 + i * 12, 530, 82 + i * 12, 33)) +
        many(3, (i) => rect(442, 74 + i * 12, 452, 82 + i * 12, 33)) +
        rect(462, 108, 512, 120, 33),
      o: 0.22,
    },
  ],
};

const connector: PartArt = {
  plan: [{ d: rect(455, 100, 515, 124, 28), o: 0.6, dash: true }],
  build: [
    { d: rect(455, 100, 515, 124, 28), fill: 0.8 },
    { d: box(455, 100, 515, 124, 19, 28), o: 1 },
    {
      d:
        many(10, (i) => line([461 + i * 5.4, 104, 28], [461 + i * 5.4, 120, 28])) +
        path3([
          [455, 124, 23.5],
          [515, 124, 23.5],
          [515, 100, 23.5],
        ]),
      o: 0.5,
    },
  ],
};

const CAM: XY = [635, 85];
const camera: PartArt = {
  plan: [{ d: rect(590, 40, 680, 130, 24) + circle(CAM[0], CAM[1], 30, 24), o: 0.55, dash: true }],
  build: [
    { d: rect(590, 40, 680, 130, 24), fill: 0.6 },
    {
      d:
        box(590, 40, 680, 130, 10, 24) +
        circle(CAM[0], CAM[1], 30, 31) +
        line([CAM[0] + 30 * D45, CAM[1] - 30 * D45, 31], [CAM[0] + 30 * D45, CAM[1] - 30 * D45, 24]) +
        line([CAM[0] - 30 * D45, CAM[1] + 30 * D45, 31], [CAM[0] - 30 * D45, CAM[1] + 30 * D45, 24]),
      o: 1,
    },
    {
      d:
        circle(CAM[0], CAM[1], 20, 31) +
        circle(CAM[0], CAM[1], 9, 31) +
        circles(
          [
            [598, 48],
            [672, 48],
            [672, 122],
            [598, 122],
          ],
          4,
          24,
        ),
      o: 0.5,
    },
  ],
};

const MOD = [590, 160, 700, 300] as const;
const moduleArt: PartArt = {
  plan: [
    { d: rect(MOD[0], MOD[1], MOD[2], MOD[3], 17), o: 0.6, dash: true },
    { d: rect(618, 188, 672, 238, 17), o: 0.32, dash: true },
  ],
  build: [
    { d: rect(MOD[0], MOD[1], MOD[2], MOD[3], 17), fill: 0.6 },
    {
      d:
        box(MOD[0], MOD[1], MOD[2], MOD[3], 14, 17) +
        circles(
          [
            [600, 170],
            [690, 170],
            [690, 290],
            [600, 290],
          ],
          4,
          17,
        ),
      o: 1,
    },
    { d: box(618, 188, 672, 238, 17, 22) + box(604, 258, 686, 284, 17, 24), o: 0.45 },
    {
      d:
        rect(628, 198, 662, 228, 22) +
        many(10, (i) => line([610 + i * 7.6, 262, 24], [610 + i * 7.6, 280, 24])) +
        many(3, (i) => rect(682, 190 + i * 14, 692, 198 + i * 14, 17)),
      o: 0.2,
    },
  ],
};

const battery: PartArt = {
  plan: [{ d: box(150, 214, 560, 326, 6, 28), o: 0.5, dash: true }],
  build: [
    { d: rect(150, 214, 560, 326, 28), fill: 0.55 },
    { d: box(150, 214, 560, 326, 6, 28), o: 1 },
    {
      d:
        rect(166, 228, 544, 312, 28) +
        path3([
          [560, 250, 20],
          [578, 250, 20],
          [578, 290, 20],
          [560, 290, 20],
        ]),
      o: 0.32,
    },
  ],
};

/* construction: drop lines / nodes / dimensions live at the exploded layout (plan layer);
   the two registration marks that survive into INTEGRATE are the build layer. */
const E = EXPLODE;
const drop = (p: XY, zTop: number, offTop: Pt, zBot: number, offBot: Pt): string =>
  raw(iso(p[0], p[1], zTop, offTop), iso(p[0], p[1], zBot, offBot));
const tick = (c: Pt): string => raw([c[0] - 8, c[1]], [c[0] + 8, c[1]]);
const crosshair = (c: Pt): string =>
  `M${fmt([r1(c[0] - 9), c[1]])}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0` +
  raw([c[0] - 15, c[1]], [c[0] + 15, c[1]]) +
  raw([c[0], c[1] - 15], [c[0], c[1] + 15]);

const dimTop = iso(L + 70, -30, 0);
const dimBot = iso(L + 70, -30, 0, E.frame);
const mark1 = iso(40, 40, T, [0, -90]);
const mark2 = iso(L - 80, -120, 0);

const construction: PartArt = {
  plan: [
    {
      d:
        BOSSES.map((b) => drop(b, G, E.display, 3, E.frame)).join('') +
        PCB_HOLES.map((h) => drop(h, 17, E.pcb, 3, E.frame)).join('') +
        drop([440, 120], 30, E.sensor, 17, E.pcb) +
        drop([530, 60], 30, E.sensor, 17, E.pcb) +
        drop([150, 326], 6, E.battery, 3, E.frame) +
        drop([560, 326], 6, E.battery, 3, E.frame) +
        drop([92, 178], 24, E.shield, 3, E.frame) +
        drop([288, 62], 24, E.shield, 17, E.pcb) +
        drop(CAM, 10, E.camera, 3, E.frame) +
        rect(MOD[0], MOD[1], MOD[2], MOD[3], 14) +
        rect(MOD[0] - 30, MOD[1] - 30, MOD[2] + 30, MOD[3] + 30, 14, E.module),
      o: 0.3,
      dash: true,
    },
    {
      d:
        circles(PCB_HOLES, 10, 17, E.pcb) +
        circles(BOSSES, 8, G, E.display) +
        circles(BOSSES, 8, 3, E.frame) +
        line([L + 46, 0, 0], [L + 46, W, 0], E.frame) +
        line([L + 34, 0, 0], [L + 58, 0, 0], E.frame) +
        line([L + 34, W, 0], [L + 58, W, 0], E.frame) +
        raw(dimTop, dimBot) +
        tick(dimTop) +
        tick(dimBot),
      o: 0.38,
    },
  ],
  build: [
    { d: raw(iso(40, 40, T), mark1) + raw(iso(L - 80, 0, 0), mark2), o: 0.3, dash: true },
    { d: crosshair(mark1) + crosshair(mark2), o: 0.4 },
  ],
};

const EMPTY: PartArt = { plan: [], build: [] };

/** Line art for the ordinary parts. testPath and marker are assembled in PhoneArtwork from TEST_PATH / MARKER. */
/* sheet: the PLAN drawing, entirely on the z = 0 plane. Under the rig's `flat` un-projection it is a true
   orthographic schematic sheet (border, ruling, title block, top view, centre lines, two dimensions);
   un-flattened it is the ground the parts lift from. */
const SX0 = -130;
const SX1 = 890;
const SY0 = -110;
const SY1 = 460;
const hline = (y: number, x0: number, x1: number): string => line([x0, y, 0], [x1, y, 0]);
const vline = (x: number, y0: number, y1: number): string => line([x, y0, 0], [x, y1, 0]);
const sheet: PartArt = {
  plan: [
    { d: many(16, (i) => vline(SX0 + 60 * (i + 1), SY0, SY1)) + many(9, (i) => hline(SY0 + 57 * (i + 1), SX0, SX1)), o: 0.07 },
    { d: rect(SX0, SY0, SX1, SY1, 0), o: 0.45 },
    { d: rect(650, 409, SX1, SY1, 0) + hline(434.5, 650, SX1) + vline(770, 409, SY1), o: 0.3 },
    { d: rrect(0, 0, L, W, 0, R), o: 0.95 },
    { d: rrect(IN, IN, L - IN, W - IN, 0, R - IN) + circles(BOSSES, 7, 0), o: 0.4 },
    {
      d:
        poly(PCB, 0) +
        rect(430, 50, 540, 130, 0) +
        rect(590, 40, 680, 130, 0) +
        circle(CAM[0], CAM[1], 30, 0) +
        rect(MOD[0], MOD[1], MOD[2], MOD[3], 0),
      o: 0.8,
    },
    {
      d:
        rect(330, 78, 410, 148, 0) +
        rect(232, 66, 296, 122, 0) +
        rect(462, 64, 512, 100, 0) +
        rect(455, 100, 515, 124, 0) +
        rect(618, 188, 672, 238, 0) +
        circles(PCB_HOLES, 5, 0) +
        circle(CAM[0], CAM[1], 16, 0),
      o: 0.4,
    },
    { d: poly(SHIELD, 0) + rect(150, 214, 560, 326, 0), o: 0.5, dash: true },
    { d: hline(W / 2, -50, L + 50) + vline(L / 2, -50, W + 50), o: 0.25, dash: true },
    {
      d: hline(380, 0, L) + vline(0, 364, 390) + vline(L, 364, 390) + vline(-45, 0, W) + hline(0, -55, -14) + hline(W, -55, -14),
      o: 0.5,
    },
  ],
  build: [],
};

export const PARTS: Readonly<Record<PartId, PartArt>> = {
  sheet,
  construction,
  display,
  shield,
  sensor,
  connector,
  pcb,
  camera,
  module: moduleArt,
  battery,
  frame,
  testPath: EMPTY,
  marker: EMPTY,
};

/** DOM paint order, bottom to top. The focal sensor/connector paint above the (unfilled) display glass. */
export const PAINT_ORDER: readonly PartId[] = [
  'sheet',
  'frame',
  'battery',
  'pcb',
  'camera',
  'module',
  'shield',
  'display',
  'connector',
  'sensor',
  'construction',
  'testPath',
  'marker',
];

/* The validation path: sensor die -> board edge -> down through the connector -> pcb pad -> trace -> test point.
   `exploded` follows the parts at the TEST pose; `assembled` is the same route once everything has seated.
   Both share the pcb leg and the end point, because the pcb never moves. */
const route = (off: Pt): string =>
  `M${[
    iso(487, 82, 38, off),
    iso(487, 100, 38, off),
    iso(487, 100, 33, off),
    iso(487, 112, 33, off),
    iso(487, 112, 17),
    iso(487, 150, 17),
    iso(522, 150, 17),
  ]
    .map(fmt)
    .join('L')}`;

export const TEST_PATH = {
  exploded: route(E.sensor),
  assembled: route(ZERO),
  pad: rect(PAD[0], PAD[1], PAD[2], PAD[3], 17),
  end: iso(522, 150, 17),
} as const;

const tip = iso(487, 82, 38, [0, -58]);
/** Drawn above the ASSEMBLED sensor; its pose carries the sensor's offset. */
export const MARKER = {
  triangle: `M${fmt([r1(tip[0] - 11), r1(tip[1] - 19)])}L${fmt([r1(tip[0] + 11), r1(tip[1] - 19)])}L${fmt(tip)}Z`,
  leader: raw([tip[0], tip[1] + 7], [tip[0], tip[1] + 50]),
} as const;
