'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  teamMembers,
  executiveRoles,
  type TeamMember,
} from '@/lib/data/team';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';
import { useReveal } from '@/lib/useReveal';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'executive' | 'projects';

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Executive Board', value: 'executive' },
  { label: 'Project Leads', value: 'projects' },
];

function isExecutive(member: TeamMember): boolean {
  return executiveRoles.includes(member.roleCategory);
}

function MemberCard({ member }: { member: TeamMember }) {
  const initials =
    member.role
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('') ?? '—';

  return (
    <div className="flex flex-col gap-[10px] border border-dg-line-card bg-dg-card p-[22px] hover:border-dg-line-strong">
      <span className="inline-flex size-[44px] items-center justify-center rounded-chip border border-dg-line font-homeMono text-[13px] text-dg-muted">
        {member.isPlaceholder ? '?' : initials}
      </span>
      <div>
        <h3
          className={cn(
            'm-0 text-[14px] font-semibold tracking-[.02em]',
            member.isPlaceholder ? 'text-dg-muted' : 'text-dg-ink'
          )}
        >
          {member.name}
        </h3>
        <p className="m-0 mt-[3px] font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-green">
          {member.role}
        </p>
        {member.project ? (
          <p className="m-0 mt-[6px] font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
            Project · {member.project}
          </p>
        ) : null}
        {member.term ? (
          <p className="m-0 mt-[3px] font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
            Term · {member.term}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function JoinSeatCard({ label }: { label: string }) {
  return (
    <Link
      href="/contact?type=leadership"
      className="flex flex-col items-start justify-center gap-[10px] border border-dashed border-dg-line-accent p-[22px] text-left transition-colors duration-200 hover:border-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
    >
      <span className="font-homeMono text-[15px] text-dg-muted">+</span>
      <span className="text-[14px] font-semibold tracking-[.02em] text-dg-ink">{label}</span>
    </Link>
  );
}

export default function TeamPage() {
  const rootRef = useReveal<HTMLDivElement>();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const executives = useMemo(
    () => teamMembers.filter(isExecutive).sort((a, b) => a.order - b.order),
    []
  );
  const leads = useMemo(
    () => teamMembers.filter((m) => m.roleCategory === 'project-lead').sort((a, b) => a.order - b.order),
    []
  );

  const visibleExecutives =
    activeFilter === 'all' || activeFilter === 'executive' ? executives : [];
  const visibleLeads = activeFilter === 'all' || activeFilter === 'projects' ? leads : [];
  const visibleCount = visibleExecutives.length + visibleLeads.length;

  return (
    <div ref={rootRef}>
      <PageShell eyebrow="The People" title="Run by students. Built in the open." metaRow={['Cal Poly Pomona', '2026–27']}>
        <div className="mx-auto max-w-[var(--dg-footer-max)]">
          {/* Filter row */}
          <Reveal className="mb-[26px] flex flex-wrap items-center justify-between gap-[14px]">
            <p className="m-0 font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted" aria-live="polite">
              Showing {visibleCount} {visibleCount === 1 ? 'role' : 'roles'}
            </p>
            <div className="flex flex-wrap gap-[8px]" role="group" aria-label="Filter roles">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={cn(
                    'rounded-cta border px-4 py-[7px] font-homeMono text-[10px] tracking-[.12em] transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green',
                    activeFilter === filter.value
                      ? 'border-dg-ink bg-dg-ink text-dg-bg'
                      : 'border-dg-line-hover bg-transparent text-dg-muted hover:border-dg-line-strong hover:text-dg-ink'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Reveal>

          {visibleCount === 0 ? (
            <div className="border border-dashed border-dg-line-accent p-[clamp(32px,6vh,64px)] text-center">
              <p className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">No roles shown</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-4 rounded-cta border border-dg-line-hover px-4 py-[8px] font-homeMono text-[10px] tracking-[.12em] text-dg-ink transition-colors duration-200 hover:bg-dg-ink hover:text-dg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Show all roles
              </button>
            </div>
          ) : null}

          {visibleExecutives.length > 0 ? (
            <section className="mb-[34px]">
              <Reveal className="mb-[14px] border-b border-dg-line-soft pb-[12px]">
                <h2 className="m-0 font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink">
                  Executive board
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
                {visibleExecutives.map((member, i) => (
                  <Reveal key={member.id} delay={120 + i * 110}>
                    <MemberCard member={member} />
                  </Reveal>
                ))}
                <Reveal delay={120 + visibleExecutives.length * 110}>
                  <JoinSeatCard label="Join the board" />
                </Reveal>
              </div>
            </section>
          ) : null}

          {visibleLeads.length > 0 ? (
            <section>
              <Reveal className="mb-[14px] border-b border-dg-line-soft pb-[12px]">
                <h2 className="m-0 font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink">
                  Project leads
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
                {visibleLeads.map((member, i) => (
                  <Reveal key={member.id} delay={120 + i * 110}>
                    <MemberCard member={member} />
                  </Reveal>
                ))}
                <Reveal delay={120 + visibleLeads.length * 110}>
                  <JoinSeatCard label="Lead a project" />
                </Reveal>
              </div>
            </section>
          ) : null}

          {/* Honesty note */}
          <Reveal delay={140} className="mt-[26px] border-t border-dg-line-soft pt-6">
            <p className="m-0 max-w-[560px] text-[12.5px] leading-[1.7] text-dg-muted">
              Roster details are being verified for this term. Names, photos, and contact
              links publish as they&apos;re confirmed — nothing here is filled in.
            </p>
          </Reveal>
        </div>
      </PageShell>
    </div>
  );
}
