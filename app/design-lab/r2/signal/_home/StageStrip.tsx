'use client';

/**
 * Signal: the upgraded 4-stage strip (concept C rebuilt on the shared engine) with the four "1" ownership rules
 * set on the same four columns, so the rules read as the stages' footnotes. One stage is active at a time
 * (hover, focus or press); only the active orb moves, once, then rests. No ambient motion.
 */
import { createRef, useMemo, useState } from 'react';
import { DotStage, GlyphGate, GlyphHandoff, GlyphSeat, GlyphSwap, type DotStageHandle } from '../../_system';
import { rules, stages, strip, type RuleGlyph } from '../../_content/home';
import s from './home.module.css';

const RULE_GLYPH: Record<RuleGlyph, typeof GlyphSeat> = { seat: GlyphSeat, handoff: GlyphHandoff, gate: GlyphGate, swap: GlyphSwap };

export function StageStrip() {
  const refs = useMemo(() => stages.map(() => createRef<DotStageHandle>()), []);
  const [active, setActive] = useState(0);

  const activate = (i: number): void => {
    if (i !== active) refs[active].current?.stop();
    setActive(i);
    refs[i].current?.play({ loop: false, from: 0 });
  };

  return (
    <section className={s.strip} aria-labelledby="strip-title">
      <div className={s.wrap}>
        <h2 id="strip-title" className={s.h2}>{strip.headline}</h2>
        <ol className={s.tiles}>
          {stages.map((st, i) => (
            <li key={st.id} className={s.tile} data-active={i === active ? 'true' : undefined}>
              <button
                type="button"
                className={s.tileBtn}
                aria-pressed={i === active}
                onPointerEnter={(e) => e.pointerType === 'mouse' && activate(i)}
                onFocus={() => activate(i)}
                onClick={() => activate(i)}
              >
                <DotStage ref={refs[i]} verb={st.verb} size={120} seed={`strip-${st.id}`} label={`${st.name}: ${st.motion}`} className={s.tileOrb} />
                <span className={s.tileNum}>Stage {st.n}</span>
                <span className={s.tileName}>{st.name}</span>
                <span className={s.tileLine}>{st.motion}</span>
              </button>
            </li>
          ))}
        </ol>

        <h3 className={s.rulesTitle}>{strip.rulesHeadline}</h3>
        <ul className={s.rules}>
          {rules.map((r) => {
            const G = RULE_GLYPH[r.glyph];
            return (
              <li key={r.id} className={s.rule} data-glyph-host>
                <span className={s.ruleCount}>{r.count}</span>
                <span className={s.ruleText}>
                  <G size={24} className={s.ruleGlyph} />
                  <span>{r.unit} <span className={s.rulePer}>{r.per}</span></span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
