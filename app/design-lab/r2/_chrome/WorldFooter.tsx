import Link from 'next/link';
import { PAGES, href, type World } from './routes';
import styles from './chrome.module.css';

// Shared footer for both r2 worlds. Owner: W1-HOME (may restyle; keep this API stable).
export function WorldFooter({ world }: { readonly world: World }) {
  return (
    <footer className={styles.footer} data-chrome="footer">
      <div className={styles.inner}>
        <p className={styles.thesis}>Make something worth putting your name on.</p>
        <ul className={styles.footLinks}>
          {PAGES.map((p) => (
            <li key={p.id}><Link href={href(world, p.id)}>{p.label}</Link></li>
          ))}
        </ul>
        <p className={styles.meta}>Build night · Thursdays 6:00 PM · Building 17, Room 1635 · Design lab, round 2 · not production</p>
      </div>
    </footer>
  );
}
