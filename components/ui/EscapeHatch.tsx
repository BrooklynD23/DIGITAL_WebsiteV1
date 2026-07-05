'use client';

/** Minimal "back to DIGITAL" link for immersive pages: visible at rest,
 *  fades while scrolling through the middle, returns near the end. */

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EscapeHatch({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const [faded, setFaded] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setFaded(p > 0.08 && p < 0.9);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const color = tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-ink/70 hover:text-ink';
  return (
    <Link href="/"
      className={`fixed left-6 top-6 z-50 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity duration-500 ${color} ${faded ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      ← DIGITAL
    </Link>
  );
}
