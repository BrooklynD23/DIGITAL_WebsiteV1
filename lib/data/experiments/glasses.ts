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
}

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
    lede: 'Smart Reading is a heads-up display that shows one word at a time, right where you are looking. Your eyes stay still. The words come to you. Built with dyslexic readers in mind.',
    footnote: 'Scroll to see what the wearer sees.',
  },
  reveal: {
    headline: 'One word at a time.',
    sub: 'No darting back and forth. No losing your line. Steady, even reading.',
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
      'The words arrive one at a time, right where you look. A page no longer asks your eyes to hunt across the line, to jump ahead and snap back, to find their place again and again. Here the line holds still and the reading comes to you, at the pace you choose, steady and clear. What once took effort to gather now simply appears, word after word, until the meaning is yours.',
  },
  info: [
    {
      id: 'info-why',
      title: 'It is the eyes, not the mind.',
      body:
        'You understand the words. The hard part is the work your eyes do to reach them: jumping ahead, snapping back, finding the line again. Smart Reading takes that work away.',
      specs: [
        { k: 'AUDIENCE', v: '~5–20% of people' },
        { k: 'LOAD', v: 'Saccades & fixations' },
      ],
    },
    {
      id: 'info-approach',
      title: 'The text moves, you hold still.',
      body:
        'RSVP, rapid serial visual presentation, shows one word at a time at a single fixed point. You set the speed. Studies show that steady pacing lifts both reading speed and comprehension.',
      specs: [
        { k: 'METHOD', v: 'RSVP' },
        { k: 'PACE', v: 'You set the WPM' },
        { k: 'RENDER', v: 'Real-time FPGA' },
      ],
    },
    {
      id: 'info-platform',
      title: 'Open hardware, made to open up.',
      body:
        'An FPGA renders the stream in real time. The firmware is open and the design is documented in modular parts, so each cohort can build on the last.',
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
        'We need engineering, optics, firmware, design, and research. Smart Reading is a student project at Cal Poly Pomona, mentored by Dr. Mohamed El Hadedy. No experience required.',
      specs: [
        { k: 'WHERE', v: 'Cal Poly Pomona' },
        { k: 'MENTOR', v: 'Dr. El Hadedy' },
        { k: 'COST', v: 'Free to join' },
      ],
    },
  ],
};
