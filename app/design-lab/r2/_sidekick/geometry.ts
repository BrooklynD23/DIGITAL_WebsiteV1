/**
 * SIDEKICK stack geometry, shared by both worlds. Units are "stack mm": the container is STACK_W × STACK_H.
 * Real boards keep their true relative size (carrier 49 × 41 mm, fingerprint 22.81 × 26.12 mm). Modules without a
 * board file (sensor, compute, planned) and the never-started phone shell get nominal footprints and are drawn
 * dotted / dashed / struck so they never read as real outlines.
 * The art is centred at ART_CX; the locked name list sits in a column from LABEL_X to STACK_W.
 */
import type { ModuleId } from '../_content/sidekick';

export const STACK_W = 220;
export const STACK_H = 276;
export const ART_CX = 64;
export const LABEL_X = 134;

/** Front shell centre, shell-to-module spacing, module spacing open / collapsed. */
export const SHELL_TOP = 40;
export const SHELL_GAP = 31;
export const OPEN = 34;
export const COLLAPSED = 9;

export type TierId = ModuleId | 'shell-front' | 'shell-back';

export interface TierSpec {
  readonly id: TierId;
  /** Module index 0..4; -1 = front shell (always top), 5 = back shell (moves with the last gap). */
  readonly slot: number;
  /** Board (or nominal) footprint in mm, used for the iso projection. */
  readonly w: number;
  readonly h: number;
  /** Explode gap for the active board's own layers (board mm). 0 = no layers. */
  readonly subGap: number;
}

export const SHELL = { w: 44, h: 90 } as const;

export const TIERS: readonly TierSpec[] = [
  { id: 'shell-front', slot: -1, w: SHELL.w, h: SHELL.h, subGap: 0 },
  { id: 'fingerprint', slot: 0, w: 22.81, h: 26.12, subGap: 4.2 },
  { id: 'sensor', slot: 1, w: 26, h: 20, subGap: 0 },
  { id: 'carrier', slot: 2, w: 49, h: 41, subGap: 5.5 },
  { id: 'compute', slot: 3, w: 40, h: 30, subGap: 0 },
  { id: 'planned', slot: 4, w: 40, h: 40, subGap: 0 },
  { id: 'shell-back', slot: 5, w: SHELL.w, h: SHELL.h, subGap: 0 },
];

/** Number of module entries the drive walks (shells ride along). */
export const MODULE_COUNT = 5;

/** Projected iso width / height of a w × h footprint, plus a 4% frame pad on each side. */
export function isoWidth(w: number, h: number): number {
  return 0.866 * (w + h) + 0.08 * Math.max(w, h);
}

export function isoHeight(w: number, h: number): number {
  return 0.5 * (w + h) + 0.08 * Math.max(w, h);
}

/** Tier centre (stack mm) when fully open: the static, no-JS, reduced-motion pose. */
export function openCentre(slot: number): number {
  if (slot < 0) return SHELL_TOP;
  const top = SHELL_TOP + SHELL_GAP;
  if (slot >= MODULE_COUNT) return top + (MODULE_COUNT - 1) * OPEN + SHELL_GAP;
  return top + slot * OPEN;
}

/**
 * Vertical offset (stack mm) from the open pose for a slot at drive position p (0 … 5).
 * Gap k (under module k) opens while p runs k → k + 1, so the explode itself is the progress bar.
 */
export function tierOffset(slot: number, p: number): number {
  if (slot <= 0) return 0;
  let closed = 0;
  for (let k = 0; k < Math.min(slot, MODULE_COUNT - 1); k++) closed += 1 - clamp01(p - k);
  return -closed * (OPEN - COLLAPSED);
}

/** The active board's own explode: rises over the first half of its entry, holds, then folds back at the end. */
export function subExplode(slot: number, p: number): number {
  const f = p - slot;
  if (f <= 0 || f >= 1) return 0;
  return clamp01(f * 2.2) * (1 - clamp01((f - 0.86) * 7));
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
