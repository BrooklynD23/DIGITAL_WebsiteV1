import Link from 'next/link';
import { IconBrandDiscord, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';
import { CLUB, LINKS } from './club';
import { LEGAL_PAGES, PAGES, SITE_PAGES, href, type World } from './routes';
import styles from './chrome.module.css';

/** Social links as line icons (Tabler outline, 1.5 stroke: the same weight as the page's line art). Each has a text name for screen readers. */
const SOCIAL = [
  { label: 'Discord', href: CLUB.discord, Icon: IconBrandDiscord },
  { label: 'Instagram', href: LINKS.instagram, Icon: IconBrandInstagram },
  { label: 'LinkedIn', href: LINKS.linkedin, Icon: IconBrandLinkedin },
  { label: 'GitHub', href: LINKS.github, Icon: IconBrandGithub },
] as const;

// Shared footer for both r2 worlds. Owner: W1-HOME (refined W3a). Exported API is stable: { world }. Facts from ./club.
export function WorldFooter({ world }: { readonly world: World }) {
  return (
    <footer className={styles.footer} data-chrome="footer" data-world-chrome={world}>
      <div className={styles.footInner}>
        <p className={styles.thesis}>Make something worth putting your name on.</p>
        <ul className={styles.footLinks}>
          {PAGES.map((p) => (
            <li key={p.id}>
              <Link href={href(world, p.id)} prefetch={false}>
                {world === 'signal' && p.channel ? <span className={styles.channel}>{p.channel}</span> : null}
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Rows two and three: every other page, so nothing is reachable by URL only. */}
        {[SITE_PAGES, LEGAL_PAGES].map((row, i) => (
          <ul key={row[0].href} className={`${styles.footLinks} ${i === 0 ? styles.footSite : styles.footLegal}`}>
            {row.map((p) => (
              <li key={p.href}>
                <Link href={p.href} prefetch={false}>{p.label}</Link>
              </li>
            ))}
          </ul>
        ))}
        <ul className={styles.footSocial} aria-label="DIGITAL elsewhere">
          {SOCIAL.map(({ label, href: url, Icon }) => (
            <li key={label}>
              <a href={url} rel="noopener noreferrer" target="_blank" aria-label={label} title={label}>
                <Icon size={22} stroke={1.5} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.meta}>
          <span>Build night · {CLUB.when} · {CLUB.where}</span>
          <span>DIGITAL @ Cal Poly Pomona</span>
        </p>
      </div>
    </footer>
  );
}
