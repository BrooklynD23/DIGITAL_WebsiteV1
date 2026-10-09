/**
 * SHADES round 2, approach 1: product reveal (/projects/shades-reveal/). Includes the merged "Is this real?" block.
 * Copy written before the build. The page prints only strings from this file, ./shades and ./shades-concept.
 * Facts: ./shades.ts (lines cited in `sources`) and design-lab/shades-concept/DECISIONS.md (#6: display is see-through).
 * Concept in planning. Research platform, not a medical device. No availability, dates, prices or part names.
 * Reviewed by brand-guardian 2026-10-09 (revisions applied). Head Designer sign-off pending.
 */
import { SHADES } from './shades';
import { conceptLabels, hero as conceptHero, stages, systemGroups, viewNote, type SystemGroup } from './shades-concept';

export interface ConceptLine {
  readonly id: 'a' | 'b';
  readonly text: string;
  readonly isDefault: boolean;
}

/* ------------------------------------------------------------------ hero */

export const hero = {
  h1: conceptHero.h1,
  /** First line under the h1. States the concept status plainly. */
  conceptLines: [
    { id: 'a', text: 'A concept for reading glasses, in planning.', isDefault: true },
    { id: 'b', text: conceptLabels[1].disclosure, isDefault: false },
  ] as readonly ConceptLine[],
  renderCaption: 'Concept render. Not a built device.',
} as const;

/* ------------------------------------------------------------------ what SHADES is: three declaratives */

export const whatItIs: readonly string[] = [
  SHADES.hero.lead,
  SHADES.boundaryShort,
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

/* ------------------------------------------------------------------ the view through the lens */

export const view = {
  title: stages[4].title,
  caption: stages[4].caption,
  figureLabel: viewNote,
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
      a: `No. SHADES is a research platform, not a medical device and not a treatment. ${SHADES.tracks.boundary.line}`,
    },
    {
      q: 'What does the first build leave out?',
      a: 'The first build leaves out wireless, camera or text recognition, AI pacing, eye tracking and standalone use.',
    },
  ] as readonly FaqItem[],
} as const;

/* ------------------------------------------------------------------ sources (new strings only) */

export const sources = {
  'hero.conceptLines.a': 'shades.ts:50 status ("Planning"); shades.ts:55 meta.description ("RSVP reading glasses"); DECISIONS #6 ("planning-stage concept")',
  'hero.renderCaption': 'PLAN-R2.md "Revisions after the Fable plan audit", image waiver (verbatim)',
  'anatomy.beats.frame': 'shades.ts:237 join.roles[optics] ("Lenses and a frame that fits."); shades-concept systemGroups.frame',
  'anatomy.beats.display': 'shades.ts:155 lightPath.stages[display]; DECISIONS #6 (see-through)',
  'anatomy.beats.optics': 'shades.ts:161 lightPath.stages[optics]; shades.ts:227 highlights optics ("one eye, at a fixed focus")',
  'anatomy.beats.timing': 'shades.ts:224 highlights timing ("its own time slot"); shades.ts:149 lightPath.stages[control]',
  'faq.heading': 'PLAN-R2.md revisions table, approach 4 merged into 1 ("Is this real?" block)',
  'faq.items[0]': 'shades.ts:50 status ("Planning"); shades.ts:132 lightPath.figureLabel ("Parts are not chosen yet")',
  'faq.items[1]': 'shades.ts:204 roadmap.headline (seven phases); shades.ts:206 roadmap.note; shades.ts:132 ("unconfirmed by the club")',
  'faq.items[2]': 'shades.ts:52 boundaryShort; shades.ts:180-181 tracks.boundary.is / isNot; shades.ts:183 tracks.boundary.line (verbatim)',
  'faq.items[3]': 'shades.ts:199 scope.out (all five items); shades.ts:189 scope.headline ("the first build")',
} as const;
