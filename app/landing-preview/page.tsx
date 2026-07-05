'use client';

/** Staged landing revamp — promoted to `/` after team sign-off. R3F ⇒ client-only. */

import dynamic from 'next/dynamic';

const LandingExperience = dynamic(
  () => import('@/components/landing/LandingExperience'),
  { ssr: false }
);

export default function LandingPreviewPage() {
  return <LandingExperience />;
}
