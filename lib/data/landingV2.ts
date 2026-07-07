/**
 * Copy + config for the Landing V2 preview (/landing-v2).
 *
 * Per CLAUDE.md all user-facing strings live here — components consume this
 * file and never inline copy. Wording follows the digital-marketing skill
 * (.cursor/skills/digital-marketing/): every stat and factual claim below is
 * `approved` in claims.md; mission beats are re-exported verbatim from
 * lib/data/mission.ts. Signal red (#d8412f) is never referenced here.
 */

import { MISSION_BEATS, MISSION_TAGLINE, type PurposeBeat } from './mission';
import { siteConfig, sponsors } from './siteConfig';
import { meetingInfo } from './involvement';

// ---------------------------------------------------------------------------
// 1. Hero parallax layer manifest
// ---------------------------------------------------------------------------

export interface HeroLayer {
  readonly id: string;
  readonly src: string; // under public/assets/landing-v2/layers/
  readonly speed: number; // parallax factor — back layers move slowest
  readonly zIndex: number; // back (low) → front (high)
  readonly alt: string;
}

export const heroLayers: readonly HeroLayer[] = [
  {
    id: 'sky',
    src: '/assets/landing-v2/layers/06-sky.svg',
    speed: 0.05,
    zIndex: 1,
    alt: 'Gradient sky backdrop',
  },
  {
    id: 'foothills',
    src: '/assets/landing-v2/layers/05-foothills.svg',
    speed: 0.15,
    zIndex: 2,
    alt: 'Layered foothill silhouettes behind campus',
  },
  {
    id: 'cla-building',
    src: '/assets/landing-v2/layers/04-cla-building.svg',
    speed: 0.3,
    zIndex: 3,
    alt: 'Cal Poly Pomona CLA building silhouette',
  },
  {
    id: 'campus-band',
    src: '/assets/landing-v2/layers/03-campus-band.svg',
    speed: 0.45,
    zIndex: 4,
    alt: 'Campus rooftops and treeline band',
  },
  {
    id: 'people',
    src: '/assets/landing-v2/layers/02-people.svg',
    speed: 0.65,
    zIndex: 5,
    alt: 'Students working on hardware together',
  },
  {
    id: 'foliage',
    src: '/assets/landing-v2/layers/01-foliage.svg',
    speed: 0.85,
    zIndex: 6,
    alt: 'Foreground foliage frame',
  },
] as const;

// ---------------------------------------------------------------------------
// 2. Floating pill anchor nav — ids match app/landing-v2/page.tsx sections
// ---------------------------------------------------------------------------

export interface AnchorNavItem {
  readonly id: string; // section id, used as #anchor
  readonly label: string;
}

export const anchorNavItems: readonly AnchorNavItem[] = [
  { id: 'hero', label: 'Top' },
  { id: 'mission', label: 'Mission' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'projects', label: 'Projects' },
  { id: 'backing', label: 'Partners' },
  { id: 'paths', label: 'Paths in' },
  { id: 'faq', label: 'FAQ' },
  { id: 'join', label: 'Join' },
] as const;

// ---------------------------------------------------------------------------
// 3. Hero copy — eyebrow/subline verbatim from lib/data/landing.ts voice;
//    headline uses the approved audiences.md formula phrase.
// ---------------------------------------------------------------------------

export interface HeroCopy {
  readonly eyebrow: string;
  readonly headline: string; // outline keyword handled by the component
  readonly subline: string;
  readonly scrollHint: string;
}

export const heroCopy: HeroCopy = {
  eyebrow: 'DIGITAL @ Cal Poly Pomona',
  headline: 'BUILD THE WHOLE SYSTEM.',
  subline: MISSION_TAGLINE,
  scrollHint: 'Scroll',
} as const;

// ---------------------------------------------------------------------------
// 4. Mission beats — verbatim re-export; never reworded here
// ---------------------------------------------------------------------------

export type MissionBeat = PurposeBeat;

export const missionBeats: readonly MissionBeat[] = MISSION_BEATS;

// ---------------------------------------------------------------------------
// 5. Depth metrics — approved project-level stats only (claims.md). No
//    club-wide numbers: 120+/15/50k+ are `verify` and stay off this page.
// ---------------------------------------------------------------------------

export interface DepthMetric {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly source: string; // proof note shown next to the stat
}

export const depthMetricsEyebrow = 'Depth over scale' as const;

export const depthMetrics: readonly DepthMetric[] = [
  {
    id: 'modules',
    value: '4',
    label: 'core modules',
    source: 'Modular Smartphone',
  },
  {
    id: 'open-source',
    value: '100%',
    label: 'open source',
    source: 'Modular Smartphone',
  },
  {
    id: 'engineers',
    value: '25+',
    label: 'student engineers',
    source: 'Modular Smartphone',
  },
  {
    id: 'phase',
    value: 'Phase 3 of 4',
    label: 'prototyping',
    source: 'Modular Smartphone',
  },
] as const;

// ---------------------------------------------------------------------------
// 6. Pillars marquee — the 7 DIGITAL pillars (app/pillars/page.tsx)
// ---------------------------------------------------------------------------

export interface Pillar {
  readonly letter: string;
  readonly title: string;
}

export const pillars: readonly Pillar[] = [
  { letter: 'D', title: 'Device' },
  { letter: 'I', title: 'Implementation' },
  { letter: 'G', title: 'Generating' },
  { letter: 'I', title: 'Integrating' },
  { letter: 'T', title: 'Testing' },
  { letter: 'A', title: 'Analyzing' },
  { letter: 'L', title: 'Learning' },
] as const;

// ---------------------------------------------------------------------------
// 7. Projects proof chamber — flagship entries from lib/data/projects.ts and
//    lib/data/landing.ts; honest status words per the marketing skill.
// ---------------------------------------------------------------------------

export interface ProjectChamberEntry {
  readonly id: 'modular-smartphone' | 'smart-reading';
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string; // honest status word — never shipped-product framing
  readonly blurb: string;
  readonly href: string;
}

export const projectsChamberEyebrow = "What we're building" as const;

export const projectsChamber: readonly ProjectChamberEntry[] = [
  {
    id: 'modular-smartphone',
    eyebrow: '01 · Flagship',
    title: 'The Modular Smartphone',
    status: 'Prototyping — phase 3 of 4',
    blurb: 'A phone you can repair, upgrade, and take apart layer by layer.',
    href: '/projects/modular-smartphone',
  },
  {
    id: 'smart-reading',
    eyebrow: '02 · Wearable',
    title: 'Smart Reading',
    status: 'In build phase — 8-month cycle',
    blurb: 'Text projected into your line of sight — read without looking down.',
    href: '/projects/smart-reading',
  },
] as const;

// ---------------------------------------------------------------------------
// 8. Backing — "Campus partners" framing (claims.md: "Backed by Industry
//    Leaders" is do-not-use). Names sourced from lib/data/siteConfig.ts.
// ---------------------------------------------------------------------------

export interface BackingContent {
  readonly eyebrow: string;
  readonly heading: string;
  readonly partners: readonly { readonly name: string }[];
}

export const backing: BackingContent = {
  eyebrow: 'Campus partners',
  heading: 'Supported by',
  partners: sponsors,
} as const;

// ---------------------------------------------------------------------------
// 9. Paths in — Students / Alumni / Companies, from lib/data/involvement.ts
// ---------------------------------------------------------------------------

export interface PathInEntry {
  readonly id: 'students' | 'alumni' | 'companies';
  readonly title: string;
  readonly subtitle: string;
  readonly cta: { readonly label: string; readonly href: string };
}

export const pathsInEyebrow = 'Ways in' as const;

export const pathsIn: readonly PathInEntry[] = [
  {
    id: 'students',
    title: 'Students',
    subtitle: 'Join our engineering community and gain hands-on experience',
    cta: { label: 'Become a member', href: '/contact?type=membership' },
  },
  {
    id: 'alumni',
    title: 'Alumni',
    subtitle: 'Stay connected and give back to the community',
    cta: { label: 'Join alumni network', href: '/contact?type=alumni-network' },
  },
  {
    id: 'companies',
    title: 'Companies & Organizations',
    subtitle: 'Partner with us to access top engineering talent',
    cta: { label: 'Become a sponsor', href: '/contact?type=sponsor' },
  },
] as const;

// ---------------------------------------------------------------------------
// 10. FAQ — ⚠ NEW COPY, pending human sign-off per the digital-marketing
//     copy workflow. Facts inside each answer are claims.md-approved
//     (meeting time/place, "no experience required", named campus partners);
//     the question/answer phrasing itself is new and awaits review.
// ---------------------------------------------------------------------------

export interface FaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const faqEyebrow = 'Questions' as const;

export const faq: readonly FaqEntry[] = [
  {
    id: 'who-can-join',
    question: 'Who can join DIGITAL?',
    answer:
      'Any Cal Poly Pomona student. Engineering, CS, design, business — no experience required. Show up to a Thursday meeting or join the Discord and we will point you at a project.',
  },
  {
    id: 'no-experience',
    question: "I've never built hardware. Can I still contribute?",
    answer:
      'Yes. No experience required — you learn by building alongside people who will teach you. New members start on real project work, not busywork.',
  },
  {
    id: 'time-commitment',
    question: 'How much time does it take?',
    answer:
      'General meetings run Thursdays @ 6:00 PM in Building 17, Room 1635. Project work beyond that varies by team and by where the build is — you scope it with your project lead.',
  },
  {
    id: 'majors',
    question: 'Do I have to be an engineering major?',
    answer:
      'No. Hardware, software, mechanical, business — every discipline has a seat. We scope the work, raise the funding, and pitch it like a business, so design and business majors do real work here too.',
  },
  {
    id: 'what-you-build',
    question: 'What would I actually work on?',
    answer:
      'Real hardware and software in active development: the open-source Modular Smartphone (custom PCB, ESP32-S3, C++/PlatformIO) and Smart Reading, an FPGA-based heads-up wearable. Both are in build — you join the project where it actually is.',
  },
  {
    id: 'sponsorship',
    question: 'How do sponsorships work?',
    answer:
      'Campus partners — CPP Project Hatchery and the College of Engineering: MEP-WiSE — support the work today. Companies can sponsor, recruit, host a workshop, or donate equipment; start at the contact page and pick a track.',
  },
] as const;

// ---------------------------------------------------------------------------
// 11. Join CTA — Thursday 6PM, Building 17 + Discord (siteConfig/involvement)
// ---------------------------------------------------------------------------

export interface JoinCtaContent {
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: string;
  readonly meeting: {
    readonly schedule: string;
    readonly location: string;
    readonly campus: string;
  };
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly discordCta: { readonly label: string; readonly href: string };
}

export const joinCta: JoinCtaContent = {
  eyebrow: 'Come Thursday',
  heading: 'Ready to build?',
  body: 'Engineering, CS, design, business — no experience required.',
  meeting: {
    schedule: meetingInfo.schedule,
    location: meetingInfo.location,
    campus: meetingInfo.campus,
  },
  primaryCta: { label: 'Get involved', href: '/get-involved' },
  discordCta: { label: 'Join the Discord', href: siteConfig.social.discord },
} as const;
