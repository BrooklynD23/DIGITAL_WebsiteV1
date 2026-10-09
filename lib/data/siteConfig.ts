import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'DIGITAL',
  fullName: 'DIGITAL @ Cal Poly Pomona',
  description: 'A student-run venture studio at Cal Poly Pomona. Pick one part of a real build and own it.',
  // No custom domain: the site is served from Vercel (Head Designer, 2026-10-07).
  url: 'https://digitalcpp.vercel.app',
  contact: {
    // No public email yet (Head Designer, 2026-10-07; tracked in TODO.md backlog). Empty = pages show Discord instead.
    email: '',
    location: 'Building 17, Room 1635',
    campus: 'Cal Poly Pomona',
    meetingTime: 'Thursdays @ 6:00 PM',
  },
  // Approved public links (Head Designer, 2026-10-07). Single source: club.ts, community.ts and the root metadata read these.
  social: {
    discord: 'https://discord.gg/U77P2U2D84',
    brainDiscord: 'https://discord.gg/Smfv4weJMz',
    github: 'https://github.com/DIGITALatCalPolyPomonaCPP/SIDEKICK-Prev.-TheSmartphoneProject-',
    linkedin: 'https://www.linkedin.com/company/digital-cal-poly-pomona',
    instagram: 'https://www.instagram.com/digital.cpp/',
  },
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
};
