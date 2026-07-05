'use client';

/** End-of-experience handoff card — keeps the journey loop unbroken. */

import Link from 'next/link';

export interface NextProjectCardProps {
  eyebrow: string;
  title: string;
  href: string;
  tone: 'light' | 'dark';
}

export default function NextProjectCard({ eyebrow, title, href, tone }: NextProjectCardProps) {
  const box = tone === 'dark'
    ? 'border-white/20 text-white hover:border-white'
    : 'border-ink/20 text-ink hover:border-ink';
  const sub = tone === 'dark' ? 'text-white/50' : 'text-ink-soft';
  return (
    <Link href={href}
      className={`group inline-flex flex-col items-center gap-1 rounded-lg border px-8 py-5 transition-colors ${box}`}>
      <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${sub}`}>{eyebrow}</span>
      <span className="font-display text-xl font-bold uppercase tracking-tight">
        {title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
