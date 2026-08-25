import type { Metadata } from 'next';
import Link from 'next/link';
import {
  involvementCategories,
  meetingInfo,
  type InvolvementCategory,
  type InvolvementOption,
} from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Get Involved - DIGITAL @ Cal Poly Pomona',
  description:
    'Three ways in: students take a seat at the bench, alumni stay building, companies fund and hire from real builds.',
};

const categoryIndex = ['01', '02', '03'];

function OptionCard({ option, index }: { option: InvolvementOption; index: number }) {
  return (
    <Link
      href={option.link}
      className="flex flex-col border border-dg-line-card bg-dg-card p-[22px] transition-colors duration-200 hover:border-dg-line-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
    >
      <div className="mb-[12px] flex items-start justify-between">
        <span
          className={
            option.featured
              ? 'inline-flex size-[28px] items-center justify-center rounded-chip-sm border border-dg-ink bg-dg-ink font-homeMono text-[11px] text-dg-bg'
              : 'inline-flex size-[28px] items-center justify-center rounded-chip-sm border border-dg-line font-homeMono text-[11px] text-dg-muted'
          }
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        {option.featured ? (
          <span className="font-homeMono text-[8.5px] uppercase tracking-[.16em] text-dg-green">
            Start here
          </span>
        ) : null}
      </div>
      <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
        {option.title}
      </h3>
      <p className="m-0 mt-[6px] flex-1 text-[12px] leading-[1.7] text-dg-muted">
        {option.description}
      </p>
      <div className="mt-[14px] border-t border-dg-line-soft pt-[12px]">
        <span className="font-homeMono text-[10px] uppercase tracking-[.14em] text-dg-muted group-hover:text-dg-green">
          {option.linkText || 'Learn more'} →
        </span>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  index,
}: {
  category: InvolvementCategory;
  index: number;
}) {
  return (
    <section aria-labelledby={`path-${category.id}`}>
      <Reveal className="mb-[14px] border-b border-dg-line-soft pb-[12px]">
        <p className="m-0 font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted">
          {categoryIndex[index]} / Path
        </p>
        <h2
          id={`path-${category.id}`}
          className="m-0 mt-[4px] font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2] text-dg-ink"
        >
          {category.title}
        </h2>
        <p className="m-0 mt-[4px] text-[13px] leading-[1.65] text-dg-muted">{category.subtitle}</p>
      </Reveal>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
        {category.options.map((option, i) => (
          <Reveal key={option.id} delay={120 + i * 110}>
            <OptionCard option={option} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function GetInvolvedPage() {
  const communityLinks = [
    { label: 'Discord', href: siteConfig.community.discord },
    { label: 'Notion', href: siteConfig.community.notion },
    { label: 'GitHub', href: siteConfig.community.github },
  ];

  return (
    <PageShell
      eyebrow="Get Involved"
      title="Take a seat at the bench."
      metaRow={[meetingInfo.schedule, meetingInfo.location]}
    >
      <div className="mx-auto max-w-[var(--dg-footer-max)]">
        <div className="flex flex-col gap-[clamp(40px,7vh,72px)]">
          {involvementCategories.map((category, i) => (
            <CategorySection key={category.id} category={category} index={i} />
          ))}
        </div>

        {/* Meetings — dark contrast band */}
        <Reveal delay={110}>
          <section
            aria-labelledby="meetings-heading"
            className="mt-[clamp(48px,9vh,96px)] grid border-y border-dg-line-dark [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] text-dg-cream"
          >
            <div className="flex flex-col justify-center gap-[14px] px-[clamp(24px,3.5vw,44px)] py-[clamp(32px,6vh,56px)]">
              <h2
                id="meetings-heading"
                className="m-0 font-homeSans text-[length:var(--dg-type-results)] font-semibold leading-[1.2]"
              >
                {meetingInfo.title}
              </h2>
              <p className="m-0 max-w-[460px] text-[13px] leading-[1.75] text-dg-muted-dark">
                {meetingInfo.description}
              </p>
              <dl className="m-0 mt-[8px]">
                <div className="flex items-baseline justify-between gap-4 border-t border-dg-line-dark py-[10px]">
                  <dt className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted-dark">
                    Schedule
                  </dt>
                  <dd className="m-0 font-homeMono text-[13px] text-dg-cream">
                    {meetingInfo.schedule}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-y border-dg-line-dark py-[10px]">
                  <dt className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted-dark">
                    Location
                  </dt>
                  <dd className="m-0 text-right font-homeMono text-[13px] text-dg-cream">
                    {meetingInfo.location}, {meetingInfo.campus}
                  </dd>
                </div>
              </dl>
              <Link
                href="/contact?type=membership"
                className="mt-[10px] self-start rounded-cta bg-dg-gold px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-dark transition-colors duration-200 hover:bg-dg-gold-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                Get involved
              </Link>
            </div>
            <div className="flex flex-col justify-center border-l border-dg-line-dark px-[clamp(24px,3.5vw,44px)] py-[clamp(32px,6vh,56px)]">
              <p className="m-0 mb-[12px] font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted-dark">
                What to expect
              </p>
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {meetingInfo.perks.map((perk) => (
                  <li key={perk} className="flex items-baseline gap-[10px] text-[13px] leading-[1.6]">
                    <span aria-hidden="true" className="font-homeMono text-[11px] text-dg-star-dark">
                      ✳
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        {/* Closing strip */}
        <Reveal delay={140} className="mt-[26px] border-t border-dg-line-soft pt-6 text-center">
          <p className="m-0 font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
            Not sure where to start?{' '}
            <Link
              href="/contact"
              className="text-dg-ink underline underline-offset-2 hover:text-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
            >
              Talk to us
            </Link>{' '}
            — or jump in directly:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 font-homeMono text-[10px] uppercase tracking-[.14em]">
            {communityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dg-muted transition-colors duration-200 hover:text-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
