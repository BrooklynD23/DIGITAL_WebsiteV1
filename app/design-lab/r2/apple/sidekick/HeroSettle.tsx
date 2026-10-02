'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Hero entrance, once: the carrier's layers settle onto the core (Web Animations on the composited BoardLayers
 * boxes, so no rAF of ours and no re-render). Content is fully drawn at rest without it; reduced motion and
 * static captures ([data-r2-static]) skip it.
 */
export function HeroSettle({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (document.documentElement.hasAttribute('data-r2-static')) return undefined;
    const anims = Array.from(root.querySelectorAll<HTMLElement>('[data-board-layer]')).map((el) => {
      const cs = getComputedStyle(el);
      const ux = parseFloat(cs.getPropertyValue('--ux')) || 0;
      const uy = parseFloat(cs.getPropertyValue('--uy')) || 0;
      return el.animate(
        [
          { transform: `translate3d(${(ux * 0.6).toFixed(2)}%, ${(uy * 0.6).toFixed(2)}%, 0)`, opacity: 0.2 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ],
        { duration: 1500, delay: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
      );
    });
    return () => anims.forEach((a) => a.cancel());
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
