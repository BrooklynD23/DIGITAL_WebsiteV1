import { landingFonts, studioFonts } from '@/lib/fonts';

/**
 * Font variables + base type/colour for the legacy (pre-Apple-world) pages. Lived on <body> until the Apple
 * world became the default routes; now applied on a wrapper by app/(legacy)/layout.tsx and by the root
 * error / not-found pages, which render outside that layout.
 */
export const legacyShell = [
  landingFonts.serif.variable,
  landingFonts.sans.variable,
  landingFonts.mono.variable,
  // Studio stack: consumed by legacy routes not migrated onto the landing system.
  studioFonts.display.variable,
  studioFonts.body.variable,
  studioFonts.mono.variable,
  'font-homeSans text-dg-ink bg-dg-bg',
].join(' ');
