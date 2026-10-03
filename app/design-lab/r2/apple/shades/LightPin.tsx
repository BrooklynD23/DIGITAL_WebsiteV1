'use client';

/**
 * Apple signature: the pinned light-path chapter. ONE progress drives both the scrubbed clip (ref.setProgress,
 * no React re-render per frame) and the caption (markerIndex on the same p: React state changes only when the
 * stage changes), so the caption never runs ahead of the packet. Until the clip is rendered, the light-path
 * diagram steps on the same index. Reduced motion / no JS: no pin; the full diagram and all six captions as a list.
 */
import { useCallback, useRef, useState } from 'react';
import { useScrollProgress } from '../../_system';
import { CineClip, markerIndex, type CineClipHandle } from '../../_system/cine';
import { SHADES } from '../../_content/shades';
import { LightPath } from '../../_shades/LightPath';
import s from './apple.module.css';

const L = SHADES.lightPath;
const N = L.stages.length;

function Captions({ className }: { readonly className: string }) {
  return (
    <ol className={className}>
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
  );
}

export function LightPin() {
  const ref = useRef<HTMLElement>(null);
  const clip = useRef<CineClipHandle>(null);
  const shown = useRef(0);
  const [step, setStep] = useState(0);

  const onProgress = useCallback((p: number) => {
    clip.current?.setProgress(p);
    const i = Math.max(0, markerIndex('shades-lightpath', p));
    if (i !== shown.current) {
      shown.current = i;
      setStep(i);
    }
  }, []);
  useScrollProgress(ref, { range: 'contain', onProgress, cssVar: false });

  const st = L.stages[step];

  return (
    <>
      <section ref={ref} id="light-path" className={s.lpin} data-tone="dark" aria-labelledby="ap-light">
        <div className={s.lpinStage}>
          <header className={s.lpinHead}>
            <h2 id="ap-light" className={s.h2}>{L.headline}</h2>
          </header>
          <div className={s.lpinFig}>
            {/* under-layer: same step index as the caption; covered once the video shows its frame */}
            <div className={s.lpinUnder} aria-hidden="true">
              <LightPath mode="step" active={step} note={false} />
            </div>
            <CineClip
              ref={clip}
              name="shades-lightpath"
              world="apple"
              mode="scrub"
              label={L.figureLabel}
            />
            <span className={s.clipNote} aria-hidden="true">
              {L.note}
            </span>
          </div>
          <p className={s.lpinCap}>
            <span className={s.capN} aria-hidden="true">
              {step + 1} / {N}
            </span>
            <span className={s.capLine}>
              {st.caption}
              {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
            </span>
          </p>
          <Captions className="sr-only" />
        </div>
      </section>

      <section className={s.lstatic} data-tone="dark" aria-labelledby="ap-light-static">
        <header className={s.chapterHead}>
          <h2 id="ap-light-static" className={s.h2}>{L.headline}</h2>
          <p className={s.lead}>{L.lead}</p>
        </header>
        <LightPath mode="step" />
        <Captions className={s.lstaticList} />
      </section>
    </>
  );
}
