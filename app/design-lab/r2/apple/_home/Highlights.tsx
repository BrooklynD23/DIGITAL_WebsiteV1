'use client';

/**
 * Apple world highlights strip: breadth without length. Snap-x cards, prev/next buttons (44px).
 * Card 1 plays the home-stages clip once on entry when the CINE manifest has it; until then the wire rest pose.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { DotGlyph, GlyphNight } from '../../_system';
import { CineClip } from '../../_system/cine';
import { highlights, highlightsHeadline } from '../../_content/home';
import s from './home.module.css';

const MEDIA: Record<string, ReactNode> = {
  stages: (
    <CineClip
      name="home-stages"
      aspect="16x9"
      className={s.cardClip}
      fallback={<DotGlyph verb="wire" size={260} seed="hl-stages" label="Integrate: separate nodes wired into one graph" />}
    />
  ),
  owner: <DotGlyph verb="seat" size={260} seed="hl-owner" anchor label="A ring of seats with one open slot" />,
  venture: <DotGlyph verb="pulse" size={260} seed="hl-venture" label="A handoff: one packet runs from A to B" />,
  night: <GlyphNight size={200} state="idle" label="Build night: a ring of seats, one open" />,
  majors: <DotGlyph verb="orbit" size={260} seed="hl-majors" label="Parts moving on their own orbits" />,
};

export function Highlights() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    return () => el.removeEventListener('scroll', measure);
  }, [measure]);

  const step = (dir: 1 | -1): void => {
    const el = track.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={s.highlights} aria-labelledby="hl-title">
      <div className={s.inner}>
        <h2 id="hl-title" className={s.h2}>{highlightsHeadline}</h2>
      </div>
      <ul ref={track} className={s.cards} aria-label="Highlights">
        {highlights.map((h) => (
          <li key={h.id} className={s.card}>
            <div className={s.cardMedia}>{MEDIA[h.id]}</div>
            <p className={s.cardText}><strong>{h.title}.</strong> {h.caption}</p>
          </li>
        ))}
      </ul>
      <div className={`${s.inner} ${s.cardNav}`}>
        <button type="button" className={s.navBtn} onClick={() => step(-1)} disabled={edge.start} aria-label="Previous highlight">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M10 3.5 5.5 8 10 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className={s.navBtn} onClick={() => step(1)} disabled={edge.end} aria-label="Next highlight">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}
