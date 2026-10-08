'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { PixelGlasses, RIGHT_LENS_CENTER } from './PixelArt';
import { PixelIcon } from './icons';
import { RSVP_DEMO_WPM, RSVP_WORDS } from './content';
import { useSign } from './SignProvider';
import styles from './f.module.css';

const LANDING_WPM = 200;

/**
 * DG-002 demo: one word at a fixed point (RSVP).
 * "Nothing moves unless you move it": it never autoplays on scroll. It plays when the visitor
 * presses Play, or once when their tag lands on a DG-002 seat (their own act).
 * Reduced motion: no timed playback; a Next-word button steps through, and the sentence is printed.
 */
export function Rsvp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const { ready, seat } = useSign();
  const prefersReduced = useReducedMotion();
  // Gate on hydration so server and first client render match.
  const reduce = ready && Boolean(prefersReduced);
  const lastSeat = useRef<string | null | undefined>(undefined);

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(
    (wpm: number) => {
      stop();
      setIndex(0);
      setPlaying(true);
      let i = 0;
      timer.current = window.setInterval(() => {
        i += 1;
        if (i >= RSVP_WORDS.length) {
          stop();
          return;
        }
        setIndex(i);
      }, 60000 / wpm);
    },
    [stop],
  );

  // Play once when the visitor's tag lands on a DG-002 seat (skip the restore-from-storage case).
  useEffect(() => {
    if (!ready) return;
    const id = seat?.id ?? null;
    if (lastSeat.current === undefined) {
      lastSeat.current = id;
      return;
    }
    if (id !== lastSeat.current && seat?.projectId === 'dg-002' && !reduce) play(LANDING_WPM);
    lastSeat.current = id;
  }, [seat, ready, reduce, play]);

  useEffect(() => stop, [stop]);

  const step = () => setIndex((i) => (i + 1) % RSVP_WORDS.length);

  return (
    <div className={styles.rsvp}>
      <div className={styles.rsvpStage}>
        <PixelGlasses className={styles.glassesArt} />
        <span
          className={styles.rsvpWord}
          style={{ left: RIGHT_LENS_CENTER.left, top: RIGHT_LENS_CENTER.top }}
          aria-hidden="true"
        >
          {RSVP_WORDS[index]}
        </span>
      </div>
      {reduce ? (
        <p className={styles.rsvpSentence}>{RSVP_WORDS.join(' ')}</p>
      ) : (
        <p className={styles.srOnly}>Demo sentence: {RSVP_WORDS.join(' ')}</p>
      )}
      <div className={styles.rsvpBar}>
        <span className={styles.mono}>RSVP: one word, one fixed point</span>
        {ready &&
          (reduce ? (
            <button type="button" className={styles.ghostBtn} onClick={step} aria-label="Show the next word in the lens">
              <PixelIcon name="arrow-right" />
              <span>Next word</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => (playing ? stop() : play(RSVP_DEMO_WPM))}
            >
              <PixelIcon name={playing ? 'close' : 'play'} />
              <span>{playing ? 'Stop the demo' : `Play at ${RSVP_DEMO_WPM} wpm`}</span>
            </button>
          ))}
      </div>
    </div>
  );
}
