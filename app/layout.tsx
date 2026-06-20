import type { Metadata } from 'next';
import { Archivo, Hanken_Grotesk, DM_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/data/siteConfig';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

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
        className={`${archivo.variable} ${hankenGrotesk.variable} ${dmMono.variable} font-body text-ink bg-studio overflow-x-hidden antialiased`}
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
