'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { buildTiming } from './schematic';
import s from './b.module.css';

interface Props {
  readonly words: readonly string[];
  readonly wpm: number;
  readonly titleId: string;
}

const PLOT_W = 640;
const PLOT_H = 88;

/**
 * Fig. 3 — RSVP timing, computed from the record's demo word stream and WPM.
 * Auto-plays only when motion is allowed and the figure is on screen; always pausable.
 * Without JS (or with reduced motion) it renders as a static timing plot.
 */
export function RsvpTiming({ words, wpm, titleId }: Props) {
  const timing = useMemo(() => buildTiming(words, wpm, PLOT_W), [words, wpm]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const userPaused = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  // Arm autoplay only when motion is allowed.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches && !userPaused.current) setPlaying(true);
  }, []);

  // Pause offscreen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), timing.msPerWord);
    return () => window.clearInterval(id);
  }, [playing, visible, words.length, timing.msPerWord]);

  const current = timing.slots[index];
  const toggle = () => {
    userPaused.current = playing;
    setPlaying((p) => !p);
  };

  return (
    <div ref={root} className={s.rsvp}>
      <div className={s.rsvpReadout}>
        <div className={s.rsvpWindow} aria-hidden="true">
          <span className={s.rsvpTick} />
          <span className={s.rsvpWord}>{current.word}</span>
          <span className={`${s.rsvpTick} ${s.rsvpTickB}`} />
        </div>
        <dl className={s.rsvpStats}>
          <div><dt>Pace</dt><dd>{wpm} wpm</dd></div>
          <div><dt>Slot</dt><dd>{timing.msPerWord.toFixed(1)} ms</dd></div>
          <div><dt>Words</dt><dd>{words.length}</dd></div>
          <div><dt>Line</dt><dd>{(timing.totalMs / 1000).toFixed(2)} s</dd></div>
        </dl>
        <button type="button" className={s.iconButton} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause word stream' : 'Play word stream'}>
          {playing ? <IconPlayerPause size={20} stroke={1.5} aria-hidden="true" /> : <IconPlayerPlay size={20} stroke={1.5} aria-hidden="true" />}
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className={s.plotScroll}>
        <svg className={s.plot} viewBox={`-4 -4 ${PLOT_W + 8} ${PLOT_H + 30}`} role="img" aria-labelledby={titleId}>
          <desc>{`${words.length} words, ${timing.msPerWord.toFixed(1)} milliseconds each at ${wpm} words per minute: ${words.join(' ')}`}</desc>
          {/* gate signal: one pulse per word */}
          <path
            d={timing.slots
              .map((sl, i) => `${i === 0 ? 'M' : 'L'}${sl.x} ${PLOT_H - 22} V18 H${sl.x + sl.w - 4} V${PLOT_H - 22} H${sl.x + sl.w}`)
              .join(' ')}
            className={s.signal}
          />
          {timing.slots.map((sl) => (
            <g key={sl.index}>
              <rect
                x={sl.x}
                y={18}
                width={sl.w - 4}
                height={PLOT_H - 40}
                className={sl.index === index ? s.slotLit : s.slot}
              />
              <text x={sl.x + (sl.w - 4) / 2} y={PLOT_H / 2 - 2} dy="0.35em" textAnchor="middle" className={sl.index === index ? s.slotTextLit : s.slotText} fontSize={10.5}>
                {sl.word}
              </text>
            </g>
          ))}
          {/* axis */}
          <path d={`M0 ${PLOT_H - 8} H${PLOT_W}`} className={s.axis} />
          {timing.ticks.map((t) => (
            <g key={t.ms}>
              <path d={`M${t.x} ${PLOT_H - 12} V${PLOT_H - 4}`} className={s.axis} />
              <text x={t.x} y={PLOT_H + 10} textAnchor={t.x === 0 ? 'start' : t.x > PLOT_W - 20 ? 'end' : 'middle'} className={s.tickText} fontSize={9.5}>
                {t.ms === 0 ? '0 ms' : t.ms}
              </text>
            </g>
          ))}
          <text x={0} y={10} className={s.tickText} fontSize={9.5}>GATE</text>
        </svg>
      </div>
    </div>
  );
}
