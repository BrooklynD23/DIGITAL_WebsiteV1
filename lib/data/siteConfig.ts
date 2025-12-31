import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'DIGITAL',
  fullName: 'DIGITAL @ Cal Poly Pomona',
  description: 'A student-run engineering organization at Cal Poly Pomona dedicated to bridging the gap between academic theory and industry practice.',
  url: 'https://digitalcpp.org',
  contact: {
    email: 'contact@digitalcpp.org',
    location: 'Building 17, Room 1635',
    campus: 'Cal Poly Pomona',
    meetingTime: 'Thursdays @ 6:00 PM',
  },
  social: {
    linkedin: 'https://linkedin.com/company/digitalcpp',
    github: 'https://github.com/digitalcpp',
    instagram: 'https://instagram.com/digitalcpp',
    discord: 'https://discord.gg/Vsg3qcNVzv',
  },
  community: {
    discord: 'https://discord.gg/Vsg3qcNVzv',
    github: 'https://github.com/SunnyYoshimitsu/CelestiCall',
    notion: 'https://www.notion.so/team/14816947-3d77-8175-b209-0042311fec65/join',
  },
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
};

export const stats = {
  activeMembers: '120+',
  prototypes: '15',
  linesOfCode: '50k+',
  sponsors: '2',
};

export const sponsors = [
  { name: 'Cal Poly Pomona Project Hatchery' },
  { name: 'College of Engineering: MEP-WiSE' },
];
