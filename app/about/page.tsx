import type { Metadata } from 'next';
import Link from 'next/link';
import { teamMembers, executiveRoles } from '@/lib/data/team';
import { siteConfig } from '@/lib/data/siteConfig';
import {
  acronymPillars,
  frameworkPhases,
  deviceRequirement,
  benchFeatures,
  roadmapPhases,
  aboutCommitments,
} from '@/lib/data/about';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'About - DIGITAL @ Cal Poly Pomona',
  description:
    'A student-run engineering club at Cal Poly Pomona. How we work: seven letters, three phases, one bench.',
};

const sectionHeading =
  'm-0 font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink';

function SectionHead({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <Reveal className="mb-[18px] border-b border-dg-line-soft pb-[12px]">
      <p className="m-0 font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted">
        {kicker}
      </p>
      <h2 id={id} className={`mt-[4px] ${sectionHeading}`}>
        {title}
      </h2>
    </Reveal>
  );
}

export default function AboutPage() {
  const executives = teamMembers
    .filter((m) => executiveRoles.includes(m.roleCategory))
    .sort((a, b) => a.order - b.order);

  return (
    <PageShell
      eyebrow="About"
      title="A student-run engineering club."
      metaRow={[siteConfig.contact.campus, 'Open to all majors']}
    >
      <div className="mx-auto max-w-[var(--dg-footer-max)]">
        {/* What the club is */}
        <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <Reveal delay={110} className="max-w-[520px]">
            <p className="m-0 text-[13px] leading-[1.75] text-dg-muted">
              DIGITAL stands for how we work — and what we work on. Students join a project
              team, take ownership of a real subsystem, and defend every decision at review.
              The tools are industry standard; the stakes are the build itself.
            </p>
          </Reveal>
          <div className="flex flex-col gap-[14px]">
            {aboutCommitments.map((commitment, i) => (
              <Reveal key={commitment.title} delay={120 + i * 110} className="border-b border-dg-line-soft pb-[12px] last:border-b-0">
                <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                  {commitment.title}
                </h3>
                <p className="m-0 mt-[4px] text-[12.5px] leading-[1.7] text-dg-muted">
                  {commitment.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* How we work — the acronym */}
        <section aria-labelledby="how-we-work" className="mt-[clamp(48px,9vh,96px)] scroll-mt-[90px]" id="how-we-work">
          <SectionHead id="how-we-work-heading" kicker="How we work" title="D · I · G · I · T · A · L" />
          <Reveal delay={110} className="mb-[22px] flex flex-wrap gap-[10px]">
            {acronymPillars.map((pillar) => (
              <span
                key={pillar.word}
                className="inline-flex size-11 items-center justify-center rounded-chip border border-dg-line bg-dg-card font-homeSerif text-[20px] text-dg-ink"
                title={pillar.word}
              >
                {pillar.letter}
              </span>
            ))}
          </Reveal>
          <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {acronymPillars.map((pillar, i) => (
              <Reveal key={`${pillar.word}-${i}`} delay={120 + (i % 4) * 110}>
                <div className="flex h-full flex-col border border-dg-line-card bg-dg-card p-[20px] hover:border-dg-line-strong">
                  <span className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-green">
                    {String(i + 1).padStart(2, '0')} · {pillar.word}
                  </span>
                  <p className="m-0 mt-[8px] flex-1 text-[12.5px] leading-[1.7] text-dg-muted">
                    {pillar.description}
                  </p>
                  <ul className="m-0 mt-[12px] flex list-none flex-col gap-[5px] border-t border-dg-line-soft p-0 pt-[12px]">
                    {pillar.details.map((detail) => (
                      <li key={detail} className="font-homeMono text-[9px] uppercase tracking-[.14em] text-dg-muted-dark">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Phases */}
          <div className="mt-[26px] grid gap-[22px] sm:grid-cols-3">
            {frameworkPhases.map((phase, i) => (
              <Reveal key={phase.label} delay={120 + i * 110}>
                <div className="flex h-full flex-col border-t border-dg-line-accent pt-[12px]">
                  <span className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted">
                    {phase.label}
                  </span>
                  <h3 className="m-0 mt-[4px] text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                    {phase.title}
                  </h3>
                  <p className="m-0 mt-[6px] text-[12.5px] leading-[1.7] text-dg-muted">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Device requirement — verbatim project statement */}
          <Reveal delay={140}>
            <figure className="m-0 mt-[34px] border-l-2 border-dg-gold pl-[clamp(16px,2vw,24px)]">
              <blockquote className="m-0 max-w-[60ch] font-homeSans text-[15px] font-medium leading-[1.7] text-dg-ink">
                &ldquo;{deviceRequirement}&rdquo;
              </blockquote>
              <figcaption className="mt-[8px] font-homeMono text-[9px] uppercase tracking-[.16em] text-dg-muted">
                The requirement — verbatim, since day one
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* On the bench now */}
        <section aria-labelledby="bench-heading" className="mt-[clamp(48px,9vh,96px)]">
          <SectionHead id="bench-heading" kicker="On the bench now" title="The flagship, in parts" />
          <div className="grid gap-[22px] sm:grid-cols-3">
            {benchFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={120 + i * 110}>
                <div className="flex h-full flex-col border-t border-dg-line-accent pt-[12px]">
                  <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                    {feature.title}
                  </h3>
                  <p className="m-0 mt-[6px] text-[12.5px] leading-[1.7] text-dg-muted">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <ol className="m-0 mt-[26px] flex list-none flex-col p-0">
            {roadmapPhases.map((phase, i) => (
              <Reveal key={phase.title} as="div" delay={140 + i * 100}>
                <li className={`flex items-baseline justify-between gap-4 py-[12px] ${i < roadmapPhases.length - 1 ? 'border-b border-dg-line-soft' : ''}`}>
                  <div>
                    <span className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-green">
                      {phase.status}
                    </span>
                    <p className="m-0 mt-[2px] text-[13px] font-medium text-dg-ink">{phase.title}</p>
                    <p className="m-0 text-[12px] leading-[1.65] text-dg-muted">{phase.description}</p>
                  </div>
                  <span className="font-homeMono text-[11px] text-dg-ink-50">0{i + 1}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Who runs it */}
        <section aria-labelledby="people-heading" className="mt-[clamp(48px,9vh,96px)]">
          <SectionHead id="people-heading" kicker="Who runs it" title="The board" />
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
            {executives.map((member, i) => (
              <Reveal key={member.id} delay={120 + i * 110}>
                <Link
                  href="/team"
                  className="block border border-dg-line-card bg-dg-card p-[20px] transition-colors duration-200 hover:border-dg-line-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
                >
                  <span className="inline-flex size-[38px] items-center justify-center rounded-chip-sm border border-dg-line font-homeMono text-[12px] text-dg-muted">?</span>
                  <p className="m-0 mt-[10px] text-[14px] font-semibold tracking-[.02em] text-dg-muted">
                    {member.name}
                  </p>
                  <p className="m-0 mt-[3px] font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-green">
                    {member.role}
                  </p>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={120 + executives.length * 110}>
              <Link
                href="/contact?type=leadership"
                className="flex h-full min-h-[120px] flex-col justify-center border border-dashed border-dg-line-accent p-[20px] transition-colors duration-200 hover:border-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                <span className="font-homeMono text-[15px] text-dg-muted">+</span>
                <span className="mt-[8px] text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                  Run for a seat
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* CTA — dark close */}
        <Reveal delay={110}>
          <section className="mt-[clamp(48px,9vh,96px)] border-y border-dg-line-dark bg-dg-dark px-[clamp(24px,4vw,56px)] py-[clamp(40px,8vh,80px)] text-center text-dg-cream">
            <h2 className="mx-auto m-0 max-w-[var(--dg-heading-max)] font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2]">
              Close the gap. Build with us.
            </h2>
            <p className="mx-auto m-0 mt-[10px] max-w-[460px] text-[13px] leading-[1.75] text-dg-muted-dark">
              Bring engineering, computer science, design, or business. No project experience required.
            </p>
            <div className="mt-[20px] flex flex-wrap justify-center gap-[14px]">
              <Link
                href="/get-involved"
                className="rounded-cta bg-dg-gold px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-dark transition-colors duration-200 hover:bg-dg-gold-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Get involved
              </Link>
              <Link
                href="/contact"
                className="rounded-cta border border-dg-line-dark-strong px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-cream transition-colors duration-200 hover:border-dg-gold hover:text-dg-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Talk to us
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </PageShell>
  );
}
