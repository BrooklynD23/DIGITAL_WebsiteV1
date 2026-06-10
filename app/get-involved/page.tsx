import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Icon,
  Eyebrow,
  Section,
} from '@/components/ui';
import { involvementCategories, meetingInfo } from '@/lib/data/involvement';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'Get Involved - DIGITAL @ Cal Poly Pomona',
  description: 'Join DIGITAL as a student, alumni, or industry partner. Multiple ways to get involved with our engineering community.',
};

const categoryIndex = ['01', '02', '03'];

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <Section className="pt-[120px] pb-16 md:pb-24" wrap>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Badge variant="flagship">Open to Everyone</Badge>
          </div>
          <h1 className="font-display text-[clamp(40px,7vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
            Get Involved with <span className="text-outline">DIGITAL</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Whether you&apos;re a student looking to build skills, an alumni wanting to give back,
            or a company seeking engineering talent — there&apos;s a place for you here.
          </p>
        </div>
      </Section>

      {/* Involvement Categories */}
      {involvementCategories.map((category, i) => (
        <Section key={category.id} band wrap as="section">
          {/* Category Header */}
          <div className="mb-10 flex items-center gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded border border-line text-accent">
              <Icon name={category.icon} size="lg" />
            </span>
            <div>
              <Eyebrow>{categoryIndex[i]} / Path</Eyebrow>
              <h2 className="mt-1 font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
                {category.title}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.55] text-ink-soft">{category.subtitle}</p>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-4">
            {category.options.map((option) => (
              <Link key={option.id} href={option.link} className="group block h-full">
                <Card
                  variant={option.featured ? 'featured' : 'interactive'}
                  padding="md"
                  className="flex h-full flex-col"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span
                      className={
                        option.featured
                          ? 'inline-flex size-10 items-center justify-center rounded border border-accent/40 bg-accent/[.08] text-accent'
                          : 'inline-flex size-10 items-center justify-center rounded border border-line text-ink'
                      }
                    >
                      <Icon name={option.icon} size="md" />
                    </span>
                    {option.featured && (
                      <Badge variant="flagship" size="sm">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="flex-1">
                    <CardTitle className="text-[17px]">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>

                  <div className="mt-4 border-t border-line pt-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-accent transition-[gap] duration-200 ease-studio group-hover:gap-2.5">
                      {option.linkText || 'Learn More'}
                      <Icon name="arrow_forward" size="sm" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      ))}

      {/* Meeting Info Section — instrument readout */}
      <Section band wrap as="section">
        <Card variant="featured" padding="lg">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded border border-accent/40 bg-accent/[.08] text-accent">
                  <Icon name="event" size="lg" />
                </span>
                <h2 className="font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
                  {meetingInfo.title}
                </h2>
              </div>

              <p className="mb-8 text-[15px] leading-[1.55] text-ink-soft">
                {meetingInfo.description}
              </p>

              {/* Readout */}
              <dl className="mb-8 divide-y divide-line border-y border-line">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                    <Icon name="schedule" size="sm" />
                    Schedule
                  </dt>
                  <dd className="font-mono text-[13px] uppercase tracking-[.1em] text-ink">
                    {meetingInfo.schedule}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                    <Icon name="location_on" size="sm" />
                    Location
                  </dt>
                  <dd className="text-right font-mono text-[13px] uppercase tracking-[.1em] text-ink">
                    {meetingInfo.location}, {meetingInfo.campus}
                  </dd>
                </div>
              </dl>

              <Link href="/contact">
                <Button
                  icon={<Icon name="notifications" size="sm" />}
                  iconPosition="right"
                >
                  Get Meeting Reminders
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border border-line bg-white/40 p-6">
              <Eyebrow>What to Expect</Eyebrow>
              <ul className="mt-4 space-y-3">
                {meetingInfo.perks.map((perk, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="inline-flex size-6 items-center justify-center rounded-full border border-accent/40 bg-accent/[.08] text-accent">
                      <Icon name="check" size="sm" />
                    </span>
                    <span className="text-[15px] text-ink">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      {/* Quick Contact CTA */}
      <Section band wrap as="section">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Need a hand?</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em] text-ink">
            Not Sure Where to <span className="text-outline">Start</span>
            <span className="text-accent">?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.55] text-ink-soft">
            Reach out to our outreach team and we&apos;ll help you find the perfect way to get involved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg">Contact Outreach Team</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="lg">
                Learn More About Us
              </Button>
            </Link>
          </div>

          {/* Quick Access Community Links */}
          <div className="mt-10 border-t border-line pt-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
              Ready to jump in? Join our community directly:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={siteConfig.community.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border-[1.5px] border-ink px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[.04em] text-ink transition-[transform,background-color,color] duration-200 ease-studio hover:-translate-y-0.5 hover:bg-ink/[.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <Icon name="chat" size="sm" />
                Join Discord
              </a>
              <a
                href={siteConfig.community.notion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border-[1.5px] border-ink px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[.04em] text-ink transition-[transform,background-color,color] duration-200 ease-studio hover:-translate-y-0.5 hover:bg-ink/[.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <Icon name="article" size="sm" />
                View Notion
              </a>
              <a
                href={siteConfig.community.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border-[1.5px] border-ink px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[.04em] text-ink transition-[transform,background-color,color] duration-200 ease-studio hover:-translate-y-0.5 hover:bg-ink/[.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <Icon name="code" size="sm" />
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
