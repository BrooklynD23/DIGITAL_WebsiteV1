/**
 * SHADES round 2, approach 3: one signature control, the "Hold still" slider (/projects/shades-control/). No pin.
 * Copy written before the build. The page prints only strings from this file, ./shades and ./shades-concept.
 * Facts: ./shades.ts (lines cited in `sources`) and design-lab/shades-concept/DECISIONS.md (#6: see-through).
 * Step captions describe the illustrative figure, never the device. No speed, comfort or comprehension claim.
 * Reviewed by brand-guardian 2026-10-09 (revisions applied). Head Designer sign-off pending.
 */
import { SHADES } from './shades';
import { conceptLabels, hero as conceptHero, viewNote } from './shades-concept';

export interface ConceptLine {
  readonly id: 'a' | 'b';
  readonly text: string;
  readonly isDefault: boolean;
}

export type HoldStepId = 'page' | 'line' | 'phrase' | 'word' | 'hold';

export interface HoldStep {
  readonly id: HoldStepId;
  readonly name: 'Page' | 'Line' | 'Phrase' | 'Word' | 'Hold';
  /** One sentence, 16 words or fewer. Describes what the figure shows. */
  readonly caption: string;
}

/* ------------------------------------------------------------------ hero */

export const hero = {
  boundary: SHADES.boundaryShort,
  h1: conceptHero.h1,
  conceptLines: [
    { id: 'a', text: 'A concept in planning. Try the idea in your browser.', isDefault: true },
    { id: 'b', text: conceptLabels[1].disclosure, isDefault: false },
  ] as readonly ConceptLine[],
} as const;

/* ------------------------------------------------------------------ beat 1: the "Hold still" slider */

export const control = {
  title: SHADES.method.headline,
  lead: SHADES.method.appleLead,
  /** Accessible name of the native range input. */
  label: 'Hold still, from a full page to one held word',
  steps: [
    { id: 'page', name: 'Page', caption: 'Across a page, your eyes jump word to word and line to line.' },
    { id: 'line', name: 'Line', caption: 'Along one line, your eyes jump, stop, and sometimes jump back.' },
    { id: 'phrase', name: 'Phrase', caption: 'A few words stay in view, and the drawn jumps get shorter.' },
    { id: 'word', name: 'Word', caption: 'One word stays in view, and the drawn jumps shrink to almost nothing.' },
    { id: 'hold', name: 'Hold', caption: 'One word holds at one point, and your eyes can stay.' },
  ] as readonly HoldStep[],
  /** The typeset page for the Page step: the site's own sentences, not a quotation. */
  pageWords: SHADES.reader.words,
  /** The typeset line the slider acts on. */
  lineText: SHADES.problem.line,
  /** The word left holding at the Hold step. */
  heldWord: SHADES.method.oneWord,
  simulationNote: 'Simulation in your browser, not the device.',
} as const;

/* ------------------------------------------------------------------ beat 2: set the pace */

const { min, max } = SHADES.reader.wpm;

export const pace = {
  title: 'Set the pace.',
  caption: `Choose ${min} to ${max} words per minute, and nothing plays until you press Read.`,
  wpm: SHADES.reader.wpm,
  simulationNote: control.simulationNote,
} as const;

/* ------------------------------------------------------------------ beat 3: the glasses arrive with the held word */

export const glasses = {
  title: SHADES.method.appleHeadline,
  caption: 'Illustrative: the held word sits in a see-through display, shown to one eye.',
  figureLabel: viewNote,
} as const;

/* ------------------------------------------------------------------ sources (new strings only) */

export const sources = {
  'hero.conceptLines.a': 'shades.ts:50 status ("Planning"); DECISIONS #6 ("planning-stage concept"); reader demo runs in the browser (shades.ts:111 reader.label "RSVP reader demo")',
  'control.label': 'PLAN-R2.md revisions table, approach 3 ("Hold still" slider, Page → Hold); shades.ts:95 method.oneWord',
  'control.steps.page': 'shades.ts:77 problem.lead ("your eyes jump from word to word"); describes the illustrative figure',
  'control.steps.line': 'shades.ts:77 problem.lead ("Along a line ... stop, and sometimes jump back")',
  'control.steps.phrase': 'Describes the illustrative figure only (PLAN-R2.md:87 figure behaviour, not a fact source)',
  'control.steps.word': 'Describes the illustrative figure only (PLAN-R2.md:87 figure behaviour, not a fact source)',
  'hero.boundary': 'shades.ts:52 boundaryShort (verbatim)',
  'control.steps.hold': 'shades.ts:93 method.lead ("Your eyes can stay"); shades.ts:92 method.appleHeadline ("One word. One point.")',
  'control.simulationNote': 'PLAN-R2.md rule 4 (verbatim)',
  'pace.title': 'shades.ts:103 reader.headline (first sentence)',
  'pace.caption': 'shades.ts:110 reader.wpm min/max; shades.ts:104 reader.lead ("Nothing plays until you do"); shades.ts:113 controls.read',
  'glasses.caption': 'shades.ts:155 lightPath.stages[display]; shades.ts:161 lightPath.stages[optics] ("one eye"); DECISIONS #6 (see-through)',
} as const;
