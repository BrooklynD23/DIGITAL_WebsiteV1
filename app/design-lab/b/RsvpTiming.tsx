'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
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
 * Single shot, like a scope trigger: one pass (11 words, 1.47 s) when the figure first
 * comes into view, then it holds on the last word with every slot marked. "Run again"
 * replays one pass. Reduced motion: no automatic pass. Without JS: static plot.
 */
export function RsvpTiming({ words, wpm, titleId }: Props) {
  const timing = useMemo(() => buildTiming(words, wpm, PLOT_W), [words, wpm]);
  const last = words.length - 1;
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const run = useCallback(() => {
    setDone(false);
    setIndex(0);
    setRunning(true);
  }, []);

  // One automatic pass on first view, only when motion is allowed.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  useEffect(() => {
    if (!running) return;
    if (index >= last) {
      setRunning(false);
      setDone(true);
      return;
    }
    const id = window.setTimeout(() => setIndex((i) => i + 1), timing.msPerWord);
    return () => window.clearTimeout(id);
  }, [running, index, last, timing.msPerWord]);

  const current = timing.slots[index];
  const slotClass = (i: number) => (i === index ? s.slotLit : done || (running && i < index) ? s.slotDone : s.slot);

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
        <button type="button" className={s.iconButton} onClick={run}>
          <IconPlayerPlay size={20} stroke={1.5} aria-hidden="true" />
          <span>Run again</span>
        </button>
      </div>

      <div
        className={s.plotScroll}
        tabIndex={0}
        role="region"
        aria-label="RSVP timing plot, scrolls sideways on small screens"
      >
        <svg className={s.plot} viewBox={`-4 -4 ${PLOT_W + 8} ${PLOT_H + 30}`} role="img" aria-labelledby={titleId}>
          <desc>{`${words.length} words, ${timing.msPerWord.toFixed(1)} milliseconds each at ${wpm} words per minute: ${words.join(' ')}`}</desc>
          <path
            d={timing.slots
              .map((sl, i) => `${i === 0 ? 'M' : 'L'}${sl.x} ${PLOT_H - 22} V18 H${sl.x + sl.w - 4} V${PLOT_H - 22} H${sl.x + sl.w}`)
              .join(' ')}
            className={s.signal}
          />
          {timing.slots.map((sl) => (
            <g key={sl.index}>
              <rect x={sl.x} y={18} width={sl.w - 4} height={PLOT_H - 40} className={slotClass(sl.index)} />
              <text
                x={sl.x + (sl.w - 4) / 2}
                y={PLOT_H / 2 - 2}
                dy="0.35em"
                textAnchor="middle"
                className={sl.index === index ? s.slotTextLit : s.slotText}
                fontSize={12}
              >
                {sl.word}
              </text>
            </g>
          ))}
          <path d={`M0 ${PLOT_H - 8} H${PLOT_W}`} className={s.axis} />
          {timing.ticks.map((t) => (
            <g key={t.ms}>
              <path d={`M${t.x} ${PLOT_H - 12} V${PLOT_H - 4}`} className={s.axis} />
              <text
                x={t.x}
                y={PLOT_H + 12}
                textAnchor={t.x === 0 ? 'start' : t.x > PLOT_W - 20 ? 'end' : 'middle'}
                className={s.tickText}
                fontSize={12}
              >
                {t.ms === 0 ? '0 ms' : t.ms}
              </text>
            </g>
          ))}
          <text x={0} y={10} className={s.tickText} fontSize={12}>GATE</text>
        </svg>
      </div>
    </div>
  );
}
