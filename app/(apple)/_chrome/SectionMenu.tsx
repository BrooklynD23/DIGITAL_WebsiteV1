'use client';

/**
 * Mobile section menu for <LocalNav> (shown at ≤734px only). A native <details> disclosure, so it works
 * without JS; with JS it also closes on link choice, Escape and an outside click. 44px summary target.
 */
import { useEffect, useRef } from 'react';
import { Chevron } from '../_system/ui/Chevron';
import styles from './chrome.module.css';

export function SectionMenu({
  title,
  links,
}: {
  readonly title: string;
  readonly links: ReadonlyArray<{ readonly label: string; readonly href: string }>;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const close = (): void => {
      if (el.open) el.open = false;
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && el.open) {
        close();
        el.querySelector('summary')?.focus();
      }
    };
    const onDoc = (e: PointerEvent): void => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, []);
  return (
    <details ref={ref} className={styles.menu}>
      <summary className={styles.menuBtn} aria-label={`${title} sections`}>
        <Chevron dir="down" size={14} />
      </summary>
      <ul className={styles.menuList} onClick={() => ref.current && (ref.current.open = false)}>
        {links.map((l) => (
          <li key={`${l.label}|${l.href}`}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </details>
  );
}
