import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui';
import { stats, sponsors } from '@/lib/data/siteConfig';
import { projects } from '@/lib/data/projects';

export const metadata: Metadata = {
  title: 'DIGITAL - Engineering Club @ Cal Poly Pomona',
  description: 'Building the future, one module at a time. Industry-standard engineering experience backed by the Project Hatchery Foundation.',
};

export default function HomePage() {
  const featuredProjects = projects.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col gap-6 z-10">
            <Badge pulse>Now Recruiting for Fall 2024</Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-slate-900 dark:text-white">
              Building the Future, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                One Module
              </span>{' '}
              at a Time.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl font-body leading-relaxed">
              DIGITAL @ Cal-Poly Pomona: Industry-standard engineering experience backed by the
              Project Hatchery Foundation. We bridge the gap between theory and reality.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/projects/modular-smartphone"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 group"
              >
                <span>View Modular Phone</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-[20px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white text-base font-bold transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-surface-dark">
              <Image
                src="/images/placeholders/general/hero-device.svg"
                alt="Exploded view of advanced smartphone components and circuitry"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                priority
              />
              {/* Overlay UI Elements */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-mono text-primary">
                  BATTERY_MOD_V2
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-mono text-green-400">
                  STATUS: ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
                {stats.activeMembers}
              </span>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                Active Members
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
                {stats.prototypes}
              </span>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                Prototypes
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
                {stats.linesOfCode}
              </span>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                Lines of Code
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
                {stats.sponsors}
              </span>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                Sponsors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / About */}
      <section className="w-full py-20 px-4 md:px-10 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-6">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Our Mission</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            We don&apos;t just study engineering. <br className="hidden md:block" /> We build
            industry-ready technology.
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-body leading-relaxed max-w-2xl mx-auto">
            DIGITAL is more than a club; it&apos;s a pre-professional ecosystem. From embedded
            systems to consumer electronics, we provide students with the funding, mentorship, and
            resources to build complex hardware and software projects that rival commercial
            products.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full py-20 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Featured Projects
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-body">
                Explore what our teams are building this semester.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              View All Projects{' '}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Main Featured Project (Span 2 cols) */}
            <Link
              href={`/projects/${featuredProjects[0]?.slug}`}
              className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface-dark cursor-pointer"
            >
              <Image
                src={featuredProjects[0]?.image || '/images/placeholders/projects/modular-phone.svg'}
                alt={featuredProjects[0]?.title || 'Featured Project'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="mb-2 inline-block px-2 py-1 bg-primary/20 border border-primary/40 rounded text-xs font-bold text-primary uppercase">
                  Flagship
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {featuredProjects[0]?.title}
                </h3>
                <p className="text-gray-300 font-body max-w-lg mb-4">
                  {featuredProjects[0]?.shortDescription}
                </p>
                <span className="text-white text-sm font-bold border-b border-primary pb-1">
                  View Specs
                </span>
              </div>
            </Link>

            {/* Secondary Projects */}
            {featuredProjects.slice(1, 3).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface-dark cursor-pointer"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm font-body line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>
              </Link>
            ))}

            {/* Wide Project Card */}
            {featuredProjects[3] && (
              <Link
                href={`/projects/${featuredProjects[3].slug}`}
                className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface-dark cursor-pointer"
              >
                <Image
                  src={featuredProjects[3].image}
                  alt={featuredProjects[3].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 w-full">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{featuredProjects[3].title}</h3>
                    <p className="text-gray-400 text-sm font-body max-w-md">
                      {featuredProjects[3].shortDescription}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-white">arrow_outward</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="w-full py-16 px-4 md:px-10 bg-background-light dark:bg-background-dark border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-10 text-sm">
            Backed By Industry Leaders
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white"
              >
                <span className="material-symbols-outlined text-4xl">{sponsor.icon}</span>
                {sponsor.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4 md:px-10 bg-background-light dark:bg-background-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <span className="material-symbols-outlined text-4xl">electrical_services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Join the Circuit?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-body mb-10 max-w-xl mx-auto">
            Whether you&apos;re an Electrical Engineer, CS major, or just love to tinker,
            there&apos;s a place for you at DIGITAL. No prior experience required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center rounded-lg h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold transition-all shadow-xl shadow-primary/20"
            >
              Apply for Membership
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center rounded-lg h-14 px-8 bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white text-lg font-bold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
