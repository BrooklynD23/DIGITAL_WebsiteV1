/**
 * MOCKUP DRAFT, not brand-reviewed.
 * SHADES as engineering drawing sheets, for the review route /projects/shades-drawings only.
 * Every string carries `src`: where it comes from. Short names (Notion page + last-edited date):
 *   SUMMARY  design-lab/shades-concept/research/notion/SUMMARY.md
 *   Root     SHADES root page, 2026-09-28            Scope    Engineering Scope, 2026-07-29
 *   ConOps   Concept of Operations, 2026-08-05      Puck     Compute Puck Enclosure (Mech-E), 2026-09-28
 *   Focal    Focal Plane Adjustment (Mech-E), 2026-09-28
 *   Balance  Mass Balancing & Strain Relief (Mech-E), 2026-08-23
 *   USB-C    USB-C Power and Data Module, 2026-09-23  FPGA-core FPGA/SoC Core Module, 2026-10-07
 *   Matrix   FPGA Decision Matrix, 2026-07-30         SoC      System on Chip Logic Design, 2026-09-22
 *   BrkV4    Project Breakdown V4, 2026-07-09         Haptic   Haptic Driver Module rows, 2026-10-07/08
 *   PCB-DB   Hardware Design (PCB) Database rows, 2026-09-23 (all "Not Started")
 * Raw quotes: research/notion/01–05-*.md. Part names: Head Designer asked (2026-10-10) to show them as
 * candidates under evaluation; every one is labelled CANDIDATE, none "selected".
 * Dimensions are Notion targets, labelled TARGET; the views are not to scale (NTS).
 * SHADES is a planning-stage concept and a research platform; not a medical device; no efficacy claims.
 */

export interface Sourced {
  readonly text: string;
  readonly src: string;
}

const s = (text: string, src: string): Sourced => ({ text, src });

export const drawIntro = {
  draftTag: s('Mockup draft', 'review route label, not product copy'),
  title: s('The prototype, on paper.', 'Root Status "Planned" (SUMMARY §2)'),
  lead: s('Six sheets. The routes are still open.', 'SUMMARY §2 Roadmap "No page names a current phase"; Matrix score cells blank'),
};

/** Title-block fields shared by every sheet. */
export const titleBlock = {
  project: s('SHADES · PROTOTYPE', 'Root: "Engineering Project Designs RSVP Heads-Up Display Glasses"'),
  status: s('PLANNED', 'Root Status property "Planned"'),
  scale: s('NTS', 'drawing convention: not to scale; views are illustrative'),
  rev: s('—', 'no revision issued; mockup'),
  labels: { title: 'TITLE', source: 'SOURCE', scale: 'SCALE', rev: 'REV', sheet: 'SHEET', status: 'STATUS' },
};

export type Tag = 'TARGET' | 'OPEN' | 'MVP' | 'STRETCH' | 'CONDITIONAL' | 'CANDIDATE' | 'OUT OF SCOPE';

export interface Variant {
  readonly route: string;
  readonly name: Sourced;
  readonly body: Sourced;
  readonly tag: Tag;
  readonly ghost?: boolean;
}

export interface SheetDef {
  readonly id: string;
  readonly title: Sourced;
  readonly line: Sourced;
  readonly source: string;
  readonly notes: readonly Sourced[];
}

export const frame = {
  id: 'frame',
  title: s('Glasses. Three views.', 'Scope: "The glasses will contain only the microdisplay, fixed-focus optical assembly…"'),
  line: s('The glasses carry the display and the optics.', 'Scope: glasses contain "the microdisplay, fixed-focus optical assembly, necessary interface electronics, and the controls"'),
  source: 'Scope 07-29 · Balance 08-23 · Focal 09-28',
  dims: {
    width: s('140–148', 'Balance: "Balance a 140mm to 148mm frame"'),
    mass: s('< 40–50 g', 'Focal: "Weight of system: Less than 40-50 grams"'),
    split: s('30 / 70', 'Balance: "30/70 nose-to-ear weight split"'),
    strain: s('10–15', 'Balance: "10mm to 15mm tether strain channel"'),
  },
  views: { front: 'FRONT', top: 'TOP', side: 'RIGHT', iso: 'ISO' },
  notes: [
    s('Frame width 140–148 mm. Target.', 'Balance 2026-08-23'),
    s('System mass under 40–50 g. Target.', 'Focal 2026-09-28'),
    s('Nose-to-ear weight split 30 / 70. Target.', 'Balance 2026-08-23'),
    s('Tether strain channel 10–15 mm.', 'Balance 2026-08-23'),
    s('One eye. Fixed focus. See-through.', 'Scope 2026-07-29; Background 2026-09-28'),
  ],
} as const;

export const puck = {
  id: 'puck',
  title: s('Controller. Three views, one section.', 'ConOps: external controller ("puck")'),
  line: s('A pocket controller holds the processing, the power and the controls.', 'ConOps: puck "housing the processing unit, power supply, and primary physical controls"; Puck "fit in a typical pocket"'),
  source: 'ConOps 08-05 · Puck 09-28',
  dims: {
    l: s('140', 'Puck: "approximately 7 × 14 × 1 cm"'),
    w: s('70', 'Puck: "approximately 7 × 14 × 1 cm"'),
    t: s('10', 'Puck: "approximately 7 × 14 × 1 cm"'),
  },
  parts: {
    dial: s('DIAL · PACE', 'ConOps: "physical rotary dial… sets WPM"'),
    play: s('PLAY / PAUSE', 'ConOps: "dedicated physical button on the puck plays and pauses"'),
    rewind: s('REWIND', 'ConOps: physical "Rewind" button'),
    cable: s('ONE TETHER', 'ConOps: "single physical tether cable"'),
  },
  section: s('SECTION A–A', 'drawing convention'),
  notes: [
    s('Envelope approx. 70 × 140 × 10 mm. Target.', 'Puck 2026-09-28'),
    s('Dial sets the pace. One button plays and pauses. One rewinds.', 'ConOps 2026-08-05'),
    s('Buttons and dials distinguishable by touch.', 'Puck 2026-09-28'),
    s('Inside: battery-retention cages, motherboard mounts.', 'Puck 2026-09-28'),
    s('One cable to the glasses: power and data.', 'ConOps 2026-08-05'),
  ],
} as const;

export const routes = {
  id: 'routes',
  title: s('Where the parts live.', 'Scope vs ConOps (SUMMARY §3 row 26)'),
  line: s('Two pages, two answers. Both stay open.', 'SUMMARY §3 row 26: controls on glasses (Scope) vs puck (ConOps, Puck)'),
  source: 'Scope 07-29 · ConOps 08-05 · Puck 09-28',
  variants: [
    {
      route: 'ROUTE A',
      name: s('Controls on the frame', 'Scope: glasses hold "the controls that must be physically accessible to the wearer"'),
      body: s('Glasses: display, optics, interface electronics, wearer controls.', 'Scope 2026-07-29'),
      tag: 'OPEN',
    },
    {
      route: 'ROUTE B',
      name: s('Everything in the pocket', 'ConOps: puck houses "processing unit, power supply, and primary physical controls"'),
      body: s('Puck: processing, power, dial and buttons. Glasses: display and optics.', 'ConOps 2026-08-05; Puck 2026-09-28'),
      tag: 'OPEN',
    },
  ] as readonly Variant[],
  notes: [
    s('Both pages keep processing and power off the glasses.', 'Scope: "will initially remain in an external controller"; ConOps'),
    s('They differ on where the controls sit.', 'SUMMARY §3 row 26'),
    s('No page records a decision.', 'SUMMARY §2 Roadmap'),
  ],
} as const;

export const optics = {
  id: 'optics',
  title: s('Optics and focus.', 'Scope optics; Focal'),
  line: s('One eye, bird-bath optics. Focus is the open question.', 'Scope: "one fixed-focus, monocular bird-bath optical path"; Focal: ±4mm carriage (SUMMARY §3 row 21)'),
  source: 'Scope 07-29 · Focal 09-28',
  variants: [
    {
      route: 'ROUTE A',
      name: s('Fixed focus', 'Scope: "fixed-focus"'),
      body: s('Bird-bath path, focus locked. The MVP scope.', 'Scope 2026-07-29'),
      tag: 'MVP',
    },
    {
      route: 'ROUTE B',
      name: s('±4 mm focal carriage', 'Focal: "linear carriage providing ±4mm of focal displacement"'),
      body: s('A linear carriage, ±0.5° alignment held.', 'Focal: "while holding ±0.5° of perpendicular alignment" 2026-09-28'),
      tag: 'OPEN',
    },
    {
      route: 'ROUTE C',
      name: s('Move the projector', 'Focal: "Move the birdbath projector closer and further from the lens"'),
      body: s('Projector slides closer to or further from the lens.', 'Focal 2026-09-28'),
      tag: 'OPEN',
    },
    {
      route: '—',
      name: s('Waveguide, varifocal', 'Scope: "varifocal optics, custom waveguides… are outside the current scope"'),
      body: s('Outside the current scope.', 'Scope 2026-07-29'),
      tag: 'OUT OF SCOPE',
      ghost: true,
    },
  ] as readonly Variant[],
  labels: {
    display: s('DISPLAY', 'Scope: "microdisplay"'),
    splitter: s('BEAM SPLITTER', 'Background: "semi-reflective beam splitter"'),
    mirror: s('CURVED ELEMENT', 'Background: "curved optical element"'),
    eye: s('EYE', 'Scope: monocular'),
    travel: s('±4', 'Focal'),
    waveguide: s('WAVEGUIDE', 'Scope out of scope'),
  },
  notes: [
    s('Bird-bath: display, beam splitter, curved element, back to the eye.', 'Background 2026-09-28'),
    s('The world stays in view.', 'Background: "while preserving a view of the surrounding environment"'),
    s('Fixed focus is the MVP text. A carriage is the Mech-E text.', 'Scope 2026-07-29; Focal 2026-09-28'),
  ],
} as const;

export const parts = {
  id: 'parts',
  title: s('Candidate parts.', 'Matrix; FPGA-core; SoC; USB-C; Haptic'),
  line: s('Named in the notes. None is selected.', 'Matrix: "every score cell is blank. No decision recorded"'),
  source: 'Matrix 07-30 · SoC 09-22 · USB-C 09-23 · FPGA-core 10-07',
  variants: [
    { route: 'FPGA', name: s('Artix-7 XC7A100T', 'FPGA-core: "Artix 7 XC7A100T-1CSG324C FPGA"'), body: s('Main processor board.', 'FPGA-core 2026-10-07'), tag: 'CANDIDATE' },
    { route: 'FPGA', name: s('Spartan-7 · Zynq-7000', 'Matrix rows; Matrix note recommends Artix-7 or Zynq-7000 for Phase 1, Spartan-7 for the enclosure'), body: s('Also in the decision matrix. Scores blank.', 'Matrix 2026-07-30'), tag: 'CANDIDATE' },
    { route: 'MCU', name: s('STM32-class', 'SoC: "STM32-to-FPGA communication interface"'), body: s('Reads the dial, talks to the FPGA.', 'SoC: "The STM32 can debounce and interpret the rotary encoder" 2026-09-22'), tag: 'CANDIDATE' },
    { route: 'LINK', name: s('USB-C', 'USB-C: "primary wired connection for both power delivery and data transfer"'), body: s('One port for power and data.', 'USB-C 2026-09-23'), tag: 'CANDIDATE' },
    { route: 'DISPLAY', name: s('640 × 480, 24-bit', 'USB-C: "preliminarily estimated at 640 × 480 resolution… 24-bit color"'), body: s('Preliminary estimate.', 'USB-C 2026-09-23'), tag: 'CANDIDATE' },
    { route: 'DISPLAY', name: s('Monochrome glyphs', 'BrkV4: "16 × 16 monochrome pixel bitmap matrix"'), body: s('16 × 16 bitmap per character.', 'BrkV4 2026-07-09'), tag: 'CANDIDATE' },
    { route: 'HAPTIC', name: s('DRV2605L + LRA', 'Haptic: "LRA + DRV2605L + STM32 I²C control"'), body: s('A Stretch board.', 'Haptic Category "Stretch" 2026-10-07'), tag: 'CANDIDATE' },
    { route: 'MEMORY', name: s('Volatile memory · storage', 'PCB-DB rows SHD-PCB-02.01, 04.01'), body: s('MVP, conditional.', 'PCB-DB Category "MVP - Conditional" 2026-09-23'), tag: 'CANDIDATE' },
  ] as readonly Variant[],
  notes: [
    s('Display figures disagree between pages.', 'SUMMARY §3 row 37'),
    s('Seven FPGA families are in the matrix.', 'Matrix 2026-07-30'),
  ],
} as const;

export interface Board {
  readonly name: Sourced;
  readonly modules: readonly { readonly name: Sourced; readonly tag: Tag }[];
}

const m = (name: string, tag: Tag, src: string) => ({ name: s(name, src), tag });

export const boards = {
  id: 'boards',
  title: s('Boards by function.', 'PCB-DB Board / Workstream options'),
  line: s('Every row: not started.', 'PCB-DB Status "Not Started" (only option defined)'),
  source: 'PCB-DB 09-23 · Haptic 10-07',
  items: [
    {
      name: s('Processing Board', 'PCB-DB'),
      modules: [
        m('Boot flash', 'MVP', 'PCB-DB SHD-PCB-03.01'),
        m('FPGA clock', 'MVP', 'PCB-DB SHD-PCB-05.01'),
        m('FPGA JTAG', 'MVP', 'PCB-DB SHD-PCB-07.01'),
        m('Volatile memory', 'CONDITIONAL', 'PCB-DB SHD-PCB-02.01 "MVP - Conditional"'),
        m('Application storage', 'CONDITIONAL', 'PCB-DB SHD-PCB-04.01 "MVP - Conditional"'),
      ],
    },
    { name: s('Display Daughterboard', 'PCB-DB'), modules: [m('Display interface', 'MVP', 'PCB-DB SHD-PCB-16.01'), m('Display power', 'MVP', 'PCB-DB SHD-PCB-15.01')] },
    { name: s('Control Daughterboard', 'PCB-DB'), modules: [m('Rotary encoder', 'MVP', 'PCB-DB SHD-PCB-17.01')] },
    { name: s('Carrier / Power', 'PCB-DB'), modules: [m('Battery temperature', 'MVP', 'PCB-DB SHD-PCB-19.01')] },
    { name: s('Optional Peripheral', 'PCB-DB'), modules: [m('Ambient-light sensor', 'STRETCH', 'PCB-DB SHD-PCB-24.01'), m('Haptic driver', 'STRETCH', 'Haptic Category "Stretch"')] },
  ] as readonly Board[],
  notes: [
    s('Each module follows a 10-step template.', 'PCB-DB (SUMMARY §2 Roadmap)'),
    s('No row has a date.', 'PCB-DB (SUMMARY §2 Roadmap)'),
  ],
} as const;

export const SHEETS = [frame, puck, routes, optics, parts, boards] as const;

export const toggles = {
  paper: { label: s('Paper', 'review control'), dark: s('Dark', 'review control'), light: s('Light', 'review control') },
  palette: {
    label: s('Pencil', 'review control'),
    options: [
      { id: 'a', name: s('Ink + copper', 'shades-process palettes A') },
      { id: 'b', name: s('Blue + magenta pencil', 'shades-process palettes B; needs a DESIGN.md waiver') },
      { id: 'c', name: s('Graphite + one red mark', 'shades-process palettes C') },
    ],
  },
} as const;
