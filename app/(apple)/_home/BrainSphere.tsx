'use client';

/**
 * BRAIN home sphere, Direction A "Loop" (approved 2026-11-14): 420 dots on a Fibonacci sphere. A wave crosses it while the
 * agent thinks; one dot leaves along a line to a tool slot and returns; its landing starts the next wave. Ink only; the one
 * red (--r2-trigger) is the dot waiting at the approval gate. It runs one rAF loop, only while on screen, visible and not paused.
 */
import { useEffect, useRef } from 'react';
import { drawA, type Ink } from './sphere/draw';
import { STILL, stateAt, type LoopState } from './sphere/timeline';
import s from './brain.module.css';

export function BrainSphere({ label, paused, reduce, onFrame }: {
  readonly label: string; readonly paused: boolean; readonly reduce: boolean; readonly onFrame: (st: LoopState) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0);
  const cb = useRef(onFrame);
  cb.current = onFrame;

  useEffect(() => {
    const cv = ref.current;
    const g = cv?.getContext('2d');
    if (!cv || !g) return;
    let S = 0, dpr = 1, ink: Ink = { ink: '#f5f5f7', trigger: '#d8412f' }, vis = false, raf = 0, last = 0;
    const paint = () => {
      if (!S) return;
      const st = stateAt(clock.current);
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, S, S); g.lineCap = 'round';
      drawA(g, S, clock.current, st, ink);
      g.globalAlpha = 1; g.setLineDash([]);
      cb.current(st);
    };
    const frame = (now: number) => { raf = 0; clock.current += last ? Math.min(now - last, 50) : 16; last = now; paint(); schedule(); };
    const schedule = () => {
      if (raf) return;
      if (paused || reduce || document.hidden || !vis) { last = 0; return; }
      raf = requestAnimationFrame(frame);
    };
    if (reduce) clock.current = STILL;
    const size = () => {
      const w = cv.clientWidth;
      if (!w) return;
      S = w; dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = cv.height = Math.round(w * dpr);
      const cs = getComputedStyle(cv);
      ink = { ink: cs.color, trigger: cs.getPropertyValue('--r2-trigger').trim() || '#d8412f' };
      paint();
    };
    const ro = new ResizeObserver(size); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; schedule(); }); io.observe(cv);
    document.addEventListener('visibilitychange', schedule);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', schedule); };
  }, [paused, reduce]);

  return <canvas ref={ref} className={s.orb} role="img" aria-label={label} />;
}
