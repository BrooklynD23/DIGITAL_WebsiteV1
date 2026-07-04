'use client';

/**
 * Wearer-POV HUD overlay — restrained real-AR aesthetic, built for legibility over a busy
 * scene (UI/UX rules: color-contrast 4.5:1, depth-layering / glass backing, single focus).
 *
 * The focal RSVP word sits on a small dark glass chip so it stays readable over any
 * background; ambient readouts sit in their own small chips in the field-of-view corners.
 * The word stream is the text being read in the POV scene (pov.words).
 *
 * DOM overlay (crisp), pointer-events-none. RSVP loop runs only while the HUD is visible.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import type { GlassesHud } from '@/lib/data/experiments/glasses';

interface HudOverlayProps {
  scrollYProgress: MotionValue<number>;
  words: ReadonlyArray<string>;
  hud: GlassesHud;
}

const MINT = 'rgba(155,246,196,0.95)';
const CHIP = 'bg-black/45 backdrop-blur-[2px] ring-1 ring-[rgba(155,246,196,0.22)]';

/** One hairline corner bracket. */
function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute h-5 w-5 border-[rgba(155,246,196,0.4)]';
  const map = {
    tl: 'left-0 top-0 border-l border-t',
    tr: 'right-0 top-0 border-r border-t',
    bl: 'left-0 bottom-0 border-l border-b',
    br: 'right-0 bottom-0 border-r border-b',
  } as const;
  return <span className={`${base} ${map[pos]}`} />;
}

export default function HudOverlay({ scrollYProgress, words, hud }: HudOverlayProps) {
  const opacity = useTransform(scrollYProgress, [0.34, 0.4, 0.54, 0.6], [0, 1, 1, 0]);

  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const inWindow = v >= 0.34 && v <= 0.6;
    if (inWindow !== active) setActive(inWindow);
  });

  useEffect(() => {
    if (!active) {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      setIdx(0);
      return;
    }
    timer.current = setInterval(() => setIdx((i) => (i + 1) % words.length), 320);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active, words.length]);

  const word = words[idx] ?? '';

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      aria-hidden
    >
      <div className="relative h-[36vh] max-h-[340px] w-[min(74vw,500px)]">
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />

        {/* Ambient readouts — small dark chips, top corners */}
        <div className={`absolute left-2 top-2 rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em] ${CHIP}`} style={{ color: MINT }}>
          {hud.time}
        </div>
        <div className={`absolute right-2 top-2 rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em] ${CHIP}`} style={{ color: MINT }}>
          {hud.battery}
        </div>

        {/* Focal RSVP word on a dark glass chip */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mb-2 block h-2.5 w-px" style={{ backgroundColor: MINT }} />
          <span key={idx} className={`rounded-md px-4 py-1.5 ${CHIP}`}>
            <span
              className="font-display text-3xl font-semibold tracking-tight sm:text-[2.25rem]"
              style={{ color: '#f1fff8' }}
            >
              {word}
            </span>
          </span>
          <span className="mt-2 block h-px w-7" style={{ backgroundColor: MINT }} />
        </div>

        {/* Baseline label chip */}
        <div className="absolute inset-x-0 bottom-1 flex justify-center">
          <span className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] ${CHIP}`} style={{ color: MINT }}>
            {hud.label} · {hud.wpm} WPM · {hud.caption}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
