import { phoneV2Copy } from '@/lib/data/phoneV2';

/**
 * Sequencing config for the boot loader.
 *
 * The loader renders a TickScrubber with one tick per subsystem and the label
 * "Boot". This file gives those ticks something to count: the seven sections in
 * `phoneV2Copy.subsystemSections` become seven boot stages, each drawing in the
 * parts that subsystem owns and carrying its accent.
 *
 * Ownership rule (same as subsystemLoops.ts): anime.js may animate elements
 * *inside* a part group — strokes, via `svg.createDrawable`, which writes
 * stroke-dasharray/stroke-dashoffset ATTRIBUTES. A part group's own opacity
 * belongs to CSS and its own transform belongs to React, both in
 * PhoneSchematicSvg. Writing either from motion code puts anime.js in a race
 * with React's inline styles.
 */

/** Timing budget. Sums to TIMELINE_MS; mirrored in docs/design/smartphone.DESIGN.md. */
export const OPEN_MS = 260;
export const STAGE_MS = 320;
export const CLOSE_MS = 300;
export const OUTRO_FADE_MS = 220;

/** Scrolling accelerates playback rather than cutting the sequence short. */
export const FAST_FORWARD_RATE = 4;

/** Distance in px a pointer must travel before a tap is reclassified as a drag. */
export const DRAG_THRESHOLD_PX = 8;

const sections = phoneV2Copy.subsystemSections;

export const STAGE_COUNT = sections.length;
export const STAGES_MS = STAGE_MS * STAGE_COUNT;
export const TIMELINE_MS = OPEN_MS + STAGES_MS + CLOSE_MS;

/**
 * The loader ramps explode *up* while the subsystem stage ramps it down: the
 * stage reassembles the phone, the loader takes it apart. Ending at the section
 * maximum matches Hero's `progress={0.96}`, so the handoff is seamless.
 */
export const EXPLODE_START = Math.min(...sections.map((section) => section.explode));
export const EXPLODE_END = Math.max(...sections.map((section) => section.explode));

/**
 * Parts drawn at a stage beyond the ones that stage's subsystem owns.
 *
 * Deduping `activePartIds` by first appearance covers only 10 of the 14 part
 * groups and leaves stage 4 with nothing new to draw. These entries complete the
 * set so the phone is fully drawn by the last beat. This is motion config, not
 * copy, so it lives beside the loader rather than in lib/data.
 */
const LOADER_STAGE_EXTRA_PARTS: Readonly<Record<number, readonly string[]>> = {
  1: ['phone-camera-module'],
  2: ['phone-antenna-module'],
  4: ['phone-speakers', 'phone-buttons'],
};

export interface LoaderStage {
  readonly id: string;
  readonly accent: string;
  /** Parts lit at this stage — drives CSS `data-active` via PhoneSchematicSvg. */
  readonly activePartIds: readonly string[];
  readonly scrubberLabel: string;
  /** Parts whose strokes draw in at this stage. Each part appears exactly once. */
  readonly drawPartIds: readonly string[];
}

function buildStages(): readonly LoaderStage[] {
  const drawn = new Set<string>();

  return sections.map((section, index) => {
    const fresh = [
      ...section.activePartIds,
      ...(LOADER_STAGE_EXTRA_PARTS[index] ?? []),
    ].filter((partId) => {
      if (drawn.has(partId)) return false;
      drawn.add(partId);
      return true;
    });

    return {
      id: section.id,
      accent: section.accent,
      activePartIds: section.activePartIds,
      scrubberLabel: section.scrubberLabel,
      drawPartIds: fresh,
    };
  });
}

export const LOADER_STAGES = buildStages();

export function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

export function clampInt(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** CSS `cubic-bezier(0.65, 0, 0.35, 1)` equivalent — eases both ends of the bloom. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Collect the stroked elements of each stage's parts, in stage order.
 *
 * Buckets may be empty: `phone-screws` is six accent-filled dots with no
 * strokes, so it has nothing to draw. It still reads as arriving at its stage,
 * because the schematic's own CSS holds inactive fills at `fill-opacity: 0.08`
 * until `data-active` flips.
 */
export function collectStageStrokes(root: SVGSVGElement): readonly SVGGeometryElement[][] {
  return LOADER_STAGES.map((stage) =>
    stage.drawPartIds.flatMap((partId) => {
      const group = root.querySelector(`#${partId}`);
      if (!group) return [];
      return Array.from(group.querySelectorAll<SVGGeometryElement>('[stroke]')).filter(
        (element) => element.getAttribute('stroke') !== 'none'
      );
    })
  );
}
