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

export interface FrameworkPhase {
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export const frameworkPhases: readonly FrameworkPhase[] = [
  {
    label: 'Phase 01',
    title: 'Design',
    description: 'Device, Generating, and Analyzing shape concepts and requirements.',
  },
  {
    label: 'Phase 02',
    title: 'Build',
    description: 'Implementation and Integrating turn designs into working hardware.',
  },
  {
    label: 'Phase 03',
    title: 'Growth',
    description: 'Testing and Learning feed results back into the next revision.',
  },
] as const;

/**
 * The smartphone project's requirement statement — kept verbatim from the
 * club's approved framing (formerly rendered on /pillars).
 */
export const deviceRequirement =
  'Build a smartphone from scratch that is comfortable to hold, intuitive to use, powerful enough to maintain strong performance, efficient enough to endure a whole day of extensive use, speedy enough to feel snappy and responsive, and versatile enough to serve as a foundation for future innovations.';

export interface BenchFeature {
  readonly title: string;
  readonly description: string;
}

export const benchFeatures: readonly BenchFeature[] = [
  {
    title: 'Custom PCB design',
    description: 'Four-layer boards for power management and connectivity.',
  },
  {
    title: 'Mechanical housing',
    description: '3D-printed and CNC-machined enclosures for snap-fit modularity.',
  },
  {
    title: 'Embedded OS',
    description: 'Custom kernel drivers and an interface fitted to our hardware.',
  },
] as const;

export interface RoadmapPhase {
  readonly status: 'completed' | 'current' | 'future';
  readonly title: string;
  readonly description: string;
}

export const roadmapPhases: readonly RoadmapPhase[] = [
  {
    status: 'completed',
    title: 'Concept & prototyping',
    description: 'Initial breadboarding, component selection, feasibility studies.',
  },
  {
    status: 'current',
    title: 'PCB fabrication',
    description: 'First revision of carrier boards and module interconnects.',
  },
  {
    status: 'future',
    title: 'System integration',
    description: 'Full OS bring-up, housing assembly, user testing.',
  },
] as const;

/** Three things the club holds itself to — distinct from the canonical mission beats. */
export const aboutCommitments: readonly { title: string; description: string }[] = [
  {
    title: 'Industry standard',
    description:
      'Altium, SolidWorks, embedded C++ — the same tools the workforce uses, on real hardware.',
  },
  {
    title: 'Peer mentorship',
    description: 'Upperclassmen and industry mentors sit next to first-year members at the bench.',
  },
  {
    title: 'Ambitious scope',
    description: 'A fully modular smartphone is not a typical club project. We build it anyway.',
  },
] as const;
