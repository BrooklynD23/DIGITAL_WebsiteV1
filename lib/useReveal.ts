'use client';

import { useEffect, useRef } from 'react';

/**
 * The one scroll-reveal implementation for secondary routes.
 * Observes every `[data-reveal]` descendant of the returned ref,
 * adds `is-visible` once on intersect (never reverses), honoring
 * an optional `data-reveal-delay` (ms string).
 *
 * Config matches the landing: threshold 0.1, rootMargin -6% bottom.
 */
export function useReveal<T extends HTMLElement>() {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.transitionDelay = `${parseInt(delay, 10) / 1000}s`;
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return rootRef;
}
