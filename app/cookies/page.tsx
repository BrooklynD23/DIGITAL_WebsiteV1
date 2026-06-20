import type { Metadata } from 'next';
import { Eyebrow, OutlineHeading, Section } from '@/components/ui';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'Cookie Notice — DIGITAL @ Cal Poly Pomona',
  description:
    'Cookie and local storage notice for the DIGITAL @ Cal Poly Pomona website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;
const EMAIL = siteConfig.contact.email;

export default function CookiesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-[140px] pb-[60px]">
        <div className="max-w-[720px]">
          <Eyebrow>Legal</Eyebrow>
          <OutlineHeading as="h1" size="section" outline="Notice" className="mt-6">
            Cookie{' '}
          </OutlineHeading>
          <p className="mt-6 font-mono text-[13px] leading-[1.6] text-ink-soft">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </Section>

      {/* Draft notice */}
      <Section as="div" className="pb-0">
        <div className="max-w-[720px] rounded-lg border border-accent/40 bg-accent/[.06] px-6 py-5">
          <p className="font-mono text-[12px] uppercase tracking-[.16em] text-accent">
            Draft — pending review
          </p>
          <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
            This is a starter document and should be reviewed by the organization (and legal
            counsel where appropriate) before being relied upon. It is provided in good faith
            as a reasonable starting point for a non-commercial student engineering club.
          </p>
        </div>
      </Section>

      {/* Body */}
      <Section band noBorder className="pt-[60px]">
        <div className="max-w-[720px] space-y-10 font-body text-[clamp(16px,1.5vw,18px)] leading-[1.65] text-ink-soft">

          {/* Summary */}
          <div className="rounded-lg border border-line bg-white/40 px-6 py-5 backdrop-blur-[6px]">
            <p className="font-mono text-[12px] uppercase tracking-[.16em] text-ink">
              Short version
            </p>
            <p className="mt-3">
              This site uses <strong>no tracking cookies</strong> and no advertising cookies.
              The analytics tools we use are cookieless by design. We do not profile visitors.
            </p>
          </div>

          {/* 1 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              1. What Are Cookies?
            </h2>
            <p className="mt-4">
              Cookies are small text files that a website stores on your device when you
              visit. They can be used to remember your preferences, keep you logged in,
              measure traffic, or track you across websites for advertising purposes.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              2. Cookies on This Site
            </h2>
            <p className="mt-4">
              The {ORG} website is a public informational site operated by a non-commercial
              student club. We have deliberately chosen a technology stack that minimizes
              cookie use:
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              Tracking &amp; Advertising Cookies
            </h3>
            <p className="mt-3">
              We use <strong>none</strong>. There are no third-party advertising networks,
              no retargeting pixels, and no cross-site tracking on this website.
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              Analytics
            </h3>
            <p className="mt-3">
              We use <strong>Vercel Analytics</strong> and{' '}
              <strong>Vercel Speed Insights</strong> to measure aggregate page views and
              performance. These tools are <em>cookieless</em> — they do not set any cookies
              on your device and do not track you individually. The data collected is
              anonymous and aggregated (e.g., page views by country, browser type, Core Web
              Vitals). No personal profile is created.
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              Strictly Necessary / Functional Storage
            </h3>
            <p className="mt-3">
              Some web browsers cache static assets (HTML, CSS, images) in their built-in
              cache — this is a browser feature outside our control and is not a cookie. We
              do not currently use <code>localStorage</code>, <code>sessionStorage</code>,
              or any other client-side storage for user data. If this changes (e.g., to save
              a theme preference), this notice will be updated.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              3. Third-Party Services and Cookies
            </h2>
            <p className="mt-4">
              When you navigate to external links from our Site (GitHub, LinkedIn, Discord,
              etc.), those sites may set their own cookies under their own policies. We have
              no control over those cookies. We recommend reviewing the cookie policies of
              any third-party sites you visit.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              4. Managing Cookies in Your Browser
            </h2>
            <p className="mt-4">
              Even though we set no tracking cookies, you can control cookies through your
              browser settings at any time:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other
                site data.
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and
                Site Data.
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data.
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and
                site data.
              </li>
            </ul>
            <p className="mt-4">
              Blocking all cookies may affect the functionality of other sites you visit, but
              it will not meaningfully affect your experience on this Site.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              5. Changes to This Notice
            </h2>
            <p className="mt-4">
              If our cookie practices change — for example, if we add a feature that requires
              client-side storage — we will update this notice and the &ldquo;Last
              updated&rdquo; date accordingly.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              6. Contact
            </h2>
            <p className="mt-4">
              Questions about cookies or this notice? Reach us at:
            </p>
            <address className="mt-4 not-italic">
              <p className="font-mono text-[13px] leading-[1.8] text-ink-soft">
                {ORG}
                <br />
                {siteConfig.contact.location}
                <br />
                {siteConfig.contact.campus}
                <br />
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-accent-blue underline underline-offset-2 transition-colors hover:text-ink"
                >
                  {EMAIL}
                </a>
              </p>
            </address>
          </div>

        </div>
      </Section>
    </>
  );
}
