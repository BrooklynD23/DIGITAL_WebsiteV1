/**
 * BRAIN lesson figures for the Apple page's one pinned stage: seven looping dot scenes (the model alone, then six
 * lessons) and the morph between neighbours. Pure: (phase, spin, ctx) → dots + lines, no DOM.
 *
 * Every scene starts with the same ORB dots (the model), so across a transition the orb travels and resizes while
 * the rest of the previous figure flies into the next one, dot for dot. Nothing wipes to blank.
 * Each scene is periodic in its phase u (0..1), so the loop has no seam. Pictures are illustrative.
 */
import type { Dot, Frame, Line } from '../_system';
import { TAU, arcPoint, block, circleLines, clamp, ctxOf, dot, easeInOut, finish, lerp, line, orb, rectLines, seg, type Ctx } from './kit';

interface Raw {
  readonly dots: Dot[];
  readonly lines: Line[];
}
interface Scene {
  /** Loop length, ms. */
  readonly ms: number;
  /** Phase of the still (reduced motion / no JS). */
  readonly still: number;
  readonly draw: (u: number, spin: number, c: Ctx) => Raw;
}

const ORB = 72;
const model = (cx: number, cy: number, rad: number, spin: number, c: Ctx): Dot[] => orb(cx, cy, rad, ORB, c.r, 1, spin, 0.35);
const bump = (v: number): number => Math.sin(clamp(v) * Math.PI);
const along = (path: (v: number) => [number, number], a: number): Line[] =>
  Array.from({ length: 12 }, (_, i) => line(...path(i / 12), ...path((i + 1) / 12), a, 'dotted'));

/** Hero: the model alone. It predicts a short run and nothing comes back. */
const alone: Scene = {
  ms: 4200,
  still: 0.2,
  draw: (u, spin, c) => {
    const dots = model(0, 0, 0.5, spin, c);
    for (let k = 0; k < 6; k++) {
      const v = (u + k / 6) % 1;
      dots.push(dot(0.58 + v * 0.38, 0, c.r * 1.2, bump(v) * 0.9));
    }
    return { dots, lines: [] };
  },
};

/** Think → act → check → repeat: a marker runs the ring through four stations. */
const loop: Scene = {
  ms: 5200,
  still: 0.3,
  draw: (u, spin, c) => {
    const dots = model(0, 0, 0.24, spin, c);
    const R = 0.76;
    const n = 56;
    const head = u * TAU - TAU / 4;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU - TAU / 4;
      const behind = ((((head - ang) % TAU) + TAU) % TAU) / TAU;
      const station = i % (n / 4) === 0;
      dots.push(dot(Math.cos(ang) * R, Math.sin(ang) * R, c.r * (station ? 2.1 : 1), station ? 1 : 0.22 + 0.78 * (1 - behind) ** 4));
    }
    dots.push(dot(Math.cos(head) * R, Math.sin(head) * R, c.r * 2.6, 1, 'dot', 0.9));
    return { dots, lines: [] };
  },
};

/** The model writes a call, the tool runs outside it, the result comes back. */
const tools: Scene = {
  ms: 4400,
  still: 0.24,
  draw: (u, spin, c) => {
    const dots = model(-0.58, 0, 0.24, spin, c);
    const out = (v: number): [number, number] => arcPoint(-0.3, -0.08, 0.46, -0.08, v, -0.24);
    const back = (v: number): [number, number] => arcPoint(0.46, 0.08, -0.3, 0.08, v, -0.24);
    dots.push(...block(0.66, 0, 3, 3, 0.085, c.r * 1.35, 0.5 + 0.5 * bump(seg(u, 0.38, 0.6))));
    const go = seg(u, 0.04, 0.4);
    const ret = seg(u, 0.58, 0.94);
    dots.push(dot(...out(easeInOut(go)), c.r * 2.4, bump(go) > 0 ? 1 : 0, 'hollow', 0.9));
    for (let k = 0; k < 3; k++) dots.push(dot(...back(easeInOut(clamp(ret - k * 0.05))), c.r * 1.5, ret > 0 && ret < 1 ? 1 : 0, 'dot', 0.9));
    return { dots, lines: [...along(out, 0.45), ...along(back, 0.45)] };
  },
};

const SERVER_Y = [-0.6, -0.2, 0.2, 0.6] as const;
const HUB: [number, number] = [-0.12, 0];
/** One client, one interface, many servers: a message visits each server in turn. */
const mcp: Scene = {
  ms: 6800,
  still: 0.34,
  draw: (u, spin, c) => {
    const dots = model(-0.62, 0, 0.2, spin, c);
    const k = Math.min(3, Math.floor(u * 4));
    const v = (u * 4) % 1;
    const w = easeInOut(v < 0.5 ? v * 2 : 2 - v * 2); // out and back
    const lines = [line(-0.4, 0, HUB[0], HUB[1], 0.7)];
    dots.push(dot(HUB[0], HUB[1], c.r * 2.2, 1));
    SERVER_Y.forEach((y, i) => {
      const live = i === k ? bump(v) : 0;
      lines.push(line(HUB[0], HUB[1], 0.56, y, 0.25 + 0.45 * live));
      dots.push(...block(0.7, y, i % 2 ? 3 : 2, 2, 0.07, c.r * 1.25, 0.5 + 0.5 * live));
    });
    const [x, y] = w < 0.4 ? [lerp(-0.4, HUB[0], w / 0.4), 0] : [lerp(HUB[0], 0.56, (w - 0.4) / 0.6), lerp(0, SERVER_Y[k], (w - 0.4) / 0.6)];
    dots.push(dot(x, y, c.r * 2, 1, 'dot', 0.9));
    return { dots, lines };
  },
};

const COLS = 12;
const ROWS = 8;
const PITCH = 0.115;
/** One finite window: it fills turn by turn, then old slots are cleared to make room. The top row stays. */
const context: Scene = {
  ms: 7200,
  still: 0.78,
  draw: (u, spin, c) => {
    const dots = model(0, -0.72, 0.15, spin, c);
    const fill = u < 0.72 ? lerp(0.3, 0.96, easeInOut(u / 0.72)) : lerp(0.96, 0.3, easeInOut(seg(u, 0.86, 1)));
    const x0 = (-(COLS - 1) / 2) * PITCH;
    const y0 = -0.34;
    for (let i = 0; i < COLS * ROWS; i++) {
      const on = i < COLS ? 1 : clamp(fill * COLS * ROWS - i);
      dots.push(dot(x0 + (i % COLS) * PITCH, y0 + Math.floor(i / COLS) * PITCH, c.r * (i < COLS ? 1.3 : 1.1), i < COLS ? 1 : lerp(0.14, 0.78, on)));
    }
    const m = PITCH * 0.75;
    return { dots, lines: rectLines(x0 - m, y0 - m, -x0 + m, y0 + (ROWS - 1) * PITCH + m, 0.5, 'solid') };
  },
};

const CAGE = { x: -0.3, R: 0.54, gate: 0.24 };
const TOOL_Y = [-0.5, 0, 0.5] as const;
const DENIED = 1; // the second call of each loop is turned back at the gate
/** The harness: the loop inside, a boundary with one gate, tools outside, a check on every call. */
const harness: Scene = {
  ms: 7800,
  still: 0.45,
  draw: (u, spin, c) => {
    const dots = model(CAGE.x, 0, 0.18, spin, c);
    const head = u * TAU * 3;
    for (let i = 0; i < 20; i++) {
      const ang = (i / 20) * TAU;
      const behind = ((((head - ang) % TAU) + TAU) % TAU) / TAU;
      dots.push(dot(CAGE.x + Math.cos(ang) * 0.34, Math.sin(ang) * 0.34, c.r * 0.9, 0.2 + 0.6 * (1 - behind) ** 3));
    }
    const j = Math.min(2, Math.floor(u * 3));
    const v = (u * 3) % 1;
    const hold = v > 0.3 && v < 0.5;
    const lines = circleLines(CAGE.x, 0, CAGE.R, 44, 0.6, 'solid', 1 - 0.36 / TAU, 0.18);
    TOOL_Y.forEach((y, i) => {
      lines.push(line(CAGE.gate, 0, 0.66, y, 0.3, 'dotted'));
      dots.push(...block(0.76, y, 2, 2, 0.075, c.r * 1.3, 0.5 + 0.5 * (i === j && j !== DENIED ? bump(seg(v, 0.7, 1)) : 0)));
    });
    const at = (f: number, y: number): [number, number] => [lerp(CAGE.gate, 0.66, f), lerp(0, y, f)];
    const [x, y] =
      v <= 0.5
        ? [lerp(CAGE.x + 0.2, CAGE.gate, easeInOut(seg(v, 0, 0.3))), 0]
        : j === DENIED
          ? [lerp(CAGE.gate, CAGE.x + 0.2, easeInOut(seg(v, 0.5, 0.85))), 0]
          : at(easeInOut(seg(v, 0.5, 0.85)), TOOL_Y[j]);
    dots.push(dot(x, y, c.r * 1.9, bump(seg(v, 0, 0.92)) > 0 ? 1 : 0, hold && j === DENIED ? 'anchor' : 'dot', 0.9));
    return { dots, lines };
  },
};

const RUNS = 24;
const FAILS: ReadonlySet<number> = new Set([4, 11, 17]);
/** The same test, run again and again: each run resolves to a pass (solid) or a fail (open ring). */
const evals: Scene = {
  ms: 7400,
  still: 0.88,
  draw: (u, spin, c) => {
    const dots = model(-0.66, 0, 0.17, spin, c);
    const done = seg(u, 0.04, 0.76) * RUNS * (1 - seg(u, 0.94, 1));
    const at = (i: number): [number, number] => [0.3 + ((i % 6) - 2.5) * 0.19, (Math.floor(i / 6) - 1.5) * 0.22];
    for (let i = 0; i < RUNS; i++) {
      const res = clamp(done - i);
      const fail = FAILS.has(i);
      dots.push(dot(...at(i), c.r * lerp(0.9, 2.1, res), fail ? lerp(0.3, 0.85, res) : lerp(0.3, 1, res), fail && res > 0.5 ? 'hollow' : 'dot'));
    }
    const cur = Math.min(RUNS - 1, Math.floor(done));
    return { dots, lines: [line(-0.46, 0, ...at(cur), done > 0 && done < RUNS ? 0.35 : 0, 'dotted')] };
  },
};

const SCENES: readonly Scene[] = [alone, loop, tools, mcp, context, harness, evals];
export const STAGE_COUNT = SCENES.length;

const drawAt = (i: number, time: number, c: Ctx): Raw => SCENES[i].draw((time % SCENES[i].ms) / SCENES[i].ms, time * 0.00022, c);

/** The frame at playhead `pos` (float stage index) and loop clock `time` (ms). Between stages the two figures morph. */
export function lessonFrame(pos: number, time: number, size: number): Frame {
  const c = ctxOf(size);
  const i = Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(pos)));
  const t = clamp(pos - i);
  const A = drawAt(i, time, c);
  if (t < 0.001 || i === STAGE_COUNT - 1) return finish(A.dots, A.lines);
  const B = drawAt(i + 1, time, c);
  const dots: Dot[] = [];
  for (let k = 0; k < Math.max(A.dots.length, B.dots.length); k++) {
    // a figure with fewer dots lends positions (alpha 0), so new dots fly out of the old figure and spare ones fly in
    const a = A.dots[k] ?? { ...A.dots[k % A.dots.length], a: 0 };
    const b = B.dots[k] ?? { ...B.dots[k % B.dots.length], a: 0 };
    dots.push(dot(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.r, b.r, t), lerp(a.a, b.a, t), (t < 0.5 ? a : b).kind, lerp(a.z, b.z, t)));
  }
  const lines = [...A.lines.map((l) => ({ ...l, a: l.a * (1 - seg(t, 0, 0.45)) })), ...B.lines.map((l) => ({ ...l, a: l.a * seg(t, 0.55, 1) }))];
  return finish(dots, lines);
}

/** Still for reduced motion / no JS: stage i at its telling phase. */
export const lessonStill = (i: number, size: number): Frame => lessonFrame(i, SCENES[i].still * SCENES[i].ms, size);
