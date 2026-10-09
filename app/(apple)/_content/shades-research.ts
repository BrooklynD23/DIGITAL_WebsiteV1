/**
 * SHADES round 2, approach 2: research platform (/projects/shades-research/). No pin, no diagrams.
 * Copy written before the build. The page prints only strings from this file, ./shades and ./shades-concept.
 * Facts: ./shades.ts (lines cited in `sources`) and design-lab/shades-concept/DECISIONS.md (#6).
 * The only research sentence on the page is SHADES.tracks.items[research].line, imported verbatim.
 * Never: "applications", "participants", "study" (outside that one line), "protocol", "research questions".
 * Reviewed by brand-guardian 2026-10-09 (revisions applied). Head Designer sign-off pending.
 */
import { SHADES } from './shades';
import { hero as conceptHero } from './shades-concept';

export interface ConceptLine {
  readonly id: 'a' | 'b';
  readonly text: string;
  readonly isDefault: boolean;
}

export interface BoundaryRow {
  readonly term: string;
  readonly detail: string;
}

/* ------------------------------------------------------------------ hero: stage and aim */

export const hero = {
  h1: conceptHero.h1,
  conceptLines: [
    { id: 'a', text: 'A concept in planning. A research platform, not a medical device.', isDefault: true },
    { id: 'b', text: `In planning. ${SHADES.boundaryShort}`, isDefault: false },
  ] as readonly ConceptLine[],
} as const;

/** One sentence. */
export const whatItIs = 'SHADES is a concept for glasses that show one word at a time, at one fixed point.';

/* ------------------------------------------------------------------ two tracks + boundary */

export const tracks = {
  title: SHADES.tracks.headline,
  items: SHADES.tracks.items,
} as const;

export const boundary = {
  title: 'What SHADES is, and is not.',
  rows: [
    { term: SHADES.labels.is, detail: SHADES.tracks.boundary.is },
    { term: SHADES.labels.isNot, detail: SHADES.tracks.boundary.isNot },
    { term: SHADES.labels.never, detail: SHADES.tracks.boundary.never },
  ] as readonly BoundaryRow[],
  line: SHADES.tracks.boundary.line,
} as const;

/* ------------------------------------------------------------------ first-build scope */

export const scope = {
  title: SHADES.scope.headline,
  intro: 'Five things are in. Five are left out.',
  inLabel: SHADES.scope.inLabel,
  outLabel: SHADES.scope.outLabel,
  in: SHADES.scope.in,
  out: SHADES.scope.out,
} as const;

/* ------------------------------------------------------------------ seats (after the description) */

export const seats = {
  title: SHADES.join.headline,
  intro: 'Five seats, from FPGA timing to the medical-research track.',
  roles: SHADES.join.roles,
  action: SHADES.join.action,
  discord: SHADES.join.discord,
} as const;

/* ------------------------------------------------------------------ roadmap */

export const roadmap = {
  title: SHADES.roadmap.headline,
  intro: SHADES.roadmap.lead,
  note: SHADES.roadmap.note,
  phases: SHADES.roadmap.phases,
} as const;

/* ------------------------------------------------------------------ sources (new strings only) */

export const sources = {
  'hero.conceptLines.a': 'shades.ts:51 status ("Planning"); DECISIONS #6 ("planning-stage concept"); shades.ts:53 boundaryShort',
  'hero.conceptLines.b': 'shades.ts:51 status; shades.ts:53 boundaryShort (verbatim)',
  whatItIs: 'shades.ts:71 hero.lead; DECISIONS #6 ("concept")',
  'boundary.title': 'shades.ts:67 labels.is / isNot; shades.ts:180-184 tracks.boundary',
  'scope.intro': 'shades.ts:193-200 scope.in (6 items); shades.ts:201 scope.out (5 items)',
  'seats.intro': 'shades.ts:236-242 join.roles (5 roles; first fpga "SoC and FPGA", last research "The medical-research track.")',
} as const;
