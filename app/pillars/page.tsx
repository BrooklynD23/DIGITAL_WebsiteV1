import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Moved — DIGITAL @ Cal Poly Pomona',
  description: 'The DIGITAL pillars now live on the About page.',
  robots: { index: false },
};

/**
 * The standalone /pillars route was folded into /about ("How we work") during
 * the 2026-08 site consolidation. This stub keeps old links working via a
 * client-side redirect plus a static fallback link (static-export safe).
 */
export default function PillarsRedirectPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[14px] bg-dg-bg px-6 text-center text-dg-ink">
      <script
        dangerouslySetInnerHTML={{ __html: 'location.replace("/about#how-we-work");' }}
      />
      <p className="m-0 font-homeMono text-[10px] uppercase tracking-[.18em] text-dg-muted">
        The pillars moved
      </p>
      <p className="m-0 max-w-[420px] text-[13px] leading-[1.7] text-dg-ink">
        You&apos;re being taken to{' '}
        <Link href="/about#how-we-work" className="underline underline-offset-2 hover:text-dg-green">
          About → How we work
        </Link>
        .
      </p>
    </div>
  );
}
