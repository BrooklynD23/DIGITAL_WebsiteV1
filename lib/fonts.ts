import {
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Archivo,
  Hanken_Grotesk,
  DM_Mono,
} from 'next/font/google';

/**
 * The site's two font stacks (ui-revision D4).
 *
 * - **Landing stack** — Newsreader / IBM Plex Sans / IBM Plex Mono. Applied at
 *   `<body>` in `app/layout.tsx`; serves every route except the two immersive
 *   experiences, which re-declare the studio stack locally.
 * - **Studio stack** — Archivo / Hanken Grotesk / DM Mono. Consumed via the
 *   `font-display` / `font-body` / `font-mono` Tailwind families. Declared once
 *   here with `preload: false`; immersive route layouts apply its variables.
 *
 * Every route should load exactly three families in practice; measure and flip
 * `preload` per route only if FOUT is visible on an immersive page.
 *
 * NOTE: each loader must be called and assigned to a module-scope const for
 * the next/font transform.
 */

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-home-serif',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-home-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-home-mono',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  preload: false,
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  preload: false,
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  preload: false,
  display: 'swap',
});

export const landingFonts = {
  serif: newsreader,
  sans: ibmPlexSans,
  mono: ibmPlexMono,
} as const;

export const studioFonts = {
  display: archivo,
  body: hankenGrotesk,
  mono: dmMono,
} as const;
