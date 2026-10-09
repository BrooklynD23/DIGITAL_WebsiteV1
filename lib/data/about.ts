/**
 * Copy + config for /about — including the DIGITAL acronym framework folded in
 * from the retired /pillars route (2026-08 consolidation).
 *
 * NOTE: the mission beats and vision line are NOT restated here — they are
 * canonical (`lib/data/mission.ts`) and render once, on the homepage mission
 * band, per docs/design/BRAND.md governance.
 */

export interface AcronymPillar {
  readonly letter: string;
  readonly word: string;
  readonly description: string;
  readonly details: readonly string[];
}

export const acronymPillars: readonly AcronymPillar[] = [
  {
    letter: 'D',
    word: 'Device',
    description:
      'The build itself: a smartphone designed from scratch — held, used, and carried every day.',
    details: ['Hardware architecture', 'Ergonomic design', 'Component selection'],
  },
  {
    letter: 'I',
    word: 'Implementation',
    description:
      'Designs become parts. Industry tools and workflows, used the way industry uses them.',
    details: ['PCB fabrication', 'Firmware development', 'Mechanical assembly'],
  },
  {
    letter: 'G',
    word: 'Generating',
    description:
      'Concepts become prototypes; prototypes become revisions. Volume of attempts is the point.',
    details: ['Concept ideation', 'Rapid prototyping', 'Design iteration'],
  },
  {
    letter: 'I',
    word: 'Integrating',
    description:
      'Hardware, software, mechanical — one product. Module boundaries make the joining clean.',
    details: ['System architecture', 'Module interconnects', 'Cross-team collaboration'],
  },
  {
    letter: 'T',
    word: 'Testing',
    description:
      'Every claim gets measured against performance, reliability, and safety. The bench decides.',
    details: ['Performance benchmarks', 'Stress testing', 'Quality assurance'],
  },
  {
    letter: 'A',
    word: 'Analyzing',
    description:
      'Results over opinions. Read the numbers, find the pattern, change the design.',
    details: ['Performance metrics', 'Failure analysis', 'Optimization studies'],
  },
  {
    letter: 'L',
    word: 'Learning',
    description:
      'Skills pass member to member, so each cohort starts further ahead than the last.',
    details: ['Peer mentorship', 'Technical workshops', 'Documentation culture'],
  },
] as const;

