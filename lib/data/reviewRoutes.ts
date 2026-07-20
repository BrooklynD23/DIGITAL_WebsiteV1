/**
 * Stakeholder review hub — route metadata for /review.
 * Internal only; not linked from public nav or sitemap.
 */

export type ReviewRouteStatus = 'production' | 'candidate' | 'placeholder' | 'legacy';

export interface ReviewRouteOption {
  readonly label: string;
  readonly href: string;
  readonly description: string;
  readonly status: ReviewRouteStatus;
}

export interface ReviewDecisionGroup {
  readonly id: string;
  readonly title: string;
  readonly question: string;
  readonly mergeNote?: string;
  readonly options: readonly ReviewRouteOption[];
}

export interface ReviewProductionRoute {
  readonly label: string;
  readonly href: string;
}

export const reviewDecisionGroups: readonly ReviewDecisionGroup[] = [
  {
    id: 'smart-reading',
    title: 'Smart Reading',
    question: 'Smart Reading route is settled — confirm or retire the legacy URL.',
    options: [
      {
        label: 'Production experience',
        href: '/projects/smart-reading',
        description: 'Immersive R3F scroll experience for the smart-glasses project.',
        status: 'production',
      },
      {
        label: 'Legacy redirect stub',
        href: '/experiments/glasses',
        description: 'Client redirect to /projects/smart-reading — safe to remove after sign-off.',
        status: 'legacy',
      },
    ],
  },
];

export const reviewProductionRoutes: readonly ReviewProductionRoute[] = [
  { label: 'Homepage', href: '/' },
  { label: 'Modular Smartphone', href: '/projects/modular-smartphone' },
  { label: 'Pillars', href: '/pillars' },
  { label: 'Projects index', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

export const reviewHubNote =
  'Internal review only — not linked from public navigation or sitemap. Immersive routes hide the global navbar; use this page to hop between variants.';
