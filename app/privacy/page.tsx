import type { Metadata } from 'next';
import { Eyebrow, OutlineHeading, Section } from '@/components/ui';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'Privacy Policy — DIGITAL @ Cal Poly Pomona',
  description:
    'How DIGITAL @ Cal Poly Pomona collects, uses, and protects information about visitors to our website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;
const EMAIL = siteConfig.contact.email;

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-[140px] pb-[60px]">
        <div className="max-w-[720px]">
          <Eyebrow>Legal</Eyebrow>
          <OutlineHeading as="h1" size="section" outline="Policy" className="mt-6">
            Privacy{' '}
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

          {/* 1 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              1. About This Policy
            </h2>
            <p className="mt-4">
              {ORG} (&ldquo;DIGITAL,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) is a student-run engineering organization at Cal Poly Pomona.
              This Privacy Policy explains what information we collect when you visit our
              website at{' '}
              <a
                href={siteConfig.url}
                className="text-accent-blue underline underline-offset-2 transition-colors hover:text-ink"
              >
                {siteConfig.url}
              </a>{' '}
              (the &ldquo;Site&rdquo;), how we use it, and your choices.
            </p>
            <p className="mt-4">
              We are a non-commercial student club. We do not sell advertising, run
              subscription services, or monetize personal data.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              2. Information We Collect
            </h2>
            <p className="mt-4">
              We collect only what is necessary to operate the Site and respond to inquiries.
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              2a. Contact Form Submissions
            </h3>
            <p className="mt-3">
              When you submit our contact form, the information you provide (name, email
              address, and message text) is transmitted to and stored by{' '}
              <strong>Formspree</strong>, our third-party form-processing provider. We receive
              that data via Formspree so we can respond to your inquiry. We do not store form
              submissions on our own servers.
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              2b. Analytics (Cookieless)
            </h3>
            <p className="mt-3">
              This Site uses <strong>Vercel Analytics</strong> and{' '}
              <strong>Vercel Speed Insights</strong> to understand aggregate traffic and
              performance. These services are <em>cookieless</em> — they do not set tracking
              cookies, do not fingerprint individual users, and do not build personal profiles.
              The data collected is aggregate and anonymized (page views, referrer, country,
              browser type, Core Web Vitals scores). No personally identifiable information is
              associated with these analytics events.
            </p>
            <h3 className="mt-6 font-display text-[16px] font-bold uppercase tracking-[-.01em] text-ink">
              2c. Server Logs
            </h3>
            <p className="mt-3">
              Our hosting provider, Vercel, may log standard server-level data including IP
              addresses, request timestamps, and HTTP status codes as part of normal
              infrastructure operation. This data is retained and managed by Vercel according
              to their privacy policy and is used solely for infrastructure security and
              debugging.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              3. How We Use Your Information
            </h2>
            <p className="mt-4">
              We use the information collected for the following purposes:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Responding to inquiries submitted via the contact form.</li>
              <li>Understanding aggregate site traffic to improve content and performance.</li>
              <li>Maintaining the security and reliable operation of the Site.</li>
            </ul>
            <p className="mt-4">
              We do not use your information for advertising, profiling, or any commercial
              purpose. We do not share contact form data with any third party other than
              Formspree, who acts as a data processor on our behalf.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              4. Third-Party Processors
            </h2>
            <p className="mt-4">
              We rely on the following third-party services to operate the Site. Each has its
              own privacy policy which governs how they handle data:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong>Vercel, Inc.</strong> — Site hosting, edge delivery, and cookieless
                analytics / speed insights.{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue underline underline-offset-2 transition-colors hover:text-ink"
                >
                  vercel.com/legal/privacy-policy
                </a>
              </li>
              <li>
                <strong>Formspree</strong> — Contact form submission processing and delivery.{' '}
                <a
                  href="https://formspree.io/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue underline underline-offset-2 transition-colors hover:text-ink"
                >
                  formspree.io/legal/privacy-policy
                </a>
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              5. Data Retention
            </h2>
            <p className="mt-4">
              Contact form submissions are retained by Formspree according to their data
              retention policy. We may keep copies of correspondence in our organizational
              email for as long as reasonably necessary to fulfill the purpose of the
              communication. Vercel server logs are retained per Vercel&rsquo;s policies.
              Aggregate analytics data contains no personal identifiers and is retained
              indefinitely for historical trend analysis.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              6. Your Rights and Choices
            </h2>
            <p className="mt-4">
              You may contact us at any time to request access to, correction of, or deletion
              of personal information you have provided to us (e.g., via a contact form
              submission). Because we operate as a non-commercial student club, we will
              respond to such requests on a best-effort basis, typically within 30 days.
            </p>
            <p className="mt-4">
              California residents may have additional rights under the California Consumer
              Privacy Act (CCPA). However, as a non-commercial student organization that does
              not sell personal information and whose annual gross revenue is well below CCPA
              thresholds, CCPA may not apply to us. We will nonetheless honor reasonable
              access and deletion requests.
            </p>
            <p className="mt-4">
              To exercise any rights, contact us at{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-accent-blue underline underline-offset-2 transition-colors hover:text-ink"
              >
                {EMAIL}
              </a>
              .
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              7. Children&rsquo;s Privacy
            </h2>
            <p className="mt-4">
              This Site is directed at college-age students and adults. We do not knowingly
              collect personal information from individuals under 13 years of age. If we
              become aware that a child under 13 has submitted personal information, we will
              take steps to delete it promptly.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              8. External Links
            </h2>
            <p className="mt-4">
              Our Site contains links to external sites (e.g., GitHub, LinkedIn, Discord).
              We are not responsible for the privacy practices of those sites and recommend
              reviewing their privacy policies before providing personal information.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              9. Changes to This Policy
            </h2>
            <p className="mt-4">
              We may update this Privacy Policy from time to time. When we do, we will update
              the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of
              the Site after any changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-display text-[21px] font-bold uppercase tracking-[-.01em] text-ink">
              10. Contact
            </h2>
            <p className="mt-4">
              If you have questions or concerns about this Privacy Policy, please reach out:
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
