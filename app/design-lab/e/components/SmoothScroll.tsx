'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Module singleton so the brief dialog can pause smooth scroll while it is open. */
let lenisInstance: Lenis | null = null;
export function getLenis(): Lenis | null {
  return lenisInstance;
}

const NAV_OFFSET = -72;

/**
 * Lenis smooth wheel scroll, driven by the GSAP ticker so ScrollTrigger scrubs stay in sync.
 * Not created under prefers-reduced-motion or on coarse pointers (native scroll there).
 */
export function SmoothScroll(): null {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: { offset: NAV_OFFSET } });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number): void => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}
