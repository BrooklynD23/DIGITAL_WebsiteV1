import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/components/ui';

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
    icon: 'auto_awesome',
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
    icon: 'science',
    description: 'Rigorous validation ensures our designs meet performance, reliability, and safety standards. Testing drives continuous improvement.',
    details: ['Performance benchmarks', 'Stress testing', 'Quality assurance'],
  },
  {
    letter: 'A',
    title: 'Analyzing',
    icon: 'analytics',
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

export default function PillarsPage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge variant="flagship" className="mb-4">Our Framework</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            The <span className="text-gradient">DIGITAL</span> Pillars
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Seven interconnected principles that guide our mission to build a smartphone from scratch -
            comfortable to hold, intuitive to use, and powerful enough for all-day performance.
          </p>
        </div>
      </section>

      {/* Acronym Display */}
      <section className="w-full py-12 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {digitalPillars.map((pillar, index) => (
              <div
                key={index}
                className="group flex flex-col items-center"
              >
                <div className="size-14 md:size-16 rounded-xl bg-white dark:bg-surface-dark border border-surface-border-light dark:border-surface-border flex items-center justify-center font-bold text-2xl md:text-3xl text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow group-hover:scale-110">
                  {pillar.letter}
                </div>
                <span className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {pillar.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {digitalPillars.map((pillar, index) => (
              <Card
                key={index}
                variant="interactive"
                padding="lg"
                className="group h-full flex flex-col"
              >
                {/* Header with letter and icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary-subtle flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined text-2xl">
                        {pillar.icon}
                      </span>
                    </div>
                    <div className="size-10 rounded-lg border-2 border-primary/30 flex items-center justify-center font-bold text-lg text-primary">
                      {pillar.letter}
                    </div>
                  </div>
                </div>

                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>

                {/* Details list */}
                <div className="mt-4 pt-4 border-t border-surface-border-light dark:border-surface-border">
                  <ul className="space-y-2">
                    {pillar.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="size-1.5 rounded-full bg-primary/60" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10 bg-white dark:bg-[#161b22] border-y border-gray-200 dark:border-[#283039]">
        <div className="max-w-5xl mx-auto">
          <Card variant="featured" padding="lg" className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative text-center">
              <div className="flex justify-center mb-6">
                <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">lightbulb</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>

              <blockquote className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                &ldquo;Build a smartphone from scratch that is{' '}
                <span className="text-primary font-semibold">comfortable to hold</span>,{' '}
                <span className="text-primary font-semibold">intuitive to use</span>,{' '}
                <span className="text-primary font-semibold">powerful enough</span> to maintain strong performance,{' '}
                <span className="text-primary font-semibold">efficient enough</span> to endure a whole day of extensive use,{' '}
                <span className="text-primary font-semibold">speedy enough</span> to feel snappy and responsive, and{' '}
                <span className="text-primary font-semibold">versatile enough</span> to serve as a foundation for future innovations.&rdquo;
              </blockquote>
            </div>
          </Card>
        </div>
      </section>

      {/* How Pillars Connect Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            A Connected Framework
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Our seven pillars work together in a continuous cycle of innovation. Each pillar
            informs and strengthens the others, creating a robust engineering methodology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-[#1b2127] border border-gray-200 dark:border-[#3b4754]">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">design_services</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Design Phase</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Device, Generating, and Analyzing guide our initial concepts and requirements.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-[#1b2127] border border-gray-200 dark:border-[#3b4754]">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">build</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Build Phase</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Implementation and Integrating bring designs to life through hands-on engineering.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-[#1b2127] border border-gray-200 dark:border-[#3b4754]">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Growth Phase</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Testing and Learning drive continuous improvement and knowledge transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Be Part of Something DIGITAL?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Join our team of passionate engineers and contribute to groundbreaking projects.
            Whether you are experienced or just starting out, there is a place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-involved">
              <Button size="lg">
                Get Involved
                <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
