/**
 * Updates directory data. UPDATES below is the fallback snapshot; source of truth is Supabase digital_posts
 * (read at build time by ./updates-source.ts; editor how-to in supabase/README.md). Field reference (any order; the page sorts newest first):
 *   slug         url-safe id, unique; a 'site' entry is served at /updates/<slug>/
 *   title        plain title
 *   type         one of UpdateType
 *   subTeam      one of UpdateSubTeam (SOON_TEAMS are labelled "Coming soon")
 *   detail?      sub-team area shown after the team, e.g. 'SoC'
 *   tags?        extra TagSlugs beyond the team tag (Supabase `digital_posts.tags`); shown as chips via tagsOf()
 *   publishedAt  ISO date, e.g. '2026-11-02' (LinkedIn dates are decoded from the post's activity ID)
 *   summary      one or two plain sentences in our own words, stated facts only (never copied from LinkedIn)
 *   authors      names exactly as posted; mentors listed separately and labelled "Mentor"; lead? likewise "Lead"
 *   coverImage?  { src, alt }  file in public/updates/, src like '/updates/<slug>.jpg'
 *   pdf?         { src, title }  file in public/papers/, src like '/papers/<slug>.pdf'
 *   source       'site' (own page from `page`) or 'linkedin' (opens externally)
 *   externalUrl  required when source is 'linkedin'; on a 'site' entry it is the "Read the post on LinkedIn" link
 * The newest entry (or filter hit) leads as a card, the next three follow as cards, then the full log; search appears from 6.
 * Personal names on Updates: Head Designer exception to BRAND.md "no personal names", 2026-11-12.
 */
export type UpdateType = 'paper' | 'milestone' | 'prototype' | 'achievement' | 'product-definition' | 'case-study';
export type UpdateSubTeam = 'SIDEKICK' | 'SHADES' | 'BRAIN' | 'TWINS' | 'DIGITAL Business';
export type TagSlug = 'digital' | 'sidekick' | 'shades' | 'brain' | 'twins' | 'business';

export interface UpdatePage {
  /** One-sentence standfirst under the title. */
  readonly dek: string;
  /** body: one paragraph, or several separated by a blank line ("\n\n"). */
  readonly sections: ReadonlyArray<{ readonly heading: string; readonly body: string; readonly flow?: readonly string[] }>;
}

interface UpdateBase {
  readonly slug: string;
  readonly title: string;
  readonly type: UpdateType;
  readonly subTeam: UpdateSubTeam;
  readonly detail?: string;
  readonly tags?: readonly TagSlug[];
  readonly publishedAt: string;
  readonly summary: string;
  readonly authors: readonly string[];
  readonly mentors: readonly string[];
  readonly lead?: string;
  readonly coverImage?: { readonly src: string; readonly alt: string };
  readonly pdf?: { readonly src: string; readonly title: string };
}
export type Update =
  | (UpdateBase & { readonly source: 'site'; readonly page: UpdatePage; readonly externalUrl?: string })
  | (UpdateBase & { readonly source: 'linkedin'; readonly externalUrl: string });

/** Fallback snapshot; source of truth is Supabase digital_posts. Served when SUPABASE_URL is unset. */
export const UPDATES: readonly Update[] = [
  {
    slug: 'vessel-product-definition',
    title: 'Product definition: VESSEL',
    type: 'product-definition',
    subTeam: 'TWINS',
    publishedAt: '2026-09-30',
    summary: 'A virtual factory that turns recycled aluminum into a smartphone enclosure, simulated from raw material to warehouse.',
    authors: ['Oscar Cao', 'Adrienne Alves', 'Russell Chung', 'Leilani Uson-H'],
    mentors: ['Russell Chung'],
    source: 'site',
    externalUrl:
      'https://www.linkedin.com/posts/twins-technical-workspace-for-industrial-net-logistics-simulations_product-definition-vessel-digital-cal-activity-7511111489567604737-dhNg',
    page: {
      dek: 'A virtual factory that turns recycled aluminum into a finished smartphone enclosure, simulated from raw material to warehouse.',
      sections: [
        {
          heading: 'What VESSEL is',
          body: 'VESSEL (Virtual Ecosystem for System Simulation & Enterprise Logistics) is a TWINS project. Students research, design and simulate an end-to-end manufacturing and supply-chain system with discrete-event simulation or digital-twin software.',
          flow: ['Material recovery', 'Processing', 'Annealing', 'Fabrication', 'Finishing', 'Inspection', 'Packaging', 'Warehouse'],
        },
        {
          heading: 'The engineering goal',
          body: "Turn each stage of that value stream into a working simulation. Students define operating parameters such as equipment capacity, cycle time, setup time, labor, energy use, material flow, defect rates, maintenance, inspection, inventory policy, packaging and transport limits. The model produces synthetic production data like a real factory's.",
        },
        {
          heading: 'Why it is different',
          body: 'Most projects study manufacturing, quality, operations and logistics separately. VESSEL asks how a decision in one stage changes the rest: teams compare production philosophies, find bottlenecks, investigate defects, balance capacity, cut waste and redesign workflows, then measure cost, throughput, utilization, inventory, lead time, sustainability, quality and delivery.',
        },
      ],
    },
  },
  {
    slug: 'samsung-financial-reporting-case-study',
    title: 'Samsung financial reporting case study',
    type: 'case-study',
    subTeam: 'DIGITAL Business',
    publishedAt: '2026-08-19',
    summary: "Samsung's legally distinct affiliates move value through documented transactions. This study turns that model into a proposed finance system for the club.",
    authors: ['Christian Bautista', 'Russell Chung'],
    mentors: ['Russell Chung'],
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7495673529762402304/',
  },
  {
    slug: 'fifo-ip-v3',
    title: 'FIFO IP v3: learning how to approach the unknown',
    type: 'milestone',
    subTeam: 'SIDEKICK',
    detail: 'SoC',
    publishedAt: '2026-04-30',
    summary: 'With little Verilog or FPGA experience, the team built a FIFO step by step.',
    authors: ['Sami Ali', 'Ethan Oliver Wong', 'Jeremy Lee'],
    mentors: ['Russell Chung', 'Chris Zambrana'],
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7455669830839615491',
  },
  {
    slug: 'fifo-ip',
    title: 'FIFO IP: reliable data flow in digital systems',
    type: 'milestone',
    subTeam: 'SIDEKICK',
    detail: 'SoC',
    publishedAt: '2026-03-23',
    summary: 'A parameterized FIFO buffer designed and verified in Vivado, so parts on different clocks can pass data safely.',
    authors: ['Ethan Trone', 'Allen Nguyen'],
    mentors: ['Anish Chinnakonda', 'Chris Zambrana'],
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7441927871029288960',
  },
  {
    slug: 'light-sensor-mini-project',
    title: 'Light sensor mini-project',
    type: 'prototype',
    subTeam: 'SIDEKICK',
    detail: 'Hardware',
    publishedAt: '2026-01-22',
    summary: 'An ambient light and proximity sensor board for automatic screen brightness, designed in KiCad.',
    authors: ['Logan Knip'],
    mentors: ['Ethan Oliver Wong', 'Max Gross', 'Angelo Duenas'],
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7420182388397338624',
  },
  {
    slug: 'smartphone-enclosure',
    title: 'Smartphone enclosure: ergonomics and iterative CAD',
    type: 'prototype',
    subTeam: 'SIDEKICK',
    detail: 'Enclosure',
    publishedAt: '2026-01-21',
    summary: 'The team iterated enclosure concepts around module and battery thickness, grip and manufacturability.',
    authors: ['Russell Chung', 'Logan Knip', 'Izaiah Ortiz'],
    mentors: [],
    lead: 'Viren Kumar',
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7419545678722252800',
  },
  {
    slug: 'imu-mini-project',
    title: 'IMU mini-project',
    type: 'prototype',
    subTeam: 'SIDEKICK',
    detail: 'Hardware',
    publishedAt: '2025-11-25',
    summary: 'A 9-axis motion sensor board for the phone daughterboard, from decision matrix to KiCad layout.',
    authors: ['Allen Nguyen', 'Oscar Cao', 'Mason Tran'],
    mentors: ['Max Gross'],
    source: 'linkedin',
    externalUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7399148596031381504',
  },
];

/** Teams that are new and not yet on the site as a build page. */
export const SOON_TEAMS: readonly UpdateSubTeam[] = ['TWINS', 'DIGITAL Business'];

/** Round avatar text until photos arrive: first letters of the first two name parts. */
export const initials = (name: string): string =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export interface UpdateTag { readonly slug: TagSlug; readonly label: string; readonly team?: UpdateSubTeam }
/** Tag chips, filter order (PLAN §4). Colours: `--r2-tag-<slug>-bg/-ink` in worlds.css. */
export const UPDATE_TAGS: readonly UpdateTag[] = [
  { slug: 'digital', label: 'DIGITAL' },
  { slug: 'sidekick', label: 'SIDEKICK', team: 'SIDEKICK' },
  { slug: 'shades', label: 'SHADES', team: 'SHADES' },
  { slug: 'brain', label: 'BRAIN', team: 'BRAIN' },
  { slug: 'twins', label: 'TWINS', team: 'TWINS' },
  { slug: 'business', label: 'DIGITAL Business', team: 'DIGITAL Business' },
];

/** Shown tags: team tag first, then `tags`, deduplicated. */
export const tagsOf = (i: Update): readonly UpdateTag[] => {
  const team = UPDATE_TAGS.find((t) => t.team === i.subTeam);
  const extra = UPDATE_TAGS.filter((t) => t !== team && i.tags?.includes(t.slug));
  return team ? [team, ...extra] : extra;
};

/** Filter order on the page. */
/** Reading time in whole minutes: words / 200, at least 1. */
export const readMinutes = (e: Extract<Update, { source: 'site' }>): number =>
  Math.max(1, Math.round([e.page.dek, ...e.page.sections.map((x) => `${x.heading} ${x.body}`)].join(' ').split(/\s+/).filter(Boolean).length / 200));

/** Up to `n` other posts: same-tag first, then nearest in time. */
export const moreOf = (all: readonly Update[], cur: Update, n = 3): Update[] => {
  const mine = new Set(tagsOf(cur).map((t) => t.slug));
  const t0 = Date.parse(cur.publishedAt);
  return all
    .filter((x) => x.slug !== cur.slug)
    .map((x) => ({ x, same: tagsOf(x).some((t) => mine.has(t.slug)) ? 0 : 1, d: Math.abs(Date.parse(x.publishedAt) - t0) }))
    .sort((a, b) => a.same - b.same || a.d - b.d)
    .slice(0, n)
    .map((r) => r.x);
};

export const UPDATE_TEAMS: readonly UpdateSubTeam[] = ['SIDEKICK', 'SHADES', 'BRAIN', 'TWINS', 'DIGITAL Business'];
export const UPDATE_TYPES: readonly UpdateType[] = ['paper', 'milestone', 'prototype', 'achievement', 'product-definition', 'case-study'];

export const UPDATES_COPY = {
  meta: { title: 'Updates · DIGITAL', description: 'Papers, milestones and prototypes from every DIGITAL team.' },
  title: 'Updates',
  lead: 'Papers, milestones and prototypes from every DIGITAL team.',
  featuredLabel: 'Featured',
  // provisional, pending brand review
  earlier: 'Earlier',
  foldLabel: 'Type and search',
  moreUpdates: 'More updates',
  allUpdates: 'All updates',
  minRead: 'min read',
  breadcrumb: 'Breadcrumb',
  filterLabel: 'Filter updates',
  tagGroup: 'Tags',
  typeGroup: 'Type',
  all: 'All',
  count: (n: number) => `${n} ${n === 1 ? 'update' : 'updates'}`,
  searchLabel: 'Search updates',
  noMatch: 'No updates match these filters.',
  noTagPosts: 'No updates with this tag yet.',
  /** Filter chip name; pressed state is aria-pressed only. */
  tagCount: (label: string, n: number) => `${label}, ${n} ${n === 1 ? 'update' : 'updates'}`,
  /** Card / row / byline chip link name. */
  showTag: (label: string) => `${label} updates`,
  onSite: 'On this site',
  linkedIn: 'LinkedIn',
  seeMore: 'See more',
  opensLinkedIn: ' (opens LinkedIn)',
  empty: { title: 'First posts coming soon.', body: 'Each sub-team will publish here as it finishes something.', row: 'No entries yet' },
  author: 'Author',
  mentor: 'Mentor',
  postTitle: (title: string) => `${title} · DIGITAL`,
  leadRole: 'Lead',
  comingSoon: 'Coming soon',
  back: 'Updates',
  readOnLinkedIn: 'Read the post on LinkedIn',
  by: 'By',
  valueStreamLabel: 'Value stream',
  join: { title: 'Build the next update.', cta: 'Join us', href: '/#join' },
  typeLabels: { paper: 'Paper', milestone: 'Milestone', prototype: 'Prototype', achievement: 'Achievement', 'product-definition': 'Product definition', 'case-study': 'Case study' } as Record<UpdateType, string>,
} as const;
