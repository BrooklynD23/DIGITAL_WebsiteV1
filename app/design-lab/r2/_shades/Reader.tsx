'use client';

/**
 * The SHADES RSVP reader (signature beat, both worlds).
 * - Never autoplays. Read / Pause / Resume / Read again, previous / next word, restart, WPM slider.
 * - Timing runs on a setTimeout chain only while playing: 0 rAF, nothing at rest.
 * - Reduced motion: the primary control becomes "Next word" (step-through); the full sentence is always printed.
 * - Keyboard: every control is a native button / range; ←/→ step and K toggles while focus is inside the reader.
 * The big word is aria-hidden: screen readers get the printed sentence (with the current word marked) instead.
 */
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useReducedMotion } from '../_system';
import { SHADES } from '../_content/shades';
import { clampWpm, splitWord, wordDelay } from './rsvp';
import { SpacingToggle } from './ShadesRoot';
import s from './reader.module.css';

type Phase = 'idle' | 'playing' | 'paused' | 'done';

const R = SHADES.reader;
const WORDS = R.words;
const LAST = WORDS.length - 1;

export function Reader({ variant, headingId }: { readonly variant: 'signal' | 'apple'; readonly headingId?: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [wpm, setWpm] = useState<number>(R.wpm.initial);
  const [announce, setAnnounce] = useState('');
  const [mounted, setMounted] = useState(false);
  const timer = useRef<number | null>(null);
  const sliderId = useId();
  const textId = useId();

  const clear = (): void => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // Timing chain: one timeout per word, only while playing.
  useEffect(() => {
    if (phase !== 'playing') return undefined;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      if (index >= LAST) {
        setPhase('done');
        setAnnounce('Finished. Press Read again to restart.');
      } else {
        setIndex(index + 1);
      }
    }, wordDelay(WORDS[index], wpm));
    return clear;
  }, [phase, index, wpm]);

  // Reduced motion switched on mid-play: stop and fall back to stepping.
  useEffect(() => {
    if (reduced && phase === 'playing') setPhase('paused');
  }, [reduced, phase]);

  useEffect(() => clear, []);
  useEffect(() => setMounted(true), []);

  const step = useCallback((dir: 1 | -1) => {
    setPhase((p) => (p === 'playing' ? 'paused' : p));
    setIndex((i) => {
      const next = Math.min(LAST, Math.max(0, i + dir));
      return next;
    });
  }, []);

  const primary = (): void => {
    if (reduced) {
      if (phase === 'done' || index >= LAST) {
        setIndex(0);
        setPhase('paused');
        setAnnounce('');
        return;
      }
      setIndex((i) => Math.min(LAST, i + 1));
      setPhase(index + 1 >= LAST ? 'done' : 'paused');
      return;
    }
    if (phase === 'playing') {
      setPhase('paused');
      setAnnounce(`Paused at word ${index + 1} of ${WORDS.length}.`);
      return;
    }
    if (phase === 'done') setIndex(0);
    setAnnounce('');
    setPhase('playing');
  };

  const restart = (): void => {
    clear();
    setIndex(0);
    setPhase('idle');
    setAnnounce('Back to the first word.');
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>): void => {
    const t = e.target as HTMLElement;
    if (t instanceof HTMLInputElement) return; // the slider owns its arrows
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      primary();
    }
  };

  const label = reduced
    ? phase === 'done' || index >= LAST
      ? R.controls.again
      : R.controls.next
    : phase === 'playing'
      ? R.controls.pause
      : phase === 'paused'
        ? R.controls.resume
        : phase === 'done'
          ? R.controls.again
          : R.controls.read;

  const word = splitWord(WORDS[index]);
  const progress = WORDS.length > 1 ? index / LAST : 1;

  return (
    <div
      className={s.reader}
      data-variant={variant}
      data-phase={phase}
      data-reduced={reduced ? 'true' : 'false'}
      role="group"
      aria-labelledby={headingId}
      aria-describedby={textId}
      onKeyDown={onKey}
    >
      <div className={s.screen} aria-hidden="true">
        <span className={s.tickTop} />
        <span className={s.tickBottom} />
        <span className={s.anchor} />
        <p className={s.word} key={index} data-reduced={reduced ? 'true' : undefined}>
          <span className={s.pre}>{word.pre}</span>
          <span className={s.pivot}>{word.pivot}</span>
          <span className={s.post}>{word.post}</span>
        </p>
        <span className={s.base}>
          <span className={s.baseFill} style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className={s.readout}>
          {String(index + 1).padStart(2, '0')}/{WORDS.length} · {wpm} {R.unit}
        </span>
      </div>

      <div className={s.controls}>
        <button type="button" className={s.primary} onClick={primary} aria-keyshortcuts="K">
          <PrimaryIcon kind={reduced ? 'next' : phase === 'playing' ? 'pause' : phase === 'done' ? 'again' : 'play'} />
          <span>{label}</span>
        </button>
        <div className={s.steps}>
          <button type="button" className={s.icon} onClick={() => step(-1)} aria-label={R.controls.back} disabled={index === 0}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M14.5 6.5L9 12l5.5 5.5" />
            </svg>
          </button>
          {!reduced ? (
            <button type="button" className={s.icon} onClick={() => step(1)} aria-label={R.controls.next} disabled={index >= LAST}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path d="M9.5 6.5L15 12l-5.5 5.5" />
              </svg>
            </button>
          ) : null}
          <button type="button" className={s.icon} onClick={restart} aria-label={R.controls.restart} disabled={index === 0 && phase === 'idle'}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M5.5 12a6.5 6.5 0 1 0 1.9-4.6" />
              <path d="M5.5 4.5v3.4h3.4" />
            </svg>
          </button>
        </div>
        <label className={s.speed} htmlFor={sliderId}>
          <span className={s.speedLabel}>{R.controls.speed}</span>
          <input
            id={sliderId}
            type="range"
            min={R.wpm.min}
            max={R.wpm.max}
            step={R.wpm.step}
            value={wpm}
            aria-valuetext={`${wpm} words per minute`}
            onChange={(e) => setWpm(clampWpm(Number(e.target.value), R.wpm.min, R.wpm.max, R.wpm.step))}
          />
          <output className={s.speedValue} htmlFor={sliderId}>
            {wpm} {R.unit}
          </output>
        </label>
        <SpacingToggle className={s.spacing} label={SHADES.spacing.label} />
      </div>

      <p className={mounted && !reduced ? `${s.text} sr-only` : s.text} id={textId}>
        <span className={s.textLabel}>{R.textLabel}: </span>
        {WORDS.map((w, i) => (
          <span key={`${w}-${i}`} className={s.tw} data-current={i === index ? 'true' : undefined} aria-current={i === index ? 'true' : undefined}>
            {w}
            {i < LAST ? ' ' : ''}
          </span>
        ))}
      </p>
      {reduced ? <p className={s.note}>{R.reducedNote}</p> : null}
      <p className={`${s.sr} sr-only`} aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

function PrimaryIcon({ kind }: { readonly kind: 'play' | 'pause' | 'again' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" className={s.primaryIcon}>
      {kind === 'play' ? <path d="M8 5.5v13l10.5-6.5z" data-fill="" /> : null}
      {kind === 'pause' ? (
        <g data-fill="">
          <rect x="6.5" y="5.5" width="3.5" height="13" rx="1" />
          <rect x="14" y="5.5" width="3.5" height="13" rx="1" />
        </g>
      ) : null}
      {kind === 'again' ? (
        <g>
          <path d="M5.5 12a6.5 6.5 0 1 0 1.9-4.6" />
          <path d="M5.5 4.5v3.4h3.4" />
        </g>
      ) : null}
      {kind === 'next' ? <path d="M9.5 6.5L15 12l-5.5 5.5" /> : null}
    </svg>
  );
}
