'use client';

/** Mission narrative overlays + hero wordmark + chamber labels. */

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { LANDING_CONTENT } from '@/lib/data/landing';

const BEAT_BANDS: ReadonlyArray<[number, number, number, number]> = [
  [0.25, 0.28, 0.37, 0.4],
  [0.4, 0.43, 0.52, 0.55],
  [0.55, 0.58, 0.67, 0.7],
  [0.7, 0.73, 0.79, 0.82],
];

function Beat({ i, scrollYProgress }: { i: number; scrollYProgress: MotionValue<number> }) {
  const [a, b, c, d] = BEAT_BANDS[i];
  const opacity = useTransform(scrollYProgress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [a, b], [24, 0]);
  const beat = LANDING_CONTENT.mission[i];
  const dark = i >= 2; // background has darkened by the 3rd beat
  return (
    <motion.div style={{ opacity, y }}
      className="absolute inset-x-0 top-[18%] z-20 mx-auto max-w-2xl px-6 text-center">
      <h2 className={`font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl ${dark ? 'text-studio' : 'text-ink'}`}>
        {beat.label}
      </h2>
      <p className={`mx-auto mt-4 max-w-md font-body text-base leading-relaxed ${dark ? 'text-studio/70' : 'text-ink-soft'}`}>
        {beat.line}
      </p>
    </motion.div>
  );
}

interface MissionBeatsProps {
  scrollYProgress: MotionValue<number>;
  hoveredId?: string | null;
}

export default function MissionBeats({ scrollYProgress, hoveredId }: MissionBeatsProps) {
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.14], [1, 1, 0]);
  const chamberOpacity = useTransform(scrollYProgress, [0.84, 0.88, 1], [0, 1, 1]);
  const { eyebrow, wordmark, tagline, chamber } = LANDING_CONTENT;
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Hero wordmark under the assembling mark */}
      <motion.div style={{ opacity: heroOpacity }}
        className="absolute inset-x-0 bottom-[12%] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-soft">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight text-ink sm:text-7xl">
          {wordmark}
        </h1>
        <p className="mt-3 font-body text-base text-ink-soft">{tagline}</p>
      </motion.div>

      {LANDING_CONTENT.mission.map((m, i) => (
        <Beat key={m.id} i={i} scrollYProgress={scrollYProgress} />
      ))}

      {/* Chamber labels — pointer events ON so the DOM links also work */}
      <motion.div style={{ opacity: chamberOpacity }}
        className="pointer-events-auto absolute inset-x-0 bottom-[8%] z-20">
        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.26em] text-studio/60">
          {chamber.eyebrow}
        </p>
        <div className="mx-auto flex max-w-3xl justify-between px-10">
          {chamber.portals.map((pt) => (
            <a key={pt.id} href={pt.href} className="group text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{pt.eyebrow}</p>
              <p className={`mt-1 font-display text-xl font-bold uppercase tracking-tight text-studio group-hover:underline ${hoveredId === pt.id ? 'underline' : ''}`}>
                {pt.title}
              </p>
              <p className="mt-1 max-w-[28ch] font-body text-sm text-studio/60">{pt.caption}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
