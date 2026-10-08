/**
 * Get-involved page copy (Apple system). The paths and their /contact?type=… links come from
 * lib/data/involvement.ts (labels sentence-cased here); builds from ./home; meeting facts from _chrome/club.ts.
 * Option descriptions and meeting "perks" in the data are not rendered: several promise mentors, speakers or
 * hiring outcomes that no source backs.
 */
import { involvementCategories } from '@/lib/data/involvement';
import { MEETINGS } from '../_chrome/club';
import { PAGES, href } from '../_chrome/routes';
import type { Row } from '../_site/LinkRows';
import { channels } from './home';

const sentenceCase = (t: string): string => (t.charAt(0) + t.slice(1).toLowerCase()).replace(' & ', ' and ');

/** Rewritten where the data line is not sentence-shaped; otherwise the data subtitle is used as is. */
const LEADS: Readonly<Record<string, string>> = { alumni: 'Stay connected. Stay building.', companies: 'Meet the students while they build.' };

const paths = involvementCategories.map((c) => ({
  id: c.id,
  title: sentenceCase(c.title),
  lead: LEADS[c.id] ?? c.subtitle,
  rows: c.options.map((o): Row => ({ label: sentenceCase(o.title), href: o.link })),
}));

export const GET_INVOLVED = {
  meta: {
    title: 'Get involved · DIGITAL',
    description: 'Three ways in to DIGITAL at Cal Poly Pomona: students join a build, alumni stay building, companies back one.',
  },
  hero: {
    title: 'Three ways in.',
    lead: 'Students join a build. Alumni stay building. Companies back one.',
  },
  builds: {
    title: 'Builds',
    rows: channels.map((c): Row => ({
      label: PAGES.find((p) => p.id === c.id)?.label ?? c.name,
      meta: c.line,
      note: c.id === 'brain' ? MEETINGS.brain.when : MEETINGS.subteam.when,
      href: href('apple', c.id),
    })),
  },
  /** Heading over a path's /contact rows when the build rows sit above them. */
  ask: 'Write to the team',
  paths,
} as const;
