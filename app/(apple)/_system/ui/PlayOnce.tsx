'use client';

/**
 * Play once on viewport entry (Apple rule: clips play once on entry; Signal join seat).
 * Replaces 5 page copies: _home/useStageScrub usePlayOnEntry, _shades/PlayOnce, apple/shades/FixateClip,
 * apple/sidekick/SwapClip, signal/shades/HeroStage.
 *
 *   usePlayOnEntry(targetRef, stageRef | callback, { threshold, armBelowFold, delay })
 *   <PlayOnce className threshold> CSS sequence </PlayOnce>   sets data-run="armed" → "play"
 *   <PlayOnceStage verb … />                                 a DotStage that plays one pass on entry
 *
 * One IntersectionObserver per target, disconnected after it fires. No rAF of its own. Reduced motion: never
 * fires (stages stay at rest, PlayOnce leaves no data-run, so the figure shows fully drawn).
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode, type RefObject } from 'react';
import { DotStage, type DotStageHandle, type DotStageProps } from '../dots/DotStage';

export interface PlayOnEntryOptions {
  /** Visible fraction that triggers. Default 0.6. */
  readonly threshold?: number;
  /** Only arm when the target starts below the fold (if it is already on screen at load, stay at rest). Default false. */
  readonly armBelowFold?: boolean;
  /** Delay before playing, ms. Default 0. */
  readonly delay?: number;
}

const prefersReduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function usePlayOnEntry(
  target: RefObject<Element>,
  play: RefObject<DotStageHandle> | (() => void),
  options: PlayOnEntryOptions = {},
): void {
  const { threshold = 0.6, armBelowFold = false, delay = 0 } = options;
  const fire = useRef(play);
  fire.current = play;
  useEffect(() => {
    const el = target.current;
    if (!el || prefersReduced()) return undefined;
    if (armBelowFold && el.getBoundingClientRect().top < window.innerHeight * 0.6) return undefined;
    let timer = 0;
    const go = (): void => {
      const f = fire.current;
      if (typeof f === 'function') f();
      else f.current?.play({ from: 0 });
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (delay > 0) timer = window.setTimeout(go, delay);
        else go();
      },
      { threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [target, threshold, armBelowFold, delay]);
}

/** Wrapper for CSS-driven sequences: style `[data-run='armed']` (start pose) and `[data-run='play']` (animate). */
export function PlayOnce({
  className,
  threshold = 0.5,
  children,
}: {
  readonly className?: string;
  readonly threshold?: number;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.6) return undefined;
    el.dataset.run = 'armed';
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.run = 'play';
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** A DotStage that plays one pass when it enters view. Ref exposes the stage handle (replay etc.). */
export const PlayOnceStage = forwardRef<DotStageHandle, DotStageProps & PlayOnEntryOptions>(function PlayOnceStage(
  { threshold, armBelowFold, delay, ...stage },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<DotStageHandle>(null);
  // `display: contents` keeps the stage's own layout classes working; observe the stage element itself.
  const target = useRef<Element | null>(null);
  useEffect(() => {
    target.current = wrap.current?.firstElementChild ?? null;
  });
  // Armed pose: a stage that starts below the fold waits at t = 0, so entry plays from the start without a
  // visible jump. SSR, no-JS and reduced motion keep the rest pose.
  useEffect(() => {
    const el = wrap.current?.firstElementChild;
    if (!el || prefersReduced()) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.6) inner.current?.seek(0);
  }, []);
  useImperativeHandle(ref, () => inner.current as DotStageHandle, []);
  usePlayOnEntry(target, inner, { threshold, armBelowFold, delay });
  return (
    <div ref={wrap} style={{ display: 'contents' }}>
      <DotStage ref={inner} {...stage} />
    </div>
  );
});
