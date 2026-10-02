/**
 * Concept E view-model. Real facts come from lib/data (read-only). Concept copy is exploratory and
 * still needs brand-voice-strategist → brand-guardian before production. Unknowns are labelled
 * [placeholder] / [confirm] on purpose: nothing here may invent a number, partner or person.
 */
import { projects } from '@/lib/data/projects';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { siteConfig } from '@/lib/data/siteConfig';
import { meetingInfo, involvementCategories } from '@/lib/data/involvement';
import { teamMembers } from '@/lib/data/team';

export type StatusKind = 'active' | 'program' | 'open';

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
  readonly placeholder?: boolean;
  readonly href?: string;
}

const phone = projects.find((p) => p.slug === 'modular-smartphone');
const glasses = projects.find((p) => p.slug === 'smart-reading');
const venture = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');

if (!phone || !glasses) {
  throw new Error('Concept E: expected modular-smartphone and smart-reading records in lib/data/projects.ts');
}

const subsystems = phoneV2Copy.subsystemSections;
export const PHONE_SUBSYSTEMS = subsystems.map((s) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  scope: s.specLines[0]?.replace('scope: ', '') ?? '',
  risk: s.specLines[1]?.replace('risk: ', '') ?? '',
}));
export const PHONE_WORKFLOW = phoneV2Copy.toolbox.workflowStages;
export const OWNERSHIP_MODEL = phoneV2Copy.buildScope.scopeItems;

export const PLACEHOLDER_DATE = '[placeholder date]';
const NOT_SHIPPED = '[placeholder — not shipped yet]';

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
    stage: `${subsystems.length} subsystems · phase [confirm]`,
    outcome: NOT_SHIPPED,
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
    stage: '8-month build cycle · phase [confirm]',
    outcome: NOT_SHIPPED,
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
    stage: 'Serves every build · no page yet',
    outcome: '[placeholder — no artifacts published]',
    outcomeShort: 'No artifacts yet',
    disciplines: ['Business', 'Engineering'],
    href: '/contact?type=project-team',
    hrefLabel: 'Ask about Venture Studies',
  },
  {
    id: 'dg-003',
    code: 'DG-003',
    title: 'Unassigned',
    line: 'The next build has no owner yet. Bring the problem.',
    problem: '[placeholder — pitch process not published]',
    status: 'open',
    statusLabel: 'Open slot',
    stage: '—',
    outcome: '—',
    outcomeShort: 'Unassigned',
    disciplines: [],
    href: '/contact?type=project-team',
    hrefLabel: 'Pitch a build',
  },
];

export const PHONE_FACTS: readonly FactRow[] = [
  { k: 'Problem', v: 'Devices built to be thrown away, not repaired.' },
  { k: 'Disciplines', v: subsystems.map((s) => s.title).join(' · ') },
  { k: 'Technologies', v: '[confirm — toolchain sources conflict]', placeholder: true },
  { k: 'Duration', v: '[placeholder — not set]', placeholder: true },
  { k: 'Status', v: 'Active · phase [confirm]' },
  { k: 'Workflow', v: PHONE_WORKFLOW.join(' → ') },
  { k: 'Outcome', v: NOT_SHIPPED, placeholder: true },
  { k: 'Contributors', v: 'Built by ______ (unsigned)', placeholder: true },
  { k: 'Partner', v: 'Partner slot open', placeholder: true },
  { k: 'Repo / demo', v: '[placeholder — not public]', placeholder: true },
];

export const GLASSES_FACTS: readonly FactRow[] = [
  { k: 'Problem', v: 'Saccades and fixations: eyes chase the line and lose their place.' },
  { k: 'Disciplines', v: glassesNeeds.join(' · ') },
  { k: 'Technologies', v: (glasses.techStack ?? []).join(' · ') },
  { k: 'Duration', v: '8-month build cycle' },
  { k: 'Status', v: 'Active · phase [confirm]' },
  { k: 'Method', v: `RSVP · reader sets the pace (demo ${GLASSES_CONTENT.hud.wpm} wpm)` },
  { k: 'Outcome', v: NOT_SHIPPED, placeholder: true },
  { k: 'Contributors', v: 'Built by ______ (unsigned)', placeholder: true },
  { k: 'Mentor', v: 'Dr. Mohamed El Hadedy' },
  { k: 'Partner', v: 'Partner slot open', placeholder: true },
  { k: 'Repo / demo', v: '[placeholder — not public]', placeholder: true },
];

export const RSVP_WORDS = GLASSES_CONTENT.pov.words;
export const RSVP_WPM = GLASSES_CONTENT.hud.wpm;

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
