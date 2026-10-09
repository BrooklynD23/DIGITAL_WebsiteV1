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
  // Overscroll / rubber-band and any gap below short pages show the world's ground, not the production page
  // background. Apple's ground is its light end chapter + footer; Signal's is near-black. Signal wins when both
  // exist on a page (the /system specimen is Signal-rooted).
  'html:has(.world-apple), html:has(.world-apple) body { background: #f5f5f7 !important; color-scheme: light; }',
  'html:has(.world-signal), html:has(.world-signal) body { background: #0b0c0a !important; color-scheme: dark; }',
].join(' ');

// Lab-only: keep the production CursorProvider from starting its permanent 60/s rAF loop on r2 routes
// (critiques: 180 callbacks / 3 s at rest). It mounts only when this exact media query matches, so on r2 paths
// the query reports "no fine hover" to that one caller. Runs during HTML parse, before the provider's effect.
// Production code and every other query are untouched; nothing in r2 uses this query.
const CURSOR_OPT_OUT = `(function(){try{var q='(any-hover: hover) and (pointer: fine)';var mm=window.matchMedia.bind(window);window.matchMedia=function(s){if(s===q&&location.pathname.indexOf('/design-lab/r2')===0)return mm('not all');return mm(s);};}catch(e){}})();`;

export default function Round2Layout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: CURSOR_OPT_OUT }} />
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      {children}
    </>
  );
}
