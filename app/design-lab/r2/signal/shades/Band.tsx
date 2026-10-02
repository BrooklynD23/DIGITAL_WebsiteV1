'use client';

/**
 * Signal light-path teardown band: a sticky diagram strip over the six stages. The stage crossing the
 * reading line lights the ray up to its station (IntersectionObserver, no scroll listener, no rAF).
 * Before the list is reached, and without JS, every station is lit (the full path).
 */
import { useEffect, useRef, useState } from 'react';
import { SHADES } from '../../_content/shades';
import { LightPath } from '../../_shades/LightPath';
import s from './signal.module.css';

const L = SHADES.lightPath;

export function Band() {
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-stage]') ?? []);
    if (!items.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stage));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="light-path" className={s.band} aria-labelledby="sh-light">
      <header className={s.bandHead}>
        <h2 id="sh-light" className={s.h2}>{L.headline}</h2>
        <p className={s.lead}>{L.lead}</p>
      </header>
      <div className={s.bandStrip}>
        <LightPath mode="step" active={active} layout="h" className={s.bandFigure} />
      </div>
      <ol ref={list} className={s.stages}>
        {L.stages.map((st, i) => (
          <li key={st.id} data-stage={i} data-active={active === i ? 'true' : undefined} className={s.stage}>
            <span className={s.stageN} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className={s.stageBody}>
              <h3 className={s.h3}>{st.name}</h3>
              <p className={s.body}>
                {st.caption}
                {st.confirm ? <> <span className={s.confirm}>{SHADES.confirmTag}</span></> : null}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
