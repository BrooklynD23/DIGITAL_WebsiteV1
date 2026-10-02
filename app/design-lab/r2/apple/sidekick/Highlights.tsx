'use client';

import { useRef, type ReactNode } from 'react';
import s from './sidekick.module.css';

/** Horizontal highlights strip: native scroll-snap; the arrows step one card (keyboard and touch both work without them). */
export function Highlights({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const step = (d: number): void => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('li');
    if (!track || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: d * (card.offsetWidth + 20), behavior: reduced ? 'auto' : 'smooth' });
  };
  return (
    <>
      <ul ref={trackRef} className={s.hlTrack} aria-label={label} tabIndex={0}>
        {children}
      </ul>
      <div className={s.hlBar}>
        <button type="button" className={s.arrow} onClick={() => step(-1)} aria-label="Previous highlight">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5L9 12l5.5 5.5" /></svg>
        </button>
        <button type="button" className={s.arrow} onClick={() => step(1)} aria-label="Next highlight">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5L15 12l-5.5 5.5" /></svg>
        </button>
      </div>
    </>
  );
}
