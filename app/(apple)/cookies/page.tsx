import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';
import { DraftNotice, LegalAddress, LegalPage, type LegalSection } from '../_legal/LegalPage';
import l from '../_legal/legal.module.css';

export const metadata: Metadata = {
  title: 'Cookie Notice — DIGITAL @ Cal Poly Pomona',
  description:
    'Cookie and local storage notice for the DIGITAL @ Cal Poly Pomona website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'what',
    title: '1. What Are Cookies?',
    body: (
      <p>
        Cookies are small text files that a website stores on your device when you
        visit. They can be used to remember your preferences, keep you logged in,
        measure traffic, or track you across websites for advertising purposes.
      </p>
    ),
  },
  {
    id: 'this-site',
    title: '2. Cookies on This Site',
    body: (
      <>
        <p>
          The {ORG} website is a public informational site operated by a non-commercial
          student club. We have deliberately chosen a technology stack that minimizes
          cookie use:
        </p>
        <h3>Tracking &amp; Advertising Cookies</h3>
        <p>
          We use <strong>none</strong>. There are no third-party advertising networks,
          no retargeting pixels, and no cross-site tracking on this website.
        </p>
        <h3>Analytics</h3>
        <p>
          We use <strong>Vercel Analytics</strong> and{' '}
          <strong>Vercel Speed Insights</strong> to measure aggregate page views and
          performance. These tools are <em>cookieless</em> — they do not set any cookies
          on your device and do not track you individually. The data collected is
          anonymous and aggregated (e.g., page views by country, browser type, Core Web
          Vitals). No personal profile is created.
        </p>
        <h3>Strictly Necessary / Functional Storage</h3>
        <p>
          Some web browsers cache static assets (HTML, CSS, images) in their built-in
          cache — this is a browser feature outside our control and is not a cookie. We
          do not currently use <code>localStorage</code>, <code>sessionStorage</code>,
          or any other client-side storage for user data. If this changes (e.g., to save
          a theme preference), this notice will be updated.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: '3. Third-Party Services and Cookies',
    body: (
      <p>
        When you navigate to external links from our Site (GitHub, LinkedIn, Discord,
        etc.), those sites may set their own cookies under their own policies. We have
        no control over those cookies. We recommend reviewing the cookie policies of
        any third-party sites you visit.
      </p>
    ),
  },
  {
    id: 'managing',
    title: '4. Managing Cookies in Your Browser',
    body: (
      <>
        <p>
          Even though we set no tracking cookies, you can control cookies through your
          browser settings at any time:
        </p>
        <ul>
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
        <p>
          Blocking all cookies may affect the functionality of other sites you visit, but
          it will not meaningfully affect your experience on this Site.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '5. Changes to This Notice',
    body: (
      <p>
        If our cookie practices change — for example, if we add a feature that requires
        client-side storage — we will update this notice and the &ldquo;Last
        updated&rdquo; date accordingly.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '6. Contact',
    body: (
      <>
        <p>Questions about cookies or this notice? Reach us at:</p>
        <LegalAddress />
      </>
    ),
  },
];

const INTRO = (
  <>
    <DraftNotice />
    <div className={l.note}>
      <p><strong>Short version</strong></p>
      <p>
        This site uses <strong>no tracking cookies</strong> and no advertising cookies.
        The analytics tools we use are cookieless by design. We do not profile visitors.
      </p>
    </div>
  </>
);

export default function CookiesPage() {
  return <LegalPage title="Cookies Notice" updated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
