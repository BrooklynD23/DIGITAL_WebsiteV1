import Link from 'next/link';
import type { ReactNode } from 'react';
import { SectionMenu } from './SectionMenu';
import styles from './chrome.module.css';

/**
 * Apple-world local product nav: sticky 52px, ONE filled CTA. Place it right after
 * <WorldNav world="apple" current=… join={false} />; the global bar scrolls away and this one sticks at top 0.
 *
 * CTA contract: omit `cta` and every page gets the same pill, LOCAL_CTA = "Join build night" → #join
 * (the page's <JoinChapter>, whose default id is "join"). Pass `cta={null}` only for a page with no join chapter.
 * `utility`: one extra control between the links and the CTA (e.g. SHADES' spacing toggle). It stays visible
 * on mobile. Links collapse into a section menu (chevron disclosure) at ≤734px.
 * The pill is 30px tall inside a 44px hit target. `tone="dark"` matches a dark first chapter.
 */
export const LOCAL_CTA = { label: 'Join build night', href: '#join' } as const;

export interface LocalNavProps {
  readonly title: string;
  readonly titleHref: string;
  readonly links: ReadonlyArray<{ readonly label: string; readonly href: string }>;
  readonly cta?: { readonly label: string; readonly href: string } | null;
  readonly utility?: ReactNode;
  readonly tone?: 'light' | 'dark';
}

export function LocalNav({ title, titleHref, links, cta = LOCAL_CTA, utility, tone = 'light' }: LocalNavProps) {
  return (
    <div className={styles.local} data-chrome="local-nav" data-tone={tone === 'dark' ? 'dark' : undefined}>
      <nav aria-label={`${title} sections`} className={styles.localInner}>
        <Link href={titleHref} className={styles.localTitle} prefetch={false}>
          {title}
        </Link>
        <ul className={styles.localLinks}>
          {links.map((l) => (
            <li key={`${l.label}|${l.href}`}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        {links.length > 0 ? <SectionMenu title={title} links={links} /> : null}
        {utility ? <div className={styles.localUtility}>{utility}</div> : null}
        {cta ? (
          <a className={styles.localCta} href={cta.href}>
            <span className={styles.localPill}>{cta.label}</span>
          </a>
        ) : null}
      </nav>
    </div>
  );
}
