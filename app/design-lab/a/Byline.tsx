'use client';

/**
 * Blank byline under a feature title: "BUILT BY ____". The red rule draws once when it
 * scrolls in, the same gesture as the cover's signature rule. Server HTML renders it drawn
 * (no-JS safe); it is only armed when below the fold and motion is allowed.
 */
import { useEffect, useRef, useState } from 'react';
import styles from './a.module.css';

export default function Byline({ label }: { readonly label: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [state, setState] = useState<'drawn' | 'armed' | 'run'>('drawn');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('run');
          io.disconnect();
        }
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p ref={ref} className={styles.byline} data-sign={state}>
      <span className={styles.bylineLabel}>{label}</span>
      <span className={styles.bylineRule}>
        <span className={styles.srOnly}>blank, no names confirmed yet</span>
      </span>
    </p>
  );
}
