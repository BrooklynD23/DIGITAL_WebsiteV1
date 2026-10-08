'use client';

/**
 * Fig. 3 — a working RSVP plate: one word at a fixed point, the optimal-recognition
 * letter pinned on the red fixation tick. Words and the 450 wpm demo pace come from
 * lib/data/experiments/glasses.ts. Never autoplays; the reader starts it (honours
 * reduced motion by construction: word swaps only, no movement). The play button swaps its
 * label (Read it / Pause) and so carries no aria-pressed; pace buttons keep a fixed label + aria-pressed. No-JS shows the
 * last word and the full sentence as a caption.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './a.module.css';

interface RsvpPlateProps {
  readonly words: readonly string[];
  readonly demoWpm: number;
}

const PACES = [200, 300] as const;

/** Optimal recognition point: the letter the eye should land on. */
function orpIndex(word: string): number {
  const len = word.replace(/[^A-Za-z0-9]/g, '').length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  return 3;
}

export default function RsvpPlate({ words, demoWpm }: RsvpPlateProps) {
  const paces = [...PACES, demoWpm];
  const [index, setIndex] = useState(words.length - 1);
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState<number>(paces[0]);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= words.length - 1) {
          stop();
          return i;
        }
        return i + 1;
      });
    }, 60000 / wpm);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [playing, wpm, words.length, stop]);

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }
    setIndex(0);
    setPlaying(true);
  };

  const word = words[index] ?? '';
  const pivot = orpIndex(word);

  return (
    <figure className={styles.rsvp}>
      <div className={styles.rsvpScreen}>
        <span className={styles.rsvpTick} aria-hidden="true" />
        <p className={styles.rsvpWord} aria-live="off">
          <span className={styles.rsvpLeft}>{word.slice(0, pivot)}</span>
          <span className={styles.rsvpPivot}>{word.charAt(pivot)}</span>
          <span className={styles.rsvpRight}>{word.slice(pivot + 1)}</span>
        </p>
        <span className={`${styles.rsvpTick} ${styles.rsvpTickBottom}`} aria-hidden="true" />
        <p className={styles.rsvpHud} aria-hidden="true">
          RSVP · {wpm} wpm · {index + 1}/{words.length}
        </p>
      </div>
      <div className={styles.rsvpControls}>
        <button type="button" className={styles.rsvpButton} onClick={toggle}>
          {playing ? 'Pause' : 'Read it'}
        </button>
        <div role="group" aria-label="Pace in words per minute" className={styles.rsvpPaces}>
          {paces.map((p) => (
            <button
              key={p}
              type="button"
              className={styles.rsvpPace}
              aria-pressed={wpm === p}
              onClick={() => setWpm(p)}
            >
              {p}
              {p === demoWpm ? <span className={styles.rsvpPaceNote}> demo</span> : null}
            </button>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.figNo}>Fig. 3</span> The reading method, working in your browser.
        The sentence: “{words.join(' ')}” The reader sets the pace; {demoWpm} wpm is the HUD demo
        speed.
      </figcaption>
    </figure>
  );
}
