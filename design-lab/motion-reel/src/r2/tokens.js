import { createContext, useContext } from 'react';

// Round-2 cinematics palettes. Values mirror app/design-lab/r2/_system/tokens/worlds.css:
//   signal = .world-signal (near-black graticule ground, bone ink)
//   apple  = .world-apple [data-tone='dark'] (#000 chapters, Apple greys, copper board line art
//            = apple/sidekick's --board-copper on dark, #c9965f)
// One red (#d8412f) in both: a single marker per clip, never text. Captions belong to the page.
export const PALETTES = Object.freeze({
  signal: Object.freeze({
    ground: '#0b0c0a',
    raised: '#121410',
    ink: '#ece8de',
    ink2: '#a8a396',
    ink3: '#8c887d',
    hair: 'rgba(236,232,222,0.16)',
    hairStrong: 'rgba(236,232,222,0.32)',
    copper: '#c9c2b0', // Signal draws copper as a dimmer bone (line form, not hue, carries meaning)
    silk: '#a8a396',
    trigger: '#d8412f',
  }),
  apple: Object.freeze({
    ground: '#000000',
    raised: '#161617',
    ink: '#f5f5f7',
    ink2: '#a1a1a6',
    ink3: '#86868b',
    hair: 'rgba(245,245,247,0.16)',
    hairStrong: 'rgba(245,245,247,0.32)',
    copper: '#c9965f',
    silk: '#a1a1a6',
    trigger: '#d8412f',
  }),
});

export const WORLDS = Object.freeze(['signal', 'apple']);

/** Legacy alias (Signal). Components read the active palette with useC(). */
export const C = PALETTES.signal;

export const PaletteContext = createContext(PALETTES.signal);
export const useC = () => useContext(PaletteContext);

export const FPS = 30;

/** Aspect variants. Every clip registers as <name>--<aspect> (signal) and <name>--apple--<aspect>. */
export const ASPECTS = Object.freeze({
  '16x9': { width: 1920, height: 1080 },
  '4x5': { width: 1080, height: 1350 },
});
