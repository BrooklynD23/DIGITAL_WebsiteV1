'use client';

/**
 * Method chapter artifact: clip shades-fixate plays once on entry (CineClip, with its own replay control).
 * Until the clip is rendered, the fallback is the fixate DotStage, which also plays once on entry and then sleeps.
 * Reduced motion: rest pose (one point inside the reticle).
 */
import { useEffect, useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system';
import { CineClip } from '../../_system/cine';
import { SHADES } from '../../_content/shades';

function FixateFallback() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<DotStageHandle>(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.5) return undefined; // already in view: stay at rest
    stage.current?.seek(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          stage.current?.play({ from: 0 });
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} style={{ width: 'min(420px, 80vw)', margin: '0 auto', color: 'var(--r2-ink)' }}>
      <DotStage ref={stage} verb="fixate" size={420} density={2.2} seed={5} anchor duration={2800} label={SHADES.method.fixateLabel} />
    </div>
  );
}

export function FixateClip({ className }: { readonly className?: string }) {
  return <CineClip name="shades-fixate" mode="once" className={className} label={SHADES.method.fixateLabel} fallback={<FixateFallback />} />;
}
