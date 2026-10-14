/**
 * MOCKUP DRAFT, not brand-reviewed.
 * SHADES told as DIGITAL's design process, for the review route /projects/shades-process only.
 * Every string carries `src`: where the fact comes from. Short names:
 *   shades.ts   app/(apple)/_content/shades.ts
 *   SUMMARY     design-lab/shades-concept/research/notion/SUMMARY.md
 *   PRODDEF     design-lab/shades-concept/research/notion/01-product-definition.md
 *   PCB         design-lab/shades-concept/research/notion/03-hardware-pcb.md
 * SHADES is a planning-stage concept and a research platform; not a medical device; no efficacy claims.
 */
import { SHADES } from './shades';

export interface Sourced {
  readonly text: string;
  readonly src: string;
}

const s = (text: string, src: string): Sourced => ({ text, src });

export const processIntro = {
  title: s('How it is being planned.', 'SUMMARY §2 Goal: Root Status property "Planned"'),
  lead: s('Five sheets: requirements, scope, architecture, boards, phases.', 'SUMMARY §2 (ConOps, Scope, PCB-DB, FPGA-TL)'),
  draftTag: s('Mockup draft', 'review route label, not product copy'),
};

export const requirements = {
  id: 'requirements',
  title: s('Requirements', 'SUMMARY §2 Architecture: ConOps'),
  line: s('A pocket controller and the glasses, joined by one cable.', 'SUMMARY §2 Architecture: ConOps "external controller (puck)… single physical tether cable"; Controller: Puck "fit in a typical pocket"'),
  callouts: {
    dial: s('dial sets the pace', 'SUMMARY §2 Controller: ConOps "physical rotary dial… sets WPM"'),
    play: s('play / pause', 'SUMMARY §2 Controller: ConOps "dedicated physical button on the puck plays and pauses"'),
    rewind: s('rewind', 'SUMMARY §2 Controller: ConOps physical "Rewind" button'),
    cable: s('one cable: power + data', 'SUMMARY §2 Architecture: ConOps cable "provides both low-voltage power and serialized data transmission"'),
  },
} as const;

export const scope = {
  id: 'scope',
  title: s('Scope', 'shades.ts scope'),
  line: s(SHADES.scope.headline, 'shades.ts scope.headline'),
  inLabel: s(SHADES.scope.inLabel, 'shades.ts scope.inLabel'),
  outLabel: s(SHADES.scope.outLabel, 'shades.ts scope.outLabel'),
  in: SHADES.scope.in.map((t, i) => s(t, `shades.ts scope.in[${i}]`)),
  out: SHADES.scope.out.map((t, i) => s(t, `shades.ts scope.out[${i}]`)),
  gate: s('New feature? It answers seven questions first.', 'PRODDEF:146-148 Scope-change test (7 questions), Notion Engineering Scope'),
} as const;

export const architecture = {
  id: 'architecture',
  title: s('Architecture', 'SUMMARY §2 Architecture'),
  line: s('The host prepares the text. The controller times each word. The glasses show it.', 'SUMMARY §2 Architecture: Scope host "prepare plain text"; FPGA "RSVP timing"; glasses "contain only the microdisplay, fixed-focus optical assembly"'),
  nodes: {
    host: s('host computer', 'SUMMARY §2 Architecture: Scope "the host"'),
    controller: s('controller', 'SUMMARY §2 Architecture: Scope "external controller"'),
    mcu: s('microcontroller', 'SUMMARY §2 Architecture: Scope "the microcontroller"'),
    fpga: s('FPGA', 'SUMMARY §2 Architecture: Scope "the FPGA"'),
    cable: s('one cable', 'SUMMARY §2 Architecture: ConOps "single physical tether cable"'),
    display: s('display', 'SUMMARY §2 Architecture: Scope "microdisplay"'),
    optics: s('optics', 'SUMMARY §2 Display and optics: Scope "fixed-focus, monocular bird-bath optical path"'),
    eye: s('eye', 'SUMMARY §2 Display and optics: Scope "monocular"'),
  },
  notes: {
    host: s('prepares plain text', 'SUMMARY §2 Architecture: Scope host "will prepare plain text"'),
    mcu: s('checks the data, reads the controls', 'SUMMARY §2 Architecture: microcontroller "receive and validate presentation data, monitor user inputs"'),
    fpga: s('word timing, text rendering', 'SUMMARY §2 Architecture: FPGA "RSVP timing… text rendering"'),
    optics: s('one eye, fixed focus, see-through', 'shades.ts scope.in[4]'),
  },
} as const;

export const boards = {
  id: 'boards',
  title: s('Build plan', 'PCB board options'),
  line: s('Boards by function. Every row: not started.', 'SUMMARY §2 Roadmap: PCB-DB "Every row is Not Started"'),
  items: [
    { name: s('Processing Board', 'PCB:31,221'), tag: s('MVP', 'PCB:221-225') },
    { name: s('Carrier / Power', 'PCB:32,220'), tag: s('MVP', 'PCB:220') },
    { name: s('Display Daughterboard', 'PCB:34,216-217'), tag: s('MVP', 'PCB:216-217') },
    { name: s('Control Daughterboard', 'PCB:35,219'), tag: s('MVP', 'PCB:219') },
    { name: s('Optional Peripheral', 'PCB:140-185, 218'), tag: s('Stretch', 'PCB:146,179,218') },
  ],
} as const;

export const phases = {
  id: 'phases',
  title: s('Seven phases', 'shades.ts roadmap.headline'),
  line: s(SHADES.roadmap.lead, 'shades.ts roadmap.lead'),
  items: SHADES.roadmap.phases.map((p) => ({ n: p.n, name: s(p.name, `shades.ts roadmap.phases[${p.n - 1}]`) })),
  note: s(SHADES.roadmap.note, 'shades.ts roadmap.note'),
} as const;

export const palettes = {
  label: s('Sketch palette', 'review control, not product copy'),
  options: [
    { id: 'a', name: s('Ink + copper', 'existing tokens: ink, --board-copper') },
    { id: 'b', name: s('Blue + magenta pencil', 'reference sketch sheet; needs a DESIGN.md waiver') },
    { id: 'c', name: s('Graphite + one red mark', 'ink + --r2-trigger on one callout per sheet') },
  ],
} as const;
