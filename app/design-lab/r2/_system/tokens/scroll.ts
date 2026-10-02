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
