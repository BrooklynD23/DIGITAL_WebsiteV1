/**
 * Round-2 motion tokens (shared by both worlds).
 * UI state: Apple 240–320 ms, cubic-bezier(0.4, 0, 0.6, 1).
 * Reveal: 30 px + fade, scroll-linked (see .r2-reveal in worlds.css).
 * Springs: Material 3 Expressive (androidx ExpressiveMotionTokens), mass 1,
 *   damping coefficient = 2 · ζ · √stiffness, for `motion/react` transitions.
 */

export const EASE = {
  /** Apple UI state change. */
  ui: [0.4, 0, 0.6, 1] as const,
  /** M3 emphasized / standard (reveals, settle). */
  emphasized: [0.2, 0, 0, 1] as const,
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
} as const;

export const cssBezier = (e: readonly [number, number, number, number]): string => `cubic-bezier(${e.join(', ')})`;

export const DURATION = {
  /** Colour / opacity snap. */
  snap: 120,
  uiFast: 240,
  ui: 280,
  uiSlow: 320,
  /** Glyph draw-on (Apple: 400–600 ms, once). */
  draw: 480,
  /** Dot-engine settle after stop(). */
  settle: 450,
} as const;

export const REVEAL = {
  /** translateY at the start of a reveal, px. Never more than 30–48. */
  y: 30,
  /** view() range: starts as the element enters, done by 30% cover. */
  range: 'entry 0% cover 30%',
} as const;

/** ζ (damping ratio) + stiffness → motion/react spring. */
export interface M3Spring {
  readonly dampingRatio: number;
  readonly stiffness: number;
}

export const m3 = (s: M3Spring) =>
  ({
    type: 'spring',
    stiffness: s.stiffness,
    damping: Math.round(2 * s.dampingRatio * Math.sqrt(s.stiffness) * 100) / 100,
    mass: 1,
  }) as const;

/** Raw M3 Expressive values. */
export const M3 = {
  spatialFast: { dampingRatio: 0.6, stiffness: 800 },
  spatial: { dampingRatio: 0.8, stiffness: 380 },
  spatialSlow: { dampingRatio: 0.8, stiffness: 200 },
  effects: { dampingRatio: 1, stiffness: 800 },
} as const satisfies Record<string, M3Spring>;

/**
 * Ready-made `transition` objects for motion/react.
 * spatial* may overshoot (position, size, rotation). effects never overshoots (opacity, colour).
 */
export const SPRING = {
  /** Buttons, switches, small moves. ζ 0.6 / k 800 → damping 33.94. */
  spatialFast: m3(M3.spatialFast),
  /** Default: cards, sheets, mid moves. ζ 0.8 / k 380 → damping 31.19. */
  spatial: m3(M3.spatial),
  /** Large hero moves. ζ 0.8 / k 200 → damping 22.63. */
  spatialSlow: m3(M3.spatialSlow),
  /** Opacity / colour. ζ 1.0 / k 800 → damping 56.57 (critically damped). */
  effects: m3(M3.effects),
} as const;

/**
 * Sample a damped spring into a CSS `linear()` easing (no JS at runtime).
 * Returns the easing string plus the duration (ms) at which it settles.
 */
export function springToLinear(s: M3Spring, samples = 32): { easing: string; duration: number } {
  const w0 = Math.sqrt(s.stiffness);
  const z = s.dampingRatio;
  const x = (tm: number): number => {
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w0 * tm) * (Math.cos(wd * tm) + ((z * w0) / wd) * Math.sin(wd * tm));
    }
    return 1 - Math.exp(-w0 * tm) * (1 + w0 * tm);
  };
  let end = 0.05;
  while (end < 3) {
    let settled = true;
    for (let k = 0; k <= 10; k++) if (Math.abs(1 - x(end + k * 0.01)) > 0.002) settled = false;
    if (settled) break;
    end += 0.01;
  }
  const pts = Array.from({ length: samples + 1 }, (_, i) => Math.round(x((end * i) / samples) * 1000) / 1000);
  pts[samples] = 1;
  return { easing: `linear(${pts.join(', ')})`, duration: Math.round(end * 1000) };
}
