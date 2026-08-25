import type { Metadata } from 'next';
import { smartReadingMetadata } from '@/lib/data/experiments/glasses';
import { studioFonts } from '@/lib/fonts';

export const metadata: Metadata = {
  title: smartReadingMetadata.title,
  description: smartReadingMetadata.description,
};

export default function SmartReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${studioFonts.display.variable} ${studioFonts.body.variable} ${studioFonts.mono.variable}`}
    >
      {children}
    </div>
  );
}
