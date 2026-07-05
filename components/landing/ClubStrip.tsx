'use client';

/** Dark club strip after the chamber: stats, sponsors, join CTA, footer links. */

import Link from 'next/link';
import Image from 'next/image';
import { LANDING_CONTENT } from '@/lib/data/landing';
import { stats, sponsors } from '@/lib/data/siteConfig';

const statItems = [
  { value: stats.activeMembers, label: 'Active Members' },
  { value: stats.prototypes, label: 'Prototypes' },
  { value: stats.sponsors, label: 'Sponsors' },
];

export default function ClubStrip() {
  const { club, logoSrc } = LANDING_CONTENT;
  return (
    <section className="relative z-10 bg-[#16161a] px-8 py-24 text-center">
      <Image src={logoSrc} alt="DIGITAL @ Cal Poly Pomona" width={140} height={140} className="mx-auto" />
      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
        {statItems.map((s) => (
          <div key={s.label}>
            <span className="font-display text-4xl font-extrabold text-white">{s.value}</span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
        {sponsors.map((sp) => (
          <span key={sp.name} className="font-display text-sm font-semibold uppercase text-white/40">
            {sp.name}
          </span>
        ))}
      </div>
      <h2 className="mt-20 font-display text-4xl font-extrabold uppercase tracking-tight text-white">
        {club.joinHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-md font-body text-base text-white/60">{club.joinBody}</p>
      <Link href={club.joinCta.href}
        className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-display text-sm font-bold uppercase tracking-tight text-[#16161a] transition-colors hover:bg-[#d8412f] hover:text-white">
        {club.joinCta.label}
      </Link>
      <nav className="mt-16 flex justify-center gap-8">
        {club.links.map((l) => (
          <Link key={l.href} href={l.href}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white">
            {l.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
