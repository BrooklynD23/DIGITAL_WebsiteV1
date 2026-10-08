/**
 * Round-2 Home content, shared by both worlds (Signal Capture + Apple page).
 * Facts only from PRODUCT.md and design-lab/round2/research/*. Club-unconfirmed facts render a visible
 * "[confirm]" tag. No member names, counts, partners or outcomes.
 * `join.headline / cta / lead` are read by _chrome/JoinChapter and the system specimen: keep those keys.
 */
import type { BuildVerb, Verb } from '../_system';

export const thesis = 'Make something worth putting your name on.';

export const hero = {
  lead: 'A student-run venture studio at Cal Poly Pomona. Pick one part of a real build and own it.',
} as const;

export type StageId = 'plan' | 'prototype' | 'test' | 'integrate';
export type RuleGlyph = 'seat' | 'handoff' | 'gate' | 'swap';

export interface Stage {
  readonly id: StageId;
  readonly n: string;
  readonly name: string;
  readonly verb: BuildVerb;
  /** What the dots do (the metaphor named). */
  readonly motion: string;
  /** What the stage means for the owner (static stills, jump-button names). */
  readonly line: string;
  /**
   * The ownership rule this stage enforces (lib/data/phoneV2.ts buildScope.scopeItems), shown with the stage in
   * the scrubbed pin. Pairing decided by the Head Designer, 2026-10-02.
   */
  readonly rule: string;
  /** Apple phone hero: the stage's display headline (supporting line = `rule`). */
  readonly heading: string;
  readonly glyph: RuleGlyph;
}

export const stages: readonly Stage[] = [
  { id: 'plan', n: '01', name: 'Plan', verb: 'form', motion: 'An outline settles on a shape.', line: 'Draw the edge of your part.', rule: 'One owner per subsystem.', heading: 'Start with the schematic.', glyph: 'seat' },
  { id: 'prototype', n: '02', name: 'Prototype', verb: 'orbit', motion: 'Parts move on their own orbits.', line: 'Build it in pieces first.', rule: 'One review path per handoff.', heading: 'Split it into parts you can build.', glyph: 'handoff' },
  { id: 'test', n: '03', name: 'Test', verb: 'scramble', motion: 'It scrambles, then clicks back.', line: 'Break it before it merges.', rule: 'One test gate before merge.', heading: 'Test the one connection that matters.', glyph: 'gate' },
  { id: 'integrate', n: '04', name: 'Integrate', verb: 'wire', motion: 'Separate nodes wire into one.', line: 'Wire it in. Hand it on.', rule: 'One repair plan before release.', heading: 'Put it back together as one phone.', glyph: 'swap' },
];

export type ChannelId = 'sidekick' | 'shades' | 'brain';

export interface Channel {
  readonly id: ChannelId;
  readonly ch: 'CH1' | 'CH2' | 'CH3';
  readonly name: string;
  readonly line: string;
  /** The line itself carries an unconfirmed knowledgebase fact. */
  readonly lineConfirm?: boolean;
  /** Signature micro-motion for the channel. */
  readonly verb: Verb;
  readonly verbNote: string;
  /** Notion status is "Planned" for all three; always shown with [confirm]. */
  readonly status: string;
  /** RSVP word drawn at the fixation point of the channel's orb (SHADES only). */
  readonly word?: string;
}

export const channels: readonly Channel[] = [
  { id: 'sidekick', ch: 'CH1', name: 'SIDEKICK', line: 'A modular phone design on a Zynq-7000.', lineConfirm: true, verb: 'explode', verbNote: 'Its layers separate on one axis.', status: 'Archived design' },
  { id: 'shades', ch: 'CH2', name: 'SHADES', line: 'Glasses that show text word by word.', verb: 'fixate', verbNote: 'Scattered dots land on one point.', status: 'Planned', word: 'own' },
  { id: 'brain', ch: 'CH3', name: 'BRAIN', line: 'Software built with agentic AI tools.', verb: 'bud', verbNote: 'Child orbs split off the parent.', status: 'Planned' },
];

export const channelsHeadline = 'Three builds. One could be yours.';

/** Apple LocalNav title (Head Designer, 2026-10-02: "DIGITAL"; positioning stays in the hero line). */
export const localTitle = 'DIGITAL';

export const highlightsHeadline = 'DIGITAL, in four parts.';

/** Apple-world highlights strip (breadth without length). Captions 9–19 words. */
export const highlights: ReadonlyArray<{ readonly id: string; readonly title: string; readonly caption: string }> = [
  { id: 'stages', title: 'One cycle', caption: 'A build splits into subsystems. Each one runs the same four stages.' },
  { id: 'venture', title: 'Venture Studies', caption: 'Turns engineering scope into budgets, sponsor briefs and pitches.' },
  { id: 'night', title: 'Build night', caption: 'Thursdays, 6:00 PM, Building 17, Room 1635. Discord carries the work in between.' },
  { id: 'majors', title: 'Any major', caption: 'Engineering, CS, design, business, data and science students can own parts.' },
];

export const join = {
  id: 'join',
  headline: 'Thursday is build night.',
  lead: 'Come once and pick a part. Discord carries the work in between.',
  cta: 'Join the Discord',
  secondary: 'Pick a build first',
} as const;

export const confirmTag = '[confirm]';
