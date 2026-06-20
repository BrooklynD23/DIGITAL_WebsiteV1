import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'modular-smartphone',
    slug: 'modular-smartphone',
    title: 'The Modular Smartphone',
    shortDescription: 'A fully modular, repairable smartphone built from scratch. Features swappable camera, battery, and SoC modules running custom Android kernels.',
    fullDescription: 'Redefining repairability and customization in consumer electronics. Our flagship project aims to create an open-source, fully modular smartphone that challenges the throwaway culture of modern devices.',
    category: 'hardware',
    status: 'active',
    isFlagship: true,
    image: '/images/placeholders/projects/modular-phone.svg',
    techStack: ['ESP32-S3', 'KiCad', 'C++', 'PlatformIO', 'Custom PCB'],
    stats: [
      { label: 'Open Source', value: '100%' },
      { label: 'Core Modules', value: '4' },
      { label: 'Student Engineers', value: '25+' },
    ],
    timeline: [
      { phase: 1, title: 'Ideation', description: 'Concept & Requirements', status: 'completed' },
      { phase: 2, title: 'PCB Design', description: 'Schematics & Layout', status: 'completed' },
      { phase: 3, title: 'Prototyping', description: 'Component Testing', status: 'current' },
      { phase: 4, title: 'Assembly', description: 'Integration & Launch', status: 'upcoming' },
    ],
    modules: [
      {
        icon: 'memory',
        title: 'Core Compute Module',
        description: 'Powered by ESP32-S3 microcontroller with dual-core Xtensa processor running at 240 MHz.',
        color: 'primary',
      },
      {
        icon: 'battery_charging_full',
        title: 'Power Management',
        description: 'Hot-swappable battery module with intelligent power distribution and fast charging support.',
        color: 'orange',
      },
      {
        icon: 'smartphone',
        title: 'Display Unit',
        description: 'Modular display connector supporting various screen sizes and technologies.',
        color: 'purple',
      },
      {
        icon: 'vibration',
        title: 'Haptics Module',
        description: 'Advanced haptic feedback system for tactile response and notifications.',
        color: 'teal',
      },
    ],
    specifications: [
      { label: 'Processor', value: 'ESP32-S3 Dual-Core @ 240MHz' },
      { label: 'Memory', value: '8MB PSRAM' },
      { label: 'Storage', value: '16MB Flash + SD Card' },
      { label: 'Display', value: '4.5" IPS LCD (Modular)' },
      { label: 'Battery', value: '3000mAh Li-Po (Swappable)' },
      { label: 'Connectivity', value: 'WiFi 6, BLE 5.0' },
    ],
    teamMembers: ['sarah-kim', 'david-park', 'kevin-wang'],
  },
  {
    id: 'heads-up-display-glasses',
    slug: 'heads-up-display-glasses',
    title: 'Heads-up Display Glasses',
    shortDescription: 'More info soon.',
    fullDescription: 'More info soon.',
    category: 'wearable',
    status: 'active',
    isFlagship: false,
    comingSoon: true,
    image: '/images/placeholders/projects/modular-phone.svg',
    techStack: [],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFlagshipProject(): Project | undefined {
  return projects.find((p) => p.isFlagship);
}
