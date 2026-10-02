'use client';

/**
 * Signal hero object: the fixate dot field converging once onto the graticule's centre crosshair.
 * Plays a single pass after first paint (no loop), then sleeps at its rest pose. Reduced motion: rest pose only.
 */
import { useEffect, useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system';
import { SHADES } from '../../_content/shades';

export function HeroStage({ className }: { readonly className?: string }) {
  const ref = useRef<DotStageHandle>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = window.setTimeout(() => ref.current?.play({ from: 0 }), 120);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className={className}>
      <DotStage ref={ref} verb="fixate" size={560} density={2.4} seed={2} anchor duration={1800} label={SHADES.method.fixateLabel} />
    </div>
  );
}
