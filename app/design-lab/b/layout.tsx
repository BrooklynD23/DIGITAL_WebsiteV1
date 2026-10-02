import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Concept B — Engineering / System · DIGITAL design lab',
  robots: { index: false, follow: false },
};

// Scoped to this lab route; preload off so the faces never leak into other routes.
const display = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  preload: false,
  variable: '--b-font-display',
});
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--b-font-body',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--b-font-mono',
});

/**
 * The concept carries its own nav + title-block footer, so the global site chrome is
 * hidden on this route only (lib/immersiveRoutes is production-owned; not edited).
 */
const hideGlobalChrome = `
body:has(#lab-b) > nav[aria-label="Primary"],
body:has(#lab-b) > footer { display: none !important; }
body:has(#lab-b) { background: #f2f2ee; }
`;

export default function ConceptBLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hideGlobalChrome }} />
      <div id="lab-b" className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </div>
    </>
  );
}
