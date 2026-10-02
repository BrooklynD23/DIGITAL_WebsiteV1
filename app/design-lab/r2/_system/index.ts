/**
 * Round-2 shared system (W0-SYS). Import from '@/app/design-lab/r2/_system'.
 * Docs: design-lab/round2/system/SYSTEM.md. Specimen: /design-lab/r2/system.
 * Fonts (W0-TYPE) live in ./fonts and boards (W0-BOARD) in ./boards; import those directly.
 */

// dot engine
export { frame, restFrame, verbSpec, VERBS, REST_T, MAX_DOTS, baseRadius } from './dots/engine';
export type { VerbSpec } from './dots/engine';
export type { Verb, BuildVerb, AgenticVerb, Dot, Line, Frame, FrameOpts, LineForm, Shape, RouteOutcome, TetherKind } from './dots/types';
export { DotGlyph } from './dots/DotGlyph';
export { DotStage } from './dots/DotStage';
export type { DotStageHandle, DotStageProps } from './dots/DotStage';
export { useScrollDrive, useTimeDrive } from './dots/drive';
export { subscribe as subscribeTick, once as onceTick, activeTicks, insideFrame } from './dots/ticker';
export { paintFrame } from './dots/paint';
export type { Inks } from './dots/paint';
export { project, fibDir, seg, dot, line, partial, lerp, clamp, hash, shash, seedOf, shade, easeInOut, easeOut, easeIn, easeOutBack, shapePoint, shapeVerts, TAU } from './dots/math';
export { coreOrb, latticeDisc } from './dots/verbs-build';

// icons
export * from './icons/glyphs';
export { GlyphFrame } from './icons/Glyph';
export type { GlyphProps, GlyphState, GlyphSize } from './icons/Glyph';
export { StateMark } from './icons/StateMark';
export type { ChannelState } from './icons/StateMark';

// tokens
export { EASE, DURATION, REVEAL, SPRING, M3, m3, cssBezier, springToLinear } from './tokens/motion';
export { useScrollProgress, useReducedMotion, progressOf, supportsViewTimeline, useScrollSteps, stepAt, stepRestPoint } from './tokens/scroll';
export type { ScrollRange, ScrollProgressOptions, StepAt, StepOptions, ScrollSteps } from './tokens/scroll';

// shared UI (W3a extractions)
export { usePlayOnEntry, PlayOnce, PlayOnceStage } from './ui/PlayOnce';
export type { PlayOnEntryOptions } from './ui/PlayOnce';
export { Highlights } from './ui/Highlights';
export type { HighlightItem, HighlightsProps } from './ui/Highlights';
export { Graticule } from './ui/Graticule';
export type { GraticulePitch } from './ui/Graticule';
export { Chevron, PlayMark } from './ui/Chevron';
