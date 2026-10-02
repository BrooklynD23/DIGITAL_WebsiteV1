import Link from 'next/link';
import { CLUB } from './club';
import { PAGES, href, type World } from './routes';
import styles from './chrome.module.css';

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
          <li>
            <a href={CLUB.discord} rel="noopener noreferrer" target="_blank">Discord</a>
          </li>
        </ul>
        <p className={styles.meta}>
          <span>Build night · {CLUB.when} · {CLUB.where}</span>
          <span>DIGITAL @ Cal Poly Pomona · design lab, round 2 · not production</span>
        </p>
      </div>
    </footer>
  );
}
