/**
 * Concept E view-model. Real facts come from lib/data (read-only). Concept copy is exploratory and
 * still needs brand-voice-strategist → brand-guardian before production. Nothing here may invent a
 * number, partner or person; unknowns are typed as 'open' / 'pending' (see BlankKind) or LAB_NOTES.
 */
import { projects } from '@/lib/data/projects';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { siteConfig } from '@/lib/data/siteConfig';
import { meetingInfo, involvementCategories } from '@/lib/data/involvement';
import { teamMembers } from '@/lib/data/team';

export type StatusKind = 'active' | 'program' | 'open';

/**
 * Three kinds of blank, styled differently (v2):
 * - 'open'    an invitation the visitor can act on (seat, partner slot) → accent-dashed chip + link
 * - 'pending' an honest gap with a reason, no action (outcome not shipped) → quiet neutral chip
 * - lab TODOs ([confirm] conflicts in the source data) live only in LAB_NOTES, never inline
 */
export type BlankKind = 'open' | 'pending';

export interface LedgerEntry {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly line: string;
  readonly status: StatusKind;
  readonly statusLabel: string;
  readonly stage: string;
  readonly outcome: string;
  readonly outcomeShort: string;
  readonly route?: string;
  readonly disciplines: readonly string[];
  readonly href: string;
  readonly hrefLabel: string;
  readonly problem?: string;
}

export interface FactRow {
  readonly k: string;
  readonly v: string;
  readonly state?: BlankKind;
  readonly href?: string;
}

const phone = projects.find((p) => p.slug === 'modular-smartphone');
const glasses = projects.find((p) => p.slug === 'smart-reading');
const venture = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');

if (!phone || !glasses) {
  throw new Error('Concept E: expected modular-smartphone and smart-reading records in lib/data/projects.ts');
}

/** Physical stack order, top → back. The scroll story and its numbering follow it (v2: highlight descends). */
const STACK_ORDER = [
  'apps-ux',
  'operating-system',
  'systems-architecture',
  'firmware-embedded',
  'hardware-pcb',
  'integration-testing',
  'mechanical-cad',
] as const;

const subsystems = [...phoneV2Copy.subsystemSections].sort(
  (a, b) => STACK_ORDER.indexOf(a.id as (typeof STACK_ORDER)[number]) - STACK_ORDER.indexOf(b.id as (typeof STACK_ORDER)[number]),
);
export const PHONE_SUBSYSTEMS = subsystems.map((s) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  bullets: s.bullets,
  scope: s.specLines[0]?.replace('scope: ', '') ?? '',
  risk: s.specLines[1]?.replace('risk: ', '') ?? '',
}));
export type Subsystem = (typeof PHONE_SUBSYSTEMS)[number];
export const PHONE_WORKFLOW = phoneV2Copy.toolbox.workflowStages;
export const OWNERSHIP_MODEL = phoneV2Copy.buildScope.scopeItems;
/** Short column heads for the gate board, one per ownership-model line (phoneV2.ts buildScope). */
export const GATE_HEADS = ['Owner named', 'Review path', 'Test gate', 'Repair plan'] as const;

const glassesNeeds = ['Engineering', 'Optics', 'Firmware', 'Design', 'Research'] as const;

export const LEDGER: readonly LedgerEntry[] = [
  {
    id: 'dg-001',
    code: 'DG-001',
    title: phone.title,
    line: 'Build a modular smartphone around repair, upgrades, and real subsystem interfaces.',
    problem: 'Phones are built to be replaced, not repaired.',
    status: 'active',
    statusLabel: 'Active',
    stage: `${subsystems.length} subsystems · ${subsystems.length} owner seats`,
    outcome: 'Not shipped',
    outcomeShort: 'Not shipped',
    route: '/projects/modular-smartphone',
    disciplines: subsystems.map((s) => s.title),
    href: '#case-dg-001',
    hrefLabel: 'Read the case study',
  },
  {
    id: 'dg-002',
    code: 'DG-002',
    title: glasses.title,
    line: glasses.shortDescription,
    problem: 'Reading means chasing the line and losing your place.',
    status: 'active',
    statusLabel: 'Active',
    stage: '8-month build cycle',
    outcome: 'Not shipped',
    outcomeShort: 'Not shipped',
    route: '/projects/smart-reading',
    disciplines: glassesNeeds,
    href: '#case-dg-002',
    hrefLabel: 'Read the case study',
  },
  {
    id: 'vs',
    code: 'PROGRAM',
    title: 'Venture Studies',
    line: venture?.line ?? 'Turn engineering scope into budgets, sponsor briefs, and pitches.',
    problem: 'Map technical scope to budget and sponsorship. Defend trade-offs in front of sponsors.',
    status: 'program',
    statusLabel: 'Program',
    stage: 'Serves every build',
    outcome: 'No artifacts published yet',
    outcomeShort: 'No artifacts yet',
    disciplines: ['Business', 'Engineering'],
    href: '/contact?type=project-team',
    hrefLabel: 'Ask about Venture Studies',
  },
  {
    id: 'dg-003',
    code: 'DG-003',
    title: 'Unassigned',
    line: 'No build in this row yet. Bring the problem.',
    status: 'open',
    statusLabel: 'Open slot',
    stage: 'Waiting for a pitch',
    outcome: 'Open',
    outcomeShort: 'Open',
    disciplines: [],
    href: '/contact?type=project-team',
    hrefLabel: 'Pitch a build',
  },
];

export const PHONE_FACTS: readonly FactRow[] = [
  { k: 'Problem', v: 'Devices built to be thrown away, not repaired.' },
  { k: 'Subsystems', v: subsystems.map((s) => s.title).join(' · ') },
  { k: 'Workflow', v: PHONE_WORKFLOW.join(' → ') },
  { k: 'Status', v: 'Active' },
  { k: 'Owners', v: `${subsystems.length} seats unassigned`, state: 'open', href: '#roles' },
  { k: 'Partner', v: 'Open', state: 'open', href: '/contact?type=sponsor' },
  { k: 'Pending', v: 'Technologies · duration · outcome · repo', state: 'pending' },
];

export const GLASSES_FACTS: readonly FactRow[] = [
  { k: 'Problem', v: 'Saccades and fixations: eyes chase the line and lose their place.' },
  { k: 'Needs', v: glassesNeeds.join(' · ') },
  { k: 'Technologies', v: (glasses.techStack ?? []).join(' · ') },
  { k: 'Duration', v: '8-month build cycle' },
  { k: 'Method', v: `RSVP · reader sets the pace (demo ${GLASSES_CONTENT.hud.wpm} wpm)` },
  { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
  { k: 'Status', v: 'Active' },
  { k: 'Project lead', v: 'Unassigned', state: 'open', href: '#roles' },
  { k: 'Partner', v: 'Open', state: 'open', href: '/contact?type=sponsor' },
  { k: 'Pending', v: 'Outcome · repo · prototype photos', state: 'pending' },
];

/** Design-lab only: conflicts in lib/data the club must resolve before any production pass. */
export const LAB_NOTES: readonly string[] = [
  'DG-001 phase: projects.ts says "Prototyping", about.ts says "PCB fabrication". Both builds show no phase until one is confirmed.',
  'DG-001 toolchain: KiCad / PlatformIO (projects.ts) vs Altium / SolidWorks (about.ts).',
  'DG-001 duration: "3 semesters" is unverified.',
  'Subsystem owner seats: confirm they are open for applications (owners are unnamed in data).',
  'Ledger date: needs a real date and an owner who keeps it current.',
  'DG-003: pitch process is not published.',
];
export const LEDGER_AS_OF: string | null = null;

export const RSVP_WORDS = GLASSES_CONTENT.pov.words;
export const RSVP_WPM = GLASSES_CONTENT.hud.wpm;

/** Studio operations seats (team.ts): all `isPlaceholder` today. */
export const SEATS = teamMembers.map((m) => ({
  id: m.id,
  role: m.role,
  term: m.term ?? '—',
  open: m.isPlaceholder === true,
}));

const companies = involvementCategories.find((c) => c.id === 'companies');
export const COMPANY_PATHS = (companies?.options ?? []).map((o) => ({
  id: o.id,
  title: o.title,
  // 'Recruit Talent' copy claims grads "who have shipped"; nothing has shipped yet, so use the category line instead.
  description: o.id === 'recruit' ? companies?.subtitle ?? o.description : o.description,
  href: o.link,
}));

export const MEETING = {
  when: meetingInfo.schedule.replace(' @ ', ' · '),
  where: meetingInfo.location,
  campus: meetingInfo.campus,
  line: meetingInfo.description,
};

export const LINKS = {
  discord: siteConfig.social.discord,
  email: siteConfig.contact.email,
  join: '/contact?type=project-team',
  membership: '/contact?type=membership',
  phoneRoute: '/projects/modular-smartphone',
  glassesRoute: '/projects/smart-reading',
};
