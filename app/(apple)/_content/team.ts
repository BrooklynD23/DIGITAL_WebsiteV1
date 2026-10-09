/**
 * Team page copy (Apple system). Roster comes from lib/data/team.ts. Every record there is a placeholder today
 * (no names, no photos), so a placeholder renders as its seat: the role, then the term or the build.
 * A confirmed record (isPlaceholder: false) renders the name with the role under it.
 * ponytail: no photo rendering, since no record has an image. Add it when one does.
 */
import { involvementCategories } from '@/lib/data/involvement';
import { executiveRoles, teamMembers, type TeamMember } from '@/lib/data/team';

/** lib/data/team.ts still uses the old project names. */
const BUILD_NAME: Readonly<Record<string, string>> = { 'Modular Smartphone': 'SIDEKICK', 'Smart Reading': 'SHADES' };

const sentenceCase = (t: string): string => t.charAt(0) + t.slice(1).toLowerCase();

export interface Seat {
  readonly id: string;
  readonly title: string;
  readonly meta?: string;
}

function seat(m: TeamMember): Seat {
  const project = m.project ? BUILD_NAME[m.project] ?? m.project : undefined;
  const role = m.roleCategory === 'project-lead' ? 'Project lead' : sentenceCase(m.role);
  const detail = project ?? m.term;
  if (m.isPlaceholder) return { id: m.id, title: role, meta: detail };
  return { id: m.id, title: m.name, meta: detail ? `${role} · ${detail}` : role };
}

const ordered = [...teamMembers].sort((a, b) => a.order - b.order);
const term = ordered.find((m) => m.term)?.term;
const leadership = involvementCategories.flatMap((c) => c.options).find((o) => o.id === 'leadership');

export const TEAM = {
  meta: {
    title: 'Team · DIGITAL',
    description: 'The officer seats and project leads at DIGITAL @ Cal Poly Pomona.',
  },
  hero: {
    title: 'Run by students.',
    lead: `Officer seats and project leads${term ? ` for ${term}` : ''}. Names are not published yet.`,
  },
  groups: [
    { id: 'board', title: 'Executive board', seats: ordered.filter((m) => executiveRoles.includes(m.roleCategory)).map(seat) },
    { id: 'leads', title: 'Project leads', seats: ordered.filter((m) => m.roleCategory === 'project-lead').map(seat) },
  ],
  apply: { label: sentenceCase(leadership?.title ?? 'Apply for leadership'), href: leadership?.link ?? '/contact/?type=leadership' },
} as const;
