/**
 * Not yet brand-reviewed. Strings changed in the 2026-10-12 polish pass carry `// polished 2026-10-12`.
 * SHADES Concept X: the detailed technical page for SHADES (Head Designer, 2026-10-12). The main SHADES page
 * (/projects/shades-reveal/) stays simple and links here with "See Concept X"; this page links back.
 * Concept X is a next-gen evolution of the planned SHADES prototype. Head Designer brief 2026-10-12: keep the core (RSVP reading, one eye,
 * see-through, reading-first, research platform, not a medical device); redesign the form; thesis "open and
 * repairable"; CMF matte black polymer, titanium accents, one signal-red detail.
 *
 * Source map (every string carries `src`):
 *   Notion short names (page + last-edited date), from design-lab/shades-concept/research/notion/SUMMARY.md and
 *   shades-drawings.ts: Scope 2026-07-29 · Background 2026-09-28 · ConOps 2026-08-05 · Puck 2026-09-28 ·
 *   Focal 2026-09-28 · Balance 2026-08-23 · USB-C 2026-09-23 · FPGA-core 2026-10-07 · SoC 2026-09-22 ·
 *   PCB-DB 2026-09-23 · Mech-E rows (04-mech-e-and-timelines.md:93-132).
 *   Market research: four read-only research passes on 2026-10-12; every row and move cites its URL below.
 *   Owners: shades.ts join.roles ids (fpga, pcb, mech, product, research), each team's own line.
 *   Page chrome (index labels, back link, table notes): page structure, not claims.
 * Tags: PLANNED = a Notion page plans it (source given). CANDIDATE = a part Notion names, none selected.
 * CONCEPT = a Concept X form decision. POTENTIAL = a route Notion does not plan. Numbers are TARGET (a Notion
 * target) or ESTIMATE (preliminary), never specs. No efficacy claims, no personal names, no partners, no dates.
 */
import type { Sourced } from './shades-drawings';

const s = (text: string, src: string): Sourced => ({ text, src });

export type { Sourced };
export type PartTag = 'PLANNED' | 'CANDIDATE' | 'CONCEPT' | 'POTENTIAL';
export type RoleId = 'fpga' | 'pcb' | 'mech' | 'product';
export type Layout = 'planned' | 'potential';

export const meta = {
  title: 'SHADES Concept X',
  description: 'SHADES Concept X: a concept for open, repairable RSVP reading glasses. Not a planned design.',
};

/** Page chrome: back link and the in-page section index. Labels name sections; they make no claims. */
export const chromeCopy = {
  back: s('Back to SHADES', 'main SHADES route /projects/shades-reveal/'), // polished 2026-10-12
  backHref: '/projects/shades-reveal/',
  indexLabel: 'On this page', // polished 2026-10-12
} as const;

export const hero = {
  title: s('SHADES Concept X', 'Head Designer brief 2026-10-12: name'),
  caption: s('Concept. Not a planned design.', 'Head Designer brief 2026-10-12: caption'),
  lead: s('Every part, sourced and tagged. What Notion plans, what Concept X changes, what is still open.', 'page role, Head Designer 2026-10-12; tags below'), // brand-reviewed 2026-10-12
  original: s('The planned prototype, as drawn today.', 'app/(apple)/_shades-art/Glasses.tsx, tether on; ConOps one cable to a controller'),
  concept: s('Concept X. Matte black, titanium, one red release.', 'Head Designer brief 2026-10-12: CMF'),
};

export const thesis = {
  nav: s('Overview', 'section index label'), // polished 2026-10-12 (was eyebrow "The idea")
  line: s('Open it. Fix it. Own a part.', 'Head Designer brief 2026-10-12: thesis "open and repairable", DIGITAL "own a part"'),
  body: s(
    'Concept X keeps the reading core: one word at a time, one eye, see-through. Three things come apart. The optics lift out as one pod. The boards sit under four screws. One cable unplugs at both ends.', // brand-reviewed 2026-10-12
    'Scope 2026-07-29 (one eye, fixed focus); Background 2026-09-28 (see-through); ConOps 2026-08-05 (one cable); Concept X moves below',
  ),
};

export interface Feature {
  readonly id: string;
  readonly tag: PartTag;
  readonly title: Sourced;
  readonly line: Sourced;
}

export const features: readonly Feature[] = [
  {
    id: 'pod',
    tag: 'CONCEPT',
    title: s('A pod you can swap.', 'Concept X move 1'),
    line: s(
      'Display, beam splitter, curved combiner and the display board ride in one pod. Press the red release and it lifts off the frame.',
      'Background: bird-bath path; PCB-DB: Display Daughterboard; Concept X move 1 (Brilliant Labs Frame, XREAL One)',
    ),
  },
  {
    id: 'tray',
    tag: 'CONCEPT',
    title: s('Boards you can reach.', 'Concept X move 3'),
    line: s(
      'The controller opens with four standard screws. Boards sit by function, the way the PCB team already splits them.',
      'PCB-DB Board / Workstream options; Concept X move 3 (Meta Ray-Ban Display teardown, Kobo repair parts)',
    ),
  },
  {
    id: 'cable',
    tag: 'POTENTIAL',
    title: s('One cable, unplugged at both ends.', 'Concept X move 4'),
    line: s(
      'Power and data still share one cable. In Concept X it detaches at the temple and at the controller, so a frayed cable is a swap, not a rebuild.',
      'ConOps: "single physical tether cable" for power and data; Concept X move 4 (VITURE magnetic connector)',
    ),
  },
];

/* ------------------------------------------------------------------ market research */

export interface ResearchRow {
  readonly product: string;
  readonly kind: string;
  readonly weight: string;
  readonly optics: string;
  readonly battery: string;
  readonly compute: string;
  readonly controls: string;
  readonly repair: string;
  readonly cmf: string;
  readonly urls: readonly string[];
}

/** As reported by the cited source. "n/f" = not found in the sources read. Weights are reported figures. */
export const research = {
  nav: s('Research', 'section index label'), // polished 2026-10-12 (was eyebrow "Market research")
  title: s('What the field teaches.', 'four research passes, 2026-10-12'),
  lead: s('Eleven products, read for form, not features. Each figure is as its source reports it.', 'research rows below'),
  note: s('n/f: not found in the sources read. n/a: does not apply.', 'research table key'), // polished 2026-10-12
  movesTitle: s('Seven moves for Concept X', 'moves list below'), // moved from page.tsx 2026-10-12, unchanged
  movesFrom: 'From', // moved from page.tsx 2026-10-12, unchanged
  columns: ['Product', 'Weight', 'Optics / display', 'Battery', 'Compute', 'Controls', 'Repair', 'CMF'] as const,
  rows: [
    {
      product: 'Even Realities G1', kind: 'Display glasses', weight: '~43 g (third-party figure)', optics: 'Waveguide; green micro-LED, both eyes', // brand-reviewed 2026-10-12
      battery: 'Temples, ear end', compute: 'Phone', controls: 'Temple touch bar', repair: 'n/f',
      cmf: 'Magnesium, titanium temple tips',
      urls: ['https://www.evenrealities.com/g1', 'https://www.tomsguide.com/computing/smart-glasses/even-realities-g1-smart-glasses-review'],
    },
    {
      product: 'Brilliant Labs Frame', kind: 'Display glasses', weight: '~40 g', optics: 'Prism; micro-OLED, right eye',
      battery: 'Two small cells, place n/f', compute: 'On frame: MCU + FPGA', controls: 'Tap, voice', repair: 'Schematics, STL and firmware public',
      cmf: 'n/f',
      urls: ['https://docs.brilliant.xyz/frame/hardware', 'https://www.reality-atlas.com/hardware/brilliantlabsframe'],
    },
    {
      product: 'Vuzix Z100', kind: 'Display glasses', weight: '~36 g', optics: 'Waveguide; mono green, right eye',
      battery: 'Internal (M400: hot-swap pack)', compute: 'Phone', controls: 'Temple touchpad', repair: 'n/f',
      cmf: 'n/f',
      urls: ['https://mixed-news.com/en/the-new-vuzix-z100-are-rugged-36g-smart-glasses-designed-to-streamline-workflow/', 'https://www.vuzix.com/pages/compare-smart-glasses'],
    },
    {
      product: 'XREAL One', kind: 'Tethered AR', weight: '82–84 g (sources differ)', optics: 'Micro-OLED, both eyes',
      battery: 'Host-powered', compute: 'X1 chip on frame', controls: 'Frame buttons', repair: 'Rx inserts; 3 nose-pad sizes',
      cmf: 'n/f',
      urls: ['https://tutorials.xreal.com/docs/glasses/one-series/spec', 'https://www.androidcentral.com/gaming/virtual-reality/xreal-one-review'],
    },
    {
      product: 'VITURE Pro', kind: 'Tethered AR', weight: '77 g', optics: 'Micro-OLED, both eyes; diopter dials',
      battery: 'Pocket neckband / dock', compute: 'Neckband', controls: 'Frame buttons', repair: 'Magnetic pogo cable; swappable nose pads',
      cmf: 'Aluminum body, titanium hinges', // brand-reviewed 2026-10-12
      urls: ['https://www.viture.com/academy/xr-glasses/pro-one-series', 'https://www.viture.com/blog/mmorpgs-viture-one-dock-pack-review'],
    },
    {
      product: 'Meta Ray-Ban Display', kind: 'Big-tech glasses', weight: '69 g + 42 g band', optics: 'Waveguide; one eye (right), 20°',
      battery: 'Right arm', compute: 'On frame', controls: 'EMG wrist band, touch, voice', repair: 'Glued arm seam; opening it drops IPX4',
      cmf: 'Black or sand colorways', // brand-reviewed 2026-10-12
      urls: ['https://www.engadget.com/wearables/meta-ray-ban-display-review-chunky-frames-with-impressive-abilities-193127070', 'https://roadtovr.com/meta-ray-ban-display-reparability-is-predictably-bad-but-less-than-you-might-think'],
    },
    {
      product: 'Android XR prototypes', kind: 'Big-tech glasses', weight: 'n/f', optics: 'In-lens display, one or two eyes',
      battery: 'n/f', compute: 'Phone', controls: 'Stem touchpad, two buttons, voice', repair: 'n/f',
      cmf: 'n/f',
      urls: ['https://9to5google.com/2024/12/12/hands-on-android-xr-glasses/'],
    },
    {
      product: 'Apple Vision Pro', kind: 'Premium cue', weight: '600–650 g', optics: 'Micro-OLED, both eyes',
      battery: 'External pack, own cable', compute: 'On headset', controls: 'Eyes, hands, voice', repair: 'Swappable seal, bands, Rx inserts',
      cmf: 'Aluminum, glass, knit', // brand-reviewed 2026-10-12
      urls: ['https://www.uploadvr.com/apple-vision-pro-specs/', 'https://support.apple.com/en-gb/118475'],
    },
    {
      product: 'Kobo Clara Colour', kind: 'E-reader', weight: '~174 g', optics: 'E Ink, 300 ppi',
      battery: 'Internal, user-replaceable', compute: 'On device', controls: 'Touchscreen', repair: 'iFixit parts: display, battery, board, covers',
      cmf: 'n/f', // brand-reviewed 2026-10-12
      urls: ['https://help.kobo.com/hc/en-us/articles/21137184146071-Repair-your-Kobo-eReader', 'https://blog.the-ebook-reader.com/2024/05/20/kobo-clara-colour-review-with-video-demo/'],
    },
    {
      product: 'Spritz', kind: 'RSVP app', weight: 'n/a', optics: 'One word in a fixed box, one red focal letter',
      battery: 'n/a', compute: 'Phone', controls: 'Speed setting', repair: 'n/a',
      cmf: 'n/a',
      urls: ['https://www.scientificamerican.com/article/speed-reading-reborn-for-smartphones-smartwatches'],
    },
    {
      product: 'OrCam Read', kind: 'Assistive reader', weight: '44.5 g (older model)', optics: 'Camera, no display',
      battery: 'In device', compute: 'In device', controls: 'n/f', repair: 'n/f',
      cmf: 'n/f',
      urls: ['https://orcam.com/read'],
    },
  ] as readonly ResearchRow[],
};

export interface Move {
  readonly n: number;
  readonly move: Sourced;
  readonly taught: string;
  readonly url: string;
}

/** 5–8 design moves. Each names the product that taught it and links the source read. */
export const moves: readonly Move[] = [
  {
    n: 1,
    move: s('Publish the hardware, not only the code. Make the pod printable.', 'Brilliant Labs Frame: schematics, STL models and firmware on its hardware docs'),
    taught: 'Brilliant Labs Frame',
    url: 'https://docs.brilliant.xyz/frame/hardware',
  },
  {
    n: 2,
    move: s('Keep the frame to optics. Compute and power go in the pocket.', 'VITURE Pro: battery and compute in a pocket neckband; Even G1 runs compute on the phone'),
    taught: 'VITURE Pro, Even Realities G1',
    url: 'https://www.viture.com/academy/xr-glasses/pro-one-series',
  },
  {
    n: 3,
    move: s('Screws and gaskets, never glue. A battery you can lift out.', 'Meta Ray-Ban Display: glued arm seam, opening it drops IPX4; Vuzix M400 hot-swappable pack'),
    taught: 'Meta Ray-Ban Display, Vuzix M400',
    url: 'https://roadtovr.com/meta-ray-ban-display-reparability-is-predictably-bad-but-less-than-you-might-think',
  },
  {
    n: 4,
    move: s('A cable you can replace at the frame, not one molded in.', 'VITURE: magnetic pogo connector plus a USB-C cable'), // brand-reviewed 2026-10-12
    taught: 'VITURE One / Pro',
    url: 'https://www.viture.com/academy/xr-glasses/pro-one-series',
  },
  {
    n: 5,
    move: s('Name the repairable parts, and the ones that are not.', 'Kobo: authorized parts list (display, battery, board, covers) and named exclusions'), // brand-reviewed 2026-10-12
    taught: 'Kobo Clara Colour',
    url: 'https://help.kobo.com/hc/en-us/articles/21137184146071-Repair-your-Kobo-eReader',
  },
  {
    n: 6,
    move: s('Rewind is a first-class control, not a menu item.', 'Spritz coverage: a reading researcher quoted on the role of rereading'),
    taught: 'Spritz',
    url: 'https://www.scientificamerican.com/article/speed-reading-reborn-for-smartphones-smartwatches',
  },
  {
    n: 7,
    move: s('Titanium where it carries load: hinge and bridge.', 'VITURE Pro titanium hinges; Even G1 titanium temple tips'), // brand-reviewed 2026-10-12
    taught: 'VITURE Pro, Even Realities G1',
    url: 'https://www.evenrealities.com/g1',
  },
];

/* ------------------------------------------------------------------ anatomy figure */

export const anatomy = {
  nav: s('Anatomy', 'section index label'), // polished 2026-10-12 (was eyebrow)
  title: s('Every part, and who owns it.', 'shades.ts join.roles'), // brand-reviewed 2026-10-12
  lead: s('Switch between the planned prototype and Concept X. Parts that move light up.', 'figure behaviour'),
  fig: 'Fig 1',
  plateTitle: 'SHADES · Planned ↔ Concept X', // brand-reviewed 2026-10-12
  hint: 'Hover, focus or tap a part',
  rest: 'Pick a part',
  toggles: {
    layout: s('Layout', 'figure control'),
    planned: s('Planned', 'Notion prototype layout'),
    potential: s('Concept X', 'Concept X layout'),
    explode: s('Take apart', 'figure control'),
    assemble: s('Put together', 'figure control'),
    light: s('Play the light path', 'figure control'),
  },
  word: 'read',
  lightCaption: s('Light path: display daughterboard, microdisplay, beam splitter, curved combiner, eye.', 'Background 2026-09-28: bird-bath, "semi-reflective beam splitter", "curved optical element"'), // brand-reviewed 2026-10-12
  caption: s(
    'Not to scale. Every part carries its tag: PLANNED parts come from Notion, CANDIDATE parts are named but not chosen, CONCEPT and POTENTIAL parts are this proposal.',
    'tag key',
  ),
  partsSummary: s('Every part, both layouts', 'parts table disclosure'), // moved from page.tsx 2026-10-12, unchanged
  absent: s('Not in this layout', 'parts table: part absent'), // moved from page.tsx 2026-10-12, unchanged
  sourcePrefix: 'Source:', // moved from page.tsx 2026-10-12, unchanged
  noscript: s('Showing the Concept X layout. Turn on JavaScript to switch layouts and take it apart.', 'no-JS fallback'),
};

export interface PartSide {
  readonly tag: PartTag;
  readonly note: Sourced;
  readonly value?: Sourced;
}

export interface Part {
  readonly id: string;
  readonly name: string;
  readonly group: 'frame' | 'pod' | 'link' | 'controller';
  readonly owner: RoleId;
  readonly planned: PartSide | null;
  readonly potential: PartSide | null;
}

const P = (tag: PartTag, note: string, src: string, value?: Sourced): PartSide => ({ tag, note: s(note, src), value });

/** The figure's parts. `planned: null` = Concept X only; `potential: null` = removed in Concept X. */
export const PARTS: readonly Part[] = [
  {
    id: 'rim', name: 'Front frame', group: 'frame', owner: 'mech',
    planned: P('PLANNED', 'Holds both lenses and the optics.', 'Balance 2026-08-23: "Balance a 140mm to 148mm frame"', s('140–148 mm wide · TARGET', 'Balance 2026-08-23')),
    potential: P('CONCEPT', 'Matte black polymer. The pod clips to its right half.', 'Head Designer CMF brief 2026-10-12', s('Under 40–50 g system · TARGET', 'Focal 2026-09-28: "Less than 40-50 grams"')),
  },
  {
    id: 'lens', name: 'Lenses', group: 'frame', owner: 'mech', // brand-reviewed 2026-10-12
    planned: P('PLANNED', 'The world stays in view.', 'Background: "preserving a view of the surrounding environment"'),
    potential: P('PLANNED', 'Unchanged. The world stays in view.', 'Background 2026-09-28'),
  },
  {
    id: 'bridge', name: 'Bridge and nose pads', group: 'frame', owner: 'mech',
    planned: P('PLANNED', 'Mech-E row: Ergonomic Hinge & Nose-Bridge.', 'Mech-E rows (04-mech-e-and-timelines.md)', s('30 / 70 nose-to-ear · TARGET', 'Balance 2026-08-23')),
    potential: P('CONCEPT', 'Titanium bridge. Pads on standard push-in posts.', 'Concept X move 7; VITURE swappable nose pads', s('30 / 70 nose-to-ear · TARGET', 'Balance 2026-08-23')),
  },
  {
    id: 'hinge', name: 'Hinges', group: 'frame', owner: 'mech',
    planned: P('PLANNED', 'Mech-E row: Ergonomic Hinge & Nose-Bridge.', 'Mech-E rows (04-mech-e-and-timelines.md)'),
    potential: P('CONCEPT', 'Titanium knuckles, each on one standard screw.', 'Concept X move 7 (VITURE Pro titanium hinges)'),
  },
  {
    id: 'temple', name: 'Temples', group: 'frame', owner: 'mech',
    planned: P('PLANNED', 'Carry the cable to the ear.', 'Balance: "10mm to 15mm tether strain channel"'),
    potential: P('PLANNED', 'Unchanged in form. The cable now unplugs at the tip.', 'Balance 2026-08-23; Concept X move 4'),
  },
  {
    id: 'screws', name: 'Fasteners', group: 'frame', owner: 'mech',
    planned: null,
    potential: P('CONCEPT', 'One standard screw size across frame and controller.', 'Concept X move 3 (screws, never glue)'),
  },
  {
    id: 'pod', name: 'Optics housing', group: 'pod', owner: 'mech', // brand-reviewed 2026-10-12
    planned: P('PLANNED', 'Fixed-focus optical assembly, built into the frame.', 'Scope: glasses contain "the microdisplay, fixed-focus optical assembly"'),
    potential: P('CONCEPT', 'One swappable pod. Lifts off the frame whole.', 'Concept X move 1 (Brilliant Labs Frame open hardware)'),
  },
  {
    id: 'latch', name: 'Pod release', group: 'pod', owner: 'mech',
    planned: null,
    potential: P('CONCEPT', 'The one signal-red part. Press to free the pod.', 'Head Designer CMF brief: one signal-red detail'),
  },
  {
    id: 'display', name: 'Microdisplay', group: 'pod', owner: 'pcb',
    planned: P('PLANNED', 'Shows one word at a time.', 'Scope: "microdisplay"; FPGA-TL: "displays one word at a time"', s('640 × 480 · ESTIMATE', 'USB-C: "preliminarily estimated at 640 × 480"')),
    potential: P('PLANNED', 'Same part, now inside the pod.', 'Scope 2026-07-29', s('640 × 480 · ESTIMATE', 'USB-C 2026-09-23')),
  },
  {
    id: 'splitter', name: 'Beam splitter', group: 'pod', owner: 'mech',
    planned: P('PLANNED', 'Turns the display light toward the combiner.', 'Background: "semi-reflective beam splitter"'),
    potential: P('PLANNED', 'Same part, now inside the pod.', 'Background 2026-09-28'),
  },
  {
    id: 'combiner', name: 'Curved combiner', group: 'pod', owner: 'mech',
    planned: P('PLANNED', 'Sends the word back to the eye, fixed focus.', 'Background: "curved optical element"; Scope: "fixed-focus, monocular bird-bath"'),
    potential: P('PLANNED', 'Same part, now inside the pod.', 'Background 2026-09-28'),
  },
  {
    id: 'dispboard', name: 'Display daughterboard', group: 'pod', owner: 'pcb',
    planned: P('PLANNED', 'Display interface and power, in the right temple.', 'PCB-DB: Display Daughterboard (SHD-PCB-15.01, 16.01); Scope: "necessary interface electronics"'),
    potential: P('CONCEPT', 'Moves into the pod, so optics and board swap together.', 'Concept X move 1'),
  },
  {
    id: 'port', name: 'Temple connector', group: 'link', owner: 'pcb',
    planned: P('PLANNED', 'Cable fixed at the temple tip, in a strain channel.', 'Balance: "10mm to 15mm tether strain channel"', s('10–15 mm channel · TARGET', 'Balance 2026-08-23')),
    potential: P('POTENTIAL', 'A plug at the temple tip. USB-C is a Notion candidate.', 'Concept X move 4; USB-C page (CANDIDATE)'),
  },
  {
    id: 'cable', name: 'Cable', group: 'link', owner: 'pcb',
    planned: P('PLANNED', 'One cable carries power and data.', 'ConOps: "single physical tether cable" for "low-voltage power and serialized data"'),
    potential: P('POTENTIAL', 'Same single cable, detachable at both ends.', 'Concept X move 4 (VITURE)'),
  },
  {
    id: 'shell', name: 'Controller case', group: 'controller', owner: 'mech',
    planned: P('PLANNED', 'Pocket-sized; holds processing, power and controls.', 'Puck: "approximately 7 × 14 × 1 cm"; ConOps', s('70 × 140 × 10 mm · TARGET', 'Puck 2026-09-28')),
    potential: P('CONCEPT', 'Same envelope. Lid on four standard screws.', 'Concept X move 3', s('70 × 140 × 10 mm · TARGET', 'Puck 2026-09-28')),
  },
  {
    id: 'battery', name: 'Battery', group: 'controller', owner: 'pcb',
    planned: P('PLANNED', 'Held in retention cages inside the case.', 'Puck: "battery-retention cages"'),
    potential: P('POTENTIAL', 'A sled that slides out the end, no tools.', 'Concept X move 3 (Vuzix M400 hot-swap pack)'),
  },
  {
    id: 'carrier', name: 'Carrier / power board', group: 'controller', owner: 'pcb',
    planned: P('PLANNED', 'Power and battery temperature.', 'PCB-DB: Carrier / Power (SHD-PCB-19.01)'),
    potential: P('PLANNED', 'Same board, under the lid.', 'PCB-DB 2026-09-23'),
  },
  {
    id: 'proc', name: 'Processing board', group: 'controller', owner: 'pcb',
    planned: P('PLANNED', 'Boot flash, FPGA clock, JTAG.', 'PCB-DB: Processing Board (SHD-PCB-03.01, 05.01, 07.01)'),
    potential: P('PLANNED', 'Same board, reachable under the lid.', 'PCB-DB 2026-09-23'),
  },
  {
    id: 'fpga', name: 'FPGA', group: 'controller', owner: 'fpga',
    planned: P('CANDIDATE', 'Artix-7 XC7A100T named. Not selected.', 'FPGA-core: "Artix 7 XC7A100T-1CSG324C FPGA"; Matrix scores blank'),
    potential: P('CANDIDATE', 'Artix-7 XC7A100T named. Not selected.', 'FPGA-core 2026-10-07'),
  },
  {
    id: 'mcu', name: 'Microcontroller', group: 'controller', owner: 'fpga',
    planned: P('CANDIDATE', 'STM32-class. Reads the dial, talks to the FPGA.', 'SoC: "The STM32 can debounce and interpret the rotary encoder"'),
    potential: P('CANDIDATE', 'STM32-class. Reads the dial, talks to the FPGA.', 'SoC 2026-09-22'),
  },
  {
    id: 'ctrlboard', name: 'Control daughterboard', group: 'controller', owner: 'pcb',
    planned: P('PLANNED', 'The rotary encoder under the dial.', 'PCB-DB: Control Daughterboard (SHD-PCB-17.01)'),
    potential: P('PLANNED', 'Same board, under the dial.', 'PCB-DB 2026-09-23'),
  },
  {
    id: 'header', name: 'Expansion header', group: 'controller', owner: 'pcb',
    planned: null,
    potential: P('CONCEPT', 'Stretch boards plug in here: haptics, ambient light.', 'PCB-DB Optional Peripheral rows (STRETCH); Concept X move 1'),
  },
  {
    id: 'dial', name: 'Pace dial', group: 'controller', owner: 'product',
    planned: P('PLANNED', 'Sets words per minute.', 'ConOps: "physical rotary dial located on the compute puck" sets WPM', s('100–600 WPM, 25 steps · ESTIMATE', 'SoC: "A possible MVP range might be 100–600 WPM in 25-WPM steps"')),
    potential: P('PLANNED', 'Unchanged. Knurled, with a titanium index.', 'ConOps 2026-08-05', s('100–600 WPM, 25 steps · ESTIMATE', 'SoC 2026-09-22')),
  },
  {
    id: 'buttons', name: 'Play / pause, rewind', group: 'controller', owner: 'product', // brand-reviewed 2026-10-12
    planned: P('PLANNED', 'Two buttons, told apart by touch.', 'ConOps: play/pause and "Rewind" buttons; Puck: "distinguishable by touch"'),
    potential: P('PLANNED', 'Rewind gets the larger key.', 'ConOps 2026-08-05; Concept X move 6'),
  },
];

export const tagKey = {
  PLANNED: s('Planned in Notion', 'tag key'),
  CANDIDATE: s('Named in Notion, not selected', 'tag key'),
  CONCEPT: s('Concept X form decision', 'tag key'),
  POTENTIAL: s('A route Notion does not plan', 'tag key'),
} as const;

/* ------------------------------------------------------------------ planned vs potential */

export const compare = {
  nav: s('Planned vs Concept X', 'section index label'), // polished 2026-10-12 (was eyebrow "Planned vs potential")
  title: s('What moves, and why.', 'Concept X moves'),
  columns: ['Part', 'Planned (Notion)', 'Concept X', 'Why'] as const,
  rows: [
    { part: 'Optics', planned: s('Built into the frame. PLANNED.', 'Scope 2026-07-29'), potential: s('One swappable pod, red release. CONCEPT.', 'move 1'), why: s('Brilliant Labs Frame publishes its hardware.', 'move 1') },
    { part: 'Display board', planned: s('In the glasses. PLANNED.', 'PCB-DB; Scope'), potential: s('Inside the pod. CONCEPT.', 'move 1'), why: s('Optics and their board swap as one.', 'move 1') },
    { part: 'Cable', planned: s('One fixed tether, strain channel. PLANNED.', 'ConOps; Balance'), potential: s('Same cable, plugs at both ends. POTENTIAL.', 'move 4'), why: s('VITURE replaces its cable at the frame.', 'move 4') },
    { part: 'Battery', planned: s('Caged in the controller. PLANNED.', 'Puck 2026-09-28'), potential: s('A sled out the end. POTENTIAL.', 'move 3'), why: s('Vuzix M400 hot-swaps its pack.', 'move 3') },
    { part: 'Controller lid', planned: s('Closure not specified.', 'Puck 2026-09-28'), potential: s('Four standard screws. CONCEPT.', 'move 3'), why: s('Meta Ray-Ban Display shows the cost of glue.', 'move 3') },
    { part: 'Stretch boards', planned: s('Optional peripheral rows. PLANNED (Stretch).', 'PCB-DB'), potential: s('One expansion header. CONCEPT.', 'move 1'), why: s('Add a board without a new case.', 'PCB-DB Optional Peripheral') },
    { part: 'Hinge and bridge', planned: s('Mech-E row. PLANNED.', 'Mech-E rows'), potential: s('Titanium, on screws. CONCEPT.', 'move 7'), why: s('VITURE Pro uses titanium hinges.', 'move 7') },
  ],
  stays: s(
    'Stays as planned: one eye, see-through, fixed focus, bird-bath optics, an MCU plus an FPGA in the pocket, a dial with play/pause and rewind.',
    'Scope; Background; ConOps; SoC',
  ),
};

export const questions = {
  nav: s('Open questions', 'section index label'), // polished 2026-10-12 (was eyebrow)
  title: s('What we do not know yet.', 'honest list'),
  items: [
    s('Does a pod latch hold optical alignment as well as a fixed mount? The Focal page asks for ±0.5°.', 'Focal: "±0.5° of perpendicular alignment"'),
    s('Can a detachable pod stay under the 40–50 g system target, with its own housing?', 'Focal 2026-09-28'),
    s('A plug at the temple adds mass at the ear. Does that help or hurt the 30 / 70 balance?', 'Balance 2026-08-23'),
    s('Which connector? USB-C is a Notion candidate; a magnetic plug is not on any page.', 'USB-C 2026-09-23 (CANDIDATE)'),
    s('A sliding battery needs a safe latch and a temperature path. The carrier board tracks battery temperature.', 'PCB-DB SHD-PCB-19.01'),
    s('Controls on the frame or in the pocket? Scope and ConOps still disagree.', 'SUMMARY §3 row 26'),
  ],
};

export const join = {
  nav: s('Join', 'section index label'), // polished 2026-10-12
  headline: s('Join us', 'Head Designer brief 2026-10-12'),
  lead: s('Own a part of SHADES. Every part above names the team that owns it.', 'DIGITAL "own a part"; shades.ts join.roles'), // brand-reviewed 2026-10-12
};
