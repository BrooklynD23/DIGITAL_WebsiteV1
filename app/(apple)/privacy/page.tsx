import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';
import { DraftNotice, LegalAddress, LegalPage, type LegalSection } from '../_legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — DIGITAL @ Cal Poly Pomona',
  description:
    'How DIGITAL @ Cal Poly Pomona collects, uses, and protects information about visitors to our website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;
const EMAIL = siteConfig.contact.email;

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'about',
    title: '1. About This Policy',
    body: (
      <>
        <p>
          {ORG} (&ldquo;DIGITAL,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) is a student-run engineering organization at Cal Poly Pomona.
          This Privacy Policy explains what information we collect when you visit our
          website at <a href={siteConfig.url}>{siteConfig.url}</a> (the &ldquo;Site&rdquo;),
          how we use it, and your choices.
        </p>
        <p>
          We are a non-commercial student club. We do not sell advertising, run
          subscription services, or monetize personal data.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: '2. Information We Collect',
    body: (
      <>
        <p>We collect only what is necessary to operate the Site and respond to inquiries.</p>
        <h3>2a. Contact Form Submissions</h3>
        <p>
          When you submit our contact form, the information you provide (name, email
          address, and message text) is transmitted to and stored by{' '}
          <strong>Formspree</strong>, our third-party form-processing provider. We receive
          that data via Formspree so we can respond to your inquiry. We do not store form
          submissions on our own servers.
        </p>
        <h3>2b. Analytics (Cookieless)</h3>
        <p>
          This Site uses <strong>Vercel Analytics</strong> and{' '}
          <strong>Vercel Speed Insights</strong> to understand aggregate traffic and
          performance. These services are <em>cookieless</em> — they do not set tracking
          cookies, do not fingerprint individual users, and do not build personal profiles.
          The data collected is aggregate and anonymized (page views, referrer, country,
          browser type, Core Web Vitals scores). No personally identifiable information is
          associated with these analytics events.
        </p>
        <h3>2c. Server Logs</h3>
        <p>
          Our hosting provider, Vercel, may log standard server-level data including IP
          addresses, request timestamps, and HTTP status codes as part of normal
          infrastructure operation. This data is retained and managed by Vercel according
          to their privacy policy and is used solely for infrastructure security and
          debugging.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    title: '3. How We Use Your Information',
    body: (
      <>
        <p>We use the information collected for the following purposes:</p>
        <ul>
          <li>Responding to inquiries submitted via the contact form.</li>
          <li>Understanding aggregate site traffic to improve content and performance.</li>
          <li>Maintaining the security and reliable operation of the Site.</li>
        </ul>
        <p>
          We do not use your information for advertising, profiling, or any commercial
          purpose. We do not share contact form data with any third party other than
          Formspree, who acts as a data processor on our behalf.
        </p>
      </>
    ),
  },
  {
    id: 'processors',
    title: '4. Third-Party Processors',
    body: (
      <>
        <p>
          We rely on the following third-party services to operate the Site. Each has its
          own privacy policy which governs how they handle data:
        </p>
        <ul>
          <li>
            <strong>Vercel, Inc.</strong> — Site hosting, edge delivery, and cookieless
            analytics / speed insights.{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              vercel.com/legal/privacy-policy
            </a>
          </li>
          <li>
            <strong>Formspree</strong> — Contact form submission processing and delivery.{' '}
            <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              formspree.io/legal/privacy-policy
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'retention',
    title: '5. Data Retention',
    body: (
      <p>
        Contact form submissions are retained by Formspree according to their data
        retention policy. We may keep copies of correspondence in our organizational
        email for as long as reasonably necessary to fulfill the purpose of the
        communication. Vercel server logs are retained per Vercel&rsquo;s policies.
        Aggregate analytics data contains no personal identifiers and is retained
        indefinitely for historical trend analysis.
      </p>
    ),
  },
  {
    id: 'rights',
    title: '6. Your Rights and Choices',
    body: (
      <>
        <p>
          You may contact us at any time to request access to, correction of, or deletion
          of personal information you have provided to us (e.g., via a contact form
          submission). Because we operate as a non-commercial student club, we will
          respond to such requests on a best-effort basis, typically within 30 days.
        </p>
        <p>
          California residents may have additional rights under the California Consumer
          Privacy Act (CCPA). However, as a non-commercial student organization that does
          not sell personal information and whose annual gross revenue is well below CCPA
          thresholds, CCPA may not apply to us. We will nonetheless honor reasonable
          access and deletion requests.
        </p>
        <p>
          To exercise any rights, contact us {EMAIL ? <>at <a href={`mailto:${EMAIL}`}>{EMAIL}</a></> : <>through the <a href="/contact/">contact page</a></>}.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: '7. Children’s Privacy',
    body: (
      <p>
        This Site is directed at college-age students and adults. We do not knowingly
        collect personal information from individuals under 13 years of age. If we
        become aware that a child under 13 has submitted personal information, we will
        take steps to delete it promptly.
      </p>
    ),
  },
  {
    id: 'external-links',
    title: '8. External Links',
    body: (
      <p>
        Our Site contains links to external sites (e.g., GitHub, LinkedIn, Discord).
        We are not responsible for the privacy practices of those sites and recommend
        reviewing their privacy policies before providing personal information.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will update
        the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of
        the Site after any changes constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: (
      <>
        <p>If you have questions or concerns about this Privacy Policy, please reach out:</p>
        <LegalAddress />
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated={LAST_UPDATED} intro={<DraftNotice />} sections={SECTIONS} />;
}
