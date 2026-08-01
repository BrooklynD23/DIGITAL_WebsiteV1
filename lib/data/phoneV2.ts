/**
 * Copy + config for the modular smartphone experience (/projects/modular-smartphone).
 *
 * WARNING: pending human sign-off. All user-facing strings in this file are
 * provisional until the route is reviewed and approved.
 */

import { meetingInfo } from './involvement';
import { siteConfig } from './siteConfig';

export type PhoneSectionAccent =
  | '#F87171'
  | '#FBBF24'
  | '#4ADE80'
  | '#22D3EE'
  | '#60A5FA'
  | '#C084FC'
  | '#FACC15';

export interface PhoneHeroCopy {
  readonly eyebrow: string;
  readonly headline: readonly [string, string, string];
  readonly subline: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly skipLabel: string;
  readonly scrubberLabel: string;
  readonly scrubberDetail: string;
}

export interface PhoneToolboxCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly description: string;
  readonly railLabel: string;
  readonly specHeading: string;
  readonly specLead: string;
  readonly specLines: readonly string[];
  /** The four workflow stages, drawn as pads on the WorkflowRail trace. */
  readonly workflowStages: readonly [string, string, string, string];
}

export interface PhoneSubsystemCopy {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly accent: PhoneSectionAccent;
  readonly activePartIds: readonly string[];
  readonly specHeading: string;
  readonly specLines: readonly string[];
  readonly scrubberLabel: string;
  /**
   * How far apart the schematic sits for this section, 0 (assembled) to 1 (fully
   * exploded). The seven values descend monotonically, so scrolling the stage
   * reads as the phone coming back together — boundaries first, finished device
   * last — handing off to the FinalCta reassembly.
   */
  readonly explode: number;
}

export interface PhoneBuildScopeCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly description: string;
  readonly scopeTitle: string;
  readonly scopeItems: readonly string[];
}

export interface PhoneFinalCtaCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly description: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly tertiaryLabel: string;
  readonly supportLine: string;
}

export const phoneV2Metadata = {
  title: 'The Modular Smartphone — DIGITAL @ Cal Poly Pomona',
  description:
    'A fully modular, repairable smartphone built from scratch — explore the exploded system builder.',
} as const;

export const phoneV2Copy: {
  readonly loaderWordmark: string;
  readonly loaderTagline: string;
  readonly loaderScrubberLabel: string;
  readonly schematicAriaLabel: string;
  readonly hero: PhoneHeroCopy;
  readonly toolbox: PhoneToolboxCopy;
  readonly subsystemSections: readonly PhoneSubsystemCopy[];
  readonly buildScope: PhoneBuildScopeCopy;
  readonly finalCta: PhoneFinalCtaCopy;
  readonly mobileStage: {
    readonly eyebrow: string;
    readonly headline: string;
    readonly description: string;
  };
  readonly mobileSummary: readonly string[];
  readonly routeFacts: {
    readonly meetingLabel: string;
    readonly meetingValue: string;
    readonly discordLabel: string;
    readonly discordValue: string;
  };
} = {
  loaderWordmark: 'DIGITAL',
  loaderTagline: 'Scroll to enter the bench.',
  loaderScrubberLabel: 'Boot',
  schematicAriaLabel: 'Exploded smartphone schematic',
  hero: {
    eyebrow: 'DIGITAL / PHONE V2',
    headline: ['One device.', 'Owned in parts.', 'Take a subsystem.'],
    subline:
      'Own one layer end to end, then prove it works with the rest.',
    primaryCta: 'Explore the build',
    secondaryCta: 'Jump to systems',
    skipLabel: 'Skip intro',
    scrubberLabel: 'Launch',
    scrubberDetail: 'Ready',
  },
  toolbox: {
    eyebrow: 'Builder / tools',
    headline: 'One workflow. Clear subsystem owners.',
    description:
      'See what the phone needs, who owns it, and which trade-off comes next.',
    railLabel: 'Workflow / rail',
    specHeading: 'Toolchain spec',
    specLead: 'What the team needs to build without hand-waving.',
    // 'workflow: plan, prototype, test, integrate' moved out of this list and
    // into workflowStages below — the rail draws it, so the line would repeat it.
    specLines: [
      'stack: systems, firmware, hardware, software',
      'output: a repairable modular phone',
    ],
    workflowStages: ['plan', 'prototype', 'test', 'integrate'],
  },
  subsystemSections: [
    {
      id: 'systems-architecture',
      title: 'Systems Architecture',
      description:
        "Clear boundaries align the parts and define each team's handoff.",
      bullets: [
        'You decide where the frame ends and the board begins.',
        'Every boundary gets reviewed before it is built.',
        'What could break first is what you build first.',
      ],
      accent: '#F87171',
      activePartIds: ['phone-display-panel', 'phone-midframe'],
      specHeading: 'Architecture notes',
      specLines: [
        'scope: interfaces and ownership',
        'risk: coupling across modules',
        'mode: system view',
      ],
      scrubberLabel: 'SYSTEMS',
      explode: 0.95,
    },
    {
      id: 'hardware-pcb',
      title: 'Hardware / PCB',
      description:
        'The system plan becomes rails, traces, and serviceable connections.',
      bullets: [
        'Power and signal get a deliberate path.',
        'Every connector defines a handoff.',
        'The finished board stays open to inspection and repair.',
      ],
      accent: '#FBBF24',
      activePartIds: ['phone-main-pcb', 'phone-flex-cables'],
      specHeading: 'Board notes',
      specLines: [
        'scope: board, rails, connectors',
        'risk: serviceability',
        'mode: hardware detail',
      ],
      scrubberLabel: 'HARDWARE',
      explode: 0.84,
    },
    {
      id: 'firmware-embedded',
      title: 'Firmware / Embedded',
      description:
        'Each board gets a boot path, clear timing, and a way to debug it.',
      bullets: [
        'Startup moves from reset to a known state.',
        'Debug hooks expose what happens next.',
        "Timing and power budgets define the board's operating limits.",
      ],
      accent: '#4ADE80',
      activePartIds: ['phone-battery', 'phone-flex-cables'],
      specHeading: 'Firmware notes',
      specLines: [
        'scope: boot, control, debug',
        'risk: timing drift',
        'mode: embedded runtime',
      ],
      scrubberLabel: 'FIRMWARE',
      explode: 0.72,
    },
    {
      id: 'operating-system',
      title: 'Operating System',
      description:
        'Working hardware becomes a platform with clear rules.',
      bullets: [
        'Services define what each layer can do.',
        'The shell exposes services without crossing their boundaries.',
        'Stable state transitions keep services running under load.',
      ],
      accent: '#22D3EE',
      activePartIds: ['phone-screen-ui', 'phone-front-glass'],
      specHeading: 'OS notes',
      specLines: [
        'scope: services and shell',
        'risk: state fragmentation',
        'mode: platform layer',
      ],
      scrubberLabel: 'OS',
      explode: 0.58,
    },
    {
      id: 'apps-ux',
      title: 'Apps / UX',
      description:
        'The whole system becomes legible at the point of touch.',
      bullets: [
        'Each screen shows what matters first.',
        'Motion connects an action to its result.',
        'Feedback shows whether each tap worked.',
      ],
      accent: '#60A5FA',
      activePartIds: ['phone-front-glass', 'phone-screen-ui'],
      specHeading: 'UX notes',
      specLines: [
        'scope: flows, feedback, readability',
        'risk: UI drift',
        'mode: application layer',
      ],
      scrubberLabel: 'APPS',
      explode: 0.44,
    },
    {
      id: 'mechanical-cad',
      title: 'Mechanical / CAD',
      description:
        'The enclosure makes repair, fit, and assembly possible.',
      bullets: [
        'CAD defines the enclosure and assembly path.',
        'Tolerance checks prove the parts fit before they freeze.',
        'That path keeps replaceable parts accessible.',
      ],
      accent: '#C084FC',
      activePartIds: ['phone-back-cover', 'phone-midframe'],
      specHeading: 'Mechanical notes',
      specLines: [
        'scope: enclosure and fit',
        'risk: tolerance stack-up',
        'mode: CAD / assembly',
      ],
      scrubberLabel: 'MECHANICAL',
      explode: 0.3,
    },
    {
      id: 'integration-testing',
      title: 'Integration / Testing',
      description:
        'The full phone proves its subsystems work together as they change.',
      bullets: [
        'Tests start where disciplines meet.',
        'Failures expose the contract that needs work.',
        'Regression checks keep each fix from breaking the next.',
      ],
      accent: '#FACC15',
      activePartIds: ['phone-screws', 'phone-haptics'],
      specHeading: 'Test notes',
      specLines: [
        'scope: validation and regressions',
        'risk: hidden coupling',
        'mode: integration pass',
      ],
      scrubberLabel: 'TESTING',
      explode: 0.12,
    },
  ] as const,
  buildScope: {
    eyebrow: 'Light mode / build scope',
    headline: 'Own one clear boundary',
    description:
      'A clear boundary gives each subsystem an owner, a review path, and a test before it joins the phone.',
    scopeTitle: 'Scope cards',
    scopeItems: [
      'one owner per subsystem',
      'one review path per handoff',
      'one test gate before merge',
      'one repair plan before release',
    ],
  },
  finalCta: {
    eyebrow: 'Reassembly',
    headline: 'Take a subsystem. Build the whole phone.',
    description:
      'Bring one part from first decision to final test, then make it work with everything around it.',
    primaryLabel: 'Join DIGITAL',
    secondaryLabel: 'View Teams',
    tertiaryLabel: 'See Projects',
    supportLine: `${meetingInfo.schedule} · ${meetingInfo.location} · Discord ${siteConfig.social.discord}`,
  },
  mobileStage: {
    eyebrow: 'Subsystems',
    headline: 'Every subsystem stays in view.',
    description:
      'Follow the build one subsystem at a time, with the phone diagram above each section.',
  },
  mobileSummary: ['Systems', 'Hardware', 'Firmware', 'Apps', 'Testing'],
  routeFacts: {
    meetingLabel: 'Meeting',
    meetingValue: `${meetingInfo.schedule} · ${meetingInfo.location}`,
    discordLabel: 'Discord',
    discordValue: siteConfig.social.discord,
  },
} as const;

