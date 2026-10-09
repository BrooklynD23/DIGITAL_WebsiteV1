'use client';

/**
 * The "putting on the glasses" POV background.
 *
 * Across the centered/forward-facing window the world behind the glasses fades in as a
 * text-dense scene that resolves from BLURRY (uncorrected vision) to CLEAR (corrected). Sits
 * behind the 3D canvas, so the lenses sit in front of the text.
 *
 * Legibility: the scene is darkened + desaturated and a scrim is laid on top so any HUD text
 * over it clears WCAG 4.5:1 (per UI/UX rules color-contrast + depth-layering), while a brighter
 * "lens window" in the centre keeps the page readable through the glasses.
 *
 * If pov.blurry / pov.clear image paths are provided they are used; otherwise a built-in
 * text-wall (from pov.paragraph) is rendered and blurred with CSS.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { GlassesPov } from '@/lib/data/experiments/glasses';

interface PovBackgroundProps {
  scrollYProgress: MotionValue<number>;
  pov: GlassesPov;
}

function TextWall({ paragraph }: { paragraph: string }) {
  return (
    <div
      className="h-full w-full px-[8vw] py-[10vh] text-justify font-body text-[15px] leading-[1.7] text-white/70"
      style={{ columnCount: 3, columnGap: '3vw' }}
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <p key={i} className="mb-4 break-inside-avoid">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function PovBackground({ scrollYProgress, pov }: PovBackgroundProps) {
  // Visible only across the centered/HUD window; fully gone by 0.60 (before the reveal beat).
  const layerOpacity = useTransform(scrollYProgress, [0.3, 0.36, 0.55, 0.6], [0, 1, 1, 0]);
  // Correction: clear crossfades in over the blurry base mid-window.
  const clearOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const hasImages = pov.blurry !== '' && pov.clear !== '';

  return (
    <motion.div
      style={{ opacity: layerOpacity }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Scene, muted so overlaid text stays legible */}
      <div className="absolute inset-0" style={{ filter: 'saturate(0.7) brightness(0.62)' }}>
        {hasImages ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pov.blurry} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <motion.img
              src={pov.clear}
              alt=""
              style={{ opacity: clearOpacity }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ filter: 'blur(7px) contrast(0.8)', opacity: 0.5 }}>
              <TextWall paragraph={pov.paragraph} />
            </div>
            <motion.div className="absolute inset-0" style={{ opacity: clearOpacity }}>
              <TextWall paragraph={pov.paragraph} />
            </motion.div>
          </>
        )}
      </div>

      {/* Flat scrim — guarantees baseline contrast for any overlaid text */}
      <div className="absolute inset-0 bg-[#0b0e16]/45" />
      {/* Radial: keep the centre (lens window) a touch brighter, darken the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 52% at 50% 50%, rgba(0,0,0,0) 0%, rgba(11,14,22,0.45) 68%, rgba(11,14,22,0.85) 100%)',
        }}
      />
    </motion.div>
  );
}
