'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects, getFlagshipProject } from '@/lib/data/projects';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';

// Note: Metadata lives in app/projects/layout.tsx (this is a client component).

type Category = 'all' | 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot' | 'wearable';

const filters: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Embedded', value: 'embedded' },
  { label: 'Robotics', value: 'robotics' },
];

const fieldControl =
  'w-full rounded-cta border border-dg-line-soft bg-dg-card px-[12px] py-[10px] font-homeSans text-[13px] leading-[1.5] text-dg-ink transition-colors duration-200 placeholder:text-dg-muted-dark focus:border-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green';

function StatusLabel({ status }: { status: Project['status'] }) {
  return (
    <span className="font-homeMono text-[8.5px] uppercase tracking-[.16em] text-dg-muted">
      {status}
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  if (project.comingSoon) {
    // Placeholder projects have no detail route — render a static card rather
    // than a link that would 404.
    return (
      <article className="flex flex-col border border-dashed border-dg-line-accent bg-dg-bg p-[22px]">
        <div className="mb-[14px] flex items-center justify-between">
          <span className="font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
            {String(index + 1).padStart(2, '0')} · {project.category}
          </span>
          <span className="font-homeMono text-[8.5px] uppercase tracking-[.16em] text-dg-muted-dark">
            Coming soon
          </span>
        </div>
        <h3 className="m-0 text-[16px] font-semibold tracking-[.02em] text-dg-muted">
          {project.title}
        </h3>
        <p className="m-0 mt-[8px] text-[12px] leading-[1.7] text-dg-muted-dark">
          More info soon.
        </p>
      </article>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        'group flex flex-col border border-dg-line-card bg-dg-card p-[22px]',
        'transition-colors duration-200 hover:border-dg-line-strong',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green'
      )}
    >
      <div className="mb-[14px] flex items-center justify-between">
        <span className="font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
          {String(index + 1).padStart(2, '0')} · {project.category}
        </span>
        <StatusLabel status={project.status} />
      </div>
      <h3 className="m-0 text-[16px] font-semibold tracking-[.02em] text-dg-ink transition-colors duration-200 group-hover:text-dg-green">
        {project.title}
      </h3>
      <p className="m-0 mt-[8px] line-clamp-3 flex-1 text-[12.5px] leading-[1.7] text-dg-muted">
        {project.shortDescription}
      </p>
      <div className="mt-[14px] flex flex-wrap gap-[6px]">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-cta border border-dg-line-soft px-2 py-0.5 font-homeMono text-[9px] uppercase tracking-[.1em] text-dg-muted"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 4 && (
          <span className="rounded-cta border border-dg-line-soft px-2 py-0.5 font-homeMono text-[9px] uppercase tracking-[.1em] text-dg-muted">
            +{project.techStack.length - 4}
          </span>
        )}
      </div>
      <span className="mt-[16px] font-homeMono text-[10px] uppercase tracking-[.14em] text-dg-ink group-hover:text-dg-green">
        View specs →
      </span>
    </Link>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const flagship = getFlagshipProject();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = activeFilter === 'all' || project.category === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch && project.slug !== flagship?.slug;
    });
  }, [activeFilter, searchQuery, flagship?.slug]);

  return (
    <PageShell
      eyebrow="Build Record"
      title="What we're building."
      metaRow={[`${projects.length} projects`, flagship ? `Flagship · ${flagship.title}` : '']}
    >
      <div className="mx-auto max-w-[var(--dg-footer-max)]">
        {/* Flagship band */}
        {flagship ? (
          <Reveal className="mb-[clamp(40px,7vh,72px)] grid items-center gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
            <div className="flex flex-col items-start gap-[12px]">
              <p className="m-0 font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted">
                Flagship · {flagship.status}
              </p>
              <h2 className="m-0 max-w-[420px] font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink">
                {flagship.title}
              </h2>
              <p className="m-0 max-w-[460px] text-[13px] leading-[1.75] text-dg-muted">
                {flagship.fullDescription || flagship.shortDescription}
              </p>
              <Link
                href={`/projects/${flagship.slug}`}
                className="mt-[6px] inline-block rounded-cta bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg transition-colors duration-200 hover:bg-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Explore the build
              </Link>
            </div>
            <Link
              href={`/projects/${flagship.slug}`}
              aria-label={`Open ${flagship.title}`}
              className="relative block h-[clamp(220px,30vw,320px)] overflow-hidden rounded-plate border border-dg-line-hair focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
            >
              <Image
                src={flagship.image || '/images/placeholders/projects/modular-phone.svg'}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-90"
                priority
              />
              <span className="absolute bottom-3 left-3 bg-dg-bg px-2 py-1 font-homeMono text-[9px] uppercase tracking-[.14em] text-dg-ink-45">
                [ 00 · FLAGSHIP RENDER ]
              </span>
            </Link>
          </Reveal>
        ) : null}

        {/* Catalogue */}
        <section aria-labelledby="catalogue-heading">
          <Reveal className="mb-[18px] border-b border-dg-line-soft pb-[12px]">
            <h2
              id="catalogue-heading"
              className="m-0 font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink"
            >
              The catalogue
            </h2>
          </Reveal>

          <Reveal delay={110} className="mb-[22px] flex flex-col gap-[14px] md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <label htmlFor="project-search" className="mb-[6px] block font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted">
                Search
              </label>
              <input
                id="project-search"
                type="text"
                placeholder="Search by name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={fieldControl}
              />
            </div>
            <div className="flex gap-[8px] overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Filter projects">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={isActive}
                    className={cn(
                      'shrink-0 rounded-cta border px-4 py-[8px] font-homeMono text-[10px] uppercase tracking-[.12em]',
                      'transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green',
                      isActive
                        ? 'border-dg-ink bg-dg-ink text-dg-bg'
                        : 'border-dg-line-hover bg-transparent text-dg-muted hover:border-dg-line-strong hover:text-dg-ink'
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <p className="sr-only" aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} shown
          </p>

          <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {filteredProjects.map((project, index) => (
              <Reveal key={project.id} delay={120 + (index % 4) * 110}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="mt-[22px] border border-dashed border-dg-line-accent p-[clamp(32px,6vh,64px)] text-center">
              <p className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                No projects found
              </p>
              <p className="mx-auto m-0 mt-[6px] max-w-[36ch] text-[12.5px] leading-[1.7] text-dg-muted">
                Nothing matches this search or filter. Clear it and browse the full record.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-cta border border-dg-line-hover px-4 py-[8px] font-homeMono text-[10px] tracking-[.12em] text-dg-ink transition-colors duration-200 hover:bg-dg-ink hover:text-dg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Pitch band — dark close */}
        <Reveal delay={110}>
          <section className="mt-[clamp(48px,9vh,96px)] border-y border-dg-line-dark bg-dg-dark px-[clamp(24px,4vw,56px)] py-[clamp(40px,8vh,80px)] text-center text-dg-cream">
            <p className="m-0 font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted-dark">
              Pitch us
            </p>
            <h2 className="mx-auto m-0 mt-[10px] max-w-[var(--dg-heading-max)] font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2]">
              Have a project the club should build?
            </h2>
            <p className="mx-auto m-0 mt-[10px] max-w-[460px] text-[13px] leading-[1.75] text-dg-muted-dark">
              Bring a problem with real constraints. We&apos;ll scope it with you and put student
              owners on it.
            </p>
            <Link
              href="/contact?type=project"
              className="mt-[20px] inline-block rounded-cta bg-dg-gold px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-dark transition-colors duration-200 hover:bg-dg-gold-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
            >
              Submit your idea
            </Link>
          </section>
        </Reveal>
      </div>
    </PageShell>
  );
}
