import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { siteConfig } from '@/lib/data/siteConfig';

export const metadata: Metadata = {
  title: 'Terms of Use — DIGITAL @ Cal Poly Pomona',
  description:
    'Terms governing your use of the DIGITAL @ Cal Poly Pomona website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;
const EMAIL = siteConfig.contact.email;

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <PageShell eyebrow="Legal" title="Terms of Service" metaRow={[`Last updated: ${LAST_UPDATED}`]} />

      {/* Draft notice */}
      <div>
        <div className="max-w-[720px] rounded-lg border border-accent/40 bg-accent/[.06] px-6 py-5">
          <p className="font-homeMono text-[10px] uppercase tracking-[.16em] text-dg-muted">
            Draft — pending review
          </p>
          <p className="mt-2 font-homeSans text-[13px] leading-[1.75] text-dg-muted">
            This is a starter document and should be reviewed by the organization (and legal
            counsel where appropriate) before being relied upon. It is provided in good faith
            as a reasonable starting point for a non-commercial student engineering club.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="pt-[60px] pb-[60px]">
        <div className="max-w-[720px] space-y-10 font-homeSans text-[14px] leading-[1.8] text-dg-muted">

          {/* 1 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              1. Acceptance of Terms
            </h2>
            <p className="mt-4">
              By accessing or using the website at{' '}
              <a
                href={siteConfig.url}
                className="text-dg-ink underline underline-offset-2 transition-colors hover:text-dg-green"
              >
                {siteConfig.url}
              </a>{' '}
              (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use
              (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Site.
            </p>
            <p className="mt-4">
              The Site is operated by {ORG} (&ldquo;DIGITAL,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a non-commercial student engineering
              organization affiliated with Cal Poly Pomona.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              2. Use of the Site
            </h2>
            <p className="mt-4">
              You may use the Site for lawful, personal, and informational purposes. You
              agree not to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Use the Site in any way that violates applicable local, state, national, or
                international law or regulation.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Site or its underlying
                infrastructure.
              </li>
              <li>
                Scrape, crawl, or data-mine the Site in a manner that places unreasonable
                load on our servers or circumvents technical measures.
              </li>
              <li>
                Impersonate DIGITAL or any of its members, or misrepresent your affiliation
                with the organization.
              </li>
              <li>
                Use the Site to transmit spam, malware, or any other harmful content.
              </li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              3. Intellectual Property
            </h2>
            <h3 className="mt-6 font-homeSans text-[14px] font-semibold leading-[1.4] text-dg-ink">
              3a. Organization Content
            </h3>
            <p className="mt-3">
              All text, graphics, logos, images, and other content on the Site that was
              created by or for {ORG} (&ldquo;Organization Content&rdquo;) is owned by or
              licensed to DIGITAL and is protected by applicable copyright and intellectual
              property laws. You may not reproduce, distribute, or create derivative works
              from Organization Content without prior written permission from DIGITAL.
            </p>
            <h3 className="mt-6 font-homeSans text-[14px] font-semibold leading-[1.4] text-dg-ink">
              3b. Open-Source Projects
            </h3>
            <p className="mt-3">
              DIGITAL develops open-source software projects that are published on GitHub.
              Those projects are governed by their respective open-source licenses (e.g., MIT,
              Apache 2.0) as stated in each repository&rsquo;s <code>LICENSE</code> file.
              Nothing in these Terms restricts rights granted to you under those separate
              open-source licenses.
            </p>
            <h3 className="mt-6 font-homeSans text-[14px] font-semibold leading-[1.4] text-dg-ink">
              3c. Third-Party Content
            </h3>
            <p className="mt-3">
              The Site may reference or link to third-party content, trademarks, and brands
              (e.g., Cal Poly Pomona, Project Hatchery) for identification and informational
              purposes only. Such references do not constitute an endorsement and all
              third-party marks remain the property of their respective owners.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              4. Disclaimer of Warranties
            </h2>
            <p className="mt-4">
              THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE
              FULLEST EXTENT PERMITTED BY LAW, DIGITAL DISCLAIMS ALL WARRANTIES, INCLUDING
              BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              5. Limitation of Liability
            </h2>
            <p className="mt-4">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DIGITAL,
              ITS OFFICERS, MEMBERS, VOLUNTEERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR
              RELATED TO YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES. IN ANY CASE, OUR AGGREGATE LIABILITY TO YOU FOR
              ALL CLAIMS SHALL NOT EXCEED ONE HUNDRED DOLLARS (USD $100).
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              6. External Links
            </h2>
            <p className="mt-4">
              The Site contains links to third-party websites (including GitHub, LinkedIn,
              Discord, and Notion). These links are provided for convenience and informational
              purposes only. We do not control those sites and are not responsible for their
              content, privacy practices, or availability. Linking does not imply our
              endorsement of those sites or their operators.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              7. Governing Law
            </h2>
            <p className="mt-4">
              These Terms shall be governed by and construed in accordance with the laws of
              the State of California, USA, without regard to conflict-of-law principles.{' '}
              <span className="font-mono text-[13px] text-accent">[To be confirmed by the organization.]</span>{' '}
              Any disputes arising under these Terms shall be subject to the exclusive
              jurisdiction of the courts located in Los Angeles County, California.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              8. Changes to These Terms
            </h2>
            <p className="mt-4">
              We may update these Terms from time to time. When we do, we will update the
              &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of
              the Site after any changes constitutes acceptance of the revised Terms.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="mt-0 font-homeSans text-[16px] font-semibold leading-[1.35] text-dg-ink">
              9. Contact
            </h2>
            <p className="mt-4">
              Questions about these Terms? Contact us at:
            </p>
            <address className="mt-4 not-italic">
              <p className="font-mono text-[13px] leading-[1.8] text-dg-muted">
                {ORG}
                <br />
                {siteConfig.contact.location}
                <br />
                {siteConfig.contact.campus}
                <br />
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-dg-ink underline underline-offset-2 transition-colors hover:text-dg-green"
                >
                  {EMAIL}
                </a>
              </p>
            </address>
          </div>

        </div>
      </div>
    </>
  );
}
