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
  category: 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot';
  status: 'active' | 'completed' | 'paused';
  isFlagship: boolean;
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
  contact: {
    email: string;
    location: string;
    campus: string;
    meetingTime: string;
  };
  social: {
    linkedin: string;
    github: string;
    instagram: string;
    discord: string;
  };
  community: {
    discord: string;
    github: string;
    notion: string;
  };
  formspreeEndpoint: string;
}
