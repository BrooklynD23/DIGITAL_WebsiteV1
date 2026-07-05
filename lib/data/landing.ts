/**
 * Copy + config for the Modules landing (/landing-preview).
 * Per CLAUDE.md all copy lives here. Wording gets a brand-voice pass in Task 8.
 */

export interface MissionBeat {
  readonly id: string;
  readonly label: string;   // "WE EXPLORE"
  readonly line: string;    // supporting sentence
}

export interface LandingPortal {
  readonly id: 'phone' | 'glasses';
  readonly eyebrow: string;
  readonly title: string;
  readonly caption: string;
  readonly href: string;
}

export const LANDING_PALETTE = {
  studio: '#d6d4d3', studioMid: '#a8a5a3', chamber: '#16161a',
  ink: '#16161a', accent: '#d8412f',
} as const;

export const LANDING_CONTENT = {
  meta: { title: 'DIGITAL — Built from Modules', description: 'A student platform for building real technology at Cal Poly Pomona.' },
  logoSrc: '/assets/landing/DIGITAL_LOGO-removebg-preview.png',
  wordmark: 'DIGITAL',
  eyebrow: 'DIGITAL @ Cal Poly Pomona',
  tagline: 'A student platform for building real technology.',
  skipLabel: 'Skip intro',
  mission: [
    { id: 'explore', label: 'WE EXPLORE', line: 'Real systems, real trade-offs, real constraints — hands-on from day one.' },
    { id: 'design', label: 'WE DESIGN', line: 'Hardware, software, mechanical, business — every discipline has a seat.' },
    { id: 'build', label: 'WE BUILD', line: 'Projects that rival commercial products, built by student teams.' },
    { id: 'communicate', label: 'WE COMMUNICATE', line: 'Ideas scoped, funded, and translated into value for people and industry.' },
  ] as readonly MissionBeat[],
  chamber: {
    eyebrow: 'What we are building',
    portals: [
      { id: 'phone', eyebrow: '01 · Flagship', title: 'The Modular Smartphone', caption: 'A repairable, upgradeable phone — take it apart layer by layer.', href: '/projects/modular-smartphone' },
      { id: 'glasses', eyebrow: '02 · Wearable', title: 'Smart Reading', caption: 'Heads-up glasses that bring the words to your eyes.', href: '/experiments/glasses' },
    ] as readonly LandingPortal[],
  },
  club: {
    joinHeading: 'Ready to build?',
    joinBody: 'Engineering, CS, design, business — no experience required.',
    joinCta: { label: 'Get involved', href: '/get-involved' },
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
  },
} as const;
