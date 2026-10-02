import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { dFontVars } from './fonts';

export const metadata: Metadata = {
  title: 'Concept D: Human / Community — DIGITAL design lab',
  robots: { index: false, follow: false },
};

/**
 * The root layout renders the production Navbar, Footer and crosshair cursor on every
 * route. This prototype carries its own chrome, so it hides those three while it is
 * mounted. Scoped by `[data-concept="d"]`; nothing outside this route is affected.
 */
const HIDE_GLOBAL_CHROME = `
body:has([data-concept="d"]) > nav[aria-label="Primary"],
body:has([data-concept="d"]) > footer,
body:has([data-concept="d"]) > div[style*="--ds-z-cursor"] { display: none !important; }
html:has([data-concept="d"]) { cursor: auto !important; }
`;

export default function ConceptDLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      <div className={dFontVars}>{children}</div>
    </>
  );
}
