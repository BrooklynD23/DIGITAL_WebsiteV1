'use client';

import { useEffect, useRef, useState } from 'react';
import { explodeCaptions } from '../../_content/sidekick';
import { BoardSvg, getBoard } from '../../_system/boards';
import { CineClip, CINE } from '../../_system/cine';
import { onceTick, progressOf } from '../../_system';
import s from './sidekick.module.css';

const CLIP = CINE['sidekick-explode'];

/**
 * The one scrubbed asset on the page: a pinned chapter where the two real boards separate into their layers,
 * one caption per layer. Plays the `sidekick-explode` clip when the manifest marks it ready; until then the
 * same boards come apart in code (BoardSvg layers moved by a CSS variable, no re-render per frame).
 * Static (no JS / reduced motion): the boards fully separated, every caption listed below.
 */
export function ApplePinned() {
  const trackRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const [clipP, setClipP] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setEnhanced(true);
    let cancel: (() => void) | null = null;
    let lastActive = -1;
    const update = (): void => {
      cancel = null;
      const p = progressOf(track.getBoundingClientRect(), window.innerHeight, 'contain');
      const a = Math.min(explodeCaptions.length - 1, Math.floor(p * explodeCaptions.length));
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      if (CLIP.ready) setClipP(Math.round(p * 500) / 500);
      else artRef.current?.style.setProperty('--e', Math.min(1, p * 1.25).toFixed(3));
    };
    const onScroll = (): void => {
      if (!cancel) cancel = onceTick(update);
    };
    let attached = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting;
        if (on === attached) return;
        attached = on;
        if (on) window.addEventListener('scroll', onScroll, { passive: true });
        else window.removeEventListener('scroll', onScroll);
        onScroll();
      },
      { rootMargin: '25% 0px' },
    );
    io.observe(track);
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancel?.();
    };
  }, []);

  const fallback = (
    <div ref={artRef} className={s.explodeArt} data-static={enhanced ? undefined : ''}>
      <BoardSvg board={getBoard('zynq-carrier-power')} iso stableFrame={false} className={s.explodeCarrier} />
      <BoardSvg board={getBoard('fingerprint')} iso stableFrame={false} className={s.explodeFp} />
    </div>
  );

  return (
    <div ref={trackRef} className={s.pinTrack} data-enhanced={enhanced ? '' : undefined}>
      <div className={s.pinStage}>
        <h2 className={s.pinHead} id="teardown-title" data-hide={enhanced && active > 0 ? 'true' : undefined}>
          Every layer, in order.
        </h2>
        <div className={s.pinMedia}>
          <CineClip name="sidekick-explode" mode="scrub" progress={clipP} fallback={fallback} aspect="16x9" />
        </div>
        <ol className={s.captions}>
          {explodeCaptions.map((c, i) => (
            <li key={c} className={s.caption} data-active={enhanced ? String(i === active) : undefined}>
              <p className={s.captionLine}>
                {c} <span className={s.confirm}>[confirm]</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
