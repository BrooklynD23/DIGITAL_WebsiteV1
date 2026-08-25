import type { Metadata } from 'next';
import HomeLanding from '@/components/home/HomeLanding';
import { landingFonts } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'DIGITAL - Engineering Club @ Cal Poly Pomona',
  description:
    'Student-run engineering club at Cal Poly Pomona. We turn coursework into built systems.',
};

export default function HomePage() {
  return (
    <div
      className={`${landingFonts.serif.variable} ${landingFonts.sans.variable} ${landingFonts.mono.variable}`}
    >
      <HomeLanding />
    </div>
  );
}
