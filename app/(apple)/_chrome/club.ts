/**
 * Club facts for the chrome (footer + JoinChapter), read from lib/data so there is one source.
 * lib/data/siteConfig.ts (place, every public link) and lib/data/involvement.ts (sponsor / faculty paths).
 */
import { involvementCategories } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';

export const CLUB = {
  /** No club-wide meeting (Head Designer, 2026-11-12): each sub-team sets its own time. */
  when: 'Meetings are sub-team based.',
  /** Follow-up line wherever the meeting fact appears. */
  meetingMore: 'Join our Discord for more information.',
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

/** Per-team meeting facts for <JoinChapter when / where / bring>. SIDEKICK and SHADES sub-teams set their own times; BRAIN meets Fridays. */
export const MEETINGS = {
  subteam: { when: CLUB.when, where: null, bring: CLUB.meetingMore },
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

/** Strings on the blank member badge (MemberBadge). */
export const BADGE = {
  org: 'DIGITAL @ CAL POLY POMONA',
  name: 'Your name',
  /** aria-label prefix; the open roles are appended. */
  label: 'A blank member badge with an open seat. Open roles:',
  /** aria-label suffix: what a press does. */
  press: 'Press to show the next role.',
} as const;

/** "Coming soon" menu in the top bar: teams that publish on /updates/ but have no build page yet. */
export const COMING_SOON = {
  label: 'Coming soon',
  links: [
    { label: 'TWINS', note: 'Simulating a factory and supply chain end to end. First project: VESSEL.', href: '/updates/vessel-product-definition/' },
    { label: 'DIGITAL Business', note: 'Finance and operations case studies for the club.', href: '/updates/?team=DIGITAL%20Business' },
  ],
} as const;
