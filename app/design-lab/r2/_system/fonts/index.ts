import localFont from 'next/font/local';
import './fonts.css';

/**
 * R2 recommended type stacks (W0-TYPE, 2026-10-02). Evidence: design-lab/round2/research/type-saas-faang.md
 * and the trial at /design-lab/r2/type. Every file is SIL OFL 1.1, self-hosted, licence file beside it.
 *
 * Usage: put one world class on a wrapper, then read the slots W0-SYS exposes.
 *   <div className={fontSignal}> … font-family: var(--font-display) … </div>
 *
 * Slots set by each class: --font-display / --font-text / --font-mono, plus --font-display-weight,
 * --font-display-stretch and per-size tracking --track-80/56/28/21/17 (tuned from the renders).
 * `preload: false` keeps lab routes from preloading each other's faces; flip the display face to
 * `preload: true` in whichever world ships.
 */

// Signal Capture — GitHub's brand trio
export const hubotSans = localFont({ src: './hubot-sans/HubotSans-latin-var.woff2', weight: '200 900', display: 'swap', preload: false, variable: '--fs-hubot', declarations: [{ prop: 'font-stretch', value: '75% 125%' }] });
export const monaSans = localFont({ src: './mona-sans/MonaSans-latin-var.woff2', weight: '200 900', display: 'swap', preload: false, variable: '--fs-mona', declarations: [{ prop: 'font-stretch', value: '75% 125%' }] });
/**
 * Latin subset (W3a): 445 KB → 41 KB. Basic Latin + Latin-1 + punctuation, arrows, math (≤ ≥ − × ≈), full wght axis.
 * Made with subset-font (harfbuzz) and noLayoutClosure, so texture-healing `calt` alternates are dropped
 * (readouts render the default glyphs). Source: MonaspaceKrypton-var.woff2 beside it (unreferenced, not shipped).
 */
export const monaspaceKrypton = localFont({ src: './monaspace/MonaspaceKrypton-latin-var.woff2', weight: '200 800', display: 'swap', preload: false, variable: '--fs-krypton' });

// Apple page played straight — Vercel's Geist pair
export const geist = localFont({ src: './geist/Geist-latin-var.woff2', weight: '100 900', display: 'swap', preload: false, variable: '--fs-geist' });
export const geistMono = localFont({ src: './geist-mono/GeistMono-latin-var.woff2', weight: '100 900', display: 'swap', preload: false, variable: '--fs-geist-mono' });

// SHADES reading face — Braille Institute
export const atkinsonNext = localFont({ src: './atkinson-hyperlegible-next/AtkinsonHyperlegibleNext-latin-var.woff2', weight: '200 800', display: 'swap', preload: false, variable: '--fs-atkinson' });

const cls = (...parts: readonly string[]): string => parts.join(' ');

/** Dark oscilloscope world: Hubot Sans display, Mona Sans text, Monaspace Krypton readouts. */
export const fontSignal = cls(hubotSans.variable, monaSans.variable, monaspaceKrypton.variable, 'font-signal');
/** Apple-page world: Geist display + text, Geist Mono spec lines. */
export const fontApple = cls(geist.variable, geistMono.variable, 'font-apple');
/** SHADES reading surfaces: Atkinson Hyperlegible Next for text (and RSVP word), Geist Mono for labels. */
export const fontReading = cls(atkinsonNext.variable, geistMono.variable, 'font-reading');
/**
 * SHADES pages inside a world (W3a): overrides ONLY --font-text (and the --font-read alias) with Atkinson, so the
 * world's display face and mono readouts stay. Pair: `world-signal ${fontSignal} ${fontReadingText}`.
 * Replaces atkinsonNext.variable + a page-local --font-read.
 */
export const fontReadingText = cls(atkinsonNext.variable, 'font-reading-text');
