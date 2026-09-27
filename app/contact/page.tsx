'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/data/siteConfig';
import { contactTopicOptions, resolveContactTopic } from '@/lib/data/contactTopics';
import { socialLinks } from '@/lib/data/siteLinks';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';
import { useReveal } from '@/lib/useReveal';

// Note: Metadata must be in a separate layout.tsx for client components
// See app/contact/layout.tsx for SEO metadata

/**
 * The Formspree endpoint ships as a placeholder until a real form ID is provisioned.
 * Submitting against it would 404 and read as a transient network error, so the form
 * blocks submission and says so instead. Tracked in docs/PRE-LAUNCH.md.
 */
const isFormspreeConfigured = !siteConfig.formspreeEndpoint.includes('YOUR_FORM_ID');

const fieldLabel =
  'mb-[6px] block font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted';
const fieldControl =
  'w-full rounded-cta border border-dg-line-soft bg-dg-bg px-[12px] py-[10px] font-homeSans text-[13px] leading-[1.5] text-dg-ink transition-colors duration-200 placeholder:text-dg-muted-dark focus:border-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green';

type FieldName = 'name' | 'email' | 'topic' | 'message';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-[6px] font-homeMono text-[11px] tracking-[.06em] text-[color:var(--ds-error)]">
      {message}
    </p>
  );
}

function ContactForm() {
  const rootRef = useReveal<HTMLDivElement>();
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'
  >('idle');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });

  // Deep links like /contact?type=sponsor pre-select the topic. Read the query
  // from the URL in an effect (not useSearchParams) so the page prerenders its
  // full markup into the static export.
  useEffect(() => {
    const typeParam = new URLSearchParams(window.location.search).get('type');
    const topic = resolveContactTopic(typeParam);
    if (topic) {
      setFormData((prev) => (prev.topic ? prev : { ...prev, topic }));
    }
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function validate(): boolean {
    const errors: Partial<Record<FieldName, string>> = {};
    if (!formData.name.trim()) errors.name = 'Enter your name.';
    if (!formData.email.trim()) errors.email = 'Enter your email.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email address.';
    if (!formData.topic) errors.topic = 'Pick a topic.';
    if (!formData.message.trim()) errors.message = 'Write a short message.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // The endpoint is still the checked-in placeholder — fail visibly rather than
    // POSTing into a 404 and reporting a generic network error. See docs/PRE-LAUNCH.md.
    if (!isFormspreeConfigured) {
      setStatus('unconfigured');
      return;
    }

    if (!validate()) return;

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

  const inputProps = (name: FieldName) => ({
    value: formData[name],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
      if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    'aria-invalid': fieldErrors[name] ? true : undefined,
  });

  return (
    <div ref={rootRef}>
      <PageShell
        eyebrow="Contact"
        title="Tell us what you want to build."
        metaRow={[siteConfig.contact.meetingTime, siteConfig.contact.location]}
      >
        <div className="mx-auto max-w-[var(--dg-footer-max)]">
          <div className="grid items-start gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
            {/* Form */}
            <Reveal delay={110} className="rounded-card border border-dg-line-card bg-dg-card p-[clamp(24px,3vw,36px)]">
              {status === 'success' ? (
                <div ref={successRef} role="status" tabIndex={-1} className="flex flex-col items-center gap-[14px] py-[clamp(32px,5vh,56px)] text-center focus:outline-none">
                  <span className="inline-flex size-[34px] items-center justify-center rounded-chip border border-dg-line font-homeMono text-[15px] text-dg-gold">✳</span>
                  <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                    Message sent.
                  </h2>
                  <p className="m-0 max-w-[460px] text-[13px] leading-[1.75] text-dg-muted">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-1 rounded-cta border border-dg-line-hover px-4 py-[8px] font-homeMono text-[10px] tracking-[.12em] text-dg-ink transition-colors duration-200 hover:bg-dg-ink hover:text-dg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]" noValidate>
                  <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={fieldLabel}>Full Name *</label>
                      <input id="contact-name" type="text" required autoComplete="name"
                        placeholder="Ada Lovelace" className={`${fieldControl} ${fieldErrors.name ? 'border-[color:var(--ds-error)]' : ''}`} {...inputProps('name')} />
                      <FieldError message={fieldErrors.name} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={fieldLabel}>Email Address *</label>
                      <input id="contact-email" type="email" required autoComplete="email"
                        placeholder="ada@cpp.edu" className={`${fieldControl} ${fieldErrors.email ? 'border-[color:var(--ds-error)]' : ''}`} {...inputProps('email')} />
                      <FieldError message={fieldErrors.email} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className={fieldLabel}>Topic *</label>
                    <select id="contact-topic" required
                      className={`${fieldControl} ${!formData.topic ? 'text-dg-muted-dark' : ''}`} {...inputProps('topic')}>
                      <option value="">Select a topic...</option>
                      {[...contactTopicOptions].map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.topic} />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={fieldLabel}>Message *</label>
                    <textarea id="contact-message" required rows={6}
                      placeholder="Tell us what's on your mind..." className={fieldControl} {...inputProps('message')} />
                    <FieldError message={fieldErrors.message} />
                  </div>

                  {status === 'error' && (
                    <p role="alert" className="font-homeMono text-[12px] text-[color:var(--ds-error)]">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  {status === 'unconfigured' && (
                    <p role="alert" className="font-homeMono text-[12px] leading-[1.7] text-[color:var(--ds-error)]">
                      This form isn&apos;t connected yet. Please email us directly at{' '}
                      <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                        {siteConfig.contact.email}
                      </a>
                      .
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="mt-[6px] self-start rounded-cta bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg transition-colors duration-200 hover:bg-dg-green disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </Reveal>

            {/* Info column */}
            <div className="flex flex-col gap-[22px]">
              <Reveal delay={140} className="rounded-card border border-dg-line-card bg-dg-card">
                <div className="border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
                  <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">Contact info</h2>
                </div>
                <dl className="m-0">
                  <a href={`mailto:${siteConfig.contact.email}`} className="group flex flex-col gap-[2px] border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4 hover:bg-dg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dg-green">
                    <dt className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted">Email us</dt>
                    <dd className="m-0 font-homeMono text-[13px] text-dg-ink group-hover:text-dg-green">{siteConfig.contact.email}</dd>
                  </a>
                  <div className="flex flex-col gap-[2px] border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
                    <dt className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted">Meetings</dt>
                    <dd className="m-0 font-homeMono text-[13px] text-dg-ink">{siteConfig.contact.meetingTime}</dd>
                    <p className="m-0 text-[12.5px] text-dg-muted">{siteConfig.contact.campus}</p>
                  </div>
                  <div className="flex flex-col gap-[2px] px-[clamp(20px,2.5vw,28px)] py-4">
                    <dt className="font-homeMono text-[9.5px] uppercase tracking-[.16em] text-dg-muted">Location</dt>
                    <dd className="m-0 font-homeMono text-[13px] text-dg-ink">{siteConfig.contact.location}</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={170} className="rounded-card border border-dg-line-card bg-dg-card">
                <div className="border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
                  <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">Elsewhere</h2>
                </div>
                <ul className="m-0 flex flex-col px-[clamp(20px,2.5vw,28px)] py-4 font-homeMono text-[11px] uppercase tracking-[.14em]">
                  {socialLinks.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between border-b border-dg-line-soft py-[10px] text-dg-muted last:border-b-0 last:pb-0 hover:text-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green">
                        {social.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Drafted campus plate — imagery stays inside the frame convention */}
              <Reveal delay={200} className="relative overflow-hidden rounded-plate border border-dg-line-hair">
                <div className="flex h-48 items-center justify-center p-3 text-center" style={{ background: 'repeating-linear-gradient(-45deg, var(--dg-stripe-a) 0 14px, var(--dg-stripe-b) 14px 28px)' }}>
                  <span className="font-homeMono text-[9px] leading-[1.8] tracking-[.14em] text-dg-ink-45">
                    [ CAMPUS MAP — CAL POLY POMONA ]
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Sponsor strip */}
          <Reveal delay={230} className="mt-[26px] border-t border-dg-line-soft pt-6 text-center">
            <p className="font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
              Backed by Cal Poly Pomona Project Hatchery · College of Engineering MEP-WiSE ·{' '}
              <Link href="/get-involved" className="underline underline-offset-2 hover:text-dg-green">
                Get involved
              </Link>
            </p>
          </Reveal>
        </div>
      </PageShell>
    </div>
  );
}

export default function ContactPage() {
  return <ContactForm />;
}
