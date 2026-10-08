/**
 * SHADES concept page (complete revamp of V0.1): copy for the two review mockups, shades-a and shades-b.
 * Written once, before the mockups. Neither mockup edits this file or prints a string that is not here or in shades.ts.
 *
 * Facts come from two places only:
 *   1. ./shades.ts (the SHADES content file). Line numbers are cited in `sources` below.
 *   2. design-lab/shades-concept/DECISIONS.md (Head Designer, 2026-10-08). One new fact: "Display is see through."
 *
 * SHADES is a concept in planning and a research platform, not a medical device. Nothing here says built, tested,
 * worn or measured. No efficacy, speed or comprehension claim. No part, panel, chip part number, optics type, vendor or spec.
 * No personal names. No [confirm] tags.
 * Reviewed by brand-guardian 2026-10-08 (revisions applied). Head Designer sign-off pending.
 */
import { SHADES } from './shades';

export type ConceptStageId = 'idea' | 'form' | 'system' | 'optics' | 'view' | 'glasses';
export type MockupId = 'a' | 'b';

/* ------------------------------------------------------------------ hero (stage 0) */

export const hero = {
  /** The product name line. */
  h1: SHADES.name,
  /** One sentence. shades.ts hero.lead + lightPath.stages[5]. */
  promise: 'Glasses that show one word at a time, at one fixed point, where you already look.',
  /** Concept status label. Matches conceptLabels[0].tag (mockup A). Mockup B prints its own from conceptLabels. */
  status: 'Concept',
  /** The permanent boundary, verbatim. Printed at the hero foot in both mockups. */
  boundary: SHADES.boundaryShort,
  /** Reduced-motion / no-JS / screen-reader text. After shades.ts method.fixateLabel. */
  still: 'Illustrative: scattered dots converge on one fixed point, where one word appears.',
} as const;

/* ------------------------------------------------------------------ the six played stages */

export interface ConceptStage {
  readonly id: ConceptStageId;
  /** Stage tracker label, 1–2 words. */
  readonly label: string;
  /** Heading, 6 words or fewer, sentence case. */
  readonly title: string;
  /** One sentence, 16 words or fewer. */
  readonly caption: string;
  /** One sentence describing the figure. Used as aria text and for the reduced-motion and no-JS stills. */
  readonly still: string;
}

export const stages: readonly ConceptStage[] = [
  {
    id: 'idea',
    label: 'Idea',
    title: 'One word. One point.',
    caption: 'The words move and your eyes can stay: that is RSVP, rapid serial visual presentation.',
    still: 'Illustrative line drawing of the SHADES glasses, front view, drawn around the fixed point where one word appears.',
  },
  {
    id: 'form',
    label: 'Form',
    title: 'Still in planning.',
    caption: 'SHADES is a concept in planning, and its parts are not chosen yet.',
    still: 'Concept drawing, not a render: the whole glasses frame, with one word in the right lens.',
  },
  {
    id: 'system',
    label: 'System',
    title: 'What SHADES has to do.',
    caption: 'Word timing, control, display and optics make up the RSVP heads-up display.',
    still: 'Diagram, not a render: five functions, labelled frame, display, optics, word timing and control. Word timing and control are drawn off the frame.',
  },
  {
    id: 'optics',
    label: 'Optics',
    title: 'Shown to one eye.',
    caption: 'A small see-through display shows one word, and optics carry it to one eye.',
    still: 'Diagram, not a render: one lens, close, with one word held at a fixed point inside it.',
  },
  {
    id: 'view',
    label: 'View',
    title: 'The page stays in view.',
    caption: 'Each word lands where you already look, and the page stays visible behind it.',
    still: 'Illustrative view through the lens: a page of a book stays visible behind one word held at a fixed point.',
  },
  {
    id: 'glasses',
    label: 'Glasses',
    title: 'Seven phases to a prototype.',
    caption: 'The roadmap runs from basic FPGA operation to a wearable prototype.',
    still: 'Concept drawing, not a render: the whole glasses frame again, with one word small in the right lens.',
  },
];

/** Note on the "view" figure (PLAN.md §7). The scan-path note is SHADES.problem.figureNote, used verbatim. */
export const viewNote = 'Illustrative view';

/* ------------------------------------------------------------------ how the page says "concept" */

export interface ConceptLabel {
  readonly id: string;
  /** Short tag, 1–2 words. */
  readonly tag: string;
  /** One-line disclosure, shown under the stage tracker in every stage. */
  readonly disclosure: string;
  /** Which mockup shows this wording in place. `null` = listed in the mockup notes as an alternative only. */
  readonly usedBy: MockupId | null;
}

/** DECISIONS.md #4: no decision yet. Each mockup shows one in place and lists the others. */
export const conceptLabels: readonly ConceptLabel[] = [
  {
    id: 'concept',
    tag: 'Concept',
    disclosure: 'SHADES is in planning. Parts are not chosen yet.',
    usedBy: 'a',
  },
  {
    id: 'planning',
    tag: 'In planning',
    disclosure: 'A concept in planning. Parts are not chosen yet.',
    usedBy: 'b',
  },
  {
    id: 'diagram',
    tag: 'Concept drawing',
    disclosure: 'Diagram, not a render. Parts are not chosen yet.',
    usedBy: null,
  },
];

/* ------------------------------------------------------------------ "system" stage: functional groups */

export interface SystemGroup {
  readonly id: 'frame' | 'display' | 'optics' | 'timing' | 'control';
  readonly label: string;
  /** One line. A function, never a part. */
  readonly role: string;
  /**
   * true: a source places this on the glasses. false: no source says where it lives, so draw it off the frame.
   * The first build puts compute and power in an external controller (shades.ts scope.in).
   */
  readonly onFrame: boolean;
}

/** Five functions, each stated in shades.ts or DECISIONS.md. Text source and power are not among them. */
export const systemGroups: readonly SystemGroup[] = [
  { id: 'frame', label: 'Frame', role: 'Holds the lenses. It has to fit.', onFrame: true },
  { id: 'display', label: 'Display', role: 'Shows one word. It is see-through.', onFrame: true },
  { id: 'optics', label: 'Optics', role: 'Carry the word to one eye, at a fixed focus.', onFrame: true },
  { id: 'timing', label: 'Word timing', role: 'Gives every word its own time slot.', onFrame: false },
  { id: 'control', label: 'Control', role: 'You pause, resume, speed up or rewind.', onFrame: false },
];

/* ------------------------------------------------------------------ the book: words typeset live over the photograph */

/**
 * Original prose written for this page (44 words). Not quoted from any book. It describes ordinary page reading
 * and makes no claim about SHADES. Typeset live over the archived book photograph and streamed one word at a time.
 */
export const bookWords: readonly string[] = [
  'A', 'page', 'waits', 'for', 'you.',
  'Open', 'it', 'and', 'the', 'first', 'line', 'begins', 'at', 'the', 'left', 'edge.',
  'Each', 'word', 'hands', 'you', 'to', 'the', 'next.',
  'A', 'sentence', 'ends', 'and', 'another', 'starts', 'below', 'it.',
  'Turn', 'the', 'page', 'when', 'you', 'reach', 'the', 'corner.',
  'The', 'story', 'keeps', 'its', 'place.',
];

/** The single word held in the lens in the "view" stage. bookWords[heldWordIndex]. */
export const heldWordIndex = 17;
export const heldWord: string = bookWords[heldWordIndex];

/* ------------------------------------------------------------------ sources */

/**
 * Every factual claim above, mapped to its source. "shades.ts:N" is a line in ./shades.ts.
 * "DECISIONS #N" is a row in design-lab/shades-concept/DECISIONS.md (Head Designer, 2026-10-08).
 */
export const sources = {
  'hero.h1': 'shades.ts:46 name',
  'hero.promise': 'shades.ts:70 hero.lead; shades.ts:167 lightPath.stages[5] ("lands where you already look")',
  'hero.status': 'shades.ts:50 status ("Planning"); DECISIONS #6 ("still a planning-stage concept")',
  'hero.boundary': 'shades.ts:52 boundaryShort, verbatim',
  'hero.still': 'shades.ts:99 method.fixateLabel',
  'stages.idea': 'shades.ts:92 method.appleHeadline; shades.ts:104 reader.lead (RSVP name); shades.ts:97 method.appleLead',
  'stages.idea.still': 'shades.ts:72 hero.glassesLabel',
  'stages.form': 'shades.ts:50 status; shades.ts:132 lightPath.figureLabel ("Parts are not chosen yet"); DECISIONS #6',
  'stages.system': 'shades.ts:176 tracks.items[engineering] ("the RSVP heads-up display: word timing, control, display and optics")',
  'stages.optics': 'shades.ts:155 and 161 lightPath.stages display, optics; shades.ts:227 highlights optics ("one eye, at a fixed focus"); DECISIONS #6 (see-through)',
  'stages.view': 'shades.ts:167 lightPath.stages[5]; DECISIONS #6 ("the page stays visible behind the word")',
  'stages.glasses': 'shades.ts:204 roadmap.headline; shades.ts:205 roadmap.lead; shades.ts:208 and 214 phases 1 and 7',
  'stages.*.still "not a render"': 'shades.ts:128 lightPath.note',
  'conceptLabels': 'shades.ts:50 status; shades.ts:128 lightPath.note; shades.ts:132 lightPath.figureLabel; DECISIONS #2 (book photograph), #4',
  'systemGroups.frame': 'shades.ts:237 join.roles[optics] ("Lenses and a frame that fits.")',
  'systemGroups.display': 'shades.ts:155 lightPath.stages[display]; DECISIONS #6 (see-through)',
  'systemGroups.optics': 'shades.ts:161 lightPath.stages[optics]; shades.ts:227 highlights optics',
  'systemGroups.timing': 'shades.ts:224 highlights timing; shades.ts:143 lightPath.stages[timing]',
  'systemGroups.control': 'shades.ts:149 lightPath.stages[control]; shades.ts:195 scope.in',
  'systemGroups.onFrame': 'shades.ts:72 hero.glassesLabel (word inside the lens); shades.ts:197 scope.in (external controller); placement of timing and control is not stated anywhere',
  'viewNote': 'design-lab/shades-concept/PLAN.md §7',
  'bookWords': 'Original prose for this page. No factual claim.',
} as const;
