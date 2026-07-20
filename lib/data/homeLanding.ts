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
    lines: ['We turn engineering ', 'students into builders ', 'of real systems'],
    subline:
      'A student-led, project-based engineering organization at Cal Poly Pomona',
    cta: 'Get involved',
    visualLabel: '[ HERO VISUAL — DROP ABSTRACT BUILD IMAGERY HERE ]',
  },
  thesis: {
    eyebrow: 'Our thesis',
    heading: 'Engineering education is narrower than it needs to be',
    gaps: [
      {
        glyph: '⌗',
        title: 'Theory Gap',
        body: 'Coursework describes systems students never get to touch. We know what it takes to move from lecture notes to a working prototype, because our members do it every semester — with real parts, real budgets, and real deadlines.',
      },
      {
        glyph: '⊞',
        title: 'Access Gap',
        body: 'The most instructive engineering problems rarely reach undergraduates. Complex, cross-disciplinary builds are usually reserved for industry. Our projects put that class of problem directly in students’ hands.',
      },
      {
        glyph: '⇄',
        title: 'Ownership Gap',
        body: 'Students are often given tasks, not outcomes. Here, members own subsystems end to end — scoping, building, communicating, and defending their decisions — which is how contributors become technical leads.',
      },
    ] satisfies readonly HomeGap[],
  },
  pathways: {
    eyebrow: 'How we work',
    heading:
      'Two ways to build with DIGITAL, both grounded in real systems, real constraints, and our flagship Smartphone Project',
    ways: [
      {
        glyph: '⌗',
        title: 'Core Teams',
        body: 'A committed engagement inside a project team. You own a subsystem of the Smartphone Project — hardware, software, mechanical, or product — working alongside experienced leads with weekly build cadence.',
      },
      {
        glyph: '◨',
        title: 'Contributors',
        body: 'A focused, flexible engagement for students still exploring. Take on scoped research, design, operations, or documentation work, and grow into a core team as your skills and interest sharpen.',
      },
    ] satisfies readonly HomeWay[],
    cta: 'Get involved',
  },
  results: {
    eyebrow: 'Build record',
    heading: 'What we learn in the build',
    cases: [
      {
        glyph: '⌗',
        imageLabel: 'PROJECT PHOTO — PROTOTYPE BENCH SHOT',
        kicker: 'Systems Engineering',
        title: 'The Smartphone Project',
        line: 'A modular, repairable, upgradeable smartphone. In active prototyping.',
        stat1: '7',
        stat1label: 'Subsystems',
        stat2: '40+',
        stat2label: 'Members',
        stat3: '3',
        stat3label: 'Semesters',
        learn1: 'Module interface standards across hardware and software teams',
        learn2: 'Repairability trade-offs in consumer device architecture',
      },
      {
        glyph: '◨',
        imageLabel: 'PROJECT PHOTO — TEAM WORKING SESSION',
        kicker: 'Technical Entrepreneurship',
        title: 'Venture Studies',
        line: 'Scoping, funding, and communicating engineering work. Ongoing.',
        stat1: '5',
        stat1label: 'Case studies',
        stat2: '12',
        stat2label: 'Sponsor briefs',
        stat3: '2',
        stat3label: 'Pitch cycles',
        learn1: 'How technical scope maps to budget and sponsorship',
        learn2: 'Communicating system trade-offs to non-engineers',
      },
    ] satisfies readonly HomeCase[],
  },
  join: {
    heading: 'Join the students building what comes next',
    body: 'Open to engineering, computer science, design, and business students. No prior project experience required.',
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
  },
  motion: {
    loaderMs: 1900,
  },
} as const;
