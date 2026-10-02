/**
 * Concept F "The Bench": every fact comes from lib/data (read-only imports).
 * Anything not in lib/data is marked [confirm] or [placeholder].
 * Copy is exploratory; production copy goes through brand-voice-strategist → brand-guardian.
 */
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { projects } from '@/lib/data/projects';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { meetingInfo, involvementCategories } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';
import { legalLinks } from '@/lib/data/siteLinks';

export type PhoneLayerId =
  | 'back-cover'
  | 'small-parts'
  | 'battery'
  | 'pcb'
  | 'midframe'
  | 'display'
  | 'glass';

export interface Seat {
  readonly id: string;
  readonly projectId: string;
  readonly projectCode: string;
  readonly projectTitle: string;
  readonly title: string;
  readonly line: string;
  readonly bullets: readonly string[];
  readonly notes: readonly string[];
  /** Phone only: which exploded layers this subsystem touches (from phoneV2 activePartIds). */
  readonly layers: readonly PhoneLayerId[];
}

export interface Field {
  readonly k: string;
  readonly v: string;
  readonly flag?: 'confirm' | 'placeholder';
}

export interface BuildRecord {
  readonly id: string;
  readonly code: string;
  readonly kind: 'build' | 'program' | 'open';
  readonly title: string;
  readonly problem: string;
  readonly line: string;
  readonly fields: readonly Field[];
  readonly seats: readonly Seat[];
  readonly href?: string;
  readonly hrefLabel?: string;
  readonly plate?: string;
}

const PART_TO_LAYER: Record<string, PhoneLayerId> = {
  'phone-front-glass': 'glass',
  'phone-screen-ui': 'display',
  'phone-display-panel': 'display',
  'phone-midframe': 'midframe',
  'phone-main-pcb': 'pcb',
  'phone-flex-cables': 'pcb',
  'phone-battery': 'battery',
  'phone-screws': 'small-parts',
  'phone-haptics': 'small-parts',
  'phone-back-cover': 'back-cover',
};

const phone = projects.find((p) => p.id === 'modular-smartphone');
const glasses = projects.find((p) => p.id === 'smart-reading');
const venture = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');
const glassesJoin = GLASSES_CONTENT.info.find((i) => i.id === 'info-join');

export const WORKFLOW = phoneV2Copy.toolbox.workflowStages; // plan → prototype → test → integrate
export const OWNERSHIP = phoneV2Copy.buildScope.scopeItems; // one owner / review path / test gate / repair plan

const phoneSeats: Seat[] = phoneV2Copy.subsystemSections.map((s) => ({
  id: `dg001-${s.id}`,
  projectId: 'dg-001',
  projectCode: 'DG-001',
  projectTitle: phone?.title ?? 'The Modular Smartphone',
  title: s.title,
  line: s.description,
  bullets: s.bullets,
  notes: s.specLines,
  layers: Array.from(new Set(s.activePartIds.map((p) => PART_TO_LAYER[p]).filter(Boolean))),
}));

/** Smart Reading lists the disciplines it needs (glasses.ts info-join); no per-seat copy exists. */
const GLASSES_NEEDS = ['Engineering', 'Optics', 'Firmware', 'Design', 'Research'] as const;
const glassesSeats: Seat[] = GLASSES_NEEDS.map((need) => ({
  id: `dg002-${need.toLowerCase()}`,
  projectId: 'dg-002',
  projectCode: 'DG-002',
  projectTitle: glasses?.title ?? 'Smart Reading',
  title: need,
  line: glassesJoin?.body ?? '',
  bullets: GLASSES_CONTENT.info
    .filter((i) => i.id === 'info-approach' || i.id === 'info-platform')
    .map((i) => i.title),
  notes: ['method: RSVP', 'render: real-time FPGA', 'cycle: 8-month build'],
  layers: [],
}));

const ventureSeat: Seat = {
  id: 'vs-venture',
  projectId: 'vs',
  projectCode: 'VS',
  projectTitle: 'Venture Studies',
  title: 'Venture seat',
  line: venture?.line ?? '',
  bullets: [venture?.learn1 ?? '', venture?.learn2 ?? ''].filter(Boolean),
  notes: ['scope → budget', 'brief → sponsor', 'pitch → trade-offs'],
  layers: [],
};

const pitchSeat: Seat = {
  id: 'dg003-pitch',
  projectId: 'dg-003',
  projectCode: 'DG-003',
  projectTitle: 'Unpitched build',
  title: 'Pitch lead',
  line: 'Bring a problem worth a team. The studio decides on Thursday. [confirm process]',
  bullets: ['Name the problem.', 'Name who it is for.', 'Name the first thing that could break.'],
  notes: ['status: unsigned', 'record: not opened'],
  layers: [],
};

export const RECORDS: readonly BuildRecord[] = [
  {
    id: 'dg-001',
    code: 'DG-001',
    kind: 'build',
    title: phone?.title ?? 'The Modular Smartphone',
    problem: 'Phones are built to be replaced, not repaired.',
    line: homeLandingCopy.results.cases[0]?.line ?? '',
    fields: [
      { k: 'Status', v: 'Active. Not shipped yet.' },
      { k: 'Phase', v: 'Prototyping or PCB fab', flag: 'confirm' },
      { k: 'Workflow', v: WORKFLOW.join(' → ') },
      { k: 'Subsystems', v: '7, one owner each' },
      { k: 'Toolchain', v: 'KiCad or Altium', flag: 'confirm' },
      { k: 'Duration', v: 'Start date', flag: 'placeholder' },
      { k: 'Outcome', v: 'No shipped revision yet' },
      { k: 'Repo', v: 'Not public yet', flag: 'confirm' },
    ],
    seats: phoneSeats,
    href: '/projects/modular-smartphone',
    hrefLabel: 'Open the DG-001 record',
    plate: 'PROJECT PHOTO — prototype on the bench',
  },
  {
    id: 'dg-002',
    code: 'DG-002',
    kind: 'build',
    title: glasses?.title ?? 'Smart Reading',
    problem: 'Reading means chasing the line.',
    line: glasses?.shortDescription ?? '',
    fields: [
      { k: 'Status', v: 'Active. Not shipped yet.' },
      { k: 'Method', v: 'RSVP, reader sets the pace' },
      { k: 'Compute', v: 'FPGA, real-time render' },
      { k: 'Tech', v: (glasses?.techStack ?? []).filter((t) => t !== 'RSVP').join(', ') },
      { k: 'Cycle', v: '8-month build' },
      { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
      { k: 'Outcome', v: 'Prototype state', flag: 'confirm' },
      { k: 'Cost', v: 'Free to join' },
    ],
    seats: glassesSeats,
    href: '/projects/smart-reading',
    hrefLabel: 'Open the DG-002 record',
    plate: 'PROJECT PHOTO — wearable prototype',
  },
  {
    id: 'vs',
    code: 'VS',
    kind: 'program',
    title: 'Venture Studies',
    problem: 'A build needs a budget before it needs a board.',
    line: venture?.line ?? '',
    fields: [
      { k: 'Kind', v: 'Program, serves every build' },
      { k: 'Learn', v: venture?.learn1 ?? '' },
      { k: 'Lead', v: 'To be announced' },
    ],
    seats: [ventureSeat],
    href: '/get-involved',
    hrefLabel: 'Ways into Venture Studies',
  },
  {
    id: 'dg-003',
    code: 'DG-003',
    kind: 'open',
    title: 'Nobody has pitched this one yet.',
    problem: 'Problem: blank.',
    line: 'The next record number is open. It goes to whoever brings the problem.',
    fields: [
      { k: 'Status', v: 'Unsigned' },
      { k: 'Team', v: 'Empty' },
    ],
    seats: [pitchSeat],
  },
];

export const ALL_SEATS: readonly Seat[] = RECORDS.flatMap((r) => r.seats);

export const RSVP_WORDS: readonly string[] = GLASSES_CONTENT.pov.words;
export const RSVP_DEMO_WPM: number = GLASSES_CONTENT.hud.wpm;

export const MEETING = {
  when: meetingInfo.schedule.replace('@', '·'),
  where: meetingInfo.location,
  campus: meetingInfo.campus,
  rhythm: meetingInfo.description,
};

const studentPaths = involvementCategories.find((c) => c.id === 'students')?.options.length ?? 4;
const allPaths = involvementCategories.reduce((n, c) => n + c.options.length, 0);
export const OTHER_PATHS = allPaths - studentPaths;

export const LINKS = {
  discord: siteConfig.social.discord,
  email: siteConfig.contact.email,
  contactSeat: '/contact/?type=project-team',
  otherPaths: '/get-involved/',
  legal: legalLinks,
  site: [
    { label: 'Work', href: '/projects/' },
    { label: 'Studio', href: '/about/' },
    { label: 'Join', href: '/get-involved/' },
    { label: 'Contact', href: '/contact/' },
  ],
};

export const ORG = {
  name: siteConfig.name,
  fullName: siteConfig.fullName,
  positioning: homeLandingCopy.hero.subline, // "A student-run venture studio at Cal Poly Pomona."
};
