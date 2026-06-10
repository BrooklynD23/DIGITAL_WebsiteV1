import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, Eyebrow, Icon, OutlineHeading, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'DIGITAL Pillars - DIGITAL @ Cal Poly Pomona',
  description: 'Discover the seven pillars of DIGITAL: Device, Implementation, Generating, Integrating, Testing, Analyzing, and Learning. Our framework for building innovative hardware.',
};

const digitalPillars = [
  {
    letter: 'D',
    title: 'Device',
    icon: 'smartphone',
    description: 'The foundation of our mission - designing and building a smartphone from scratch. Comfortable to hold, intuitive to use, and powerful enough to maintain strong performance.',
    details: ['Hardware architecture', 'Ergonomic design', 'Component selection'],
  },
  {
    letter: 'I',
    title: 'Implementation',
    icon: 'code',
    description: 'Turning designs into reality through hands-on engineering. We use industry-standard tools and workflows to bring concepts to life.',
    details: ['PCB fabrication', 'Firmware development', 'Mechanical assembly'],
  },
  {
    letter: 'G',
    title: 'Generating',
    icon: 'lightbulb',
    description: 'Creating innovative solutions and novel approaches. We generate ideas, prototypes, and documentation that push the boundaries of what student teams can achieve.',
    details: ['Concept ideation', 'Rapid prototyping', 'Design iteration'],
  },
  {
    letter: 'I',
    title: 'Integrating',
    icon: 'hub',
    description: 'Bringing together hardware, software, and mechanical systems into a cohesive product. Our modular approach enables seamless integration across subsystems.',
    details: ['System architecture', 'Module interconnects', 'Cross-team collaboration'],
  },
  {
    letter: 'T',
    title: 'Testing',
    icon: 'check_circle',
    description: 'Rigorous validation ensures our designs meet performance, reliability, and safety standards. Testing drives continuous improvement.',
    details: ['Performance benchmarks', 'Stress testing', 'Quality assurance'],
  },
  {
    letter: 'A',
    title: 'Analyzing',
    icon: 'search',
    description: 'Data-driven decision making guides our engineering process. We analyze results, identify patterns, and optimize based on evidence.',
    details: ['Performance metrics', 'Failure analysis', 'Optimization studies'],
  },
  {
    letter: 'L',
    title: 'Learning',
    icon: 'school',
    description: 'At our core, we are a learning organization. Knowledge transfer between members ensures skills persist across generations of students.',
    details: ['Peer mentorship', 'Technical workshops', 'Documentation culture'],
  },
];

const missionHighlights = [
  'comfortable to hold',
  'intuitive to use',
  'powerful enough',
  'efficient enough',
  'speedy enough',
  'versatile enough',
];

const frameworkPhases = [
  {
    icon: 'design_services',
    label: 'Phase 01',
    title: 'Design Phase',
    description: 'Device, Generating, and Analyzing guide our initial concepts and requirements.',
  },
  {
    icon: 'build',
    label: 'Phase 02',
    title: 'Build Phase',
    description: 'Implementation and Integrating bring designs to life through hands-on engineering.',
  },
  {
    icon: 'rocket_launch',
    label: 'Phase 03',
    title: 'Growth Phase',
    description: 'Testing and Learning drive continuous improvement and knowledge transfer.',
  },
];

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

export default function PillarsPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />

      {/* Hero */}
      <Section className="pt-[140px] pb-[80px]">
        <div className="reveal max-w-3xl">
          <Eyebrow>Our Framework</Eyebrow>
          <OutlineHeading
            as="h1"
            size="hero"
            outline="DIGITAL"
            after=" Pillars"
            dot
            className="mt-6"
          >
            The{' '}
          </OutlineHeading>
          <p className="mt-8 max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Seven interconnected principles that guide our mission to build a smartphone from
            scratch - comfortable to hold, intuitive to use, and powerful enough for all-day
            performance.
          </p>
        </div>
      </Section>

      {/* Acronym Display — industrial square tiles */}
      <Section band>
        <div className="reveal">
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
            D · I · G · I · T · A · L
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            {digitalPillars.map((pillar, index) => (
              <div key={index} className="group flex flex-col items-center gap-2">
                <div className="flex size-16 items-center justify-center rounded border border-line bg-white/[.42] font-display text-3xl font-extrabold text-ink backdrop-blur-[6px] transition-colors duration-300 ease-studio group-hover:border-accent group-hover:bg-accent group-hover:text-studio md:size-[72px]">
                  {pillar.letter}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft opacity-0 transition-opacity duration-300 ease-studio group-hover:opacity-100">
                  {pillar.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pillars Grid — glass cards */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>The Seven Pillars</Eyebrow>
          <OutlineHeading outline="Layer" after=" by Layer" dot className="mt-6">
            Built{' '}
          </OutlineHeading>
        </div>
        <div className="grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {digitalPillars.map((pillar, index) => (
            <Card
              key={index}
              variant="interactive"
              padding="md"
              className="reveal flex h-full flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[.1em] text-accent">
                  {String(index + 1).padStart(2, '0')} · {pillar.letter}
                </span>
                <Icon name={pillar.icon} size="lg" className="text-ink" />
              </div>

              <h3 className="mt-4 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
                {pillar.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {pillar.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-ink-soft"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                    {detail}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Mission Statement — featured glass card */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>Our Mission</Eyebrow>
          <OutlineHeading outline="Scratch" dot className="mt-6">
            From{' '}
          </OutlineHeading>
        </div>
        <Card variant="featured" padding="lg" className="reveal">
          <Icon name="lightbulb" size="xl" className="text-accent" label="Mission" />
          <blockquote className="mt-8 max-w-[60ch] font-display text-[clamp(20px,2.6vw,32px)] font-semibold uppercase leading-[1.15] tracking-[-.02em] text-ink">
            &ldquo;Build a smartphone from scratch that is{' '}
            <span className="text-accent">comfortable to hold</span>,{' '}
            <span className="text-accent">intuitive to use</span>,{' '}
            <span className="text-accent">powerful enough</span> to maintain strong performance,{' '}
            <span className="text-accent">efficient enough</span> to endure a whole day of
            extensive use, <span className="text-accent">speedy enough</span> to feel snappy and
            responsive, and <span className="text-accent">versatile enough</span> to serve as a
            foundation for future innovations.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-6">
            {missionHighlights.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-label text-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </Section>

      {/* Connected Framework — Design / Build / Growth */}
      <Section band>
        <div className="reveal mb-12 max-w-2xl">
          <Eyebrow>How It Connects</Eyebrow>
          <OutlineHeading outline="Framework" dot className="mt-6">
            A Connected{' '}
          </OutlineHeading>
          <p className="mt-8 max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Our seven pillars work together in a continuous cycle of innovation. Each pillar
            informs and strengthens the others, creating a robust engineering methodology.
          </p>
        </div>
        <div className="grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {frameworkPhases.map((phase) => (
            <Card key={phase.title} variant="glass" padding="md" className="reveal">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[.1em] text-accent">
                  {phase.label}
                </span>
                <Icon name={phase.icon} size="lg" className="text-ink" />
              </div>
              <h3 className="mt-4 font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                {phase.title}
              </h3>
              <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
                {phase.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section band>
        <div className="reveal max-w-2xl">
          <Eyebrow>Join Us</Eyebrow>
          <OutlineHeading outline="DIGITAL" dot className="mt-6">
            Ready to Be Part of Something{' '}
          </OutlineHeading>
          <p className="mt-8 max-w-[60ch] font-body text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Join our team of passionate engineers and contribute to groundbreaking projects.
            Whether you are experienced or just starting out, there is a place for you.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/get-involved">
              <Button
                size="lg"
                icon={<Icon name="arrow_forward" size="md" />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Get Involved
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
