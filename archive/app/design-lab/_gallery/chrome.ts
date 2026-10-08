/**
 * Lab-only: the production Navbar/Footer/crosshair cursor render on every route (lib/immersiveRoutes.ts is off-limits).
 * The gallery pages draw their own chrome, so hide the global chrome while a [data-lab-gallery] root is mounted.
 * Same pattern as app/design-lab/{a..f}/layout.tsx. Cleaner production fix: add '/design-lab' to IMMERSIVE_PREFIXES.
 */
export const GALLERY_CHROME_CSS = [
  'body:has([data-lab-gallery]) > nav[aria-label="Primary"], body:has([data-lab-gallery]) > footer { display: none !important; }',
  'body:has([data-lab-gallery]) { background: #f4f4f3 !important; }',
  'html:has([data-lab-gallery]) { cursor: auto !important; }',
  'html:has([data-lab-gallery]) [style*="ds-z-cursor"] { display: none !important; }',
].join('\n');
