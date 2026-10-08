/**
 * Club facts for the chrome (footer + JoinChapter), read from lib/data so there is one source.
 * lib/data/siteConfig.ts (place, every public link) and lib/data/involvement.ts (sponsor / faculty paths).
 */
import { involvementCategories } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';

export const CLUB = {
  when: 'Thursdays, 6:00 PM',
  where: siteConfig.contact.location,
  /** Main club server. */
  discord: siteConfig.social.discord,
  /** lib/data/homeLanding.ts:169 */
  noExperience: 'No project experience required.',
} as const;

/** Public links. The URLs are written once, in siteConfig.social. */
export const LINKS = {
  github: siteConfig.social.github,
  linkedin: siteConfig.social.linkedin,
  instagram: siteConfig.social.instagram,
  brainDiscord: siteConfig.social.brainDiscord,
} as const;

/** Per-team meeting facts for <JoinChapter when / where / bring>. SIDEKICK and SHADES subteams set their own times. */
export const MEETINGS = {
  subteam: { when: 'Subteam meetings depend on the team.', where: null, bring: 'Join the Discord to connect with the leads.' },
  brain: { when: 'Fridays, 12:00 – 1:00 PM', where: null, bring: CLUB.noExperience },
} as const;

export interface BackerPath {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

/** "Back a build": the sponsor / recruiter / faculty paths that already exist in production (/contact?type=…). */
export const BACKER_PATHS: readonly BackerPath[] = (
  involvementCategories.find((c) => c.id === 'companies')?.options ?? []
).map((o) => ({ id: o.id, label: o.title, href: o.link }));
