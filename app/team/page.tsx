'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { teamMembers } from '@/lib/data/team';
import { cn } from '@/lib/utils';
import { NAVBAR_HEIGHT } from '@/components/layout/Navbar';
import { Card, Button, Icon, Eyebrow } from '@/components/ui';
import type { TeamMember } from '@/lib/types';

// Note: Metadata must be in a separate layout.tsx for client components
// See app/team/layout.tsx for SEO metadata

type Department = 'all' | 'executive' | 'hardware' | 'software' | 'outreach';

const filters: { label: string; value: Department }[] = [
  { label: 'All Members', value: 'all' },
  { label: 'Executive Board', value: 'executive' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Outreach', value: 'outreach' },
];

const departments: {
  value: Exclude<Department, 'all'>;
  index: string;
  label: string;
  joinLabel: string;
}[] = [
  { value: 'executive', index: '01', label: 'Executive Board', joinLabel: 'Join Executive' },
  { value: 'hardware', index: '02', label: 'Hardware Team', joinLabel: 'Join Hardware' },
  { value: 'software', index: '03', label: 'Software Team', joinLabel: 'Join Software' },
  { value: 'outreach', index: '04', label: 'Outreach & Design', joinLabel: 'Join Outreach' },
];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card variant="glass" padding="md" className="reveal in flex h-full flex-col items-center text-center">
      <div className="mb-4 size-28 overflow-hidden rounded-full border border-line">
        <Image
          src={member.image}
          alt={`Portrait of ${member.name}`}
          width={112}
          height={112}
          className="size-full object-cover"
        />
      </div>
      <h3 className="font-display text-[19px] font-bold uppercase leading-tight tracking-[-.01em] text-ink">
        {member.name}
      </h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[.16em] text-accent">
        {member.title}
      </p>
      {member.role !== member.title && (
        <p className="mt-1 text-[14px] leading-[1.5] text-ink-soft">{member.role}</p>
      )}
      {member.links && (
        <div className="mt-4 flex gap-3">
          {member.links.linkedin && (
            <a
              href={member.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded text-ink-soft transition-colors duration-200 ease-studio hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <Icon name="link" size="md" label={`${member.name} on LinkedIn`} />
            </a>
          )}
          {member.links.github && (
            <a
              href={member.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded text-ink-soft transition-colors duration-200 ease-studio hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <Icon name="code" size="md" label={`${member.name} on GitHub`} />
            </a>
          )}
          {member.links.email && (
            <a
              href={`mailto:${member.links.email}`}
              className="inline-flex size-9 items-center justify-center rounded text-ink-soft transition-colors duration-200 ease-studio hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <Icon name="mail" size="md" label={`Email ${member.name}`} />
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<Department>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesFilter = activeFilter === 'all' || member.department === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-content px-4 pb-[120px] md:px-7">
        {/* Hero Section */}
        <section className="pt-[120px] pb-16 md:pb-24">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <div className="flex w-full flex-col gap-6 lg:w-1/2">
              <Eyebrow>Who We Are</Eyebrow>
              <h1 className="font-display text-[clamp(40px,7vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
                Meet the <span className="text-outline">Builders</span>
                <span className="text-accent">.</span>
              </h1>
              <p className="max-w-[40ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
                We are a collective of engineers, designers, and innovators at Cal-Poly Pomona.
                From modular smartphones to industry-standard hardware, we are building the future
                together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button>Join the Team</Button>
                </Link>
                <Link href="/projects">
                  <Button variant="ghost">View Projects</Button>
                </Link>
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg border border-white/60 shadow-card lg:w-1/2">
              <div className="aspect-video w-full">
                <Image
                  src="/images/placeholders/team/group-photo.svg"
                  alt="Group of diverse students working together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <div
          className="sticky z-40 -mx-4 flex flex-col gap-6 border-y border-line bg-studio/85 px-4 py-6 backdrop-blur-[6px] md:-mx-7 md:px-7"
          style={{ top: `${NAVBAR_HEIGHT}px` }}
        >
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search */}
            <label className="flex h-11 w-full items-stretch rounded border border-line bg-white/55 transition-[border-color,box-shadow] duration-200 ease-studio focus-within:border-accent-blue focus-within:ring-2 focus-within:ring-accent-blue md:max-w-md">
              <span className="flex items-center justify-center pl-4 pr-2 text-ink-soft">
                <Icon name="search" size="md" />
              </span>
              <input
                type="text"
                className="w-full min-w-0 flex-1 border-none bg-transparent px-2 font-body text-base text-ink placeholder:text-ink-soft/70 focus:outline-none"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search members"
              />
            </label>

            {/* Filter Chips */}
            <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={cn(
                    'flex h-9 shrink-0 items-center justify-center rounded border px-4 font-mono text-[11px] uppercase tracking-[.16em] transition-colors duration-200 ease-studio focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                    activeFilter === filter.value
                      ? 'border-ink bg-ink text-studio'
                      : 'border-line bg-white/55 text-ink-soft hover:border-ink hover:text-ink'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-12 flex flex-col gap-16">
          {departments.map((dept) => {
            if (activeFilter !== 'all' && activeFilter !== dept.value) return null;
            const members = filteredMembers.filter((m) => m.department === dept.value);
            if (members.length === 0) return null;

            return (
              <section key={dept.value}>
                <div className="mb-8 border-t border-line pt-6">
                  <Eyebrow>{dept.index} / Department</Eyebrow>
                  <h2 className="mt-2 font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
                    {dept.label}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                  {/* Join Card */}
                  <Link
                    href="/contact"
                    className="group flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line p-[30px] text-center transition-colors duration-200 ease-studio hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-200 ease-studio group-hover:border-accent group-hover:text-accent">
                      <Icon name="add" size="md" />
                    </span>
                    <span className="font-display text-[15px] font-bold uppercase tracking-[-.01em] text-ink">
                      {dept.joinLabel}
                    </span>
                  </Link>
                </div>
              </section>
            );
          })}

          {/* No results */}
          {filteredMembers.length === 0 && (
            <div className="border-t border-line py-20 text-center">
              <span className="mb-4 inline-flex text-ink-soft">
                <Icon name="search_off" size="xl" />
              </span>
              <h3 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                No members found
              </h3>
              <p className="mt-2 text-[15px] text-ink-soft">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
