/**
 * Concept A "Editorial / Studio" — page content.
 *
 * Facts come from lib/data (imported, never edited). Lines written for this
 * concept are EXPLORATORY copy: they still go through brand-voice-strategist →
 * brand-guardian before any production use. Unverified values are marked
 * [confirm] or [placeholder] in the rendered text itself.
 */
import { projects } from '@/lib/data/projects';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { meetingInfo } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';
import { teamMembers } from '@/lib/data/team';
import { homeLandingCopy } from '@/lib/data/homeLanding';

const phoneRecord = projects.find((p) => p.slug === 'modular-smartphone');
const readingRecord = projects.find((p) => p.slug === 'smart-reading');
const venture = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');

const JOIN_HREF = '/contact?type=project-team';

export const masthead = {
  wordmark: siteConfig.name,
  campus: siteConfig.contact.campus,
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Studio', href: '#rules' },
    { label: 'Join', href: '#join' },
  ],
  cta: { label: 'Take a subsystem', href: JOIN_HREF },
  meeting: 'Build night, Thursdays 6:00 PM, Bldg 17 Rm 1635',
} as const;

export const hero = {
  // Canonical thesis (DESIGN.md §2.1 / homeLanding hero).
  thesis: 'Make something worth putting your name on.',
  kicker: 'A student-run venture studio at Cal Poly Pomona',
  footnote: 'Worth it: you can explain every decision in it to a stranger.',
  dek: 'Engineering, computer science, design and business students build real hardware here, one owned part at a time.',
  primary: { label: 'Take a subsystem', href: JOIN_HREF },
  secondary: { label: 'See the work', href: '#work' },
  contents: [
    { n: '01', label: 'The work', href: '#work' },
    { n: '02', label: 'How the studio runs', href: '#rules' },
    { n: '03', label: 'Where you fit', href: '#fit' },
    { n: '04', label: 'Masthead', href: '#staff' },
    { n: '05', label: 'Thursday: take a subsystem', href: '#join' },
  ],
} as const;

export const subsystems = phoneV2Copy.subsystemSections.map((s, i) => ({
  n: String(i + 1).padStart(2, '0'),
  id: s.id,
  title: s.title,
  description: s.description,
}));

export const workflowStages = phoneV2Copy.toolbox.workflowStages;
export const ownershipRules = phoneV2Copy.buildScope.scopeItems;

export const work = {
  chapter: '01',
  title: 'The work',
  lede: 'Two builds on the bench. One open slot.',
  byline: 'Built by',
  phone: {
    id: 'DG-001',
    href: '/projects/modular-smartphone',
    title: phoneRecord?.title ?? 'The Modular Smartphone',
    kicker: 'Hardware',
    splitFirst: 'One device.',
    splitSecond: 'Owned in parts.',
    body: [
      'Most phones are built to be replaced, not repaired.',
      'DG-001 is a smartphone built from scratch around repair, upgrades, and real subsystem interfaces. Seven subsystems, from the board to the apps. Each one has an owner who takes it from first decision to final test.',
    ],
    record: [
      { k: 'Problem', v: 'Devices nobody can open or repair' },
      { k: 'Status', v: `${phoneRecord?.status === 'active' ? 'Active' : 'Unknown'} · phase [confirm]` },
      { k: 'Subsystems', v: '7, one owner each' },
      { k: 'Workflow', v: workflowStages.join(' → ') },
      { k: 'Duration', v: '[confirm]' },
      { k: 'Outcome', v: 'Not shipped yet' },
      { k: 'Partner', v: 'None confirmed' },
      { k: 'Repo', v: 'Not public yet [confirm]' },
    ],
    plate: '[ PHOTO: DG-001 on the bench ] [placeholder]',
    take: 'Take one of these seven',
  },
  reading: {
    id: 'DG-002',
    href: '/projects/smart-reading',
    title: readingRecord?.title ?? 'Smart Reading',
    kicker: 'Wearable',
    splitFirst: 'One word',
    splitSecond: 'at a time.',
    body: [
      'Reading means chasing the line. Your eyes jump, fixate, and lose their place.',
      readingRecord?.shortDescription ??
        'FPGA-based heads-up glasses that show one word at a time, right where you look.',
      'The reader sets the pace. The words come to them.',
    ],
    record: [
      { k: 'Problem', v: 'Saccades: the eyes chase the line' },
      { k: 'Status', v: `${readingRecord?.status === 'active' ? 'Active' : 'Unknown'} · phase [confirm]` },
      { k: 'Method', v: 'RSVP, reader-set WPM' },
      { k: 'Stack', v: (readingRecord?.techStack ?? []).join(', ') },
      { k: 'Build cycle', v: '8 months' },
      { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
      { k: 'Needs', v: 'Engineering, optics, firmware, design, research' },
      { k: 'Outcome', v: 'Prototype state [confirm]' },
    ],
    words: GLASSES_CONTENT.pov.words,
    demoWpm: GLASSES_CONTENT.hud.wpm,
  },
  venture: {
    kicker: venture?.kicker ?? 'Technical Entrepreneurship',
    title: venture?.title ?? 'Venture Studies',
    line: venture?.line ?? 'Turn engineering scope into budgets, sponsor briefs, and pitches.',
    learns: [venture?.learn1, venture?.learn2].filter((l): l is string => Boolean(l)),
  },
  open: {
    id: 'DG-003',
    title: 'Pitch the next build.',
    line: 'This slot is empty. The next project starts as a proposal someone brings on a Thursday.',
    // general topic: ?type=project pre-selects the phone project (contactTopics.ts:8,27).
    href: '/contact?type=general',
    cta: 'Propose a build',
  },
} as const;

/** Index ledger at the top of "The work" (layout borrowed from Stitch variant B). */
export const ledger = [
  { id: 'DG-001', anchor: '#dg-001', title: work.phone.title, problem: 'Phones nobody can repair', status: 'Active' },
  { id: 'DG-002', anchor: '#dg-002', title: work.reading.title, problem: 'Reading means chasing the line', status: 'Active' },
  { id: 'DG-003', anchor: '#dg-003', title: 'Unsigned', problem: 'Problem: blank', status: 'Open' },
] as const;

export const rules = {
  chapter: '02',
  title: 'How the studio runs',
  // The four rules are DG-001's ownership model (phoneV2.ts); scoped until the club confirms them studio-wide.
  lede: 'Four rules hold DG-001 together.',
  glosses: [
    'You take a subsystem.',
    'Someone reviews every handoff.',
    'You own it through the test gate.',
    'The next cohort can fix what you made.',
  ],
} as const;

export const fit = {
  chapter: '03',
  title: 'Where you fit',
  lede: 'Products need more than programmers.',
  rows: [
    { head: 'DG-001', text: 'Any of the seven subsystems in Fig. 2, from systems architecture to integration and testing.' },
    { head: 'DG-002', text: 'Engineering, optics, firmware, design, research.' },
    { head: 'Venture Studies', text: 'Budgets, sponsor briefs, pitches.' },
  ],
  note: 'Bring engineering, computer science, design, or business. No project experience required.',
} as const;

const officerIds = new Set(['president', 'vice-president', 'secretary', 'treasurer']);

export const staff = {
  chapter: '04',
  title: 'Masthead',
  lede: 'The masthead is blank.',
  edition: `Edition ${teamMembers[0]?.term ?? '2026–27'}`,
  line: 'Seven seats, no names yet. A name goes in when someone takes the seat.',
  groups: [
    {
      head: 'Officers',
      seats: teamMembers.filter((m) => officerIds.has(m.id)).map((m) => ({ id: m.id, role: m.role, desk: '' })),
    },
    {
      head: 'Project leads',
      seats: teamMembers
        .filter((m) => !officerIds.has(m.id))
        .map((m) => ({ id: m.id, role: 'Lead', desk: m.role.replace(/^Project Lead\s*[—-]\s*/, '') })),
    },
  ],
  cta: { label: 'Apply for a seat', href: '/contact?type=leadership' },
} as const;

export const join = {
  chapter: '05',
  title: 'Thursday',
  day: 'Thursday,',
  time: '6:00 PM.',
  place: `${meetingInfo.location} · ${meetingInfo.campus}`,
  description: meetingInfo.description,
  steps: [
    { n: '1', text: 'Come to build night. No project experience required.' },
    { n: '2', text: 'Pick a subsystem, or a need from a build.' },
    { n: '3', text: 'Take it through the test gate. Sign it.' },
  ],
  primary: { label: 'Take a subsystem', href: JOIN_HREF },
  discord: { label: 'Watch first on Discord', href: siteConfig.community.discord },
} as const;

export const colophon = {
  close: 'The next edition prints when these lines fill.',
  closeNote: '[copy, confirm]',
  name: siteConfig.fullName,
  email: siteConfig.contact.email,
  discord: siteConfig.community.discord,
  meeting: `${meetingInfo.schedule} · ${meetingInfo.location}`,
  setIn: 'Set in Zodiak, Switzer and JetBrains Mono.',
  disclaimer: 'Design lab prototype A. Not the live site. Copy is exploratory.',
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const;
