'use client';

/**
 * <Highlights> — the Apple-world snap strip (breadth without length). Replaces 4 page copies
 * (apple/_home, apple/sidekick, apple/shades, apple/brain inline).
 * Snap-x cards (20px gap, aligned to the 1024 content edge), prev/next 44px buttons that disable at
 * each edge, keyboard scrollable track. No rAF: one passive scroll listener updates edge state.
 * Media is any ReactNode (DotGlyph, glyph, CineClip, image). Copy stays in the page's _content.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Chevron } from './Chevron';
import s from './highlights.module.css';

export interface HighlightItem {
  readonly id: string;
  readonly media?: ReactNode;
  /** Bold lead-in (rendered "Title."). */
  readonly title: string;
  readonly caption: string;
  /** Card surface. 'dark' puts a dark clip/stage in a dark rounded card (data-tone="dark"). Default: the chapter's. */
  readonly tone?: 'dark' | 'light';
}

export interface HighlightsProps {
  readonly items: readonly HighlightItem[];
  /** Section heading (visible). Omit to render the strip only. */
  readonly title?: string;
  readonly id?: string;
  /** Accessible name of the track. Default "Highlights". */
  readonly label?: string;
  readonly className?: string;
}

export function Highlights({ items, title, id = 'highlights', label = 'Highlights', className }: HighlightsProps) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [index, setIndex] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    setEdge((e) => (e.start === start && e.end === end ? e : { start, end }));
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    const i = end ? items.length - 1 : Math.round(el.scrollLeft / Math.max(1, step));
    setIndex(Math.max(0, Math.min(items.length - 1, i)));
  }, [items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const step = (dir: 1 | -1): void => {
    const el = track.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: reduced ? 'auto' : 'smooth' });
  };

  const headingId = `${id}-title`;
  return (
    <section id={id} className={className ? `${s.root} ${className}` : s.root} aria-labelledby={title ? headingId : undefined} aria-label={title ? undefined : label}>
      {title ? (
        <div className={s.inner}>
          <h2 id={headingId} className={s.title}>
            {title}
          </h2>
        </div>
      ) : null}
      <ul ref={track} className={s.track} aria-label={label} tabIndex={0}>
        {items.map((h) => (
          <li key={h.id} className={s.card} data-tone={h.tone}>
            {h.media ? <div className={s.media}>{h.media}</div> : null}
            <p className={s.text}>
              <strong>{h.title}.</strong> {h.caption}
            </p>
          </li>
        ))}
      </ul>
      <div className={`${s.inner} ${s.nav}`}>
        {/* Progress: ink only, never red (the viewport's one red belongs to the page). Decorative; arrows are the control. */}
        <ol className={s.dots} aria-hidden="true">
          {items.map((h, i) => (
            <li key={h.id} data-on={i === index ? 'true' : undefined} />
          ))}
        </ol>
        <button type="button" className={s.btn} onClick={() => step(-1)} disabled={edge.start} aria-label="Previous highlight">
          <Chevron dir="left" />
        </button>
        <button type="button" className={s.btn} onClick={() => step(1)} disabled={edge.end} aria-label="Next highlight">
          <Chevron dir="right" />
        </button>
      </div>
    </section>
  );
}
