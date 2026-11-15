import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/data/siteConfig';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { THEME_SCRIPT } from './(apple)/_chrome/theme';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

const TITLE = `${siteConfig.name} · A student-run venture studio at Cal Poly Pomona`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: TITLE,
  description: siteConfig.description,
  keywords: ['DIGITAL', 'Cal Poly Pomona', 'student-run venture studio', 'student organization', 'SIDEKICK', 'SHADES', 'BRAIN'],
  // './' resolves against each route, so every page gets its own canonical and og:url (with the trailing slash).
  alternates: { canonical: './' },
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    url: './',
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: siteConfig.description,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.fullName,
  url: baseUrl,
  description: siteConfig.description,
  sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram, siteConfig.social.github, siteConfig.social.discord],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: THEME_SCRIPT sets data-theme / data-theme-choice on <html> before React hydrates.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        {/* Site theme before first paint (DESIGN.md §9): reads the stored choice, sets <html data-theme>. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/* Fonts, chrome and <main> belong to the route group: app/(apple)/layout.tsx. */}
      <body>
        {children}

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
