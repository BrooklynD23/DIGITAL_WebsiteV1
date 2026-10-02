import { Easing, interpolate } from 'remotion';
import { loadFont as loadDisplay } from '@remotion/google-fonts/InterTight';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// Brand-neutral motion tokens for the DIGITAL reel. Every concept direction can swap
// FONT.display and COLOR.accent without touching the timeline.

const display = loadDisplay('normal', { weights: ['500', '600'], subsets: ['latin'] });
const mono = loadMono('normal', { weights: ['400', '500'], subsets: ['latin'] });

export const FONT = Object.freeze({
  display: display.fontFamily,
  mono: mono.fontFamily,
});

export const COLOR = Object.freeze({
  paper: '#F2EFE8', // warm paper: reads as drafting stock, not a UI surface
  ink: '#141414', // near-black ink
  muted: '#6B675F', // secondary ink, 5.0:1 on paper
  hair: 'rgba(20,20,20,0.16)', // 1px hairlines
  grid: 'rgba(20,20,20,0.11)', // dot grid
  accent: '#D8412F', // production signal red: markers only
});

export const FRAME = Object.freeze({ w: 1920, h: 1080, fps: 30, margin: 96 });

// Easing scale. One family: fast start, long settle (engineered, not bouncy).
export const EASE = Object.freeze({
  out: Easing.bezier(0.16, 1, 0.3, 1), // entrances
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // travels / camera moves
  in: Easing.bezier(0.4, 0, 1, 1), // exits
});

// Springs. SETTLE = critically damped (structure). TICK = one small overshoot (markers only).
export const SPRING = Object.freeze({
  settle: { damping: 200 },
  tick: { damping: 14, stiffness: 180, mass: 0.5 },
});

export const ramp = (frame, [a, b], [from, to] = [0, 1], easing = EASE.out) =>
  interpolate(frame, [a, b], [from, to], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Real content only (lib/data/phoneV2.ts, lib/data/experiments/glasses.ts, CONTEXT-PACK §1).
export const SUBSYSTEMS = Object.freeze([
  'Systems Architecture',
  'Hardware / PCB',
  'Firmware / Embedded',
  'Operating System',
  'Apps / UX',
  'Mechanical / CAD',
  'Integration / Testing',
]);

export const OWNERSHIP = Object.freeze([
  { label: 'Owner', rule: 'one owner per subsystem' },
  { label: 'Review', rule: 'one review path per handoff' },
  { label: 'Test gate', rule: 'one test gate before merge' },
  { label: 'Repair plan', rule: 'one repair plan before release' },
]);

export const THESIS = Object.freeze(['Make', 'something', 'worth', 'putting', 'your', 'name', 'on.']);
