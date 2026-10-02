import Link from 'next/link';
import { PAGES, href, type PageId, type World } from './routes';
import styles from './chrome.module.css';

// Shared global nav for both r2 worlds. Owner: W1-HOME. Exported API is stable: { world, current }.
// Signal: sticky 52px instrument strip; channels carry their CH mark; Join is outlined (the red trigger belongs to page content, one per viewport).
// Apple: a 44px global bar that scrolls away; pages add the sticky <LocalNav> (./LocalNav) with the one filled CTA.
export function WorldNav({ world, current }: { readonly world: World; readonly current: PageId }) {
  return (
    <header className={styles.nav} data-chrome="nav" data-world-chrome={world}>
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
            <span className={p.channel ? styles.label : undefined}>{p.label}</span>
          </Link>
        ))}
        <Link className={styles.cta} href={`${href(world, 'home')}#join`}>
          Join
        </Link>
      </nav>
    </header>
  );
}
