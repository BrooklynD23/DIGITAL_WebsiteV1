import type { Metadata } from 'next';
import { smartReadingMetadata } from '@/lib/data/experiments/glasses';

export const metadata: Metadata = {
  title: smartReadingMetadata.title,
  description: smartReadingMetadata.description,
};

export default function SmartReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
