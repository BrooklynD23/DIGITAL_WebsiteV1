'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './gallery.module.css';

export interface TabItem {
  readonly id: string;
  readonly letter: string;
  readonly name: string;
}

interface Props {
  readonly items: readonly TabItem[];
  /** Server-rendered panels, same order as `items`. */
  readonly panels: readonly ReactNode[];
}

/**
 * Progressive enhancement: the server (and a no-JS visitor) gets a list of in-page links and every panel stacked.
 * After hydration it becomes an ARIA tablist (roving tabindex, arrows/Home/End, automatic activation) that shows
 * one panel at a time and keeps #a … #f in the URL so each concept is deep-linkable.
 */
export default function GalleryTabs({ items, panels }: Props) {
  const [enhanced, setEnhanced] = useState(false);
  const [selected, setSelected] = useState(items[0]?.id ?? '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const barRef = useRef<HTMLDivElement | null>(null);

  const fromHash = useCallback((): string | undefined => {
    const id = window.location.hash.slice(1).toLowerCase();
    return items.some((i) => i.id === id) ? id : undefined;
  }, [items]);

  useEffect(() => {
    setEnhanced(true);
    const initial = fromHash();
    if (initial) {
      setSelected(initial);
      // Panels above the target collapse on enhancement, so re-anchor on the switcher.
      requestAnimationFrame(() => barRef.current?.scrollIntoView({ block: 'start' }));
    }
    const onHash = () => {
      const id = fromHash();
      if (id) {
        setSelected(id);
        barRef.current?.scrollIntoView({ block: 'start' });
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [fromHash]);

  const select = (id: string, focus: boolean) => {
    setSelected(id);
    try {
      window.history.replaceState(null, '', `#${id}`);
    } catch {
      /* history can be unavailable in sandboxed previews; switching still works */
    }
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = next[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(items[target].id, true);
  };

  return (
    <>
      <div className={styles.switcher} ref={barRef}>
        {enhanced ? (
          <div role="tablist" aria-label="Concepts" className={styles.tabs}>
            {items.map((item, i) => {
              const isSel = item.id === selected;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[item.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={isSel}
                  aria-controls={item.id}
                  tabIndex={isSel ? 0 : -1}
                  className={styles.tab}
                  onClick={() => select(item.id, false)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className={styles.tabLetter}>{item.letter}</span>
                  <span className={styles.tabName}>{item.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <nav aria-label="Concepts">
            <ul className={styles.tabs}>
              {items.map((item) => (
                <li key={item.id}>
                  <a className={styles.tab} href={`#${item.id}`}>
                    <span className={styles.tabLetter}>{item.letter}</span>
                    <span className={styles.tabName}>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className={styles.switchHint}>
          {enhanced ? 'Arrow keys switch concepts. Each one has its own link (#a … #f).' : 'All six concepts are listed below.'}
        </p>
      </div>
      {items.map((item, i) => (
        <section
          key={item.id}
          id={item.id}
          className={styles.panel}
          role={enhanced ? 'tabpanel' : undefined}
          aria-labelledby={enhanced ? `tab-${item.id}` : `${item.id}-title`}
          tabIndex={enhanced ? 0 : undefined}
          hidden={enhanced && item.id !== selected}
        >
          {panels[i]}
        </section>
      ))}
    </>
  );
}
