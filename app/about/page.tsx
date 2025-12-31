import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { teamMembers } from '@/lib/data/team';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'About Us - DIGITAL @ Cal Poly Pomona',
  description: 'Learn about our mission to bridge the gap between classroom theory and industry reality through hands-on hardware engineering.',
};

const missionCards = [
  {
    icon: 'manufacturing',
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
    icon: 'tips_and_updates',
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
    icon: 'view_in_ar',
    title: 'Mechanical Housing',
    description: '3D printed and CNC machined enclosures for snap-fit modularity.',
  },
  {
    icon: 'terminal',
    title: 'Embedded OS',
    description: 'Custom kernel drivers and UI tailored for our hardware.',
  },
];

const roadmapPhases = [
  {
    phase: 1,
    status: 'completed',
    title: 'Concept & Prototyping',
    description: 'Initial breadboarding, component selection, and feasibility studies.',
  },
  {
    phase: 2,
    status: 'current',
    title: 'PCB Fabrication',
    description: 'Designing and ordering the first revision of carrier boards and module interconnects.',
  },
  {
    phase: 3,
    status: 'future',
    title: 'System Integration',
    description: 'Full OS bring-up, housing assembly, and user testing.',
  },
];

export default function AboutPage() {
  const executiveTeam = teamMembers.filter((m) => m.department === 'executive').slice(0, 3);

  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 md:px-10 py-12 md:py-20">
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 flex-1 text-left">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="material-symbols-outlined text-primary text-sm">school</span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">
                  Cal Poly Pomona
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Building the Future, <span className="text-primary">Modularly.</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                Bridging the gap between classroom theory and industry reality through hands-on
                hardware engineering. Backed by the Project Hatchery Foundation.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
              >
                Join DIGITAL
              </Link>
              <Link
                href="/projects"
                className="flex items-center justify-center rounded-lg h-12 px-8 bg-transparent border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white text-base font-bold hover:bg-gray-100 dark:hover:bg-[#1b2127] transition-all"
              >
                View Projects
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full flex-1">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#1b2127] border border-gray-800 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
              <Image
                src="/images/placeholders/general/lab-session.svg"
                alt="Close up of a student soldering a circuit board in an engineering lab"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 z-20 bg-background-dark/90 backdrop-blur border border-gray-700 p-4 rounded-xl flex gap-4 items-center shadow-lg">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">smartphone</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Current Focus</p>
                  <p className="text-sm text-white font-bold">Modular Smartphone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliation / Social Proof */}
      <section className="w-full border-y border-gray-200 dark:border-[#283039] bg-gray-50 dark:bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-widest">
            Proudly Supported By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white">
              <span className="material-symbols-outlined text-3xl">school</span>
              Cal Poly Pomona
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              Project Hatchery
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white">
              <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
              CPP Engineering
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full max-w-7xl px-4 md:px-10 py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
            We exist to provide students with junior-level engineering challenges before graduation,
            fostering a culture of innovation and hands-on mastery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missionCards.map((card) => (
            <div
              key={card.title}
              className="group p-6 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1b2127] hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-slate-600 dark:text-[#9cabba] text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Project Section */}
      <section className="w-full bg-white dark:bg-[#161b22] py-20 border-y border-gray-200 dark:border-[#283039]">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-black aspect-video">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black" />
                <Image
                  src="/images/placeholders/projects/modular-phone.svg"
                  alt="Exploded view diagram of electronic components"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div>
                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                  Flagship Project
                </span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  The Modular Smartphone
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Our current moonshot is designing a fully functional, repairable, and modular
                smartphone from scratch. This isn&apos;t a kit; it&apos;s ground-up engineering.
              </p>
              <div className="space-y-4 mt-2">
                {projectFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">
                      {feature.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{feature.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="w-full max-w-5xl px-4 md:px-10 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Project Roadmap</h2>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-[#283039] -translate-x-1/2 md:translate-x-0" />

          {roadmapPhases.map((phase, index) => (
            <div
              key={phase.phase}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                index !== roadmapPhases.length - 1 ? 'mb-12' : ''
              }`}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="md:w-1/2 flex justify-start md:justify-end pl-12 md:pl-0 md:pr-12 text-left md:text-right">
                    <div
                      className={`p-5 rounded-xl border shadow-sm w-full md:max-w-xs ${
                        phase.status === 'future'
                          ? 'bg-gray-100 dark:bg-[#161b22] border-dashed border-gray-300 dark:border-gray-700 opacity-80'
                          : 'bg-white dark:bg-[#1b2127] border-gray-200 dark:border-[#3b4754]'
                      }`}
                    >
                      <span
                        className={`text-xs font-bold uppercase mb-1 block ${
                          phase.status === 'future' ? 'text-slate-500' : 'text-primary'
                        }`}
                      >
                        Phase {phase.phase} •{' '}
                        {phase.status === 'completed'
                          ? 'Completed'
                          : phase.status === 'current'
                          ? 'Current'
                          : 'Future'}
                      </span>
                      <h3
                        className={`text-lg font-bold ${
                          phase.status === 'future' ? 'text-slate-600 dark:text-slate-300' : ''
                        }`}
                      >
                        {phase.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2">{phase.description}</p>
                    </div>
                  </div>
                  <div
                    className={`absolute left-4 md:left-1/2 -translate-x-[5px] md:-translate-x-1/2 w-4 h-4 rounded-full ring-4 ring-white dark:ring-[#111418] ${
                      phase.status === 'future' ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary'
                    }`}
                  />
                  <div className="hidden md:block md:w-1/2" />
                </>
              ) : (
                <>
                  <div className="hidden md:block md:w-1/2" />
                  <div
                    className={`absolute left-4 md:left-1/2 -translate-x-[5px] md:-translate-x-1/2 w-4 h-4 rounded-full ring-4 ring-white dark:ring-[#111418] ${
                      phase.status === 'future' ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary'
                    }`}
                  />
                  <div className="md:w-1/2 flex justify-start pl-12 md:pl-12 text-left">
                    <div
                      className={`p-5 rounded-xl border shadow-sm w-full md:max-w-xs ${
                        phase.status === 'future'
                          ? 'bg-gray-100 dark:bg-[#161b22] border-dashed border-gray-300 dark:border-gray-700 opacity-80'
                          : 'bg-white dark:bg-[#1b2127] border-gray-200 dark:border-[#3b4754]'
                      }`}
                    >
                      <span
                        className={`text-xs font-bold uppercase mb-1 block ${
                          phase.status === 'future' ? 'text-slate-500' : 'text-primary'
                        }`}
                      >
                        Phase {phase.phase} •{' '}
                        {phase.status === 'completed'
                          ? 'Completed'
                          : phase.status === 'current'
                          ? 'Current'
                          : 'Future'}
                      </span>
                      <h3
                        className={`text-lg font-bold ${
                          phase.status === 'future' ? 'text-slate-600 dark:text-slate-300' : ''
                        }`}
                      >
                        {phase.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2">{phase.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-gray-50 dark:bg-[#161b22] py-20 border-t border-gray-200 dark:border-[#283039]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Meet the Board</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            The students driving the vision forward.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {executiveTeam.map((member) => (
              <div
                key={member.id}
                className="group relative w-64 h-80 rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-primary font-bold text-xs uppercase mb-1">{member.title}</p>
                  <h3 className="text-white text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.department === 'executive' ? "Computer Engineering '25" : member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 mt-8 text-primary font-bold hover:underline"
          >
            View All Team Members
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl px-4 md:px-10 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Build?</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          Join a community of passionate builders. No prior experience required, just a willingness
          to learn and break things.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href={siteConfig.community.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 h-12 rounded-lg bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">chat</span>
            Join Discord
          </a>
          <a
            href={siteConfig.community.notion}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 h-12 rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1b2127] text-slate-900 dark:text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">article</span>
            View Notion
          </a>
        </div>

        {/* Additional Community Links */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={siteConfig.community.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">code</span>
            <span className="text-sm font-medium">GitHub</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">public</span>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="text-sm font-medium">Instagram</span>
          </a>
        </div>
      </section>
    </main>
  );
}
