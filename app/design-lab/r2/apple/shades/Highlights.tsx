'use client';

/**
 * Highlights strip: breadth without length. Snap-x cards, 20px gap, prev/next buttons (44px).
 * Button state comes from IntersectionObservers on the first and last card (no scroll listener, no rAF).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SHADES, type Highlight } from '../../_content/shades';
import s from './apple.module.css';

const H = SHADES.highlights;

function Art({ id }: { readonly id: Highlight['id'] }): ReactNode {
  switch (id) {
    case 'timing':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artLine} d="M10 120h30v-40h50v40h20v-40h50v40h20v-40h50v40h60" />
          {[40, 110, 180].map((x) => (
            <rect key={x} className={s.artFill} x={x + 8} y={52} width={34} height={8} rx={2} />
          ))}
          <path className={s.artHair} d="M10 140h280" strokeDasharray="2 6" />
        </svg>
      );
    case 'pace':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artHair} d="M40 100h220" />
          {[40, 84, 128, 172, 216, 260].map((x) => (
            <path key={x} className={s.artHair} d={`M${x} 92v16`} />
          ))}
          <path className={s.artLine} d="M40 100h110" />
          <circle className={s.artKnob} cx={150} cy={100} r={13} />
          <text className={s.artMono} x={150} y={62} textAnchor="middle">
            {SHADES.reader.wpm.initial} {SHADES.reader.unit}
          </text>
        </svg>
      );
    case 'type':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <text className={s.artType} x={150} y={104} textAnchor="middle">
            Il1 O0 rn
          </text>
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <rect className={s.artLine} x={22} y={46} width={92} height={60} rx={4} />
          <path className={s.artLine} d="M10 116h116" />
          <path className={s.artDots} d="M126 96C170 96 160 72 206 72" />
          <rect className={s.artLine} x={206} y={52} width={72} height={40} rx={8} />
          <circle className={s.artKnobSmall} cx={228} cy={72} r={5} />
          <circle className={s.artKnobSmall} cx={252} cy={72} r={5} />
        </svg>
      );
    case 'optics':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artDots} d="M20 80h170" />
          <path className={s.artLine} d="M120 30Q140 80 120 130Q100 80 120 30Z" />
          <path className={s.artLine} d="M200 80Q236 52 272 80Q236 108 200 80Z" />
          <circle className={s.artKnobSmall} cx={226} cy={80} r={6} />
          <circle className={s.artAnchor} cx={190} cy={80} r={4} />
        </svg>
      );
    default:
      return null;
  }
}

export function Highlights() {
  const list = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return undefined;
    const first = ul.firstElementChild;
    const last = ul.lastElementChild;
    if (!first || !last) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === first) setAtStart(e.intersectionRatio > 0.9);
          if (e.target === last) setAtEnd(e.intersectionRatio > 0.9);
        }
      },
      { root: ul, threshold: [0, 0.9, 1] },
    );
    io.observe(first);
    io.observe(last);
    return () => io.disconnect();
  }, []);

  const go = (dir: 1 | -1): void => {
    const ul = list.current;
    const card = ul?.firstElementChild as HTMLElement | null;
    if (!ul || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ul.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={s.highlights} aria-labelledby="ap-hl">
      <h2 id="ap-hl" className={`${s.h2} ${s.hlHead}`}>{H.headline}</h2>
      <ul ref={list} className={s.hlList} tabIndex={0} aria-label={H.headline}>
        {H.items.map((h) => (
          <li key={h.id} className={s.hlCard}>
            <Art id={h.id} />
            <div className={s.hlText}>
              <h3 className={s.hlTitle}>{h.title}</h3>
              <p className={s.hlCaption}>
                {h.caption}
                {h.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className={s.hlNav}>
        <button type="button" className={s.hlBtn} onClick={() => go(-1)} disabled={atStart} aria-label={SHADES.labels.prevHighlight}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M14.5 6.5L9 12l5.5 5.5" />
          </svg>
        </button>
        <button type="button" className={s.hlBtn} onClick={() => go(1)} disabled={atEnd} aria-label={SHADES.labels.nextHighlight}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M9.5 6.5L15 12l-5.5 5.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
