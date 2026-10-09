/**
 * SHADES round 2, approach 1: product reveal (/projects/shades-reveal/). Includes the merged "Is this real?" block.
 * Head Designer choice 2026-10-09: this page, with the "Hold still" slider (./shades-control) as the view beat,
 * the research hero line and the Is / Is not / Never table (./shades-research) folded in.
 * Copy written before the build. The page prints only strings from this file, ./shades, ./shades-concept,
 * ./shades-control and ./shades-research. The full name expansion is dropped (Head Designer): never print it.
 * Facts: ./shades.ts (lines cited in `sources`) and design-lab/shades-concept/DECISIONS.md (#6 see-through, #7 tethered).
 * Concept in planning. Research platform, not a medical device. No availability, dates, prices or part names.
 * Reviewed by brand-guardian 2026-10-09 (revisions applied). 2026-10-09 merge strings: reviewed by brand-guardian 2026-10-09.
 */
import { SHADES } from './shades';
import { conceptLabels, hero as conceptHero, stages, systemGroups, viewNote, type SystemGroup } from './shades-concept';
import { control } from './shades-control';
import { boundary as researchBoundary, hero as researchHero } from './shades-research';

export interface ConceptLine {
  readonly id: 'a' | 'b';
  readonly text: string;
  readonly isDefault: boolean;
}

/* ------------------------------------------------------------------ hero */

export const hero = {
  h1: conceptHero.h1,
  /** First line under the h1. Default: the research page's two-sentence line. Alternative: the earlier reveal line. */
  conceptLines: [
    { id: 'a', text: researchHero.conceptLines[0].text, isDefault: true },
    { id: 'b', text: 'A concept for reading glasses, in planning.', isDefault: false },
  ] as readonly ConceptLine[],
  renderCaption: 'Concept render. Not a built device.',
} as const;

/* ------------------------------------------------------------------ object figures: the controller box and cable */

/** One caption, 12 words or fewer, under the tethered glasses (DECISIONS #7). */
export const boxCaption = {
  options: [
    { id: 'a', text: 'Compute and power sit in the box. The glasses run no software.', isDefault: true },
    { id: 'b', text: 'Wired to an external controller. No software runs on the glasses.', isDefault: false },
  ] as readonly ConceptLine[],
} as const;

/* ------------------------------------------------------------------ what SHADES is: three declaratives */

export const whatItIs: readonly string[] = [
  SHADES.hero.lead,
  conceptLabels[0].disclosure,
];

/* ------------------------------------------------------------------ anatomy (one pin, 4 beats) */

export interface AnatomyBeat {
  readonly id: 'frame' | 'display' | 'optics' | 'timing';
  /** Groups lit in this beat. Labels and roles come from systemGroups. */
  readonly groups: readonly SystemGroup['id'][];
  readonly title: string;
  /** One sentence, 16 words or fewer. */
  readonly caption: string;
}

export const anatomy = {
  groups: systemGroups,
  beats: [
    { id: 'frame', groups: ['frame'], title: 'Lenses and a frame.', caption: 'The frame holds the lenses, and it has to fit.' },
    { id: 'display', groups: ['display'], title: 'A see-through display.', caption: 'A small see-through display shows one word.' },
    { id: 'optics', groups: ['optics'], title: stages[3].title, caption: 'Optics carry the word to one eye, at a fixed focus.' },
    {
      id: 'timing',
      groups: ['timing', 'control'],
      title: 'Word timing and control.',
      caption: 'Every word gets its own time slot, and you pause, resume, speed up or rewind.',
    },
  ] as readonly AnatomyBeat[],
} as const;

/* ------------------------------------------------------------------ the view beat: "Hold still" slider */

/** Merged view beat. Title and lead reuse stages[view]; every slider string is imported from ./shades-control. */
export const view = {
  title: stages[4].title,
  caption: stages[4].caption,
  /** Kept for the current page.tsx figcaption. The slider figure prints simulationNote instead. */
  figureLabel: viewNote,
  label: control.label,
  steps: control.steps,
  lineText: control.lineText,
  pageWords: control.pageWords,
  heldWord: control.heldWord,
  simulationNote: control.simulationNote,
} as const;

/* ------------------------------------------------------------------ closing: roadmap + seats */

export const closing = {
  title: stages[5].title,
  intro: stages[5].caption,
  note: SHADES.roadmap.note,
  phases: SHADES.roadmap.phases,
  join: SHADES.join,
} as const;

/* ------------------------------------------------------------------ Is this real? (max 4) */

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

export const faq = {
  heading: 'Is this real?',
  items: [
    { q: 'Is SHADES a built device?', a: 'No. SHADES is a concept in planning, and its parts are not chosen yet.' },
    { q: 'What phase is SHADES in?', a: 'The club has not yet confirmed which of the seven phases is current.' },
    {
      q: 'Is SHADES a medical device?',
      a: `No. ${SHADES.tracks.boundary.line}`,
    },
    {
      q: 'What does the first build leave out?',
      a: 'The first build leaves out wireless, camera or text recognition, AI pacing, eye tracking and standalone use.',
    },
  ] as readonly FaqItem[],
} as const;

/** Is / Is not / Never rows, printed inside the answer to faq.items[2] ("Is SHADES a medical device?"). */
export const boundaryTable = {
  rows: researchBoundary.rows,
} as const;

/* ------------------------------------------------------------------ sources (new strings only) */

export const sources = {
  'hero.conceptLines.a': 'Imported from shades-research hero.conceptLines[0] (its sources: shades.ts:51 status; DECISIONS #6; shades.ts:53 boundaryShort)',
  'hero.conceptLines.b': 'Former default. shades.ts:51 status ("Planning"); shades.ts:56 meta.description ("RSVP reading glasses"); DECISIONS #6 ("planning-stage concept")',
  'boxCaption.a': 'shades.ts:199 scope.in ("A pocket-sized controller for compute and power, on one cable to the glasses"); DECISIONS #7 ("no software will be run on it", "external controller box")',
  'boxCaption.b': 'shades.ts:199 scope.in ("A pocket-sized controller"); DECISIONS #7 ("We connect it externally as wired-up", "no software will be run on it")',
  'view.title / view.caption': 'Reused from shades-concept stages[view] (its sources: shades.ts:168; DECISIONS #6)',
  'view.label / steps / lineText / pageWords / heldWord / simulationNote': 'Imported from shades-control control.* (sources listed in shades-control.ts)',
  'boundaryTable.rows': 'Imported from shades-research boundary.rows (shades.ts:67 labels; shades.ts:181-183 tracks.boundary)',
  'hero.renderCaption': 'PLAN-R2.md "Revisions after the Fable plan audit", image waiver (verbatim)',
  'anatomy.beats.frame': 'shades.ts:239 join.roles[mech] ("The frame, the optics mounts and the controller case."); shades-concept systemGroups.frame',
  'anatomy.beats.display': 'shades.ts:156 lightPath.stages[display]; DECISIONS #6 (see-through)',
  'anatomy.beats.optics': 'shades.ts:162 lightPath.stages[optics]; shades.ts:229 highlights optics ("one eye, at a fixed focus")',
  'anatomy.beats.timing': 'shades.ts:226 highlights timing ("its own time slot"); shades.ts:144 lightPath.stages[control]',
  'faq.heading': 'PLAN-R2.md revisions table, approach 4 merged into 1 ("Is this real?" block)',
  'faq.items[0]': 'shades.ts:51 status ("Planning"); shades.ts:133 lightPath.figureLabel ("Parts are not chosen yet")',
  'faq.items[1]': 'shades.ts:206 roadmap.headline (seven phases); shades.ts:208 roadmap.note; shades.ts:133 ("unconfirmed by the club")',
  'faq.items[2]': 'shades.ts:184 tracks.boundary.line (verbatim); table rows carry shades.ts:181-183',
  'faq.items[3]': 'shades.ts:201 scope.out (all five items); shades.ts:190 scope.headline ("the first build")',
} as const;
