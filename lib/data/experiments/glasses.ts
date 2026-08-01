/**
 * Copy + structure for the experimental Smart Reading scroll hero (/experiments/glasses).
 *
 * Source of truth: docs/"The Smartglasses Project … [Master Document]".
 * The product is "Smart Reading" — FPGA-based heads-up smart glasses that help people with
 * dyslexia read using RSVP (Rapid Serial Visual Presentation): text streamed one word at a
 * time at a fixed point, so the eyes don't have to dart across the line.
 *
 * This is an isolated experiment that intentionally departs from the production
 * industrial-studio theme (DESIGN.md). Per CLAUDE.md, all copy lives here — never hard-coded
 * into components. Final wording is refined by the brand-voice-strategist agent.
 */

export interface GlassesNavItem {
  readonly label: string;
  readonly href: string;
}

export interface GlassesInfoSection {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly specs?: ReadonlyArray<{ readonly k: string; readonly v: string }>;
}

/** Wearer-POV HUD content shown when the glasses face forward. */
export interface GlassesHud {
  readonly label: string;
  readonly wpm: number;
  /** Ambient widgets (minimal glanceable readouts). */
  readonly time: string;
  readonly battery: string;
  readonly caption: string;
}

/**
 * The "putting on the glasses" POV beat: the background becomes a first-person view of a
 * text-dense scene, blurry (uncorrected) resolving to clear (corrected). The RSVP HUD streams
 * `words` one at a time. If `blurry`/`clear` image paths exist they are used; otherwise the
 * component renders a text-wall built from `paragraph`.
 */
export interface GlassesPov {
  /** Optional image paths under /public; empty string = use the text-wall fallback. */
  readonly blurry: string;
  readonly clear: string;
  /** RSVP stream — reads as one natural sentence when shown one word at a time. */
  readonly words: ReadonlyArray<string>;
  /** Dense reading copy used for the text-wall background fallback. */
  readonly paragraph: string;
}

export interface GlassesContent {
  readonly nav: ReadonlyArray<GlassesNavItem>;
  readonly cta: { readonly label: string; readonly href: string };
  readonly hero: {
    readonly eyebrow: string;
    readonly headline: string;
    readonly lede: string;
    readonly footnote: string;
  };
  /** Resolves just after the HUD beat. */
  readonly reveal: { readonly headline: string; readonly sub: string };
  readonly hud: GlassesHud;
  readonly pov: GlassesPov;
  readonly info: ReadonlyArray<GlassesInfoSection>;
  readonly next: { readonly eyebrow: string; readonly title: string; readonly href: string };
}

export const GLASSES_PALETTE = {
  paper: '#e9dfc8', paperEdge: '#d9cba6', dusk: '#6f6654',
  charcoal: '#111827', deep: '#0b0e16', accent: '#e3b341',
} as const;

export const HUD_THEME = {
  phosphor: 'rgba(127,230,163,0.95)',
  phosphorDim: 'rgba(127,230,163,0.5)',
  focus: '#ffffff',
  glass: 'rgba(6,10,8,0.55)',
  glow: '0 0 6px rgba(127,230,163,0.55), 0 0 18px rgba(127,230,163,0.22)',
  fringe: '1px 0 0 rgba(255,80,80,0.28), -1px 0 0 rgba(90,130,255,0.28)',
} as const;

export const smartReadingMetadata = {
  title: 'Smart Reading — DIGITAL @ Cal Poly Pomona',
  description:
    'FPGA-based heads-up glasses that stream text one word at a time, built with dyslexic readers in mind.',
} as const;

export const GLASSES_CONTENT: GlassesContent = {
  nav: [
    { label: 'The idea', href: '#info-approach' },
    { label: 'Platform', href: '#info-platform' },
    { label: 'Join', href: '#info-join' },
  ],
  cta: { label: 'Join the build', href: '#info-join' },
  hero: {
    eyebrow: 'DIGITAL @ CAL POLY POMONA · SMART READING',
    headline: 'Read without the chase.',
    lede: 'The words move so your eyes do not have to. Smart Reading holds each word at one fixed point and lets you choose the pace. Built with dyslexic readers in mind.',
    footnote: 'Scroll to see what the wearer sees.',
  },
  reveal: {
    headline: 'One word at a time.',
    sub: 'Keep your place. Set your pace. Let each word come to you.',
  },
  hud: {
    label: 'RSVP',
    wpm: 450,
    time: '9:41',
    battery: '86%',
    caption: 'Live · EN',
  },
  pov: {
    blurry: '/assets/experiments/glasses/BookBG_Blurry.png',
    clear: '/assets/experiments/glasses/BookBG_Clear.png',
    words: ['The', 'words', 'arrive', 'one', 'at', 'a', 'time,', 'right', 'where', 'you', 'look.'],
    paragraph:
      'The words move while your focus stays in one place. Each word arrives at the pace you choose, without asking your eyes to hunt across a line or find their place again. The stream stays steady. The meaning stays connected. Word by word, the page comes to you.',
  },
  info: [
    {
      id: 'info-why',
      title: 'Your eyes do the chasing.',
      body:
        'You understand the words. Smart Reading removes the repeated jumps across a line and holds your place for you, so your attention can stay with the meaning.',
      specs: [
        { k: 'AUDIENCE', v: '~5–20% of people' },
        { k: 'LOAD', v: 'Saccades & fixations' },
      ],
    },
    {
      id: 'info-approach',
      title: 'The text moves, you hold still.',
      body:
        'Your eyes stay still. The words move instead. You set how fast. RSVP shows one word at a time at a fixed point.',
      specs: [
        { k: 'METHOD', v: 'RSVP' },
        { k: 'PACE', v: 'You set the WPM' },
        { k: 'RENDER', v: 'Real-time FPGA' },
      ],
    },
    {
      id: 'info-platform',
      title: 'Open hardware, built to continue.',
      body:
        'An FPGA renders the stream in real time. The firmware stays open. The design stays modular, so each cohort can improve one part without starting the whole system over.',
      specs: [
        { k: 'COMPUTE', v: 'FPGA' },
        { k: 'SOURCE', v: 'Open' },
        { k: 'CYCLE', v: '8-month build' },
      ],
    },
    {
      id: 'info-join',
      title: 'Build it with us.',
      body:
        'Bring engineering, optics, firmware, design, or research. Build Smart Reading at Cal Poly Pomona with mentorship from Dr. Mohamed El Hadedy. No experience required.',
      specs: [
        { k: 'WHERE', v: 'Cal Poly Pomona' },
        { k: 'MENTOR', v: 'Dr. El Hadedy' },
        { k: 'COST', v: 'Free to join' },
      ],
    },
  ],
  next: { eyebrow: 'Next project', title: 'The Modular Smartphone', href: '/projects/modular-smartphone' },
};
