'use client';

/**
 * "Coming soon" disclosure in <LocalNav> (desktop; at ≤734px the same links sit in <SectionMenu>).
 * A button with aria-expanded / aria-controls; closes on Escape (focus returns to the button), an outside
 * pointer press, focus leaving the menu, or a link choice. Flat popover on the nav ground: no shadow (DESIGN §11).
 */
import { useEffect, useId, useRef, useState } from 'react';
import { Chevron } from '../_system/ui/Chevron';
import { COMING_SOON } from './club';
import styles from './chrome.module.css';

export function ComingSoon() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      btn.current?.focus();
    };
    const onDoc = (e: PointerEvent): void => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={styles.soon}
      data-open={open ? '' : undefined}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button ref={btn} type="button" className={styles.soonBtn} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {COMING_SOON.label}
        <Chevron dir="down" size={10} />
      </button>
      <ul id={id} className={styles.soonMenu} hidden={!open} onClick={() => setOpen(false)}>
        {COMING_SOON.links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>
              <strong>{l.label}</strong>
              <span>{l.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
