'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects, getFlagshipProject } from '@/lib/data/projects';
import { cn } from '@/lib/utils';
import { Badge, Button, Eyebrow, Icon, Input, OutlineHeading } from '@/components/ui';

// Note: Metadata lives in app/projects/layout.tsx (this is a client component).

type Category = 'all' | 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot' | 'wearable';

const filters: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Embedded', value: 'embedded' },
  { label: 'Robotics', value: 'robotics' },
];

const statusVariant = {
  active: 'active',
  completed: 'completed',
  paused: 'paused',
} as const;

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Reveal-on-scroll wiring (.reveal -> .reveal.in). Re-runs as cards mount.
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredProjects]);

  return (
    <div className="pt-28">
      {/* Flagship hero — dark ink device-render treatment */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-7 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="z-10 flex flex-1 flex-col gap-6">
              <Eyebrow>Flagship Project</Eyebrow>
              <OutlineHeading as="h1" size="hero" outline="Modular" after=" Smartphone" dot>
                The{' '}
              </OutlineHeading>
              <p className="max-w-[34ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
                {flagship?.fullDescription ||
                  'A fully modular, repairable smartphone built from scratch by students.'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {flagship && (
                  <Badge variant="flagship" pulse>
                    Flagship
                  </Badge>
                )}
                {flagship && (
                  <Badge variant={statusVariant[flagship.status]} pulse>
                    {flagship.status}
                  </Badge>
                )}
              </div>
              <div className="pt-2">
                <Link href={`/projects/${flagship?.slug || 'modular-smartphone'}`}>
                  <Button
                    size="lg"
                    icon={<Icon name="arrow_forward" size="sm" />}
                    iconPosition="right"
                  >
                    Explore the Specs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Device render tile */}
            <div className="w-full flex-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-ink shadow-card">
                <Image
                  src={flagship?.image || '/images/placeholders/projects/modular-phone.svg'}
                  alt="The Modular Smartphone"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <span className="absolute bottom-5 left-5 font-mono text-[12px] uppercase tracking-[.1em] text-studio">
                  00 · {flagship?.category ?? 'hardware'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project grid */}
      <section className="mx-auto max-w-content px-7 py-16 md:py-24">
        <Eyebrow>The Catalogue</Eyebrow>
        <OutlineHeading className="mt-4" outline="Projects" dot>
          Explore Our{' '}
        </OutlineHeading>

        {/* Search & filter */}
        <div className="mb-10 mt-10 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="max-w-md flex-1">
            <Input
              type="text"
              label="Search"
              placeholder="Search projects by name or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={isActive}
                  className={cn(
                    'shrink-0 rounded border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[.1em]',
                    'transition-[background-color,border-color,color] duration-200 ease-studio',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-studio',
                    isActive
                      ? 'border-ink bg-ink text-studio'
                      : 'border-line text-ink-soft hover:border-ink hover:text-ink'
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
        >
          {filteredProjects.map((project, index) =>
            project.comingSoon ? (
              // Placeholder projects have no detail route — render a static card rather
              // than a link that would 404.
              <article
                key={project.id}
                className={cn(
                  'reveal flex flex-col rounded-lg border border-white/40 bg-white/[.22] p-[30px] shadow-card backdrop-blur-[6px]'
                )}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Index + coming-soon badge */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[12px] uppercase tracking-[.1em] text-accent">
                    {String(index + 1).padStart(2, '0')} · {project.category}
                  </span>
                  <span className="rounded border border-line/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-ink-soft">
                    Coming Soon
                  </span>
                </div>

                <h3 className="font-display text-[21px] font-bold uppercase leading-none tracking-[-.01em] text-ink/60">
                  {project.title}
                </h3>

                <p className="mt-3 text-[15px] leading-[1.55] text-ink-soft/60">
                  More info soon.
                </p>

                <span className="mt-auto pt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft/60">
                  More Info Soon
                  <Icon
                    name="hourglass_empty"
                    size="sm"
                  />
                </span>
              </article>
            ) : (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={cn(
                  'reveal group flex flex-col rounded-lg border border-white/60 bg-white/[.42] p-[30px] shadow-card backdrop-blur-[6px]',
                  'transition-[transform,border-color] duration-300 ease-studio',
                  'hover:-translate-y-0.5 hover:border-white/80',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-studio'
                )}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Index + status */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[12px] uppercase tracking-[.1em] text-accent">
                    {String(index + 1).padStart(2, '0')} · {project.category}
                  </span>
                  <Badge variant={statusVariant[project.status]} size="sm">
                    {project.status}
                  </Badge>
                </div>

                <h3 className="font-display text-[21px] font-bold uppercase leading-none tracking-[-.01em] text-ink transition-colors duration-200 group-hover:text-accent">
                  {project.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-[15px] leading-[1.55] text-ink-soft">
                  {project.shortDescription}
                </p>

                {/* Tech stack chips */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-ink-soft"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-ink-soft">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink">
                  View Specs
                  <Icon
                    name="arrow_forward"
                    size="sm"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            )
          )}
        </div>

        {/* Empty state — shown only when active filter + search yields zero results */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-line py-24 text-center">
            <Icon name="search_off" size="xl" className="text-ink-soft" />
            <Eyebrow className="mt-5">No Results</Eyebrow>
            <h3 className="mt-2 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              No projects found
            </h3>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-ink-soft">
              No projects match your current search or filter. Try a different keyword or clear
              the active filter.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-6 rounded border border-ink bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[.16em] text-studio transition-[background-color,border-color] duration-200 ease-studio hover:border-accent hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-studio"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto flex max-w-content flex-col items-center px-7 py-[120px] text-center">
          <Icon name="lightbulb" size="xl" className="text-accent" />
          <Eyebrow className="mt-6">Pitch Us</Eyebrow>
          <OutlineHeading className="mt-4" outline="Idea" dot>
            Have a Project{' '}
          </OutlineHeading>
          <p className="mx-auto mt-6 max-w-[50ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            We&apos;re always looking for ambitious projects. Pitch your idea and get the support
            of our engineering team.
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <Button size="lg">Submit Your Idea</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
