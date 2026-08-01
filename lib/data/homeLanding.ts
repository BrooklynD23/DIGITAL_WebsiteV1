/**
 * Copy + config for the homepage landing (/).
 * Sourced from DIGITAL Landing v2 design export.
 */

export interface HomeGap {
  readonly glyph: string;
  readonly title: string;
  readonly body: string;
}

export interface HomeWay {
  readonly glyph: string;
  readonly title: string;
  readonly body: string;
}

export interface HomeCase {
  readonly glyph: string;
  readonly imageLabel: string;
  readonly kicker: string;
  readonly title: string;
  readonly line: string;
  readonly stat1: string;
  readonly stat1label: string;
  readonly stat2: string;
  readonly stat2label: string;
  readonly stat3: string;
  readonly stat3label: string;
  readonly learn1: string;
  readonly learn2: string;
  readonly href: string;
}

export const homeLandingCopy = {
  loader: {
    title: 'DIGITAL',
    subtitle: 'Cal Poly Pomona',
    status: 'INITIALIZING SYSTEMS',
  },
  nav: {
    thesis: 'Thesis',
    pathways: 'Pathways',
    results: 'Results',
    cta: 'Talk to us',
  },
  hero: {
    lines: ['Coursework teaches systems.', 'DIGITAL puts them in your hands.', 'Students become builders.'],
    subline:
      'Student-led teams build real engineering systems at Cal Poly Pomona',
    cta: 'Get involved',
    imageSrc: '/assets/landing/Landing-Page-Hero.png',
    imageAlt:
      'Engineering workspace with technical drawings, schematics, and drafting tools',
  },
  thesis: {
    eyebrow: 'Our Founding Philosophy',
    heading: 'Bridging industry gaps with accessible projects',
    gaps: [
      {
        glyph: '⌗',
        title: 'Theory Gap',
        body: 'Opportunity to apply practical experience outside of theoretical lectures.',
      },
      {
        glyph: '⊞',
        title: 'Access Gap',
        body: 'Take on cross-disciplinary engineering problems usually reserved for industry.',
      },
      {
        glyph: '⇄',
        title: 'Ownership Gap',
        body: 'Own a subsystem from scope through build review, then defend every decision.',
      },
    ] satisfies readonly HomeGap[],
  },
  pathways: {
    eyebrow: 'How we work',
    heading:
      'Choose one of two ways to build a real system with DIGITAL.',
    ways: [
      {
        glyph: '⌗',
        title: 'Core Teams',
        body: 'Own a Smartphone Project subsystem and build each week alongside experienced leads.',
      },
      {
        glyph: '◨',
        title: 'Contributors',
        body: 'Take on focused research, design, operations, or documentation work as you find your place.',
      },
    ] satisfies readonly HomeWay[],
    cta: 'Get involved',
  },
  results: {
    eyebrow: 'Build record',
    heading: 'The build teaches what lectures cannot',
    cases: [
      {
        glyph: '⌗',
        imageLabel: 'PROJECT PHOTO — PROTOTYPE BENCH SHOT',
        kicker: 'Systems Engineering',
        title: 'The Smartphone Project',
        line: 'Build a modular smartphone around repair, upgrades, and real subsystem interfaces.',
        stat1: '7',
        stat1label: 'Subsystems',
        stat2: '40+',
        stat2label: 'Members',
        stat3: '3',
        stat3label: 'Semesters',
        learn1: 'Set interfaces across hardware and software teams',
        learn2: 'Make repairability an architecture decision',
        href: '/projects/modular-smartphone',
      },
      {
        glyph: '◎',
        imageLabel: 'PROJECT PHOTO — WEARABLE PROTOTYPE',
        kicker: 'Wearable Systems',
        title: 'Smart Accessibility Glasses',
        line: 'Build heads-up reading glasses that move the text, not the reader\'s eyes.',
        stat1: 'RSVP',
        stat1label: 'Method',
        stat2: 'FPGA',
        stat2label: 'Compute',
        stat3: '8 mo',
        stat3label: 'Build cycle',
        learn1: 'Design the display pipeline from FPGA compute to wearable optics',
        learn2: 'Translate a reader\'s perceptual needs into hardware timing specifications',
        href: '/projects/smart-reading',
      },
      {
        glyph: '◨',
        imageLabel: 'PROJECT PHOTO — TEAM WORKING SESSION',
        kicker: 'Technical Entrepreneurship',
        title: 'Venture Studies',
        line: 'Turn engineering scope into budgets, sponsor briefs, and pitches.',
        stat1: '5',
        stat1label: 'Case studies',
        stat2: '12',
        stat2label: 'Sponsor briefs',
        stat3: '2',
        stat3label: 'Pitch cycles',
        learn1: 'Map technical scope to budget and sponsorship',
        learn2: 'Explain system trade-offs beyond engineering teams',
        href: '/get-involved',
      },
    ] satisfies readonly HomeCase[],
  },
  join: {
    heading: 'Close the gap. Build with us.',
    body: 'Bring engineering, computer science, design, or business. No project experience required.',
    primaryCta: 'Get involved',
    secondaryCta: 'Contact DIGITAL',
  },
  footer: {
    taglines: [
      'Project-Based Engineering Organization',
      'Interdisciplinary Systems Design',
      'Technical Entrepreneurship',
      'Student-Led Innovation',
    ],
  },
  links: {
    join: '/get-involved',
    contact: '/contact',
    smartphoneProject: '/projects/modular-smartphone',
    smartReading: '/projects/smart-reading',
  },
  motion: {
    loaderMs: 1900,
  },
} as const;
