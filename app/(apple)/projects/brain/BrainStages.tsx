'use client';

/**
 * BRAIN · Apple page: ONE pinned section, one canvas figure, seven stages (the hero, then six lessons).
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and the figure morphs
 * between the two neighbouring scenes (../../_brain/lessons). Native scroll is untouched.
 * At rest the active figure loops on a clock that runs only while the stage is on screen, the tab is visible and the
 * pause button is off (0 rAF otherwise). No per-frame React state.
 *
 * Reduced motion / no JS: the same captions stack in normal flow, each with its still (full parity, no pin).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { DotGlyph, paintFrame, subscribeTick, useScrollSteps, type Inks } from '../../_system';
import { story } from '../../_content/brain';
import { pct } from '../../_brain/kit';
import { STAGE_COUNT, lessonFrame, lessonStill } from '../../_brain/lessons';
import { useStagePlayback } from '../_hero/useStagePlayback';
import s from './stages.module.css';

const STEPS = { count: STAGE_COUNT, lead: 0, playShare: 0.72 } as const;
const STILL = 320;
const { hero, lessons, nav } = story;

export function BrainStages() {
  const section = useRef<HTMLElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef({ pos: 0, time: 0, last: -1, size: 0, dpr: 1, inks: null as Inks | null, unsub: null as null | (() => void), onScreen: false, paused: false });
  const [paused, setPaused] = useState(false);
  const { enhanced, active, jumpTo } = useScrollSteps(section, STEPS);

  const paint = useCallback(() => {
    const S = st.current;
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx || S.size < 1) return;
    const want = Math.round(S.size * S.dpr);
    if (c.width !== want) {
      c.width = want;
      c.height = want;
    }
    if (!S.inks) {
      const cs = getComputedStyle(c);
      S.inks = { ink: cs.color, trigger: cs.getPropertyValue('--r2-trigger').trim() || '#d8412f' };
    }
    paintFrame(ctx, lessonFrame(S.pos, S.time, S.size), S.size, S.dpr, S.inks);
  }, []);

  /** Start or stop the loop clock so it runs only when it can be seen and is not paused. */
  const sync = useCallback(() => {
    const S = st.current;
    const run = S.onScreen && !S.paused && !document.hidden;
    if (run && !S.unsub) {
      S.last = -1;
      S.unsub = subscribeTick((now) => {
        S.time += S.last < 0 ? 0 : Math.min(64, now - S.last);
        S.last = now;
        paint();
        return true;
      });
    } else if (!run && S.unsub) {
      S.unsub();
      S.unsub = null;
    }
  }, [paint]);

  useStagePlayback(active, STEPS.count, 900, (pos) => {
    st.current.pos = pos;
    if (!st.current.unsub) paint(); // paused: the transition still plays, the loop stays frozen
  });

  useEffect(() => {
    const el = fig.current;
    const S = st.current;
    if (!enhanced || !el) return undefined;
    S.dpr = Math.min(2, window.devicePixelRatio || 1);
    const ro = new ResizeObserver(([e]) => {
      S.size = Math.round(e.contentRect.width);
      paint();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      S.onScreen = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      S.onScreen = false;
      sync();
    };
  }, [enhanced, paint, sync]);

  const toggle = (): void => {
    st.current.paused = !paused;
    setPaused(!paused);
    sync();
  };

  const stages = [{ id: 'hero', alt: hero.alt, line: hero.lead, labels: [] }, ...lessons];

  return (
    <section ref={section} id="lessons" className={s.pin} aria-labelledby="brain-hero">
      <div className={s.sticky}>
        <div className={s.captions}>
          {stages.map((x, i) => (
            <div key={x.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={enhanced && i !== active ? true : undefined}>
              <div className={s.still} role="img" aria-label={x.alt}>
                <DotGlyph verb="fill" frameData={lessonStill(i, STILL)} size={STILL} />
              </div>
              {i === 0 ? (
                <h1 id="brain-hero" className={s.h1}>
                  {hero.beats.map((b) => (
                    <span key={b} className={s.beat}>
                      {b}
                    </span>
                  ))}
                </h1>
              ) : (
                <h2 className={s.h2}>{lessons[i - 1].topic}</h2>
              )}
              <p className={s.line}>{x.line}</p>
            </div>
          ))}
        </div>

        <div className={s.figBox}>
          <div ref={fig} className={s.fig} role="img" aria-label={stages[active].alt}>
            <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
            {lessons.map((x, i) =>
              x.labels.map((l) => (
                <span key={`${x.id}-${l.text}`} className={s.tag} data-active={i + 1 === active ? 'true' : undefined} style={{ left: pct(l.x), top: pct(l.y) }} aria-hidden="true">
                  {l.text}
                </span>
              )),
            )}
          </div>
        </div>

        <div className={s.bar}>
          <nav className={s.tracker} aria-label={nav.tracker}>
            {lessons.map((x, i) => (
              <button key={x.id} type="button" className={s.trackBtn} aria-current={i + 1 === active ? 'step' : undefined} onClick={() => jumpTo(i + 1)} disabled={!enhanced}>
                <span className={s.trackDot} aria-hidden="true" />
                <span className={s.trackName}>{x.short}</span>
              </button>
            ))}
          </nav>
          <button type="button" className={s.pause} onClick={toggle} aria-label={paused ? nav.play : nav.pause} disabled={!enhanced}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <path d={paused ? 'M5 3.5v9l7.5-4.5z' : 'M5 3.5v9M11 3.5v9'} />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
