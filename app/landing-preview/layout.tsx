import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DIGITAL — Built from Modules',
  description: 'A student platform for building real technology at Cal Poly Pomona.',
};

export default function LandingPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
