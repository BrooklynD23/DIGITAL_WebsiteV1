/**
 * Round-2 cinematics manifest (W1-CINE). Procedural clips rendered with Remotion from
 * design-lab/motion-reel/src/r2 (shared dot engine + real KiCad board geometry).
 * Files live in public/design-lab/r2/cine/. Docs: design-lab/round2/system/CINE.md.
 *
 * Clip names are a contract: page agents reference clips by name only.
 * `ready: false` means the files are not rendered yet; <CineClip> then shows its fallback.
 * Server-safe (no 'use client'): import CINE anywhere.
 */

export type CineName =
  | 'home-stages'
  | 'sidekick-explode'
  | 'sidekick-swap'
  | 'shades-lightpath'
  | 'shades-fixate'
  | 'brain-orb'
  | 'brain-context';

/** once = play once on viewport entry · scrub = currentTime follows a progress prop · loop = hero background with pause control. */
export type CineMode = 'once' | 'scrub' | 'loop';

export interface CineSources {
  readonly mp4: string;
  readonly webm: string;
}

export interface CineEntry {
  /** 1920×1080 */
  readonly src16x9: CineSources;
  /** 1080×1350, picked under 640px */
  readonly src4x5: CineSources;
  /** Rest/final frame, 16:9 (webp). Shown before play, without JS and under reduced motion. */
  readonly poster: string;
  /** Rest/final frame, 4:5 (webp). */
  readonly poster4x5: string;
  /** Seconds. */
  readonly duration: number;
  /** Default playback mode for this clip. */
  readonly mode: CineMode;
  /** Accessible description of what the clip shows (pages may override with their own label). */
  readonly label: string;
  /** False until the files exist in public/design-lab/r2/cine/. */
  readonly ready: boolean;
}

export const CINE_BASE = '/design-lab/r2/cine';

function entry(
  name: CineName,
  duration: number,
  mode: CineMode,
  label: string,
  ready: boolean,
): CineEntry {
  const f = (suffix: string): string => `${CINE_BASE}/${name}-${suffix}`;
  return {
    src16x9: { mp4: f('16x9.mp4'), webm: f('16x9.webm') },
    src4x5: { mp4: f('4x5.mp4'), webm: f('4x5.webm') },
    poster: f('poster.webp'),
    poster4x5: f('poster-4x5.webp'),
    duration,
    mode,
    label,
    ready,
  };
}

export const CINE: Readonly<Record<CineName, CineEntry>> = {
  'home-stages': entry(
    'home-stages',
    6,
    'once',
    'Illustrative: dots move through four stages, plan, prototype, test and integrate, ending as one connected graph.',
    true,
  ),
  'sidekick-explode': entry(
    'sidekick-explode',
    6,
    'scrub',
    'The SIDEKICK power carrier and fingerprint boards, drawn from their real PCB files, separating into copper, silkscreen and outline layers.',
    true,
  ),
  'sidekick-swap': entry(
    'sidekick-swap',
    4,
    'once',
    'A module slides out of the SIDEKICK board stack and back into place.',
    true,
  ),
  'shades-lightpath': entry(
    'shades-lightpath',
    6,
    'scrub',
    'The SHADES signal path: text, word timing, control, display, optics, ending at the eye’s fixation point.',
    true,
  ),
  'shades-fixate': entry(
    'shades-fixate',
    4,
    'once',
    'Scattered dots converge on a single fixation point, where one word appears.',
    true,
  ),
  'brain-orb': entry(
    'brain-orb',
    6,
    'loop',
    'Illustrative: a dot orb forms and wires itself to the tools around it.',
    true,
  ),
  'brain-context': entry(
    'brain-context',
    5,
    'scrub',
    'Illustrative: a fixed-slot context lattice fills, evicts its oldest slots, then compresses a group into a summary.',
    true,
  ),
};

export const CINE_NAMES = Object.keys(CINE) as readonly CineName[];
