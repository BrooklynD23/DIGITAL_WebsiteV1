'use client';

/**
 * Apple signature: the pinned light-path chapter. One scrubbed asset per page: clip shades-lightpath
 * (currentTime follows scroll) or, until it is rendered, the light-path diagram driven by CSS --k.
 * One caption per stage swaps in place. Reduced motion / no JS: no pin, the full diagram and all six captions as a list.
 */
import { useRef, useState, type CSSProperties } from 'react';
import { useScrollProgress } from '../../_system';
import { CINE, CineClip } from '../../_system/cine';
import { SHADES } from '../../_content/shades';
import { LightPath } from '../../_shades/LightPath';
import s from './apple.module.css';

const L = SHADES.lightPath;
const N = L.stages.length;
const CLIP_READY = CINE['shades-lightpath'].ready;

export function LightPin() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  // CSS-only drive for the diagram; a JS drive only when the clip exists and needs currentTime.
  useScrollProgress(ref, CLIP_READY ? { range: 'contain', onProgress: setP } : { range: 'contain' });

  return (
    <>
      <section ref={ref} id="light-path" className={s.lpin} data-tone="dark" aria-labelledby="ap-light">
        <div className={s.lpinStage}>
          <header className={s.lpinHead}>
            <h2 id="ap-light" className={s.h2}>{L.headline}</h2>
          </header>
          <div className={s.lpinFig}>
            <CineClip
              name="shades-lightpath"
              mode="scrub"
              progress={p}
              label={L.figureLabel}
              fallback={<LightPath mode="scrub" />}
            />
            {CLIP_READY ? (
              // In-figure label, as in the SVG fallback; the clip's accessible name starts with "Diagram, not a render".
              <span className={s.clipNote} aria-hidden="true">
                {L.note}
              </span>
            ) : null}
          </div>
          <ol className={s.lpinCaps}>
            {L.stages.map((st, i) => (
              <li
                key={st.id}
                className={s.lpinCap}
                style={{ ['--t' as string]: (i / N).toFixed(3), ['--tn' as string]: i === N - 1 ? '9' : ((i + 1) / N).toFixed(3) } as CSSProperties}
              >
                <span className={s.capN} aria-hidden="true">
                  {i + 1} / {N}
                </span>
                <span className={s.capLine}>
                  {st.caption}
                  {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.lstatic} data-tone="dark" aria-labelledby="ap-light-static">
        <header className={s.chapterHead}>
          <h2 id="ap-light-static" className={s.h2}>{L.headline}</h2>
          <p className={s.lead}>{L.lead}</p>
        </header>
        <LightPath mode="step" />
        <ol className={s.lstaticList}>
          {L.stages.map((st, i) => (
            <li key={st.id}>
              <span className={s.capN}>
                {i + 1} · {st.name}
              </span>
              <span className={s.capLine}>
                {st.caption}
                {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
