'use client';

/** BRAIN chapter visual: the orb over the readout. Animation runs only while on screen. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AgentReadout } from './AgentReadout';
import { BrainOrb, type OrbState } from './BrainOrb';
import s from './brain.module.css';

export function BrainVisual({ label, className }: { readonly label: string; readonly className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<OrbState>({ target: 0.25, kick: 0 });
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(false);
  const onKick = useCallback(() => { state.current.kick = 1; }, []);
  const onTarget = useCallback((v: number) => { state.current.target = v; }, []);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = root.current;
    if (!el) return;
    let inView = false;
    const sync = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    document.addEventListener('visibilitychange', sync);
    io.observe(el);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return (
    <div ref={root} className={`${s.wrap} ${className ?? ''}`}>
      <BrainOrb state={state} label={label} reduce={reduce} active={active} />
      <AgentReadout reduce={reduce} active={active} onKick={onKick} onTarget={onTarget} />
    </div>
  );
}
