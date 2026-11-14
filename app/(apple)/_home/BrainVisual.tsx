'use client';

/** BRAIN chapter visual: the sphere over the readout, one clock (BrainSphere) driving both, plus Pause/Play. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AgentReadout, readoutKey } from './AgentReadout';
import { BrainSphere } from './BrainSphere';
import { readoutLabels } from '../_content/home';
import { stateAt, type LoopState } from './sphere/timeline';
import s from './brain.module.css';

export function BrainVisual({ label, className }: { readonly label: string; readonly className?: string }) {
  const [st, setSt] = useState<LoopState>(() => stateAt(0));
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const key = useRef('');
  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  const onFrame = useCallback((next: LoopState) => {
    const k = readoutKey(next);
    if (k !== key.current) { key.current = k; setSt(next); }
  }, []);

  return (
    <div className={`${s.wrap} ${className ?? ''}`} data-paused={paused ? '1' : undefined}>
      <BrainSphere label={label} paused={paused} reduce={reduce} onFrame={onFrame} />
      <AgentReadout st={st} reduce={reduce}>
        <button type="button" className={s.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? readoutLabels.play : readoutLabels.pause}
        </button>
      </AgentReadout>
    </div>
  );
}
