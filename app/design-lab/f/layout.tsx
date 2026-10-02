import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'The Bench — concept F — DIGITAL design lab',
  robots: { index: false, follow: false },
};

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz', 'wdth'],
  variable: '--f-bricolage',
});

/** Departure Mono (Helena Zhang, SIL OFL 1.1), official GitHub release v1.500. License: ./fonts/DepartureMono-LICENSE.txt */
const departure = localFont({
  src: './fonts/DepartureMono-Regular.woff2',
  variable: '--f-departure',
  display: 'swap',
});

/**
 * Lab-only: this route draws its own chrome, so hide the production Navbar/Footer
 * while it is mounted. Scoped with :has() to this route's root marker.
 * (Cleaner fix for the orchestrator: add '/design-lab' to lib/immersiveRoutes.ts.)
 */
const HIDE_PROD_CHROME = `
body:has([data-lab-f]) > nav[aria-label="Primary"],
body:has([data-lab-f]) > footer { display: none !important; }
`;

export default function ConceptFLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      {/* Static constant, no user input. */}
      <style dangerouslySetInnerHTML={{ __html: HIDE_PROD_CHROME }} />
      <div className={`${bricolage.variable} ${departure.variable}`}>{children}</div>
    </>
  );
}
