/**
 * Team roster.
 *
 * Every record below is an explicitly-marked placeholder until the club
 * provides real names, photos, and links (tracked in TODO.md backlog).
 * Placeholder records render with the visible "To be announced" treatment —
 * we never ship invented individuals or fabricated contact details.
 */

export type RoleCategory =
  | 'president'
  | 'vice-president'
  | 'secretary'
  | 'treasurer'
  | 'project-lead'
  | 'project-manager';

export interface TeamMember {
  readonly id: string;
  /** Placeholder text when unfilled; rendered with the placeholder treatment. */
  readonly name: string;
  /** Display title. */
  readonly role: string;
  readonly roleCategory: RoleCategory;
  /** Required for 'project-lead' — the project they run. */
  readonly project?: string;
  readonly bio?: string;
  readonly image?: string;
  /** Required whenever `image` is set. */
  readonly imageAlt?: string;
  readonly links?: {
    readonly linkedin?: string;
    readonly github?: string;
    readonly portfolio?: string;
    readonly email?: string;
  };
  readonly order: number;
  readonly term?: string;
  readonly isPlaceholder: boolean;
}

const TBD = 'To be announced';

export const teamMembers: readonly TeamMember[] = [
  {
    id: 'president',
    name: TBD,
    role: 'President',
    roleCategory: 'president',
    order: 1,
    term: '2026–27',
    isPlaceholder: true,
  },
  {
    id: 'vice-president',
    name: TBD,
    role: 'Vice President',
    roleCategory: 'vice-president',
    order: 2,
    term: '2026–27',
    isPlaceholder: true,
  },
  {
    id: 'secretary',
    name: TBD,
    role: 'Secretary',
    roleCategory: 'secretary',
    order: 3,
    term: '2026–27',
    isPlaceholder: true,
  },
  {
    id: 'treasurer',
    name: TBD,
    role: 'Treasurer',
    roleCategory: 'treasurer',
    order: 4,
    term: '2026–27',
    isPlaceholder: true,
  },
  {
    id: 'lead-smartphone',
    name: TBD,
    role: 'Project Lead — Modular Smartphone',
    roleCategory: 'project-lead',
    project: 'Modular Smartphone',
    order: 5,
    isPlaceholder: true,
  },
  {
    id: 'lead-smart-reading',
    name: TBD,
    role: 'Project Lead — Smart Reading',
    roleCategory: 'project-lead',
    project: 'Smart Reading',
    order: 6,
    isPlaceholder: true,
  },
  {
    id: 'lead-venture-studies',
    name: TBD,
    role: 'Project Lead — Venture Studies',
    roleCategory: 'project-lead',
    project: 'Venture Studies',
    order: 7,
    isPlaceholder: true,
  },
];

/** Grouping used by the /team page bands. */
export const executiveRoles: readonly RoleCategory[] = [
  'president',
  'vice-president',
  'secretary',
  'treasurer',
];
