'use client';

/**
 * useScrollProgress — element progress through the viewport, 0..1.
 *
 * CSS-native first: when the browser supports `animation-timeline: view()` and the
 * caller only needs CSS (no onProgress), the hook just tags the element and
 * worlds.css animates the registered `--p` property off the scroll timeline. 0 JS work.
 * Fallback / JS consumers: one passive scroll listener, attached only while the
 * element is near the viewport (IntersectionObserver), coalesced to ≤1 rAF per
 * scroll frame through the shared ticker. Nothing runs at rest. No ScrollTrigger.
 * Reduced motion: --p is pinned to `reducedValue` (default 1 = rest pose) and no listener attaches.
 */
import { useEffect, useRef, useState, type RefObject } from 'react';
import { once } from '../dots/ticker';

export type ScrollRange = 'cover' | 'contain' | 'entry';

export interface ScrollProgressOptions {
  /**
   * cover: element top at viewport bottom (0) → element bottom at viewport top (1).
   * contain: for pins — top at viewport top (0) → bottom at viewport bottom (1) (tall elements).
   * entry: top at viewport bottom (0) → top at viewport bottom − height (1).
   */
  readonly range?: ScrollRange;
  /** JS consumers (canvas drives). Forces the JS path. */
  readonly onProgress?: (p: number) => void;
  /** Custom property written on the element. Default '--p'. false = none. */
  readonly cssVar?: string | false;
  /** Value under reduced motion. Default 1. */
  readonly reducedValue?: number;
}

export const supportsViewTimeline = (): boolean =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');

export function progressOf(rect: DOMRect, vh: number, range: ScrollRange): number {
  let p: number;
  if (range === 'contain') {
    const span = Math.abs(rect.height - vh) || 1;
    p = rect.height >= vh ? -rect.top / span : (vh - rect.bottom) / span;
  } else if (range === 'entry') {
    p = (vh - rect.top) / (Math.min(rect.height, vh) || 1);
  } else {
    p = (vh - rect.top) / (vh + rect.height || 1);
  }
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T>, options: ScrollProgressOptions = {}): void {
  const { range = 'cover', onProgress, cssVar = '--p', reducedValue = 1 } = options;
  const cb = useRef(onProgress);
  cb.current = onProgress;
  const wantsJs = onProgress !== undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.dataset.pRange = range;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.dataset.pMode = 'static';
      if (cssVar) el.style.setProperty(cssVar, String(reducedValue));
      cb.current?.(reducedValue);
      return () => {
        delete el.dataset.pMode;
      };
    }
    if (!wantsJs && cssVar === '--p' && supportsViewTimeline()) {
      el.dataset.pMode = 'css';
      return () => {
        delete el.dataset.pMode;
      };
    }

    el.dataset.pMode = 'js';
    let cancel: (() => void) | null = null;
    const update = (): void => {
      cancel = null;
      const p = progressOf(el.getBoundingClientRect(), window.innerHeight, range);
      if (cssVar) el.style.setProperty(cssVar, p.toFixed(4));
      cb.current?.(p);
    };
    const onScroll = (): void => {
      if (!cancel) cancel = once(update);
    };
    let attached = false;
    const attach = (on: boolean): void => {
      if (on === attached) return;
      attached = on;
      if (on) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        // Snap to the nearest end so a fast fling past the element leaves it consistent.
        update();
      }
    };
    const io = new IntersectionObserver(([entry]) => attach(entry.isIntersecting), { rootMargin: '25% 0px' });
    io.observe(el);
    update();
    return () => {
      io.disconnect();
      attach(false);
      cancel?.();
      delete el.dataset.pMode;
    };
  }, [ref, range, cssVar, reducedValue, wantsJs]);
}

/** prefers-reduced-motion as React state (false on the server). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = (): void => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ pinned steps */

export interface StepAt {
  /** Active step index. */
  readonly i: number;
  /** Local progress inside the step's play window, 0..1 (1 = the step's rest pose). */
  readonly t: number;
}

export interface StepOptions {
  /** Steps in the pin. */
  readonly count: number;
  /** Share of the pin held before step 0 starts (hero hold). Default 0. */
  readonly lead?: number;
  /** Share of each step spent playing; the rest holds the rest pose. Default 0.72. */
  readonly playShare?: number;
}

/** Pure: pin progress p → { step, local t }. Converges the 4 hand-rolled page drives (home, sidekick ×2, teardown). */
export function stepAt(p: number, { count, lead = 0, playShare = 0.72 }: StepOptions): StepAt {
  if (p < lead) return { i: 0, t: 0 };
  const seg = (1 - lead) / count;
  const i = Math.min(count - 1, Math.floor((p - lead) / seg));
  const u = (p - lead - i * seg) / seg;
  return { i, t: Math.min(1, Math.max(0, u / playShare)) };
}

/** Pure: progress at which step i has just reached its rest pose (jump buttons, timebase ticks). */
export function stepRestPoint(i: number, { count, lead = 0, playShare = 0.72 }: StepOptions): number {
  const seg = (1 - lead) / count;
  return Math.min(1, lead + (i + playShare + 0.06) * seg);
}

export interface ScrollSteps {
  /** True with JS and without reduced motion. False = render the static (collapsed, all-visible) layout. */
  readonly enhanced: boolean;
  /** Active step (React state; changes only when the step changes, never per frame). */
  readonly active: number;
  /** Scroll the page so the pin sits at progress p. */
  readonly scrollToProgress: (p: number, smooth?: boolean) => void;
  /** Scroll to step i's rest point. */
  readonly jumpTo: (i: number) => void;
}

/**
 * useScrollSteps(pinRef, { count, lead, playShare, onStep, onFrame })
 * - onFrame(p, at) runs inside the shared ticker frame on every scroll frame while the pin is near view.
 * - onStep(i, prev) runs once per step change (settle the departing stage here).
 * - When not enhanced (reduced motion / before hydration) NOTHING is called: the page shows its static layout.
 *   (Fixes the home P0 where the static branch reported p = 1 and pages read it as "left the hero".)
 * Range is 'contain' (pin). 0 rAF at rest.
 */
export function useScrollSteps<T extends HTMLElement>(
  pin: RefObject<T>,
  options: StepOptions & {
    readonly onFrame?: (p: number, at: StepAt) => void;
    readonly onStep?: (i: number, prev: number) => void;
    readonly cssVar?: string | false;
  },
): ScrollSteps {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  // The pinned layouts switch on in CSS under `@media (scripting: enabled)`. A browser without that query keeps
  // the static layout, so it must also keep the stills (never 'enhanced' there).
  useEffect(() => setHydrated(window.matchMedia('(scripting: enabled)').matches), []);
  const enhanced = hydrated && !reduced;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const opt = useRef(options);
  opt.current = options;

  const onProgress = enhanced
    ? (p: number): void => {
        const o = opt.current;
        const at = stepAt(p, o);
        if (at.i !== activeRef.current) {
          const prev = activeRef.current;
          activeRef.current = at.i;
          setActive(at.i);
          o.onStep?.(at.i, prev);
        }
        o.onFrame?.(p, at);
      }
    : undefined;
  useScrollProgress(pin, { range: 'contain', onProgress, cssVar: options.cssVar });

  const scrollToProgress = (p: number, smooth = true): void => {
    const el = pin.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top + Math.max(0, rect.height - window.innerHeight) * p;
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.round(top), behavior: r || !smooth ? 'auto' : 'smooth' });
  };
  const jumpTo = (i: number): void => scrollToProgress(stepRestPoint(i, opt.current));

  return { enhanced, active, scrollToProgress, jumpTo };
}
