'use client';

/**
 * Plays a CSS sequence once when it enters view (Apple rule: clips play once on entry).
 * Default (no JS, reduced motion, already scrolled past): no attribute, so the figure is fully drawn.
 * Armed only when the element starts below the fold; data-run="play" at ≥ 50% visible. No rAF.
 */
import { useEffect, useRef, type ReactNode } from 'react';

export function PlayOnce({ className, children }: { readonly className?: string; readonly children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.6) return undefined;
    el.dataset.run = 'armed';
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.run = 'play';
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
