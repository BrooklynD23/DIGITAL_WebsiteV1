import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Badge, Button, Card, Eyebrow, Icon, OutlineHeading, Section } from '@/components/ui';
import { teamMembers } from '@/lib/data/team';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'About Us - DIGITAL @ Cal Poly Pomona',
  description: 'Learn about our mission to bridge the gap between classroom theory and industry reality through hands-on hardware engineering.',
};

const missionCards = [
  {
    icon: 'precision_manufacturing',
    title: 'Industry Standard',
    description:
      "We don't just build toys. We design with industry-standard tools like Altium, SolidWorks, and embedded C++ to prepare you for the workforce.",
  },
  {
    icon: 'groups',
    title: 'Peer Mentorship',
    description:
      'Learn from upperclassmen and industry veterans. Our structure encourages knowledge transfer from seniors to freshmen.',
  },
  {
    icon: 'lightbulb',
    title: 'Radical Innovation',
    description:
      'We tackle ambitious projects, like our fully-modular smartphone, pushing the boundaries of what student clubs can achieve.',
  },
];

const projectFeatures = [
  {
    icon: 'memory',
    title: 'Custom PCB Design',
    description: 'Designing 4-layer boards for power management and connectivity.',
  },
  {
    icon: 'precision_manufacturing',
    title: 'Mechanical Housing',
    description: '3D printed and CNC machined enclosures for snap-fit modularity.',
  },
  {
    icon: 'code',
    title: 'Embedded OS',
    description: 'Custom kernel drivers and UI tailored for our hardware.',
  },
];

const roadmapPhases = [
  {
    phase: 1,
    status: 'completed' as const,
    title: 'Concept & Prototyping',
    description: 'Initial breadboarding, component selection, and feasibility studies.',
  },
  {
    phase: 2,
    status: 'current' as const,
    title: 'PCB Fabrication',
    description: 'Designing and ordering the first revision of carrier boards and module interconnects.',
  },
  {
    phase: 3,
    status: 'future' as const,
    title: 'System Integration',
    description: 'Full OS bring-up, housing assembly, and user testing.',
  },
];

const statusLabel: Record<'completed' | 'current' | 'future', string> = {
  completed: 'Completed',
  current: 'Current',
  future: 'Future',
};

// Self-contained scroll-in observer: toggles `.in` on `.reveal` elements once
// in view. Kept inline so the page stays a server component (metadata export).
// Reduced-motion is handled globally in globals.css.
const revealScript = `
(function () {
  if (typeof window === 'undefined') return;
  var run = function () {
    var els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    els.forEach(function (el) { io.observe(el); });
  };
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
`;

export default function AboutPage() {
  const executiveTeam = teamMembers.filter((m) => m.department === 'executive').slice(0, 3);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />

      {/* Hero */}
      <Section className="pt-[140px] pb-[80px]">
        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-center">
          <div className="reveal flex-1">
            <div className="inline-flex items-center gap-2">
              <Icon name="school" size="sm" className="text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                Cal Poly Pomona
              </span>
            </div>
            <OutlineHeading as="h1" size="hero" outline="Modularly" dot className="mt-6">
              Building the Future,{' '}
            </OutlineHeading>
            <p className="mt-8 max-w-[55ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              Bridging the gap between classroom theory and industry reality through hands-on
              hardware engineering. Backed by the Project Hatchery Foundation.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg">Join DIGITAL</Button>
              </Link>
              <Link href="/projects">
                <Button variant="ghost" size="lg">
                  View Projects
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="reveal w-full flex-1">
            <Card variant="default" padding="none" className="group relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/placeholders/general/lab-session.svg"
                alt="Close up of a student soldering a circuit board in an engineering lab"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-studio group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/40 to-transparent" />
              {/* Floating instrument readout */}
              <div className="absolute bottom-6 left-6 flex items-center gap-4 rounded border border-white/60 bg-white/[.42] p-4 backdrop-blur-[6px] shadow-card">
                <Icon name="smartphone" size="lg" className="text-accent" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                    Current Focus
                  </p>
                  <p className="font-display text-sm font-bold uppercase tracking-[-.01em] text-ink">
                    Modular Smartphone
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Affiliation / Social Proof */}
      <Section band>
        <div className="reveal">
          <p className="text-center font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
            Proudly Supported By
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[-.01em] text-ink">
              <Icon name="school" size="lg" className="text-ink" />
              Cal Poly Pomona
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            <div className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[-.01em] text-ink">
              <Icon name="rocket_launch" size="lg" className="text-ink" />
              Project Hatchery
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            <div className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[-.01em] text-ink">
              <Icon name="precision_manufacturing" size="lg" className="text-ink" />
              CPP Engineering
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Values */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>Our Mission</Eyebrow>
          <OutlineHeading outline="Mission" dot className="mt-6">
            Our{' '}
          </OutlineHeading>
          <p className="mt-8 max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            We exist to provide students with junior-level engineering challenges before
            graduation, fostering a culture of innovation and hands-on mastery.
          </p>
        </div>
        <div className="grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {missionCards.map((card, index) => (
            <Card key={card.title} variant="interactive" padding="md" className="reveal flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[.1em] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon name={card.icon} size="lg" className="text-ink" />
              </div>
              <h3 className="mt-4 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                {card.title}
              </h3>
              <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
                {card.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Flagship Project */}
      <Section band>
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="reveal w-full md:w-1/2">
            <Card variant="default" padding="none" className="relative aspect-video w-full overflow-hidden">
              <Image
                src="/images/placeholders/projects/modular-phone.svg"
                alt="Exploded view diagram of electronic components"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
            </Card>
          </div>
          <div className="reveal flex w-full flex-col gap-6 md:w-1/2">
            <div>
              <Eyebrow>Flagship Project</Eyebrow>
              <OutlineHeading outline="Smartphone" className="mt-6">
                The Modular{' '}
              </OutlineHeading>
            </div>
            <p className="max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              Our current moonshot is designing a fully functional, repairable, and modular
              smartphone from scratch. This isn&apos;t a kit; it&apos;s ground-up engineering.
            </p>
            <ul className="mt-2 space-y-5 border-t border-line pt-6">
              {projectFeatures.map((feature) => (
                <li key={feature.title} className="flex items-start gap-4">
                  <Icon name={feature.icon} size="md" className="mt-1 text-accent" />
                  <div>
                    <h4 className="font-display text-base font-bold uppercase tracking-[-.01em] text-ink">
                      {feature.title}
                    </h4>
                    <p className="mt-1 font-body text-[15px] leading-[1.55] text-ink-soft">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Roadmap */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>The Plan</Eyebrow>
          <OutlineHeading outline="Roadmap" dot className="mt-6">
            Project{' '}
          </OutlineHeading>
        </div>
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true" />
          <ol className="space-y-[30px]">
            {roadmapPhases.map((phase) => (
              <li key={phase.phase} className="reveal relative pl-12">
                {/* Node */}
                <span
                  className={`absolute left-0 top-1.5 flex size-4 items-center justify-center rounded-full border-[1.5px] ${
                    phase.status === 'future'
                      ? 'border-line bg-studio'
                      : phase.status === 'current'
                      ? 'border-accent bg-studio'
                      : 'border-accent bg-accent'
                  }`}
                  aria-hidden="true"
                >
                  {phase.status === 'current' && <span className="size-2 rounded-full bg-accent" />}
                </span>
                <Card
                  variant={phase.status === 'future' ? 'glass' : 'default'}
                  padding="md"
                  className={`max-w-xl ${phase.status === 'future' ? 'opacity-80' : ''}`}
                >
                  <span
                    className={`font-mono text-[11px] uppercase tracking-label ${
                      phase.status === 'future' ? 'text-ink-soft' : 'text-accent'
                    }`}
                  >
                    Phase {phase.phase} &middot; {statusLabel[phase.status]}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-[-.01em] text-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
                    {phase.description}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Team / Board */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>The People</Eyebrow>
          <OutlineHeading outline="Board" dot className="mt-6">
            Meet the{' '}
          </OutlineHeading>
          <p className="mt-8 font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            The students driving the vision forward.
          </p>
        </div>
        <div className="flex flex-wrap gap-[30px]">
          {executiveTeam.map((member) => (
            <Link
              key={member.id}
              href="/team"
              className="reveal group relative h-80 w-64 overflow-hidden rounded-lg border border-white/60 bg-white/[.42] shadow-card focus-glow"
            >
              <Image
                src={member.image}
                alt={`Portrait of ${member.name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 256px"
                className="object-cover transition-transform duration-500 ease-studio group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <p className="font-mono text-[10px] uppercase tracking-label text-accent">
                  {member.title}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-[-.01em] text-studio">
                  {member.name}
                </h3>
                <p className="mt-2 font-body text-sm text-studio/80 opacity-0 transition-opacity duration-300 ease-studio group-hover:opacity-100">
                  {member.department === 'executive' ? "Computer Engineering '25" : member.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/team"
          className="mt-10 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:text-accent focus-glow"
        >
          View All Team Members
          <Icon name="arrow_forward" size="sm" />
        </Link>
      </Section>

      {/* CTA */}
      <Section band>
        <div className="reveal max-w-2xl">
          <Eyebrow>Get Involved</Eyebrow>
          <OutlineHeading outline="Build" dot className="mt-6">
            Ready to{' '}
          </OutlineHeading>
          <p className="mt-8 max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Join a community of passionate builders. No prior experience required, just a
            willingness to learn and break things.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href={siteConfig.community.discord} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" icon={<Icon name="chat" size="md" />} className="w-full sm:w-auto">
                Join Discord
              </Button>
            </a>
            <a href={siteConfig.community.notion} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" icon={<Icon name="article" size="md" />} className="w-full sm:w-auto">
                View Notion
              </Button>
            </a>
          </div>

          {/* Additional Community Links */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-line pt-8">
            <a
              href={siteConfig.community.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:text-ink focus-glow"
            >
              <Icon name="code" size="sm" />
              GitHub
            </a>
            <span className="text-line" aria-hidden="true">
              |
            </span>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:text-ink focus-glow"
            >
              <Icon name="public" size="sm" />
              LinkedIn
            </a>
            <span className="text-line" aria-hidden="true">
              |
            </span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:text-ink focus-glow"
            >
              <Icon name="photo_camera" size="sm" />
              Instagram
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
