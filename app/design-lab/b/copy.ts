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
      note: 'Each wire is a part a subsystem touches. A part with two owners is a handoff, and every handoff gets a review path.',
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
        needs: subsystems.map((s) => s.scrubberLabel.toLowerCase()).join(' · '),
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
        needs: glassesNeeds.toLowerCase(),
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
        needs: 'business · engineering [confirm]',
        cycle: '—',
        status: 'program',
        statusNote: 'Serves every build',
        href: '#vs',
      },
      {
        id: 'dg-003',
        code: 'DG-003',
        title: 'Unsigned',
        problem: 'Pitch the next build. Bring a problem worth a year.',
        needs: 'you',
        cycle: '______',
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
      { k: 'Built by', v: '______ [placeholder]' },
      { k: 'Partner', v: 'None confirmed' },
      { k: 'Repo', v: 'Not published' },
    ],
    plate: '[ PROJECT PHOTO — PROTOTYPE ON THE BENCH ] [placeholder]',
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
      { k: 'Built by', v: '______ [placeholder]' },
      { k: 'Outcome', v: 'Not published yet' },
      { k: 'Cost', v: glassesSpec('COST') },
    ],
    plate: '[ PROJECT PHOTO — WEARABLE PROTOTYPE ] [placeholder]',
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
    heading: 'This row is unsigned.',
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
    ownerValue: '______ [open]',
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
        body: 'Take an open subsystem, join a team as a contributor, or pitch DG-003.',
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
      { k: 'Drawn by', v: '______' },
      { k: 'Rev', v: '[placeholder]' },
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
