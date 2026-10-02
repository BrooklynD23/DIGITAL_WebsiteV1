'use client';

/**
 * Scroll drive for <SidekickStack>. One passive scroll listener, attached only while the host is near the
 * viewport, coalesced into the shared r2 ticker (≤ 1 frame per scroll frame, 0 rAF at rest). No ScrollTrigger.
 * Writes: each tier's transform, the active board's --e, data-active / data-exploding / data-cur.
 * Reduced motion: does nothing; the stack keeps its static, fully open pose.
 */
import { useEffect, useRef, type RefObject } from 'react';
import { onceTick } from '../_system';
import { STACK_H, TIERS, clamp01, subExplode, tierOffset } from './geometry';

export const SUB_LAYERS = ['B.Cu', 'substrate', 'F.Cu', 'F.Pads', 'F.Silk'] as const;
export type SubLayer = (typeof SUB_LAYERS)[number];

export interface StackDriveState {
  /** Active tier index 0..4. */
  readonly active: number;
  /** Cursor layer of the active board, or null while the board is assembled / has no file. */
  readonly sub: SubLayer | null;
  /** Raw drive position 0..tiers. */
  readonly p: number;
}

export interface StackDriveOptions {
  /** Drive position from layout: 0 … TIERS.length. Called inside the ticker frame only. */
  readonly measure: () => number;
  readonly onChange?: (s: StackDriveState) => void;
  /** Element whose visibility gates the listener (default: the stack's parent). */
  readonly hostRef?: RefObject<HTMLElement>;
  /** Set false to disable (e.g. a static instance). */
  readonly enabled?: boolean;
}

export function useStackDrive(stackRef: RefObject<HTMLElement>, options: StackDriveOptions): void {
  const opts = useRef(options);
  opts.current = options;
  const enabled = options.enabled ?? true;

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || !enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const host = opts.current.hostRef?.current ?? stack.parentElement ?? stack;
    const tiers = Array.from(stack.querySelectorAll<HTMLElement>('[data-tier]'));
    const layers = tiers.map((t) => Array.from(t.querySelectorAll<SVGGElement>('svg[data-board] > g[data-layer]')));
    stack.dataset.enhanced = '';

    let last = { active: -1, sub: null as SubLayer | null };
    let curEl: SVGGElement | null = null;
    let cancel: (() => void) | null = null;

    const update = (): void => {
      cancel = null;
      const p = Math.max(0, Math.min(TIERS.length, opts.current.measure()));
      const scale = stack.offsetHeight / STACK_H;
      const active = Math.min(TIERS.length - 1, Math.floor(p));
      let sub: SubLayer | null = null;
      tiers.forEach((el, i) => {
        const dy = tierOffset(i, p) * scale;
        el.style.transform = `translate(-50%, calc(-50% + ${dy.toFixed(1)}px))`;
        el.dataset.active = String(i === active);
        if (layers[i].length === 0) return;
        const e = subExplode(i, p);
        el.style.setProperty('--e', e.toFixed(3));
        const open = e > 0.04;
        el.dataset.exploding = String(open);
        if (i === active && open) {
          const f = clamp01((p - i - 0.08) / 0.8);
          sub = SUB_LAYERS[Math.min(SUB_LAYERS.length - 1, Math.floor(f * SUB_LAYERS.length))];
        }
      });
      if (active !== last.active || sub !== last.sub) {
        curEl?.removeAttribute('data-cur');
        curEl = sub ? layers[active].find((g) => g.dataset.layer === sub) ?? null : null;
        curEl?.setAttribute('data-cur', '');
        last = { active, sub };
        opts.current.onChange?.({ active, sub, p });
      }
    };

    const onScroll = (): void => {
      if (!cancel) cancel = onceTick(update);
    };
    let attached = false;
    const attach = (on: boolean): void => {
      if (on === attached) return;
      attached = on;
      if (on) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
      onScroll();
    };
    const io = new IntersectionObserver(([entry]) => attach(entry.isIntersecting), { rootMargin: '30% 0px' });
    io.observe(host);
    onScroll();

    return () => {
      io.disconnect();
      attach(false);
      cancel?.();
      delete stack.dataset.enhanced;
      curEl?.removeAttribute('data-cur');
      tiers.forEach((el) => {
        el.style.transform = '';
        el.style.removeProperty('--e');
        delete el.dataset.active;
        delete el.dataset.exploding;
      });
    };
  }, [stackRef, enabled]);
}
