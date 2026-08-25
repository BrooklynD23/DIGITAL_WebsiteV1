'use client';

import { useEffect, useRef } from 'react';

/**
 * Progressive-enhancement cursor (ui-revision 05 §4).
 *
 * A `+` crosshair point plus a 28px lagging hairline ring — the landing's own
 * registration glyph. Mounts ONLY when every eligibility gate holds
 * (`any-hover: hover` + `pointer: fine`, JS live, motion allowed); the site is
 * fully functional if this component is deleted.
 *
 * Behaviour contract:
 * - Native cursor hides only AFTER the replacement has painted one frame.
 * - Listeners attach once here; targets resolve via `closest()` per frame, so
 *   route changes add zero listeners.
 * - Form fields (`input, textarea, select`) restore the native I-beam.
 * - Dark bands flip the ink to cream via the `bg-dg-dark` class marker.
 * - `pointer-events: none`, `aria-hidden`, never the sole interactivity cue.
 */

const POINT_SIZE = 5;
const RING_SIZE = 28;
const RING_LERP = 0.22;

export default function CursorProvider() {
  const pointRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Eligibility gates — all must hold, or nothing mounts.
    const fineHover = window.matchMedia('(any-hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fineHover.matches || reduceMotion.matches) return;
    if (!pointRef.current || !ringRef.current) return;

    const point = pointRef.current;
    const ring = ringRef.current;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;
    let visible = false;

    const setTransform = (el: HTMLDivElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // Paint once before hiding the native cursor.
    setTransform(point, mouseX, mouseY);
    setTransform(ring, mouseX, mouseY);
    point.style.opacity = '1';
    ring.style.opacity = '1';
    document.documentElement.style.cursor = 'none';

    const tick = () => {
      ringX += (mouseX - ringX) * RING_LERP;
      ringY += (mouseY - ringY) * RING_LERP;
      setTransform(point, mouseX - POINT_SIZE / 2, mouseY - POINT_SIZE / 2);
      setTransform(ring, ringX - RING_SIZE / 2, ringY - RING_SIZE / 2);

      // Target resolution via closest() — no per-route listeners.
      const target = document.elementFromPoint(mouseX, mouseY);
      const interactive = target?.closest(
        'a[href], button, [role="button"], summary'
      );
      const field = target?.closest('input, textarea, select');
      const inverse = target?.closest('[class*="bg-dg-dark"], [style*="#0A0C0A"]');

      const scale = interactive ? 1.4 : 1;
      ring.style.width = `${RING_SIZE * scale}px`;
      ring.style.height = `${RING_SIZE * scale}px`;
      ring.style.borderColor = inverse
        ? 'rgba(242, 240, 232, 0.55)'
        : 'var(--ds-border-strong)';
      point.style.background = inverse ? '#F2F0E8' : 'var(--dg-ink)';

      // Fields win: restore the native precision cursor.
      const hideCustom = Boolean(field);
      document.documentElement.style.cursor = hideCustom ? '' : 'none';
      point.style.opacity = hideCustom ? '0' : '1';
      ring.style.opacity = hideCustom ? '0' : '1';

      rafId = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        point.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      point.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.cancelAnimationFrame(rafId);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={pointRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: POINT_SIZE,
          height: POINT_SIZE,
          background: 'var(--dg-ink)',
          opacity: 0,
          zIndex: 'var(--ds-z-cursor)' as unknown as number,
          pointerEvents: 'none',
          willChange: 'transform',
          clipPath:
            'polygon(40% 0, 60% 0, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0 60%, 0 40%, 40% 40%)',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          border: '1px solid var(--ds-border-strong)',
          borderRadius: '50%',
          opacity: 0,
          zIndex: 'var(--ds-z-cursor)' as unknown as number,
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 160ms ease-out, height 160ms ease-out',
        }}
      />
    </>
  );
}
