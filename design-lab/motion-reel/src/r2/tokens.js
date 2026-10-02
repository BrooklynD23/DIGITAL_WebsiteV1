// Round-2 cinematics tokens. Values mirror app/design-lab/r2/_system/tokens/worlds.css (.world-signal).
// Clips are shared by both worlds, so they sit on the Signal ground; captions belong to the page.
export const C = Object.freeze({
  ground: '#0b0c0a',
  raised: '#121410',
  ink: '#ece8de', // bone
  ink2: '#a8a396',
  ink3: '#8c887d',
  phosphor: '#d4e4c6',
  hair: 'rgba(236,232,222,0.16)',
  hairStrong: 'rgba(236,232,222,0.32)',
  trigger: '#d8412f', // the one red: a single marker per clip, never text
});

export const FPS = 30;

/** Aspect variants. Every clip is registered twice: <Name>-16x9 and <Name>-4x5. */
export const ASPECTS = Object.freeze({
  '16x9': { width: 1920, height: 1080 },
  '4x5': { width: 1080, height: 1350 },
});
