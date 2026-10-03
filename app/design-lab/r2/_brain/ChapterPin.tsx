'use client';

/**
 * <ChapterPin> — one BRAIN chapter as a scroll pin. The first part of the pin is stage-only (headline + stage
 * running its beat: the quiet viewport); elements marked data-late (caption, readout, control, How it works)
 * fade in once pin progress passes `reveal[0]` and stay until the stage has mostly left the screen.
 * Focus inside the chapter always shows them (keyboard users never meet an invisible control).
 * Without JS or under reduced motion there is no pin: everything is visible in normal flow.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion, useScrollProgress } from '../_system';
import s from './pin.module.css';

export function ChapterPin({
  id,
  className,
  stickyClassName,
  tone,
  labelledBy,
  label,
  reveal = [0.55, 2],
  revealNarrow = [0.75, 2],
  onProgress,
  after,
  children,
}: {
  readonly id?: string;
  readonly className?: string;
  readonly stickyClassName?: string;
  readonly tone?: 'dark';
  readonly labelledBy?: string;
  readonly label?: string;
  /** Pin-progress window in which data-late content is shown. */
  readonly reveal?: readonly [number, number];
  /** Narrow screens (≤ 959px, taller pins): the stage-only phase runs longer. */
  readonly revealNarrow?: readonly [number, number];
  readonly onProgress?: (p: number) => void;
  /** In-flow content after the pin (the "How it works" disclosure). */
  readonly after?: ReactNode;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(!reduced), [reduced]);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  const [a, b] = reveal;
  const [na, nb] = revealNarrow;
  const handle = useCallback(
    (p: number) => {
      const el = ref.current;
      const narrow = window.innerWidth <= 959;
      const lo = narrow ? na : a;
      const hi = narrow ? nb : b;
      // after the pin releases, keep them until the stage has mostly left (section bottom above mid-screen)
      const leaving = el ? el.getBoundingClientRect().bottom < window.innerHeight * 0.7 : false;
      if (el) el.dataset.late = p >= lo && p <= hi && !leaving ? 'on' : 'off';
      cb.current?.(p);
    },
    [a, b, na, nb],
  );
  useScrollProgress(ref, { range: 'contain', onProgress: handle, cssVar: false });
  return (
    <section
      ref={ref}
      id={id}
      className={className ? `${s.pin} ${className}` : s.pin}
      data-tone={tone}
      data-pin={on ? 'on' : undefined}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
    >
      <div className={s.track}>
        <div className={stickyClassName ? `${s.sticky} ${stickyClassName}` : s.sticky}>{children}</div>
      </div>
      {after}
    </section>
  );
}
