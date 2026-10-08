import {
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Condensed,
  JetBrains_Mono,
  Instrument_Serif,
  Instrument_Sans,
  Spline_Sans_Mono,
  Archivo,
  Martian_Mono,
  Fraunces,
  Figtree,
  Bricolage_Grotesque,
  Arimo,
  Fira_Sans_Condensed,
  Martel,
} from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Type-lab font loaders (design-lab only). Every loader is scoped to this
 * route: `preload: false` so the 17 families never leak preload hints into
 * other routes. Options are literal on purpose: next/font rejects spreads.
 * Fontshare families arrive via the <link> in ./layout.tsx.
 */


export const newsreader = Newsreader({ subsets: ['latin'], display: 'swap', preload: false, weight: ['400', '500'], style: ['normal', 'italic'], variable: '--tl-newsreader' });
export const plexSans = IBM_Plex_Sans({ subsets: ['latin'], display: 'swap', preload: false, weight: ['300', '400', '500', '600'], variable: '--tl-plex-sans' });
export const plexMono = IBM_Plex_Mono({ subsets: ['latin'], display: 'swap', preload: false, weight: ['400', '500'], variable: '--tl-plex-mono' });
export const plexCond = IBM_Plex_Sans_Condensed({ subsets: ['latin'], display: 'swap', preload: false, weight: ['500', '600', '700'], variable: '--tl-plex-cond' });
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], display: 'swap', preload: false, variable: '--tl-jetbrains' });
export const instrumentSerif = Instrument_Serif({ subsets: ['latin'], display: 'swap', preload: false, weight: '400', style: ['normal', 'italic'], variable: '--tl-instrument-serif' });
export const instrumentSans = Instrument_Sans({ subsets: ['latin'], display: 'swap', preload: false, variable: '--tl-instrument-sans' });
export const splineMono = Spline_Sans_Mono({ subsets: ['latin'], display: 'swap', preload: false, variable: '--tl-spline-mono' });
export const archivo = Archivo({ subsets: ['latin'], display: 'swap', preload: false, axes: ['wdth'], variable: '--tl-archivo' });
export const martianMono = Martian_Mono({ subsets: ['latin'], display: 'swap', preload: false, axes: ['wdth'], variable: '--tl-martian' });
export const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', preload: false, axes: ['SOFT', 'WONK', 'opsz'], style: ['normal', 'italic'], variable: '--tl-fraunces' });
export const figtree = Figtree({ subsets: ['latin'], display: 'swap', preload: false, variable: '--tl-figtree' });
export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', preload: false, axes: ['opsz', 'wdth'], variable: '--tl-bricolage' });
export const arimo = Arimo({ subsets: ['latin'], display: 'swap', preload: false, variable: '--tl-arimo' });
export const firaCond = Fira_Sans_Condensed({ subsets: ['latin'], display: 'swap', preload: false, weight: ['400', '500'], variable: '--tl-fira-cond' });
export const martel = Martel({ subsets: ['latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--tl-martel' });

/** Departure Mono (Helena Zhang, SIL OFL 1.1) — sourced via Fontesk listing, file from the official GitHub release v1.500. */
export const departureMono = localFont({
  src: './fonts/DepartureMono-Regular.woff2',
  variable: '--tl-departure',
  display: 'swap',
  preload: false,
});

export const typeLabFontVars = [
  newsreader, plexSans, plexMono, plexCond, jetbrains, instrumentSerif, instrumentSans, splineMono,
  archivo, martianMono, fraunces, figtree, bricolage, arimo, firaCond, martel, departureMono,
]
  .map((f) => f.variable)
  .join(' ');

/**
 * Fontshare CSS API — ITF Free Font License (FFL) families. One stylesheet per
 * family, variable cuts (`@1` = variable, `@2` = variable italic): combining
 * families or listing static weights in one request returned dropped/wrong
 * families when tested on 2026-10-02.
 */
export const FONTSHARE_HREFS: readonly string[] = [
  'zodiak@1,2',
  'switzer@1',
  'clash-display@1',
  'general-sans@1',
  'cabinet-grotesk@1',
  'satoshi@1',
  'tanker@400',
].map((f) => `https://api.fontshare.com/v2/css?f[]=${f}&display=swap`);
