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

export interface ProjectTimeline {
  phase: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface ProjectModule {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot' | 'wearable';
  status: 'active' | 'completed' | 'paused';
  isFlagship: boolean;
  comingSoon?: boolean;
  image: string;
  gallery?: string[];
  techStack: string[];
  stats?: ProjectStat[];
  timeline?: ProjectTimeline[];
  modules?: ProjectModule[];
  specifications?: { label: string; value: string }[];
  teamMembers?: string[];
}

export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  assets: {
    logo: string;
    logoDark: string;
    logoFull: string;
  };
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
