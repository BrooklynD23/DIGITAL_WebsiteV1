/**
 * Gallery data for /design-lab and /design-lab/components.
 * Every value is taken from design-lab/concepts/concept-<x>.md (incl. "## v2 changes") and the cross-critiques in
 * design-lab/critiques/. Order is alphabetical (A–F). There is no ranking, score or recommendation here on purpose.
 */

export type Slug = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

export interface Swatch {
  readonly hex: string;
  readonly role: string;
}

export interface Specimen {
  /** CSS font-family stacks, each starting with the face the concept uses. */
  readonly display: string;
  readonly body: string;
  readonly mono: string;
  readonly displayStyle: Readonly<Record<string, string | number>>;
  readonly upper?: boolean;
  /** The one word set in italic (A, D) or nothing. */
  readonly italicWord?: string;
  readonly bodyLine: string;
  readonly monoLine: string;
  /** Optional margin-note line in a hand face (D only). */
  readonly note?: { readonly text: string; readonly font: string };
  readonly bg: string;
  readonly fg: string;
  readonly muted: string;
  readonly faces: string;
  readonly loading: string;
}

export interface Tradeoff {
  readonly text: string;
  readonly source: string;
}

export interface Concept {
  readonly slug: Slug;
  readonly letter: string;
  readonly name: string;
  readonly direction: string;
  readonly thesis: string;
  readonly specimen: Specimen;
  readonly palette: readonly Swatch[];
  readonly interactions: readonly string[];
  readonly distinctive: string;
  readonly strengths: readonly Tradeoff[];
  readonly costs: readonly Tradeoff[];
  readonly doc: string;
  readonly stripHeight: number;
}

const THESIS_LINE = 'Make something worth putting your name on.';
export const SPECIMEN_LINE = THESIS_LINE;

export const CONCEPTS: readonly Concept[] = [
  {
    slug: 'a',
    letter: 'A',
    name: 'The Signed Edition',
    direction: 'Editorial / Studio',
    thesis:
      'DIGITAL publishes its work as a printed edition, and every story in it ends on a signature line that is still blank.',
    specimen: {
      display: '"Zodiak", Georgia, serif',
      body: '"Switzer", system-ui, sans-serif',
      mono: 'var(--g-jetbrains), ui-monospace, monospace',
      displayStyle: { fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.98 },
      italicWord: 'name',
      bodyLine:
        'Engineering, computer science, design and business students build real hardware here, one owned part at a time.',
      monoLine: '01 —— The work · DG-001 · Active',
      bg: '#f1eee7',
      fg: '#15130f',
      muted: '#5f594f',
      faces: 'Zodiak 400 (display) · Switzer (body) · JetBrains Mono (metadata)',
      loading: 'Zodiak + Switzer: Fontshare CDN link, one per family. JetBrains Mono: next/font.',
    },
    palette: [
      { hex: '#f1eee7', role: 'Paper (page)' },
      { hex: '#15130f', role: 'Ink (text, CTA fill, night spread)' },
      { hex: '#5f594f', role: 'Muted (captions)' },
      { hex: '#e6e0d4', role: 'Plate (elevated surface)' },
      { hex: '#d8412f', role: 'Red: signature rules, markers, focus' },
      { hex: '#b3311f', role: 'Red ink: small red text, CTA hover fill' },
      { hex: '#f2c6b9', role: 'Highlight tint (selection, pressed)' },
    ],
    interactions: [
      'The thesis reveals line by line, then the red signature rule under "name" draws once.',
      'A proof band (proofreader’s mark) wipes under the key noun of each of the 4 ownership rules.',
      'Fig. 2: hovering a numbered key row tints its layer in the exploded subsystem drawing.',
      'Working RSVP plate for DG-002: Read it / Pause, pace 200 · 300 · 450 wpm.',
    ],
    distinctive:
      'The homepage is an edition: cover, contents, features with bylines, a masthead staff box and a colophon that closes on “The next edition prints when these lines fill.”',
    strengths: [
      {
        text: 'Ships easily: server components, a CSS-keyframe reveal that is safe without JS, 3 small client islands, no WebGL.',
        source: 'critiques/a-by-f.md F3',
      },
      {
        text: 'The phone cover is a poster (one word per line, “name” largest); the thesis is legible in about 0.5 s.',
        source: 'concept-a.md v2 #1',
      },
    ],
    costs: [
      {
        text: 'Zodiak and Switzer are Fontshare faces that cannot be self-hosted. Production needs a DESIGN.md §8 exception or an OFL swap, and no fallback has been rendered yet.',
        source: 'critiques/a-by-f.md F1 · concept-a.md v2 deferred',
      },
      {
        text: 'Long page (9,552 px at 1440) with no sticky nav; a short-attention visitor may not reach Thursday.',
        source: 'concept-a.md risk 2',
      },
      {
        text: 'Paper, serif and colophon lean toward a literary journal. The engineering-lab half rests on mono labels, one drawing and a drafting grid.',
        source: 'critiques/a-by-f.md B3',
      },
      {
        text: 'Placeholder plates and [confirm] cells stay visually heavy until the club produces photography.',
        source: 'concept-a.md risk 3',
      },
    ],
    doc: 'design-lab/concepts/concept-a.md',
    stripHeight: 2122,
  },
  {
    slug: 'b',
    letter: 'B',
    name: 'Engineering / System',
    direction: 'Engineering / System (no working title in the concept doc)',
    thesis:
      'The homepage is the build’s documentation set: every drawing on it is computed from the club’s own project records.',
    specimen: {
      display: 'var(--g-plex-cond), "Arial Narrow", sans-serif',
      body: 'var(--g-plex-sans), system-ui, sans-serif',
      mono: 'var(--g-plex-mono), ui-monospace, monospace',
      displayStyle: { fontWeight: 600, letterSpacing: '0', lineHeight: 0.94 },
      upper: true,
      bodyLine:
        'Two builds are on the bench. The phone splits into seven subsystems. Each one gets one owner and one test gate before merge.',
      monoLine: 'S2 HARDWARE / PCB · OWNER UNASSIGNED · H2',
      bg: '#f2f2ee',
      fg: '#15171a',
      muted: '#50555b',
      faces: 'IBM Plex Sans Condensed 600 caps (display) · IBM Plex Sans (body) · IBM Plex Mono (data)',
      loading: 'All three: next/font (Google, OFL).',
    },
    palette: [
      { hex: '#f2f2ee', role: 'Drawing sheet (page)' },
      { hex: '#fafaf7', role: 'Surface (figures, register)' },
      { hex: '#e7e7e1', role: 'Recess (parts, hatching)' },
      { hex: '#15171a', role: 'Ink (text, linework, primary button)' },
      { hex: '#50555b', role: 'Ink 2 (labels, unknowns)' },
      { hex: '#c6c8c2', role: 'Line (hairlines, dot grid)' },
      { hex: '#d8412f', role: 'Redline marks: open handoffs, unowned blocks' },
      { hex: '#b23422', role: 'Red text and white-on-red tags' },
    ],
    interactions: [
      'Hover or focus a subsystem in Fig. 1: its wires thicken, the rest fade to 20%, its parts get a frame.',
      'Status filters on the project ledger, with live counts.',
      'Subsystem selector traces one subsystem through plan → integrate, gates G1/G2 and its real handoffs.',
      'RSVP timing plot runs one pass at the real 450 wpm slot time, then holds; “Run again”.',
    ],
    distinctive:
      'The drawings are generated from lib/data: the interface map finds the 4 shared parts (handoffs H1–H4) and reads “0 of 7 owned”, so new data means a new drawing.',
    strengths: [
      {
        text: 'No animation library, no WebGL, no external fonts; the page is complete without JS.',
        source: 'critiques/b-by-a.md F1',
      },
      {
        text: 'Red has one meaning: a redline where the build needs a person (open handoffs, unowned blocks, open seats).',
        source: 'critiques/b-by-a.md B2',
      },
    ],
    costs: [
      {
        text: 'Speaks mostly to engineers (subsystem, handoff, G1, H1–H4). v2 added a build × discipline matrix, but its S1–S7 and Venture Studies cells are inferred [confirm].',
        source: 'critiques/b-by-a.md B1 · concept-b.md v2 deferred 5',
      },
      {
        text: 'Dense: can read as a docs portal; the mobile page is still about 11,700 px.',
        source: 'concept-b.md risk 2 · v2 deferred 2',
      },
      {
        text: 'Fig. 1 part names come from the build page’s illustration model, not a confirmed BOM. The phone leads must sign off.',
        source: 'concept-b.md risk 1',
      },
      {
        text: 'Without the figures, the chrome (mono caps, hairlines, dot grid) is the shared technical-minimal genre.',
        source: 'critiques/b-by-a.md D1',
      },
    ],
    doc: 'design-lab/concepts/concept-b.md',
    stripHeight: 1446,
  },
  {
    slug: 'c',
    letter: 'C',
    name: 'Formation',
    direction: 'Creative Technology',
    thesis:
      'The page draws itself from the work: every moving point is computed from a real build, so the brand can only get as big as what members actually make.',
    specimen: {
      display: '"Clash Display", system-ui, sans-serif',
      body: '"General Sans", system-ui, sans-serif',
      mono: 'var(--g-martian), ui-monospace, monospace',
      displayStyle: { fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 0.98 },
      bodyLine: 'Two builds are on the bench. One slot is open. Pick one and watch it form.',
      monoLine: 'DG-001 · STATUS ACTIVE · 7 LAYERS',
      bg: '#0c0c0b',
      fg: '#ece8de',
      muted: '#a39e92',
      faces: 'Clash Display 600 (display) · General Sans (body) · Martian Mono (metadata; the page also narrows it to 87.5% width)',
      loading: 'Clash + General Sans: Fontshare CDN link, one per family. Martian Mono: next/font.',
    },
    palette: [
      { hex: '#0c0c0b', role: 'Warm graphite (page)' },
      { hex: '#141412', role: 'Elevated surface 1' },
      { hex: '#1c1b18', role: 'Elevated surface 2' },
      { hex: '#ece8de', role: 'Bone (text, particles)' },
      { hex: '#a39e92', role: 'Secondary text' },
      { hex: '#3e3c36', role: 'Emphasis rule' },
      { hex: '#f0573a', role: '“Solder” accent: status, selection, CTA, focus (v2)' },
    ],
    interactions: [
      '“Pick a build” radio group re-forms 4,900 particles: phone layers, glasses, or a blank signature line.',
      'Pointer (mouse/pen only) probes the field; particles part around it.',
      'Sign the line: your typed name forms in particles; the footer remembers it in the same dots.',
      'Live / Still toggle; Still mode draws the same forms as static dot posters.',
    ],
    distinctive:
      'One focal instrument: a single particle buffer takes the form of each real build, computed from lib/data. The rest of the page is quiet records where unknowns say “No signal”.',
    strengths: [
      {
        text: 'The hero is computed from project data in three forms, and signing the line happens in the hero itself.',
        source: 'critiques/c-by-b.md D1',
      },
      {
        text: 'WebGL is lazy and capability-gated; a settled field costs 0 frames/s; the picker works without JS via :has().',
        source: 'concept-c.md §10–11',
      },
    ],
    costs: [
      {
        text: 'A particle field on near-black risks the “generic AI landing” read; mid-morph frames need to stay drawn, not nebula.',
        source: 'critiques/c-by-b.md D4',
      },
      {
        text: 'About 154 KB of inline SSR poster markup; production bundle size not measured yet.',
        source: 'critiques/c-by-b.md F2, F4',
      },
      {
        text: 'Clash Display is common on agency templates and loads from the Fontshare CDN.',
        source: 'concept-c.md risk 4 · c-by-b.md F3',
      },
      {
        text: 'Long on mobile (about 9,500 px at 390); the workflow appears 3 times on the page.',
        source: 'concept-c.md v2 deferred',
      },
    ],
    doc: 'design-lab/concepts/concept-c.md',
    stripHeight: 1404,
  },
  {
    slug: 'd',
    letter: 'D',
    name: 'Pull up a chair',
    direction: 'Human / Community',
    thesis:
      'DIGITAL is the room where you stop being “a CS major” and become “the person who owns the boot path”, and this page shows that change happening to you.',
    specimen: {
      display: 'var(--g-fraunces), Georgia, serif',
      body: 'var(--g-figtree), system-ui, sans-serif',
      mono: 'var(--g-plex-mono), ui-monospace, monospace',
      displayStyle: {
        fontWeight: 480,
        letterSpacing: '-0.02em',
        lineHeight: 0.98,
        fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144",
      },
      italicWord: 'your name',
      bodyLine:
        'Different majors, one product. You take one part of a real build, carry it through review and testing, and sign it.',
      monoLine: 'THU 6:00 PM · BLDG 17 RM 1635 · NO EXPERIENCE REQUIRED',
      note: { text: '← the empty chair is yours', font: 'var(--g-caveat), cursive' },
      bg: '#f4eee4',
      fg: '#1e1a15',
      muted: '#675d51',
      faces: 'Fraunces SOFT 100 / WONK 1 (display) · Figtree (body) · IBM Plex Mono (meta) · Caveat (≤6 margin notes)',
      loading: 'All four: next/font (Google, OFL).',
    },
    palette: [
      { hex: '#f4eee4', role: 'Paper (page)' },
      { hex: '#ebe2d3', role: 'Paper 2 (“How a build runs” band)' },
      { hex: '#fbf8f2', role: 'Card (prints, seat panel)' },
      { hex: '#1e1a15', role: 'Ink (text, button, night band)' },
      { hex: '#675d51', role: 'Muted (meta, captions)' },
      { hex: '#8a7f71', role: 'Pencil (sketch strokes)' },
      { hex: '#d8412f', role: 'Red: marks only (underline, chair, Signed)' },
      { hex: '#a8321f', role: 'Red ink: text, hover, focus' },
    ],
    interactions: [
      'The pencil rail draws once in sequence (line, then circles 1 → 6), ending on a red “Signed”.',
      'Pick one of 7 chairs at a sketched workbench (native radio group; works without JS).',
      'The chosen seat is carried down the page with CSS :has(): Join step, CTA link and footer read “Put your name on Hardware / PCB.”',
      'Hover: red underline wipes in, arrows nudge 3 px. Text never animates in.',
    ],
    distinctive:
      'Shows the seat instead of people: Rough.js pencil drawings of the real ownership model, rendered on the server, and a table of 7 chairs you choose from.',
    strengths: [
      {
        text: 'Rough.js runs at build time with fixed seeds: about 30 lines of client JS and no new dependencies.',
        source: 'critiques/d-by-c.md F1',
      },
      {
        text: 'Your seat choice personalises Join and the footer with zero JavaScript.',
        source: 'concept-d.md v2 #3',
      },
    ],
    costs: [
      {
        text: 'Warmth depends on real build-night photos, and the club has none. v2 removed 3 of 4 generated images; one labelled [placeholder] room print remains.',
        source: 'critiques/d-by-c.md F2 · concept-d.md v2 images',
      },
      {
        text: 'Second person throughout conflicts with BRAND.md “second person sparingly”; brand-guardian will flag it.',
        source: 'critiques/d-by-c.md B1',
      },
      {
        text: 'Tips toward a literary magazine more than an engineering lab.',
        source: 'critiques/d-by-c.md B2',
      },
      {
        text: 'Font weight: Fraunces with SOFT/WONK/opsz axes is about 121 KB before Figtree, Plex Mono and Caveat.',
        source: 'critiques/d-by-c.md F3',
      },
    ],
    doc: 'design-lab/concepts/concept-d.md',
    stripHeight: 1422,
  },
  {
    slug: 'e',
    letter: 'E',
    name: 'The Ledger',
    direction: 'Startup / Product Studio',
    thesis:
      'DIGITAL earns a startup studio’s credibility the way good product teams do: it publishes its build ledger, with honest status, real ownership and the blanks left visibly blank.',
    specimen: {
      display: '"Cabinet Grotesk", system-ui, sans-serif',
      body: '"Satoshi", system-ui, sans-serif',
      mono: 'var(--g-jetbrains), ui-monospace, monospace',
      displayStyle: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 0.96 },
      bodyLine:
        'A student-run venture studio at Cal Poly Pomona. Two builds active. None shipped yet. This page is the ledger.',
      monoLine: 'DG-001 · ACTIVE · OWNER · UNASSIGNED',
      bg: '#f6f6f2',
      fg: '#121411',
      muted: '#62655d',
      faces: 'Cabinet Grotesk 800 (display) · Satoshi (body) · JetBrains Mono (metadata)',
      loading: 'Cabinet + Satoshi: Fontshare CDN link, one per family. JetBrains Mono: next/font.',
    },
    palette: [
      { hex: '#f6f6f2', role: 'Canvas (page)' },
      { hex: '#ffffff', role: 'Surface (ledger, fact sheets, dialog)' },
      { hex: '#ecece6', role: 'Sunken (table header)' },
      { hex: '#121411', role: 'Ink (text, rules, outline buttons)' },
      { hex: '#62655d', role: 'Muted (metadata)' },
      { hex: '#dcdbd3', role: 'Hairline' },
      { hex: '#d8412f', role: 'Red: open-slot markers (marks only)' },
      { hex: '#c63a28', role: 'Red fill: primary CTA (v2)' },
      { hex: '#1d7a4a', role: 'Green: “Active” status only' },
    ],
    interactions: [
      'A ledger row morphs into its case brief (shared layout); Esc returns focus to the row.',
      'DG-001 scroll scrub (≥960 px): the 7-layer schematic opens one gap per step, so the explode is the progress bar.',
      'RSVP demo over the real Smart Reading backdrop, with pace and Step controls.',
      'Join ends on a draft ledger row (a GET form to /contact that works without JS).',
    ],
    distinctive:
      'Honest status is the brand: the build ledger is the hero, blanks are typed (Open / Pending / Unassigned), and a 7 × 4 gate board reads “0 of 28 reported”.',
    strengths: [
      {
        text: 'The ownership model is shown as structure (gate board, assignee cells, role specs), not described as a value.',
        source: 'concept-e.md v2 #8',
      },
      {
        text: 'Idle-safe after v2: 0 rAF/s at rest, with and without reduced motion.',
        source: 'concept-e.md v2 #1',
      },
    ],
    costs: [
      {
        text: 'Honesty can read as emptiness: 0 shipped, 0 partners and many Pending fields may look thin to sponsors.',
        source: 'concept-e.md risk 1',
      },
      {
        text: 'A dated ledger is only credible if kept current; it needs a required ledgerAsOf data field and an owner seat.',
        source: 'critiques/e-by-d.md F1',
      },
      {
        text: 'Three motion runtimes on one page (motion, GSAP, Lenis); Lenis was kept in v2.',
        source: 'critiques/e-by-d.md F2 · concept-e.md v2 rejected',
      },
      {
        text: 'Long page (10,498 px at 1440); Cabinet and Satoshi load from the Fontshare CDN.',
        source: 'live DOM height · concept-e.md risk 3',
      },
    ],
    doc: 'design-lab/concepts/concept-e.md',
    stripHeight: 2332,
  },
  {
    slug: 'f',
    letter: 'F',
    name: 'The Bench',
    direction: 'Radical Experiment',
    thesis: 'The homepage is a bench you sign, not a brochure you read.',
    specimen: {
      display: 'var(--g-bricolage), system-ui, sans-serif',
      body: 'var(--g-bricolage), system-ui, sans-serif',
      mono: 'var(--g-departure), ui-monospace, monospace',
      displayStyle: {
        fontWeight: 800,
        letterSpacing: '-0.005em',
        lineHeight: 0.88,
        fontStretch: '75%',
        fontVariationSettings: "'opsz' 96",
      },
      bodyLine: 'Write your name on the tag. It stays in this browser. Nothing is sent.',
      monoLine: 'BUILT BY ______ · OPEN THIS TERM [CONFIRM]',
      bg: '#eeebe1',
      fg: '#15171a',
      muted: '#4f534c',
      faces: 'Bricolage Grotesque 800, width 75 (display + body) · Departure Mono (metadata, 12 px grid)',
      loading: 'Bricolage: next/font (Google). Departure Mono: local OFL woff2.',
    },
    palette: [
      { hex: '#eeebe1', role: 'Paper (page)' },
      { hex: '#f7f5ee', role: 'Sheet (records, tray, tabs)' },
      { hex: '#15171a', role: 'Ink / night (text, Thursday band)' },
      { hex: '#4f534c', role: 'Muted text' },
      { hex: '#173b2f', role: 'Cutting mat (a material, not a brand colour)' },
      { hex: '#e9efe6', role: 'Text on the mat' },
      { hex: '#c8361f', role: 'Tag red: your name and its CTA only' },
      { hex: '#a92b17', role: 'Tag red hover' },
    ],
    interactions: [
      'Write your name on the red tag inside the headline (a real input).',
      'Carry the tag onto an unowned part: drag, keyboard (Space, arrows), a per-seat button, or a List view.',
      'Hovering a DG-001 seat inverts the phone layers that subsystem touches.',
      'The page recomposes: the title block, Join step 1 and the footer fill with your name and seat.',
    ],
    distinctive:
      'The largest type on the page is the visitor’s own name. Projects are sheets on a cutting mat with empty BUILT BY rows, and nothing moves unless you move it.',
    strengths: [
      {
        text: 'The blank does something: the visitor’s name fills it, and filling it is the interface.',
        source: 'critiques/f-by-e.md §3',
      },
      {
        text: 'Cheap and static-export safe: @dnd-kit/core + motion, no WebGL; every drag has keyboard, button and list equivalents.',
        source: 'critiques/f-by-e.md F1 · concept-f.md',
      },
    ],
    costs: [
      {
        text: 'Gimmick risk: typing your name on a club site can read as a toy.',
        source: 'concept-f.md risk 1',
      },
      {
        text: 'Seats imply openings nobody has confirmed; production needs a seats data contract with per-term status.',
        source: 'critiques/f-by-e.md B2, F2',
      },
      {
        text: 'Sticker and pixel-art tone can drift toward games or “student club social”.',
        source: 'concept-f.md risk 6 · f-by-e.md X3',
      },
      {
        text: 'Mobile page is 7,746 px (target ≤6,500 deferred to v3); the name lives in localStorage on shared lab computers.',
        source: 'concept-f.md v2 deferred · risk 5',
      },
    ],
    doc: 'design-lab/concepts/concept-f.md',
    stripHeight: 1258,
  },
];

export const gallery = (file: string): string => `/design-lab/gallery/${file}`;
