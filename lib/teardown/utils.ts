export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export const smoothstep = (x: number) => x * x * (3 - 2 * x);

/** ease-out cubic — used for registered-layer choreography */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const MOBILE_MAX_WIDTH = 820;

export function pickResponsiveWidth(): number {
  if (typeof window === 'undefined') return 1700;
  const w = window.innerWidth;
  if (w <= MOBILE_MAX_WIDTH) return 760;
  if (w <= 1100) return 1100;
  return 1700;
}
