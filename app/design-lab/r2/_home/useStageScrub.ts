'use client';

/**
 * Home (both worlds): one scroll-pinned section scrubs four stacked <DotStage>s through
 * Plan → Prototype → Test → Integrate. Scroll is the only drive: 0 rAF at rest.
 *
 *   p ∈ [0, lead)          hero hold: stage 0 at its opening pose
 *   p ∈ [lead, 1]          four equal segments; in each, the verb plays over the first 72%, then rests
 *
 * `enhanced` is true only with JS and without reduced motion. When false, the section renders its static
 * state (pins collapse; every stage line is visible), so reduced motion and no-JS keep full content parity.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { progressOf, useScrollProgress, type DotStageHandle } from '../_system';

export const STAGE_COUNT = 4;
/** Stage 0's opening pose: partly formed, so the first viewport already reads as a shape. */
export const OPEN_T = 0.45;
const PLAY_SHARE = 0.72;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface StageAt {
  readonly i: number;
  readonly t: number;
}

export function stageAt(p: number, lead: number): StageAt {
  if (p < lead) return { i: 0, t: OPEN_T };
  const seg = (1 - lead) / STAGE_COUNT;
  const i = Math.min(STAGE_COUNT - 1, Math.floor((p - lead) / seg));
  const u = (p - lead - i * seg) / seg;
  const k = Math.min(1, Math.max(0, u / PLAY_SHARE));
  return { i, t: i === 0 ? OPEN_T + (1 - OPEN_T) * k : k };
}

/** Progress at which stage i is fully formed (used by jump buttons and the timebase). */
export function restPointOf(i: number, lead: number): number {
  const seg = (1 - lead) / STAGE_COUNT;
  return Math.min(1, lead + (i + PLAY_SHARE + 0.06) * seg);
}

export interface StageScrub {
  readonly enhanced: boolean;
  readonly active: number;
  /** Scroll the page so the pin sits at progress p (0..1). */
  readonly scrollToProgress: (p: number, smooth?: boolean) => void;
  readonly jumpTo: (i: number) => void;
}

export function useStageScrub(
  section: RefObject<HTMLElement>,
  stages: ReadonlyArray<RefObject<DotStageHandle>>,
  options: { readonly lead: number; readonly onProgress?: (p: number, at: StageAt) => void },
): StageScrub {
  const { lead } = options;
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const cb = useRef(options.onProgress);
  cb.current = options.onProgress;

  useIsoLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = (): void => setEnhanced(!mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const apply = useCallback(
    (p: number) => {
      const at = stageAt(p, lead);
      if (at.i !== activeRef.current) {
        // The departing stage settles to its rest pose so nothing is left mid-motion.
        stages[activeRef.current]?.current?.seek(1);
        activeRef.current = at.i;
        setActive(at.i);
      }
      stages[at.i]?.current?.setProgress(at.t);
      cb.current?.(p, at);
    },
    [lead, stages],
  );

  const onProgress = useCallback(
    (p: number) => {
      if (!enhanced) return;
      apply(p);
    },
    [apply, enhanced],
  );

  useScrollProgress(section, { range: 'contain', onProgress, cssVar: '--p' });

  // Re-measure once the pin height applies (enhanced flips the section to its tall pinned layout).
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (!enhanced) {
      // Static state: every stage at rest, Integrate (the whole build) shown.
      stages.forEach((s) => s.current?.seek(1));
      activeRef.current = STAGE_COUNT - 1;
      setActive(STAGE_COUNT - 1);
      el.style.setProperty('--p', '1');
      cb.current?.(1, { i: STAGE_COUNT - 1, t: 1 });
      return;
    }
    stages.forEach((s, i) => {
      if (i !== 0) s.current?.seek(1);
    });
    activeRef.current = -1;
    apply(progressOf(el.getBoundingClientRect(), window.innerHeight, 'contain'));
  }, [enhanced, apply, section, stages]);

  const scrollToProgress = useCallback(
    (p: number, smooth = true) => {
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top + Math.max(0, rect.height - window.innerHeight) * p;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.round(top), behavior: reduced || !smooth ? 'auto' : 'smooth' });
    },
    [section],
  );

  const jumpTo = useCallback((i: number) => scrollToProgress(restPointOf(i, lead)), [lead, scrollToProgress]);

  return { enhanced, active, scrollToProgress, jumpTo };
}

/** Plays a stage once when it is mostly on screen (Apple "plays once on entry"; Signal join seat). */
export function usePlayOnEntry(target: RefObject<HTMLElement>, stage: RefObject<DotStageHandle>, threshold = 0.6): void {
  useEffect(() => {
    const el = target.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          stage.current?.play({ loop: false, from: 0 });
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, stage, threshold]);
}
