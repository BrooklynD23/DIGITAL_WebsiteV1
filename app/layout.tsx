import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/data/siteConfig';
import { landingFonts, studioFonts } from '@/lib/fonts';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: `${siteConfig.name} - Engineering Club @ Cal Poly Pomona`,
  description: siteConfig.description,
  keywords: ['engineering club', 'Cal Poly Pomona', 'student organization', 'hardware', 'modular smartphone', 'DIGITAL'],
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Engineering Club @ Cal Poly Pomona`,
    description: siteConfig.description,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.fullName,
  url: baseUrl,
  description: siteConfig.description,
  sameAs: [
    siteConfig.social.linkedin,
    siteConfig.social.github,
    siteConfig.social.instagram,
    siteConfig.social.discord,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={[
          landingFonts.serif.variable,
          landingFonts.sans.variable,
          landingFonts.mono.variable,
          // Studio stack: consumed by routes not yet migrated onto the landing
          // system; retires from <body> once the consolidation completes.
          studioFonts.display.variable,
          studioFonts.body.variable,
          studioFonts.mono.variable,
          'font-homeSans text-dg-ink bg-dg-bg overflow-x-hidden antialiased',
        ].join(' ')}
      >
        {/* Skip-to-content link — visually hidden until focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-studio focus:text-ink focus:border focus:border-ink focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />

        {/* Vercel Analytics & Speed Insights — cookieless, static-export compatible */}
        <Analytics />
        <SpeedInsights />

        {/* JSON-LD Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
