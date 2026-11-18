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
  /** Renders only on /about ("How a build runs"): what the stage achieves, in one line. */
  readonly line: string;
  /**
   * The supporting line under the heading: the stage's two WBS tasks in plain words (docs/WBS.md).
   * Mapping approved by the Head Designer, 2026-11-17.
   */
  readonly rule: string;
  /** Apple phone hero: the stage's display headline (supporting line = `rule`). */
  readonly heading: string;
  readonly glyph: RuleGlyph;
}

export const stages: readonly Stage[] = [
  { id: 'plan', n: '01', name: 'Discover', verb: 'form', motion: 'An outline settles on a shape.', line: 'Learn what the part does and where it fits.', rule: 'Set the size limits. Study how real products solve it.', heading: 'Know what the part must do first.', glyph: 'seat' },
  { id: 'prototype', n: '02', name: 'Decide', verb: 'orbit', motion: 'Parts move on their own orbits.', line: 'Pick one concept, and know why.', rule: 'Compare materials and how to make it. Then weigh the trade-offs.', heading: 'Score the options before you commit.', glyph: 'handoff' },
  { id: 'test', n: '03', name: 'Design', verb: 'scramble', motion: 'It scrambles, then clicks back.', line: 'Get it right on screen before you cut.', rule: 'Make every part fit. Simulate stress and heat.', heading: 'Model it in 3D, then check the physics.', glyph: 'gate' },
  { id: 'integrate', n: '04', name: 'Build', verb: 'wire', motion: 'Separate nodes wire into one.', line: 'Turn the model into a part you can hold.', rule: 'Fabricate a mockup and cycle-test it. Deliver drawings and a parts list.', heading: 'Make it real, then hand it off.', glyph: 'swap' },
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
  { id: 'brain', ch: 'CH3', name: 'BRAIN', line: 'How AI agents work, and how to build with them.', verbNote: 'A sphere of dots. A wave crosses it while the agent thinks. One dot leaves to call a tool, then comes back. When a call needs approval, the dot stops and waits.' },
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
  pause: 'Pause',
  play: 'Play',
  thought: (n: number): string => `Thought for ${n} ${n === 1 ? 'second' : 'seconds'}`,
} as const;
