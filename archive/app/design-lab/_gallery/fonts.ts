import {
  Bricolage_Grotesque,
  Caveat,
  Figtree,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
  JetBrains_Mono,
  Martian_Mono,
} from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Gallery type specimens, loaded the same way each concept loads them:
 * Google faces through next/font (self-hosted, OFL), Departure Mono from a local OFL woff2 (copied from F),
 * Fontshare faces through one CDN <link> per family (ITF FFL forbids committing the files).
 * Every face uses preload:false, so a file is fetched only when a visible specimen uses it
 * (with JS, only the selected concept's panel is visible). next/font needs literal options, hence the repetition.
 */
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
  variable: '--g-jetbrains',
});
const plexCond = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['600'],
  variable: '--g-plex-cond',
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '600'],
  variable: '--g-plex-sans',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
  variable: '--g-plex-mono',
});
const martian = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  axes: ['wdth'],
  variable: '--g-martian',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--g-fraunces',
});
const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--g-figtree',
});
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['500'],
  variable: '--g-caveat',
});
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  axes: ['opsz', 'wdth'],
  variable: '--g-bricolage',
});
const departure = localFont({
  src: './fonts/DepartureMono-Regular.woff2',
  display: 'swap',
  preload: false,
  variable: '--g-departure',
});

export const galleryFontVars = [
  jetbrains,
  plexCond,
  plexSans,
  plexMono,
  martian,
  fraunces,
  figtree,
  caveat,
  bricolage,
  departure,
]
  .map((f) => f.variable)
  .join(' ');

/** One stylesheet per family: combined Fontshare requests drop families (research/fonts.md). */
export const FONTSHARE_HREFS: readonly string[] = [
  'zodiak@400,401',
  'switzer@1',
  'clash-display@1',
  'general-sans@1,2',
  'cabinet-grotesk@700,800',
  'satoshi@400,500,700',
].map((f) => `https://api.fontshare.com/v2/css?f[]=${f}&display=swap`);
