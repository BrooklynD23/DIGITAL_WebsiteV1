'use client';

/**
 * Signal light-path band: one short timebase. The strip pins for ~1.5 viewports of scroll; the trace advances
 * station to station (useScrollSteps, 0 rAF at rest) and ONE caption line swaps in place under the strip, like a
 * scope's measurement readout. The lit station and the caption always come from the same step index.
 * Not enhanced (no JS, reduced motion, before hydration): the full path, all lit, with the six captions as a list.
 */
import { useRef } from 'react';
import { useScrollSteps } from '../../_system';
import { SHADES } from '../../_content/shades';
import { LightPath } from '../../_shades/LightPath';
import s from './signal.module.css';

const L = SHADES.lightPath;
const N = L.stages.length;
const n2 = (i: number): string => String(i + 1).padStart(2, '0');

function StageList({ className }: { readonly className: string }) {
  return (
    <ol className={className}>
      {L.stages.map((st, i) => (
        <li key={st.id}>
          <span className={s.capIndex} aria-hidden="true">{n2(i)}</span> <span className={s.capName}>{st.name}</span>{' '}
          <span className={s.capLine}>
            {st.caption}
            {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Band() {
  const pin = useRef<HTMLDivElement>(null);
  const { enhanced, active } = useScrollSteps(pin, { count: N });
  const st = L.stages[active] ?? L.stages[0];

  return (
    <section id="light-path" className={s.band} aria-labelledby="sh-light">
      <header className={s.bandHead}>
        <h2 id="sh-light" className={s.h2}>{L.headline}</h2>
        <p className={s.lead}>{L.lead}</p>
      </header>
      <div ref={pin} className={s.bandPin} data-enhanced={enhanced ? 'true' : undefined}>
        <div className={s.bandStage}>
          <LightPath mode="step" active={enhanced ? active : null} className={s.bandFigure} />
          {enhanced ? (
            <>
              <p className={s.bandCaption}>
                <span className={s.capIndex} aria-hidden="true">
                  {n2(active)}/{String(N).padStart(2, '0')}
                </span>
                <span className={s.capLine}>
                  {st.caption}
                  {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
                </span>
              </p>
              <StageList className="sr-only" />
            </>
          ) : (
            <StageList className={s.stagesStatic} />
          )}
        </div>
      </div>
    </section>
  );
}
