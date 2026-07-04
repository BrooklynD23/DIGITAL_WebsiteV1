'use client';

/**
 * Wearer-POV HUD — a real waveguide-display aesthetic. One grid, two colors
 * (phosphor + white focus word), tabular mono data, hairline brackets with a
 * faint chromatic fringe, spring-damped pointer parallax. Reduced motion falls
 * back to plain fades. DOM overlay, pointer-events-none.
 */

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion, useTransform, useMotionValueEvent, useMotionValue, useSpring,
  type MotionValue,
} from 'framer-motion';
import { Clock3, BatteryMedium, Radio } from 'lucide-react';
import { HUD_THEME, type GlassesHud } from '@/lib/data/experiments/glasses';

interface HudOverlayProps {
  scrollYProgress: MotionValue<number>;
  words: ReadonlyArray<string>;
  hud: GlassesHud;
}

const T = HUD_THEME;
const CHIP = 'rounded-[3px] px-2 py-1 font-mono text-[10px] tracking-[0.22em]';

function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: 'left-0 top-0 border-l border-t',
    tr: 'right-0 top-0 border-r border-t',
    bl: 'left-0 bottom-0 border-l border-b',
    br: 'right-0 bottom-0 border-r border-b',
  } as const;
  return (
    <span
      className={`absolute h-6 w-6 ${map[pos]}`}
      style={{ borderColor: T.phosphorDim, boxShadow: T.fringe }}
    />
  );
}

export default function HudOverlay({ scrollYProgress, words, hud }: HudOverlayProps) {
  const opacity = useTransform(scrollYProgress, [0.34, 0.4, 0.56, 0.6], [0, 1, 1, 0]);

  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const [reduce, setReduce] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pointer parallax — "projected, not printed" (disabled under reduced motion).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 12);
      py.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, px, py]);

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

  // Staggered entrance; exits ~40% faster than entrances.
  const item = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : {
          initial: { opacity: 0, y: 6 },
          animate: {
            opacity: 1, y: 0,
            transition: { type: 'spring' as const, stiffness: 120, damping: 20, delay },
          },
          exit: { opacity: 0, transition: { duration: 0.14 } },
        };

  return (
    <motion.div
      style={{ opacity, x: reduce ? 0 : sx, y: reduce ? 0 : sy }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      aria-hidden
    >
      <div
        className="relative grid h-[38vh] max-h-[360px] w-[min(76vw,540px)] grid-rows-[auto_1fr_auto]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />

        <AnimatePresence>
          {/* Row 1 — ambient data, aligned to bracket edges */}
          {active && (
            <motion.div key="hud-ambient" exit={item(0.05).exit} className="flex items-start justify-between px-3 pt-3">
              <motion.span {...item(0.05)} className={`${CHIP} flex items-center gap-1.5`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <Clock3 size={11} strokeWidth={1.5} /> {hud.time}
              </motion.span>
              <motion.span {...item(0.12)} className={`${CHIP} flex items-center gap-1.5`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <BatteryMedium size={12} strokeWidth={1.5} /> {hud.battery}
              </motion.span>
            </motion.div>
          )}

          {/* Row 2 — focal RSVP word + reticle */}
          {active && (
            <motion.div key="hud-focus" {...item(0)} className="flex flex-col items-center justify-center">
              <span className="mb-2 block h-2.5 w-px" style={{ backgroundColor: T.phosphorDim }} />
              <span className="rounded-md px-5 py-2" style={{ backgroundColor: T.glass }}>
                <span key={idx} className="font-display text-3xl font-semibold tracking-tight sm:text-[2.25rem]"
                  style={{ color: T.focus, textShadow: T.glow }}>
                  {word}
                </span>
              </span>
              {/* reticle underline */}
              <span className="mt-2 block h-px w-10" style={{ backgroundColor: T.phosphor, boxShadow: T.glow }} />
            </motion.div>
          )}

          {/* Row 3 — status line */}
          {active && (
            <motion.div key="hud-status" exit={item(0.18).exit} className="flex justify-center pb-3">
              <motion.span {...item(0.18)} className={`${CHIP} flex items-center gap-1.5 uppercase`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <Radio size={11} strokeWidth={1.5} /> {hud.label} · {hud.wpm} WPM · {hud.caption}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
