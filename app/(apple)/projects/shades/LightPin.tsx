'use client';

/**
 * Apple signature: the pinned light-path chapter. ONE pinned section, one figure, six stages.
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and writes it to the
 * figure as --pos, which draws the ray to the next station and hands the emphasis over (../../_shades/LightPath,
 * mode "play"). Timed, interruptible, never scrubbed; native scroll is untouched. No per-frame React state.
 *
 * Reduced motion / no JS: no pin; the six stations as a stacked list, each with its caption.
 */
import { useRef } from 'react';
import { useScrollSteps } from '../../_system';
import { SHADES } from '../../_content/shades';
import { LightPath, StationIcon } from '../../_shades/LightPath';
import { useStagePlayback } from '../_hero/useStagePlayback';
import s from './apple.module.css';

const L = SHADES.lightPath;
const N = L.stages.length;
const STEPS = { count: N, lead: 0, playShare: 0.72 } as const;

export function LightPin() {
  const pin = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const { enhanced, active, jumpTo } = useScrollSteps(pin, STEPS);

  useStagePlayback(active, N, 1100, (pos) => {
    fig.current?.style.setProperty('--pos', pos.toFixed(4));
  });

  return (
    <section id="light-path" className={s.lpin} data-tone="dark" aria-labelledby="ap-light">
      {/* the pin is measured without the section's black tail, so the last stage rests while still pinned */}
      <div ref={pin} className={s.lpinPin}>
        <div className={s.lpinStage}>
        <header className={s.lpinHead}>
          <h2 id="ap-light" className={s.h2}>{L.headline}</h2>
          <p className={`${s.lead} ${s.lpinLead}`}>{L.lead}</p>
        </header>

        <div ref={fig} className={s.lpinFig}>
          <LightPath mode="play" active={active} className={s.lpinPath} />
        </div>

        <div className={s.lpinBand}>
          <div className={s.lpinCaps}>
            {L.stages.map((st, i) => (
              <div key={st.id} className={s.lpinCap} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
                <h3 className={s.capName}>{st.name}</h3>
                <p className={s.capLine}>{st.caption}</p>
              </div>
            ))}
          </div>
          <nav className={s.tracker} aria-label={L.headline}>
            {L.stages.map((st, i) => (
              <button key={st.id} type="button" className={s.trackBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)} disabled={!enhanced}>
                <span className={s.trackDot} aria-hidden="true" />
                <span className="sr-only">{st.name}</span>
              </button>
            ))}
          </nav>
          <p className={s.lpinFoot}>
            <span aria-hidden="true">
              {active + 1} / {N} ·{' '}
            </span>
            {L.note}
          </p>
        </div>

        {!enhanced && (
          <>
            <ol className={s.lstaticList}>
              {L.stages.map((st) => (
                <li key={st.id}>
                  <StationIcon id={st.id} className={s.lstaticIcon} />
                  <div>
                    <h3 className={s.capName}>{st.name}</h3>
                    <p className={s.capLine}>{st.caption}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={s.lstaticNote}>{L.note}</p>
          </>
        )}
        </div>
      </div>
    </section>
  );
}
