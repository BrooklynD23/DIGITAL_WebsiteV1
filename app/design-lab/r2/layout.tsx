import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './_system/tokens/worlds.css';

export const metadata: Metadata = {
  title: 'Round 2 · DIGITAL design lab',
  description: 'Design lab round 2: Signal Capture and Apple-page worlds on one shared system.',
  robots: { index: false, follow: false },
};

// Lab-only: every r2 route ships its own chrome. Hide the production Navbar, Footer and skip link
// (app/layout.tsx is off-limits), and opt out of the production crosshair cursor overlay
// (its rAF loop is production code; only the overlay is hidden and the native cursor restored).
// Pages provide their own skip link to their own <main> content.
const HIDE_GLOBAL_CHROME = [
  'body > nav[aria-label="Primary"], body > footer, body > a[href="#main-content"] { display: none !important; }',
  'html { cursor: auto !important; }',
  '[style*="ds-z-cursor"] { display: none !important; }',
].join(' ');

export default function Round2Layout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      {children}
    </>
  );
}
