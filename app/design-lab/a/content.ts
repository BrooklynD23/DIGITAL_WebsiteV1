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

export const BLANK = '______';

export const masthead = {
  wordmark: siteConfig.name,
  campus: siteConfig.contact.campus,
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Studio', href: '#rules' },
    { label: 'Join', href: '#join' },
  ],
  cta: { label: 'Take a subsystem', href: '/contact?type=project-team' },
  meeting: `Build night · Thu 6:00 PM · Bldg 17, Rm 1635`,
} as const;

export const hero = {
  // Canonical thesis (DESIGN.md §2.1 / homeLanding hero) split for the layout.
  thesis: 'Make something worth putting your name on.',
  kicker: 'A student-run venture studio at Cal Poly Pomona',
  footnote: 'Worth it: you can explain every decision in it to a stranger.',
  dek: 'Engineering, computer science, design and business students build real hardware here, one owned part at a time. This is the record of what is on the bench.',
  contents: [
    { n: '01', label: 'The work', href: '#work' },
    { n: '02', label: 'How a build runs', href: '#rules' },
    { n: '03', label: 'Where you fit', href: '#fit' },
    { n: '04', label: 'Credits', href: '#credits' },
    { n: '05', label: 'Thursday', href: '#join' },
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
  phone: {
    id: 'DG-001',
    href: '/projects/modular-smartphone',
    title: phoneRecord?.title ?? 'The Modular Smartphone',
    kicker: 'Hardware · flagship',
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
    plate: '[ PROJECT PHOTO — DG-001 on the bench ] [placeholder]',
  },
  reading: {
    id: 'DG-002',
    href: '/projects/smart-reading',
    title: readingRecord?.title ?? 'Smart Reading',
    kicker: 'Wearable · flagship',
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
    plate: '[ PROJECT PHOTO — DG-002 prototype on a reader ] [placeholder]',
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
    href: '/contact?type=project',
    cta: 'Propose a build',
  },
} as const;

/** Index ledger at the top of "The work" (layout borrowed from Stitch variant B). */
export const ledger = [
  { id: 'DG-001', anchor: '#dg-001', title: work.phone.title, problem: 'Phones nobody can repair', status: 'Active' },
  { id: 'DG-002', anchor: '#dg-002', title: work.reading.title, problem: 'Reading means chasing the line', status: 'Active' },
  { id: 'DG-003', anchor: '#dg-003', title: 'Unsigned', problem: 'Your proposal', status: 'Open' },
] as const;

export const rules = {
  chapter: '02',
  title: 'How a build runs',
  lede: 'Four rules hold every build together.',
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
  columns: [
    { head: 'DG-001 needs', items: subsystems.map((s) => s.title) },
    { head: 'DG-002 needs', items: ['Engineering', 'Optics', 'Firmware', 'Design', 'Research'] },
    { head: 'Venture Studies needs', items: ['Budgets', 'Sponsor briefs', 'Pitches'] },
  ],
  note: 'Bring engineering, computer science, design, or business. No project experience required.',
} as const;

export const credits = {
  chapter: '04',
  title: 'Credits',
  lede: 'The credits are blank.',
  line: `Seven seats are open for ${teamMembers[0]?.term ?? '2026–27'}. A name goes on the line when someone takes one.`,
  seats: teamMembers.map((m) => ({ id: m.id, role: m.role, filled: !m.isPlaceholder })),
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
    { n: '1', text: 'Come to build night. Free to join.' },
    { n: '2', text: 'Pick a subsystem, or a need from a build.' },
    { n: '3', text: 'Take it through the test gate. Sign it.' },
  ],
  close: 'Put your name on one.',
  primary: { label: 'Take a subsystem', href: '/contact?type=project-team' },
  discord: { label: 'Watch first on Discord', href: siteConfig.community.discord },
} as const;

export const colophon = {
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
