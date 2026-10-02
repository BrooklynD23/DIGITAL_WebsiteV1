'use client';

import { useEffect, useRef, useState } from 'react';
import { StateMark, useScrollSteps } from '../../_system';
import { modules, swap } from '../../_content/sidekick';
import { SidekickStack } from '../../_sidekick/Stack';
import { LINE_FORM } from '../../_sidekick/lineForm';
import { MODULE_COUNT } from '../../_sidekick/geometry';
import { SUB_NAME, applyStackFrame, cacheStack, resetStack, type StackCache, type SubLayer } from '../../_sidekick/stackFrame';
import s from './sidekick.module.css';

/** Five module steps + the swap step. */
const STEPS = MODULE_COUNT + 1;
const SWAP_STEP = MODULE_COUNT;
/** Readout value for modules with no board file. */
const RO_STATE: Readonly<Record<string, string>> = { sensor: 'schematic', compute: 'external', planned: 'research' };

/**
 * The teardown band. Scroll is the timebase: the stack opens one gap per step and the active real board separates
 * into its layers (BoardLayers boxes, composited). Names live on the object (locked list); the panel beside it shows
 * only the active module: state, one line, and Scope / Risk behind a closed disclosure. The cursor readout reports
 * layer + module. The swap is a CSS-only checkbox (works without JS); JS only mirrors it into the readout.
 * Static layout (no JS, reduced motion): the open stack beside a plain, fully visible list.
 */
export function SignalTeardown() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<HTMLInputElement>(null);
  const cache = useRef<StackCache | null>(null);
  const [sub, setSub] = useState<SubLayer | null>(null);
  const [lifted, setLifted] = useState(false);

  const { enhanced, active } = useScrollSteps(pinRef, {
    count: STEPS,
    playShare: 1,
    onFrame: (p, at) => {
      // The panel joins once the timebase starts, so the band head and the first entry never share a viewport.
      const grid = pinRef.current;
      if (grid) grid.dataset.started = String(p > 0.004);
      const c = cache.current;
      if (!c) return;
      const r = applyStackFrame(c, at.i + at.t);
      setSub((prev) => (prev === r.sub ? prev : r.sub));
    },
    onStep: (i, prev) => {
      // Leaving the swap step re-seats the module, so the readout never reports a stale open seat.
      if (prev === SWAP_STEP && i !== SWAP_STEP && swapRef.current?.checked) {
        swapRef.current.checked = false;
        setLifted(false);
      }
    },
  });

  useEffect(() => {
    const el = stackRef.current?.querySelector<HTMLElement>('[data-stack]');
    if (!el || !enhanced) return undefined;
    const c = cacheStack(el);
    cache.current = c;
    applyStackFrame(c, 0);
    return () => {
      resetStack(c);
      cache.current = null;
    };
  }, [enhanced]);

  const mod = modules[Math.min(active, MODULE_COUNT - 1)];
  const onSwapStep = enhanced && active === SWAP_STEP;
  const seatOpen = lifted && (active === 0 || onSwapStep || !enhanced);
  const live = enhanced || lifted;
  const roLayer = seatOpen || onSwapStep ? 'L01' : `L${String(mod.n).padStart(2, '0')}`;
  const roValue = seatOpen
    ? 'seat open'
    : onSwapStep
      ? 'seated'
      : sub
        ? SUB_NAME[sub]
        : mod.board
          ? 'assembled'
          : RO_STATE[mod.id];
  const roModule = seatOpen || onSwapStep ? modules[0].name : mod.name;

  return (
    <section className={s.band} id="teardown" aria-labelledby="teardown-title" data-enhanced={enhanced ? '' : undefined} data-swap-host="">
      <div className={s.bandHead}>
        <h2 id="teardown-title" className={s.h2}>Five modules, top to back.</h2>
      </div>
      <div ref={pinRef} className={s.bandGrid}>
        <div className={s.objectCol}>
          <div className={s.objectPin}>
            <div ref={stackRef} className={s.stackBox}>
              <SidekickStack
                seat
                note="Every seat open."
                legend="2 real boards · 3 outlines [confirm]"
                label="SIDEKICK inside a phone shell that was never started, exploded into five modules: 01 fingerprint module, 02 sensor module, 03 power and carrier, 04 compute, 05 planned modules. Two are real board files; three are outlines. Every seat is open."
              />
            </div>
            <p className={s.readout} aria-live="polite">
              <svg viewBox="0 0 16 16" className={s.cursorIcon} aria-hidden="true">
                <path d="M1 8h14M8 1v14" />
              </svg>
              <span className="sr-only">Cursor: </span>
              <span className={s.roVal}>{live ? roLayer : '5'}</span>
              <span className={s.roDim}>{live ? roValue : 'modules'}</span>
              <span className="sr-only">, {live ? roModule : 'two from board files'}</span>
            </p>
          </div>
        </div>
        <div className={s.listCol}>
          <div className={s.panel}>
            <span className={s.trigger} aria-hidden="true">
              <svg viewBox="0 0 10 10" className={s.caret}>
                <path d="M0 0L10 5L0 10Z" />
              </svg>
            </span>
            <ol className={s.steps}>
              {modules.map((m, i) => (
                <li key={m.id} className={s.step} data-active={enhanced ? String(active === i) : undefined}>
                  <h3 className={enhanced ? `${s.stepName} sr-only` : s.stepName}>
                    <span className={s.stepNum}>{String(m.n).padStart(2, '0')}</span>
                    {m.name}
                  </h3>
                  <p className={s.stepState}>
                    <StateMark state={LINE_FORM[m.state]} size={16} />
                    {m.stateWord} <span className={s.confirm}>[confirm]</span>
                  </p>
                  <p className={s.stepLine}>{m.short}</p>
                  <details className={s.more}>
                    <summary>Scope, risk</summary>
                    <p className={s.moreLine}>{m.line}</p>
                    <dl className={s.kv}>
                      <div>
                        <dt>Scope</dt>
                        <dd>{m.scope}</dd>
                      </div>
                      <div>
                        <dt>Risk</dt>
                        <dd>{m.risk}</dd>
                      </div>
                    </dl>
                  </details>
                </li>
              ))}
              <li className={`${s.step} ${s.swapStep}`} data-active={enhanced ? String(onSwapStep) : undefined}>
                <h3 className={s.swapHead}>{swap.headline}</h3>
                <p className={s.stepLine}>{swap.lead}</p>
                <input
                  ref={swapRef}
                  type="checkbox"
                  id="sk-swap"
                  data-swap=""
                  className={s.swapInput}
                  onChange={(e) => setLifted(e.currentTarget.checked)}
                />
                <label htmlFor="sk-swap" className={s.swapBtn}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={s.swapIcon}>
                    <path d="M3 13l9-5.2 9 5.2-9 5.2z" />
                    <path className={s.swapIn} d="M8.5 13l3.5-2 3.5 2-3.5 2z" />
                    <path className={s.swapOut} d="M12.5 6.1l3.5-2 3.5 2-3.5 2z" />
                  </svg>
                  {swap.control}
                </label>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
