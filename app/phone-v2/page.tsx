'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy URL — the experience lives at /projects/modular-smartphone. */

export default function LegacyPhoneV2Redirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/projects/modular-smartphone');
  }, [router]);
  return null;
}
