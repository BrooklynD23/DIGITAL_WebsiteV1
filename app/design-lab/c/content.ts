/**
 * Concept C — page content.
 *
 * Facts come from lib/data (imported, never edited). Lines marked LAB COPY are
 * exploratory concept copy: production wording still goes through
 * brand-voice-strategist → brand-guardian (BRAND.md). Unknown values are
 * rendered as NO_SIGNAL instead of being guessed.
 */
import { projects } from '@/lib/data/projects';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { siteConfig } from '@/lib/data/siteConfig';
import { meetingInfo } from '@/lib/data/involvement';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { VISION_LINE } from '@/lib/data/mission';
import { communityChannels } from '@/lib/data/community';

/** Sentinel for a field the club has not recorded. Rendered as "No signal". */
export const NO_SIGNAL = null;

const phone = projects.find((p) => p.slug === 'modular-smartphone');
const reading = projects.find((p) => p.slug === 'smart-reading');
const ventures = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');

if (!phone || !reading || !ventures) {
  throw new Error('Concept C: expected project records missing from lib/data');
}

const statusLabel = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const subsystems = phoneV2Copy.subsystemSections.map((s, i) => ({
  id: s.id,
  index: String(i + 1).padStart(2, '0'),
  title: s.title,
  description: s.description,
  bullets: [...s.bullets],
  scope: s.specLines[0].replace(/^scope:\s*/, ''),
  risk: s.specLines[1].replace(/^risk:\s*/, ''),
}));

export const workflowStages = [...phoneV2Copy.toolbox.workflowStages];
export const ownershipRules = [...phoneV2Copy.buildScope.scopeItems];

export const meeting = {
  schedule: meetingInfo.schedule,
  location: meetingInfo.location,
  campus: meetingInfo.campus,
  description: meetingInfo.description,
  short: 'Thu 6:00 PM · Bldg 17, Rm 1635',
};

export const links = {
  discord: siteConfig.social.discord,
  discordLabel: siteConfig.social.discord.replace(/^https?:\/\//, ''),
  email: siteConfig.contact.email,
  join: '/contact?type=membership',
  projectTeam: '/contact?type=project-team',
  phone: '/projects/modular-smartphone',
  reading: '/projects/smart-reading',
};

export const rsvp = {
  words: [...GLASSES_CONTENT.pov.words],
  wpm: GLASSES_CONTENT.hud.wpm,
};

export const hero = {
  eyebrow: `${siteConfig.fullName} · student-run venture studio`,
  title: homeLandingCopy.hero.lines.join(' '),
  // LAB COPY
  sub: 'Two builds are on the bench. One slot is open. Pick one and watch it form.',
  pickLegend: 'Pick a build',
  cta: 'See the builds',
};

export type FormationKey = 'phone' | 'reading' | 'unsigned';

export const formations: ReadonlyArray<{
  key: FormationKey;
  id: string;
  title: string;
  line: string;
  fields: ReadonlyArray<readonly [string, string]>;
}> = [
  {
    key: 'phone',
    id: 'DG-001',
    title: phone.title,
    line: 'Seven subsystems. One phone.', // LAB COPY (copy direction 4)
    fields: [
      ['Status', statusLabel(phone.status)],
      ['Layers', `${subsystems.length} subsystems, one owner each`],
      ['Flow', workflowStages.join(' → ')],
    ],
  },
  {
    key: 'reading',
    id: 'DG-002',
    title: reading.title,
    line: 'One word at a time, where you look.', // LAB COPY
    fields: [
      ['Status', statusLabel(reading.status)],
      ['Method', `RSVP · demo at ${GLASSES_CONTENT.hud.wpm} wpm`],
      ['Compute', 'FPGA'],
    ],
  },
  {
    key: 'unsigned',
    id: 'DG-003',
    title: 'Unsigned',
    line: 'The next build has no name yet.', // LAB COPY
    fields: [
      ['Status', 'Open'],
      ['Needs', 'A problem, a team, a first owner'],
      ['Start', 'Pitch it at build night'],
    ],
  },
];

export interface RecordField {
  readonly k: string;
  readonly v: string | readonly string[] | null;
  readonly note?: string;
}

export interface BuildRecord {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly promise: string;
  readonly href?: string;
  readonly status: string;
  readonly fields: readonly RecordField[];
}

export const records: readonly BuildRecord[] = [
  {
    id: 'DG-001',
    kicker: 'Hardware · systems',
    title: phone.title,
    promise: homeLandingCopy.results.cases[0].line,
    href: links.phone,
    status: statusLabel(phone.status),
    fields: [
      { k: 'Problem', v: 'Phones are built to be replaced, not repaired.', note: 'framing from projects.ts' },
      { k: 'Subsystems', v: `${subsystems.length}, one owner each` },
      { k: 'Workflow', v: workflowStages.join(' → ') },
      { k: 'Ownership', v: ownershipRules },
      { k: 'Toolchain', v: NO_SIGNAL, note: 'two conflicting stacks in the data; confirm with the club' },
      { k: 'Duration', v: NO_SIGNAL },
      { k: 'Outcome', v: NO_SIGNAL },
      { k: 'Built by', v: NO_SIGNAL, note: 'BUILT BY ______ [placeholder]' },
      { k: 'Partner', v: NO_SIGNAL },
      { k: 'Repo / demo', v: NO_SIGNAL },
    ],
  },
  {
    id: 'DG-002',
    kicker: 'Wearable · accessibility',
    title: reading.title,
    promise: reading.shortDescription,
    href: links.reading,
    status: statusLabel(reading.status),
    fields: [
      { k: 'Problem', v: 'Reading means chasing the line. Eyes jump, fixate, and lose their place.' },
      { k: 'Method', v: 'RSVP: one word at a fixed point. The reader sets the pace.' },
      { k: 'Technologies', v: [...reading.techStack] },
      { k: 'Needs', v: ['Engineering', 'Optics', 'Firmware', 'Design', 'Research'] },
      { k: 'Duration', v: '8-month build cycle' },
      { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
      { k: 'Outcome', v: NO_SIGNAL },
      { k: 'Built by', v: NO_SIGNAL, note: 'BUILT BY ______ [placeholder]' },
      { k: 'Repo / demo', v: NO_SIGNAL },
    ],
  },
];

export const program = {
  id: 'Program',
  title: ventures.title,
  kicker: ventures.kicker,
  line: ventures.line,
  learnings: [ventures.learn1, ventures.learn2],
};

export const unsigned = {
  id: 'DG-003',
  title: 'Unsigned',
  // LAB COPY
  line: 'Bring a problem worth a build. If it holds up at build night, it gets a number.',
  cta: 'Pitch the next build',
};

export const work = {
  eyebrow: 'The work',
  title: 'Evidence, field by field.', // LAB COPY
  sub: 'Every build carries the same fields. When something is not true yet, the field says so instead of guessing.', // LAB COPY
  rsvpLabel: 'Try the method',
};

export const process = {
  eyebrow: 'How a build runs',
  title: 'You take a subsystem. You own it through the test gate.', // LAB COPY (copy direction 3)
  sub: 'Every subsystem moves through the same four stages. The marks below are the stages, not a progress bar: the current phase is still being confirmed.', // LAB COPY
};

const discord = communityChannels.find((c) => c.id === 'discord');
const discordLine = discord?.expectations?.[1] ?? discord?.description ?? '';

export const join = {
  eyebrow: 'Join',
  title: 'Thursday is build night.', // LAB COPY
  sub: homeLandingCopy.join.body,
  aside: 'Products need more than programmers.', // LAB COPY (BRIEF §40 territory)
  steps: [
    { n: '01', title: 'Come to build night', body: `${meeting.schedule} · ${meeting.location}, ${meeting.campus}. ${meeting.description}` },
    { n: '02', title: 'Join the Discord', body: discordLine },
    { n: '03', title: 'Take a subsystem', body: 'Tell us which subsystem you want to own.' },
  ],
  cta: 'Take a subsystem',
};

export const footer = {
  vision: VISION_LINE,
  close: 'Put your name on one.', // LAB COPY (copy direction 10)
  legal: homeLandingCopy.footer.legal,
  labNote: 'Design lab · concept C · not production. Fields marked "No signal" are unrecorded, not empty.',
};
