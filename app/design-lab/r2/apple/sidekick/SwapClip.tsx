'use client';

import { useEffect, useRef, useState } from 'react';
import { SidekickStack } from '../../_sidekick/Stack';
import s from './sidekick.module.css';

const OUT_AT = 450;
const BACK_AT = 2900;

/**
 * The swap beat, played once on entry: the fingerprint module lifts out, its empty seat shows, then it seats again.
 * A replay control is always present. Reduced motion: no autoplay; replay jump-cuts (CSS drops the transitions).
 * Code fallback for the `sidekick-swap` clip; it stays the render until a real clip exists in the cine manifest.
 */
export function SwapClip() {
  const hostRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [swapped, setSwapped] = useState(false);
  const [played, setPlayed] = useState(false);

  const play = (): void => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [window.setTimeout(() => setSwapped(true), OUT_AT), window.setTimeout(() => setSwapped(false), BACK_AT)];
    setPlayed(true);
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(host);
    const list = timers.current;
    return () => {
      io.disconnect();
      list.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div ref={hostRef} className={s.swapStage}>
      <div className={s.swapStack} data-swapped={swapped ? 'true' : 'false'}>
        <SidekickStack tags={false} seat label="The SIDEKICK stack with the fingerprint module lifting out of its seat and returning" />
      </div>
      <button type="button" className={s.replay} onClick={play} aria-label={played ? 'Replay the swap' : 'Play the swap'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12a7 7 0 1 0 2.05-4.95" />
          <path d="M5 4.5v3.5h3.5" />
        </svg>
      </button>
    </div>
  );
}
