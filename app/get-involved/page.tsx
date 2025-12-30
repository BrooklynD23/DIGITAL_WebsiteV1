import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/components/ui';
import { involvementCategories, meetingInfo } from '@/lib/data/involvement';

export const metadata: Metadata = {
  title: 'Get Involved - DIGITAL @ Cal Poly Pomona',
  description: 'Join DIGITAL as a student, alumni, or industry partner. Multiple ways to get involved with our engineering community.',
};

export default function GetInvolvedPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-20 px-4 md:px-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="flagship" className="mb-4">Open to Everyone</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Get Involved with{' '}
            <span className="text-gradient">DIGITAL</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you&apos;re a student looking to build skills, an alumni wanting to give back,
            or a company seeking engineering talent — there&apos;s a place for you here.
          </p>
        </div>
      </section>

      {/* Involvement Categories */}
      {involvementCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          className={`w-full py-16 px-4 md:px-10 ${
            categoryIndex % 2 === 0
              ? 'bg-white dark:bg-background-dark'
              : 'bg-gray-50 dark:bg-[#0d131a]'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-primary-subtle flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">{category.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {category.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {category.subtitle}
                </p>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {category.options.map((option) => (
                <Link key={option.id} href={option.link} className="block h-full">
                  <Card
                    variant={option.featured ? 'featured' : 'interactive'}
                    padding="md"
                    className="h-full flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${
                          option.featured
                            ? 'bg-primary text-white'
                            : 'bg-primary-subtle text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {option.icon}
                        </span>
                      </div>
                      {option.featured && (
                        <Badge variant="active" size="sm">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="flex-1">
                      <CardTitle className="text-base">{option.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {option.description}
                      </CardDescription>
                    </CardHeader>

                    <div className="mt-4 pt-4 border-t border-surface-border-light dark:border-surface-border">
                      <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {option.linkText || 'Learn More'}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Meeting Info Section */}
      <section className="w-full py-20 px-4 md:px-10 bg-white dark:bg-background-dark">
        <div className="max-w-5xl mx-auto">
          <Card variant="featured" padding="lg" className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">event</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    {meetingInfo.title}
                  </h2>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {meetingInfo.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span className="font-medium">{meetingInfo.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="font-medium">{meetingInfo.location}, {meetingInfo.campus}</span>
                  </div>
                </div>

                <Link href="/contact">
                  <Button>
                    Get Meeting Reminders
                    <span className="material-symbols-outlined text-lg ml-1">notifications</span>
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-50 dark:bg-surface-dark/50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {meetingInfo.perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="w-full py-16 px-4 md:px-10 bg-gray-50 dark:bg-[#0d131a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Reach out to our outreach team and we&apos;ll help you find the perfect way to get involved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">
                Contact Outreach Team
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
