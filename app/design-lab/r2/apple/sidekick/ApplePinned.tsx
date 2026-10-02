'use client';

import { useEffect, useRef, useState } from 'react';
import { explodeCaptions, modules } from '../../_content/sidekick';
import { CineClip, markerIndex, type CineClipHandle } from '../../_system/cine';
import { useScrollSteps } from '../../_system';
import { SidekickStack } from '../../_sidekick/Stack';
import { cacheStack, markActive, resetStack, type StackCache } from '../../_sidekick/stackFrame';
import s from './sidekick.module.css';

/** Share of the pin given to the scrubbed clip; the rest walks the five modules. */
const CLIP_SHARE = 0.5;
const BEATS = explodeCaptions.length + modules.length;

/**
 * The one pinned chapter, one scrubbed asset. Phase 1 scrubs `sidekick-explode` (the two real boards coming apart)
 * with one caption per clip marker. Phase 2 cross-fades to the module stack, which holds still while one module
 * at a time lights and its caption swaps in place. Static layout (no JS / reduced motion): the clip poster,
 * the stack and every caption in order. Captions are never removed from the accessibility tree.
 */
export function ApplePinned() {
  const pinRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<CineClipHandle>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cache = useRef<StackCache | null>(null);
  const [beat, setBeat] = useState(0);

  const { enhanced } = useScrollSteps(pinRef, {
    count: BEATS,
    onFrame: (p) => {
      const clipP = Math.min(1, p / CLIP_SHARE);
      clipRef.current?.setProgress(clipP);
      const b =
        p < CLIP_SHARE
          ? Math.max(0, markerIndex('sidekick-explode', clipP))
          : explodeCaptions.length + Math.min(modules.length - 1, Math.floor(((p - CLIP_SHARE) / (1 - CLIP_SHARE)) * modules.length));
      setBeat((prev) => (prev === b ? prev : b));
    },
  });

  useEffect(() => {
    const el = stackRef.current?.querySelector<HTMLElement>('[data-stack]');
    if (!el || !enhanced) return undefined;
    const c = cacheStack(el);
    cache.current = c;
    return () => {
      resetStack(c);
      cache.current = null;
    };
  }, [enhanced]);

  const phase = beat >= explodeCaptions.length ? 'modules' : 'clip';
  useEffect(() => {
    if (cache.current) markActive(cache.current, phase === 'modules' ? beat - explodeCaptions.length : -1);
  }, [beat, phase]);

  const captions = [
    ...explodeCaptions.map((c) => ({ key: c, text: c })),
    ...modules.map((m) => ({ key: m.id, text: m.caption })),
  ];

  return (
    <div ref={pinRef} className={s.pinTrack} data-enhanced={enhanced ? '' : undefined} data-phase={enhanced ? phase : undefined}>
      <div className={s.pinStage}>
        <h2 className={s.pinHead} id="teardown-title" data-dim={enhanced && beat > 0 ? 'true' : undefined}>
          Every layer, in order.
        </h2>
        <div className={s.pinMedia}>
          <div className={s.pinClip}>
            <CineClip ref={clipRef} name="sidekick-explode" world="apple" mode="scrub" />
          </div>
          <div ref={stackRef} className={s.pinStack}>
            <SidekickStack label="SIDEKICK inside a phone shell that was never started, as a stack of five modules: fingerprint module, sensor module, power and carrier, compute, planned modules. Every seat is open." />
          </div>
        </div>
        <ol className={s.captions}>
          {captions.map((c, i) => (
            <li key={c.key} className={s.caption} data-active={enhanced ? String(i === beat) : undefined} aria-hidden={enhanced && i !== beat ? true : undefined}>
              <p className={s.captionLine}>
                {c.text} <span className={s.confirm}>[confirm]</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
