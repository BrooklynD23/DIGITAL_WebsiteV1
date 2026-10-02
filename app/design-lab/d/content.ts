/**
 * Concept D content. Facts come from lib/data (imported, never edited).
 * Lines written for this concept are exploratory copy: production copy still goes
 * brand-voice-strategist → brand-guardian. Unknowns are labelled [placeholder] / [confirm].
 */
import { projects } from '@/lib/data/projects';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { meetingInfo } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';
import { teamMembers } from '@/lib/data/team';

const phone = projects.find((p) => p.slug === 'modular-smartphone');
const reading = projects.find((p) => p.slug === 'smart-reading');
const venture = homeLandingCopy.results.cases.find((c) => c.title === 'Venture Studies');

if (!phone || !reading || !venture) {
  throw new Error('Concept D: expected project records missing from lib/data');
}

export const meeting = {
  day: 'Thursday',
  time: '6:00 PM',
  schedule: meetingInfo.schedule,
  room: meetingInfo.location,
  campus: meetingInfo.campus,
  rhythm: meetingInfo.description,
} as const;

export const links = {
  discord: siteConfig.community.discord,
  email: siteConfig.contact.email,
  join: '/contact?type=membership',
  projectTeam: '/contact?type=project-team',
  leadership: '/contact?type=leadership',
} as const;

export const subsystems = phoneV2Copy.subsystemSections.map((s) => ({
  id: s.id,
  title: s.title,
  short: s.scrubberLabel,
  description: s.description,
  bullets: s.bullets,
  specLines: s.specLines,
}));

/** owner → review → test gate → repair plan (phoneV2.ts buildScope.scopeItems, verbatim in mono). */
export const ownership = phoneV2Copy.buildScope.scopeItems;
export const workflow = phoneV2Copy.toolbox.workflowStages;

export const dg001 = {
  id: 'DG-001',
  title: phone.title,
  href: `/projects/${phone.slug}`,
  status: phone.status,
  problem: 'Phones are built to be replaced, not repaired.',
  object: phoneV2Copy.hero.subline,
  oneLine: homeLandingCopy.results.cases[0]?.line ?? '',
  learns: [homeLandingCopy.results.cases[0]?.learn1 ?? '', homeLandingCopy.results.cases[0]?.learn2 ?? ''],
  needs: subsystems.map((s) => s.title),
} as const;

const readingInfo = GLASSES_CONTENT.info;
export const dg002 = {
  id: 'DG-002',
  title: reading.title,
  href: `/projects/${reading.slug}`,
  status: reading.status,
  problem: readingInfo[0]?.title ?? '',
  problemBody: readingInfo[0]?.body ?? '',
  object: reading.shortDescription,
  tech: reading.techStack,
  needs: ['engineering', 'optics', 'firmware', 'design', 'research'],
  cycle: '8-month build cycle',
  mentor: 'Dr. Mohamed El Hadedy',
  cost: 'Free to join',
  pov: GLASSES_CONTENT.pov.clear,
  word: 'where',
  wpm: GLASSES_CONTENT.hud.wpm,
} as const;

export const ventureStudies = {
  title: venture.title,
  kicker: venture.kicker,
  line: venture.line,
  learns: [venture.learn1, venture.learn2],
} as const;

export const openSeats = teamMembers.map((m) => ({ id: m.id, role: m.role, open: m.isPlaceholder }));

/**
 * "Arrive as / leave as". Left column = disciplines the site already names
 * (homeLanding join body + Smart Reading needs). Right column = the real
 * ownership sentences from phoneV2 / glasses / Venture Studies, turned to
 * "the person who…". Pairings are illustrative, not assignments.
 */
export const becoming = [
  { arrive: 'Computer science', leave: 'the person who takes a board from reset to a known state', source: 'Firmware / Embedded' },
  { arrive: 'Engineering', leave: 'the person who decides where the frame ends and the board begins', source: 'Systems Architecture' },
  { arrive: 'Design', leave: 'the person who makes each tap show that it worked', source: 'Apps / UX' },
  { arrive: 'Business', leave: 'the person who defends a trade-off in front of a sponsor', source: 'Venture Studies' },
  { arrive: 'Research', leave: 'the person who holds one word still for a reader', source: 'Smart Reading' },
] as const;
