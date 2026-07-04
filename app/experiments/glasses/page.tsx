'use client';

/**
 * Experimental route: /experiments/glasses
 *
 * Isolated Mana-style scroll hero for the club's heads-up-display "smart glasses".
 * The whole experience is real-time WebGL (R3F), so it must be client-only — loaded
 * via next/dynamic with ssr:false to keep it out of the static-export prerender.
 */

import dynamic from 'next/dynamic';

const GlassesExperience = dynamic(
  () => import('@/components/experiments/glasses/GlassesExperience'),
  { ssr: false }
);

export default function GlassesExperimentPage() {
  return <GlassesExperience />;
}
