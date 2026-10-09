/**
 * Round-2 cinematics manifest (W1-CINE, W3a). Procedural clips rendered with Remotion from
 * design-lab/motion-reel/src/r2 (shared dot engine + real KiCad board geometry).
 * Files live in public/cine/. Docs: design-lab/round2/system/CINE.md.
 *
 * Clip names are a contract: page agents reference clips by name only.
 * Each clip exists in two worlds:
 *   signal — #0b0c0a ground, bone ink (files <name>-16x9.mp4 …)          ← also the legacy top-level fields
 *   apple  — #000 ground, Apple greys, copper boards (files <name>-apple-16x9.mp4 …)
 * `ready: false` means the files are not rendered yet; <CineClip> then shows its fallback.
 * Server-safe (no 'use client'): import CINE anywhere.
 */

/** Trimmed to the live clips when the lab rounds were archived (2026-10-07); the other six clips and every
 *  Signal-world file are in archive/public/design-lab/r2/cine/. */
export type CineName = 'shades-fixate';

/** once = play once on viewport entry · scrub = currentTime follows progress · loop = hero background with pause control. */
export type CineMode = 'once' | 'scrub' | 'loop';

export type CineWorld = 'signal' | 'apple';

export interface CineSources {
  readonly mp4: string;
  readonly webm: string;
}

/** One world's files. */
export interface CineVariant {
  /** 1920×1080 (scrub clips may be 1280×720: all-intra encodes, see CINE.md) */
  readonly src16x9: CineSources;
  /** 1080×1350 (scrub clips may be 864×1080), picked under 640px */
  readonly src4x5: CineSources;
  /** Rest/final frame, 16:9 (webp). Shown before play, without JS and under reduced motion. */
  readonly poster: string;
  /** Rest/final frame, 4:5 (webp). */
  readonly poster4x5: string;
  /** The clip's ground colour: match it behind the clip so no box shows. */
  readonly ground: string;
}

/** A named moment in the clip, `at` = fraction of the duration (0..1). Use to sync captions to progress. */
export interface CineMarker {
  readonly id: string;
  readonly at: number;
}

export interface CineEntry extends CineVariant {
  /** Per-world files. The top-level CineVariant fields equal worlds.signal (legacy shape). */
  readonly worlds: Readonly<Record<CineWorld, CineVariant>>;
  /** Seconds. */
  readonly duration: number;
  /** Authored playback mode for this clip. */
  readonly mode: CineMode;
  /** Accessible description of what the clip shows (pages may override with their own label). */
  readonly label: string;
  /** Moments to sync page captions to (ascending by `at`). */
  readonly markers: readonly CineMarker[];
  /** <source> order. Scrub clips are all-intra H.264 first (VP9 intra is the H.264-less fallback). */
  readonly order: 'webm-first' | 'mp4-first';
  /** False until the files exist in public/cine/. */
  readonly ready: boolean;
}

export const CINE_BASE = '/cine';

const GROUND: Readonly<Record<CineWorld, string>> = { signal: '#0b0c0a', apple: '#000000' };

function variant(name: CineName, world: CineWorld): CineVariant {
  const stem = world === 'signal' ? name : `${name}-${world}`;
  const f = (suffix: string): string => `${CINE_BASE}/${stem}-${suffix}`;
  return {
    src16x9: { mp4: f('16x9.mp4'), webm: f('16x9.webm') },
    src4x5: { mp4: f('4x5.mp4'), webm: f('4x5.webm') },
    poster: f('poster.webp'),
    poster4x5: f('poster-4x5.webp'),
    ground: GROUND[world],
  };
}

type MarkerPair = readonly [string, number];
const m = (pairs: ReadonlyArray<MarkerPair>): readonly CineMarker[] =>
  [...pairs].sort((a, b) => a[1] - b[1]).map(([id, at]) => ({ id, at }));

function entry(
  name: CineName,
  duration: number,
  mode: CineMode,
  label: string,
  markers: readonly CineMarker[],
  ready = true,
): CineEntry {
  const signal = variant(name, 'signal');
  return {
    ...signal,
    worlds: { signal, apple: variant(name, 'apple') },
    duration,
    mode,
    label,
    markers,
    order: mode === 'scrub' ? 'mp4-first' : 'webm-first',
    ready,
  };
}

// Marker values = clip frame / total frames (30 fps), taken from design-lab/motion-reel/src/r2/clips/*.
export const CINE: Readonly<Record<CineName, CineEntry>> = {
  'shades-fixate': entry(
    'shades-fixate',
    4,
    'once',
    'Scattered dots converge on a single fixation point, where one word appears.',
    m([['scatter', 0], ['reticle', 0.358], ['converged', 0.65], ['word', 0.6667]]),
  ),
};

export const CINE_NAMES = Object.keys(CINE) as readonly CineName[];

/** Files for one clip in one world. */
export const cineVariant = (name: CineName, world: CineWorld = 'signal'): CineVariant => CINE[name].worlds[world];

/** Index of the last marker reached at progress p (0..1), or -1 before the first. */
export function markerIndex(name: CineName, p: number): number {
  const ms = CINE[name].markers;
  let i = -1;
  for (let k = 0; k < ms.length; k++) if (p >= ms[k].at) i = k;
  return i;
}
