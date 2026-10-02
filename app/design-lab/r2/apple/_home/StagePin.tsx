'use client';

/**
 * Apple world home: the dark hero and the stage chapter are one pinned section (the page's one scrubbed asset).
 * First viewport: thesis + lead above the orb, which rests in its finished Plan pose. Scrolling fades the thesis,
 * the orb rises to centre and MORPHS (every dot travels, one stage) Plan → Prototype → Test → Integrate.
 * Each stage shows the ownership rule it enforces; captions swap out-then-in (never two lines at once).
 *
 * The pin ships in the server HTML and is switched on by CSS
 * (`@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`): first paint = hydrated paint.
 * Reduced motion / no JS: the thesis, then four stills, each with its line and rule (full parity).
 */
import { useCallback, useMemo, useRef } from 'react';
import { DotGlyph, DotStage, GlyphGate, GlyphHandoff, GlyphSeat, GlyphSwap, useScrollSteps, type DotStageHandle } from '../../_system';
import { hero, stages, thesis, type RuleGlyph } from '../../_content/home';
import { makeStageScene } from '../../_home/stageScene';
import s from './home.module.css';

const STEPS = { count: stages.length, lead: 0.12, playShare: 0.72 } as const;
const HERO_OUT = 0.08;
const RULE_GLYPH: Record<RuleGlyph, typeof GlyphSeat> = { seat: GlyphSeat, handoff: GlyphHandoff, gate: GlyphGate, swap: GlyphSwap };

export function StagePin() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<DotStageHandle>(null);
  const phase = useRef<'hero' | 'stages'>('hero');
  const scene = useMemo(() => makeStageScene('morph', STEPS), []);

  const onFrame = useCallback((p: number) => {
    stage.current?.setProgress(p);
    const next = p > HERO_OUT ? 'stages' : 'hero';
    if (next !== phase.current && section.current) {
      phase.current = next;
      section.current.dataset.phase = next;
    }
  }, []);
  const { enhanced, active, jumpTo } = useScrollSteps(section, { ...STEPS, onFrame });
  const st = stages[active];

  return (
    <section ref={section} id="stages" data-tone="dark" className={s.pin} data-phase="hero" aria-labelledby="hero-title">
      <div className={s.pinSticky}>
        <div className={s.heroText}>
          <h1 id="hero-title" className={s.heroTitle}>{thesis}</h1>
          <p className={s.heroLead}>{hero.lead}</p>
        </div>

        <div className={s.orbStack}>
          <DotStage ref={stage} verb="form" size={440} t={0} scene={scene} seed="home-apple" label={`${st.name}: ${st.motion}`} className={s.orb} />
        </div>
        <div className={s.captions}>
          {stages.map((x, i) => {
            const G = RULE_GLYPH[x.glyph];
            return (
              <div key={x.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
                <G size={32} className={s.captionGlyph} />
                <p className={s.captionText}><strong>{x.name}.</strong> {x.rule}</p>
              </div>
            );
          })}
        </div>
        <nav className={s.tracker} aria-label="Build stages">
          {stages.map((x, i) => (
            <button key={x.id} type="button" className={s.trackerBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)} disabled={!enhanced}>
              <span className={s.trackerDot} aria-hidden="true" />
              <span className={s.trackerLabel}>{x.name}</span>
            </button>
          ))}
        </nav>

        <ol className={s.stills} aria-label="The four build stages">
          {stages.map((x) => {
            const G = RULE_GLYPH[x.glyph];
            return (
              <li key={x.id} className={s.still}>
                <DotGlyph verb={x.verb} size={160} seed={`apple-still-${x.id}`} label={`${x.name}: ${x.motion}`} className={s.stillGlyph} />
                <p className={s.stillText}><strong>{x.name}.</strong> {x.line}</p>
                <p className={s.stillRule}><G size={24} className={s.captionGlyph} />{x.rule}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
