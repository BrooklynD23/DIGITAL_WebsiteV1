'use client';

/**
 * BRAIN chapter orb: a voice-mode style canvas orb. `energy` eases toward `target`; `kick` swells it on each tool line.
 * Head Designer exception (2026-10-15): the blue/violet/cyan colours below are literal rgb, outside the --r2-* tokens.
 */
import { useEffect, useRef } from 'react';
import s from './brain.module.css';

export interface OrbState { target: number; kick: number }

const BLOBS = [
  { col: [88, 140, 255], r: 0.95, sp: 0.00032, ph: 0, orb: 0.22, a: 0.55 },
  { col: [140, 115, 255], r: 0.8, sp: -0.00025, ph: 2.1, orb: 0.26, a: 0.45 },
  { col: [80, 200, 230], r: 0.7, sp: 0.00038, ph: 4.2, orb: 0.24, a: 0.4 },
  { col: [225, 235, 255], r: 0.5, sp: -0.00029, ph: 1.0, orb: 0.12, a: 0.3 },
] as const;

export function BrainOrb({ state, label, reduce, active }: { readonly state: React.MutableRefObject<OrbState>; readonly label: string; readonly reduce: boolean; readonly active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const W = c.width, R = W * 0.44, cx = W / 2, cy = W / 2;
    let energy = 0.25, speed = 0, phase = 0, last = 0, raf = 0;
    const draw = (t: number) => {
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      const st = state.current;
      energy += (st.target - energy) * (1 - Math.exp(-dt / 450));
      st.kick *= Math.exp(-dt / 420);
      const k = st.kick, e = Math.min(1.2, energy + k * 0.35);
      speed += (0.6 + e * 1.1 + k * 1.4 - speed) * (1 - Math.exp(-dt / 260));
      phase += dt * speed;
      const pulse = 1 + Math.sin(t * 0.0026) * (0.01 + e * 0.016) + k * 0.035;
      ctx.clearRect(0, 0, W, W);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R * pulse, 0, Math.PI * 2); ctx.closePath();
      ctx.fillStyle = '#0a1230'; ctx.fill(); ctx.clip();
      ctx.globalCompositeOperation = 'screen';
      for (const b of BLOBS) {
        const a = phase * b.sp + b.ph;
        const x = cx + Math.cos(a) * R * b.orb, y = cy + Math.sin(a) * R * b.orb * 0.8;
        const rr = R * b.r * (0.95 + e * 0.08);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        const col = b.col.join(',');
        g.addColorStop(0, `rgba(${col},${b.a * (0.75 + e * 0.25)})`);
        g.addColorStop(0.6, `rgba(${col},${b.a * 0.25})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
      }
      ctx.restore();
      const rim = ctx.createRadialGradient(cx, cy, R * pulse * 0.82, cx, cy, R * pulse * 1.06);
      rim.addColorStop(0, 'rgba(160,190,255,0)');
      rim.addColorStop(0.8, `rgba(160,190,255,${0.08 + e * 0.06})`);
      rim.addColorStop(1, 'rgba(160,190,255,0)');
      ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * pulse * 1.06, 0, Math.PI * 2); ctx.fill();
      if (!reduce && active && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const onVis = () => { if (!document.hidden && !reduce && active) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    raf = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [state, reduce, active]);
  return <canvas ref={ref} width={600} height={600} className={s.orb} role="img" aria-label={label} />;
}
