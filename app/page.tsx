import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, Eyebrow, Icon, OutlineHeading } from '@/components/ui';
import { stats, sponsors } from '@/lib/data/siteConfig';
import { projects } from '@/lib/data/projects';
import { Teardown } from '@/components/teardown/Teardown';

export const metadata: Metadata = {
  title: 'DIGITAL - Engineering Club @ Cal Poly Pomona',
  description:
    'Building the future, one module at a time. Industry-standard engineering experience backed by the Project Hatchery Foundation.',
};

const statItems = [
  { value: stats.activeMembers, label: 'Active Members' },
  { value: stats.prototypes, label: 'Prototypes' },
  { value: stats.linesOfCode, label: 'Lines of Code' },
  { value: stats.sponsors, label: 'Sponsors' },
];

export default function HomePage() {
  const featuredProjects = projects.slice(0, 4);

  return (
    <>
      {/* ░░░ HERO ░░░ */}
      <section
        id="start"
        className="flex min-h-[100svh] items-center pt-[90px]"
      >
        <div className="wrap">
          <Eyebrow>DIGITAL · Cal Poly Pomona</Eyebrow>
          <OutlineHeading
            as="h1"
            size="hero"
            className="mt-5"
            outline="future"
            after=", one module at a time"
            dot
          >
            building the{' '}
          </OutlineHeading>
          <p className="mt-[30px] max-w-[34ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            <strong className="text-ink">DIGITAL @ Cal Poly Pomona:</strong>{' '}
            industry-standard engineering experience backed by the Project
            Hatchery Foundation. We bridge the gap between theory and reality.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-[14px]">
            <Link href="/projects/modular-smartphone">
              <Button
                size="lg"
                icon={<Icon name="arrow_forward" size="md" />}
                iconPosition="right"
              >
                View Modular Phone
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="scrollcue mt-[56px] flex items-center gap-[14px] font-mono text-[11px] uppercase leading-none tracking-wide text-ink-soft">
            Scroll
          </div>
        </div>
      </section>

      {/* ░░░ SIGNATURE TEARDOWN ░░░ */}
      <Teardown
        eyebrow="Scroll to disassemble"
        heading={
          <>
            twelve layers,
            <br />
            one device.
          </>
        }
        caption="Scroll down and the Modular Smartphone comes apart — board by board, part by part. Scroll back up and it reassembles. Every layer is tied to your scroll."
      />

      {/* ░░░ STATS BAR ░░░ */}
      <section className="border-t border-line py-[120px]">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-line">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="reveal flex flex-col items-center px-4 text-center md:items-start md:text-left"
              >
                <span className="font-display text-5xl font-extrabold leading-none tracking-[-.03em] text-ink md:text-6xl">
                  {stat.value}
                </span>
                <span className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink-soft">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ MISSION ░░░ */}
      <section className="border-t border-line py-[120px]">
        <div className="wrap">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Eyebrow className="reveal">Our Mission</Eyebrow>
            <h2 className="reveal font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
              We don&apos;t just study engineering.
              <br className="hidden md:block" /> We build industry-ready
              technology.
            </h2>
            <p className="reveal max-w-2xl text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              DIGITAL is more than a club; it&apos;s a pre-professional
              ecosystem. From embedded systems to consumer electronics, we
              provide students with the funding, mentorship, and resources to
              build complex hardware and software projects that rival commercial
              products.
            </p>
          </div>
        </div>
      </section>

      {/* ░░░ FEATURED PROJECTS BENTO ░░░ */}
      <section className="border-t border-line py-[120px]">
        <div className="wrap">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow className="reveal">What we build</Eyebrow>
              <OutlineHeading
                className="reveal mt-3"
                outline="projects"
              >
                featured{' '}
              </OutlineHeading>
            </div>
            <Link
              href="/projects"
              className="reveal group inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink transition-colors hover:text-accent"
            >
              View All Projects
              <Icon
                name="arrow_forward"
                size="sm"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid auto-rows-[300px] grid-cols-1 gap-[30px] md:grid-cols-3">
            {/* Main featured project — spans 2 cols */}
            {featuredProjects[0] && (
              <Link
                href={`/projects/${featuredProjects[0].slug}`}
                className="reveal group relative overflow-hidden rounded-lg border border-line bg-ink md:col-span-2"
              >
                <Image
                  src={featuredProjects[0].image}
                  alt={featuredProjects[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover opacity-60 transition-transform duration-700 ease-studio group-hover:scale-105 group-hover:opacity-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[.1em] text-accent">
                    01 · Flagship
                  </div>
                  <h3 className="mb-2 font-display text-2xl font-bold uppercase tracking-[-.01em] text-studio md:text-3xl">
                    {featuredProjects[0].title}
                  </h3>
                  <p className="mb-4 max-w-lg text-sm leading-[1.55] text-studio/70">
                    {featuredProjects[0].shortDescription}
                  </p>
                  <span className="inline-block border-b border-accent pb-1 font-mono text-[11px] uppercase tracking-label text-studio">
                    View Specs
                  </span>
                </div>
              </Link>
            )}

            {/* Secondary projects */}
            {featuredProjects.slice(1, 3).map((project, idx) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="reveal group relative overflow-hidden rounded-lg border border-line bg-ink"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-60 transition-transform duration-700 ease-studio group-hover:scale-105 group-hover:opacity-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-[.1em] text-accent">
                    {String(idx + 2).padStart(2, '0')}
                  </div>
                  <h3 className="mb-1 font-display text-xl font-bold uppercase tracking-[-.01em] text-studio">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-[1.55] text-studio/70">
                    {project.shortDescription}
                  </p>
                </div>
              </Link>
            ))}

            {/* Wide project card — spans 2 cols */}
            {featuredProjects[3] && (
              <Link
                href={`/projects/${featuredProjects[3].slug}`}
                className="reveal group relative overflow-hidden rounded-lg border border-line bg-ink md:col-span-2"
              >
                <Image
                  src={featuredProjects[3].image}
                  alt={featuredProjects[3].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover opacity-60 transition-transform duration-700 ease-studio group-hover:scale-105 group-hover:opacity-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 flex w-full flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[.1em] text-accent">
                      04
                    </div>
                    <h3 className="mb-1 font-display text-xl font-bold uppercase tracking-[-.01em] text-studio">
                      {featuredProjects[3].title}
                    </h3>
                    <p className="max-w-md text-sm leading-[1.55] text-studio/70">
                      {featuredProjects[3].shortDescription}
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-studio/10 text-studio transition-colors group-hover:bg-accent">
                    <Icon name="arrow_outward" size="md" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ░░░ SPONSORS ░░░ */}
      <section className="border-t border-line py-[120px]">
        <div className="wrap">
          <p className="reveal mb-10 text-center font-mono text-[11px] uppercase tracking-label text-ink-soft">
            Backed By Industry Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="reveal font-display text-lg font-semibold uppercase tracking-[-.01em] text-ink transition-colors duration-300 ease-studio hover:text-accent md:text-xl"
              >
                {sponsor.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ CTA ░░░ */}
      <section className="border-t border-line py-[140px]">
        <div className="wrap">
          <Card
            variant="glass"
            padding="lg"
            className="reveal mx-auto max-w-4xl text-center"
          >
            <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-lg border border-accent/30 bg-accent/[.08] text-accent">
              <Icon name="electrical_services" size="xl" />
            </span>
            <h2 className="mb-6 font-display text-[clamp(34px,6vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
              Ready to Join the{' '}
              <span className="text-outline">Circuit</span>
              <span className="text-accent">?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              Whether you&apos;re an Electrical Engineer, CS major, or just love
              to tinker, there&apos;s a place for you at DIGITAL. No prior
              experience required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Apply for Membership
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
