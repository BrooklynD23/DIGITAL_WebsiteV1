import type { Metadata } from 'next';
import { phoneV2Metadata } from '@/lib/data/phoneV2';

export const metadata: Metadata = {
  title: phoneV2Metadata.title,
  description: phoneV2Metadata.description,
};

export default function ModularSmartphoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
