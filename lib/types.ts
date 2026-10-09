export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'executive' | 'hardware' | 'software' | 'outreach';
  title: string;
  image: string;
  links?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  contact: {
    email: string;
    location: string;
    campus: string;
    meetingTime: string;
  };
  /** The approved public links. The only place these URLs are written; app/(apple)/_chrome/club.ts re-exports them. */
  social: {
    discord: string;
    brainDiscord: string;
    github: string;
    linkedin: string;
    instagram: string;
  };
  formspreeEndpoint: string;
}
