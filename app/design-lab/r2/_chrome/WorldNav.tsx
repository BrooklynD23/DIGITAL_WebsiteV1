import Link from 'next/link';
import { PAGES, href, type PageId, type World } from './routes';
import styles from './chrome.module.css';

/**
 * Shared global nav for both r2 worlds. API: { world, current, sticky?, join? } (world + current unchanged).
 * Signal: 52px instrument strip, sticky by default (`sticky` is a per-WORLD setting: keep it the same on all
 *   Signal pages). Channels carry their CH mark on desktop; at ≤640px the names show and the marks drop.
 *   Join is outlined (line form, never filled). The nav draws no red: the trigger belongs to page content.
 * Apple: a 44px global bar that scrolls away (`sticky` is ignored). Pages with a <LocalNav> pass `join={false}`
 *   so the page shows exactly one Join (the LocalNav's filled CTA).
 * Sibling links use prefetch={false}: a world's heaviest page must not download on every other page.
 */
export function WorldNav({
  world,
  current,
  sticky = true,
  join = true,
}: {
  readonly world: World;
  readonly current: PageId;
  readonly sticky?: boolean;
  readonly join?: boolean;
}) {
  return (
    <header
      className={styles.nav}
      data-chrome="nav"
      data-world-chrome={world}
      data-sticky={world === 'signal' && sticky ? 'true' : undefined}
    >
      <a className={styles.skip} href="#r2-main">
        Skip to content
      </a>
      <nav aria-label="DIGITAL lab" className={styles.inner}>
        {PAGES.map((p) => (
          <Link
            key={p.id}
            href={href(world, p.id)}
            prefetch={false}
            className={p.id === 'home' ? styles.mark : styles.link}
            aria-current={p.id === current ? 'page' : undefined}
          >
            {world === 'signal' && p.channel ? (
              <span className={styles.channel} aria-hidden="true">
                {p.channel}
              </span>
            ) : null}
            <span className={p.channel ? styles.label : undefined}>{p.label}</span>
          </Link>
        ))}
        {join ? (
          <Link className={styles.cta} href={`${href(world, 'home')}#join`} prefetch={false}>
            Join
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
