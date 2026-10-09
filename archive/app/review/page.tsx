import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui';
import {
  reviewDecisionGroups,
  reviewHubNote,
  reviewProductionRoutes,
  type ReviewRouteStatus,
} from '@/lib/data/reviewRoutes';

export const metadata: Metadata = {
  title: 'Site Review Hub — DIGITAL (Internal)',
  description: 'Internal stakeholder review page for comparing site experience variants.',
  robots: { index: false, follow: false },
};

const statusStyles: Record<ReviewRouteStatus, string> = {
  production: 'border-line bg-studio text-ink-soft',
  candidate: 'border-accent-blue/40 bg-accent-blue/[.08] text-accent-blue',
  placeholder: 'border-ink-soft/40 bg-ink-soft/10 text-ink-soft',
  legacy: 'border-line bg-studio-lo text-ink-soft',
};

function StatusBadge({ status }: { status: ReviewRouteStatus }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.14em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-content px-7 py-[120px] md:py-[140px]">
      <div className="max-w-3xl">
        <Eyebrow>Internal review</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(32px,5vw,56px)] font-extrabold uppercase leading-[.95] tracking-[-.03em] text-ink">
          Site variations <span className="text-outline">review</span>
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">{reviewHubNote}</p>
      </div>

      <div className="mt-16 flex flex-col gap-14">
        {reviewDecisionGroups.map((group) => (
          <section key={group.id} aria-labelledby={`review-${group.id}`}>
            <h2
              id={`review-${group.id}`}
              className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink"
            >
              {group.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-[1.55] text-ink-soft">{group.question}</p>
            {group.mergeNote ? (
              <p className="mt-2 max-w-2xl font-mono text-[12px] leading-[1.5] text-ink-soft">
                {group.mergeNote}
              </p>
            ) : null}

            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {group.options.map((option) => (
                <li key={option.href}>
                  <Link
                    href={option.href}
                    className="group flex h-full flex-col rounded-lg border border-line bg-studio/50 p-5 transition-colors duration-200 hover:border-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[15px] font-bold uppercase tracking-[-.01em] text-ink transition-colors group-hover:text-accent">
                        {option.label}
                      </h3>
                      <StatusBadge status={option.status} />
                    </div>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[.12em] text-ink-soft">
                      {option.href}
                    </p>
                    <p className="mt-3 flex-1 text-[14px] leading-[1.55] text-ink-soft">
                      {option.description}
                    </p>
                    <span className="mt-4 font-mono text-[11px] uppercase tracking-[.16em] text-accent">
                      Open →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t border-line pt-14" aria-labelledby="review-production">
        <h2
          id="review-production"
          className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink"
        >
          Production routes
        </h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          Stable pages with no competing variant — verify navigation and cross-links.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reviewProductionRoutes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="flex items-center justify-between rounded border border-line px-4 py-3 font-mono text-[12px] text-ink transition-colors hover:border-ink-soft hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <span>{route.label}</span>
                <span className="text-ink-soft">{route.href}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
        Not indexed · not in sitemap · not in public nav
      </p>
    </div>
  );
}
