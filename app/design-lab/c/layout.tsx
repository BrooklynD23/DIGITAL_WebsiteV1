import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { FONTSHARE_HREFS, martianMono } from './fonts';

export const metadata: Metadata = {
  title: 'Concept C — Creative Technology · DIGITAL design lab',
  description: 'Design lab prototype: a formation hero computed from the real builds.',
  robots: { index: false, follow: false },
};

/*
 * The root layout renders the production Navbar/Footer on every non-immersive
 * route. This prototype brings its own chrome, so it hides them while this
 * layout is mounted. It also hides the production crosshair cursor overlay:
 * the particle probe is this hero's only pointer effect. Cleaner fix (orchestrator-owned): add '/design-lab' to
 * IMMERSIVE_PREFIXES in lib/immersiveRoutes.ts.
 */
const ROUTE_CHROME = `
  body > nav[aria-label="Primary"], body > footer { display: none !important; }
  html, body { background: #0c0c0b; }
  html { cursor: auto !important; }
  [style*="ds-z-cursor"] { display: none !important; }
  @media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
`;

export default function ConceptCLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      {FONTSHARE_HREFS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: ROUTE_CHROME }} />
      <div className={martianMono.variable}>{children}</div>
    </>
  );
}
