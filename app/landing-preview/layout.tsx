import type { Metadata } from 'next';
import { LANDING_CONTENT } from '@/lib/data/landing';

export const metadata: Metadata = {
  title: LANDING_CONTENT.meta.title,
  description: LANDING_CONTENT.meta.description,
};

export default function LandingPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
