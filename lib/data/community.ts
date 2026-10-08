/**
 * Community channels and media shelves for /community.
 *
 * Every list may legally be empty — the page must render complete with
 * nothing configured. Placeholder media entries carry `isPlaceholder` and
 * render the explicit "nothing here yet" treatment; we never fabricate
 * posts, videos, or stats.
 */

import { siteConfig } from './siteConfig';

export interface CommunityChannel {
  readonly id: 'discord' | 'linkedin' | 'youtube';
  readonly name: string;
  readonly description: string;
  /** Invite/join URL; empty string = unconfigured, module renders the empty state. */
  readonly url: string;
  /** What joining gets you — short beats, not marketing lines. */
  readonly expectations?: readonly string[];
}

export const communityChannels: readonly CommunityChannel[] = [
  {
    id: 'discord',
    name: 'Discord',
    description: 'The day-to-day bench: subsystem standups, part drops, meeting reminders.',
    url: siteConfig.social.discord,
    expectations: [
      'Weekly meeting notes in #announcements',
      'One channel per subsystem — questions land where the owners are',
      'Show your work: photos from the bench beat status reports',
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Build milestones and sponsor-facing updates.',
    url: siteConfig.social.linkedin,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Build reviews, talks, and teardown walk-throughs.',
    url: '',
  },
];

