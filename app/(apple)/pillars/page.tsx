import type { Metadata } from 'next';
import { RedirectStub, movedMetadata } from '../_redirect';

export const metadata: Metadata = {
  ...movedMetadata,
  description: 'The DIGITAL pillars now live on the About page.',
};

/**
 * The standalone /pillars route was folded into /about ("How we work") during the 2026-08 site consolidation.
 * This stub keeps old links working via a client-side redirect plus a static fallback link (static-export safe).
 */
export default function PillarsRedirectPage() {
  return <RedirectStub to="/about/#how-we-work" label="About → How we work" />;
}
