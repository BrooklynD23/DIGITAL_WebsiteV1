import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProjectBySlug } from '@/lib/data/projects';
import { teamMembers } from '@/lib/data/team';
import type { Metadata } from 'next';
import {
  Badge,
  Button,
  Card,
  Eyebrow,
  Icon,
  OutlineHeading,
  Timeline,
  type TimelineStep,
} from '@/components/ui';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found - DIGITAL @ Cal Poly Pomona' };
  }

  return {
    title: `${project.title} - DIGITAL @ Cal Poly Pomona`,
    description: project.shortDescription,
  };
}

const statusVariant = {
  active: 'active',
  completed: 'completed',
  paused: 'paused',
} as const;

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectTeam = project.teamMembers
    ? teamMembers.filter((m) => project.teamMembers?.includes(m.id))
    : teamMembers.slice(0, 4);

  const timelineSteps: TimelineStep[] = (project.timeline ?? []).map((phase) => ({
    id: `phase-${phase.phase}`,
    title: phase.title,
    description: phase.description,
    status: phase.status,
  }));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-7 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="z-10 flex flex-1 flex-col gap-6">
              <Eyebrow>{project.category}</Eyebrow>

              <OutlineHeading as="h1" size="hero" outline={project.title.replace('The ', '')} dot>
                {project.title.startsWith('The ') ? 'The ' : ''}
              </OutlineHeading>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={statusVariant[project.status]} pulse>
                  {project.status}
                </Badge>
                {project.isFlagship && (
                  <Badge variant="flagship" pulse>
                    Flagship
                  </Badge>
                )}
              </div>

              <p className="max-w-[34ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
                {project.fullDescription}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact">
                  <Button
                    icon={<Icon name="arrow_forward" size="sm" />}
                    iconPosition="right"
                  >
                    Join This Project
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="ghost">All Projects</Button>
                </Link>
              </div>
            </div>

            {/* Device render tile */}
            <div className="w-full flex-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-ink shadow-card">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <span className="absolute bottom-5 left-5 font-mono text-[12px] uppercase tracking-[.1em] text-studio">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {project.stats && project.stats.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-7 py-12 md:grid-cols-3">
            {project.stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <span className="font-display text-[clamp(34px,5vw,52px)] font-extrabold leading-none tracking-[-.03em] text-ink [font-variant-numeric:tabular-nums]">
                  {stat.value}
                </span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      {timelineSteps.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-7 py-[120px]">
            <div className="text-center">
              <Eyebrow>Roadmap</Eyebrow>
              <OutlineHeading className="mt-4" outline="Timeline" dot>
                Project{' '}
              </OutlineHeading>
            </div>
            <Timeline steps={timelineSteps} className="mt-12" />
          </div>
        </section>
      )}

      {/* System modules */}
      {project.modules && project.modules.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-7 py-[120px]">
            <Eyebrow>Architecture</Eyebrow>
            <OutlineHeading className="mt-4" outline="Modules" dot>
              System{' '}
            </OutlineHeading>

            <div className="mt-12 grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              {project.modules.map((module, index) => (
                <Card key={index} variant="glass">
                  <span className="font-mono text-[12px] uppercase tracking-[.1em] text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="mt-4 flex size-12 items-center justify-center rounded border border-line text-ink">
                    <Icon name={module.icon} size="lg" />
                  </div>
                  <h3 className="mt-4 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-ink-soft">
                    {module.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink transition-colors duration-200 hover:text-accent"
              >
                View More Details
                <Icon name="arrow_forward" size="sm" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {project.specifications && project.specifications.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-7 py-[120px]">
            <Eyebrow>The Bench</Eyebrow>
            <OutlineHeading className="mt-4" outline="Specs" dot>
              Hardware{' '}
            </OutlineHeading>

            <dl className="mt-12 border-t border-line">
              {project.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 border-b border-line py-4 md:flex-row md:items-baseline md:gap-8"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft md:w-1/3">
                    {spec.label}
                  </dt>
                  <dd className="font-mono text-[15px] text-ink [font-variant-numeric:tabular-nums] md:flex-1">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Tech stack */}
      {project.techStack.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-7 py-[120px]">
            <Eyebrow>Toolchain</Eyebrow>
            <OutlineHeading className="mt-4" outline="Stack" dot>
              Tech{' '}
            </OutlineHeading>
            <div className="mt-10 flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-ink-soft"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-content px-7 py-[120px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>The Crew</Eyebrow>
              <OutlineHeading className="mt-4" outline="Students" dot>
                Built By{' '}
              </OutlineHeading>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink transition-colors duration-200 hover:text-accent"
            >
              View All Members
              <Icon name="arrow_forward" size="sm" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-[30px] md:grid-cols-4">
            {projectTeam.map((member) => (
              <Card key={member.id} variant="glass" className="flex flex-col items-center text-center">
                <div className="mb-4 size-20 overflow-hidden rounded-full border border-line">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="size-full object-cover"
                  />
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-[-.01em] text-ink">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[.1em] text-ink-soft">
                  {member.title}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto flex max-w-content flex-col items-center px-7 py-[140px] text-center">
          <Icon name="rocket_launch" size="xl" className="text-accent" />
          <Eyebrow className="mt-6">Get Involved</Eyebrow>
          <OutlineHeading className="mt-4" outline="Future" dot>
            Ready to Build the{' '}
          </OutlineHeading>
          <p className="mx-auto mt-6 max-w-[50ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Join DIGITAL and be part of groundbreaking projects. No experience required - just
            passion and willingness to learn.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg">Apply Now</Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="ghost">
                Explore More Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
