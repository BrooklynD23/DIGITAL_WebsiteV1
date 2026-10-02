/**
 * Dot engine types. A frame is a complete set of draw instructions in a
 * normalised square: x, y in [-1, 1] (0 = centre, +y = down), z in [-1, 1]
 * (+z = toward the viewer). Radii are in CSS px for the requested `size`.
 * Renderers only map coordinates; they never re-derive geometry.
 */

export type BuildVerb =
  | 'form'
  | 'orbit'
  | 'scramble'
  | 'wire'
  | 'explode'
  | 'pulse'
  | 'fixate'
  | 'seat'
  | 'hold'
  | 'settle';

export type AgenticVerb =
  | 'emit'
  | 'absorb'
  | 'fill'
  | 'pin'
  | 'evict'
  | 'compress'
  | 'bud'
  | 'merge'
  | 'route'
  | 'halt'
  | 'tether';

export type Verb = BuildVerb | AgenticVerb;

/** `dot` = filled ink, `hollow` = outlined slot, `anchor` = the single red trigger marker. */
export type DotKind = 'dot' | 'hollow' | 'anchor';

export interface Dot {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  /** Radius in CSS px. */
  readonly r: number;
  /** Ink opacity 0..1 (depth shading already applied). */
  readonly a: number;
  readonly kind: DotKind;
}

/** Line form carries state: solid = live/owned, dashed = pending/boundary, dotted = leader/planned. */
export type LineForm = 'solid' | 'dashed' | 'dotted';

export interface Line {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly a: number;
  readonly form: LineForm;
}

export interface Frame {
  readonly dots: readonly Dot[];
  readonly lines: readonly Line[];
}

export type Shape = 'circle' | 'triangle' | 'square' | 'hex';
export type RouteOutcome = 'pass' | 'hold' | 'reject';
export type TetherKind = 'local' | 'remote';

export interface FrameOpts {
  /** Deterministic seed. Same (verb, t, opts) → identical frame, on server and client. */
  readonly seed?: number | string;
  /** Rendered size in CSS px (sets dot radii and default dot counts). Default 160. */
  readonly size?: number;
  /** Density multiplier on the verb's default count. Default 1. Total is capped at 1,200. */
  readonly density?: number;
  /** form / settle target. Default triangle (form), square (settle). */
  readonly shape?: Shape;
  /** explode: number of layers. Default 5. */
  readonly layers?: number;
  /** fill: level reached at rest, 0..1. Default 0.72. */
  readonly level?: number;
  /** route: what the gate does with the call. Default pass. */
  readonly outcome?: RouteOutcome;
  /** tether: local (stdio, short solid) or remote (HTTP, long dashed). Default local. */
  readonly kind?: TetherKind;
  /** Draw the single red trigger dot at the verb's "here / now / open" point. Default false. */
  readonly anchor?: boolean;
}

export type FrameFn = (t: number, ctx: VerbContext) => Frame;

/** Resolved per-call context handed to each verb. */
export interface VerbContext {
  readonly opts: FrameOpts;
  readonly seed: number;
  readonly size: number;
  /** Count scale from size × density (1 at 160px). */
  readonly d: number;
  /** Base dot radius (px) for this size. */
  readonly r: number;
}
