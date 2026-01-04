// Scalable involvement options - add new categories or options easily

export interface InvolvementOption {
  id: string;
  title: string;
  description: string;
  icon: string; // Material Symbols icon name
  link: string;
  linkText?: string;
  featured?: boolean; // Highlight this option
}

export interface InvolvementCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  options: InvolvementOption[];
}

export const involvementCategories: InvolvementCategory[] = [
  {
    id: 'students',
    title: 'Students',
    subtitle: 'Join our engineering community and gain hands-on experience',
    icon: 'school',
    options: [
      {
        id: 'membership',
        title: 'Become a Member',
        description: 'Join DIGITAL and start building real-world projects with industry-standard tools.',
        icon: 'person_add',
        link: '/contact?type=membership',
        linkText: 'Apply Now',
        featured: true,
      },
      {
        id: 'project-team',
        title: 'Join a Project Team',
        description: 'Work on hardware, software, or embedded systems with experienced mentors.',
        icon: 'groups',
        link: '/contact?type=project-team',
        linkText: 'View Teams',
      },
      {
        id: 'leadership',
        title: 'Apply for Leadership',
        description: 'Take on executive roles and help shape the future of DIGITAL.',
        icon: 'supervisor_account',
        link: '/contact?type=leadership',
        linkText: 'Apply',
      },
      {
        id: 'mentorship',
        title: 'Get Mentorship',
        description: 'Connect with senior members and industry professionals for guidance.',
        icon: 'support_agent',
        link: '/contact?type=mentorship',
        linkText: 'Request Mentor',
      },
    ],
  },
  {
    id: 'alumni',
    title: 'Alumni',
    subtitle: 'Stay connected and give back to the community',
    icon: 'workspace_premium',
    options: [
      {
        id: 'alumni-network',
        title: 'Join Alumni Network',
        description: 'Stay connected with DIGITAL, attend events, and network with current members.',
        icon: 'hub',
        link: '/contact?type=alumni-network',
        linkText: 'Connect',
        featured: true,
      },
      {
        id: 'mentor-students',
        title: 'Mentor Students',
        description: 'Share your industry experience and guide the next generation of engineers.',
        icon: 'school',
        link: '/contact?type=mentor',
        linkText: 'Become a Mentor',
      },
      {
        id: 'speak-event',
        title: 'Speak at an Event',
        description: 'Share your career journey and insights at our workshops or general meetings.',
        icon: 'podium',
        link: '/contact?type=speaker',
        linkText: 'Propose Talk',
      },
    ],
  },
  {
    id: 'companies',
    title: 'Companies & Organizations',
    subtitle: 'Partner with us to access top engineering talent',
    icon: 'business',
    options: [
      {
        id: 'sponsor',
        title: 'Become a Sponsor',
        description: 'Support student innovation and get visibility among future engineers.',
        icon: 'handshake',
        link: '/contact?type=sponsor',
        linkText: 'Sponsor Us',
        featured: true,
      },
      {
        id: 'recruit',
        title: 'Recruit Talent',
        description: 'Connect with skilled students for internships and full-time positions.',
        icon: 'work',
        link: '/contact?type=recruit',
        linkText: 'Post Opportunity',
      },
      {
        id: 'workshop',
        title: 'Host a Workshop',
        description: 'Showcase your technology and engage directly with our engineering community.',
        icon: 'co_present',
        link: '/contact?type=workshop',
        linkText: 'Propose Workshop',
      },
      {
        id: 'donate',
        title: 'Donate Equipment',
        description: 'Contribute hardware, tools, or software licenses to support our projects.',
        icon: 'volunteer_activism',
        link: '/contact?type=donate',
        linkText: 'Donate',
      },
    ],
  },
];

// Meeting info for the page
export const meetingInfo = {
  title: 'General Meetings',
  description: 'Join us every week to learn about engineering topics, network with peers, and work on projects together.',
  schedule: 'Thursdays @ 6:00 PM',
  location: 'Building 17, Room 1635',
  campus: 'Cal Poly Pomona',
  perks: ['Hands-on workshops', 'Industry guest speakers', 'Project updates', 'Networking'],
};
