'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects, getFlagshipProject } from '@/lib/data/projects';
import { cn } from '@/lib/utils';

// Note: Metadata must be in a separate layout.tsx for client components
// See app/projects/layout.tsx for SEO metadata

type Category = 'all' | 'hardware' | 'software' | 'embedded' | 'robotics' | 'iot';

const filters: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Embedded', value: 'embedded' },
  { label: 'Robotics', value: 'robotics' },
];

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
      return matchesFilter && matchesSearch && !project.isFlagship;
    });
  }, [activeFilter, searchQuery]);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 z-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">
              Flagship Project
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-primary">The Modular</span>{' '}
              <span className="text-slate-900 dark:text-white">Smartphone</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-body leading-relaxed">
              {flagship?.fullDescription ||
                'A fully modular, repairable smartphone built from scratch by students.'}
            </p>
            <Link
              href={`/projects/${flagship?.slug || 'modular-smartphone'}`}
              className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 group w-fit"
            >
              <span>Explore the Specs</span>
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-[20px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full relative group">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-surface-dark">
              <Image
                src={flagship?.image || '/images/placeholders/projects/modular-phone.svg'}
                alt="The Modular Smartphone"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="w-full py-16 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Explore Our Projects
          </h2>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="flex w-full items-stretch rounded-lg h-12 bg-white dark:bg-surface-dark shadow-sm border border-gray-200 dark:border-transparent focus-within:border-primary transition-colors">
                <div className="text-gray-400 dark:text-[#9cabba] flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="flex w-full min-w-0 flex-1 bg-transparent text-gray-900 dark:text-white focus:outline-0 border-none h-full placeholder:text-gray-400 dark:placeholder:text-[#9cabba] px-2 text-base font-normal leading-normal"
                  placeholder="Search projects by name, status, or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'flex h-10 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-all',
                    activeFilter === filter.value
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-transparent hover:border-primary dark:hover:border-primary'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-bold uppercase',
                        project.status === 'active' && 'bg-green-500/20 text-green-400',
                        project.status === 'completed' && 'bg-blue-500/20 text-blue-400',
                        project.status === 'paused' && 'bg-yellow-500/20 text-yellow-400'
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
                search_off
              </span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                No projects found
              </h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 md:px-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-lg">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <span className="material-symbols-outlined text-4xl">lightbulb</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Have a Project Idea?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-body mb-8 max-w-xl mx-auto">
            We&apos;re always looking for ambitious projects. Pitch your idea and get the support
            of our engineering team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/20"
          >
            Submit Your Idea
          </Link>
        </div>
      </section>
    </main>
  );
}
