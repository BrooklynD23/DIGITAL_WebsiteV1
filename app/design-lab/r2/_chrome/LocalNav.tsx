import Link from 'next/link';
import styles from './chrome.module.css';

/**
 * Apple-world local product nav (sticky 52px, one filled CTA). Optional for any r2 page. Owner: W1-HOME.
 * Place it directly after <WorldNav world="apple" …/>; the global bar scrolls away and this one sticks at top 0.
 * `tone="dark"` matches a dark first chapter.
 */
export interface LocalNavProps {
  readonly title: string;
  readonly titleHref: string;
  readonly links: ReadonlyArray<{ readonly label: string; readonly href: string }>;
  readonly cta: { readonly label: string; readonly href: string };
  readonly tone?: 'light' | 'dark';
}

export function LocalNav({ title, titleHref, links, cta, tone = 'light' }: LocalNavProps) {
  return (
    <div className={styles.local} data-chrome="local-nav" data-tone={tone === 'dark' ? 'dark' : undefined}>
      <nav aria-label={`${title} sections`} className={styles.localInner}>
        <Link href={titleHref} className={styles.localTitle}>{title}</Link>
        <ul className={styles.localLinks}>
          {links.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <a className={styles.localCta} href={cta.href}>{cta.label}</a>
      </nav>
    </div>
  );
}
