'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { teamMembers } from '@/lib/data/team';
import { cn } from '@/lib/utils';

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

  const executiveMembers = filteredMembers.filter((m) => m.department === 'executive');
  const hardwareMembers = filteredMembers.filter((m) => m.department === 'hardware');
  const softwareMembers = filteredMembers.filter((m) => m.department === 'software');
  const outreachMembers = filteredMembers.filter((m) => m.department === 'outreach');

  return (
    <main className="flex-grow flex flex-col items-center">
      <div className="w-full max-w-[1280px] px-4 md:px-10 pb-20">
        {/* Hero Section */}
        <div className="py-8">
          <div className="flex flex-col gap-6 py-10 lg:flex-row items-center">
            <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center">
              <div className="flex flex-col gap-4 text-left">
                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
                  Meet the Builders
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-relaxed lg:text-lg max-w-xl">
                  We are a collective of engineers, designers, and innovators at Cal-Poly Pomona.
                  From modular smartphones to industry-standard hardware, we are building the future
                  together.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
                >
                  Join the Team
                </Link>
                <Link
                  href="/projects"
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-200 dark:bg-surface-dark text-gray-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  View Projects
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all z-10" />
              <Image
                src="/images/placeholders/team/group-photo.svg"
                alt="Group of diverse students working together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-6 py-6 sticky top-[65px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm -mx-4 px-4 md:-mx-10 md:px-10 border-b border-gray-200 dark:border-surface-border transition-all">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
            {/* Search */}
            <label className="flex flex-col h-12 w-full md:max-w-md">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white dark:bg-surface-dark shadow-sm border border-gray-200 dark:border-transparent focus-within:border-primary transition-colors">
                <div className="text-gray-400 dark:text-[#9cabba] flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="flex w-full min-w-0 flex-1 bg-transparent text-gray-900 dark:text-white focus:outline-0 border-none h-full placeholder:text-gray-400 dark:placeholder:text-[#9cabba] px-2 text-base font-normal leading-normal"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'flex h-9 shrink-0 items-center justify-center px-4 rounded-full text-sm font-medium transition-all active:scale-95',
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
        </div>

        {/* Content Grid */}
        <div className="flex flex-col gap-12 mt-8">
          {/* Executive Board Section */}
          {(activeFilter === 'all' || activeFilter === 'executive') && executiveMembers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Executive Board</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {executiveMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group flex flex-col items-center bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-transparent hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-primary">arrow_outward</span>
                    </div>
                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-primary transition-colors">
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">{member.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{member.title}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 line-clamp-2">
                      {member.role}
                    </p>
                    <div className="flex gap-3 mt-auto">
                      {member.links?.linkedin && (
                        <a
                          href={member.links.linkedin}
                          className="text-gray-400 hover:text-primary transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="material-symbols-outlined text-[20px]">link</span>
                        </a>
                      )}
                      {member.links?.email && (
                        <a
                          href={`mailto:${member.links.email}`}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hardware Team */}
          {(activeFilter === 'all' || activeFilter === 'hardware') && hardwareMembers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-gray-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Hardware Team</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {hardwareMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-start bg-white dark:bg-surface-dark rounded-lg p-4 border border-gray-200 dark:border-transparent hover:border-primary transition-colors hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-gray-800">
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-base leading-tight">{member.name}</h4>
                    <p className="text-xs text-primary mb-1">{member.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                  </div>
                ))}
                {/* Join Card */}
                <Link
                  href="/contact"
                  className="flex flex-col items-center justify-center bg-gray-100 dark:bg-background-dark rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <h4 className="font-bold text-sm text-center">Join Hardware</h4>
                </Link>
              </div>
            </section>
          )}

          {/* Software Team */}
          {(activeFilter === 'all' || activeFilter === 'software') && softwareMembers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-gray-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Software Team</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {softwareMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-start bg-white dark:bg-surface-dark rounded-lg p-4 border border-gray-200 dark:border-transparent hover:border-primary transition-colors hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-gray-800">
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-base leading-tight">{member.name}</h4>
                    <p className="text-xs text-primary mb-1">{member.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                  </div>
                ))}
                {/* Join Card */}
                <Link
                  href="/contact"
                  className="flex flex-col items-center justify-center bg-gray-100 dark:bg-background-dark rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <h4 className="font-bold text-sm text-center">Join Software</h4>
                </Link>
              </div>
            </section>
          )}

          {/* Outreach Team */}
          {(activeFilter === 'all' || activeFilter === 'outreach') && outreachMembers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-gray-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Outreach & Design</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {outreachMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-start bg-white dark:bg-surface-dark rounded-lg p-4 border border-gray-200 dark:border-transparent hover:border-primary transition-colors hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-gray-800">
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-base leading-tight">{member.name}</h4>
                    <p className="text-xs text-primary mb-1">{member.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                  </div>
                ))}
                {/* Join Card */}
                <Link
                  href="/contact"
                  className="flex flex-col items-center justify-center bg-gray-100 dark:bg-background-dark rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <h4 className="font-bold text-sm text-center">Join Outreach</h4>
                </Link>
              </div>
            </section>
          )}

          {/* No results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
                search_off
              </span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                No members found
              </h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
