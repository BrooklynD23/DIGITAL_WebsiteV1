'use client';

import { useRef, useState } from 'react';
import { DotStage, type DotStageHandle } from '../../_system/dots/DotStage';
import { VERBS, type VerbSpec } from '../../_system/dots/engine';
import type { FrameOpts, RouteOutcome, Shape, TetherKind } from '../../_system/dots/types';
import s from '../system.module.css';

const VARIANTS: Partial<Record<VerbSpec['verb'], { key: keyof FrameOpts; values: readonly string[] }>> = {
  form: { key: 'shape', values: ['triangle', 'square', 'hex', 'circle'] satisfies readonly Shape[] },
  route: { key: 'outcome', values: ['pass', 'hold', 'reject'] satisfies readonly RouteOutcome[] },
  tether: { key: 'kind', values: ['local', 'remote'] satisfies readonly TetherKind[] },
};

/** Verbs where the red trigger has a real meaning (open seat, held call, arrival point). */
const ANCHOR_ON = new Set(['seat', 'route']);

function VerbCard({ spec }: { readonly spec: VerbSpec }) {
  const stage = useRef<DotStageHandle>(null);
  const [t, setT] = useState(1);
  const [running, setRunning] = useState(false);
  const variant = VARIANTS[spec.verb];
  const [choice, setChoice] = useState(variant?.values[0]);
  const opts: FrameOpts = variant && choice ? { [variant.key]: choice } : {};
  const id = `verb-${spec.verb}`;

  const play = (): void => {
    if (running) {
      stage.current?.stop();
      return;
    }
    setRunning(true);
    stage.current?.play({ loop: spec.cyclic, from: 0 });
  };

  return (
    <li className={s.verbCard}>
      <div className={s.verbStage}>
        <DotStage
          ref={stage}
          verb={spec.verb}
          size={168}
          anchor={ANCHOR_ON.has(spec.verb)}
          {...opts}
          onSettle={() => {
            setRunning(false);
            setT(1);
          }}
        />
      </div>
      <h3 className={s.verbName} id={id}>
        {spec.label}
      </h3>
      <p className={s.verbMeans}>{spec.means}</p>
      <p className={s.verbRest}>
        <span className={s.monoLabel}>Rest</span> {spec.rest}
      </p>
      {variant ? (
        <div className={s.segmented} role="group" aria-label={`${spec.label} ${String(variant.key)}`}>
          {variant.values.map((v) => (
            <button key={v} type="button" aria-pressed={choice === v} onClick={() => setChoice(v)}>
              {v}
            </button>
          ))}
        </div>
      ) : null}
      <div className={s.verbControls}>
        <button
          type="button"
          className={s.playBtn}
          onClick={play}
          aria-pressed={running}
          aria-label={running ? `Stop ${spec.label}` : `Play ${spec.label}`}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            {running ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /> : <path d="M4 2.5v11l9-5.5z" fill="currentColor" />}
          </svg>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={t}
          aria-labelledby={id}
          aria-valuetext={`t ${t.toFixed(2)}`}
          onChange={(e) => {
            const v = Number(e.target.value);
            setT(v);
            setRunning(false);
            stage.current?.setProgress(v);
          }}
        />
        <output className={s.tOut}>{t.toFixed(2)}</output>
      </div>
    </li>
  );
}

export function VerbBench({ family }: { readonly family: 'build' | 'agentic' }) {
  return (
    <ul className={s.verbGrid}>
      {VERBS.filter((v) => v.family === family).map((v) => (
        <VerbCard key={v.verb} spec={v} />
      ))}
    </ul>
  );
}
