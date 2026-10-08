import { siteConfig } from './siteConfig';

/**
 * Single source for site chrome links. The landing footer
 * (HomeLanding.tsx) and the global Footer must stay consistent;
 * both consume these lists. Navbar consumes `primary`.
 */

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

/** Ribbon destinations — mirrored by the landing's own sticky nav. */
export const primaryNavLinks: readonly SiteLink[] = [
  { label: 'Projects', href: '/#builds' },
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Join', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
];

/** Full route map for footers — includes routes rebuilding toward the ribbon. */
export const footerQuickLinks: readonly SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/#builds' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Join', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
];

export const legalLinks: readonly SiteLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export const socialLinks: readonly SocialLink[] = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'Discord', href: siteConfig.social.discord },
  { label: 'GitHub', href: siteConfig.community.github },
  { label: 'Notion', href: siteConfig.community.notion },
  { label: 'Instagram', href: siteConfig.social.instagram },
];
