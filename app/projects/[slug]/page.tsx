import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProjectBySlug } from '@/lib/data/projects';
import { teamMembers } from '@/lib/data/team';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectTeam = project.teamMembers
    ? teamMembers.filter((m) => project.teamMembers?.includes(m.id))
    : teamMembers.slice(0, 4);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 z-10">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase',
                  project.status === 'active' && 'bg-green-500/20 text-green-400',
                  project.status === 'completed' && 'bg-blue-500/20 text-blue-400',
                  project.status === 'paused' && 'bg-yellow-500/20 text-yellow-400'
                )}
              >
                {project.status}
              </span>
              {project.isFlagship && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-primary/20 text-primary">
                  Flagship
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Project:{' '}
              <span className="text-primary">{project.title.replace('The ', '')}</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-body leading-relaxed">
              {project.fullDescription}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 group"
              >
                <span>Join This Project</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-[20px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary text-slate-900 dark:text-white text-base font-bold transition-all"
              >
                All Projects
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-surface-dark">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {project.stats && project.stats.length > 0 && (
        <section className="w-full border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center md:items-start px-4 text-center md:text-left"
                >
                  <span className="text-4xl font-bold text-primary tracking-tighter">
                    {stat.value}
                  </span>
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="w-full py-16 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Project Timeline
            </h2>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {project.timeline.map((phase, index) => (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Connector Line */}
                  {index < project.timeline!.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}

                  {/* Phase Circle */}
                  <div
                    className={cn(
                      'relative z-10 size-10 rounded-full flex items-center justify-center text-sm font-bold',
                      phase.status === 'completed' && 'bg-primary text-white',
                      phase.status === 'current' &&
                        'bg-primary/20 text-primary border-2 border-primary',
                      phase.status === 'upcoming' && 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    )}
                  >
                    {phase.status === 'completed' ? (
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    ) : (
                      phase.phase
                    )}
                  </div>

                  {/* Phase Info */}
                  <div className="mt-4 text-center">
                    <h4
                      className={cn(
                        'font-bold text-sm',
                        phase.status === 'upcoming'
                          ? 'text-gray-500'
                          : 'text-slate-900 dark:text-white'
                      )}
                    >
                      {phase.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* System Modules Section */}
      {project.modules && project.modules.length > 0 && (
        <section className="w-full py-16 px-4 md:px-10 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              System Modules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.modules.map((module, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark hover:border-primary transition-all"
                >
                  <div
                    className={cn(
                      'size-12 rounded-lg flex items-center justify-center mb-4',
                      module.color === 'primary' && 'bg-primary/10 text-primary',
                      module.color === 'orange' && 'bg-orange-500/10 text-orange-500',
                      module.color === 'purple' && 'bg-purple-500/10 text-purple-500',
                      module.color === 'teal' && 'bg-teal-500/10 text-teal-500'
                    )}
                  >
                    <span className="material-symbols-outlined">{module.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/contact"
                className="text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                View More Details
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Specifications Section */}
      {project.specifications && project.specifications.length > 0 && (
        <section className="w-full py-16 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Hardware Specifications
            </h2>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {project.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 w-1/3">
                        {spec.label}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-white">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="w-full py-16 px-4 md:px-10 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Built By Students
            </h2>
            <Link
              href="/team"
              className="text-primary font-bold hover:underline inline-flex items-center gap-1"
            >
              View All Members
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {projectTeam.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col items-center bg-gray-50 dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-transparent hover:border-primary transition-all"
              >
                <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-primary transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-bold text-center text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-primary text-xs font-medium">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-4xl mx-auto bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-lg">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-body mb-8 max-w-xl mx-auto">
            Join DIGITAL and be part of groundbreaking projects. No experience required - just
            passion and willingness to learn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold transition-all shadow-xl shadow-primary/20"
            >
              Apply Now
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg h-14 px-8 bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary text-slate-900 dark:text-white text-lg font-bold transition-all"
            >
              Explore More Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
