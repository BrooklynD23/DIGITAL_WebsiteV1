/**
 * About page copy (Apple system). Sources: DESIGN.md §3 (what DIGITAL is, the four beliefs), ./home (stages,
 * channels), lib/data/about.ts (the acronym). Nothing here states a number, a person, a partner or an outcome.
 */
import { acronymPillars } from '@/lib/data/about';
import { PAGES, href } from '../_chrome/routes';
import type { Row } from '../_site/LinkRows';
import { channels, highlights, stages } from './home';

/** lib/data/about.ts describes "Device" as the phone only. SIDEKICK is now one of three builds, so the line is widened here. */
const DEVICE_LINE = 'The build itself. A thing someone holds, uses and carries.';

export const ABOUT = {
  meta: {
    title: 'About · DIGITAL',
    description: 'DIGITAL is a student-run venture studio at Cal Poly Pomona. Mixed-discipline teams take one part of a real build and own it.',
  },
  hero: {
    title: 'A studio run by students.',
    lead: 'Mixed-discipline teams at Cal Poly Pomona. Each member takes one part of a real build and owns it.',
  },
  beliefs: {
    title: 'What we believe',
    /** DESIGN.md §3, verbatim. */
    items: [
      'Ideas aren’t accomplishments. Making them real is.',
      'The problem picks the team.',
      'Reality grades the work.',
      'Sign your work.',
    ],
  },
  how: {
    title: 'How a build runs',
    /** home.ts highlights, "One cycle". */
    lead: highlights.find((h) => h.id === 'stages')?.caption ?? '',
    stages,
  },
  builds: {
    title: 'Three builds',
    rows: channels.map((c): Row => ({
      label: PAGES.find((p) => p.id === c.id)?.label ?? c.name,
      meta: c.line,
      note: c.status,
      href: href('apple', c.id),
    })),
  },
  name: {
    title: 'What the name stands for',
    rows: acronymPillars.map((p, i) => ({
      key: `${p.word}-${i}`,
      label: p.word,
      value: p.word === 'Device' ? DEVICE_LINE : p.description,
    })),
  },
  more: {
    title: 'Where to go next',
    rows: [
      { label: 'Team', meta: 'The officer seats and project leads.', href: '/team/' },
      { label: 'Community', meta: 'Discord, LinkedIn and the SIDEKICK repository.', href: '/community/' },
      { label: 'Get involved', meta: 'Paths for students, alumni and companies.', href: '/get-involved/' },
    ] as readonly Row[],
  },
} as const;
