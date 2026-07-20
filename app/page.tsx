import type { Metadata } from 'next';
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import HomeLanding from '@/components/home/HomeLanding';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-home-serif',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-home-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-home-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DIGITAL - Engineering Club @ Cal Poly Pomona',
  description:
    'A student-led, project-based engineering organization at Cal Poly Pomona — turning students into builders of real systems.',
};

export default function HomePage() {
  return (
    <div className={`${newsreader.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <HomeLanding />
    </div>
  );
}
