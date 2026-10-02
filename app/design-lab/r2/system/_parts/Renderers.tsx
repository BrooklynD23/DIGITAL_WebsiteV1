'use client';

import { useRef, useState } from 'react';
import { DotGlyph } from '../../_system/dots/DotGlyph';
import { DotStage, type DotStageHandle } from '../../_system/dots/DotStage';
import { frame, verbSpec } from '../../_system/dots/engine';
import type { Verb } from '../../_system/dots/types';
import s from '../system.module.css';

const HERO_VERBS: readonly Verb[] = ['orbit', 'scramble', 'fill', 'bud', 'halt'];
const HERO_SIZE = 520;
const HERO_DENSITY = 1.3;

export function Renderers() {
  const stage = useRef<DotStageHandle>(null);
  const [verb, setVerb] = useState<Verb>('orbit');
  const [running, setRunning] = useState(false);
  const count = frame(verb, 1, { size: HERO_SIZE, density: HERO_DENSITY }).dots.length;
  const spec = verbSpec(verb);

  return (
    <div className={s.renderers}>
      <figure className={s.heroFig}>
        <DotStage
          ref={stage}
          verb={verb}
          size={HERO_SIZE}
          density={HERO_DENSITY}
          onSettle={() => setRunning(false)}
          className={s.heroStage}
        />
        <figcaption className={s.caption}>
          <span className={s.monoLabel}>DotStage · canvas</span> {count} dots at rest, DPR ≤ 2. Sleeps when settled,
          offscreen, hidden or reduced.
        </figcaption>
      </figure>
      <div className={s.heroSide}>
        <div className={s.segmented} role="group" aria-label="Hero verb">
          {HERO_VERBS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={verb === v}
              onClick={() => {
                stage.current?.seek(1);
                setRunning(false);
                setVerb(v);
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <div className={s.row}>
          <button
            type="button"
            className={s.textBtn}
            aria-pressed={running}
            onClick={() => {
              if (running) stage.current?.stop();
              else {
                setRunning(true);
                stage.current?.play({ loop: true, from: 0 });
              }
            }}
          >
            {running ? 'Stop and settle' : 'Play loop'}
          </button>
        </div>
        <p className={s.body}>
          <strong>{spec.label}</strong>: {spec.means}. Stop finishes the cycle to the rest pose in under half a second,
          then the frame loop ends.
        </p>
        <div className={s.glyphRow}>
          {[160, 64, 24].map((px) => (
            <figure key={px} className={s.glyphFig}>
              <DotGlyph verb={verb} size={px} />
              <figcaption className={s.monoLabel}>SVG {px}</figcaption>
            </figure>
          ))}
        </div>
        <p className={s.small}>
          DotGlyph renders the same frame as static SVG with no client JS: the server HTML, the no-JS view and the
          reduced-motion view.
        </p>
      </div>
    </div>
  );
}
