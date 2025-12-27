'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/data/siteConfig';

// Note: Metadata must be in a separate layout.tsx for client components
// See app/contact/layout.tsx for SEO metadata

const topicOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'join', label: 'Joining the Team' },
  { value: 'project', label: 'Modular Phone Project' },
  { value: 'sponsorship', label: 'Sponsorship & Partnership' },
];

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });

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
    <main className="flex-grow flex justify-center py-10 px-4 sm:px-10 lg:px-40 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/50 blur-[100px]" />
      </div>

      <div className="flex flex-col max-w-[1200px] w-full gap-8">
        {/* Page Heading */}
        <div className="flex flex-col gap-4 text-center md:text-left mb-8">
          <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
            Let&apos;s Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Something Cool
            </span>
          </h1>
          <p className="text-slate-500 dark:text-[#9cabba] text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
            Have questions about our modular phone project, the Project Hatchery Foundation, or
            just want to geek out about hardware? We&apos;re all ears.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col flex-1">
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
                      Full Name
                    </p>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-surface-border bg-slate-50 dark:bg-[#111418] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal transition-all"
                      placeholder="Ada Lovelace"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
                      Email Address
                    </p>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-surface-border bg-slate-50 dark:bg-[#111418] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal transition-all"
                      placeholder="ada@cpp.edu"
                    />
                  </label>
                </div>

                <label className="flex flex-col flex-1">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Topic
                  </p>
                  <div className="relative">
                    <select
                      required
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-surface-border bg-slate-50 dark:bg-[#111418] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#9cabba] px-[15px] text-base font-normal leading-normal appearance-none cursor-pointer transition-all"
                    >
                      <option disabled value="">
                        Select a topic...
                      </option>
                      {topicOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-[#9cabba]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>

                <label className="flex flex-col flex-1">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Message
                  </p>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-surface-border bg-slate-50 dark:bg-[#111418] focus:border-primary min-h-40 placeholder:text-slate-400 dark:placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal transition-all"
                    placeholder="Tell us what's on your mind..."
                  />
                </label>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="mr-2">
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </span>
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                      send
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Info & Location */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Contact Info Card */}
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">perm_contact_calendar</span>
                Contact Info
              </h3>
              <div className="flex flex-col gap-5">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-4 group"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Email Us
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {siteConfig.contact.email}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Meeting Times
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {siteConfig.contact.meetingTime}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Bi-weekly project syncing
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Location
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {siteConfig.contact.location}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {siteConfig.contact.campus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all" />
              <h3 className="text-lg font-bold mb-4 relative z-10">Join the Community</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">
                Follow our journey as we build the future of modular tech.
              </p>
              <div className="flex gap-4 relative z-10">
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <span className="text-lg font-bold">In</span>
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                </a>
                <a
                  href={siteConfig.social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <span className="material-symbols-outlined">forum</span>
                </a>
              </div>
            </div>

            {/* Map / Visual */}
            <div className="h-48 w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-surface-border shadow-sm group">
              <Image
                src="/images/placeholders/general/campus-aerial.svg"
                alt="Aerial view of Cal Poly Pomona campus"
                fill
                className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-background-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                  Cal Poly Pomona
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Project Hatchery CTA */}
        <div className="mt-8 border-t border-slate-200 dark:border-surface-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-surface-dark border border-surface-border rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                Backed by Project Hatchery
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Empowering student-led innovation
              </p>
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            © {new Date().getFullYear()} DIGITAL Club. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
