'use client';

/**
 * Phase-2 detail panels. As the glasses park at the mid-bottom, these spec/detail
 * sections crossfade in over their own scroll sub-ranges (driven by scrollYProgress).
 * Content comes from GLASSES_CONTENT.info.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { GlassesContent } from '@/lib/data/experiments/glasses';

interface InfoPanelsProps {
  sections: GlassesContent['info'];
  scrollYProgress: MotionValue<number>;
}

/** Each section owns a band in [0.68, 1.0]; crossfade with small lead/tail.
 *  Starts at 0.68 so the reveal headline has fully faded before panels appear. */
function band(i: number, total: number): [number, number, number, number] {
  const base = 0.74;
  const span = (1 - base) / total;
  const start = base + i * span;
  const end = start + span;
  return [start - 0.02, start + 0.02, end - 0.02, end + 0.02];
}

function Panel({
  section,
  scrollYProgress,
  i,
  total,
}: {
  section: GlassesContent['info'][number];
  scrollYProgress: MotionValue<number>;
  i: number;
  total: number;
}) {
  const [a, b, c, d] = band(i, total);
  const isLast = i === total - 1;
  // Keep the final panel pinned through the end of the scroll.
  const opacity = useTransform(scrollYProgress, [a, b, c, d], [0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(scrollYProgress, [a, b], [28, 0]);

  return (
    <motion.div
      id={section.id}
      style={{ opacity, y }}
      className="absolute inset-x-0 top-[26%] mx-auto max-w-2xl px-6 text-center"
    >
      <h2 className="font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-4xl">
        {section.title}
      </h2>
      <p className="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed text-white/70">
        {section.body}
      </p>
      {section.specs && (
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {section.specs.map((sp) => (
            <span key={sp.k} className="font-mono text-xs uppercase tracking-[0.18em] text-white/55">
              <span className="text-[#FACC15]">{sp.k}</span> {sp.v}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function InfoPanels({ sections, scrollYProgress }: InfoPanelsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {sections.map((section, i) => (
        <Panel
          key={section.id}
          section={section}
          scrollYProgress={scrollYProgress}
          i={i}
          total={sections.length}
        />
      ))}
    </div>
  );
}
