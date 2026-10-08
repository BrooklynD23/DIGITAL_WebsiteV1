import type { Slug } from './concepts';

/**
 * /design-lab/components rows (ORIGINAL_PROMPT §38). Crops are cut from renders/<x>/v2/<x>-desktop.png (1440 wide)
 * at y-ranges measured in the live DOM by design-lab/scripts/gallery-crops.mjs (boxes: design-lab/comparison/crops/regions.json).
 * `href` is the anchor on the concept route that shows the same block.
 */
export interface Cell {
  readonly href: string;
  readonly w: number;
  readonly h: number;
  readonly note: string;
}

export interface Row {
  readonly key: 'nav' | 'hero' | 'project' | 'cta' | 'type';
  readonly label: string;
  readonly what: string;
  readonly cells: Readonly<Record<Slug, Cell>>;
}

export const ROWS: readonly Row[] = [
  {
    key: 'nav',
    label: 'Navigation',
    what: 'Desktop bar at 1440, cut in two halves (left over right) so it stays legible. Mobile behaviour in the note.',
    cells: {
      a: { href: '/design-lab/a/', w: 720, h: 150, note: 'Masthead over a double rule; not sticky. Phones keep wordmark + 3 links.' },
      b: { href: '/design-lab/b/', w: 720, h: 112, note: 'Sticky 56 px, numbered anchors. Under 900 px: “Index” disclosure.' },
      c: { href: '/design-lab/c/', w: 720, h: 112, note: 'Sticky 56 px solid bar. Under 760 px: “Menu” disclosure.' },
      d: { href: '/design-lab/d/', w: 720, h: 130, note: 'Sticky 64 px; CTA “Come Thursday”. Under 960 px: “Contents” index card.' },
      e: { href: '/design-lab/e/', w: 720, h: 122, note: 'Sticky, with build-night meta. Mobile: wordmark + CTA + menu disclosure.' },
      f: { href: '/design-lab/f/#sign', w: 720, h: 114, note: 'Site strip plus binder tabs (right edge ≥1100 px, bottom bar below); tabs are outside this crop.' },
    },
  },
  {
    key: 'hero',
    label: 'Hero',
    what: 'The hero block below the nav, up to 1,000 px tall.',
    cells: {
      a: { href: '/design-lab/a/', w: 960, h: 666, note: 'Thesis as a poster, red signature rule, contents list, Fig. 1 stack.' },
      b: { href: '/design-lab/b/', w: 960, h: 666, note: 'Fig. 1 interface map computed from the phone data.' },
      c: { href: '/design-lab/c/', w: 960, h: 666, note: 'WebGL particle formation with a “Pick a build” picker (still frame).' },
      d: { href: '/design-lab/d/', w: 960, h: 538, note: 'Pencil-underlined thesis, [placeholder] room print, BUILT BY tag.' },
      e: { href: '/design-lab/e/', w: 960, h: 578, note: 'The build ledger is the hero artifact.' },
      f: { href: '/design-lab/f/#sign', w: 960, h: 420, note: 'Name tag input set inside the headline.' },
    },
  },
  {
    key: 'project',
    label: 'Project card',
    what: 'The first project record (DG-001), up to 1,300 px tall.',
    cells: {
      a: { href: '/design-lab/a/#dg-001', w: 960, h: 918, note: 'Feature with byline, drop cap and a build-record sidebar.' },
      b: { href: '/design-lab/b/#dg-001', w: 960, h: 616, note: 'Dark record strip, field list, subsystem register.' },
      c: { href: '/design-lab/c/#c-dg-001', w: 960, h: 838, note: 'Dot drawing plate + field list; unknowns say “No signal”.' },
      d: { href: '/design-lab/d/#dg001-h', w: 960, h: 574, note: 'Pencil ownership stack beside a portfolio record.' },
      e: { href: '/design-lab/e/#case-dg-001', w: 960, h: 928, note: 'Case-study template; crop is the first 1,300 of 4,154 px.' },
      f: { href: '/design-lab/f/#bench', w: 709, h: 1208, note: 'Sheet on the cutting mat with BUILT BY seat rows.' },
    },
  },
  {
    key: 'cta',
    label: 'Call to action',
    what: 'The join section, up to 1,000 px tall.',
    cells: {
      a: { href: '/design-lab/a/#join', w: 960, h: 478, note: '“Thursday, 6:00 PM.” at poster size, 3 steps, one filled CTA.' },
      b: { href: '/design-lab/b/#join', w: 960, h: 666, note: 'Build × discipline matrix, 3 steps, seat register.' },
      c: { href: '/design-lab/c/#join', w: 960, h: 452, note: '3 numbered steps on graphite, one solder-red CTA.' },
      d: { href: '/design-lab/d/#join', w: 960, h: 636, note: 'Night band; CTA names the seat you picked; sign-up sheet.' },
      e: { href: '/design-lab/e/#join', w: 960, h: 506, note: 'Draft ledger row form (works without JS).' },
      f: { href: '/design-lab/f/#thursday', w: 960, h: 572, note: '4 steps; step 1 reacts to your tag.' },
    },
  },
  {
    key: 'type',
    label: 'Typography',
    what: 'A section heading with the text that follows it, as set on the page.',
    cells: {
      a: { href: '/design-lab/a/#fit', w: 960, h: 466, note: 'Zodiak 400 · Switzer · JetBrains Mono.' },
      b: { href: '/design-lab/b/#process', w: 960, h: 414, note: 'IBM Plex Sans Condensed caps · Plex Sans · Plex Mono.' },
      c: { href: '/design-lab/c/#work', w: 960, h: 150, note: 'Clash Display 600 · General Sans · Martian Mono.' },
      d: { href: '/design-lab/d/#work', w: 752, h: 258, note: 'Fraunces (SOFT, WONK) · Figtree · Plex Mono.' },
      e: { href: '/design-lab/e/#cases', w: 960, h: 154, note: 'Cabinet Grotesk 800 · Satoshi · JetBrains Mono.' },
      f: { href: '/design-lab/f/#bench', w: 960, h: 156, note: 'Bricolage Grotesque 800 condensed · Departure Mono.' },
    },
  },
];
