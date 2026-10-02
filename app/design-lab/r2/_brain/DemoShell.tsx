'use client';

/**
 * Shared chrome for one BRAIN chapter demo: the screen (stage + overlay labels), controls,
 * a polite live readout, and the static step list (visible without JS / under reduced motion,
 * screen-reader-only otherwise). Worlds restyle it through [data-world] in demo.module.css.
 */
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from '../_system';
import type { Chapter } from '../_content/brain';
import type { SceneHandle } from './SceneStage';
import { pct } from './kit';
import s from './demo.module.css';

export type World = 'signal' | 'apple';

export interface Readout {
  /** Signal cursor readout middle part, e.g. "TOOL CALL". */
  readonly tag: string;
  /** Signal state word(s), e.g. "PENDING". */
  readonly state: string;
  /** Apple sentence. */
  readonly text: string;
}

export function DemoShell({
  world,
  ch,
  stage,
  overlay,
  controls,
  controlsLabel,
  readout,
  corner,
  after,
}: {
  readonly world: World;
  readonly ch: Chapter;
  readonly stage: ReactNode;
  readonly overlay?: ReactNode;
  readonly controls?: ReactNode;
  readonly controlsLabel?: string;
  readonly readout: Readout;
  /** Signal: top-right live value (e.g. "TURN 02/06"). */
  readonly corner?: string;
  /** Extra row under the controls (legends, meters). */
  readonly after?: ReactNode;
}) {
  const live = world === 'signal' ? `CH3 · ${readout.tag} · ${readout.state}` : readout.text;
  // Steps are visible in the server HTML (no JS) and under reduced motion; once the stage can move, they
  // stay in the accessibility tree only.
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);
  const stepsClass = mounted && !reduced ? `${s.steps} sr-only` : s.steps;
  return (
    <figure className={s.demo} data-world={world} data-chapter={ch.id}>
      <div className={s.screen}>
        {world === 'signal' ? (
          <span className={s.cornerTL} aria-hidden="true">
            {`CH3 · ${String(ch.n).padStart(2, '0')} ${ch.name.toUpperCase()}`}
          </span>
        ) : null}
        {world === 'signal' && corner ? (
          <span className={s.cornerTR} aria-hidden="true">
            {corner}
          </span>
        ) : null}
        <div className={s.stageBox}>
          {stage}
          {overlay}
        </div>
        <p className={s.readout} aria-live="polite">
          {live}
        </p>
      </div>
      {controls ? (
        <div className={s.controls} role="group" aria-label={controlsLabel ?? `${ch.name} controls`}>
          {controls}
        </div>
      ) : null}
      {after}
      <ol className={stepsClass} aria-label={`${ch.name}, step by step`}>
        {ch.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </figure>
  );
}

/** A label pinned to a normalised stage coordinate (decorative: controls and readouts carry the names). */
export function Tag({
  x,
  y,
  children,
  align = 'start',
}: {
  readonly x: number;
  readonly y: number;
  readonly children: ReactNode;
  readonly align?: 'start' | 'center' | 'end';
}) {
  return (
    <span className={s.tag} data-align={align} style={{ left: pct(x), top: pct(y) }} aria-hidden="true">
      {children}
    </span>
  );
}

/** Segmented control (radio semantics through aria-pressed buttons). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  readonly options: ReadonlyArray<{ readonly id: T; readonly label: string }>;
  readonly value: T;
  readonly onChange: (id: T) => void;
  readonly label: string;
}) {
  return (
    <div className={s.segmented} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={s.seg} aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Icon({ name }: { readonly name: 'minus' | 'plus' | 'replay' | 'check' | 'cross' }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" className={s.icon}>
      {name === 'minus' ? <path d="M3.5 8h9" /> : null}
      {name === 'plus' ? <path d="M3.5 8h9M8 3.5v9" /> : null}
      {name === 'replay' ? <path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 2.8v2.4h2.4" /> : null}
      {name === 'check' ? <path d="M3.5 8.5l3 3 6-7" /> : null}
      {name === 'cross' ? <path d="M4 4l8 8M12 4l-8 8" /> : null}
    </svg>
  );
}

/** Play the chapter's beat once, the first time the stage is mostly on screen (a single-shot trigger). */
export function useEntryPlay(host: RefObject<HTMLElement>, onEnter: () => void, threshold = 0.45): void {
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          cb.current();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [host, threshold]);
}

/** Track a discrete value derived from t without re-rendering every frame. */
export function useDiscrete<T>(set: (v: T) => void): (v: T) => void {
  const last = useRef<T | undefined>(undefined);
  return (v: T) => {
    if (last.current === v) return;
    last.current = v;
    set(v);
  };
}

export type { SceneHandle };
