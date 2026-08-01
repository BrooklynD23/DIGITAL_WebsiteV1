/**
 * Canonical purpose statement for DIGITAL @ Cal Poly Pomona.
 *
 * The strings below are copied VERBATIM from the approved mission copy in
 * `lib/data/homeLanding.ts`. This module is the single source of truth referenced by pages and by the
 * marketing skill at `.cursor/skills/digital-marketing/`. Do not reword these
 * strings here without following that skill's copy workflow (claims.md entry
 * + human sign-off).
 */

export interface PurposeBeat {
  readonly id: 'explore' | 'design' | 'build' | 'communicate';
  readonly label: string; // "WE EXPLORE"
  readonly line: string; // supporting sentence
}

/** One-line tagline — verbatim from LANDING_CONTENT.tagline. */
export const MISSION_TAGLINE =
  'Students building real technology, one module at a time.' as const;

/** Mission beats — verbatim from LANDING_CONTENT.mission. */
export const MISSION_BEATS: readonly PurposeBeat[] = [
  {
    id: 'explore',
    label: 'WE EXPLORE',
    line: 'Real constraints, real trade-offs — we test the theory against how things actually work.',
  },
  {
    id: 'design',
    label: 'WE DESIGN',
    line: 'Hardware, software, mechanical, business — every discipline has a seat.',
  },
  {
    id: 'build',
    label: 'WE BUILD',
    line: 'Every project is an education — you build the whole system, not just your slice of it.',
  },
  {
    id: 'communicate',
    label: 'WE COMMUNICATE',
    line: 'We scope the work, raise the funding, and pitch it like a business.',
  },
] as const;

/**
 * The canonical purpose statement, assembled verbatim from the tagline and
 * the four mission beats. In copy conflicts this string wins over
 * `homeLanding.ts`, which in turn wins over inline page copy.
 */
export const PURPOSE_STATEMENT: string = [
  MISSION_TAGLINE,
  ...MISSION_BEATS.map((beat) => `${beat.label}: ${beat.line}`),
].join('\n');
