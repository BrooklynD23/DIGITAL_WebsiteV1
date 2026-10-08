import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';
import { DraftNotice, LegalAddress, LegalPage, type LegalSection } from '../_legal/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Use — DIGITAL @ Cal Poly Pomona',
  description:
    'Terms governing your use of the DIGITAL @ Cal Poly Pomona website.',
};

const LAST_UPDATED = 'June 19, 2026';
const ORG = siteConfig.fullName;

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: (
      <>
        <p>
          By accessing or using the website at <a href={siteConfig.url}>{siteConfig.url}</a>{' '}
          (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use
          (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Site.
        </p>
        <p>
          The Site is operated by {ORG} (&ldquo;DIGITAL,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a non-commercial student engineering
          organization affiliated with Cal Poly Pomona.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    title: '2. Use of the Site',
    body: (
      <>
        <p>
          You may use the Site for lawful, personal, and informational purposes. You
          agree not to:
        </p>
        <ul>
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
          <li>Use the Site to transmit spam, malware, or any other harmful content.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: '3. Intellectual Property',
    body: (
      <>
        <h3>3a. Organization Content</h3>
        <p>
          All text, graphics, logos, images, and other content on the Site that was
          created by or for {ORG} (&ldquo;Organization Content&rdquo;) is owned by or
          licensed to DIGITAL and is protected by applicable copyright and intellectual
          property laws. You may not reproduce, distribute, or create derivative works
          from Organization Content without prior written permission from DIGITAL.
        </p>
        <h3>3b. Open-Source Projects</h3>
        <p>
          DIGITAL develops open-source software projects that are published on GitHub.
          Those projects are governed by their respective open-source licenses (e.g., MIT,
          Apache 2.0) as stated in each repository&rsquo;s <code>LICENSE</code> file.
          Nothing in these Terms restricts rights granted to you under those separate
          open-source licenses.
        </p>
        <h3>3c. Third-Party Content</h3>
        <p>
          The Site may reference or link to third-party content, trademarks, and brands
          (e.g., Cal Poly Pomona, Project Hatchery) for identification and informational
          purposes only. Such references do not constitute an endorsement and all
          third-party marks remain the property of their respective owners.
        </p>
      </>
    ),
  },
  {
    id: 'warranties',
    title: '4. Disclaimer of Warranties',
    body: (
      <p>
        THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE
        FULLEST EXTENT PERMITTED BY LAW, DIGITAL DISCLAIMS ALL WARRANTIES, INCLUDING
        BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
        UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '5. Limitation of Liability',
    body: (
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DIGITAL,
        ITS OFFICERS, MEMBERS, VOLUNTEERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR
        RELATED TO YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES. IN ANY CASE, OUR AGGREGATE LIABILITY TO YOU FOR
        ALL CLAIMS SHALL NOT EXCEED ONE HUNDRED DOLLARS (USD $100).
      </p>
    ),
  },
  {
    id: 'external-links',
    title: '6. External Links',
    body: (
      <p>
        The Site contains links to third-party websites (including GitHub, LinkedIn,
        Discord, and Notion). These links are provided for convenience and informational
        purposes only. We do not control those sites and are not responsible for their
        content, privacy practices, or availability. Linking does not imply our
        endorsement of those sites or their operators.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '7. Governing Law',
    body: (
      <p>
        These Terms shall be governed by and construed in accordance with the laws of
        the State of California, USA, without regard to conflict-of-law principles.{' '}
        <span>[To be confirmed by the organization.]</span>{' '}
        Any disputes arising under these Terms shall be subject to the exclusive
        jurisdiction of the courts located in Los Angeles County, California.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '8. Changes to These Terms',
    body: (
      <p>
        We may update these Terms from time to time. When we do, we will update the
        &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of
        the Site after any changes constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact',
    body: (
      <>
        <p>Questions about these Terms? Contact us at:</p>
        <LegalAddress />
      </>
    ),
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" updated={LAST_UPDATED} intro={<DraftNotice />} sections={SECTIONS} />;
}
