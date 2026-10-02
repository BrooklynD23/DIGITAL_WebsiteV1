import Link from 'next/link';
import { PAGES, href, type PageId, type World } from './routes';
import styles from './chrome.module.css';

// Shared global nav for both r2 worlds. Owner: W1-HOME (may restyle; keep this API stable).
// Page-level local navs (Apple-style product sub-nav) belong to each page.
export function WorldNav({ world, current }: { readonly world: World; readonly current: PageId }) {
  return (
    <header className={styles.nav} data-chrome="nav">
      <a className={styles.skip} href="#r2-main">Skip to content</a>
      <nav aria-label="DIGITAL lab" className={styles.inner}>
        {PAGES.map((p) => (
          <Link
            key={p.id}
            href={href(world, p.id)}
            className={p.id === 'home' ? styles.mark : styles.link}
            aria-current={p.id === current ? 'page' : undefined}
          >
            {world === 'signal' && p.channel ? <span className={styles.channel}>{p.channel}</span> : null}
            {p.label}
          </Link>
        ))}
        <Link className={styles.cta} href={`${href(world, 'home')}#join`}>Join</Link>
      </nav>
    </header>
  );
}
