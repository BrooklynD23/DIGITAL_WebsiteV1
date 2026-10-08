'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Module singleton so the brief dialog can pause smooth scroll while it is open. */
let lenisInstance: Lenis | null = null;
let wakeFn: (() => void) | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Call after any programmatic lenis.scrollTo so the loop runs until the scroll settles. */
export function wakeLenis(): void {
  wakeFn?.();
}

const NAV_OFFSET = -72;
const IDLE_FRAMES = 4;

/**
 * Lenis smooth wheel scroll with an on-demand loop. requestAnimationFrame runs only while Lenis is
 * moving and stops a few frames after it settles, so the page is idle at rest (v1 ran the GSAP ticker
 * forever). Not created under prefers-reduced-motion or on coarse pointers. ScrollTrigger listens to
 * the native scroll events Lenis produces, so there is no ticker coupling.
 */
export function SmoothScroll(): null {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return undefined;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      autoRaf: false,
      anchors: { offset: NAV_OFFSET, duration: 0.9 },
    });
    lenisInstance = lenis;

    let rafId = 0;
    let idle = 0;
    const loop = (time: number): void => {
      lenis.raf(time);
      idle = lenis.isScrolling ? 0 : idle + 1;
      if (idle > IDLE_FRAMES) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };
    const wake = (): void => {
      idle = 0;
      if (rafId) return;
      // Reset Lenis' clock so the first frame after idle does not see a huge delta (instant jump).
      lenis.time = performance.now() - 16;
      rafId = requestAnimationFrame(loop);
    };
    wakeFn = wake;

    const onClick = (event: MouseEvent): void => {
      const target = event.target as Element | null;
      if (target?.closest?.('a[href^="#"]')) wake();
    };
    window.addEventListener('wheel', wake, { passive: true });
    document.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener('wheel', wake);
      document.removeEventListener('click', onClick, true);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
      wakeFn = null;
    };
  }, []);
  return null;
}
