'use client';

import { useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system/dots/DotStage';
import { useScrollDrive } from '../../_system/dots/drive';
import { useScrollProgress } from '../../_system/tokens/scroll';
import s from '../system.module.css';

/**
 * Two scroll paths on one pin:
 *  - the canvas explode is driven from JS (useScrollDrive → setProgress, one draw per scroll frame)
 *  - the rail reads --p from the CSS view() timeline (no JS at all where supported; JS fallback otherwise)
 */
export function ScrollDemo() {
  const cssRef = useRef<HTMLElement>(null);
  const jsRef = useRef<HTMLDivElement>(null);
  const stage = useRef<DotStageHandle>(null);
  const out = useRef<HTMLOutputElement>(null);

  useScrollProgress(cssRef, { range: 'contain' });
  useScrollDrive(jsRef, stage, {
    range: 'contain',
    cssVar: '--pjs',
    onProgress: (p) => {
      if (out.current) out.current.textContent = p.toFixed(3);
    },
  });

  return (
    <section ref={cssRef} className={s.scrollTall} aria-labelledby="scroll-drive">
      <div ref={jsRef} className={s.scrollFill}>
        <div className={s.scrollPin}>
          <div className={s.scrollStage}>
            <DotStage ref={stage} verb="explode" layers={7} size={420} t={0} label="Seven layers separating as you scroll" />
          </div>
          <div className={s.scrollText}>
            <h2 id="scroll-drive" className={s.h2}>
              Scroll is the timebase
            </h2>
            <p className={s.body}>
              Progress through this pin drives <code>explode</code>. Nothing runs while the page is still.
            </p>
            <p className={s.readout}>
              <span className={s.monoLabel}>JS drive p</span> <output ref={out}>0.000</output>
            </p>
            <div className={s.rail} aria-hidden="true">
              <span className={s.railFill} />
            </div>
            <p className={s.small}>Rail: CSS view() timeline writes --p (JS fallback where unsupported).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
