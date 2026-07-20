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
  readonly lensLabel: string;
  readonly specHeading: string;
  readonly specLead: string;
  readonly specLines: readonly string[];
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
    headline: ['Build the phone.', 'Build the team.', 'Build the system.'],
    subline:
      'From schematic to ship-ready stack, every subsystem stays visible, accountable, and owned by students who want real engineering depth.',
    primaryCta: 'Explore the build',
    secondaryCta: 'Jump to systems',
    skipLabel: 'Skip intro',
    scrubberLabel: 'Launch',
    scrubberDetail: 'Ready',
  },
  toolbox: {
    eyebrow: 'Builder / tools',
    headline: "Complete builder's toolbox",
    description:
      'One interface for architecture, tooling, ownership, and the trade-offs that keep the project honest.',
    lensLabel: 'HUD / lens',
    specHeading: 'Toolchain spec',
    specLead: 'What the team needs to build without hand-waving.',
    specLines: [
      'stack: systems, firmware, hardware, software',
      'workflow: plan, prototype, test, integrate',
      'output: a repairable modular phone',
    ],
  },
  subsystemSections: [
    {
      id: 'systems-architecture',
      title: 'Systems Architecture',
      description:
        'Set the contract between the frame, the electronics, and the team before any layer starts drifting.',
      bullets: [
        'Map dependencies before the first board spin.',
        'Keep module boundaries explicit and reviewable.',
        'Use integration risks to drive the build order.',
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
    },
    {
      id: 'hardware-pcb',
      title: 'Hardware / PCB',
      description:
        'Trace the power rails, the board stack, and every connector that makes the phone physical.',
      bullets: [
        'Route power, ground, and signal with intent.',
        'Keep the PCB easy to inspect and service.',
        'Treat every connector as an integration decision.',
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
    },
    {
      id: 'firmware-embedded',
      title: 'Firmware / Embedded',
      description:
        'Give the hardware a reliable boot path, deterministic control loops, and a clear debug story.',
      bullets: [
        'Own the startup sequence from reset to runtime.',
        'Expose debug hooks before features pile up.',
        'Keep timing and power budgets visible.',
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
    },
    {
      id: 'operating-system',
      title: 'Operating System',
      description:
        'Treat the phone like a platform: permissions, services, and app surfaces all need a coherent model.',
      bullets: [
        'Define the OS boundary and service surface.',
        'Make the shell predictable for real users.',
        'Keep state transitions stable under load.',
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
    },
    {
      id: 'apps-ux',
      title: 'Apps / UX',
      description:
        'Build the surface people actually touch, with direct feedback, legible states, and fast comprehension.',
      bullets: [
        'Keep the interface readable at a glance.',
        'Use motion to clarify cause and effect.',
        'Make every tap feel like it belongs in the system.',
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
    },
    {
      id: 'mechanical-cad',
      title: 'Mechanical / CAD',
      description:
        'Own the enclosure, fit, and assembly order so the modular phone can survive reality.',
      bullets: [
        'Check tolerance before parts are frozen.',
        'Design for repair, replacement, and reuse.',
        'Make the assembly path obvious in CAD and in hand.',
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
    },
    {
      id: 'integration-testing',
      title: 'Integration / Testing',
      description:
        'Prove the whole stack works, then keep proving it as the layers change under load.',
      bullets: [
        'Test the seam where disciplines meet.',
        'Use failures to tighten the build contract.',
        'Make regression checks part of the flow.',
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
    },
  ] as const,
  buildScope: {
    eyebrow: 'Light mode / build scope',
    headline: 'Build scope',
    description:
      'A modular scope keeps the phone legible: each subsystem owns a boundary, a checklist, and a review path.',
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
    headline: 'Pick a subsystem. Own a part of the build.',
    description:
      'Join a team that values real systems thinking, repeatable testing, and transparent ownership.',
    primaryLabel: 'Join DIGITAL',
    secondaryLabel: 'View Teams',
    tertiaryLabel: 'See Projects',
    supportLine: `${meetingInfo.schedule} · ${meetingInfo.location} · Discord ${siteConfig.social.discord}`,
  },
  mobileStage: {
    eyebrow: 'Subsystems',
    headline: 'Scroll the stack.',
    description:
      'Each section keeps the schematic above the copy, trims the detail card, and removes pinning for smaller screens.',
  },
  mobileSummary: ['Systems', 'Hardware', 'Firmware', 'Apps', 'Testing'],
  routeFacts: {
    meetingLabel: 'Meeting',
    meetingValue: `${meetingInfo.schedule} · ${meetingInfo.location}`,
    discordLabel: 'Discord',
    discordValue: siteConfig.social.discord,
  },
} as const;

