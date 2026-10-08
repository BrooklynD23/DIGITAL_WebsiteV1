/**
 * Demo content for the MASCOT lab route. Every value is sourced from production data
 * (`lib/data/*`) or CONTEXT-PACK §1 "safe" facts. Lab copy is exploratory: production copy
 * still goes through brand-voice-strategist → brand-guardian.
 */
import { projects } from '@/lib/data/projects';
import { siteConfig } from '@/lib/data/siteConfig';

const smartReading = projects.find((p) => p.id === 'smart-reading');

export type MascotKey = 'dg-001' | 'dg-002' | 'join';

export type BuildRow = {
  readonly key: MascotKey;
  readonly code: string;
  readonly title: string;
  readonly href: string;
  readonly summary: string;
  readonly meta: ReadonlyArray<{ readonly k: string; readonly v: string }>;
};

export const hero = {
  eyebrow: `${siteConfig.fullName} · Student-run venture studio`,
  thesis: 'Make something worth putting your name on.',
  lead: 'Real systems, built by students, handed to the next cohort.',
  primaryCta: { label: 'Take a subsystem', href: '/contact?type=join' },
  secondaryCta: { label: 'See the builds', href: '#builds' },
} as const;

export const builds: ReadonlyArray<BuildRow> = [
  {
    key: 'dg-001',
    code: 'DG-001',
    title: 'The Modular Smartphone',
    href: '/projects/modular-smartphone',
    // phoneV2.ts problem framing + ownership model (verbatim items).
    summary:
      'A repairable phone instead of a throwaway one. Seven subsystems, each with one owner, one review path and one test gate before merge.',
    meta: [
      { k: 'Status', v: 'Active' },
      {
        k: 'Subsystems',
        v: 'Systems Architecture · Hardware/PCB · Firmware · Operating System · Apps/UX · Mechanical/CAD · Integration/Testing',
      },
      { k: 'Workflow', v: 'plan → prototype → test → integrate' },
    ],
  },
  {
    key: 'dg-002',
    code: 'DG-002',
    title: smartReading?.title ?? 'Smart Reading',
    href: '/projects/smart-reading',
    summary:
      smartReading?.shortDescription ??
      'FPGA-based heads-up glasses that show one word at a time, right where you look.',
    meta: [
      { k: 'Status', v: 'Active' },
      { k: 'Stack', v: (smartReading?.techStack ?? []).join(' · ') },
      { k: 'Build cycle', v: '8 months' },
      { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
    ],
  },
];

export const join = {
  heading: 'Build night is Thursday.',
  // siteConfig.contact.meetingTime is "Thursdays @ 6:00 PM"; the heading already says Thursday.
  line: `6:00 PM · ${siteConfig.contact.location}. No project experience required.`,
  cta: { label: 'Take a subsystem', href: '/contact?type=join' },
  discord: { label: 'Join the Discord', href: siteConfig.community.discord },
} as const;
