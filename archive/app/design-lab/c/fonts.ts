import { Martian_Mono } from 'next/font/google';

/**
 * Concept C type stack.
 * - Clash Display 600 (display) + General Sans (text): Fontshare CDN, one <link>
 *   per family in ./layout.tsx (ITF FFL forbids redistributing the files).
 * - Martian Mono (metadata): Google, self-hosted by next/font, narrowed via wdth.
 */
export const martianMono = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--c-font-mono',
});

export const FONTSHARE_HREFS: readonly string[] = ['clash-display@1', 'general-sans@1,2'].map(
  (f) => `https://api.fontshare.com/v2/css?f[]=${f}&display=swap`,
);
