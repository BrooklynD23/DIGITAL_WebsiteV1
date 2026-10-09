import { RedirectStub, movedMetadata } from '../../../../_redirect';

export const metadata = movedMetadata;

/** Old URL kept working after the Apple-world pages became the default routes (2026-10-07). */
export default function MovedPage() {
  return <RedirectStub to="/projects/brain/" label="BRAIN" />;
}
