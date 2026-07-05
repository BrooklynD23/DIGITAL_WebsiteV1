'use client';

/**
 * Smart Reading — flagship wearable. The immersive scroll experience (R3F)
 * must be client-only: dynamic import with ssr:false for the static export.
 */

import dynamic from 'next/dynamic';

const GlassesExperience = dynamic(
  () => import('@/components/experiments/glasses/GlassesExperience'),
  { ssr: false }
);

export default function SmartReadingPage() {
  return <GlassesExperience />;
}
