/**
 * Content removed from live files on 2026-10-08 (clean-up approved by the Head Designer).
 * Nothing read these exports/fields. Kept here verbatim so the text is not lost. Not built, not type-checked.
 * To restore a block, paste it back into the file named in its banner.
 */

/* ================= from app/(apple)/_content/sidekick.ts ================= */
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
/** Figure legend: what each tier is drawn from. */
export const stackLegend = '2 layouts · 1 schematic · 2 outlines';
export const rules = [
  { n: '1', what: 'owner', line: 'per subsystem' },
  { n: '1', what: 'review path', line: 'per handoff' },
  { n: '1', what: 'test gate', line: 'before merge' },
  { n: '1', what: 'repair plan', line: 'before release' },
] as const;
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

/* ================= from app/(apple)/_content/home.ts ================= */
export const highlightsHeadline = 'DIGITAL, in four parts.';


export const confirmTag = '[confirm]';
// Channel.lineConfirm field + `lineConfirm: true` on the SIDEKICK channel entry:
//   /** The line itself carries an unconfirmed knowledgebase fact. */
//   readonly lineConfirm?: boolean;

/* ================= from lib/data/siteConfig.ts ================= */

export const stats = {
  activeMembers: '120+',
  prototypes: '15',
  linesOfCode: '50k+',
  sponsors: '2',
};

export const sponsors = [
  { name: 'Cal Poly Pomona Project Hatchery' },
  { name: 'College of Engineering: MEP-WiSE' },
];
// siteConfig.assets (the PNGs are now in archive/public/assets/landing/):
export const siteConfigAssets = {
  logo: '/assets/landing/DIGITAL_V1_Logo1.png',
  logoDark: '/assets/landing/DIGITAL_V1_Logo1_DarkMode.png',
  logoFull: '/assets/landing/DIGITAL_V1_Logo1_Full.png',
};

/* ================= from lib/types.ts ================= */
export interface ProjectTimeline {
  phase: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface ProjectModule {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot' | 'wearable';
  status: 'active' | 'completed' | 'paused';
  isFlagship: boolean;
  comingSoon?: boolean;
  image: string;
  gallery?: string[];
  techStack: string[];
  stats?: ProjectStat[];
  timeline?: ProjectTimeline[];
  modules?: ProjectModule[];
  specifications?: { label: string; value: string }[];
  teamMembers?: string[];
}

/* ================= from lib/data/community.ts ================= */
/** LinkedIn post refs (urn:li:share:…) — starts empty; add as posts ship. */
export const linkedInPosts: readonly unknown[] = [];

export interface VideoItem {
  readonly id: string;
  readonly youtubeId?: string;
  readonly title: string;
  readonly project?: string;
  readonly isPlaceholder: boolean;
}

/** Video shelf — placeholders until the team publishes real recordings. */
export const videos: readonly VideoItem[] = [
  { id: 'video-1', title: 'Build review — Modular Smartphone', project: 'Modular Smartphone', isPlaceholder: true },
  { id: 'video-2', title: 'RSVP demo — Smart Reading', project: 'Smart Reading', isPlaceholder: true },
];

/* ================= from lib/data/about.ts ================= */
export interface FrameworkPhase {
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export const frameworkPhases: readonly FrameworkPhase[] = [
  {
    label: 'Phase 01',
    title: 'Design',
    description: 'Device, Generating, and Analyzing shape concepts and requirements.',
  },
  {
    label: 'Phase 02',
    title: 'Build',
    description: 'Implementation and Integrating turn designs into working hardware.',
  },
  {
    label: 'Phase 03',
    title: 'Growth',
    description: 'Testing and Learning feed results back into the next revision.',
  },
] as const;

/**
 * The smartphone project's requirement statement — kept verbatim from the
 * club's approved framing (formerly rendered on /pillars).
 */
export const deviceRequirement =
  'Build a smartphone from scratch that is comfortable to hold, intuitive to use, powerful enough to maintain strong performance, efficient enough to endure a whole day of extensive use, speedy enough to feel snappy and responsive, and versatile enough to serve as a foundation for future innovations.';

export interface BenchFeature {
  readonly title: string;
  readonly description: string;
}

export const benchFeatures: readonly BenchFeature[] = [
  {
    title: 'Custom PCB design',
    description: 'Four-layer boards for power management and connectivity.',
  },
  {
    title: 'Mechanical housing',
    description: '3D-printed and CNC-machined enclosures for snap-fit modularity.',
  },
  {
    title: 'Embedded OS',
    description: 'Custom kernel drivers and an interface fitted to our hardware.',
  },
] as const;

export interface RoadmapPhase {
  readonly status: 'completed' | 'current' | 'future';
  readonly title: string;
  readonly description: string;
}

export const roadmapPhases: readonly RoadmapPhase[] = [
  {
    status: 'completed',
    title: 'Concept & prototyping',
    description: 'Initial breadboarding, component selection, feasibility studies.',
  },
  {
    status: 'current',
    title: 'PCB fabrication',
    description: 'First revision of carrier boards and module interconnects.',
  },
  {
    status: 'future',
    title: 'System integration',
    description: 'Full OS bring-up, housing assembly, user testing.',
  },
] as const;

/** Three things the club holds itself to — distinct from the canonical mission beats. */
export const aboutCommitments: readonly { title: string; description: string }[] = [
  {
    title: 'Industry standard',
    description:
      'Altium, SolidWorks, embedded C++ — the same tools the workforce uses, on real hardware.',
  },
  {
    title: 'Peer mentorship',
    description: 'Upperclassmen and industry mentors sit next to first-year members at the bench.',
  },
  {
    title: 'Ambitious scope',
    description: 'A fully modular smartphone is not a typical club project. We build it anyway.',
  },
] as const;
