'use client';

import { useEffect, useRef } from 'react';
import { PhoneSchematic } from './PhoneSchematic';
import { Assignee } from './Chips';
import type { Subsystem } from '../content';
import s from '../e.module.css';

interface PhoneSequenceProps {
  readonly subsystems: readonly Subsystem[];
}

const COMPACT_GAP = 26;
const OPEN_GAP = 66; // = PhoneSchematic GAP
const ENHANCED_QUERY = '(min-width: 960px) and (prefers-reduced-motion: no-preference)';
/** The reading line: 65% down the viewport. A step is active once its top crosses it. */
const LINE = 0.65;

/**
 * DG-001 scroll story. Server HTML = schematic (fully exploded) + 7 readable steps in stack order.
 * Layout is final at first paint (step heights live in a CSS media query), so enhancement never reflows.
 * GSAP loads only when ENHANCED_QUERY matches (nothing runs under reduced motion or on small screens).
 * v2: no ScrollTrigger. Its permanent rAF loop (_rafBugFix) kept the page from ever idling. A paused GSAP
 * timeline is scrubbed from native scroll events instead (Lenis smooths the wheel), one rAF per scroll
 * frame, zero at rest. The stack opens one gap per step, top → back, so the active layer descends with
 * the scroll and the explode itself is the progress indicator.
 */
export function PhoneSequence({ subsystems }: PhoneSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mq = window.matchMedia(ENHANCED_QUERY);
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const enhance = async (): Promise<void> => {
      const { gsap } = await import('gsap');
      if (cancelled || !mq.matches) return;
      root.classList.add(s.seqEnhanced);
      const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
      const layers = Array.from(root.querySelectorAll<SVGGElement>('[data-layer]'));
      const stepsList = root.querySelector<HTMLElement>('[data-steps]');
      const railFill = root.querySelector<HTMLElement>('[data-rail-fill]');
      if (!stepsList) return;
      const byIndex = (i: number) =>
        layers.find((g) => Number(g.dataset.index) === i)?.querySelector<SVGGElement>('[data-shift]') ?? null;

      let activeId = '';
      const setActive = (id: string): void => {
        if (id === activeId) return;
        activeId = id;
        steps.forEach((el) => el.setAttribute('data-active', String(el.dataset.step === id)));
        layers.forEach((el) => el.setAttribute('data-active', String(el.dataset.layer === id)));
      };

      // Paused timeline, rendered synchronously via tl.progress(): no ticker, no ScrollTrigger loop.
      const count = layers.length;
      const shifts = Array.from({ length: count }, (_, i) => byIndex(i));
      shifts.forEach((el, i) => el && gsap.set(el, { y: i * COMPACT_GAP }));
      const tl = gsap.timeline({ paused: true });
      // Segment k opens the gap under layer k: every layer below it moves down by one step.
      for (let k = 0; k < count - 1; k++) {
        const below = shifts.slice(k + 1).filter((el): el is SVGGElement => el !== null);
        tl.to(below, { y: `+=${OPEN_GAP - COMPACT_GAP}`, ease: 'none', duration: 1 }, k);
      }

      let frame = 0;
      const update = (): void => {
        frame = 0;
        const line = window.innerHeight * LINE;
        const box = stepsList.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
        tl.progress(p);
        if (railFill) railFill.style.transform = `scaleY(${p})`;
        let current = steps[0]?.dataset.step ?? '';
        for (const el of steps) if (el.getBoundingClientRect().top <= line) current = el.dataset.step ?? current;
        setActive(current);
      };
      const onScroll = (): void => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
      // Building tweens woke the GSAP ticker; the timeline is paused and rendered by hand, so put it back to sleep.
      gsap.ticker.sleep();

      cleanup = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (frame) cancelAnimationFrame(frame);
        tl.kill();
        shifts.forEach((el, i) => el && el.setAttribute('transform', `translate(0 ${i * OPEN_GAP})`));
        shifts.forEach((el) => el && gsap.set(el, { clearProps: 'transform' }));
        if (railFill) railFill.style.transform = '';
        root.classList.remove(s.seqEnhanced);
        steps.forEach((el) => el.removeAttribute('data-active'));
        layers.forEach((el) => el.removeAttribute('data-active'));
      };
    };

    const onChange = (): void => {
      cleanup?.();
      cleanup = null;
      if (mq.matches) void enhance();
    };
    if (mq.matches) void enhance();
    mq.addEventListener('change', onChange);
    return () => {
      cancelled = true;
      mq.removeEventListener('change', onChange);
      cleanup?.();
    };
  }, [subsystems]);

  return (
    <div ref={rootRef} className={s.dark}>
      <div className={s.seqHead}>
        <p className={s.blockLabel}>Artifact · exploded subsystem map</p>
        <p className={s.body} style={{ color: '#cfd0c9' }}>
          Seven layers, top to back. Each one is a seat with a scope and a risk. Diagram, not a photo: the hardware has
          no published revision yet.
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
                <dl className={s.kv}>
                  <div>
                    <dt>Scope</dt>
                    <dd>{sub.scope}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{sub.risk}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>
                      <Assignee />
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
