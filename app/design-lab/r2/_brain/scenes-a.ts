/**
 * BRAIN scenes, part A: hero orb, agent loop, tool use, MCP.
 * Each scene is pure: (t, size, state) → Frame. t = 1 is the scene's rest pose for that state
 * (SSR, no-JS, reduced motion and every settled moment). Fidelity notes: _content/brain.ts.
 */
import type { Dot, Frame, Line } from '../_system';
import { project } from '../_system/dots/math';
import { LOOP, SERVERS, type ToolId } from '../_content/brain';
import {
  TAU,
  arcPoint,
  block,
  circleLines,
  clamp,
  count,
  ctxOf,
  dot,
  easeInOut,
  easeOut,
  finish,
  lerp,
  line,
  orb,
  packet,
  partial,
  promptMark,
  rectLines,
  resourceMark,
  ring,
  seg,
  toolMark,
} from './kit';

/* ------------------------------------------------------------------ hero */

export const HERO_MS = 7200;

/** Trace index for the hero line: evaluate · tool_call · result · evaluate · done. */
export const heroStep = (t: number): number => (t < 0.3 ? 0 : t < 0.45 ? 1 : t < 0.6 ? 2 : t < 0.8 ? 3 : 4);

const HERO_TOOLS: ReadonlyArray<[number, number]> = [
  [0.86, -0.46],
  [0.92, 0],
  [0.86, 0.46],
];

/**
 * Hero: the working orb runs one agent loop. Scattered dots form the orb, three orbits work,
 * one call leaves for a tool and returns transformed, a second evaluation, then the orbits flatten
 * into one ring that locks (halt). Rest: orb + locked ring + the used tool lit + result absorbed.
 */
export function heroScene(t: number, size: number): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const formIn = easeOut(seg(t, 0, 0.16));
  const flat = easeInOut(seg(t, 0.8, 0.94));
  const lock = seg(t, 0.9, 1);
  const yaw = 0.6 + t * 1.2;
  const R = 0.36;
  const nOrb = count(380, c, 160);
  // orb (forms from a loose scatter)
  orb(-0.06, 0, R, nOrb, c.r * 0.95, 0.9, yaw).forEach((d, i) => {
    const sx = Math.cos(i * 2.4) * (0.5 + (i % 7) * 0.07);
    const sy = Math.sin(i * 2.4) * (0.5 + (i % 5) * 0.08);
    dots.push({ ...d, x: lerp(sx, d.x, formIn), y: lerp(sy, d.y, formIn), a: d.a * (0.35 + 0.65 * formIn) });
  });
  // orbits → one flat ring
  const rings = [
    { R: 0.72, inc: 1.15, node: 0.3, lap: 1, park: 0.2 },
    { R: 0.6, inc: 1.3, node: -0.9, lap: -1, park: 2.4 },
    { R: 0.5, inc: 0.95, node: 1.7, lap: 1, park: 4.1 },
  ];
  const ringR = 0.66;
  const work = seg(t, 0.1, 0.8);
  rings.forEach((g, k) => {
    const rr = lerp(g.R, ringR, flat);
    const inc = lerp(g.inc, Math.PI / 2, flat);
    const nodeA = lerp(g.node, 0, flat);
    const m = count(64, c, 28);
    const ringA = (0.3 + 0.15 * k) * formIn * (1 - flat * (k === 0 ? 0 : 1));
    const place = (ang: number): [number, number, number] => {
      const x = Math.cos(ang) * rr;
      const z = Math.sin(ang) * rr;
      const [px, py, pz] = project(x, -z * Math.sin(inc), z * Math.cos(inc), nodeA, lerp(0.25, 0, flat));
      return [px - 0.06, py, pz];
    };
    for (let i = 0; i < m; i++) {
      const [x, y, z] = place((i / m) * TAU);
      dots.push(dot(x, y, c.r * 0.7, ringA * (0.55 + 0.45 * ((z + 1) / 2)), 'dot', z));
    }
    // the part travelling on this orbit
    const ang = g.park + TAU * g.lap * work * 1.5;
    const [px, py, pz] = place(ang);
    const partA = formIn * (1 - flat);
    dots.push(...block(px, py, 2, 2, 0.022, c.r * 1.05, partA, 'dot').map((d) => ({ ...d, z: pz })));
  });
  // locked ring: solid line once halted
  if (lock > 0) lines.push(...circleLines(-0.06, 0, ringR, 72, 0.7 * lock, 'solid', lock));
  // tools on the right: available (dim), the used one lights
  const used = 0;
  HERO_TOOLS.forEach(([x, y], i) => {
    const lit = i === used ? seg(t, 0.42, 0.46) : 0;
    dots.push(...block(x, y, 3, 3, 0.03, c.r * (1 + 0.5 * lit), (0.3 + 0.6 * lit) * formIn));
  });
  // call out (emit) and result back (absorb)
  const [tx, ty] = HERO_TOOLS[used];
  const from: [number, number] = [-0.06 + R * 0.95, -0.12];
  const out = seg(t, 0.3, 0.44);
  if (out > 0 && out < 1) dots.push(...packet((u) => arcPoint(from[0], from[1], tx - 0.05, ty, u, 0.1), easeInOut(out), c.r));
  const back = seg(t, 0.46, 0.6);
  if (back > 0) {
    const e = easeInOut(back);
    for (let i = 0; i < 9; i++) {
      const ox = ((i % 3) - 1) * 0.026;
      const oy = (Math.floor(i / 3) - 1) * 0.026;
      const [bx, by] = arcPoint(tx - 0.08, ty, -0.06 + R * 0.55, -0.08, e, -0.08);
      dots.push(dot(bx + ox * (1 - e * 0.4), by + oy * (1 - e * 0.4), c.r * 1.15, 0.95, 'dot', 1));
    }
  }
  if (out > 0) lines.push(partial(from[0], from[1], tx - 0.06, ty, Math.min(1, out * 1.4), 0.22 * (1 - flat), 'dotted'));
  // halt: the packet drops to the centre
  const drop = seg(t, 0.86, 1);
  if (drop > 0) dots.push(dot(-0.06, lerp(-ringR, 0, easeInOut(drop)), c.r * 2.2, 1, 'dot', 2));
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch1 loop */

export const LOOP_TURN_MS = 1500;

export interface LoopInfo {
  readonly turn: number;
  readonly phase: 'evaluate' | 'tool_call' | 'result' | 'done' | 'error_max_turns';
}

const loopPlan = (maxTurns: number) => {
  const toolTurns = Math.min(maxTurns, LOOP.needed - 1);
  const final = maxTurns >= LOOP.needed;
  const segs = toolTurns + (final ? 1 : 0.5);
  return { toolTurns, final, segs };
};

export function loopInfo(t: number, maxTurns: number): LoopInfo {
  const { toolTurns, final, segs } = loopPlan(maxTurns);
  const x = t * segs;
  const i = Math.min(Math.floor(x), toolTurns + (final ? 0 : -1));
  const u = x - i;
  if (t >= 1) return { turn: final ? LOOP.needed : toolTurns, phase: final ? 'done' : 'error_max_turns' };
  if (i >= toolTurns) return { turn: final ? toolTurns + 1 : toolTurns, phase: final ? (u > 0.7 ? 'done' : 'evaluate') : 'error_max_turns' };
  return { turn: i + 1, phase: u < 0.25 ? 'evaluate' : u < 0.5 ? 'tool_call' : u < 0.62 ? 'result' : 'evaluate' };
}

export const loopDuration = (maxTurns: number): number => loopPlan(maxTurns).segs * LOOP_TURN_MS;

/** Ch1: a packet laps the loop; each lap detours to a tool (one turn). The answer lap halts the ring. */
export function loopScene(t: number, size: number, maxTurns: number): Frame {
  const c = ctxOf(size);
  const { toolTurns, final, segs } = loopPlan(maxTurns);
  const cx = -0.12;
  const cy = -0.08;
  const R = 0.56;
  const tool: [number, number] = [0.84, cy];
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const x = clamp(t) * segs;
  const i = Math.min(Math.floor(x), toolTurns + (final ? 0 : -1));
  const u = t >= 1 ? 1 : x - i;
  const answering = final && i >= toolTurns;
  const halted = answering ? seg(u, 0.7, 1) : 0;
  const errored = !final && t >= 1;
  // model
  dots.push(...orb(cx, cy, 0.15, count(70, c, 30), c.r * 0.85, 0.85, 0.6 + t));
  // ring: dots, a dashed path (pending) that locks solid on halt; broken at 12 o'clock on error
  dots.push(...ring(cx, cy, R, count(40, c, 24), c.r * 0.8, 0.45, errored ? -Math.PI / 2 : undefined, 0.35));
  if (halted > 0) lines.push(...circleLines(cx, cy, R, 60, 0.75 * halted, 'solid', halted));
  else if (!errored) lines.push(...circleLines(cx, cy, R, 60, 0.18, 'dashed'));
  // spoke + tool
  lines.push(line(cx + R, cy, tool[0] - 0.08, cy, 0.25, 'dotted'));
  // packet path
  const at = (ang: number): [number, number] => [cx + Math.cos(ang) * R, cy + Math.sin(ang) * R];
  let p: [number, number];
  let hit = 0;
  if (answering) {
    if (u < 0.7) p = at(-Math.PI / 2 + (u / 0.7) * TAU);
    else {
      const d = easeInOut(seg(u, 0.7, 1));
      p = [cx, lerp(cy - R, cy, d)];
    }
  } else if (errored) {
    p = at(-Math.PI / 2);
  } else if (u < 0.25) p = at(-Math.PI / 2 + (u / 0.25) * (Math.PI / 2));
  else if (u < 0.5) {
    const v = (u - 0.25) / 0.25;
    const out = v < 0.5 ? easeInOut(v * 2) : easeInOut((1 - v) * 2);
    p = [lerp(cx + R, tool[0] - 0.06, out), cy];
    hit = v > 0.4 && v < 0.6 ? 1 : 0;
  } else p = at(((u - 0.5) / 0.5) * (Math.PI * 1.5));
  dots.push(...block(tool[0], tool[1], 3, 3, 0.035, c.r * (1 + 0.4 * hit), 0.45 + 0.5 * hit));
  dots.push(dot(p[0], p[1], c.r * 2.1, 1, errored ? 'hollow' : 'dot', 2));
  // turn markers: filled = used, hollow = allowed but unused
  const used = t >= 1 ? (final ? LOOP.needed : toolTurns) : Math.min(i + 1, maxTurns);
  for (let k = 0; k < maxTurns; k++) {
    const mx = cx + (k - (maxTurns - 1) / 2) * 0.1;
    dots.push(dot(mx, 0.84, c.r * 1.25, k < used ? 0.95 : 0.55, k < used ? 'dot' : 'hollow'));
  }
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch2 tools */

export const TOOLS_MS = 2600;
const TOOL_Y: Readonly<Record<ToolId, number>> = { search: -0.5, read: 0, tests: 0.5 };
export const TOOL_POS = (id: ToolId): [number, number] => [0.66, TOOL_Y[id]];
const ORB2 = { x: -0.5, y: 0, R: 0.24, H: 0.4 };

/** Result shape per tool: search = wide row, read file = tall block, run tests = pass/fail pair. */
function resultShape(tool: ToolId, cx: number, cy: number, r: number, a: number): Dot[] {
  if (tool === 'search') return block(cx, cy, 7, 1, 0.03, r, a);
  if (tool === 'read') return block(cx, cy, 2, 5, 0.03, r, a);
  return [dot(cx - 0.025, cy, r * 1.3, a), dot(cx + 0.025, cy, r * 1.3, a, 'hollow')];
}

export function toolsScene(t: number, size: number, tool: ToolId): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const grow = seg(t, 0.85, 1);
  dots.push(...orb(ORB2.x, ORB2.y, ORB2.R, count(110, c, 50), c.r * 0.85, 0.85, 0.6 + t * 0.8));
  // harness boundary (the application around the model)
  lines.push(...circleLines(ORB2.x, ORB2.y, ORB2.H, 64, 0.35, 'dashed'));
  // three tools; the chosen one pulses when the call lands
  (Object.keys(TOOL_Y) as ToolId[]).forEach((id) => {
    const [x, y] = TOOL_POS(id);
    const on = id === tool;
    const pulse = on ? Math.sin(seg(t, 0.4, 0.52) * Math.PI) : 0;
    dots.push(...block(x, y, 3, 3, 0.04 + 0.01 * pulse, c.r * (1 + 0.35 * pulse), on ? 0.85 : 0.3));
    lines.push(line(ORB2.x + ORB2.H, ORB2.y, x - 0.09, y, on ? 0.28 : 0.1, 'dotted'));
  });
  const [tx, ty] = TOOL_POS(tool);
  const sx = ORB2.x + ORB2.R + 0.02;
  // emit: request with a tail (name + arguments)
  const out = seg(t, 0, 0.4);
  if (out > 0 && out < 1) dots.push(...packet((u) => arcPoint(sx, -0.04, tx - 0.09, ty, u, 0.12), easeInOut(out), c.r));
  // result returns transformed and docks inside the orb
  const back = easeInOut(seg(t, 0.52, 0.88));
  if (t >= 0.52) {
    const [bx, by] = arcPoint(tx - 0.12, ty, ORB2.x + ORB2.R * 0.38, 0.02, back, -0.12);
    dots.push(...resultShape(tool, bx, by, c.r * 1.1, 0.95).map((d) => ({ ...d, z: 1 })));
  }
  if (grow > 0) lines.push(...circleLines(ORB2.x, ORB2.y, ORB2.R + 0.05, 48, 0.25 * grow, 'dotted'));
  return finish(dots, lines);
}

/* ------------------------------------------------------------------ ch3 MCP */

export const MCP_MS = 2400;
export const MCP_ALL_MS = 4200;

const HOST = { x: -0.42, y: 0.04, R: 0.34, belt: 0.2 };
export const SERVER_POS: ReadonlyArray<[number, number]> = [
  [0.22, -0.56],
  [0.22, 0.6],
  [0.86, 0.04],
];
const PORT_ANG = [-0.95, 0.95, 0];
/** Fixed belt slots per tool (5 tools across 3 servers). */
const BELT: ReadonlyArray<ReadonlyArray<number>> = [
  [-1.5, -0.9],
  [1.2],
  [2.4, 3.2],
];
export const MACHINE = { x0: -0.9, y0: -0.86, x1: 0.56, y1: 0.9 };

export type McpChange = number | 'all' | null;

/** Connection progress of server i at t (0 = absent, 1 = wired, discovered, tools on the belt). */
function conn(t: number, i: number, on: readonly boolean[], changed: McpChange): number {
  if (changed === 'all') return on[i] ? seg(t, i * 0.22, i * 0.22 + 0.56) : 0;
  if (changed === i) return on[i] ? t : 1 - t;
  return on[i] ? 1 : 0;
}

export function mcpScene(t: number, size: number, on: readonly boolean[], changed: McpChange): Frame {
  const c = ctxOf(size);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  // this machine (stdio servers live here)
  lines.push(...rectLines(MACHINE.x0, MACHINE.y0, MACHINE.x1, MACHINE.y1, 0.22, 'dashed'));
  // host ring + model + belt track
  dots.push(...orb(HOST.x, HOST.y, 0.1, count(44, c, 20), c.r * 0.8, 0.85, 0.6 + t * 0.6));
  dots.push(...ring(HOST.x, HOST.y, HOST.R, count(44, c, 26), c.r * 0.75, 0.45));
  lines.push(...circleLines(HOST.x, HOST.y, HOST.belt, 40, 0.14, 'dotted'));
  SERVERS.forEach((srv, i) => {
    const k = conn(t, i, on, changed);
    const [sx, sy] = SERVER_POS[i];
    const pa = PORT_ANG[i];
    const px = HOST.x + Math.cos(pa) * HOST.R;
    const py = HOST.y + Math.sin(pa) * HOST.R;
    const remote = srv.transport === 'remote';
    // server node + its primitives (always visible: it exists whether or not the host connects)
    dots.push(...block(sx, sy, 3, 3, 0.032, c.r, 0.35 + 0.55 * seg(k, 0.35, 0.5)));
    let off = 0;
    for (let n = 0; n < srv.prims.tools; n++, off++) dots.push(...toolMark(sx + 0.13 + off * 0.075, sy, 0.024, c.r * 0.8, 0.75));
    for (let n = 0; n < srv.prims.resources; n++, off++) dots.push(...resourceMark(sx + 0.13 + off * 0.075, sy, 0.018, c.r * 0.8, 0.75));
    for (let n = 0; n < srv.prims.prompts; n++, off++) lines.push(...promptMark(sx + 0.13 + off * 0.075, sy, 0.022, 0.75));
    // port on the host ring: one client per server
    const portA = seg(k, 0, 0.15);
    for (let j = -1; j <= 1; j++) {
      const a = pa + j * 0.16;
      dots.push(dot(HOST.x + Math.cos(a) * (HOST.R + 0.045), HOST.y + Math.sin(a) * (HOST.R + 0.045), c.r * 1.05, 0.9 * portA));
    }
    // tether: local short solid (stdio), remote long dashed (Streamable HTTP)
    const draw = easeInOut(seg(k, 0.05, 0.4));
    if (draw > 0) lines.push(partial(px + Math.cos(pa) * 0.06, py + Math.sin(pa) * 0.06, sx - 0.06, sy, draw, 0.75, remote ? 'dashed' : 'solid'));
    // discover: out and back
    const disc = seg(k, 0.4, 0.75);
    if (disc > 0 && disc < 1) {
      const v = disc < 0.5 ? easeInOut(disc * 2) : easeInOut((1 - disc) * 2);
      dots.push(dot(lerp(px, sx - 0.05, v), lerp(py, sy, v), c.r * 1.8, 1, 'dot', 2));
      dots.push(dot(lerp(px, sx - 0.05, clamp(v - 0.06)), lerp(py, sy, clamp(v - 0.06)), c.r, 0.6, 'dot', 2));
    }
    // tools slide onto the belt
    const belt = easeInOut(seg(k, 0.7, 1));
    BELT[i].forEach((ang, n) => {
      if (belt <= 0) return;
      const bx = HOST.x + Math.cos(ang) * HOST.belt;
      const by = HOST.y + Math.sin(ang) * HOST.belt;
      const fx = sx + 0.13 + n * 0.075;
      dots.push(...toolMark(lerp(fx, bx, belt), lerp(sy, by, belt), 0.022, c.r * 0.85, 0.95 * belt));
    });
  });
  return finish(dots, lines);
}

/** Readout helper: where in the connect beat a single change is. */
export const mcpPhase = (t: number): 'connect' | 'discover' | 'list' | 'ready' =>
  t < 0.4 ? 'connect' : t < 0.75 ? 'discover' : t < 1 ? 'list' : 'ready';
