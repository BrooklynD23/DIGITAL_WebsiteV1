'use client';

/**
 * Signal Capture home: the page's one capture, and the upgraded 4-stage strip in one instrument.
 * Scroll is the timebase. ONE dot stage is driven with the pin progress; its scene cuts (retriggers) from
 * Plan → Prototype → Test → Integrate. The timebase ruler is a real range input (drag, click, arrow keys) that
 * moves the page; the red trigger marker and cursor readout track it. As the trigger leaves the hero hold, the
 * thesis column hands over to the active stage and the ownership rule it enforces.
 *
 * The pinned layout ships in the server HTML and is switched on by CSS
 * (`@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`), so first paint = hydrated paint.
 * Reduced motion / no JS: the same DOM collapses to a still capture (thesis, Plan rest pose, every stage with
 * its line and rule on the ruler).
 */
import Link from 'next/link';
import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react';
import { DotStage, GlyphGate, GlyphHandoff, GlyphSeat, GlyphSwap, StateMark, useScrollSteps, type DotStageHandle, type StepAt } from '../../_system';
import { channels, hero, stages, thesis, type RuleGlyph } from '../../_content/home';
import { makeStageScene } from '../../_home/stageScene';
import s from './home.module.css';

const STEPS = { count: stages.length, lead: 0.1, playShare: 0.72 } as const;
const HERO_OUT = 0.08;
const RANGE_MAX = 1000;
const toQ = (p: number): number => Math.min(1, Math.max(0, (p - STEPS.lead) / (1 - STEPS.lead)));
const RULE_GLYPH: Record<RuleGlyph, typeof GlyphSeat> = { seat: GlyphSeat, handoff: GlyphHandoff, gate: GlyphGate, swap: GlyphSwap };

export function ScopeHero() {
  const section = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const stage = useRef<DotStageHandle>(null);
  const phase = useRef<'hero' | 'stages'>('hero');
  const scene = useMemo(() => makeStageScene('cut', STEPS), []);

  const onFrame = useCallback((p: number, at: StepAt) => {
    stage.current?.setProgress(p);
    const el = input.current;
    if (el) {
      el.value = String(Math.round(toQ(p) * RANGE_MAX));
      el.setAttribute('aria-valuetext', `Stage ${at.i + 1} of 4: ${stages[at.i].name}, ${stages[at.i].rule}`);
    }
    if (cursor.current) cursor.current.textContent = `T+${String(Math.round(p * 100)).padStart(3, '0')}%`;
    const next = p > HERO_OUT ? 'stages' : 'hero';
    if (next !== phase.current && section.current) {
      phase.current = next;
      section.current.dataset.phase = next;
    }
  }, []);

  const { enhanced, active, scrollToProgress, jumpTo } = useScrollSteps(section, { ...STEPS, onFrame });

  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    const fwd = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(e.key);
    const back = ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(e.key);
    if (!fwd && !back && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (e.key === 'Home') return jumpTo(0);
    if (e.key === 'End') return jumpTo(stages.length - 1);
    // From the hero hold, the first step forward lands on Plan (not past it).
    const from = phase.current === 'hero' ? -1 : active;
    jumpTo(Math.max(0, Math.min(stages.length - 1, from + (fwd ? 1 : -1))));
  };

  const st = stages[active];

  return (
    <section ref={section} className={s.capture} data-phase="hero" aria-labelledby="hero-title">
      <div className={s.capturePin}>
        <div className={s.heroGrid}>
          <div className={s.leftCol}>
            <div className={s.heroCopy}>
              <h1 id="hero-title" className={s.thesis}>{thesis}</h1>
              <p className={s.lead}>{hero.lead}</p>
              <ul className={s.chStrip} aria-label="What DIGITAL builds">
                {channels.map((c) => (
                  <li key={c.id}>
                    <Link href={`/design-lab/r2/signal/${c.id}/`} prefetch={false} className={s.chLink}>
                      <span className={s.chMark}>{c.ch}</span>
                      <span className={s.chName}>{c.name}</span>
                      <StateMark state="pending" size={20} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.stageBig}>
              {stages.map((x, i) => {
                const G = RULE_GLYPH[x.glyph];
                return (
                  <div key={x.id} className={s.stageBigItem} data-active={i === active ? 'true' : undefined}>
                    <span className={s.stageBigName}>{x.name}</span>
                    <span className={s.stageBigRule}>
                      <G size={24} className={s.ruleGlyph} />
                      {x.rule}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <figure className={s.scope}>
            <div className={s.readout}>
              <span>{`${st.n}/04`}</span>
              <span ref={cursor} className={s.cursorRead} aria-hidden="true">T+000%</span>
            </div>
            <div className={s.orbStack}>
              <DotStage
                ref={stage}
                verb="form"
                size={520}
                t={0}
                scene={scene}
                seed="home-signal"
                label={`${st.name}: ${st.motion}`}
                className={s.orb}
              />
            </div>

            <figcaption className={s.timebase}>
              <div className={s.ruler} aria-hidden="true">
                <span className={s.traceDone} />
                <span className={s.marker} />
              </div>
              <ol className={s.divisions}>
                {stages.map((x, i) => (
                  <li key={x.id} data-active={i === active ? 'true' : undefined}>
                    <button type="button" className={s.division} onClick={() => jumpTo(i)} disabled={!enhanced} aria-label={`Jump to ${x.name}: ${x.rule}`}>
                      <span className={s.divName}>{x.name}</span>
                    </button>
                    <span className={s.divLine}>{x.line}</span>
                    <span className={s.divRule}>{x.rule}</span>
                  </li>
                ))}
              </ol>
              <input
                ref={input}
                type="range"
                className={s.scrub}
                min={0}
                max={RANGE_MAX}
                step={1}
                defaultValue={0}
                disabled={!enhanced}
                aria-label="Timebase: scrub the build stages"
                aria-valuetext={`Stage 1 of 4: ${stages[0].name}, ${stages[0].rule}`}
                onChange={(e) => scrollToProgress(STEPS.lead + (Number(e.currentTarget.value) / RANGE_MAX) * (1 - STEPS.lead), false)}
                onKeyDown={onKey}
              />
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
