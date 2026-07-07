import type { Metadata } from 'next';

// Placeholder meta — swapped for lib/data-driven copy when sections are wired in.
export const metadata: Metadata = {
  title: 'DIGITAL @ CPP — Landing V2 Preview',
  description: 'Preview build of the layered single-scroll landing experience.',
};

export default function LandingV2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
