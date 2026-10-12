/**
 * SHADES round 2, approach 1: product reveal (/projects/shades-reveal/).
 * 2026-10-12 (Head Designer): problem and approach beats, milestones, disclaimer, render caption; FAQ removed.
 * Head Designer choice 2026-10-09: this page, with the "Hold still" slider (./shades-control) as the view beat,
 * the research hero line and the Is / Is not / Never table (./shades-research) folded in.
 * Copy written before the build. The page prints only strings from this file, ./shades, ./shades-concept,
 * ./shades-control and ./shades-research. The full name expansion is dropped (Head Designer): never print it.
 * Facts: ./shades.ts (lines cited in `sources`) and design-lab/shades-concept/DECISIONS.md (#6 see-through, #7 tethered).
 * Concept in planning. Research platform, not a medical device. No availability, dates, prices or part names.
 * Reviewed by brand-guardian 2026-10-09 (revisions applied). 2026-10-09 merge strings: reviewed by brand-guardian 2026-10-09.
 */
import { SHADES } from './shades';
import { hero as conceptHero, stages, systemGroups, viewNote, type SystemGroup } from './shades-concept';
import { control } from './shades-control';
import { hero as researchHero } from './shades-research';

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

/* ------------------------------------------------------------------ the problem and the approach: two beats (Head Designer, 2026-10-12) */

export interface Beat {
  readonly title: string;
  readonly lines: readonly string[];
}

export const problem: Beat = {
  title: 'The problem.',
  lines: [
    // src: design-lab/shades-concept/research/notion/01-product-definition.md, section 2 "Goal / purpose" ("the construction of meaning"); Head Designer 2026-10-12
    'Reading means building meaning.',
    // src: Notion "Background, & Project Solution | SHADES" (https://app.notion.com/p/3ab169473d778029a38ed4957c453ed2, 2026-09-28): "For individuals with dyslexia…", "the reader remains responsible for locating it, moving through it, regulating its pace, and recovering context"; re-fetched by the orchestrator 2026-10-09
    'For readers with dyslexia, a page asks for more: find each word, keep the pace, recover lost context.',
    // src: same Background page: "Most existing reading accommodations attempt to make this process more manageable by changing the appearance of the page … they preserve the same underlying method of interaction"
    'Most reading aids change how the page looks. How the text arrives stays the same.',
  ],
};

export const approach: Beat = {
  title: 'How SHADES approaches it.',
  lines: [
    // src: shades-concept.ts stages[0] caption ("The words move and your eyes can stay: that is RSVP"); Head Designer 2026-10-12
    'The words come to the reader.',
    // src: notion/SUMMARY.md section 2 "Words or phrases" (ConOps: "one word or short phrase at a time"; Scope: "fixed display region"); Head Designer 2026-10-12
    'They appear one word or short phrase at a time, at one fixed point.',
    // src: notion/SUMMARY.md section 2 "Controller" and Scope (pause, resume, speed, rewind); shades.ts:71 hero.lead ("at the pace you set"); Head Designer 2026-10-12
    'The reader sets the pace, and can pause, rewind and resume.',
  ],
};

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

/** Replaces the view beat (Head Designer, 2026-10-12): the page shows the planned object only; detail lives on Concept X. Brand-reviewed 2026-10-12. */
export const deeper = {
  title: 'Go deeper.',
  line: 'Every part, its source, and a concept for what SHADES could become.',
  link: { label: 'See Concept X', href: '/projects/shades-concept-x/' },
} as const;

/* ------------------------------------------------------------------ closing: roadmap + seats */

export const closing = {
  title: stages[5].title,
  intro: stages[5].caption,
  note: SHADES.roadmap.note,
  phases: SHADES.roadmap.phases,
  join: SHADES.join,
} as const;

/* ------------------------------------------------------------------ this page only (Head Designer, 2026-10-12) */

/** Milestones timeline on /projects/shades-reveal/. The closing export above stays for the other SHADES routes. */
export const milestones = {
  // src: Head Designer 2026-10-12 (replaces "Seven phases to a prototype." on this page)
  title: 'Project milestones.',
  // src: shades-concept.ts stages[5] caption; notion/SUMMARY.md section 2 "Roadmap" (FPGA-TL: seven checkpoints, 7 "Wearable Prototype"); Head Designer 2026-10-12
  intro: 'Seven milestones on the FPGA team’s plan, from basic FPGA operation to a wearable prototype.',
  phases: SHADES.roadmap.phases,
} as const;

// src: Head Designer 2026-10-12 (replaces "Concept render. Not a built device." under both figures on this page); purpose: notion/01-product-definition.md section 1 ("an assistive reading tool for individuals with dyslexia")
export const renderCaption = 'Research concept for readers with dyslexia.';

// src: Head Designer 2026-10-12; student framing: notion/05-context.md ("Biomedical Engineering project of DIGITAL Technologies @ Cal Poly Pomona"); no treatment: notion/01-product-definition.md section 3 Scope ("not intended to produce ... a clinically validated treatment for dyslexia")
export const disclaimer = {
  text: 'SHADES and Concept X are student research. Neither is designed for medical treatment.',
} as const;

/* ------------------------------------------------------------------ sources (new strings only) */

export const sources = {
  'hero.conceptLines.a': 'Imported from shades-research hero.conceptLines[0] (its sources: shades.ts:51 status; DECISIONS #6; shades.ts:53 boundaryShort)',
  'hero.conceptLines.b': 'Former default. shades.ts:51 status ("Planning"); shades.ts:56 meta.description ("RSVP reading glasses"); DECISIONS #6 ("planning-stage concept")',
  'boxCaption.a': 'shades.ts:199 scope.in ("A pocket-sized controller for compute and power, on one cable to the glasses"); DECISIONS #7 ("no software will be run on it", "external controller box")',
  'boxCaption.b': 'shades.ts:199 scope.in ("A pocket-sized controller"); DECISIONS #7 ("We connect it externally as wired-up", "no software will be run on it")',
  'view.title / view.caption': 'Reused from shades-concept stages[view] (its sources: shades.ts:168; DECISIONS #6)',
  'view.label / steps / lineText / pageWords / heldWord / simulationNote': 'Imported from shades-control control.* (sources listed in shades-control.ts)',
  'hero.renderCaption': 'PLAN-R2.md "Revisions after the Fable plan audit", image waiver (verbatim)',
  'anatomy.beats.frame': 'shades.ts:239 join.roles[mech] ("The frame, the optics mounts and the controller case."); shades-concept systemGroups.frame',
  'anatomy.beats.display': 'shades.ts:156 lightPath.stages[display]; DECISIONS #6 (see-through)',
  'anatomy.beats.optics': 'shades.ts:162 lightPath.stages[optics]; shades.ts:229 highlights optics ("one eye, at a fixed focus")',
  'anatomy.beats.timing': 'shades.ts:226 highlights timing ("its own time slot"); shades.ts:144 lightPath.stages[control]',
} as const;
