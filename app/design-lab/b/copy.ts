/**
 * Concept B copy + record assembly. Exploratory wording for the design lab only:
 * production copy still goes brand-voice-strategist → brand-guardian.
 * Facts come from lib/data; anything unverified is marked [confirm] / [placeholder].
 */
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { getProjectBySlug } from '@/lib/data/projects';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { meetingInfo } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';
import { teamMembers } from '@/lib/data/team';
import { VISION_LINE } from '@/lib/data/mission';

export type BuildStatus = 'active' | 'program' | 'open';

export interface IndexRow {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly problem: string;
  readonly needs: string;
  readonly cycle: string;
  readonly status: BuildStatus;
  readonly statusNote: string;
  readonly href: string;
}

const phone = getProjectBySlug('modular-smartphone');
const glasses = getProjectBySlug('smart-reading');
const venture = homeLandingCopy.results.cases[2];

export const subsystems = phoneV2Copy.subsystemSections;
export const workflowStages = phoneV2Copy.toolbox.workflowStages;
export const ownershipRules = phoneV2Copy.buildScope.scopeItems;

const glassesSpec = (key: string) =>
  GLASSES_CONTENT.info.flatMap((s) => s.specs ?? []).find((s) => s.k === key)?.v ?? '';
const glassesNeeds = 'Engineering · optics · firmware · design · research';

export const copy = {
  nav: {
    links: [
      { code: '01', label: 'Work', href: '#work' },
      { code: '02', label: 'How a build runs', href: '#process' },
      { code: '03', label: 'Join', href: '#join' },
    ],
    cta: { label: 'Take a subsystem', href: '/contact?type=project-team' },
    menuLabel: 'Index',
  },
  hero: {
    eyebrow: 'DIGITAL @ Cal Poly Pomona',
    lines: ['Make something', 'worth putting', 'your name on.'],
    positioning: homeLandingCopy.hero.subline,
    mechanism:
      'Two builds are on the bench. The phone splits into seven subsystems. Each one gets one owner and one test gate before merge.',
    primary: { label: 'Take a subsystem', href: '/contact?type=project-team' },
    secondary: { label: 'See the builds', href: '#work' },
    meta: [
      { k: 'Build night', v: 'Thu · 6:00 PM' },
      { k: 'Where', v: `${meetingInfo.location.replace('Building', 'Bldg').replace('Room', 'Rm')}` },
      { k: 'On the bench', v: 'DG-001 · DG-002' },
      { k: 'Experience', v: 'None required' },
    ],
    figure: {
      title: 'Fig. 1 — DG-001 Modular Smartphone',
      caption: 'Subsystem → part interface map',
      note: 'A subsystem is one part of the phone that one person owns. Each wire is a part it touches. A part shared by two subsystems is a handoff (red), and every handoff gets a review. Dashed red: no owner yet.',
      source: 'Generated from the build page’s subsystem → part data. Part names are the page model’s; leads to confirm [confirm].',
    },
  },
  index: {
    code: '01',
    eyebrow: 'Work',
    heading: 'On the bench',
    lede: 'Two builds, one program, one open slot. Status is what’s true today, not what’s planned.',
    filterLabel: 'Filter by status',
    columns: ['ID', 'Build', 'Problem', 'Needs', 'Cycle', 'Status'],
    rows: [
      {
        id: 'dg-001',
        code: 'DG-001',
        title: phone?.title ?? 'The Modular Smartphone',
        problem: 'Phones are built to be thrown away, not repaired.',
        needs: 'EE · SW · ME · ID · DS · OP [confirm]',
        cycle: '[confirm]',
        status: 'active',
        statusNote: 'Phase [confirm]',
        href: '#dg-001',
      },
      {
        id: 'dg-002',
        code: 'DG-002',
        title: glasses?.title ?? 'Smart Reading',
        problem: 'Reading means your eyes chase the line and lose their place.',
        needs: 'EE · SW · ID · DS + optics',
        cycle: glassesSpec('CYCLE') || '8-month build',
        status: 'active',
        statusNote: 'Phase not published',
        href: '#dg-002',
      },
      {
        id: 'vs',
        code: 'VS',
        title: venture.title,
        problem: venture.line,
        needs: 'VN · CM [confirm]',
        cycle: '—',
        status: 'program',
        statusNote: 'Serves every build',
        href: '#vs',
      },
      {
        id: 'dg-003',
        code: 'DG-003',
        title: 'Open slot',
        problem: 'Pitch the next build. Bring a problem worth a year.',
        needs: 'any',
        cycle: '—',
        status: 'open',
        statusNote: 'Needs an owner',
        href: '#dg-003',
      },
    ] satisfies readonly IndexRow[],
    statusLabels: { active: 'Active', program: 'Program', open: 'Open' } as const,
  },
  dg001: {
    code: 'DG-001',
    title: phone?.title ?? 'The Modular Smartphone',
    heading: 'Seven subsystems. One phone.',
    problem: 'Devices are built to be thrown away. This one is built to be opened, repaired and upgraded.',
    object: 'A modular phone, built from scratch by students, split into subsystems with real interfaces.',
    tableCaption: 'Subsystem register — scope, risk and mode as written by the build page',
    fields: [
      { k: 'Status', v: 'Active · phase [confirm]' },
      { k: 'Disciplines', v: '7 subsystems, one owner each' },
      { k: 'Workflow', v: workflowStages.join(' → ') },
      { k: 'Duration', v: '[confirm]' },
      { k: 'Outcome', v: 'No shipped revision yet' },
      { k: 'Owners', v: '0 of 7 assigned' },
      { k: 'Partner', v: 'None confirmed' },
      { k: 'Repo', v: 'Not published' },
      { k: 'Photo log', v: '0 entries [placeholder]' },
    ],
    link: { label: 'Open the build record', href: '/projects/modular-smartphone' },
  },
  dg002: {
    code: 'DG-002',
    title: glasses?.title ?? 'Smart Reading',
    heading: GLASSES_CONTENT.reveal.headline,
    problem: 'Reading a line means jumping your eyes across it, over and over. Lose the jump, lose your place.',
    object: glasses?.shortDescription ?? '',
    chainTitle: 'Fig. 2 — DG-002 signal chain',
    timingTitle: 'Fig. 3 — RSVP timing at the demo setting',
    timingNote:
      'At a fixed pace every word gets the same slot. The reader picks the pace; this plot uses the demo HUD value.',
    fields: [
      { k: 'Status', v: 'Active · phase not published' },
      { k: 'Method', v: glassesSpec('METHOD') },
      { k: 'Compute', v: glassesSpec('COMPUTE') },
      { k: 'Stack', v: (glasses?.techStack ?? []).join(' · ') },
      { k: 'Duration', v: glassesSpec('CYCLE') },
      { k: 'Needs', v: glassesNeeds },
      { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
      { k: 'Credits', v: 'Not published yet' },
      { k: 'Outcome', v: 'Not published yet' },
      { k: 'Cost', v: glassesSpec('COST') },
      { k: 'Photo log', v: '0 entries [placeholder]' },
    ],
    link: { label: 'Open the build record', href: '/projects/smart-reading' },
  },
  vs: {
    code: 'VS',
    title: venture.title,
    kicker: venture.kicker,
    line: venture.line,
    learn: [venture.learn1, venture.learn2],
    note: 'Program, not a build. No page yet.',
  },
  dg003: {
    code: 'DG-003',
    title: 'Open slot',
    heading: 'No problem on file yet.',
    body: 'The next build starts with a problem someone is willing to own. Bring one to build night, or write it down first.',
    cta: { label: 'Pitch the next build', href: '/contact?type=project' },
  },
  process: {
    code: '02',
    eyebrow: 'How a build runs',
    heading: 'One owner. One review per handoff. One test gate.',
    lede: 'Pick a subsystem and trace it through the workflow. The rules are the same for all seven.',
    selectLabel: 'Trace a subsystem',
    ownerLabel: 'Owner',
    ownerValue: 'Unassigned',
    gateBeforeMerge: 'Test gate',
    gateBeforeRelease: 'Repair plan',
    release: 'Release',
  },
  join: {
    code: '03',
    eyebrow: 'Join',
    heading: 'Take a subsystem.',
    lede: homeLandingCopy.join.body,
    steps: [
      {
        n: '01',
        title: 'Come to build night',
        body: `${meetingInfo.schedule.replace(' @ ', ', ')}. ${meetingInfo.location}, ${meetingInfo.campus}. ${meetingInfo.description.split('. ')[1] ?? ''}`.trim(),
      },
      {
        n: '02',
        title: 'Watch the Discord first',
        body: 'See what each team is stuck on this week before you commit to anything.',
      },
      {
        n: '03',
        title: 'Pick a boundary',
        body: 'Find your column in Fig. 4. Then take an open subsystem, join a team as a contributor, or pitch DG-003.',
      },
    ],
    primary: { label: 'Take a subsystem', href: '/contact?type=project-team' },
    discord: { label: 'Open the Discord', href: siteConfig.social.discord },
    seatsHeading: 'Seat register',
    seatsNote: 'Every leadership seat for 2026–27 is open.',
    seats: teamMembers.map((m) => ({ id: m.id, role: m.role, term: m.term ?? '—' })),
    cost: 'Free to join',
  },
  footer: {
    vision: VISION_LINE,
    cells: [
      { k: 'Org', v: siteConfig.fullName },
      { k: 'Sheet', v: 'Home · index' },
      { k: 'Build night', v: `${meetingInfo.schedule} · ${meetingInfo.location}` },
      { k: 'Contact', v: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
      { k: 'Discord', v: 'discord.gg/Vsg3qcNVzv', href: siteConfig.social.discord },
    ],
    legal: homeLandingCopy.footer.legal,
    lab: 'Design lab concept B · Engineering / System · not production',
  },
} as const;

/** DG-002 signal chain, derived from the Smart Reading record. */
export const signalStages = [
  { key: 'text', label: 'Text', detail: 'any page' },
  { key: 'rsvp', label: glassesSpec('METHOD') || 'RSVP', detail: 'one fixed point' },
  { key: 'fpga', label: glassesSpec('COMPUTE') || 'FPGA', detail: 'real-time render' },
  { key: 'optics', label: 'Optics', detail: 'heads-up display' },
  { key: 'reader', label: 'Reader', detail: 'eyes stay put' },
] as const;

export const rsvp = {
  words: GLASSES_CONTENT.pov.words,
  wpm: GLASSES_CONTENT.hud.wpm,
  paceLabel: glassesSpec('PACE') || 'You set the WPM',
};

/** DESIGN.md §9.3 discipline codes. */
export const disciplineCodes = [
  { code: 'ME', name: 'Mechanical & manufacturing' },
  { code: 'EE', name: 'Electrical & embedded' },
  { code: 'SW', name: 'Software & firmware' },
  { code: 'DS', name: 'Data, science & research' },
  { code: 'ID', name: 'Industrial design & UX' },
  { code: 'VN', name: 'Venture: business, finance, go-to-market' },
  { code: 'CM', name: 'Communications & media' },
  { code: 'OP', name: 'Operations & program' },
] as const;

export type DisciplineCode = (typeof disciplineCodes)[number]['code'];

export interface MatrixRow {
  readonly ref: string;
  readonly label: string;
  readonly codes: readonly DisciplineCode[];
  /** 'record' = stated in lib/data; 'inferred' = read from the subsystem scope text, leads to confirm. */
  readonly source: 'record' | 'inferred';
}

/**
 * Fig. 4 — build × discipline. Phone rows are inferred from each subsystem's scope
 * line in phoneV2.ts [confirm]. DG-002 maps its stated needs (engineering → EE,
 * firmware → SW, design → ID, research → DS; optics has no code). VS maps its
 * stated work (budgets, sponsor briefs, pitches → VN, CM) [confirm].
 */
const inferred: Record<string, readonly DisciplineCode[]> = {
  'systems-architecture': ['ME', 'EE', 'SW', 'OP'],
  'hardware-pcb': ['EE'],
  'firmware-embedded': ['EE', 'SW'],
  'operating-system': ['SW'],
  'apps-ux': ['SW', 'ID'],
  'mechanical-cad': ['ME', 'ID'],
  'integration-testing': ['ME', 'EE', 'SW', 'DS'],
};

export const disciplineMatrix: readonly MatrixRow[] = [
  ...subsystems.map((s, i) => ({
    ref: `S${i + 1}`,
    label: s.scrubberLabel,
    codes: inferred[s.id] ?? [],
    source: 'inferred' as const,
  })),
  { ref: 'DG-002', label: 'SMART READING', codes: ['EE', 'SW', 'ID', 'DS'], source: 'record' },
  { ref: 'VS', label: 'VENTURE', codes: ['VN', 'CM'], source: 'inferred' },
];

/** No subsystem owner is published (team.ts: every lead is TBA). */
export const subsystemOwners: Readonly<Record<string, string | null>> = Object.fromEntries(
  subsystems.map((s) => [s.id, null]),
);

export const matrixCopy = {
  title: 'Fig. 4 — Where you fit: build × discipline',
  note: 'Products need more than programmers. Every column has a build that needs it.',
  legendRecord: 'stated in the project record',
  legendInferred: 'read from the subsystem scope [confirm]',
};
