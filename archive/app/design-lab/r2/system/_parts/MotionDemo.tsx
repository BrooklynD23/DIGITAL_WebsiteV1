'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DURATION, SPRING } from '../../_system/tokens/motion';
import { useReducedMotion } from '../../_system/tokens/scroll';
import s from '../system.module.css';

const PUCK = 20;

interface Lane {
  readonly id: string;
  readonly name: string;
  readonly spec: string;
  readonly use: string;
}

const LANES: readonly Lane[] = [
  { id: 'ui', name: 'UI state', spec: '280 ms · cubic-bezier(0.4, 0, 0.6, 1)', use: 'Hover, tab, card. CSS transition' },
  { id: 'css-spring', name: 'Spatial spring, CSS', spec: 'linear() sampled · 420 ms', use: 'Hover and press with no JS' },
  { id: 'fast', name: 'Spatial fast', spec: 'ζ 0.6 · k 800 · damping 33.94', use: 'Buttons, switches, small moves' },
  { id: 'spatial', name: 'Spatial default', spec: 'ζ 0.8 · k 380 · damping 31.19', use: 'Cards, sheets, mid moves' },
  { id: 'effects', name: 'Effects', spec: 'ζ 1.0 · k 800 · damping 56.57', use: 'Opacity and colour, never overshoots' },
];

export function MotionDemo() {
  const [on, setOn] = useState(false);
  const [travel, setTravel] = useState(240);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setTravel(Math.max(0, el.clientWidth - PUCK)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x = on ? travel : 0;
  const instant = { duration: 0 } as const;

  return (
    <div className={s.motionDemo}>
      <button type="button" className={s.textBtn} aria-pressed={on} onClick={() => setOn((v) => !v)}>
        {on ? 'Send back' : 'Send across'}
      </button>
      <ol className={s.lanes}>
        {LANES.map((lane, i) => (
          <li key={lane.id} className={s.lane}>
            <div className={s.laneHead}>
              <span className={s.laneName}>{lane.name}</span>
              <span className={s.monoLabel}>{lane.spec}</span>
            </div>
            <div className={s.track} ref={i === 0 ? track : undefined}>
              {lane.id === 'ui' || lane.id === 'css-spring' ? (
                <span
                  className={lane.id === 'ui' ? s.puckUi : s.puckCss}
                  style={{ ['--x' as string]: `${x}px` } as CSSProperties}
                />
              ) : lane.id === 'effects' ? (
                <motion.span
                  className={s.puckWide}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0.2 }}
                  transition={reduced ? instant : SPRING.effects}
                />
              ) : (
                <motion.span
                  className={s.puck}
                  initial={false}
                  animate={{ x }}
                  transition={reduced ? instant : lane.id === 'fast' ? SPRING.spatialFast : SPRING.spatial}
                />
              )}
            </div>
            <p className={s.small}>{lane.use}</p>
          </li>
        ))}
      </ol>
      <dl className={s.tokens}>
        <div>
          <dt>Snap</dt>
          <dd>{DURATION.snap} ms</dd>
        </div>
        <div>
          <dt>UI</dt>
          <dd>
            {DURATION.uiFast}–{DURATION.uiSlow} ms
          </dd>
        </div>
        <div>
          <dt>Glyph draw</dt>
          <dd>{DURATION.draw} ms, once</dd>
        </div>
        <div>
          <dt>Stage settle</dt>
          <dd>≤ {DURATION.settle} ms</dd>
        </div>
        <div>
          <dt>Reveal</dt>
          <dd>30 px + fade, scroll-linked</dd>
        </div>
      </dl>
    </div>
  );
}
