'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelGlasses, RIGHT_LENS_CENTER } from './PixelArt';
import { PixelIcon } from './icons';
import { RSVP_DEMO_WPM, RSVP_WORDS } from './content';
import { useSign } from './SignProvider';
import styles from './f.module.css';

const INTRO_WPM = 200;

/**
 * DG-002 demo: one word at a fixed point (RSVP). Plays once, slowly, when it first scrolls
 * into view (3.3 s, under the 5 s WCAG 2.2.2 limit), never with reduced motion.
 * Replays only on request, at the record's demo pace (450 wpm).
 */
export function Rsvp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const autoplayed = useRef(false);
  const { ready } = useSign();

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

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !autoplayed.current) {
          autoplayed.current = true;
          play(INTRO_WPM);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [play, stop]);

  return (
    <div className={styles.rsvp} ref={box}>
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
      <p className={styles.srOnly}>Demo sentence: {RSVP_WORDS.join(' ')}</p>
      <div className={styles.rsvpBar}>
        <span className={styles.mono}>RSVP demo · one word, one fixed point</span>
        {ready && (
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => (playing ? stop() : play(RSVP_DEMO_WPM))}
          aria-label={playing ? 'Stop the reading demo' : `Play the reading demo at ${RSVP_DEMO_WPM} words per minute`}
        >
          <PixelIcon name={playing ? 'close' : 'play'} />
          <span>{playing ? 'Stop' : `Play at ${RSVP_DEMO_WPM} wpm`}</span>
        </button>
        )}
      </div>
    </div>
  );
}
