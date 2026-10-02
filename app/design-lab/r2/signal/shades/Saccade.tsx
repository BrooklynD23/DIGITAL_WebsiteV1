'use client';

/**
 * Signal signature: the scanpath chapter. A pinned stage whose eye-position trace jumps word to word,
 * then flattens into one fixation point as the visitor scrolls (CSS --p on view(); JS fallback; 0 rAF at rest).
 * No-JS and reduced motion: the pin is replaced by the two static states, side by side, with the same words.
 */
import { useRef } from 'react';
import { useScrollProgress } from '../../_system';
import { SHADES } from '../../_content/shades';
import { Scanpath } from '../../_shades/Scanpath';
import s from './signal.module.css';

const P = SHADES.problem;
const M = SHADES.method;

export function Saccade() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { range: 'contain' });
  return (
    <>
      <section ref={ref} className={s.pin} aria-labelledby="sh-jump">
        <div className={s.pinStage}>
          <div className={s.pinCopy}>
            <div className={s.capA}>
              <h2 id="sh-jump" className={s.h2}>{P.headline}</h2>
              <p className={s.lead}>{P.pinLead}</p>
            </div>
            <div className={s.capB}>
              <h2 className={s.h2}>{M.headline}</h2>
              <p className={s.lead}>{M.pinLead}</p>
            </div>
          </div>
          <figure className={s.pinFigure}>
            <Scanpath trace />
          </figure>
        </div>
      </section>

      <section className={s.pair} aria-label={`${P.headline} ${M.headline}`}>
        <div className={s.pairItem}>
          <h2 className={s.h2}>{P.headline}</h2>
          <p className={s.lead}>{P.lead}</p>
          <Scanpath trace k={0} />
        </div>
        <div className={s.pairItem}>
          <h2 className={s.h2}>{M.headline}</h2>
          <p className={s.lead}>{M.lead}</p>
          <Scanpath trace k={1} label={M.figureLabel} />
        </div>
      </section>
    </>
  );
}
