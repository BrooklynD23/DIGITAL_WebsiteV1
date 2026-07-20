'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { siteConfig } from '@/lib/data/siteConfig';
import { contactTopicOptions, resolveContactTopic } from '@/lib/data/contactTopics';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Icon,
  Eyebrow,
} from '@/components/ui';

// Note: Metadata must be in a separate layout.tsx for client components
// See app/contact/layout.tsx for SEO metadata

function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const topic = resolveContactTopic(typeParam);
    if (topic) {
      setFormData((prev) => (prev.topic ? prev : { ...prev, topic }));
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch(siteConfig.formspreeEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', topic: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="flex justify-center px-4 pt-[120px] pb-16 md:px-7 md:pb-24">
      <div className="flex w-full max-w-content flex-col gap-12">
        {/* Page Heading */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <Eyebrow>Get in Touch</Eyebrow>
          <h1 className="font-display text-[clamp(40px,7vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
            Let&apos;s Build <span className="text-outline">Something</span> Cool
            <span className="text-accent">.</span>
          </h1>
          <p className="max-w-2xl text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
            Have questions about our modular phone project, the Project Hatchery Foundation, or
            just want to geek out about hardware? We&apos;re all ears.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Form */}
          <Card variant="glass" padding="lg" className="lg:col-span-7">
            {status === 'success' ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-accent/40 bg-accent/[.08] text-accent">
                  <Icon name="check_circle" size="xl" />
                </div>
                <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
                  Message Sent!
                </h2>
                <p className="mt-2 text-[15px] text-ink-soft">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded font-mono text-[11px] uppercase tracking-[.16em] text-accent underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Full Name *"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ada@cpp.edu"
                    autoComplete="email"
                  />
                </div>

                <Select
                  label="Topic *"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Select a topic..."
                  options={[...contactTopicOptions]}
                />

                <Textarea
                  label="Message *"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what's on your mind..."
                />

                {status === 'error' && (
                  <p role="alert" className="font-mono text-[12px] text-accent">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    loading={status === 'submitting'}
                    icon={status === 'submitting' ? undefined : <Icon name="arrow_forward" size="sm" />}
                    iconPosition="right"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Right Column: Info & Location */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Contact Info Card — instrument readout */}
            <Card variant="glass" padding="md">
              <div className="mb-6 flex items-center gap-2">
                <span className="text-accent">
                  <Icon name="perm_contact_calendar" size="md" />
                </span>
                <h2 className="font-display text-[17px] font-bold uppercase tracking-[-.01em] text-ink">
                  Contact Info
                </h2>
              </div>
              <dl className="divide-y divide-line border-y border-line">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-start gap-4 py-4 transition-colors duration-200 ease-studio focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <span className="mt-0.5 shrink-0 text-accent">
                    <Icon name="mail" size="md" />
                  </span>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                      Email Us
                    </dt>
                    <dd className="font-mono text-[13px] text-ink transition-colors group-hover:text-accent">
                      {siteConfig.contact.email}
                    </dd>
                  </div>
                </a>

                <div className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 shrink-0 text-accent">
                    <Icon name="schedule" size="md" />
                  </span>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                      Meeting Times
                    </dt>
                    <dd className="font-mono text-[13px] text-ink">
                      {siteConfig.contact.meetingTime}
                    </dd>
                    <p className="mt-1 text-[13px] text-ink-soft">Bi-weekly project syncing</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 shrink-0 text-accent">
                    <Icon name="location_on" size="md" />
                  </span>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                      Location
                    </dt>
                    <dd className="font-mono text-[13px] text-ink">
                      {siteConfig.contact.location}
                    </dd>
                    <p className="mt-1 text-[13px] text-ink-soft">{siteConfig.contact.campus}</p>
                  </div>
                </div>
              </dl>
            </Card>

            {/* Socials */}
            <Card variant="glass" padding="md">
              <h2 className="font-display text-[17px] font-bold uppercase tracking-[-.01em] text-ink">
                Join the Community
              </h2>
              <p className="mt-2 text-[15px] leading-[1.55] text-ink-soft">
                Follow our journey as we build the future of modular tech.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded border border-line text-ink-soft transition-colors duration-200 ease-studio hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon name="link" size="md" label="LinkedIn" />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded border border-line text-ink-soft transition-colors duration-200 ease-studio hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon name="photo_camera" size="md" label="Instagram" />
                </a>
                <a
                  href={siteConfig.community.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded border border-line text-ink-soft transition-colors duration-200 ease-studio hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon name="chat" size="md" label="Discord" />
                </a>
                <a
                  href={siteConfig.community.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded border border-line text-ink-soft transition-colors duration-200 ease-studio hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon name="code" size="md" label="GitHub" />
                </a>
                <a
                  href={siteConfig.community.notion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded border border-line text-ink-soft transition-colors duration-200 ease-studio hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon name="article" size="md" label="Notion" />
                </a>
              </div>
            </Card>

            {/* Map / Visual */}
            <div className="group relative h-48 w-full overflow-hidden rounded-lg border border-line">
              <Image
                src="/images/placeholders/general/campus-aerial.svg"
                alt="Aerial view of Cal Poly Pomona campus"
                fill
                className="object-cover opacity-70 grayscale transition-all duration-500 ease-studio group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div className="absolute bottom-3 left-3 rounded border border-line bg-studio/85 px-3 py-1.5 backdrop-blur-[6px]">
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-ink">
                  <span className="text-accent">
                    <Icon name="school" size="sm" />
                  </span>
                  Cal Poly Pomona
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Project Hatchery CTA */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded border border-line text-accent">
              <Icon name="rocket_launch" size="md" />
            </span>
            <div>
              <p className="font-display text-[13px] font-bold uppercase tracking-[-.01em] text-ink">
                Backed by Project Hatchery
              </p>
              <p className="text-[13px] text-ink-soft">Empowering student-led innovation</p>
            </div>
          </div>
          <p className="font-mono text-[13px] text-ink-soft">
            © {new Date().getFullYear()} DIGITAL Club. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}
