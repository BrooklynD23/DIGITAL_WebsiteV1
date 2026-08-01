'use client';

/**
 * Phase-2 detail panels. As the glasses park at the mid-bottom, these spec/detail
 * sections crossfade in over their own scroll sub-ranges (driven by scrollYProgress).
 * Content comes from GLASSES_CONTENT.info.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { GlassesContent } from '@/lib/data/experiments/glasses';
import { band } from './panelBands';

interface InfoPanelsProps {
  sections: GlassesContent['info'];
  scrollYProgress: MotionValue<number>;
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
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
        {section.title}
      </h2>
      <p className="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed text-white/70">
        {section.body}
      </p>
      {section.specs && (
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {section.specs.map((sp) => (
            <span key={sp.k} className="font-mono text-xs uppercase tracking-[0.18em] text-white/55">
              <span className="text-[#e3b341]">{sp.k}</span> {sp.v}
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
