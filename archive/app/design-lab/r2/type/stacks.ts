/**
 * R2 type trial: complete display / text / mono stacks taken from published SaaS/FAANG design
 * systems, each rendered in both worlds at the Apple-measured scale (apple-playbook.md §2).
 * Tracking values are per stack and per size, tuned from the renders (not copied from SF Pro).
 */

export interface Face {
  readonly name: string;
  readonly css: string;
  readonly weight: number;
  /** font-stretch for the role, when the face has a wdth axis */
  readonly stretch?: string;
}

export interface Tracking {
  readonly hero: string;
  readonly h2: string;
  readonly sub: string;
  readonly lead: string;
  readonly body: string;
}

export interface Stack {
  readonly id: string;
  readonly system: string;
  readonly display: Face;
  readonly text: Face;
  readonly mono: Face;
  readonly licence: string;
  readonly track: Tracking;
  /** extra tracking applied on the dark world (light-on-dark compensation) */
  readonly darkTextTrack: string;
}

const fallback = 'ui-sans-serif, system-ui, sans-serif';
const monoFallback = 'ui-monospace, SFMono-Regular, Menlo, monospace';

export const STACKS: readonly Stack[] = [
  {
    id: 'github',
    system: 'GitHub (Primer brand)',
    display: { name: 'Hubot Sans 700 wdth 108', css: `var(--t-hubot), ${fallback}`, weight: 700, stretch: '108%' },
    text: { name: 'Mona Sans', css: `var(--t-mona), ${fallback}`, weight: 400 },
    mono: { name: 'Monaspace Krypton', css: `var(--t-krypton), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 ×3 (github/hubot-sans, github/mona-sans, githubnext/monaspace)',
    track: { hero: '-0.02em', h2: '-0.015em', sub: '-0.005em', lead: '0em', body: '0em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'vercel',
    system: 'Vercel (Geist)',
    display: { name: 'Geist 600', css: `var(--t-geist), ${fallback}`, weight: 600 },
    text: { name: 'Geist', css: `var(--t-geist), ${fallback}`, weight: 400 },
    mono: { name: 'Geist Mono', css: `var(--t-geist-mono), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (vercel/geist-font)',
    track: { hero: '-0.035em', h2: '-0.03em', sub: '-0.015em', lead: '-0.004em', body: '0em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'google',
    system: 'Google (Material 3 Expressive)',
    display: { name: 'Google Sans Flex 600 (opsz auto)', css: `var(--t-gsflex), ${fallback}`, weight: 600 },
    text: { name: 'Google Sans Flex 400', css: `var(--t-gsflex), ${fallback}`, weight: 400 },
    mono: { name: 'Google Sans Code', css: `var(--t-gscode), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (google/fonts ofl/googlesansflex, googlefonts/googlesans-code)',
    track: { hero: '-0.01em', h2: '-0.008em', sub: '0em', lead: '0em', body: '0em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'inter',
    system: 'Linear · Shopify Polaris · Atlassian (Inter-derived)',
    display: { name: 'Inter Display 600 (opsz 32)', css: `var(--t-inter), ${fallback}`, weight: 600 },
    text: { name: 'Inter (opsz 14–20)', css: `var(--t-inter), ${fallback}`, weight: 400 },
    mono: { name: 'JetBrains Mono', css: `var(--t-jetbrains), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (rsms/inter, JetBrains/JetBrainsMono)',
    track: { hero: '-0.025em', h2: '-0.022em', sub: '-0.014em', lead: '-0.01em', body: '-0.006em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'material',
    system: 'Google (Material 3, Roboto Flex)',
    display: { name: 'Roboto Flex 600 (opsz auto)', css: `var(--t-roboto-flex), ${fallback}`, weight: 600 },
    text: { name: 'Roboto Flex 400', css: `var(--t-roboto-flex), ${fallback}`, weight: 400 },
    mono: { name: 'Roboto Mono', css: `var(--t-roboto-mono), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (googlefonts/roboto-flex; google/fonts ofl/robotomono)',
    track: { hero: '-0.02em', h2: '-0.015em', sub: '-0.005em', lead: '0em', body: '0em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'redhat',
    system: 'Red Hat (brand standards)',
    display: { name: 'Red Hat Display 600', css: `var(--t-rh-display), ${fallback}`, weight: 600 },
    text: { name: 'Red Hat Text', css: `var(--t-rh-text), ${fallback}`, weight: 400 },
    mono: { name: 'Red Hat Mono', css: `var(--t-rh-mono), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (RedHatOfficial/RedHatFont)',
    track: { hero: '-0.02em', h2: '-0.015em', sub: '-0.005em', lead: '0em', body: '0em' },
    darkTextTrack: '0.006em',
  },
  {
    id: 'mozilla',
    system: 'Mozilla (2025 brand) + Geist Mono',
    display: { name: 'Mozilla Headline 600', css: `var(--t-moz-head), ${fallback}`, weight: 600 },
    text: { name: 'Mozilla Text', css: `var(--t-moz-text), ${fallback}`, weight: 400 },
    mono: { name: 'Geist Mono (Mozilla ships no mono)', css: `var(--t-geist-mono), ${monoFallback}`, weight: 500 },
    licence: 'OFL 1.1 (google/fonts ofl/mozillaheadline, ofl/mozillatext; vercel/geist-font)',
    track: { hero: '-0.015em', h2: '-0.01em', sub: '0em', lead: '0em', body: '0em' },
    darkTextTrack: '0.006em',
  },
];

/** Real DIGITAL copy, held to the Apple-measured budgets (headline ≤8 words, lead ≤25 words). */
export const COPY = {
  thesis: 'Make something worth putting your name on.',
  headline: 'One owner for every board.',
  lead: 'Every build splits into subsystems. Each subsystem has one owner, one review path, one test gate and one repair plan before release.',
  names: ['SIDEKICK', 'SHADES', 'BRAIN'] as const,
  caption: 'Build night is every Thursday at 6:00 PM in Building 17, Room 1635. Bring a laptop and pick a part.',
  stat: { value: '3', unit: 'boards', caption: 'Power carrier 49×41 mm, sensor daughter board, fingerprint board 22.8×26.1 mm.' },
  readouts: [
    'CH1 SIDEKICK · 3 BOARDS · KiCad 9 [confirm]',
    'CH2 SHADES · RSVP · FPGA [confirm]',
    'CH3 BRAIN · AGENTIC · CONCEPT',
  ],
  footnote: '[confirm] Knowledgebase facts are pending club verification.',
} as const;

export const READING = {
  word: 'putting',
  /** optimal recognition point index into `word` (RSVP fixation letter) */
  orp: 2,
  paragraph:
    'RSVP stands for rapid serial visual presentation. SHADES shows one word at a time at a fixed point, so your eyes stay still while the text moves. The engineering track builds the timing on an FPGA [confirm].',
  confusables: 'b d p q · I l 1 | · O 0 o · rn m · a e o c · 6 9 8 B',
} as const;

export interface ReadingFace {
  readonly id: string;
  readonly name: string;
  readonly css: string;
  readonly licence: string;
}

export const READING_FACES: readonly ReadingFace[] = [
  { id: 'atkinson', name: 'Atkinson Hyperlegible Next', css: `var(--t-atkinson), ${fallback}`, licence: 'OFL 1.1 (Braille Institute; googlefonts/atkinson-hyperlegible-next)' },
  { id: 'lexend', name: 'Lexend', css: `var(--t-lexend), ${fallback}`, licence: 'OFL 1.1 (googlefonts/lexend)' },
  { id: 'mona', name: 'Mona Sans (control: world text face)', css: `var(--t-mona), ${fallback}`, licence: 'OFL 1.1 (github/mona-sans)' },
];
