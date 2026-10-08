import {
  Inter,
  JetBrains_Mono,
  Roboto_Flex,
  Roboto_Mono,
  Red_Hat_Display,
  Red_Hat_Text,
  Red_Hat_Mono,
  Lexend,
} from 'next/font/google';
import localFont from 'next/font/local';

/**
 * R2 type-trial loaders (design-lab only, `preload: false` so nothing leaks to other routes).
 * Google-hosted faces go through next/font/google (self-hosted at build). Faces missing from
 * Next 14.2's font list (Geist, Mona/Hubot Sans, Google Sans Flex/Code, Monaspace, Mozilla,
 * Atkinson Hyperlegible Next) are OFL woff2 files under ../_system/fonts/<family>/ with their
 * licence file beside them. Options are literal on purpose: next/font rejects spreads.
 */

// Vercel / Geist design system
export const geist = localFont({ src: '../_system/fonts/geist/Geist-latin-var.woff2', weight: '100 900', display: 'swap', preload: false, variable: '--t-geist' });
export const geistMono = localFont({ src: '../_system/fonts/geist-mono/GeistMono-latin-var.woff2', weight: '100 900', display: 'swap', preload: false, variable: '--t-geist-mono' });

// GitHub / Primer brand
export const monaSans = localFont({ src: '../_system/fonts/mona-sans/MonaSans-latin-var.woff2', weight: '200 900', display: 'swap', preload: false, variable: '--t-mona', declarations: [{ prop: 'font-stretch', value: '75% 125%' }] });
export const hubotSans = localFont({ src: '../_system/fonts/hubot-sans/HubotSans-latin-var.woff2', weight: '200 900', display: 'swap', preload: false, variable: '--t-hubot', declarations: [{ prop: 'font-stretch', value: '75% 125%' }] });
export const monaspaceKrypton = localFont({ src: '../_system/fonts/monaspace/MonaspaceKrypton-var.woff2', weight: '200 800', display: 'swap', preload: false, variable: '--t-krypton' });

// Google / Material 3 Expressive
export const googleSansFlex = localFont({ src: '../_system/fonts/google-sans-flex/GoogleSansFlex-latin-var.woff2', weight: '1 1000', display: 'swap', preload: false, variable: '--t-gsflex' });
export const googleSansCode = localFont({ src: '../_system/fonts/google-sans-code/GoogleSansCode-latin-var.woff2', weight: '300 800', display: 'swap', preload: false, variable: '--t-gscode' });
export const robotoFlex = Roboto_Flex({ subsets: ['latin'], display: 'swap', preload: false, axes: ['opsz', 'wdth'], variable: '--t-roboto-flex' });
export const robotoMono = Roboto_Mono({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-roboto-mono' });

// Linear / Shopify Polaris / Atlassian (Inter-derived) — Inter v4 with the opsz (Display) axis
export const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false, axes: ['opsz'], variable: '--t-inter' });
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-jetbrains' });

// Red Hat brand
export const redHatDisplay = Red_Hat_Display({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-rh-display' });
export const redHatText = Red_Hat_Text({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-rh-text' });
export const redHatMono = Red_Hat_Mono({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-rh-mono' });

// Mozilla 2025 brand
export const mozillaHeadline = localFont({ src: '../_system/fonts/mozilla-headline/MozillaHeadline-latin-var.woff2', weight: '200 700', display: 'swap', preload: false, variable: '--t-moz-head', declarations: [{ prop: 'font-stretch', value: '75% 100%' }] });
export const mozillaText = localFont({ src: '../_system/fonts/mozilla-text/MozillaText-latin-var.woff2', weight: '200 700', display: 'swap', preload: false, variable: '--t-moz-text' });

// SHADES reading candidates
export const atkinsonNext = localFont({ src: '../_system/fonts/atkinson-hyperlegible-next/AtkinsonHyperlegibleNext-latin-var.woff2', weight: '200 800', display: 'swap', preload: false, variable: '--t-atkinson' });
export const lexend = Lexend({ subsets: ['latin'], display: 'swap', preload: false, variable: '--t-lexend' });

export const trialFontVars = [
  geist, geistMono, monaSans, hubotSans, monaspaceKrypton, googleSansFlex, googleSansCode, robotoFlex,
  robotoMono, inter, jetbrainsMono, redHatDisplay, redHatText, redHatMono, mozillaHeadline, mozillaText,
  atkinsonNext, lexend,
]
  .map((f) => f.variable)
  .join(' ');
