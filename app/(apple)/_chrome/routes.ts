// Site page map. The Apple world is the live site: home is `/`, each build is `/projects/<id>/`.
// `World` stays in the signature so existing callers compile; the Signal world is archived and has no routes.
export type World = 'signal' | 'apple';
export type PageId = 'home' | 'sidekick' | 'shades' | 'brain';

export const PAGES: ReadonlyArray<{ readonly id: PageId; readonly label: string; readonly channel?: string }> = [
  { id: 'home', label: 'DIGITAL' },
  { id: 'sidekick', label: 'SIDEKICK', channel: 'CH1' },
  { id: 'shades', label: 'SHADES', channel: 'CH2' },
  { id: 'brain', label: 'BRAIN', channel: 'CH3' },
];

export function href(_world: World, page: PageId): string {
  return page === 'home' ? '/' : `/projects/${page}/`;
}

/** Footer rows two and three: the site pages and the legal pages. Labels are the pages' own titles. */
export const SITE_PAGES: ReadonlyArray<{ readonly label: string; readonly href: string }> = [
  { label: 'About', href: '/about/' },
  { label: 'Team', href: '/team/' },
  { label: 'Community', href: '/community/' },
  { label: 'Get involved', href: '/get-involved/' },
  { label: 'Contact', href: '/contact/' },
];

export const LEGAL_PAGES: ReadonlyArray<{ readonly label: string; readonly href: string }> = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cookies', href: '/cookies/' },
];
