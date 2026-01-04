import type { Metadata } from 'next';
import { Space_Grotesk, Noto_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/data/siteConfig';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Non-blocking font loading strategy:
          1. Preload the stylesheet for early discovery
          2. Load with media="print" so it doesn't block render
          3. Script switches to media="all" after DOM is ready
        */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          as="style"
        />
        <link
          id="material-symbols-font"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Non-blocking font loading - switch media after document is interactive
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  var link = document.getElementById('material-symbols-font');
                  if (link) link.media = 'all';
                });
              } else {
                var link = document.getElementById('material-symbols-font');
                if (link) link.media = 'all';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
