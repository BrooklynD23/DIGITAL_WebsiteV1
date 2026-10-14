/**
 * MOCKUP DRAFT, not brand-reviewed.
 * SHADES as the team's design process, ideation to render, for the review route /projects/shades-journey only.
 * Every string carries `src`. Short source names are those in design-lab/shades-concept/research/notion/SUMMARY.md
 * (ConOps 2026-08-05, Puck 2026-09-28, Scope 2026-07-29, Focal 2026-09-28, Balance 2026-08-23, Matrix 2026-07-30,
 * SoC 2026-09-22, USB-C 2026-09-23, FPGA-core 2026-10-07, PCB-DB 2026-09-23) and the existing content files
 * shades.ts (join.*) and shades-drawings.ts (routes, optics, frame, puck, parts).
 * Stage names (Ideate, Explore, Refine, Explode, Specify, Render) are the industrial-design process the Head
 * Designer asked this mockup to walk; they describe the page, not a claim about the team's calendar.
 * Part-to-team claims come only from each team's own line in shades.ts join.roles. Research claims no part.
 * SHADES is a planning-stage concept and a research platform; not a medical device; no efficacy claims.
 * No personal names except the existing mentor line (shades.ts join.mentor).
 */
import { SHADES } from './shades';
import { frame, optics, puck, routes, type Sourced, type Variant } from './shades-drawings';

const s = (text: string, src: string): Sourced => ({ text, src });

export type { Sourced };

export const intro = {
  draftTag: s('Mockup draft', 'review route label, not product copy'),
  title: s('From a pencil line to a prototype.', 'Head Designer brief 2026-10-10: walk the design process, ideation to render'),
  lead: s('Six sheets. Each one a step closer.', 'six stages of this page; Root Status "Planned"'),
};

/** Handwritten callouts on the ideation wall. Wording from ConOps and Puck, via shades-drawings puck.*. */
export const callouts = {
  dial: s('Dial sets the pace', puck.notes[1].src + ': "physical rotary dial… sets WPM"'),
  play: s('Play / pause', puck.parts.play.src),
  rewind: s('Rewind', puck.parts.rewind.src),
  cable: s('One cable: power + data', puck.parts.cable.src + '; "power and data"'),
  touch: s('Tell them apart by touch', 'Puck: buttons and dials "distinguishable by touch"'),
  pocket: s('Fits a pocket', 'Puck: "fit in a typical pocket"'),
  oneEye: s('One eye', 'Scope: "monocular"'),
};

export interface Stage {
  readonly id: 'ideate' | 'explore' | 'refine' | 'explode' | 'specify' | 'render';
  readonly name: Sourced;
  readonly title: Sourced;
  readonly line: Sourced;
  readonly notes: readonly Sourced[];
}

export const STAGES: readonly Stage[] = [
  {
    id: 'ideate',
    name: s('Ideate', 'process stage, Head Designer brief'),
    title: s('Many shapes. A few rules.', 'ConOps + Puck requirements listed below'),
    line: s('The rules came first: a dial, two buttons, one cable.', 'ConOps 2026-08-05'),
    notes: [
      s('Dial sets the pace. One button plays and pauses. One rewinds.', 'ConOps 2026-08-05'),
      s('Buttons and dials distinguishable by touch.', 'Puck 2026-09-28'),
      s('One cable to the glasses: power and data.', 'ConOps 2026-08-05'),
      s('The controller fits a pocket.', 'Puck 2026-09-28'),
    ],
  },
  {
    id: 'explore',
    name: s('Explore', 'process stage, Head Designer brief'),
    title: s('Five directions.', 'routes.variants (2) + optics.variants (2 open, 1 out of scope) in shades-drawings.ts'),
    line: s('Each one answers a different open question.', 'SUMMARY §3 rows 21, 26; Matrix score cells blank'),
    notes: [
      s('Where the controls sit: frame or pocket.', 'SUMMARY §3 row 26'),
      s('How focus works: fixed, a ±4 mm carriage, or a moving projector.', 'Scope 2026-07-29; Focal 2026-09-28'),
      s('Waveguide and varifocal are outside the current scope.', 'Scope 2026-07-29'),
      s('No page records a decision.', 'SUMMARY §2 Roadmap'),
    ],
  },
  {
    id: 'refine',
    name: s('Refine', 'process stage, Head Designer brief'),
    title: s('One direction, shaded.', 'DECISIONS #7 (tethered, heavy temples); ConOps (puck)'),
    line: s('Tethered glasses, heavy at the temple. Everything else in the pocket.', 'DECISIONS #7 2026-10-09; ConOps 2026-08-05'),
    notes: [
      s('Thick temples carry the components.', 'DECISIONS #7 2026-10-09'),
      s('No software runs on the glasses.', 'DECISIONS #7 2026-10-09'),
      s('Processing, power and the controls live in the controller.', 'ConOps 2026-08-05'),
    ],
  },
  {
    id: 'explode',
    name: s('Explode', 'process stage, Head Designer brief'),
    title: s('Taken apart on one axis.', 'drawing convention'),
    line: s('Frame, optics, display, cable, controller, boards.', 'Scope; Background; ConOps; PCB-DB Board options'),
    notes: [
      s('Board parts are candidates. None is selected.', 'Matrix: "every score cell is blank. No decision recorded"'),
      s('Every board row: not started.', 'PCB-DB Status "Not Started"'),
    ],
  },
  {
    id: 'specify',
    name: s('Specify', 'process stage, Head Designer brief'),
    title: s('Drawn to targets.', 'frame.dims in shades-drawings.ts'),
    line: frame.line,
    notes: [...frame.notes.slice(0, 4)],
  },
  {
    id: 'render',
    name: s('Render', 'process stage, Head Designer brief'),
    title: s('The prototype concept.', 'Root Status "Planned"; shades-reveal hero render'),
    line: s('Front, three-quarter, side.', 'the three views drawn'),
    notes: [s('A planning-stage concept. Not a medical device.', 'shades.ts boundary; HANDOFF-NEXT §4 Facts')],
  },
];

/** Explore: five directions. Reused verbatim from shades-drawings.ts with their sources. Fixed focus is the MVP
 *  baseline (Scope), not a direction, so it is left out here; the notes still name it. */
export const directions: readonly Variant[] = [...routes.variants, ...optics.variants.filter((v) => v.tag !== 'MVP')];

/** Exploded-view labels. */
export const partLabels = {
  frame: s('Frame', 'join.roles[mech] "The frame"'),
  optics: s('Optics', 'Scope: "bird-bath optical path"'),
  display: s('Display', 'Scope: "microdisplay"'),
  temple: s('Temple housing', 'DECISIONS #7 "bulky on the side"'),
  cable: s('One cable', 'ConOps: "single physical tether cable"'),
  dial: s('Dial', 'ConOps: "physical rotary dial"'),
  lid: s('Controller case', 'join.roles[mech] "the controller case"'),
  control: s('Control board', 'PCB-DB "Control Daughterboard"'),
  processing: s('Processing board', 'PCB-DB "Processing Board"'),
  power: s('Carrier / power', 'PCB-DB "Carrier / Power"'),
  base: s('Case base', 'join.roles[mech] "the controller case"'),
};

export type PartId = keyof typeof partLabels;

/** CANDIDATE chips on the controller's boards (shades-drawings parts.variants). */
export const chips: Readonly<Partial<Record<PartId, Sourced>>> = {
  control: s('STM32-class', 'SoC: "STM32-to-FPGA communication interface"'),
  processing: s('Artix-7 XC7A100T', 'FPGA-core: "Artix 7 XC7A100T-1CSG324C FPGA"'),
  power: s('USB-C', 'USB-C: "primary wired connection for both power delivery and data transfer"'),
};
export const candidateTag = s('CANDIDATE', 'Matrix: no decision recorded');

type RoleId = (typeof SHADES.join.roles)[number]['id'];

/** Which parts each team's own line names. Cable: no role line names it, so no team claims it. */
export const claims: Readonly<Record<RoleId, { readonly parts: readonly PartId[]; readonly src: string }>> = {
  fpga: { parts: ['processing'], src: 'join.roles[fpga] "Word timing, text rendering and video output."' },
  pcb: { parts: ['control', 'power', 'display'], src: 'join.roles[pcb] "Circuit boards for power, controls and the display."' },
  mech: { parts: ['frame', 'temple', 'optics', 'lid', 'base'], src: 'join.roles[mech] "The frame, the optics mounts and the controller case."' },
  product: { parts: ['dial'], src: 'join.roles[product] "how a reader sets the pace" (the dial: ConOps)' },
  research: { parts: [], src: 'join.roles[research] "The medical-research track." No part.' },
};

export const teams = {
  heading: s('Who draws what.', 'join.roles in shades.ts'),
  lead: s(SHADES.join.lead, 'shades.ts join.lead'),
  variation: (n: 1 | 2) => s(`Variation ${n}`, 'review label'),
  v1Name: s('Exploded ownership', 'review label, Head Designer brief'),
  v2Name: s('Signed sheets', 'review label, Head Designer brief'),
  v1Hint: s('Pick a team to see its parts.', 'control instruction'),
  noPart: s('No part on the drawing. The research runs beside it.', 'join.roles[research]'),
  drawnBy: s('DRAWN BY', 'title-block convention'),
  fan: s('Fan out', 'control label'),
  stack: s('Stack', 'control label'),
  roles: SHADES.join.roles,
};

export const join = {
  headline: s('Join us', 'Head Designer brief 2026-10-10: replaces "Pick your seat." on this route only'),
  action: { ...SHADES.join.action, src: 'shades.ts join.action' },
  discord: { ...SHADES.join.discord, src: 'shades.ts join.discord' },
};

export const render = {
  title: s('SHADES', 'Root page title'),
  credit: s('SHADES · prototype concept', 'Head Designer brief 2026-10-10'),
  views: { front: 'Front', threeQuarter: 'Three-quarter', side: 'Side' },
};
