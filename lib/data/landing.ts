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
  meta: { title: 'DIGITAL — Built from Modules', description: 'A student engineering club at Cal Poly Pomona building real hardware and software, one module at a time.' },
  logoSrc: '/assets/landing/DIGITAL_LOGO-removebg-preview.png',
  wordmark: 'DIGITAL',
  eyebrow: 'DIGITAL @ Cal Poly Pomona',
  tagline: 'Students building real technology, one module at a time.',
  skipLabel: 'Skip intro',
  mission: [
    { id: 'explore', label: 'WE EXPLORE', line: 'Real constraints, real trade-offs — we test the theory against how things actually work.' },
    { id: 'design', label: 'WE DESIGN', line: 'Hardware, software, mechanical, business — every discipline has a seat.' },
    { id: 'build', label: 'WE BUILD', line: 'Every project is an education — you build the whole system, not just your slice of it.' },
    { id: 'communicate', label: 'WE COMMUNICATE', line: 'We scope the work, raise the funding, and pitch it like a business.' },
  ] as readonly MissionBeat[],
  chamber: {
    eyebrow: "What we're building",
    portals: [
      { id: 'phone', eyebrow: '01 · Flagship', title: 'The Modular Smartphone', caption: 'A phone you can repair, upgrade, and take apart layer by layer.', href: '/projects/modular-smartphone' },
      { id: 'glasses', eyebrow: '02 · Wearable', title: 'Smart Reading', caption: 'Text projected into your line of sight — read without looking down.', href: '/projects/smart-reading' },
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
