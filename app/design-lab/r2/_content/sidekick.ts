/**
 * SIDEKICK (formerly "The Modular Smartphone", DG-001): shared facts for both round-2 worlds.
 * Source of truth: design-lab/round2/research/kb-smartphone.md (KB facts F1–F27) + PRODUCT.md.
 * Every knowledge-base fact is club-unconfirmed and carries `confirm: true` → rendered with a [confirm] tag.
 * No personal names or handles. No defect-level language. No fabricated, tested or shipped claims.
 */
import { siteConfig } from '@/lib/data/siteConfig';

export type ModuleId = 'fingerprint' | 'sensor' | 'carrier' | 'compute' | 'planned';
/** Line form carries state (Signal) / word carries state (Apple). Never colour. */
export type ModuleState = 'routed' | 'partly-routed' | 'schematic' | 'external' | 'research';

export interface SidekickModule {
  readonly id: ModuleId;
  /** Stack position, top (1) → back (5). The numbers lock the object to the list. */
  readonly n: number;
  readonly name: string;
  /** One line, ≤ 12 words (Apple viewer, no-JS list). */
  readonly line: string;
  /** Signal entry line, ≤ 5 words (the name lives on the object). */
  readonly short: string;
  /** Apple viewer spec line. */
  readonly spec: string;
  readonly scope: string;
  readonly risk: string;
  readonly state: ModuleState;
  readonly stateWord: string;
  /** Measured value for the readout (mm or count). */
  readonly measure: string;
  /** Real KiCad geometry exists for this module. */
  readonly board: 'zynq-carrier-power' | 'fingerprint' | null;
  /** Apple caption: one line per layer of the pinned chapter. */
  readonly caption: string;
}

export const sidekick = {
  name: 'SIDEKICK',
  channel: 'CH1',
  formerly: 'formerly The Modular Smartphone, DG-001',
  headline: 'A phone, part by part.',
  lead: 'SIDEKICK splits a phone into boards a student can own: one board, one owner, one test.',
  statusLine: 'Design paused August 2025. Three boards in KiCad. Every seat open.',
  heroCaption: 'Power carrier, 49 × 41 mm, KiCad file.',
  joinLink: 'Take a subsystem',
} as const;

/** Top of the stack first. Order matches the drawing: the SoM mezzanine sits on the carrier's back side. */
export const modules: readonly SidekickModule[] = [
  {
    id: 'fingerprint',
    n: 1,
    name: 'Fingerprint module',
    line: 'An FPC2532AP sensor board, routed on two layers.',
    short: 'An FPC2532AP sensor board.',
    spec: '22.81 × 26.12 mm, routed',
    scope: 'Sensor board, two headers, two test points',
    risk: 'Lives on a side branch; never merged into the main design',
    state: 'routed',
    stateWord: 'Routed, unmerged',
    measure: '22.81 × 26.12 mm · 77 track segments · 12 vias',
    board: 'fingerprint',
    caption: 'Fingerprint module. Routed, waiting to be merged.',
  },
  {
    id: 'sensor',
    n: 2,
    name: 'Sensor module',
    line: 'Thermocouple and pressure sensing on I²C, behind a 7-pin header.',
    short: 'Temperature and pressure.',
    spec: 'Schematic only, no outline',
    scope: 'Schematic, board outline, first layout',
    risk: 'No mating connector on the carrier yet; the interface is open',
    state: 'schematic',
    stateWord: 'Schematic in rework',
    measure: '4 parts · no outline yet',
    board: null,
    caption: 'Sensor module. A schematic in rework; no board yet.',
  },
  {
    id: 'carrier',
    n: 3,
    name: 'Power & carrier',
    line: 'USB-C and barrel-jack power, a one-cell charger, the battery rail.',
    short: 'USB-C power, battery charging.',
    spec: 'Partly routed, 49 × 41 mm',
    scope: 'Placement, routing, power path',
    risk: '19 parts still sit beside the board, unplaced',
    state: 'partly-routed',
    stateWord: 'Partly routed',
    measure: '49.0 × 41.0 mm · 14 track segments · 8 vias',
    board: 'zynq-carrier-power',
    caption: 'Power carrier. Everything plugs in here. Partly routed.',
  },
  {
    id: 'compute',
    n: 4,
    name: 'Compute',
    line: 'A Zynq-7000 module, ARM and FPGA, on a 100-pin board-to-board connector.',
    short: 'Zynq-7000: ARM plus FPGA.',
    spec: 'Outside design, outline illustrative',
    scope: 'Carrier-side interface to the module',
    risk: 'Designed outside the club; the exact Zynq part is not stated',
    state: 'external',
    stateWord: 'External design',
    measure: 'Zynq-7000 · ARM + FPGA',
    board: null,
    caption: 'Compute. A Zynq-7000 module, designed outside the club.',
  },
  {
    id: 'planned',
    n: 5,
    name: 'Planned modules',
    line: 'Clock, motion, distance, light, haptics, microphone, speaker, camera, touch.',
    short: 'Nine modules, research notes only.',
    spec: 'Nine modules, no files',
    scope: 'Pick one; draw its first schematic',
    risk: 'Research notes only; no design files exist',
    state: 'research',
    stateWord: 'Research only',
    measure: '9 modules · 0 files',
    board: null,
    caption: 'Planned modules. No files.',
  },
];

/** The carrier's own layers, back → front, for the readout (Signal) and the captions (Apple). */
export const carrierLayers = [
  { layer: 'B.Cu', name: 'Back copper', line: 'Two fills on the back. No traces yet.' },
  { layer: 'substrate', name: 'FR-4 core', line: '49 × 41 mm, 1.6 mm thick, 2.5 mm corners.' },
  { layer: 'F.Cu', name: 'Front copper', line: 'Fourteen track segments and the first fills, saved mid-layout.' },
  { layer: 'F.Pads', name: 'Front pads', line: 'Land patterns for USB-C, charger and headers.' },
  { layer: 'F.Silk', name: 'Silkscreen', line: 'Outlines for the 17 footprints placed so far.' },
] as const;

/** Highlights strip (Apple) / readout ticker (Signal). Captions 9–19 words. */
export const highlights = [
  { id: 'compute', title: 'Zynq-7000 module', line: 'ARM cores and an FPGA on one module, designed outside the club.' },
  { id: 'kicad', title: 'KiCad 9', line: 'Three two-layer boards. Both board drawings come from those files.' },
  { id: 'fingerprint', title: 'Fingerprint module', line: 'The most finished board: 22.81 × 26.12 mm, routed.' },
  { id: 'scope', title: 'No radio, no full OS', line: 'Cellular, wireless and a full operating system are out of scope.' },
  { id: 'paused', title: 'Paused, preserved', line: 'Main design stopped on 26 August 2025. Every file was kept.' },
] as const;

export const status = {
  headline: 'Paused, not finished.',
  lead: 'Nothing has been fabricated or tested. Every file is kept.',
  timeline: [
    { date: '2025-07-19', label: 'First commit' },
    { date: '2025-08-26', label: 'Main design paused' },
    { date: '2025-11', label: 'Fingerprint branch, last file' },
  ],
  boards: [
    { id: 'fingerprint', name: 'Fingerprint module', word: 'Routed, unmerged' },
    { id: 'carrier', name: 'Power & carrier', word: 'Partly routed' },
    { id: 'sensor', name: 'Sensor module', word: 'Schematic in rework' },
  ],
  notStarted: ['Operating system', 'Apps', 'Firmware', 'Enclosure'],
  next: [
    'Place 19 parts; route the carrier.',
    'Finish the sensor schematic.',
    'Pick the sensor connector.',
    'Merge the fingerprint board.',
  ],
} as const;

export const swap = {
  headline: 'One out, rest stays.',
  lead: 'No module swaps yet.',
  /** Constant control label (checkbox semantics carry the state). */
  control: 'Lift module',
} as const;

/** Ownership rules (PRODUCT.md positioning, phoneV2.ts buildScope). Set as sentences, never as numerals. */
export const rulesHeadline = 'Every part has one.';
export const ruleSentences = [
  'One owner per subsystem.',
  'One review path per handoff.',
  'One test gate before merge.',
  'One repair plan before release.',
] as const;
/** Figure legend: what each tier is drawn from [confirm]. */
export const stackLegend = '2 layouts · 1 schematic · 2 outlines';
export const rules = [
  { n: '1', what: 'owner', line: 'per subsystem' },
  { n: '1', what: 'review path', line: 'per handoff' },
  { n: '1', what: 'test gate', line: 'before merge' },
  { n: '1', what: 'repair plan', line: 'before release' },
] as const;

export const join = {
  headline: 'Take a subsystem.',
  lead: 'Pick a board. Take it from file to tested.',
  when: 'Thursdays, 6:00 PM',
  where: 'Building 17, Room 1635',
  discord: siteConfig.social.discord,
} as const;

export const confirmNote = '[confirm]';

/** Apple pin, phase 1: one caption per `sidekick-explode` marker (assembled, explode-start, layer-tags, carrier-exploded, module-exploded). */
export const explodeCaptions = [
  'Three boards in KiCad. Two are routed.',
  'Each board comes apart, layer by layer.',
  'Silkscreen, copper, core. Two copper layers each.',
  'The carrier: fourteen track segments so far.',
  'The fingerprint module: routed.',
] as const;

/** The phone shell around the stack: never started, drawn dashed and struck. */
export const enclosure = { name: 'Enclosure', word: 'Never started' } as const;
