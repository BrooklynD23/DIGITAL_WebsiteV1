'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhoneSchematic } from './PhoneSchematic';
import s from '../e.module.css';

interface Subsystem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly scope: string;
  readonly risk: string;
}

interface PhoneSequenceProps {
  readonly subsystems: readonly Subsystem[];
}

const COMPACT_GAP = 14;
const ENHANCED_QUERY = '(min-width: 960px) and (prefers-reduced-motion: no-preference)';

/**
 * DG-001 scroll story. Server HTML = schematic (fully exploded) + 7 readable steps.
 * Enhancement (desktop, motion allowed): the stage is CSS-sticky; GSAP ScrollTrigger scrubs the
 * explode from compact to open across the first steps, fills the rail, and marks the active
 * subsystem's step + layer. Lenis (SmoothScroll) feeds ScrollTrigger.update.
 */
export function PhoneSequence({ subsystems }: PhoneSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(ENHANCED_QUERY, () => {
      root.classList.add(s.seqEnhanced);
      const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
      const layers = Array.from(root.querySelectorAll<SVGGElement>('[data-layer]'));
      const stepsList = root.querySelector<HTMLElement>('[data-steps]');
      const railFill = root.querySelector<HTMLElement>('[data-rail-fill]');

      const setActive = (id: string): void => {
        steps.forEach((el) => el.setAttribute('data-active', String(el.dataset.step === id)));
        layers.forEach((el) => el.setAttribute('data-active', String(el.dataset.layer === id)));
      };
      setActive(subsystems[0]?.id ?? '');

      // Explode: layers start stacked tight and separate as the first third of the steps scrolls by.
      const shifts = layers.map((g) => g.querySelector<SVGGElement>('[data-shift]'));
      const explode = gsap.timeline({
        scrollTrigger: { trigger: stepsList, start: 'top 75%', end: 'top 10%', scrub: 0.6 },
      });
      shifts.forEach((el, i) => {
        if (!el) return;
        const idx = Number(layers[i]?.dataset.index ?? 0);
        explode.from(el, { y: idx * COMPACT_GAP, ease: 'none' }, 0);
      });

      if (railFill && stepsList) {
        gsap.to(railFill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: stepsList, start: 'top center', end: 'bottom center', scrub: true },
        });
      }

      steps.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive && el.dataset.step) setActive(el.dataset.step);
          },
        });
      });

      ScrollTrigger.refresh();
      return () => {
        root.classList.remove(s.seqEnhanced);
        steps.forEach((el) => el.removeAttribute('data-active'));
        layers.forEach((el) => el.removeAttribute('data-active'));
      };
    });

    return () => mm.revert();
  }, [subsystems]);

  return (
    <div ref={rootRef} className={s.dark}>
      <div className={s.seqHead}>
        <p className={s.blockLabel}>Artifact · exploded subsystem map</p>
        <p className={s.body} style={{ color: '#cfd0c9' }}>
          Seven layers, seven owners. Each subsystem has a scope, a risk, and a boundary the next team builds against.
          Diagram, not a photo: the hardware has no published revision yet.
        </p>
      </div>
      <div className={s.seqGrid}>
        <div className={s.seqStage}>
          <PhoneSchematic title="DG-001 exploded into its 7 subsystems, from Apps / UX on top to Mechanical / CAD at the back" />
        </div>
        <div className={s.seqStepsWrap}>
          <span className={s.rail} aria-hidden="true">
            <span className={s.railFill} data-rail-fill />
          </span>
          <ol className={s.seqSteps} data-steps>
          {subsystems.map((sub, i) => (
            <li key={sub.id} className={s.step} data-step={sub.id}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              <h4 className={s.stepTitle}>{sub.title}</h4>
              <p className={s.stepDesc}>{sub.description}</p>
              <p className={s.stepMeta}>
                scope: {sub.scope} · risk: {sub.risk} · owner: <span>______ [placeholder]</span>
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
