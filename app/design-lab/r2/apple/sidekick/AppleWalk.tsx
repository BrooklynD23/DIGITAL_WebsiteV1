'use client';

import { useEffect, useRef } from 'react';
import { GlyphSeat } from '../../_system';
import { modules } from '../../_content/sidekick';
import { SidekickStack } from '../../_sidekick/Stack';
import s from './sidekick.module.css';

/**
 * The subsystem walk: the open stack holds still beside the list (no scrub; the page's one scrubbed asset is the
 * explode chapter). As each entry reaches the middle of the viewport, its tier lights and the others recede.
 * Discrete state from IntersectionObserver: 0 rAF. Without JS every tier stays at full ink.
 */
export function AppleWalk() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const tiers = Array.from(root.querySelectorAll<HTMLElement>('[data-tier]'));
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-walk]'));
    root.dataset.enhanced = '';
    const set = (id: string): void => {
      tiers.forEach((t) => (t.dataset.active = String(t.dataset.tier === id)));
      items.forEach((it) => (it.dataset.active = String(it.dataset.walk === id)));
    };
    set(modules[0].id);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) set((e.target as HTMLElement).dataset.walk ?? '');
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((it) => io.observe(it));
    return () => {
      io.disconnect();
      delete root.dataset.enhanced;
    };
  }, []);

  return (
    <div ref={rootRef} className={s.walk}>
      <div className={s.walkObject}>
        <div className={s.walkStack}>
          <SidekickStack
            tags={false}
            label="SIDEKICK as a stack of five modules: fingerprint module, sensor module, power carrier, compute module and planned modules"
          />
        </div>
      </div>
      <ol className={s.walkList}>
        {modules.map((m) => (
          <li key={m.id} className={s.walkItem} data-walk={m.id}>
            <h3 className={s.walkName}>{m.name}</h3>
            <p className={s.walkLine}>
              {m.line} <span className={s.walkState}>{m.stateWord}.</span> <span className={s.confirm}>[confirm]</span>
            </p>
            <dl className={s.walkKv}>
              <div>
                <dt>Scope</dt>
                <dd>{m.scope}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{m.risk}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd className={s.walkOwner}>
                  <GlyphSeat size={16} />
                  Unassigned
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
