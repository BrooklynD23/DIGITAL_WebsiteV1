'use client';

/**
 * Apple world home: the dark hero and the stage chapter are one pinned section (the page's one scrubbed asset).
 * First viewport: thesis + lead above the orb. Scrolling fades the thesis out, the orb rises to centre and
 * morphs Plan → Prototype → Test → Integrate with a one-line caption per stage and a 4-dot tracker.
 * Reduced motion / no JS: no pin; the thesis, then four stills with every caption (full parity).
 */
import { createRef, useCallback, useMemo, useRef } from 'react';
import { DotGlyph, DotStage, type DotStageHandle } from '../../_system';
import { hero, stages, thesis } from '../../_content/home';
import { useStageScrub } from '../../_home/useStageScrub';
import s from './home.module.css';

const LEAD = 0.12;
const HERO_OUT = 0.08;

export function StagePin() {
  const section = useRef<HTMLElement>(null);
  const refs = useMemo(() => stages.map(() => createRef<DotStageHandle>()), []);
  const onProgress = useCallback((p: number) => {
    const sec = section.current;
    if (sec) sec.dataset.phase = p > HERO_OUT ? 'stages' : 'hero';
  }, []);
  const { enhanced, active, jumpTo } = useStageScrub(section, refs, { lead: LEAD, onProgress });

  return (
    <section
      ref={section}
      id="stages"
      data-tone="dark"
      className={s.pin}
      data-enhanced={enhanced ? 'true' : undefined}
      aria-labelledby="hero-title"
    >
      <div className={s.pinSticky}>
        <div className={s.heroText}>
          <h1 id="hero-title" className={s.heroTitle}>{thesis}</h1>
          <p className={s.heroLead}>{hero.lead}</p>
        </div>

        {enhanced ? (
          <>
            <div className={s.orbStack}>
              {stages.map((st, i) => (
                <DotStage
                  key={st.id}
                  ref={refs[i]}
                  verb={st.verb}
                  size={440}
                  t={1}
                  seed={`apple-${st.id}`}
                  anchor={st.id === 'integrate'}
                  label={`${st.name}: ${st.motion}`}
                  className={s.orb}
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              ))}
            </div>
            <div className={s.captions}>
              {stages.map((st, i) => (
                <p key={st.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
                  <strong>{st.name}.</strong> {st.line}
                </p>
              ))}
            </div>
            <nav className={s.tracker} aria-label="Build stages">
              {stages.map((st, i) => (
                <button key={st.id} type="button" className={s.trackerBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)}>
                  <span className={s.trackerDot} aria-hidden="true" />
                  <span className={s.trackerLabel}>{st.name}</span>
                </button>
              ))}
            </nav>
          </>
        ) : (
          <ol className={s.stills} aria-label="The four build stages">
            {stages.map((st) => (
              <li key={st.id} className={s.still}>
                <DotGlyph verb={st.verb} size={160} seed={`apple-${st.id}`} anchor={st.id === 'integrate'} label={`${st.name}: ${st.motion}`} className={s.stillGlyph} />
                <p className={s.stillText}><strong>{st.name}.</strong> {st.line}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
