/**
 * Round-2 Home content, shared by both worlds (Signal Capture + Apple page).
 * Facts only from PRODUCT.md and design-lab/round2/research/*. Club-unconfirmed facts carry `confirm: true`
 * and render a visible "[confirm]" tag. No member names, counts, partners or outcomes.
 */
import type { BuildVerb, Verb } from '../_system';

export const DISCORD_URL = 'https://discord.gg/Vsg3qcNVzv';

export const thesis = 'Make something worth putting your name on.';

export const hero = {
  name: 'DIGITAL',
  where: 'DIGITAL @ Cal Poly Pomona',
  lead: 'A student-run venture studio at Cal Poly Pomona. Pick one part of a real build and own it.',
  orbLabel: 'One build, four stages',
} as const;

export type StageId = 'plan' | 'prototype' | 'test' | 'integrate';

export interface Stage {
  readonly id: StageId;
  readonly n: string;
  readonly name: string;
  readonly verb: BuildVerb;
  /** What the dots do (the metaphor named). */
  readonly motion: string;
  /** One line: what the stage means for the owner. 6 words max (pinned viewports stay at ≤12 words). */
  readonly line: string;
}

export const stages: readonly Stage[] = [
  { id: 'plan', n: '01', name: 'Plan', verb: 'form', motion: 'An outline settles on a shape.', line: 'Draw the edge of your part.' },
  { id: 'prototype', n: '02', name: 'Prototype', verb: 'orbit', motion: 'Parts move on their own orbits.', line: 'Build it in pieces first.' },
  { id: 'test', n: '03', name: 'Test', verb: 'scramble', motion: 'It scrambles, then clicks back.', line: 'Break it before it merges.' },
  { id: 'integrate', n: '04', name: 'Integrate', verb: 'wire', motion: 'Separate nodes wire into one.', line: 'Wire it in. Hand it on.' },
];

export type RuleGlyph = 'seat' | 'handoff' | 'gate' | 'swap';

/** The four ownership rules (lib/data/phoneV2.ts buildScope.scopeItems). */
export const rules: ReadonlyArray<{ readonly id: string; readonly count: '1'; readonly unit: string; readonly per: string; readonly glyph: RuleGlyph }> = [
  { id: 'owner', count: '1', unit: 'owner', per: 'per subsystem', glyph: 'seat' },
  { id: 'review', count: '1', unit: 'review path', per: 'per handoff', glyph: 'handoff' },
  { id: 'gate', count: '1', unit: 'test gate', per: 'before merge', glyph: 'gate' },
  { id: 'repair', count: '1', unit: 'repair plan', per: 'before release', glyph: 'swap' },
];

export const strip = {
  headline: 'Same four stages. Every part.',
  rulesHeadline: 'Four rules make a part yours.',
} as const;

export type ChannelId = 'sidekick' | 'shades' | 'brain';

export interface Channel {
  readonly id: ChannelId;
  readonly ch: 'CH1' | 'CH2' | 'CH3';
  readonly name: string;
  /** Acronym expansion (Notion-sourced). */
  readonly expands: string;
  readonly line: string;
  /** Signature micro-motion for the channel tile. */
  readonly verb: Verb;
  readonly verbNote: string;
  /** Notion status is "Planned" for all three; shown with [confirm]. */
  readonly status: string;
  readonly confirm: true;
  readonly cta: string;
}

export const channels: readonly Channel[] = [
  {
    id: 'sidekick',
    ch: 'CH1',
    name: 'SIDEKICK',
    expands: 'The modular phone, formerly the Smartphone Project',
    line: 'A modular phone on a Zynq-7000 module.',
    verb: 'explode',
    verbNote: 'Its layers separate on one axis.',
    status: 'Legacy build',
    confirm: true,
    cta: 'Open SIDEKICK',
  },
  {
    id: 'shades',
    ch: 'CH2',
    name: 'SHADES',
    expands: 'Smart Headset for Adaptive Dyslexia Enhancement System',
    line: 'Glasses that show text word by word.',
    verb: 'fixate',
    verbNote: 'Scattered dots land on one point.',
    status: 'Planned',
    confirm: true,
    cta: 'Open SHADES',
  },
  {
    id: 'brain',
    ch: 'CH3',
    name: 'BRAIN',
    expands: 'Building Remarkable AI Innovation and kNowledge',
    line: 'Build real software with agentic AI tools.',
    verb: 'bud',
    verbNote: 'Child orbs split off the parent.',
    status: 'Planned',
    confirm: true,
    cta: 'Open BRAIN',
  },
];

export const channelsHeadline = 'Three builds. One could be yours.';

export const highlightsHeadline = 'DIGITAL, in five parts.';

/** Apple-world highlights strip (breadth without length). Captions 7–12 words. */
export const highlights: ReadonlyArray<{ readonly id: string; readonly title: string; readonly caption: string; readonly confirm?: boolean }> = [
  { id: 'stages', title: 'One cycle', caption: 'Every subsystem runs the same four stages.' },
  { id: 'owner', title: 'One owner', caption: 'One owner per subsystem, so every part carries a name.' },
  { id: 'venture', title: 'Venture Studies', caption: 'A program: engineering scope becomes budgets, sponsor briefs and pitches.' },
  { id: 'night', title: 'Build night', caption: 'Thursdays, 6:00 PM, Building 17, Room 1635. Discord in between.' },
  { id: 'majors', title: 'Any major', caption: 'Engineering, CS, design, business, data and science students own parts.' },
];

export const join = {
  id: 'join',
  headline: 'Thursday is build night.',
  when: 'Thursdays, 6:00 PM',
  where: 'Building 17, Room 1635',
  noExperience: 'No project experience required.',
  lead: 'Come to one night. Pick a part. Discord carries the work in between.',
  cta: 'Join the Discord',
  secondary: 'Pick a build first',
} as const;

export const confirmTag = '[confirm]';
