'use client';

/**
 * <DotStage> — 2D canvas renderer for the dot engine (hero orbs up to ~600px, ≤1,200 dots, DPR ≤ 2).
 *
 * HARD GATE: 0 requestAnimationFrame callbacks at rest. The stage draws only when
 *   - a time drive is running (play → runs to rest, or loops until stop), or
 *   - a scroll / slider drive calls setProgress (one coalesced draw per frame).
 * It sleeps when settled, offscreen (IntersectionObserver), hidden tab, or reduced motion.
 * Server HTML is the SVG rest pose (<DotGlyph>), so no-JS and first paint carry full meaning.
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
  type ForwardedRef,
} from 'react';
import { DotGlyph } from './DotGlyph';
import { REST_T, frame, verbSpec } from './engine';
import { clamp } from './math';
import { paintFrame, type Inks } from './paint';
import { insideFrame, once, subscribe } from './ticker';
import type { Frame, FrameOpts, Verb } from './types';
import s from './stage.module.css';

export interface DotStageHandle {
  /** Time drive: run from `from` (default: 0 if at rest) to rest; `loop` keeps cycling until stop(). */
  play(options?: { loop?: boolean; from?: number }): void;
  /** End a time drive: finishes to the rest pose within ~450 ms, then sleeps. */
  stop(): void;
  /** Jump to t (cancels any time drive). */
  seek(t: number): void;
  /** Scroll / slider drive: progress 0..1 → frame. Coalesced to one draw per frame. */
  setProgress(p: number): void;
  /** Current t. */
  getT(): number;
  /** True while a time drive holds the frame loop. */
  isRunning(): boolean;
}

export interface DotStageProps extends FrameOpts {
  readonly verb: Verb;
  /** CSS px, square. Default 320, max 600 (scales down with its container). */
  readonly size?: number;
  /** Initial / static t. Default 1 (rest). */
  readonly t?: number;
  /** Controlled scroll/slider drive. */
  readonly progress?: number;
  /** Controlled time drive (true → play, false → stop and settle). */
  readonly playing?: boolean;
  readonly loop?: boolean;
  /** Cycle length in ms (default: the verb's duration). */
  readonly duration?: number;
  /** Loop while hovered or focused within; settle on leave. */
  readonly playOnHover?: boolean;
  /** Accessible name; default "<verb>: <meaning>". */
  readonly label?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly onSettle?: () => void;
  /**
   * Composed scene: replaces the verb lookup with your own pure, deterministic (t, opts) → Frame
   * (dots z-sorted, ≤1,200). Keeps the whole stage contract (shared ticker, sleep rules, SSR rest pose at
   * the initial t, reduced motion). `verb` still names the stage for its default label.
   */
  readonly scene?: (t: number, opts: FrameOpts) => Frame;
}

const MAX_SIZE = 600;
const SETTLE_MS = 450;

function DotStageInner(props: DotStageProps, ref: ForwardedRef<DotStageHandle>) {
  const {
    verb,
    size: rawSize = 320,
    t: initialT = REST_T,
    progress,
    playing,
    loop = false,
    duration,
    playOnHover = false,
    label,
    className,
    style,
    onSettle,
    scene,
    seed,
    density,
    shape,
    layers,
    level,
    outcome,
    kind,
    anchor,
  } = props;
  const size = Math.min(MAX_SIZE, Math.max(16, rawSize));
  const opts = useMemo<FrameOpts>(
    () => ({ seed, density, shape, layers, level, outcome, kind, anchor, size }),
    [seed, density, shape, layers, level, outcome, kind, anchor, size],
  );
  const spec = verbSpec(verb);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ verb, opts, duration: duration ?? spec.duration, loop, onSettle, scene });
  live.current = { verb, opts, duration: duration ?? spec.duration, loop, onSettle, scene };

  const st = useRef({
    t: clamp(progress ?? initialT),
    mode: 'idle' as 'idle' | 'playing' | 'settling',
    loop: false,
    last: -1,
    visible: true,
    docVisible: true,
    reduced: false,
    dirty: true,
    dpr: 1,
    inks: null as Inks | null,
    unsub: null as null | (() => void),
    pending: null as null | (() => void),
  });

  const readInks = useCallback((): Inks => {
    const el = wrapRef.current;
    if (!el) return { ink: '#ece8de', trigger: '#d8412f' };
    const cs = getComputedStyle(el);
    return { ink: cs.color, trigger: cs.getPropertyValue('--r2-trigger').trim() || '#d8412f' };
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    const S = st.current;
    if (!c || !ctx) return;
    if (!S.visible) {
      S.dirty = true;
      return;
    }
    S.inks ??= readInks();
    const { verb: v, opts: o, scene: sc } = live.current;
    paintFrame(ctx, sc ? sc(S.t, o) : frame(v, S.t, o), o.size ?? 320, S.dpr, S.inks);
    S.dirty = false;
    if (wrapRef.current && !wrapRef.current.dataset.ready) wrapRef.current.dataset.ready = 'true';
  }, [readInks]);

  const scheduleDraw = useCallback(() => {
    const S = st.current;
    if (insideFrame()) {
      draw();
      return;
    }
    if (S.pending) return;
    S.pending = once(() => {
      S.pending = null;
      draw();
    });
  }, [draw]);

  const halt = useCallback(() => {
    const S = st.current;
    S.unsub?.();
    S.unsub = null;
  }, []);

  const finish = useCallback(() => {
    const S = st.current;
    S.t = REST_T;
    S.mode = 'idle';
    draw();
    halt();
    live.current.onSettle?.();
  }, [draw, halt]);

  const tick = useCallback(
    (now: number): boolean => {
      const S = st.current;
      if (!S.visible || !S.docVisible || S.mode === 'idle') {
        S.unsub = null;
        return false;
      }
      const dt = S.last < 0 ? 0 : Math.min(64, now - S.last);
      S.last = now;
      const dur = Math.max(200, live.current.duration);
      if (S.mode === 'playing') {
        S.t += dt / dur;
        if (S.t >= 1) {
          if (S.loop) S.t -= 1;
          else {
            S.unsub = null;
            finish();
            return false;
          }
        }
      } else {
        const rate = Math.max(1 / dur, (1 - S.t) / SETTLE_MS);
        S.t += dt * rate;
        if (S.t >= 1) {
          S.unsub = null;
          finish();
          return false;
        }
      }
      draw();
      return true;
    },
    [draw, finish],
  );

  const ensureTick = useCallback(() => {
    const S = st.current;
    if (S.unsub || S.mode === 'idle' || !S.visible || !S.docVisible) return;
    S.last = -1;
    S.inks = readInks();
    S.unsub = subscribe(tick);
  }, [readInks, tick]);

  const api = useMemo<DotStageHandle>(
    () => ({
      play(options) {
        const S = st.current;
        if (S.reduced) {
          // Reduced motion: jump-cut to the rest pose, never animate.
          S.mode = 'idle';
          S.t = REST_T;
          halt();
          scheduleDraw();
          live.current.onSettle?.();
          return;
        }
        S.loop = options?.loop ?? live.current.loop;
        if (options?.from !== undefined) S.t = clamp(options.from);
        else if (S.t >= 1) S.t = 0;
        S.mode = 'playing';
        ensureTick();
      },
      stop() {
        const S = st.current;
        if (S.mode === 'idle') return;
        S.mode = 'settling';
        ensureTick();
      },
      seek(t) {
        const S = st.current;
        S.mode = 'idle';
        halt();
        S.t = clamp(t);
        scheduleDraw();
      },
      setProgress(p) {
        const S = st.current;
        if (S.mode !== 'idle') {
          S.mode = 'idle';
          halt();
        }
        S.t = clamp(p);
        scheduleDraw();
      },
      getT: () => st.current.t,
      isRunning: () => st.current.unsub !== null,
    }),
    [ensureTick, halt, scheduleDraw],
  );
  useImperativeHandle(ref, () => api, [api]);

  // Mount: size the backing store, first paint synchronously (no rAF), wire sleep conditions.
  useEffect(() => {
    const el = wrapRef.current;
    const c = canvasRef.current;
    if (!el || !c) return undefined;
    const S = st.current;
    S.dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(size * S.dpr);
    c.height = Math.round(size * S.dpr);
    S.inks = readInks();
    S.dirty = true;
    draw();

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (): void => {
      S.reduced = mq.matches;
      if (S.reduced && S.mode !== 'idle') finish();
    };
    onMotion();
    mq.addEventListener('change', onMotion);

    const io = new IntersectionObserver(
      ([entry]) => {
        S.visible = entry.isIntersecting;
        if (S.visible) {
          if (S.dirty) draw();
          ensureTick();
        } else {
          halt();
          // A one-pass drive (or a settle) that leaves the screen completes to its rest pose instead of
          // freezing mid-motion; loops just pause and resume on re-entry.
          if (S.mode === 'settling' || (S.mode === 'playing' && !S.loop)) {
            S.mode = 'idle';
            S.t = REST_T;
            S.dirty = true;
            live.current.onSettle?.();
          }
        }
      },
      { rootMargin: '64px' },
    );
    io.observe(el);

    const onVis = (): void => {
      S.docVisible = !document.hidden;
      if (S.docVisible) ensureTick();
      else halt();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      mq.removeEventListener('change', onMotion);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      halt();
      S.pending?.();
      S.pending = null;
    };
  }, [size, draw, ensureTick, finish, halt, readInks]);

  // Verb / options changed: repaint synchronously at the current t.
  useEffect(() => {
    draw();
  }, [verb, opts, scene, draw]);

  // Controlled drives.
  useEffect(() => {
    if (progress !== undefined) api.setProgress(progress);
  }, [progress, api]);
  const wasPlaying = useRef(false);
  useEffect(() => {
    if (playing === undefined) return;
    if (playing) api.play();
    else if (wasPlaying.current) api.stop();
    wasPlaying.current = playing;
  }, [playing, api]);

  // Hover / focus drive.
  useEffect(() => {
    const el = wrapRef.current;
    if (!playOnHover || !el) return undefined;
    const host = el.closest<HTMLElement>('[data-stage-host]') ?? el;
    const on = (): void => api.play({ loop: true });
    const off = (): void => api.stop();
    host.addEventListener('pointerenter', on);
    host.addEventListener('pointerleave', off);
    host.addEventListener('focusin', on);
    host.addEventListener('focusout', off);
    return () => {
      host.removeEventListener('pointerenter', on);
      host.removeEventListener('pointerleave', off);
      host.removeEventListener('focusin', on);
      host.removeEventListener('focusout', off);
    };
  }, [playOnHover, api]);

  return (
    <div
      ref={wrapRef}
      className={className ? `${s.stage} ${className}` : s.stage}
      style={{ width: size, ...style }}
      role="img"
      aria-label={label ?? `${spec.label}: ${spec.means}`}
      data-verb={verb}
    >
      <DotGlyph
        verb={verb}
        t={progress ?? initialT}
        {...opts}
        size={size}
        className={s.fallback}
        frameData={scene ? scene(progress ?? initialT, opts) : undefined}
      />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
    </div>
  );
}

export const DotStage = forwardRef(DotStageInner);
DotStage.displayName = 'DotStage';
