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
    discord: 'https://discord.gg/digitalcpp',
  },
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
};

export const stats = {
  activeMembers: '120+',
  prototypes: '15',
  linesOfCode: '50k+',
  sponsors: '8',
};

export const sponsors = [
  { name: 'Project Hatchery', icon: 'rocket_launch' },
  { name: 'Cal Poly Pomona', icon: 'school' },
  { name: 'Autodesk', icon: 'precision_manufacturing' },
  { name: 'NVIDIA', icon: 'memory' },
];
