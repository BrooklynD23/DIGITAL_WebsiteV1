'use client';

/**
 * Smart Reading — flagship wearable. The immersive scroll experience (R3F)
 * must be client-only: dynamic import with ssr:false for the static export.
 *
 * SmartReadingShell is the loading fallback so the route still exports real HTML
 * (crawlers, link previews, no-JS) instead of an empty div.
 */

import dynamic from 'next/dynamic';
import SmartReadingShell from '@/components/experiments/glasses/SmartReadingShell';

const GlassesExperience = dynamic(
  () => import('@/components/experiments/glasses/GlassesExperience'),
  { ssr: false, loading: () => <SmartReadingShell /> }
);

export default function SmartReadingPage() {
  return <GlassesExperience />;
}
