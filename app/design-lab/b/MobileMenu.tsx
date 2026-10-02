'use client';

import { useEffect, useRef } from 'react';
import s from './b.module.css';

interface Props {
  readonly label: string;
  readonly links: readonly { readonly code: string; readonly label: string; readonly href: string }[];
  readonly cta: { readonly label: string; readonly href: string };
}

/**
 * <details> disclosure: works without JS. With JS it also closes on Escape
 * (focus returns to the summary) and after a link is chosen.
 */
export function MobileMenu({ label, links, cta }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  return (
    <details ref={ref} className={s.menu}>
      <summary className={s.menuSummary}>{label}</summary>
      <nav aria-label="Concept B, mobile" className={s.menuPanel}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className={s.menuLink} onClick={close}>
            <span className={s.navCode}>{l.code}</span>
            {l.label}
          </a>
        ))}
        <a href={cta.href} className={`${s.btn} ${s.btnPrimary}`} onClick={close}>
          {cta.label}
        </a>
      </nav>
    </details>
  );
}
