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
    subtitle: 'Pick a seat at the bench.',
    icon: 'school',
    options: [
      {
        id: 'membership',
        title: 'Become a Member',
        description: 'Join DIGITAL and start building real systems with the team.',
        icon: 'person_add',
        link: '/contact/?type=membership',
        linkText: 'Apply Now',
        featured: true,
      },
      {
        id: 'project-team',
        title: 'Join a Project Team',
        description: 'Work hardware, software, or embedded with experienced leads.',
        icon: 'groups',
        link: '/contact/?type=project-team',
        linkText: 'View Teams',
      },
      {
        id: 'leadership',
        title: 'Apply for Leadership',
        description: 'Run a side of the club — budgets, outreach, or engineering.',
        icon: 'supervisor_account',
        link: '/contact/?type=leadership',
        linkText: 'Apply',
      },
      {
        id: 'mentorship',
        title: 'Get Mentorship',
        description: 'Get unstuck fast — pair with senior members and industry mentors.',
        icon: 'support_agent',
        link: '/contact/?type=mentorship',
        linkText: 'Request Mentor',
      },
    ],
  },
  {
    id: 'alumni',
    title: 'Alumni',
    subtitle: 'Stay connected — and stay building',
    icon: 'workspace_premium',
    options: [
      {
        id: 'alumni-network',
        title: 'Join Alumni Network',
        description: 'Keep your name on the roster, come to demos, meet the current team.',
        icon: 'hub',
        link: '/contact/?type=alumni-network',
        linkText: 'Connect',
        featured: true,
      },
      {
        id: 'mentor-students',
        title: 'Mentor Students',
        description: 'Share what industry taught you with students on the bench.',
        icon: 'school',
        link: '/contact/?type=mentor',
        linkText: 'Become a Mentor',
      },
      {
        id: 'speak-event',
        title: 'Speak at an Event',
        description: 'Present your work at a workshop or a general meeting.',
        icon: 'podium',
        link: '/contact/?type=speaker',
        linkText: 'Propose Talk',
      },
    ],
  },
  {
    id: 'companies',
    title: 'Companies & Organizations',
    subtitle: 'Meet the students while they build',
    icon: 'business',
    options: [
      {
        id: 'sponsor',
        title: 'Become a Sponsor',
        description: 'Fund a build and work with the team doing it.',
        icon: 'handshake',
        link: '/contact/?type=sponsor',
        linkText: 'Sponsor Us',
        featured: true,
      },
      {
        id: 'recruit',
        title: 'Recruit Talent',
        description: 'Hire from the bench — interns and full-time grads who have shipped.',
        icon: 'work',
        link: '/contact/?type=recruit',
        linkText: 'Post Opportunity',
      },
      {
        id: 'workshop',
        title: 'Host a Workshop',
        description: 'Bring your platform to a workshop and put it in student hands.',
        icon: 'co_present',
        link: '/contact/?type=workshop',
        linkText: 'Propose Workshop',
      },
      {
        id: 'donate',
        title: 'Donate Equipment',
        description: 'Give boards, tools, or licenses a second life inside a build.',
        icon: 'volunteer_activism',
        link: '/contact/?type=donate',
        linkText: 'Donate',
      },
    ],
  },
];

// Meeting info for the page
export const meetingInfo = {
  title: 'General Meetings',
  description: 'Thursday nights are build nights. Subsystem standups first, workshop after.',
  schedule: 'Thursdays @ 6:00 PM',
  location: 'Building 17, Room 1635',
  campus: 'Cal Poly Pomona',
  perks: ['Hands-on workshops', 'Industry guest speakers', 'Project updates', 'Networking'],
};
