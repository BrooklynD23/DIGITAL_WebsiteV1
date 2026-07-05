'use client';

/** Legacy URL — the experience was promoted to /projects/smart-reading. */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyGlassesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/projects/smart-reading');
  }, [router]);
  return null;
}
