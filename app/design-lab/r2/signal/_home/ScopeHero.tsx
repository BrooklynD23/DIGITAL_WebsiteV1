'use client';

/**
 * Signal Capture home hero: the page's one capture. Scroll is the timebase. The orb is scrubbed through
 * Plan → Prototype → Test → Integrate; the timebase ruler is a real range input (drag, click or arrow keys)
 * that moves the page, and the red trigger marker + cursor readout track the position. As the trigger leaves
 * the hero hold, the thesis column hands over to a large readout of the active stage.
 * Static state (no JS / reduced motion): no pin, the thesis, the rest pose, all four stage lines on the ruler.
 */
import Link from 'next/link';
import { createRef, useCallback, useMemo, useRef, type KeyboardEvent } from 'react';
import { DotStage, StateMark, type DotStageHandle } from '../../_system';
import { channels, hero, stages, thesis } from '../../_content/home';
import { useStageScrub, type StageAt } from '../../_home/useStageScrub';
import s from './home.module.css';

const LEAD = 0.1;
const HERO_OUT = 0.08;
const RANGE_MAX = 1000;
const toQ = (p: number): number => Math.min(1, Math.max(0, (p - LEAD) / (1 - LEAD)));

export function ScopeHero() {
  const section = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const refs = useMemo(() => stages.map(() => createRef<DotStageHandle>()), []);

  const onProgress = useCallback((p: number, at: StageAt) => {
    const el = input.current;
    if (el) {
      el.value = String(Math.round(toQ(p) * RANGE_MAX));
      el.setAttribute('aria-valuetext', `Stage ${at.i + 1} of 4: ${stages[at.i].name}`);
    }
    if (cursor.current) cursor.current.textContent = `T+${String(Math.round(p * 100)).padStart(3, '0')}%`;
    const sec = section.current;
    if (sec) sec.dataset.phase = p > HERO_OUT ? 'stages' : 'hero';
  }, []);

  const { enhanced, active, scrollToProgress, jumpTo } = useStageScrub(section, refs, { lead: LEAD, onProgress });
  const stage = stages[active];

  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    const next: Record<string, number> = {
      ArrowRight: active + 1, ArrowUp: active + 1, PageUp: active + 1,
      ArrowLeft: active - 1, ArrowDown: active - 1, PageDown: active - 1,
      Home: 0, End: stages.length - 1,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    jumpTo(Math.max(0, Math.min(stages.length - 1, next[e.key])));
  };

  return (
    <section ref={section} className={s.capture} data-enhanced={enhanced ? 'true' : undefined} data-phase="hero" aria-labelledby="hero-title">
      <div className={s.capturePin}>
        <div className={s.heroGrid}>
          <div className={s.leftCol}>
            <div className={s.heroCopy}>
              <h1 id="hero-title" className={s.thesis}>{thesis}</h1>
              <p className={s.lead}>{hero.lead}</p>
              <ul className={s.chStrip} aria-label="What DIGITAL builds">
                {channels.map((c) => (
                  <li key={c.id}>
                    <Link href={`/design-lab/r2/signal/${c.id}/`} className={s.chLink}>
                      <span className={s.chMark}>{c.ch}</span>
                      <span className={s.chName}>{c.name}</span>
                      <StateMark state="pending" size={20} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {enhanced ? (
              <div className={s.stageBig}>
                {stages.map((st, i) => (
                  <div key={st.id} className={s.stageBigItem} data-active={i === active ? 'true' : undefined}>
                    <span className={s.stageBigName}>{st.name}</span>
                    <span className={s.stageBigLine}>{st.line}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <figure className={s.scope}>
            <div className={s.readout}>
              <span>{`${stage.n}/04`}</span>
              <span ref={cursor} className={s.cursorRead} aria-hidden="true">T+000%</span>
            </div>
            <div className={s.orbStack}>
              {stages.map((st, i) => (
                <DotStage
                  key={st.id}
                  ref={refs[i]}
                  verb={st.verb}
                  size={520}
                  t={1}
                  seed={`home-${st.id}`}
                  anchor={st.id === 'integrate'}
                  label={`${st.name}: ${st.motion}`}
                  className={s.orb}
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              ))}
            </div>

            <figcaption className={s.timebase}>
              <div className={s.ruler} aria-hidden="true">
                <span className={s.traceDone} />
                <span className={s.marker} />
              </div>
              <ol className={s.divisions}>
                {stages.map((st, i) => (
                  <li key={st.id} data-active={i === active ? 'true' : undefined}>
                    {enhanced ? (
                      <button type="button" className={s.division} onClick={() => jumpTo(i)} aria-label={`Jump to ${st.name}: ${st.line}`}>
                        <span className={s.divName}>{st.name}</span>
                      </button>
                    ) : (
                      <span className={s.division}>
                        <span className={s.divName}>{st.name}</span>
                      </span>
                    )}
                    <span className={s.divLine}>{st.line}</span>
                  </li>
                ))}
              </ol>
              {enhanced ? (
                <input
                  ref={input}
                  type="range"
                  className={s.scrub}
                  min={0}
                  max={RANGE_MAX}
                  step={1}
                  defaultValue={0}
                  aria-label="Timebase: scrub the build stages"
                  aria-valuetext={`Stage 1 of 4: ${stages[0].name}`}
                  onChange={(e) => scrollToProgress(LEAD + (Number(e.currentTarget.value) / RANGE_MAX) * (1 - LEAD), false)}
                  onKeyDown={onKey}
                />
              ) : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
