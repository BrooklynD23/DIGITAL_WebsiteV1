/**
 * Round-2 Home content, shared by both worlds (Signal Capture + Apple page).
 * Facts only from PRODUCT.md and design-lab/round2/research/*. Club-unconfirmed facts render a visible
 * "[confirm]" tag. No member names, counts, partners or outcomes.
 * `join.headline / cta / lead` are read by _chrome/JoinChapter and the system specimen: keep those keys.
 */
import type { BuildVerb } from '../_system';

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
  /** Accessible label of the chapter's visual. */
  readonly verbNote: string;
}

export const channels: readonly Channel[] = [
  { id: 'sidekick', ch: 'CH1', name: 'SIDEKICK', line: 'A modular smartphone design, files on GitHub.', verbNote: 'The SIDEKICK main board design, front copper and parts.' },
  { id: 'shades', ch: 'CH2', name: 'SHADES', line: 'Research-backed heads-up display glasses, a rendered prototype.', verbNote: 'The planned SHADES glasses, rendered.' },
  { id: 'brain', ch: 'CH3', name: 'BRAIN', line: 'How AI agents work, and how to build with them.', verbNote: 'A sphere of dots. A wave crosses it while the agent thinks; one dot leaves to call a tool and returns.' }, // provisional, pending brand review,
];

export const channelsHeadline = 'Explore our projects';

/** Apple LocalNav title (Head Designer, 2026-10-02: "DIGITAL"; positioning stays in the hero line). */
export const localTitle = 'DIGITAL';

/** Apple-world highlights strip (breadth without length). Captions 9–19 words. */
export const highlights: ReadonlyArray<{ readonly id: string; readonly title: string; readonly caption: string }> = [
  { id: 'stages', title: 'One cycle', caption: 'A build splits into subsystems. Each one runs the same four stages.' },
  { id: 'venture', title: 'Venture Studies', caption: 'Turns engineering scope into budgets, sponsor briefs and pitches.' },
  { id: 'night', title: 'Sub-team meetings', caption: 'Meetings are sub-team based. Join our Discord for more information.' },
  { id: 'majors', title: 'Any major', caption: 'Engineering, CS, design, business, data and science students can own parts.' },
];

export const join = {
  id: 'join',
  headline: 'Join a sub-team.',
  lead: 'Meetings are sub-team based. Join our Discord for more information.',
  cta: 'Join the Discord',
  secondary: 'Pick a build first',
} as const;

/** BRAIN chapter readout (AI SDK Elements "Reasoning" pattern). A tool is [name, argument, result, ok?]. */
export interface HomeJob {
  readonly think: string;
  readonly tools: ReadonlyArray<readonly [string, string, string, boolean?]>;
  readonly sec: number;
}

export const homeJobs: readonly HomeJob[] = [
  { think: 'The test suite is red. Run it first to see which test fails.', tools: [['run_tests', 'npm test', '1 failed'], ['read_file', 'src/demo.ts', '212 lines'], ['edit_file', 'src/demo.ts:47', 'patched'], ['run_tests', 'npm test', '24 passed']], sec: 4 },
  { think: 'Summarize this week in Discord. Ask the Discord server for the last 50 messages.', tools: [['mcp · discord', 'messages.list #general', '50 messages'], ['write', 'summary.md', '6 bullets']], sec: 3 },
  { think: 'Check the board netlist for unconnected pins with a script.', tools: [['bash', 'python check_nets.py demo-board.net', '2 warnings'], ['read_file', 'demo-board.net', 'U4 pin 12'], ['bash', 'python check_nets.py demo-board.net', '0 warnings']], sec: 5 },
  { think: 'Clean the build folder. That deletes files, so the harness asks first.', tools: [['bash', 'rm -rf build/', 'needs approval', false]], sec: 2 },
];

export const readoutLabels = {
  thinking: 'Thinking…',
  pause: 'Pause', // provisional, pending brand review
  play: 'Play', // provisional, pending brand review
  thought: (n: number): string => `Thought for ${n} ${n === 1 ? 'second' : 'seconds'}`,
} as const;
