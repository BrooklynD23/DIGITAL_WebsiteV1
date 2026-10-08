/**
 * SIDEKICK (formerly "The Modular Smartphone", DG-001): shared content for both round-2 worlds.
 * Apple world (top of file): the FPGA main board. Every number, part value and package below is read from the
 * project repository: zynq_sdr_dongle.kicad_pcb (board edge, stackup, footprints, nets), the schematic sheets
 * (sheet names, symbol values), gerber/Manufacture Requirements.docx (panel) and README.md (architecture,
 * subsystem table, status). Regenerate geometry and counts with design-lab/scripts/sidekick-mainboard.mjs.
 * Signal world (below the LEGACY line): the earlier module stack, left as it was.
 * No personal names. No fabricated, tested or shipped claims: the repository is an archival snapshot.
 */
import { CLUB } from '../_chrome/club';

/* ------------------------------------------------------------------ FPGA main board (Apple world) */

export type PartGroupId = 'compute' | 'memory' | 'power' | 'usb' | 'rf' | 'io';
export type BoardStageId = 'board' | 'layers' | PartGroupId | 'whole';

export interface PartRow {
  /** Reference designator(s), layer name or count, as in the KiCad file. */
  readonly ref: string;
  /** The symbol value from the schematic. */
  readonly value: string;
  /** Package, footprint or role. */
  readonly note: string;
  /** Legend rows only: the group whose colour this row carries. */
  readonly group?: PartGroupId;
}

export interface BoardStage {
  readonly id: BoardStageId;
  /** Tracker label; for group stages also the colour legend label. */
  readonly label: string;
  readonly heading: string;
  readonly line: string;
  readonly rows: readonly PartRow[];
}

export const mainboard = {
  name: 'FPGA main board',
  file: 'zynq_sdr_dongle.kicad_pcb',
  /** Layer tag for the centre dielectric in the exploded stack. */
  coreLabel: 'FR-4',
  github: 'View the design files on GitHub',
  artLabel: 'The SIDEKICK FPGA main board, 61.3 by 22.8 millimetres, drawn from its KiCad file.',
  stagesLabel: 'The main board in nine steps',
  trackerLabel: 'Board steps',
  metaDescription: 'SIDEKICK, formerly the Modular Smartphone: the FPGA main board, layer by layer and part by part, drawn from its KiCad file.',
} as const;

/** The pinned board story, in order. Group stages are keyed by the schematic sheets the parts sit on. */
export const boardStages: readonly BoardStage[] = [
  {
    id: 'board',
    label: 'Board',
    heading: 'A phone, part by part.',
    line: 'This is the main board of SIDEKICK, a student-designed modular smartphone built around an FPGA.',
    rows: [
      { ref: 'File', value: 'zynq_sdr_dongle.kicad_pcb', note: 'KiCad' },
      { ref: 'Size', value: '61.3 × 22.8 mm', note: 'Four 2.0 mm mounting holes' },
      { ref: 'Stack', value: '6 copper layers', note: 'FR-4' },
    ],
  },
  {
    id: 'layers',
    label: 'Layers',
    heading: 'Six copper layers.',
    line: 'Four layers carry most of the routing. In1 is a ground plane. In3 holds the power planes.',
    rows: [
      { ref: 'F.Cu', value: 'Routing', note: 'Front side. Ground pour' },
      { ref: 'In1.Cu', value: 'Plane', note: 'GND' },
      { ref: 'In2.Cu', value: 'Routing', note: 'Inner signal layer' },
      { ref: 'In3.Cu', value: 'Planes', note: '+1V0, +1V8, VCC_DDR, VCC_BANK34' },
      { ref: 'In4.Cu', value: 'Routing', note: 'Inner signal layer' },
      { ref: 'B.Cu', value: 'Routing', note: 'Back side. Rail pours' },
    ],
  },
  {
    id: 'compute',
    label: 'Processing',
    heading: 'The Zynq sits in the middle.',
    line: 'One XC7Z020 holds both the processing system and the programmable logic.',
    rows: [
      { ref: 'U2', value: 'xc7z020clg400', note: 'CLG400, 400 balls' },
      { ref: 'X2', value: 'SiT1602B', note: 'Oscillator, 2.5 × 2.0 mm' },
      { ref: 'J3', value: 'Micro_SD_Card', note: 'Molex 104031-0811, back side' },
      { ref: 'U13', value: 'TXS0206A', note: 'WLCSP-20' },
      { ref: 'SW2', value: 'SW_DIP_x01', note: 'EVQ9P701P footprint' },
    ],
  },
  {
    id: 'memory',
    label: 'Memory',
    heading: 'DDR3 beside it.',
    line: 'One 96-ball DDR3 device gives the processing system its memory.',
    rows: [
      { ref: 'U1', value: 'DDR3', note: 'BGA-96, 9.0 × 13.0 mm, 0.8 mm pitch' },
      { ref: 'C, R', value: '36 passives', note: '0201 and 0402' },
      { ref: 'Rail', value: 'VCC_DDR', note: 'Plane on In3 and B.Cu' },
    ],
  },
  {
    id: 'power',
    label: 'Power',
    heading: 'Six regulators on the back.',
    line: 'Bringing up the eight power rails is the first step of the planned boot flow.',
    rows: [
      { ref: 'U4, U9, U10', value: 'TPS62088', note: 'PowerWCSP-6' },
      { ref: 'U8', value: 'TPS62867', note: 'VQFN-HR' },
      { ref: 'U6, U7', value: 'MAX38904C', note: 'WLP-15' },
      { ref: 'L ×4', value: 'Murata LQH2MCN', note: 'Inductor, 2.0 × 1.6 mm' },
    ],
  },
  {
    id: 'usb',
    label: 'USB',
    heading: 'USB-C on the short edge.',
    line: 'A USB-C receptacle and a Micro-B receptacle share one end of the board.',
    rows: [
      { ref: 'J1', value: 'USB_C_Receptacle', note: 'Amphenol 12401548E4-2A' },
      { ref: 'J2', value: 'USB_B_Micro', note: 'Amphenol 10104110' },
      { ref: 'U5', value: 'USB3346', note: 'QFN-24, 4 × 4 mm, back side' },
      { ref: 'U11', value: 'TPS2121', note: 'VQFN-12' },
      { ref: 'J13', value: 'Conn_01x04_Male', note: 'BM03B-ACHSS-GAN-TF footprint' },
    ],
  },
  {
    id: 'rf',
    label: 'RF transceiver',
    heading: 'An AD9361 at the far end.',
    line: 'One AD9361, four baluns and six U.FL coaxial connectors make up the transceiver section.',
    rows: [
      { ref: 'U3', value: 'AD9361', note: 'BGA, 10 × 10 mm, 0.8 mm pitch' },
      { ref: 'FL1–FL4', value: '0850BM14E0016', note: 'Johanson balun, 1.6 × 0.8 mm' },
      { ref: 'J5–J9, J12', value: 'Conn_Coaxial', note: 'U.FL, Molex 73412-0110' },
      { ref: 'X3', value: 'SiT1602B', note: 'Oscillator, 2.5 × 2.0 mm' },
    ],
  },
  {
    id: 'io',
    label: 'Board I/O',
    heading: 'Where the next board connects.',
    line: 'A 2 × 40 board-to-board connector and two header rows lead off this board.',
    rows: [
      { ref: 'J4', value: '5024268012', note: 'Molex SlimStack, 2 × 40, 0.40 mm pitch, back side' },
      { ref: 'J10', value: 'Conn_01x13_Male', note: '2.54 mm header' },
      { ref: 'J11', value: 'Conn_01x16_Male', note: '2.54 mm header, marked DNP' },
      { ref: 'D2, D3', value: 'LED', note: '0201' },
    ],
  },
  {
    id: 'whole',
    label: 'Whole board',
    heading: 'One board again.',
    line: 'Every part above is in the archived KiCad file.',
    rows: [
      { ref: '67', value: 'Processing', note: 'PS and PL sheets', group: 'compute' },
      { ref: '37', value: 'Memory', note: 'PS DDR sheet', group: 'memory' },
      { ref: '89', value: 'Power', note: 'Power sheets', group: 'power' },
      { ref: '30', value: 'USB', note: 'USB Connector sheet', group: 'usb' },
      { ref: '42', value: 'RF transceiver', note: 'Transceiver RF sheet', group: 'rf' },
      { ref: '12', value: 'Board I/O', note: 'BTB Connector and root sheets', group: 'io' },
    ],
  },
];

/** Board facts strip under the story. */
export const boardFacts = {
  headline: 'The board, in numbers.',
  items: [
    { term: 'Outline', value: '61.3 × 22.8 mm', note: 'Edge.Cuts, one board' },
    { term: 'Copper', value: '6 layers', note: 'F.Cu, In1 to In4, B.Cu' },
    { term: 'Footprints', value: '277', note: 'Both sides' },
    { term: 'Vias', value: '924', note: '0.4 mm pad, 0.2 mm drill' },
    { term: 'Smallest track', value: '0.1 mm', note: 'Board file' },
    { term: 'Panel', value: '4 boards', note: '75.3 × 94.2 mm, manufacturing notes' },
  ],
} as const;

/** The repository's subsystem table (README.md, "System overview"). */
export const subsystems = {
  headline: 'Ten subsystems, one repository.',
  lead: 'Each one keeps its own source snapshot and provenance note.',
  items: [
    { id: 'fpga-mainboard', name: 'FPGA main board and peripheral board', part: 'XC7Z020', line: 'KiCad source, fabrication outputs, 3D renders and manufacturing notes.' },
    { id: 'stm32-controller', name: 'STM32 controller', part: 'STM32G431', line: 'KiCad design and an STM32CubeIDE firmware project.' },
    { id: 'imu', name: 'IMU', part: 'ICM-20948', line: 'Seven chronological KiCad archives.' },
    { id: 'ambient-light-sensor', name: 'Ambient-light sensor', part: 'VCNL4030X01', line: 'KiCad archives and a STEP model.' },
    { id: 'real-time-clock', name: 'Real-time clock', part: 'RV-3028-C8', line: 'KiCad source, renders and prototype outputs.' },
    { id: 'flashlight', name: 'Flashlight', part: 'LM3644', line: 'Two KiCad revisions and a symbol and footprint library.' },
    { id: 'haptics', name: 'Haptics', part: null, line: 'A motor-driver board for tactile feedback. KiCad archive.' },
    { id: 'fingerprint-sensor', name: 'Fingerprint sensor', part: null, line: 'The sensor interface board. KiCad archive.' },
    { id: 'heat-sensor', name: 'Heat sensor', part: null, line: 'A schematic. No PCB file in this snapshot.' },
    { id: 'mechanical-thermal', name: 'Mechanical and thermal', part: null, line: 'Enclosure, frame and assembly models in STEP, STL and SolidWorks.' },
  ],
} as const;

/** Status and plan (README.md: "Repository status", "Planned operational architecture"). */
export const archive = {
  headline: 'An archive, not a finished phone.',
  lead: 'The repository is an engineering snapshot. It does not claim that every subsystem is production-ready, or that the files assemble into a phone.',
  pathTitle: 'Planned data path',
  path: [
    'Peripheral daughterboard: sensors and actuators',
    'Custom SPI and GPIO logic',
    'Hardware FIFO buffers',
    'AXI interconnect and memory-mapped registers',
    'OS kernel and drivers',
    'Touch UI, telemetry, audio and haptic feedback',
  ],
  targetsTitle: 'Design targets',
  targets: [
    'Peripheral-to-memory latency below 15 ms.',
    'No lost sensor packets at the target sampling load.',
    'Passive heat routing away from where the hand touches.',
  ],
  targetsNote: 'Targets from the planning workspace. Not measurements of this hardware.',
} as const;

/* ------------------------------------------------------------------ LEGACY (Signal world) */

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
export const rulesHeadline = 'One of each, per part.';
export const ruleSentences = [
  'One owner per subsystem.',
  'One review path per handoff.',
  'One test gate before merge.',
  'One repair plan before release.',
] as const;
/** Figure legend: what each tier is drawn from. */
export const stackLegend = '2 layouts · 1 schematic · 2 outlines';
export const rules = [
  { n: '1', what: 'owner', line: 'per subsystem' },
  { n: '1', what: 'review path', line: 'per handoff' },
  { n: '1', what: 'test gate', line: 'before merge' },
  { n: '1', what: 'repair plan', line: 'before release' },
] as const;

export const join = {
  headline: 'Take a subsystem.',
  lead: 'Pick a board. Its files are in the repository.',
  when: 'Thursdays, 6:00 PM',
  where: 'Building 17, Room 1635',
  discord: CLUB.discord,
} as const;

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
