import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
import { getProjectBySlug } from '@/lib/data/projects';
import { teamMembers } from '@/lib/data/team';
import { Teardown } from '@/components/teardown/Teardown';

export const metadata: Metadata = {
  title: 'The Modular Smartphone — DIGITAL @ Cal Poly Pomona',
  description:
    'Redefining repairability and customization in consumer electronics. A fully open-source, modular smartphone built from the ground up by DIGITAL engineers.',
};

// Sub-team funnel data — four disciplines the device disassembles into
const subTeams = [
  {
    key: 'executive',
    index: '01',
    label: 'Executive',
    description:
      'Strategy, sponsorships, and org-wide direction. Keep the whole machine running.',
    icon: 'account_balance' as const,
    href: '/team',
  },
  {
    key: 'hardware',
    index: '02',
    label: 'Hardware',
    description:
      'PCB design, schematics, and physical prototyping — the atoms that become the device.',
    icon: 'memory' as const,
    href: '/team',
  },
  {
    key: 'software',
    index: '03',
    label: 'Software',
    description:
      'Firmware, embedded C++, and the custom kernel stack that breathes life into the board.',
    icon: 'code' as const,
    href: '/team',
  },
  {
    key: 'outreach',
    index: '04',
    label: 'Outreach',
    description:
      'Brand, events, and community — the layer that connects the lab to the world.',
    icon: 'campaign' as const,
    href: '/team',
  },
] as const;

export default function ModularSmartphonePage() {
  const project = getProjectBySlug('modular-smartphone');

  // Should never be null — this is a static dedicated page
  if (!project) return null;

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
      {/* ░░░ HERO ░░░ */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-7 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            {/* Copy side */}
            <div className="z-10 flex flex-1 flex-col gap-6">
              <Eyebrow>{project.category} · Flagship Project</Eyebrow>

              <OutlineHeading as="h1" size="hero" outline="Modular" dot>
                The{' '}
              </OutlineHeading>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="active" pulse>
                  Active
                </Badge>
                <Badge variant="flagship" pulse>
                  Flagship
                </Badge>
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

      {/* ░░░ STATS ░░░ */}
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

      {/* ░░░ SIGNATURE TEARDOWN ░░░ */}
      {/*
        The scroll-driven teardown lives here — the Modular Smartphone is the
        centrepiece. Scrolling disassembles the device layer by layer; each
        layer maps to a discipline of the project (chassis → PCB → battery →
        display → modules). This is the core interactive narrative for the page.
      */}
      <Teardown
        eyebrow="Scroll to disassemble"
        heading={
          <>
            twelve layers,
            <br />
            one device.
          </>
        }
        caption="Scroll and the Modular Smartphone comes apart — chassis, board, battery, display — every sub-assembly peeled back in sequence. Reverse the scroll to reassemble. This is what DIGITAL builds."
      />

      {/* ░░░ TIMELINE ░░░ */}
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

      {/* ░░░ SYSTEM MODULES ░░░ */}
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

      {/* ░░░ SPECIFICATIONS ░░░ */}
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

      {/* ░░░ TECH STACK ░░░ */}
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

      {/* ░░░ TEAM ░░░ */}
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

      {/* ░░░ SUB-TEAM FUNNEL ░░░ */}
      {/*
        The device came apart into its disciplines — now find your sub-team.
        Four cards, one per department, each linking to the /team page.
      */}
      <section className="border-t border-line py-[120px]">
        <div className="mx-auto max-w-content px-7">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="reveal">Find Your Sub-Team</Eyebrow>
            <h2 className="reveal mt-5 font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
              The device came{' '}
              <span className="text-outline">apart</span>
              <span className="text-accent">.</span>
            </h2>
            <p className="reveal mx-auto mt-6 max-w-[52ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              Every layer you just scrolled through belongs to a discipline.
              Pick the one that pulls you in — no experience required.
            </p>
          </div>

          <div className="mt-14 grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {subTeams.map((team) => (
              <Link key={team.key} href={team.href} className="group block">
                <Card
                  variant="glass"
                  className="reveal flex h-full flex-col transition-transform duration-200 ease-studio group-hover:-translate-y-0.5"
                >
                  <span className="font-mono text-[12px] uppercase tracking-[.1em] text-accent">
                    {team.index}
                  </span>
                  <div className="mt-4 flex size-12 items-center justify-center rounded border border-line text-ink">
                    <Icon name={team.icon} size="lg" />
                  </div>
                  <h3 className="mt-4 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                    {team.label}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-[1.55] text-ink-soft">
                    {team.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[.16em] text-ink transition-colors duration-200 group-hover:text-accent">
                    Meet the team
                    <Icon
                      name="arrow_forward"
                      size="sm"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ CTA ░░░ */}
      <section className="border-t border-line py-[140px]">
        <div className="mx-auto flex max-w-content flex-col items-center px-7 text-center">
          <Icon name="rocket_launch" size="xl" className="text-accent" />
          <Eyebrow className="mt-6">Get Involved</Eyebrow>
          <OutlineHeading className="mt-4" outline="Future" dot>
            Ready to Build the{' '}
          </OutlineHeading>
          <p className="mx-auto mt-6 max-w-[50ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Join DIGITAL and contribute to the Modular Smartphone. No prior
            experience required — just the drive to build something real.
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
