/**
 * BRAIN scenes, part B: context window, context engineering, harness, subagents, evals.
 * Pure: (t, size, state) → Frame; t = 1 is the rest pose for that state. A dot is not a token.
 */
import type { Dot, Frame, Line } from '../_system';
import type { StrategyId } from '../_content/brain';
import {
  arcLines,
  arcPoint,
  block,
  circleLines,
  clamp,
  count,
  ctxOf,
  dot,
  easeIn,
  easeInOut,
  easeOut,
  easeOutBack,
  finish,
  hash,
  lerp,
  line,
  orb,
  rectLines,
  ring,
  seg,
} from './kit';

/* ------------------------------------------------------------------ the window (ch4 + ch5) */

export const COLS = 16;
export const ROWS = 12;
export const SLOTS = COLS * ROWS; // 192, illustrative
export const PINNED = COLS * 2; // system prompt + tool definitions
/** Six turns: [user, reply, tool result] slot counts (illustrative). 32 + 150 = 182 = 95%. */
export const TURNS: ReadonlyArray<readonly [number, number, number]> = [
  [4, 7, 14],
  [3, 6, 16],
  [4, 8, 12],
  [3, 6, 18],
  [4, 7, 13],
  [3, 6, 16],
];
export const FULL = PINNED + TURNS.reduce((s, [a, b, c]) => s + a + b + c, 0); // 182
const TURN1 = TURNS[0][0] + TURNS[0][1] + TURNS[0][2]; // 25
export const DOC = 24;

interface Grid {
  readonly x0: number;
  readonly y0: number;
  readonly p: number;
}

const slotXY = (g: Grid, i: number): [number, number] => [g.x0 + (i % COLS) * g.p, g.y0 + Math.floor(i / COLS) * g.p];

function windowFrame(g: Grid, a: number): Line[] {
  const pad = g.p * 0.6;
  const x1 = g.x0 + (COLS - 1) * g.p;
  const y1 = g.y0 + (ROWS - 1) * g.p;
  return [
    ...rectLines(g.x0 - pad, g.y0 - pad, x1 + pad, y1 + pad, a, 'dashed'),
    // pinned band: solid outline (cached prefix)
    ...rectLines(g.x0 - pad * 0.6, g.y0 - pad * 0.6, x1 + pad * 0.6, g.y0 + g.p + pad * 0.6, a * 1.6, 'solid'),
  ];
}

/** Which turn / kind a slot belongs to (for the readout). */
export function slotTurn(i: number): number {
  if (i < PINNED) return 0;
  let acc = PINNED;
  for (let k = 0; k < TURNS.length; k++) {
    acc += TURNS[k][0] + TURNS[k][1] + TURNS[k][2];
    if (i < acc) return k + 1;
  }
  return TURNS.length;
}

/** Filled slot count at scrub position t (pinned rows are there from the start). */
export const filledAt = (t: number): number => PINNED + (FULL - PINNED) * clamp(t);

const GRID4: Grid = { x0: -0.79, y0: -0.6, p: 0.105 };

/**
 * Ch4 (scrubbed): six turns fill the fixed window to 95%. As it fills, ink thins, oldest first:
 * the picture of context rot (illustrative, not attention math).
 */
export function contextScene(t: number, size: number): Frame {
  const c = ctxOf(size);
  const g = GRID4;
  const dots: Dot[] = [];
  const fill = filledAt(t);
  const level = fill / SLOTS;
  for (let i = 0; i < SLOTS; i++) {
    const [x, y] = slotXY(g, i);
    dots.push(dot(x, y, c.r * 0.45, 0.2));
    const f = clamp(fill - i);
    if (f <= 0) continue;
    const pinned = i < PINNED;
    const age = 1 - i / SLOTS;
    const rot = pinned ? 0.15 * level * level : 0.6 * level * level * (0.4 + 0.6 * age);
    const big = !pinned && isResult(i);
    // newest slot slides in from the right edge
    const sx = lerp(1.05, x, easeOut(f));
    dots.push(dot(sx, y, c.r * (big ? 1.25 : 1) * (0.5 + 0.5 * f), (0.95 - rot) * (0.3 + 0.7 * f)));
    if (pinned) dots.push(dot(x, y, c.r * 2.1, 0.45, 'hollow'));
  }
  return finish(dots, windowFrame(g, 0.3));
}

function isResult(i: number): boolean {
  let acc = PINNED;
  for (const [u, a, r] of TURNS) {
    if (i < acc + u + a) return false;
    if (i < acc + u + a + r) return true;
    acc += u + a + r;
  }
  return false;
}

/* ------------------------------------------------------------------ ch5 engineering */

export const ENG_MS = 2600;
export type EngPhase = 'full' | 'waiting' | StrategyId;
const GRID5: Grid = { x0: -0.88, y0: -0.62, p: 0.082 };
export const DOC_AT: [number, number] = [0.66, -0.36];
export const NOTES_AT: [number, number] = [0.66, 0.38];
const COMPACT_TO = 40; // history (150 slots) compresses into 40

/** Filled count after each strategy (for the meter). */
export const engFill = (phase: EngPhase): number =>
  phase === 'evict' ? FULL - TURN1 + DOC : phase === 'compact' ? PINNED + COMPACT_TO + DOC : phase === 'demand' ? FULL + 1 : FULL;

function notes(dotsOut: Dot[], linesOut: Line[], r: number, written: number): void {
  const [nx, ny] = NOTES_AT;
  linesOut.push(...rectLines(nx - 0.13, ny - 0.13, nx + 0.13, ny + 0.13, 0.4, 'dashed'));
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 4; col++) {
      const on = row < written ? 1 : 0;
      dotsOut.push(dot(nx - 0.075 + col * 0.05, ny - 0.06 + row * 0.06, r * (on ? 1 : 0.6), on ? 0.9 : 0.25));
    }
}

/**
 * Ch5: the window starts full. A document (24 slots) is waiting (the DOM card is the draggable twin).
 * Strategies: evict oldest (turn 1 leaves; doc reuses its slots), compact (history collapses past a
 * boundary, decisions go to notes, doc lands after it), load on demand (only a hollow pointer enters).
 */
export function engineeringScene(t: number, size: number, phase: EngPhase, fill = 1): Frame {
  const c = ctxOf(size);
  const g = GRID5;
  const dots: Dot[] = [];
  const lines: Line[] = [...windowFrame(g, 0.3)];
  const r = c.r * 0.85;
  const hist = FULL - PINNED;
  const docIn = phase === 'demand' ? 0 : easeInOut(seg(t, 0.55, 1));
  const [dx, dy] = DOC_AT;
  // empty slot grid
  for (let i = 0; i < SLOTS; i++) {
    const [x, y] = slotXY(g, i);
    dots.push(dot(x, y, r * 0.45, 0.2));
  }
  // pinned rows: never touched
  for (let i = 0; i < PINNED; i++) {
    const [x, y] = slotXY(g, i);
    dots.push(dot(x, y, r, 0.9), dot(x, y, r * 2, 0.4, 'hollow'));
  }
  let notesWritten = 0;
  for (let k = 0; k < hist; k++) {
    const i = PINNED + k;
    const [x, y] = slotXY(g, i);
    if (phase === 'evict' && k < TURN1) {
      const f = easeIn(seg(t, k * 0.012, 0.45 + k * 0.012));
      dots.push(dot(x + f * 1.2, y - f * 0.25, r, 0.85 * (1 - f)));
      continue;
    }
    if (phase === 'compact') {
      const j = PINNED + Math.floor((k * COMPACT_TO) / hist);
      const [tx, ty] = slotXY(g, j);
      const f = easeInOut(seg(t, (k / hist) * 0.2, 0.35 + (k / hist) * 0.2));
      dots.push(dot(lerp(x, tx, f), lerp(y, ty, f), r * (1 + 0.25 * f), 0.8));
      continue;
    }
    // 'full' at fill < 1: the scroll scrub fills the window turn by turn (newest slides in from the right);
    // ink thins as it fills, oldest first (illustrative context rot)
    const f = phase === 'full' || phase === 'waiting' ? clamp((PINNED + hist * clamp(fill)) - i) : 1;
    if (f <= 0) continue;
    const level = (PINNED + hist * clamp(fill)) / SLOTS;
    const rot = 0.5 * level * level * (0.4 + 0.6 * (1 - i / SLOTS));
    dots.push(dot(lerp(1.02, x, easeOut(f)), y, r * (0.5 + 0.5 * f), (0.9 - rot) * (0.3 + 0.7 * f)));
  }
  if (phase === 'compact') {
    const b = seg(t, 0.4, 0.55);
    const [, by] = slotXY(g, PINNED + COMPACT_TO);
    const yb = by - g.p * 0.5;
    if (b > 0) lines.push(line(g.x0 - g.p * 0.6, yb, lerp(g.x0 - g.p * 0.6, g.x0 + (COLS - 1) * g.p + g.p * 0.6, b), yb, 0.6, 'solid'));
    // three decisions written to notes outside the window
    notesWritten = Math.round(3 * seg(t, 0.3, 0.6));
    for (let n = 0; n < 3; n++) {
      const v = easeInOut(seg(t, 0.25 + n * 0.06, 0.5 + n * 0.06));
      if (v > 0 && v < 1) {
        const [px, py] = arcPoint(g.x0 + 4 * g.p, g.y0 + 3 * g.p, NOTES_AT[0] - 0.075, NOTES_AT[1] - 0.06 + n * 0.06, v, 0.2);
        dots.push(dot(px, py, r * 1.2, 1, 'dot', 2));
      }
    }
  }
  // the document
  const docTarget = (n: number): number =>
    phase === 'evict' ? PINNED + n : phase === 'compact' ? PINNED + COMPACT_TO + n : FULL + n;
  if (phase === 'evict' || phase === 'compact') {
    for (let n = 0; n < DOC; n++) {
      const [tx, ty] = slotXY(g, docTarget(n));
      const sx = dx + ((n % 6) - 2.5) * 0.04;
      const sy = dy + (Math.floor(n / 6) - 1.5) * 0.04;
      const f = easeInOut(clamp((docIn - n * 0.01) / 0.76));
      if (docIn > 0) dots.push(dot(lerp(sx, tx, f), lerp(sy, ty, f), r * 1.05, 0.95, 'dot', 1));
    }
  } else if (phase === 'demand') {
    // the file stays outside; one pointer enters
    dots.push(...block(dx, dy, 6, 4, 0.04, r * 0.7, 0.35, 'hollow'));
    const f = easeInOut(seg(t, 0.15, 0.8));
    const [tx, ty] = slotXY(g, FULL);
    const [px, py] = arcPoint(dx - 0.12, dy, tx, ty, f, 0.12);
    dots.push(dot(px, py, r * 1.6, 1, 'hollow', 2));
  }
  notes(dots, lines, r, phase === 'compact' ? notesWritten : 0);
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch6 harness */

export const HARNESS_MS = 3600;
export const DECIDE_MS = 1400;
export type Decision = 'pending' | 'approved' | 'denied' | 'auto';
const CAGE = { x: -0.3, y: 0, R: 0.5, notch: 0.3 };
const GATE: [number, number] = [CAGE.x + CAGE.R, 0];
const PINCH: [number, number] = [0.36, 0];
export const HARNESS_TOOLS: ReadonlyArray<{ readonly name: string; readonly at: [number, number] }> = [
  { name: 'Read', at: [0.8, -0.46] },
  { name: 'Grep', at: [0.84, 0] },
  { name: 'Edit', at: [0.8, 0.46] },
];

/** Default permission mode: an Edit waits for the callback; approved runs, denied returns as the result. */
export const editOutcome = (decision: Decision): 'hold' | 'pass' | 'reject' =>
  decision === 'approved' ? 'pass' : decision === 'denied' ? 'reject' : 'hold';

/** Path of a call from the orb through the gate and the pinch point, fanning out to tool k. */
function callPath(k: number, u: number): [number, number] {
  const [tx, ty] = HARNESS_TOOLS[k].at;
  if (u < 0.5) return [lerp(CAGE.x + 0.12, GATE[0], easeInOut(u * 2)), 0];
  if (u < 0.7) return [lerp(GATE[0], PINCH[0], (u - 0.5) / 0.2), 0];
  const v = easeOut((u - 0.7) / 0.3);
  return [lerp(PINCH[0], tx - 0.07, v), lerp(0, ty, v)];
}

/**
 * Ch6. beat 'entry': Read and Grep pass; Edit meets the gate and does what the mode says (hold in default).
 * beat 'decide': from the held position, Edit passes (approved) or bounces back hollow (denied), delivered
 * to the model as the tool result. Turn and budget arcs thin as calls are spent.
 */
export function harnessScene(
  t: number,
  size: number,
  decision: Decision,
  beat: 'entry' | 'decide',
  anchor: boolean,
): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  dots.push(...orb(CAGE.x, CAGE.y, 0.14, count(60, c, 26), c.r * 0.85, 0.85, 0.6 + t * 0.6));
  dots.push(...ring(CAGE.x, CAGE.y, CAGE.R, count(56, c, 30), c.r * 0.8, 0.5, 0, CAGE.notch));
  // gate posts
  const gy = Math.sin(CAGE.notch) * CAGE.R;
  const gx = CAGE.x + Math.cos(CAGE.notch) * CAGE.R;
  lines.push(line(gx, -gy, gx + 0.12, -gy * 0.35, 0.7), line(gx, gy, gx + 0.12, gy * 0.35, 0.7));
  // pinch then fan
  lines.push(line(gx + 0.12, 0, PINCH[0], 0, 0.22, 'dotted'));
  HARNESS_TOOLS.forEach(({ at: [tx, ty] }) => lines.push(line(PINCH[0], 0, tx - 0.08, ty, 0.2, 'dotted')));
  const out = editOutcome(decision);
  const entry = beat === 'entry' ? t : 1;
  const calls = [seg(entry, 0, 0.42), seg(entry, 0.22, 0.64)];
  const approach = seg(entry, 0.48, 0.7);
  // after the gate: default waits for the decide beat; the other modes resolve inside the entry beat
  const v = out === 'hold' ? 0 : beat === 'decide' ? t : 1;
  const editLanded = out === 'pass' ? seg(v, 0.9, 1) : 0;
  HARNESS_TOOLS.forEach(({ at: [tx, ty] }, k) => {
    const landed = k < 2 ? seg(calls[k], 0.95, 1) : editLanded;
    dots.push(...block(tx, ty, 3, 3, 0.032, c.r * (1 + 0.3 * landed), 0.35 + 0.55 * landed));
  });
  calls.forEach((u, k) => {
    if (u > 0 && u < 1) dots.push(dot(...callPath(k, u), c.r * 1.9, 1, 'dot', 2));
  });
  if (approach > 0) {
    if (approach < 1 || out === 'hold' || v === 0) {
      const [x, y] = callPath(2, approach * 0.5);
      dots.push(dot(x, y, c.r * 2, 1, 'dot', 2));
      if (out === 'hold' && approach >= 1) {
        // held at the gate: the one open decision on the page
        lines.push(...circleLines(GATE[0], 0, 0.075, 20, 0.85, 'dashed'));
        if (anchor) dots.push(dot(GATE[0] + 0.11, -0.11, c.r * 1.5, 1, 'anchor', 3));
      }
    } else if (out === 'pass') {
      if (v < 1) dots.push(dot(...callPath(2, 0.5 + 0.5 * v), c.r * 2, 1, 'dot', 2));
    } else {
      // denied / blocked: bounces back hollow and is delivered to the model as the result
      const e = easeOut(v);
      const x = lerp(GATE[0], CAGE.x + 0.17, e);
      const y = -Math.sin(v * Math.PI) * 0.14;
      dots.push(dot(x, y, c.r * 2, 1, v > 0.15 ? 'hollow' : 'dot', 2));
    }
  }
  // turn + budget arcs (thin as calls are spent): dotted = used, solid = remaining
  const spent = (seg(calls[0], 0.9, 1) + seg(calls[1], 0.9, 1) + (out === 'hold' ? 0 : seg(v, 0.9, 1))) / 8;
  const a0 = Math.PI * 0.62;
  const a1 = Math.PI * 1.38;
  [CAGE.R + 0.1, CAGE.R + 0.16].forEach((R, n) => {
    const used = n === 0 ? spent : spent * 0.8;
    const mid = lerp(a0, a1, used);
    if (used > 0) lines.push(...arcLines(CAGE.x, CAGE.y, R, a0, mid, 6, 0.25, 'dotted'));
    lines.push(...arcLines(CAGE.x, CAGE.y, R, mid, a1, 16, 0.65, 'solid'));
  });
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch7 subagents */

export const SUB_MS = 3800;
export type SubMode = 'one' | 'sub';
const PARENT: [number, number] = [-0.18, 0.04];
const TASKS: ReadonlyArray<[number, number]> = [
  [0.52, -0.56],
  [0.7, 0.04],
  [0.52, 0.62],
];
export const METER = { x: -0.84, y0: 0.7, y1: -0.7, n: 20, base: 3 };
/** Parent-window slots after the beat (illustrative): one window absorbs everything; subagents return 3 summaries. */
export const subFill = (mode: SubMode): number => (mode === 'one' ? 17 : 6);

export function subagentsScene(t: number, size: number, mode: SubMode): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  dots.push(...orb(PARENT[0], PARENT[1], 0.2, count(90, c, 40), c.r * 0.85, 0.85, 0.6 + t * 0.7));
  const target = subFill(mode);
  let fill = METER.base;
  if (mode === 'one') {
    TASKS.forEach(([tx, ty], k) => {
      const appear = seg(t, k * 0.08, 0.2 + k * 0.08);
      const go = easeInOut(seg(t, 0.3 + k * 0.15, 0.62 + k * 0.15));
      for (let n = 0; n < 8; n++) {
        const ox = ((n % 4) - 1.5) * 0.04;
        const oy = (Math.floor(n / 4) - 0.5) * 0.04;
        if (go < 1) dots.push(dot(lerp(tx + ox, PARENT[0] + ox * 0.5, go), lerp(ty + oy, PARENT[1] + oy * 0.5, go), c.r, 0.85 * appear, 'dot', 1));
      }
    });
    fill = METER.base + (target - METER.base) * seg(t, 0.4, 1);
  } else {
    TASKS.forEach(([tx, ty], k) => {
      const out = easeInOut(seg(t, 0, 0.3));
      const work = seg(t, 0.3, 0.65);
      const back = easeInOut(seg(t, 0.68 + k * 0.04, 0.92 + k * 0.03));
      const cx = lerp(lerp(PARENT[0], tx, out), PARENT[0] + 0.2 * Math.sign(tx - PARENT[0]), back);
      const cy = lerp(lerp(PARENT[1], ty, out), PARENT[1] + (ty - PARENT[1]) * 0.25, back);
      const shrink = seg(t, 0.62, 0.72);
      if (back < 1) {
        if (shrink < 1) dots.push(...orb(cx, cy, lerp(0.02, 0.09, out) * (1 - shrink), count(28, c, 14), c.r * 0.8, 0.85 * (1 - shrink), 0.6 + work * 6));
        // the child's own clean window: 3×3 slots that fill while it works
        const wx = tx + 0.17;
        if (shrink < 1)
          for (let n = 0; n < 9; n++) {
            const sx = wx + ((n % 3) - 1) * 0.035;
            const sy = ty + (Math.floor(n / 3) - 1) * 0.035;
            const f = clamp(work * 9 - n);
            dots.push(dot(sx, sy, c.r * (f > 0 ? 0.9 : 0.6), (f > 0 ? 0.85 : 0.35) * out * (1 - shrink), f > 0 ? 'dot' : 'hollow'));
          }
        if (shrink > 0) dots.push(dot(cx, cy, c.r * 1.8, 1, 'dot', 2));
        lines.push(line(PARENT[0], PARENT[1], cx, cy, 0.25 * out * (1 - back), 'dotted'));
      }
    });
    fill = METER.base + (target - METER.base) * seg(t, 0.85, 1);
  }
  // parent meter
  for (let n = 0; n < METER.n; n++) {
    const y = lerp(METER.y0, METER.y1, n / (METER.n - 1));
    const f = clamp(fill - n);
    dots.push(dot(METER.x, y, c.r * (0.6 + 0.6 * f), f > 0 ? 0.4 + 0.55 * f : 0.25, f > 0 ? 'dot' : 'hollow'));
  }
  lines.push(...rectLines(METER.x - 0.05, METER.y1 - 0.06, METER.x + 0.05, METER.y0 + 0.06, 0.3, 'dashed'));
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch8 evals */

export const EVAL_MS = 3000;
/** Fixed outcome sequence: 7 of 10 pass (matches the illustrative p = 0.7). */
export const OUTCOMES = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0] as const;

export function evalsScene(t: number, size: number, k: number): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const rows = k > 5 ? 2 : 1;
  const per = Math.min(k, 5);
  const pitch = rows === 1 ? 0.056 : 0.05;
  const cell = rows === 1 ? 0.38 : 0.36;
  for (let i = 0; i < k; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const inRow = row === 0 ? per : k - 5;
    const cx = (col - (inRow - 1) / 2) * cell;
    const cy = rows === 1 ? -0.05 : row === 0 ? -0.32 : 0.28;
    const pass = OUTCOMES[i] === 1;
    const start = i * 0.05;
    const out = easeInOut(seg(t, start, start + 0.3));
    const back = pass ? easeOutBack(seg(t, start + 0.45, start + 0.75)) : 0;
    const amt = out * (1 - back);
    for (let b = 0; b < 5; b++) {
      const shift = (hash(b, i, 7) * 2 - 1) * 0.07 * amt;
      const lift = (hash(b, i, 9) * 2 - 1) * 0.02 * amt;
      for (let j = 0; j < 5; j++) {
        const x = cx + (j - 2) * pitch + shift;
        const y = cy + (b - 2) * pitch + lift;
        dots.push(dot(x, y, c.r * 0.95, pass ? 0.9 : 0.9 - 0.45 * out));
      }
    }
    // grade mark under each trial: dotted while it runs, then solid (pass) or dashed (fail)
    const settled = seg(t, start + 0.75, start + 0.85) >= 1;
    lines.push(line(cx - 2.4 * pitch, cy + 3.3 * pitch, cx + 2.4 * pitch, cy + 3.3 * pitch, settled ? 0.8 : 0.35, settled ? (pass ? 'solid' : 'dashed') : 'dotted'));
  }
  return finish(dots, lines);
}

export const evalDuration = (k: number): number => EVAL_MS + k * 120;
