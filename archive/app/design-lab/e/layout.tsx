import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--e-mono',
});

/** Fontshare (ITF FFL): one stylesheet per family; the API drops families when combined. */
const FONTSHARE = ['cabinet-grotesk@700,800', 'satoshi@400,500,700'].map(
  (f) => `https://api.fontshare.com/v2/css?f[]=${f}&display=swap`,
);

export const metadata: Metadata = {
  title: 'Concept E — The Ledger · DIGITAL design lab',
  description: 'Design-lab concept E: DIGITAL as a startup / product studio that publishes its build ledger.',
  robots: { index: false, follow: false },
};

/**
 * The root layout renders the production Navbar/Footer on every non-immersive route. This lab route
 * ships its own chrome, so it hides those two elements while mounted (scoped: the <style> only exists
 * on /design-lab/e). Clean fix, orchestrator-owned: add '/design-lab' to IMMERSIVE_PREFIXES.
 */
const HIDE_PRODUCTION_CHROME = [
  'body > nav[aria-label="Primary"], body > footer { display: none !important; }',
  'body { background: #f6f6f2; }',
  // Production CursorProvider (crosshair ring + dot) and the production skip link: not part of E.
  'html { cursor: auto !important; }',
  '[style*="ds-z-cursor"] { display: none !important; }',
  'body > a[href="#main-content"] { display: none !important; }',
  // Lenis recommended CSS (globals.css sets html { scroll-behavior: smooth }, which fights Lenis).
  'html.lenis, html.lenis body { height: auto; }',
  '.lenis.lenis-smooth { scroll-behavior: auto !important; }',
  '.lenis.lenis-stopped { overflow: hidden; }',
].join('\n');

export default function ConceptELayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      {FONTSHARE.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: HIDE_PRODUCTION_CHROME }} />
      <div className={mono.variable}>{children}</div>
    </>
  );
}
