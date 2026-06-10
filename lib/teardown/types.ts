export interface TeardownState {
  /** scroll progress 0..1 at which this state activates */
  at: number;
  /** small mono label, e.g. "LAYER 04 — FRAME" */
  label: string;
  /** big accent margin note, e.g. "frame out." */
  note: string;
}

export interface FrameAdjust {
  dx: number;
  dy: number;
  scale: number;
}

export interface RegisteredLayer {
  id: string;
  /** Asset basename under /assets/layers/ */
  asset: string;
  label: string;
  note: string;
  /** Scroll progress window — layer peels and settles inside [start, end]. */
  start: number;
  end: number;
  /** Resting separation along the explosion axis (px at full progress). */
  dx: number;
  dy: number;
  /** 0 = back anchor, 1 = front — scales travel distance for parallax. */
  depth: number;
}

export type TeardownRenderer = 'sequence' | 'registered';

export interface TeardownConfig {
  renderer: TeardownRenderer;
  frameCount: number;
  framePath: (i: number, width?: number) => string;
  posterPath: (width?: number) => string;
  /** sticky-track length; larger = slower scrub */
  pinLen: string;
  /** Lenis-style lerp weight; higher = less scroll lag */
  lerp: number;
  /** Fraction of each frame segment spent on hold before crossfade (sequence only). */
  hold: number;
  /** Per-frame registration offsets (sequence only — temporary stopgap). */
  frameAdjust: FrameAdjust[];
  states: TeardownState[];
  layers: RegisteredLayer[];
  /** Enable Lenis smooth scroll on desktop scrub */
  smoothScroll: boolean;
}
