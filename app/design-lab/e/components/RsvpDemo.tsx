'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, StepForward } from 'lucide-react';
import s from '../e.module.css';

interface RsvpDemoProps {
  readonly words: readonly string[];
  readonly wpm: number;
}

const PACES = [250, 450] as const;
const END_HOLD_MS = 900;

/**
 * DG-002 artifact: an RSVP stream at a fixed point over the project's POV backdrop.
 * Never autoplays (WCAG 2.2.2); pauses offscreen; Step works without any animation.
 * Server HTML shows the first word plus the full sentence, so the idea reads with JS off.
 */
export function RsvpDemo({ words, wpm }: RsvpDemoProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pace, setPace] = useState<number>(wpm);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return undefined;
    const atEnd = index >= words.length - 1;
    const delay = atEnd ? END_HOLD_MS : Math.round(60000 / pace);
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % words.length), delay);
    return () => window.clearTimeout(t);
  }, [playing, index, pace, words.length]);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sentence = words.join(' ');

  return (
    <figure className={s.rsvp} style={{ margin: 0 }}>
      <div ref={viewRef} className={s.rsvpView}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized 1400w webp copy */}
        <img
          className={s.rsvpBg}
          src="/design-lab/e/book-blurry.webp"
          alt=""
          width={1400}
          height={788}
          loading="lazy"
          decoding="async"
        />
        <div className={s.rsvpHud} aria-hidden="true">
          <span>RSVP</span>
          <span>{pace} wpm</span>
        </div>
        <div className={s.rsvpLens}>
          <span className={s.rsvpFix} data-pos="top" aria-hidden="true" />
          <span className={s.rsvpWord} aria-hidden="true">
            {words[index]}
          </span>
          <span className={s.rsvpFix} data-pos="bottom" aria-hidden="true" />
          <span className={s.srOnly}>Sample sentence: {sentence}</span>
        </div>
      </div>
      <div className={s.rsvpBar}>
        <div className={s.rsvpControls}>
          <button
            type="button"
            className={s.ctrl}
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
          >
            {playing ? <Pause size={16} strokeWidth={1.5} aria-hidden="true" /> : <Play size={16} strokeWidth={1.5} aria-hidden="true" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            className={s.ctrl}
            onClick={() => {
              setPlaying(false);
              setIndex((i) => (i + 1) % words.length);
            }}
            aria-label="Next word"
          >
            <StepForward size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <div role="group" aria-label="Pace" className={s.rsvpControls}>
            {PACES.map((p) => (
              <button key={p} type="button" className={s.ctrl} aria-pressed={pace === p} onClick={() => setPace(p)}
                style={pace === p ? { borderColor: 'var(--fg)' } : undefined}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <figcaption className={s.rsvpCaption}>
          “{sentence}” · word {index + 1} of {words.length}. Backdrop is an illustrative page image, not a capture through the prototype.
        </figcaption>
      </div>
    </figure>
  );
}
