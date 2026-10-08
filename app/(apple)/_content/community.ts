/**
 * Community page copy (Apple system). Channel descriptions come from lib/data/community.ts; every URL comes
 * from _chrome/club.ts (CLUB / LINKS), never from lib/data, which still carries an older Discord invite.
 * A channel with no URL in club.ts (YouTube) is not listed. No posts, videos or events exist in the data.
 */
import { communityChannels } from '@/lib/data/community';
import { CLUB, LINKS } from '../_chrome/club';
import type { Row } from '../_site/LinkRows';

const described = (id: string): string | undefined => communityChannels.find((c) => c.id === id)?.description;

export const COMMUNITY = {
  meta: {
    title: 'Community · DIGITAL',
    description: 'Where DIGITAL works between build nights: the Discord servers, LinkedIn and the SIDEKICK repository.',
  },
  hero: {
    title: 'Where the build happens.',
    lead: 'Discord carries the work between build nights.',
  },
  channels: {
    title: 'Channels',
    rows: [
      { label: 'Discord', meta: described('discord'), href: CLUB.discord },
      { label: 'BRAIN Discord', meta: 'The BRAIN team’s server.', href: LINKS.brainDiscord },
      { label: 'LinkedIn', meta: described('linkedin'), href: LINKS.linkedin },
      { label: 'Instagram', meta: '@digital.cpp', href: LINKS.instagram },
      { label: 'GitHub', meta: 'The SIDEKICK repository.', href: LINKS.github },
    ] as readonly Row[],
  },
} as const;
