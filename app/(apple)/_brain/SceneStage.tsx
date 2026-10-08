'use client';

/**
 * <SceneStage> — canvas renderer for a BRAIN scene (several agentic verbs composed in one frame).
 * Same contract as the system DotStage: server HTML is the SVG rest pose (DotGlyph with frameData),
 * the canvas replaces it after its first paint, and it draws only while a beat plays or a scrub moves.
 *
 *   play(ms)  one beat t: 0 → 1 on the shared ticker, then sleeps (0 rAF at rest)
 *   setT(t)   scrub (scroll / slider): one synchronous paint, no loop
 *   finish()  jump to rest
 *
 * One running stage per page: starting a beat finishes whichever other stage is running.
 * Reduced motion: play() jump-cuts to rest. Offscreen or hidden tab: a running beat jumps to rest.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, type ForwardedRef } from 'react';
import { DotGlyph, subscribeTick, type Frame } from '../_system';
import { paintFrame, type Inks } from '../_system';
import s from './stage.module.css';

export interface SceneHandle {
  play(ms: number): void;
  setT(t: number): void;
  finish(): void;
  getT(): number;
}

export interface SceneStageProps {
  /** Scene at (t, size). Changing it (new state) repaints at the current t. */
  readonly draw: (t: number, size: number) => Frame;
  /** Largest rendered size, px (the stage shrinks with its container). */
  readonly maxSize: number;
  /** State-specific accessible name. */
  readonly label: string;
  /** Called on every painted t during a beat (callers diff it themselves). */
  readonly onTick?: (t: number) => void;
  readonly onDone?: () => void;
  readonly className?: string;
}

/* page-wide conductor: at most one beat runs at a time */
let running: (() => void) | null = null;
const claim = (finish: () => void): void => {
  if (running && running !== finish) running();
  running = finish;
};
const release = (finish: () => void): void => {
  if (running === finish) running = null;
};

function SceneStageInner({ draw, maxSize, label, onTick, onDone, className }: SceneStageProps, ref: ForwardedRef<SceneHandle>) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ draw, onTick, onDone });
  cb.current = { draw, onTick, onDone };
  const st = useRef({
    t: 1,
    dur: 1000,
    last: -1,
    size: maxSize,
    dpr: 1,
    unsub: null as null | (() => void),
    visible: true,
    reduced: false,
    inks: null as Inks | null,
  });

  const paint = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    const S = st.current;
    if (!c || !ctx) return;
    const want = Math.round(S.size * S.dpr);
    if (c.width !== want) {
      c.width = want;
      c.height = want;
    }
    if (!S.inks) {
      const cs = getComputedStyle(wrapRef.current as HTMLElement);
      S.inks = { ink: cs.color, trigger: cs.getPropertyValue('--r2-trigger').trim() || '#d8412f' };
    }
    paintFrame(ctx, cb.current.draw(S.t, S.size), S.size, S.dpr, S.inks);
    if (wrapRef.current && !wrapRef.current.dataset.ready) wrapRef.current.dataset.ready = 'true';
  }, []);

  const stopLoop = useCallback(() => {
    const S = st.current;
    S.unsub?.();
    S.unsub = null;
  }, []);

  const finishNow = useCallback(() => {
    const S = st.current;
    const wasRunning = S.unsub !== null;
    stopLoop();
    S.t = 1;
    paint();
    release(finishNow);
    if (wasRunning) {
      cb.current.onTick?.(1);
      cb.current.onDone?.();
    }
  }, [paint, stopLoop]);

  const tick = useCallback(
    (now: number): boolean => {
      const S = st.current;
      if (!S.visible) {
        S.unsub = null;
        finishNow();
        return false;
      }
      const dt = S.last < 0 ? 0 : Math.min(64, now - S.last);
      S.last = now;
      S.t = Math.min(1, S.t + dt / S.dur);
      paint();
      cb.current.onTick?.(S.t);
      if (S.t >= 1) {
        S.unsub = null;
        release(finishNow);
        cb.current.onDone?.();
        return false;
      }
      return true;
    },
    [finishNow, paint],
  );

  useImperativeHandle(
    ref,
    () => ({
      play(ms) {
        const S = st.current;
        stopLoop();
        if (S.reduced || !S.visible) {
          S.t = 1;
          paint();
          cb.current.onTick?.(1);
          cb.current.onDone?.();
          return;
        }
        claim(finishNow);
        S.t = 0;
        S.dur = Math.max(200, ms);
        S.last = -1;
        S.inks = null;
        // no synchronous paint: the first tick (next frame) draws with the props of the re-render
        S.unsub = subscribeTick(tick);
      },
      setT(t) {
        const S = st.current;
        if (S.unsub) {
          stopLoop();
          release(finishNow);
        }
        S.t = Math.min(1, Math.max(0, t));
        paint();
      },
      finish: finishNow,
      getT: () => st.current.t,
    }),
    [finishNow, paint, stopLoop, tick],
  );

  // mount: size from the container, first paint (no rAF), sleep conditions
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const S = st.current;
    S.dpr = Math.min(2, window.devicePixelRatio || 1);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (): void => {
      S.reduced = mq.matches;
      if (S.reduced && S.unsub) finishNow();
    };
    onMotion();
    mq.addEventListener('change', onMotion);
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const next = Math.max(120, Math.min(maxSize, w || maxSize));
      if (next !== S.size || !el.dataset.ready) {
        S.size = next;
        paint();
      }
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        S.visible = entry.isIntersecting;
        if (!S.visible && S.unsub) finishNow();
      },
      { rootMargin: '48px' },
    );
    io.observe(el);
    const onVis = (): void => {
      if (document.hidden && S.unsub) finishNow();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      mq.removeEventListener('change', onMotion);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stopLoop();
      release(finishNow);
    };
  }, [finishNow, maxSize, paint, stopLoop]);

  // new state → repaint at the current t (a beat in flight keeps running with the new scene)
  useEffect(() => {
    if (!st.current.unsub) paint();
  }, [draw, paint]);

  const rest = useMemo(() => draw(1, maxSize), [draw, maxSize]);

  return (
    <div
      ref={wrapRef}
      className={className ? `${s.stage} ${className}` : s.stage}
      style={{ maxWidth: maxSize }}
      role="img"
      aria-label={label}
    >
      <DotGlyph verb="fill" frameData={rest} size={maxSize} className={s.fallback} />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
    </div>
  );
}

export const SceneStage = forwardRef(SceneStageInner);
SceneStage.displayName = 'SceneStage';
