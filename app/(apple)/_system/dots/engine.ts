/**
 * DIGITAL round-2 dot engine. One pure, deterministic function:
 *
 *   frame(verb, t, opts) → { dots, lines }
 *
 * t in [0, 1]; t = 1 is every verb's REST pose (SSR, reduced motion, no-JS, paused).
 * Same inputs → same output on server and client (integer hashing, no Math.random).
 * Consumed by <DotGlyph> (SVG) and <DotStage> (2D canvas).
 */
import { absorb, bud, compress, emit, evict, fill, halt, merge, pin, route, tether } from './verbs-agentic';
import { explode, fixate, form, hold, orbit, pulse, scramble, seat, settle, wire } from './verbs-build';
import { clamp, seedOf } from './math';
import type { Dot, Frame, FrameFn, FrameOpts, Verb, VerbContext } from './types';

export const REST_T = 1;
export const MAX_DOTS = 1200;

export interface VerbSpec {
  readonly verb: Verb;
  readonly family: 'build' | 'agentic';
  /** Display name (scramble shows its full arc). */
  readonly label: string;
  /** What the dots do. */
  readonly motion: string;
  /** The real project / system state this verb stands for. Glyphs appear only beside a real state value. */
  readonly means: string;
  /** What t = 1 looks like. */
  readonly rest: string;
  /** Default time-drive duration, ms. */
  readonly duration: number;
  /** t = 0 equals t = 1: the verb can loop seamlessly. */
  readonly cyclic: boolean;
  readonly fn: FrameFn;
}

export const VERBS: readonly VerbSpec[] = [
  { verb: 'form', family: 'build', label: 'form', motion: 'A loose ring settles onto a shape', means: 'Plan: scope is being drawn', rest: 'Target shape, dotted', duration: 2400, cyclic: false, fn: form },
  { verb: 'orbit', family: 'build', label: 'orbit', motion: 'Parts circle on tilted orbits', means: 'Prototype: parts in progress', rest: 'Three parts parked on their orbits', duration: 3200, cyclic: true, fn: orbit },
  { verb: 'scramble', family: 'build', label: 'scramble → solve', motion: 'Bands turn out of place, then click back', means: 'Test: verification before merge', rest: 'Aligned rows', duration: 2800, cyclic: true, fn: scramble },
  { verb: 'wire', family: 'build', label: 'wire', motion: 'Nodes move home and connect', means: 'Integrate: subsystems joined', rest: 'One connected graph', duration: 2400, cyclic: false, fn: wire },
  { verb: 'explode', family: 'build', label: 'explode', motion: 'Layers separate along one axis', means: 'Teardown: the scope revealed', rest: 'Fully exploded stack', duration: 2400, cyclic: false, fn: explode },
  { verb: 'pulse', family: 'build', label: 'pulse', motion: 'A packet runs a leader from A to B', means: 'Handoff: one review path', rest: 'Packet at B, leader solid', duration: 2000, cyclic: false, fn: pulse },
  { verb: 'fixate', family: 'build', label: 'fixate', motion: 'Scattered dots converge on one point', means: 'Focus: reading one word (RSVP)', rest: 'One point inside a reticle', duration: 2400, cyclic: false, fn: fixate },
  { verb: 'seat', family: 'build', label: 'seat', motion: 'The ring turns; one slot opens', means: 'Open role: a subsystem without an owner', rest: 'Dashed slot in a ring of seats', duration: 2000, cyclic: false, fn: seat },
  { verb: 'hold', family: 'build', label: 'hold', motion: 'Dots drift in place, no progress', means: 'Blocked: needs an owner', rest: 'Lattice at 40% ink', duration: 3200, cyclic: true, fn: hold },
  { verb: 'settle', family: 'build', label: 'settle', motion: 'Jitter stops; the outline goes solid', means: 'Done: shipped, with a source', rest: 'Solid closed form', duration: 2000, cyclic: false, fn: settle },
  { verb: 'emit', family: 'agentic', label: 'emit', motion: 'A call leaves the model toward a tool', means: 'Tool call requested', rest: 'Packet arrived at the tool', duration: 1800, cyclic: false, fn: emit },
  { verb: 'absorb', family: 'agentic', label: 'absorb', motion: 'The result returns as a cluster and merges', means: 'Tool result fed back', rest: 'Orb grown by the result', duration: 2000, cyclic: false, fn: absorb },
  { verb: 'fill', family: 'agentic', label: 'fill', motion: 'Fixed slots fill in order', means: 'Context window accumulating', rest: 'Window filled to its level', duration: 2600, cyclic: false, fn: fill },
  { verb: 'pin', family: 'agentic', label: 'pin', motion: 'The top band gets outlined', means: 'System prompt / cached prefix kept', rest: 'Top band outlined', duration: 1600, cyclic: false, fn: pin },
  { verb: 'evict', family: 'agentic', label: 'evict', motion: 'Oldest dots exit; their slots stay empty', means: 'Context overflow: detail dropped', rest: 'Empty outlined slots', duration: 2000, cyclic: false, fn: evict },
  { verb: 'compress', family: 'agentic', label: 'compress', motion: 'A spread group collapses into a dense cluster', means: 'Compaction: history summarised', rest: 'Dense cluster past a boundary', duration: 2200, cyclic: false, fn: compress },
  { verb: 'bud', family: 'agentic', label: 'bud', motion: 'Child orbs split off the parent', means: 'Subagents start with clean windows', rest: 'Three children apart', duration: 2200, cyclic: false, fn: bud },
  { verb: 'merge', family: 'agentic', label: 'merge', motion: 'Children shrink to one dot and return', means: 'Subagents report a summary', rest: 'Three summary dots on the parent', duration: 2400, cyclic: false, fn: merge },
  { verb: 'route', family: 'agentic', label: 'route / gate', motion: 'A call meets the gate: pass, hold or bounce', means: 'Harness permission check', rest: 'Call past the gate (or held, or bounced)', duration: 2200, cyclic: false, fn: route },
  { verb: 'halt', family: 'agentic', label: 'halt', motion: 'The packet laps, drops in, the ring locks', means: 'Loop ends: no more tool calls', rest: 'Packet centred, ring solid', duration: 2600, cyclic: false, fn: halt },
  { verb: 'tether', family: 'agentic', label: 'tether', motion: 'A host port links to a server', means: 'MCP transport: local stdio or remote HTTP', rest: 'Link drawn', duration: 1800, cyclic: false, fn: tether },
];

const BY_VERB: Readonly<Record<Verb, VerbSpec>> = Object.fromEntries(VERBS.map((v) => [v.verb, v])) as Record<Verb, VerbSpec>;

export const verbSpec = (verb: Verb): VerbSpec => BY_VERB[verb];

/** Base dot radius (px) for a rendered size: sub-linear so small glyphs stay legible. */
export const baseRadius = (size: number): number => 0.5 + size * 0.0029;

export function context(opts: FrameOpts = {}): VerbContext {
  const size = Math.max(16, Math.min(800, opts.size ?? 160));
  const d = clamp((size / 160) * (opts.density ?? 1), 0.2, 4.2);
  return { opts, seed: seedOf(opts.seed), size, d, r: baseRadius(size) };
}

/**
 * The engine. Pure and deterministic. Dots come back z-sorted far → near and capped at MAX_DOTS.
 */
export function frame(verb: Verb, t: number, opts: FrameOpts = {}): Frame {
  const spec = BY_VERB[verb];
  const tt = clamp(Number.isFinite(t) ? t : REST_T);
  const out = spec.fn(tt, context(opts));
  const dots: Dot[] = out.dots.filter((p) => p.a > 0.01 && p.r > 0);
  if (dots.length > MAX_DOTS) dots.length = MAX_DOTS;
  dots.sort((p, q) => p.z - q.z || (p.kind === 'anchor' ? 1 : 0) - (q.kind === 'anchor' ? 1 : 0));
  return { dots, lines: out.lines.filter((l) => l.a > 0.01) };
}

/** Rest pose shorthand. */
export const restFrame = (verb: Verb, opts?: FrameOpts): Frame => frame(verb, REST_T, opts);
