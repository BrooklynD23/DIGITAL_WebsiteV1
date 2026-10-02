'use client';

import { useEffect } from 'react';

/**
 * Bench driver, same shape as SIDEKICK's useStackDrive: a passive scroll listener writes --e (0..1) on the stage
 * and flags data-exploding while the scrub is mid-way. No React re-render per frame.
 */
export function ScrollDrive({ band, stage }: { readonly band: string; readonly stage: string }) {
  useEffect(() => {
    const b = document.getElementById(band);
    const st = document.getElementById(stage);
    if (!b || !st) return undefined;
    const onScroll = () => {
      const r = b.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      const e = p < 0.5 ? p * 2 : 2 - p * 2; // open, then fold back
      st.style.setProperty('--e', e.toFixed(3));
      st.dataset.exploding = e > 0 && e < 1 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [band, stage]);
  return null;
}
