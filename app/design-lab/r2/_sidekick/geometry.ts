/**
 * SIDEKICK stack geometry, shared by both worlds. Units are "stack mm": the container is STACK_W wide and
 * STACK_H tall, and real boards keep their true relative size (carrier 49 × 41 mm, fingerprint 22.81 × 26.12 mm).
 * Modules without a board file (sensor, compute, planned) get nominal footprints and are drawn dotted/dashed
 * so they never read as real outlines.
 */
import type { ModuleId } from '../_content/sidekick';

export const STACK_W = 112;
export const STACK_H = 184;
/** Centre of the top tier and the spacing between tier centres when fully open / fully collapsed. */
export const TOP = 18;
export const OPEN = 37;
export const COLLAPSED = 10;

export interface TierSpec {
  readonly id: ModuleId;
  /** Board (or nominal) footprint in mm, used for the iso projection. */
  readonly w: number;
  readonly h: number;
  /** Per-tier explode gap for the active board's own layers (user units = board mm). */
  readonly subGap: number;
}

export const TIERS: readonly TierSpec[] = [
  { id: 'fingerprint', w: 22.81, h: 26.12, subGap: 4.2 },
  { id: 'sensor', w: 26, h: 20, subGap: 0 },
  { id: 'carrier', w: 49, h: 41, subGap: 5.5 },
  { id: 'compute', w: 40, h: 30, subGap: 0 },
  { id: 'planned', w: 40, h: 40, subGap: 0 },
];

/** Projected iso width of a w × h footprint, plus BoardSvg's 4% frame pad on each side. */
export function isoWidth(w: number, h: number): number {
  return 0.866 * (w + h) + 0.08 * Math.max(w, h);
}

export function isoHeight(w: number, h: number): number {
  return 0.5 * (w + h) + 0.08 * Math.max(w, h);
}

/** Tier centre (stack mm) when fully open: the static, no-JS, reduced-motion pose. */
export function openCentre(i: number): number {
  return TOP + i * OPEN;
}

/**
 * Vertical offset (stack mm) from the open pose for tier i at drive position p (0 … tiers).
 * Gap k (under tier k) opens while p runs k → k + 1, so the explode itself is the progress bar.
 */
export function tierOffset(i: number, p: number): number {
  let closed = 0;
  for (let k = 0; k < i; k++) closed += 1 - clamp01(p - k);
  return -closed * (OPEN - COLLAPSED);
}

/** The active board's own explode: rises over the first half of its entry, holds, then folds back at the end. */
export function subExplode(i: number, p: number): number {
  const f = p - i;
  if (f <= 0 || f >= 1) return 0;
  return clamp01(f * 2.2) * (1 - clamp01((f - 0.86) * 7));
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
