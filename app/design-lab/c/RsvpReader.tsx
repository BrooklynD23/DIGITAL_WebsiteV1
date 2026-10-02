'use client';

/**
 * Concept C — a working RSVP strip for the DG-002 record.
 * The real words and default pace come from lib/data/experiments/glasses.ts.
 * No autoplay under reduced motion; screen readers get the full sentence once.
 */
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import styles from './c.module.css';

const ICON = { size: 18, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;

interface Props {
  readonly words: readonly string[];
  readonly defaultWpm: number;
}

export default function RsvpReader({ words, defaultWpm }: Props) {
  const [wpm, setWpm] = useState(defaultWpm);
  const [playing, setPlaying] = useState(false);
  const [i, setI] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (reduce || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          setI(0);
          setPlaying(true);
        }
        if (!e.isIntersecting) setPlaying(false);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setI((n) => {
        if (n + 1 >= words.length) {
          setPlaying(false);
          return n;
        }
        return n + 1;
      });
    }, 60000 / wpm);
    return () => window.clearInterval(id);
  }, [playing, wpm, words.length]);

  const toggle = () => {
    if (!playing && i >= words.length - 1) setI(0);
    setPlaying((p) => !p);
  };

  return (
    <div ref={ref} className={styles.rsvp}>
      <p className={styles.srOnly}>{words.join(' ')}</p>
      <div className={styles.rsvpWindow} aria-hidden>
        <span className={styles.rsvpTick} />
        <span className={styles.rsvpWord}>{mounted ? words[i] : words.join(' ')}</span>
        <span className={styles.rsvpTick} />
      </div>
      {mounted ? (
        <div className={styles.rsvpControls}>
          <button type="button" className={styles.btnGhost} onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause {...ICON} aria-hidden /> : <Play {...ICON} aria-hidden />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <label className={styles.rsvpRange}>
            <span>Pace</span>
            <input
              type="range"
              min={150}
              max={600}
              step={50}
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              aria-valuetext={`${wpm} words per minute`}
            />
            <output className={styles.rsvpWpm}>{wpm} wpm</output>
          </label>
        </div>
      ) : null}
    </div>
  );
}
