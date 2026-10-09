import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/data/siteConfig';
import { SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { SYSTEM } from '../_content/system';
import l from './legal.module.css';

export interface LegalSection {
  readonly id: string;
  readonly title: string;
  readonly body: ReactNode;
}

/** Above this many sections the page gets a plain in-page link list. */
const TOC_MIN = 7;

/**
 * Frame for /privacy, /terms, /cookies: quiet dark hero (title + date), then one light prose column.
 * The legal text itself lives in each page file and is rendered as given.
 */
export function LegalPage({ title, updated, intro, sections }: {
  readonly title: string;
  readonly updated: string;
  /** Notices that sit above the numbered sections. */
  readonly intro: ReactNode;
  readonly sections: readonly LegalSection[];
}) {
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="legal-title">
        <h1 id="legal-title" className={s.heroTitle}>{title}</h1>
        <p className={s.heroLead}>{SYSTEM.legal.updated} {updated}</p>
      </section>

      <section className={s.section} aria-labelledby="legal-title">
        <div className={`${s.narrow} ${s.prose} ${l.body}`}>
          {intro}
          {sections.length >= TOC_MIN ? (
            <nav className={l.toc} aria-labelledby="legal-toc">
              <h2 id="legal-toc">{SYSTEM.legal.toc}</h2>
              <ol>
                {sections.map((sec) => (
                  <li key={sec.id}><a href={`#${sec.id}`}>{sec.title}</a></li>
                ))}
              </ol>
            </nav>
          ) : null}
          {sections.map((sec) => (
            <section key={sec.id} aria-labelledby={sec.id}>
              <h2 id={sec.id}>{sec.title}</h2>
              {sec.body}
            </section>
          ))}
        </div>
      </section>
    </SitePage>
  );
}

/** The draft notice all three legal pages open with. */
export function DraftNotice() {
  return (
    <div className={l.note}>
      <p><strong>Draft — pending review</strong></p>
      <p>
        This is a starter document and should be reviewed by the organization (and legal
        counsel where appropriate) before being relied upon. It is provided in good faith
        as a reasonable starting point for a non-commercial student engineering club.
      </p>
    </div>
  );
}

/** Postal + email block that closes each legal page. */
export function LegalAddress() {
  const email = siteConfig.contact.email;
  return (
    <address>
      <p>
        {siteConfig.fullName}
        <br />
        {siteConfig.contact.location}
        <br />
        {siteConfig.contact.campus}
        {email ? (
          <>
            <br />
            <a href={`mailto:${email}`}>{email}</a>
          </>
        ) : null}
      </p>
    </address>
  );
}
