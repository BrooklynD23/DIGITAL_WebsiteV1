import { Caveat, Figtree, Fraunces, IBM_Plex_Mono } from 'next/font/google';

/**
 * Concept D font loaders (design-lab only, scoped to /design-lab/d).
 * Display: Fraunces (SOFT 100, WONK 1, opsz 144) · Body: Figtree ·
 * Meta: IBM Plex Mono · Margin notes only: Caveat.
 */
export const dDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--d-font-display',
});

export const dBody = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--d-font-body',
});

export const dMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
  variable: '--d-font-mono',
});

export const dHand = Caveat({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['500', '600'],
  variable: '--d-font-hand',
});

export const dFontVars = [dDisplay, dBody, dMono, dHand].map((f) => f.variable).join(' ');
