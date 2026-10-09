import type { TeardownConfig } from './types';
import { framePngSrc, posterPngSrc } from './assets';

/**
 * Per-frame calibration (Option C stopgap).
 * Tune by overlaying adjacent frames at 50% opacity until the chassis registers.
 * Remove when renderer === 'registered'.
 */
const FRAME_ADJUST = [
  { dx: 0, dy: 0, scale: 1 },
  { dx: 2, dy: -4, scale: 1.008 },
  { dx: 4, dy: -8, scale: 1.012 },
  { dx: 6, dy: -14, scale: 1.018 },
  { dx: 8, dy: -20, scale: 1.024 },
  { dx: 10, dy: -26, scale: 1.03 },
  { dx: 12, dy: -32, scale: 1.034 },
  { dx: 10, dy: -24, scale: 1.028 },
  { dx: 6, dy: -16, scale: 1.02 },
  { dx: 2, dy: -8, scale: 1.01 },
  { dx: 0, dy: -3, scale: 1.004 },
  { dx: 0, dy: 0, scale: 1 },
] as const;

/** Registered layers (Option B) — keyed to lib/data/projects.ts modules. */
const REGISTERED_LAYERS = [
  {
    id: 'chassis',
    asset: 'layer-01-chassis',
    label: 'LAYER 01 — CHASSIS',
    note: 'sealed.',
    start: 0,
    end: 0.28,
    dx: 0,
    dy: 0,
    depth: 0.08,
  },
  {
    id: 'frame',
    asset: 'layer-02-frame',
    label: 'LAYER 02 — FRAME',
    note: 'frame out.',
    start: 0.06,
    end: 0.38,
    dx: 48,
    dy: 32,
    depth: 0.22,
  },
  {
    id: 'battery',
    asset: 'layer-03-battery',
    label: 'LAYER 03 — BATTERY',
    note: 'swappable.',
    start: 0.14,
    end: 0.48,
    dx: 96,
    dy: -64,
    depth: 0.45,
  },
  {
    id: 'board',
    asset: 'layer-04-board',
    label: 'LAYER 04 — BOARD',
    note: 'esp32-s3.',
    start: 0.24,
    end: 0.62,
    dx: 72,
    dy: 18,
    depth: 0.35,
  },
  {
    id: 'display',
    asset: 'layer-05-display',
    label: 'LAYER 05 — DISPLAY',
    note: 'screen off.',
    start: 0.34,
    end: 0.78,
    dx: 128,
    dy: -96,
    depth: 0.72,
  },
  {
    id: 'glass',
    asset: 'layer-06-glass',
    label: 'LAYER 06 — GLASS',
    note: 'faceplate.',
    start: 0.44,
    end: 0.92,
    dx: 168,
    dy: -132,
    depth: 0.95,
  },
] as const;

export const TEARDOWN_CFG: TeardownConfig = {
  /** Sequence (12 frames) until real registered layer exports replace scaffold slices. */
  renderer: 'sequence',
  frameCount: 12,
  framePath: (i) => framePngSrc(i),
  posterPath: () => posterPngSrc(),
  pinLen: '170vh',
  lerp: 0.25,
  hold: 0.28,
  frameAdjust: [...FRAME_ADJUST],
  states: [
    { at: 0.0, label: 'LAYER 00 — ASSEMBLED', note: 'sealed.' },
    { at: 0.16, label: 'LAYER 02 — SCREEN', note: 'screen off.' },
    { at: 0.38, label: 'LAYER 04 — FRAME', note: 'frame out.' },
    { at: 0.6, label: 'LAYER 06 — BOARD', note: 'esp32-s3.' },
    { at: 0.82, label: 'LAYER 09 — MODULES', note: 'every part.' },
    { at: 0.97, label: 'LAYER 12 — EXPLODED', note: 'all of it.' },
  ],
  layers: REGISTERED_LAYERS.map((l) => ({ ...l })),
  /** Set true + install `lenis` to enable inertial scroll (see DESIGN.md §6). */
  smoothScroll: false,
  /** Scroll-scrubbed video assets (renderer: 'video' — generated via Higgsfield, GOP=1 re-encode). */
  videoSrc: '/assets/teardown/teardown.mp4',
  videoWebm: '/assets/teardown/teardown.webm',
  videoPoster: '/assets/teardown/teardown-poster.jpg',
  /** Canvas image-sequence (renderer: 'canvas' — ione-style; frames extracted from the clip). */
  canvasFrameCount: 97,
  canvasFrameDir: '/assets/teardown/frames',
};
