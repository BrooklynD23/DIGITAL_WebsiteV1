/**
 * Club facts for r2 chrome (footer + JoinChapter), read from production content so there is one source.
 * lib/data/siteConfig.ts (time, place, Discord) and lib/data/involvement.ts (sponsor / faculty paths).
 */
import { involvementCategories } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';

export const CLUB = {
  when: 'Thursdays, 6:00 PM',
  where: siteConfig.contact.location,
  discord: siteConfig.community.discord,
  /** lib/data/homeLanding.ts:169 */
  noExperience: 'No project experience required.',
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
