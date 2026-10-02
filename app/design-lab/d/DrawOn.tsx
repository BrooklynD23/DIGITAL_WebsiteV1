'use client';

import { useEffect } from 'react';

/**
 * Progressive enhancement for the Rough.js layer. Without JS, or with
 * prefers-reduced-motion, every sketch is already fully drawn (server HTML).
 * With JS + motion allowed, it arms the root and draws each sketch once when it
 * scrolls into view. Renders nothing.
 */
export function DrawOn({ rootId }: { readonly rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const sketches = Array.from(root.querySelectorAll<SVGElement>('[data-sketch]:not([data-still])'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-drawn', '');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    root.setAttribute('data-armed', '');
    sketches.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      root.removeAttribute('data-armed');
    };
  }, [rootId]);

  return null;
}
