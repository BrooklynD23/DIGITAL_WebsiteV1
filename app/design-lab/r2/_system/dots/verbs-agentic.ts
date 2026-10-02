/**
 * Agentic verbs: what an agent system is doing (BRAIN page + agentic icons).
 * Same contract as build verbs: t in [0, 1], t = 1 is the deterministic REST pose.
 * Fidelity notes live in design-lab/round2/research/agentic-storytelling.md §5; a dot is not a token.
 */
import { TAU, clamp, dot, easeIn, easeInOut, easeOut, fibDir, hash, lerp, line, partial, seg, shash } from './math';
import { coreOrb, latticeDisc } from './verbs-build';
import type { Dot, Frame, Line, VerbContext } from './types';

const nSqrt = (base: number, c: VerbContext, min = 4): number => Math.max(min, Math.round(base * Math.sqrt(c.d)));

/** 3×3 square node: a tool / server. */
function squareNode(cx: number, cy: number, pitch: number, r: number, a: number): Dot[] {
  const out: Dot[] = [];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) out.push(dot(cx + i * pitch, cy + j * pitch, r, a));
  return out;
}

const ORB = { x: -0.42, y: 0, R: 0.3 };
const TOOL = { x: 0.62, y: 0 };

/** emit — a call leaves the model along a path to a tool. Tool call requested. Rest: packet at the tool. */
export function emit(t: number, c: VerbContext): Frame {
  const e = easeInOut(t);
  const dots: Dot[] = coreOrb(ORB.x, ORB.y, ORB.R, nSqrt(60, c, 20), c.r, 0.85);
  dots.push(...squareNode(TOOL.x, TOOL.y, 0.07, c.r * 1.1, 0.75));
  const x0 = ORB.x + ORB.R + 0.04;
  const x1 = TOOL.x - 0.14;
  const lines: Line[] = [line(x0, 0, x1, 0, 0.22, 'dotted')];
  const arc = (u: number): [number, number] => [lerp(x0, x1, u), -Math.sin(u * Math.PI) * 0.16];
  for (let k = 0; k < 4; k++) {
    const [x, y] = arc(clamp(e - k * 0.05));
    dots.push(dot(x, y, c.r * (k === 0 ? 1.8 : 1.1), k === 0 ? 1 : 0.7 - k * 0.15));
  }
  return { dots, lines };
}

/** absorb — the result returns transformed (1 → 3×3) and merges into the model. Rest: orb grown by the result. */
export function absorb(t: number, c: VerbContext): Frame {
  const grow = 0.04 * seg(t, 0.75, 1);
  const base = nSqrt(60, c, 20);
  const dots: Dot[] = coreOrb(ORB.x, ORB.y, ORB.R + grow, base, c.r, 0.85);
  dots.push(...squareNode(TOOL.x, TOOL.y, 0.07, c.r * 1.1, 0.4));
  const lines: Line[] = [line(ORB.x + ORB.R + 0.04, 0, TOOL.x - 0.14, 0, 0.22, 'dotted')];
  for (let i = 0; i < 9; i++) {
    const sx = TOOL.x - 0.24 + ((i % 3) - 1) * 0.06;
    const sy = (Math.floor(i / 3) - 1) * 0.06;
    const [dx, dy] = fibDir(i * 5 + 3, 48);
    const tx = ORB.x + Math.abs(dx) * (ORB.R + grow) * 0.9 + 0.02;
    const ty = ORB.y + dy * (ORB.R + grow) * 0.9;
    const f = easeInOut(seg(t, i * 0.03, 0.7 + i * 0.03));
    dots.push(dot(lerp(sx, tx, f), lerp(sy, ty, f) + Math.sin(f * Math.PI) * 0.12, c.r * 1.25, 0.95));
  }
  return { dots, lines };
}

/** Context lattice slots (fixed capacity), top row = pinned band. */
function lattice(c: VerbContext): { slots: Array<[number, number]>; pinnedCount: number } {
  const g = nSqrt(9, c, 7);
  const slots = latticeDisc(g, 0.72);
  // Pinned band = whole top rows until it holds at least half a row's width (a disc's first row is short).
  const rows = Array.from(new Set(slots.map(([, y]) => y)));
  let pinnedCount = 0;
  for (const ry of rows) {
    pinnedCount += slots.filter(([, y]) => y === ry).length;
    if (pinnedCount >= Math.ceil(g * 0.6)) break;
  }
  return { slots, pinnedCount };
}

/** fill — slots in a fixed window fill in order. Context accumulates. Rest: filled to `level`. */
export function fill(t: number, c: VerbContext): Frame {
  const { slots, pinnedCount } = lattice(c);
  const level = clamp(c.opts.level ?? 0.72);
  const filled = pinnedCount + (slots.length - pinnedCount) * level * easeInOut(t);
  const dots: Dot[] = [];
  slots.forEach(([x, y], i) => {
    const f = clamp(filled - i);
    dots.push(dot(x, y, c.r * 0.55, 0.22));
    if (f > 0) dots.push(dot(x, y, c.r * (0.6 + 0.9 * f), 0.35 + 0.6 * f));
    if (i < pinnedCount) dots.push(dot(x, y, c.r * 2.4, 0.5, 'hollow'));
  });
  return { dots, lines: [] };
}

/** pin — mark the top band as immune to evict/compress (outlined). System prompt / cached prefix. */
export function pin(t: number, c: VerbContext): Frame {
  const { slots, pinnedCount } = lattice(c);
  const e = easeOut(t);
  const dots: Dot[] = [];
  slots.forEach(([x, y], i) => {
    const pinned = i < pinnedCount;
    dots.push(dot(x, y, c.r * 1.2, pinned ? 0.95 : 0.45));
    if (pinned) {
      const f = easeOut(seg(t, i * 0.06, 0.5 + i * 0.06));
      dots.push(dot(x, y, c.r * (1.2 + 1.3 * f), 0.7 * f, 'hollow'));
    }
  });
  const band = slots.slice(0, pinnedCount);
  const xs = band.map(([x]) => x);
  const ys = band.map(([, y]) => y);
  const x0 = Math.min(...xs) - 0.1;
  const x1 = Math.max(...xs) + 0.1;
  const y0 = Math.min(...ys) - 0.1;
  const y1 = Math.max(...ys) + 0.1;
  const lines: Line[] = [partial(x0, y0, x1, y0, e, 0.5, 'dashed'), partial(x1, y1, x0, y1, e, 0.5, 'dashed')];
  return { dots, lines };
}

/** evict — the oldest unpinned slots exit right and fade; their slots stay empty. Context overflow. */
export function evict(t: number, c: VerbContext): Frame {
  const { slots, pinnedCount } = lattice(c);
  const nextRowY = slots[pinnedCount][1];
  const victims = slots.map(([, y], i) => i >= pinnedCount && Math.abs(y - nextRowY) < 1e-6);
  const dots: Dot[] = [];
  let v = 0;
  slots.forEach(([x, y], i) => {
    if (i < pinnedCount) dots.push(dot(x, y, c.r * 2.4, 0.5, 'hollow'));
    if (!victims[i]) {
      dots.push(dot(x, y, c.r * 1.2, i < pinnedCount ? 0.95 : 0.7));
      return;
    }
    const f = easeIn(seg(t, v * 0.06, 0.65 + v * 0.06));
    v += 1;
    dots.push(dot(x, y, c.r * 1.3, 0.55 * seg(t, 0.4, 1), 'hollow'));
    const a = 0.9 * (1 - f);
    if (a > 0.02) dots.push(dot(x + f * 0.9, y - f * 0.08, c.r * 1.2, a));
  });
  return { dots, lines: [] };
}

/** compress — a scattered group collapses into a dense summary cluster. Compaction. Rest: k dense dots. */
export function compress(t: number, c: VerbContext): Frame {
  const count = nSqrt(30, c, 12);
  const k = Math.max(5, Math.round(count / 4));
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const sx = shash(i, c.seed, 20) * 0.78;
    const sy = shash(i, c.seed, 21) * 0.62;
    const m = i % k;
    const [dx, dy] = fibDir(m, k);
    const tx = 0.2 + dx * 0.15;
    const ty = dy * 0.15;
    const delay = hash(i, c.seed, 22) * 0.3;
    const f = easeInOut(seg(t, delay, delay + 0.65));
    const lead = i < k;
    const a = lead ? 0.6 + 0.4 * f : 0.75 * (1 - seg(f, 0.7, 1));
    if (a > 0.02) dots.push(dot(lerp(sx, tx, f), lerp(sy, ty, f), c.r * (lead ? 1 + 0.6 * f : 1), a));
  }
  const b = seg(t, 0.7, 1);
  const lines: Line[] = [partial(-0.12, -0.42, -0.12, 0.42, b, 0.45, 'dashed')];
  return { dots, lines };
}

const CHILD_ANGLES = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];

/** bud — the parent spawns child orbs, each with a clean window. Subagents start. Rest: 3 children out. */
export function bud(t: number, c: VerbContext): Frame {
  const e = easeInOut(t);
  const dots: Dot[] = coreOrb(0, 0, 0.3, nSqrt(56, c, 20), c.r, 0.9);
  const lines: Line[] = [];
  const childN = nSqrt(20, c, 8);
  CHILD_ANGLES.forEach((ang) => {
    const dist = lerp(0.3, 0.68, e);
    const cx = Math.cos(ang) * dist;
    const cy = Math.sin(ang) * dist;
    dots.push(...coreOrb(cx, cy, lerp(0.03, 0.13, e), childN, c.r * 0.9, 0.85));
    lines.push(partial(Math.cos(ang) * 0.34, Math.sin(ang) * 0.34, cx, cy, seg(t, 0.3, 1), 0.3, 'dotted'));
  });
  return { dots, lines };
}

/** merge — children compress to one summary dot each and return home. Subagents report back. */
export function merge(t: number, c: VerbContext): Frame {
  const dots: Dot[] = coreOrb(0, 0, 0.3, nSqrt(56, c, 20), c.r, 0.9);
  const lines: Line[] = [];
  const childN = nSqrt(20, c, 8);
  CHILD_ANGLES.forEach((ang, i) => {
    const shrink = easeInOut(seg(t, 0, 0.5));
    const travel = easeInOut(seg(t, 0.45 + i * 0.05, 0.95 + i * 0.016));
    const dist = lerp(0.68, 0.44, travel);
    const cx = Math.cos(ang) * dist;
    const cy = Math.sin(ang) * dist;
    if (shrink < 1) dots.push(...coreOrb(cx, cy, lerp(0.13, 0.02, shrink), childN, c.r * 0.9, 0.85 * (1 - shrink)));
    dots.push(dot(cx, cy, c.r * (1 + 1.4 * shrink), 0.4 + 0.6 * shrink));
    if (travel < 1) lines.push(line(Math.cos(ang) * 0.34, Math.sin(ang) * 0.34, cx, cy, 0.3 * (1 - travel), 'dotted'));
  });
  return { dots, lines };
}

/** route (gate) — a call passes the harness gate: pass, hold (waits for approval), or reject (bounces hollow). */
export function route(t: number, c: VerbContext): Frame {
  const outcome = c.opts.outcome ?? 'pass';
  const R = 0.6;
  const notch = 0.32; // radians either side of 3 o'clock
  const ringN = nSqrt(40, c, 18);
  const dots: Dot[] = coreOrb(-0.12, 0, 0.17, nSqrt(30, c, 12), c.r, 0.85);
  for (let i = 0; i < ringN; i++) {
    const a = (i / ringN) * TAU;
    const wrapped = a > Math.PI ? a - TAU : a;
    if (Math.abs(wrapped) < notch) continue;
    dots.push(dot(Math.cos(a) * R, Math.sin(a) * R, c.r * 0.9, 0.5));
  }
  const gx = Math.cos(notch) * R;
  const gy = Math.sin(notch) * R;
  const lines: Line[] = [line(gx, -gy, gx + 0.1, -gy, 0.7), line(gx, gy, gx + 0.1, gy, 0.7)];
  dots.push(...squareNode(0.86, 0, 0.05, c.r * 0.9, outcome === 'pass' ? 0.4 + 0.5 * seg(t, 0.85, 1) : 0.35));
  const go = easeInOut(seg(t, 0, 0.5));
  let x = lerp(0.08, R + 0.02, go);
  let kind: Dot['kind'] = 'dot';
  if (t > 0.5) {
    const f = easeInOut(seg(t, 0.5, 1));
    if (outcome === 'pass') x = lerp(R + 0.02, 0.72, f);
    else if (outcome === 'reject') {
      x = lerp(R + 0.02, 0.2, easeOut(f));
      if (f > 0.2) kind = 'hollow';
    }
  }
  const y = outcome === 'reject' && t > 0.5 ? -Math.sin(seg(t, 0.5, 1) * Math.PI) * 0.12 : 0;
  dots.push(dot(x, y, c.r * 1.8, 1, kind));
  if (outcome === 'hold' && c.opts.anchor && t >= 0.5) dots.push(dot(R + 0.12, -gy - 0.12, c.r * 1.3, 1, 'anchor'));
  return { dots, lines };
}

/** halt — the packet laps, slows, drops to the centre and the ring locks. Stop condition / final answer. */
export function halt(t: number, c: VerbContext): Frame {
  const R = 0.62;
  const ringN = nSqrt(24, c, 14);
  const lap = easeOut(seg(t, 0, 0.72));
  const ang = -Math.PI / 2 + lap * TAU * 2;
  const drop = easeInOut(seg(t, 0.72, 0.95));
  const lock = seg(t, 0.8, 1);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  for (let i = 0; i < ringN; i++) {
    const a = (i / ringN) * TAU - Math.PI / 2;
    const d = Math.abs(((a - ang + Math.PI * 3) % TAU) - Math.PI);
    const tail = Math.max(0, 1 - d / 1.2) * (1 - drop);
    dots.push(dot(Math.cos(a) * R, Math.sin(a) * R, c.r * (0.9 + 0.4 * tail), 0.4 + 0.5 * tail + 0.3 * lock));
    const a2 = ((i + 1) / ringN) * TAU - Math.PI / 2;
    if (lock > 0) lines.push(line(Math.cos(a) * R, Math.sin(a) * R, Math.cos(a2) * R, Math.sin(a2) * R, 0.75 * lock));
  }
  const px = lerp(Math.cos(ang) * R, 0, drop);
  const py = lerp(Math.sin(ang) * R, 0, drop);
  dots.push(dot(px, py, c.r * (1.8 + 0.6 * drop), 1));
  return { dots, lines };
}

/** tether — host port links to a server: local = short solid (stdio), remote = long dashed (HTTP). */
export function tether(t: number, c: VerbContext): Frame {
  const remote = c.opts.kind === 'remote';
  const e = easeInOut(t);
  const host = { x: -0.62, y: 0 };
  const server = remote ? { x: 0.7, y: -0.3 } : { x: 0.02, y: 0 };
  const dots: Dot[] = [];
  const socketN = nSqrt(9, c, 7);
  for (let i = 0; i < socketN; i++) {
    const a = Math.PI / 2 - (i / (socketN - 1)) * Math.PI;
    dots.push(dot(host.x + Math.cos(a) * 0.14, host.y + Math.sin(a) * 0.14, c.r * 0.9, 0.8));
  }
  dots.push(...squareNode(server.x, server.y, 0.06, c.r * 1.1, 0.45 + 0.5 * seg(t, 0.85, 1)));
  const x0 = host.x + 0.16;
  const x1 = server.x - 0.1;
  const lines: Line[] = [partial(x0, host.y, x1, server.y, e, 0.8, remote ? 'dashed' : 'solid')];
  if (!remote) {
    // "this machine" boundary
    const b = 0.3 + 0.2 * e;
    const L = -0.88;
    const Rt = 0.3;
    const T = -0.32;
    const B = 0.32;
    lines.push(line(L, T, Rt, T, b, 'dashed'), line(Rt, T, Rt, B, b, 'dashed'), line(Rt, B, L, B, b, 'dashed'), line(L, B, L, T, b, 'dashed'));
  }
  return { dots, lines };
}
