import { continueRender, delayRender } from 'remotion';
// Self-hosted lab faces (OFL), imported as assets from the shared font folder.
import monoUrl from '../../../../app/design-lab/r2/_system/fonts/geist-mono/GeistMono-latin-var.woff2';
import readingUrl from '../../../../app/design-lab/r2/_system/fonts/atkinson-hyperlegible-next/AtkinsonHyperlegibleNext-latin-var.woff2';

export const FONT = Object.freeze({ mono: 'R2CineMono', reading: 'R2CineReading' });

const handle = delayRender('r2 cine fonts');
Promise.all([
  new FontFace(FONT.mono, `url(${monoUrl}) format('woff2')`, { weight: '100 900' }).load(),
  new FontFace(FONT.reading, `url(${readingUrl}) format('woff2')`, { weight: '200 800' }).load(),
])
  .then((faces) => {
    faces.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })
  .catch((err) => {
    console.error('r2 cine font load failed', err);
    continueRender(handle);
  });
