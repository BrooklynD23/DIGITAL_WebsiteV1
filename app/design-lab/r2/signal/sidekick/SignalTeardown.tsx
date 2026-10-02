'use client';

import { useCallback, useRef, useState } from 'react';
import { GlyphSeat, StateMark } from '../../_system';
import { modules, swap } from '../../_content/sidekick';
import { LINE_FORM } from '../../_sidekick/lineForm';
import { SidekickStack } from '../../_sidekick/Stack';
import { useStackDrive, type SubLayer } from '../../_sidekick/useStackDrive';
import s from './sidekick.module.css';


const LAYER_NAME: Record<SubLayer, string> = {
  'B.Cu': 'Back copper',
  substrate: 'FR-4 core',
  'F.Cu': 'Front copper',
  'F.Pads': 'Front pads',
  'F.Silk': 'Silkscreen',
};

/** The trigger level: an entry is active once its top crosses this share of the viewport. */
const TRIGGER = 0.58;

/**
 * The teardown band. Scroll is the timebase: entries cross a fixed trigger line, the stack opens one gap per
 * entry and the active real board separates into its layers; the cursor readout names layer + subsystem.
 * The sixth step is the swap beat, driven by a real button.
 */
export function SignalTeardown() {
  const bandRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [cursor, setCursor] = useState<{ active: number; sub: SubLayer | null } | null>(null);
  const [swapped, setSwapped] = useState(false);

  const measure = useCallback((): number => {
    const list = listRef.current;
    if (!list) return 0;
    // The trigger element is sticky at the trigger level (its CSS owns the breakpoint), so its box is the line.
    const line = triggerRef.current?.getBoundingClientRect().top ?? window.innerHeight * TRIGGER;
    const steps = list.querySelectorAll<HTMLElement>('[data-step]');
    let p = 0;
    steps.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.top <= line) p = i + Math.min(1, (line - r.top) / (r.height || 1));
    });
    return p;
  }, []);

  useStackDrive(stackRef, {
    measure,
    hostRef: bandRef,
    onChange: ({ active, sub }) => {
      setCursor({ active, sub });
      listRef.current?.querySelectorAll<HTMLElement>('[data-step]').forEach((el, i) => {
        el.dataset.active = String(i === active);
      });
    },
  });

  const mod = cursor ? modules[cursor.active] : null;

  return (
    <div ref={bandRef} className={s.band} id="teardown" aria-labelledby="teardown-title">
      <div className={s.bandHead}>
        <h2 id="teardown-title" className={s.h2}>Five modules, top to back.</h2>
        <p className={s.leadSmall}>Two are real KiCad boards. Three are drawn as outlines.</p>
      </div>
      <div className={s.bandGrid}>
        <div className={s.objectCol}>
          <div className={s.objectPin}>
            <div ref={stackRef} className={s.stackBox} data-swapped={swapped ? 'true' : 'false'}>
              <SidekickStack
                label="SIDEKICK as an exploded stack of five modules: fingerprint module, sensor module, power carrier, compute module and planned modules"
                seat
              />
            </div>
            <p className={s.readout} aria-hidden="true">
              <span className={s.roKey}>CUR</span>
              {mod ? (
                <>
                  <span className={s.roVal}>L{String(mod.n).padStart(2, '0')}</span>
                  <span className={s.roVal}>
                    {swapped
                      ? 'seat 01 open'
                      : cursor?.sub
                        ? `${cursor.sub} · ${LAYER_NAME[cursor.sub]}`
                        : mod.board
                          ? 'assembled'
                          : mod.stateWord.toLowerCase()}
                  </span>
                  <span className={s.roDim}>{mod.name}</span>
                </>
              ) : (
                <span className={s.roDim}>5 modules · 2 board files</span>
              )}
            </p>
          </div>
        </div>
        <div className={s.listCol}>
          <span ref={triggerRef} className={s.trigger} aria-hidden="true">
            <svg viewBox="0 0 10 10" className={s.caret}>
              <path d="M0 0L10 5L0 10Z" />
            </svg>
          </span>
          <ol ref={listRef} className={s.steps}>
            {modules.map((m) => (
              <li key={m.id} className={s.step} data-step={m.id} data-glyph-host="">
                <h3 className={s.stepName}>
                  <span className={s.stepNum}>{String(m.n).padStart(2, '0')}</span>
                  {m.name}
                </h3>
                <p className={s.stepLine}>{m.line}</p>
                <p className={s.stepState}>
                  <StateMark state={LINE_FORM[m.state]} size={16} />
                  {m.stateWord} <span className={s.confirm}>[confirm]</span>
                </p>
                <dl className={s.kv}>
                  <div>
                    <dt>Scope</dt>
                    <dd>{m.scope}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{m.risk}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd className={s.owner}>
                      <GlyphSeat size={16} />
                      Unassigned
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
            <li className={`${s.step} ${s.swapStep}`} data-step="swap">
              <h3 className={s.swapHead}>{swap.headline}</h3>
              <p className={s.stepLine}>{swap.lead}</p>
              <button type="button" className={s.swapBtn} aria-pressed={swapped} onClick={() => setSwapped((v) => !v)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.swapIcon}>
                  <path d="M3 13l9-5.2 9 5.2-9 5.2z" />
                  <path d={swapped ? 'M8.5 13l3.5-2 3.5 2-3.5 2z' : 'M12.5 6.1l3.5-2 3.5 2-3.5 2z'} />
                </svg>
                {swapped ? swap.in : swap.out}
              </button>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
