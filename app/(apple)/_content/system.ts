/** Copy for the system screens: 404, route error, global error, redirect stubs, and the shared legal chrome. */
export const SYSTEM = {
  home: { label: 'Go to the home page', href: '/' },
  retry: 'Try again',
  notFound: {
    title: 'Page not found.',
    body: 'This address does not match a page on this site. Go to the home page, or open one of the three builds.',
    buildsLabel: 'The three builds',
  },
  error: {
    title: 'This page did not load.',
    body: 'Something failed while loading this page. Try again, or go to the home page.',
  },
  moved: { title: 'This page moved', lead: 'You are being taken to' },
  legal: { updated: 'Last updated:', toc: 'On this page' },
} as const;
