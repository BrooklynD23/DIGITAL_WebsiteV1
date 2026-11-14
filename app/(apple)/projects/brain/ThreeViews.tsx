'use client';

/**
 * "One job, three views" (BRAIN, unlocked by the Head Designer 2026-11-14). One example job plays in three spheres on one
 * clock: the loop, the context window, the tools. Ink only; the one red mark is the held call in the Loop sphere.
 * One rAF loop paints the visible canvases; it stops off screen, in a hidden tab, when paused, and under reduced motion.
 * Without JS the server-rendered SVG stills stay (the canvases are hidden until the script runs).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { story, figureExamples } from '../../_content/brain';
import type { HomeJob } from '../../_content/home';
import { C_SAT, drawA, drawB, drawC, fib, levelAt, type Ink } from '../../_home/sphere/draw';
import { CHAR, held, makeTimeline, type LoopState } from '../../_home/sphere/timeline';
import s from './three.module.css';

const { layers } = story;
const DRAW = [drawA, drawB, drawC] as const;
const job: HomeJob = { think: figureExamples.job.thought, tools: figureExamples.job.calls, sec: 0 };
const { stateAt, still } = makeTimeline([job]);

/** The clock in words: what the model is doing now. Changes a few times a second at most while the thought types. */
function clockKey(st: LoopState): string {
  const back = st.phase !== 'tool' || held(st.job.tools[st.ti]) || st.p >= 0.62;
  return [st.phase, st.ti, st.phase === 'think' ? Math.floor(st.u / CHAR) : 0, back].join('|');
}

function Clock({ st }: { readonly st: LoopState }) {
  const tl = st.job.tools;
  const tool = st.phase === 'think' ? null : tl[st.phase === 'tool' ? st.ti : tl.length - 1];
  const back = tool !== null && (st.phase !== 'tool' || held(tool) || st.p >= 0.62);
  const chars = st.phase === 'think' ? Math.floor(st.u / CHAR) : 0;
  return (
    <div className={s.clockText} style={{ opacity: st.phase === 'rest' ? 0.4 : 1 }}>
      {tool === null
        ? <><b>{layers.clock.think}</b><span>{st.job.think.slice(0, chars)}</span></>
        : <><b>{back && !held(tool) ? layers.clock.check : layers.clock.act}</b><span className={s.mono}>{tool[0]} {tool[1]}{back && <> {'→'} <i>{tool[2]}</i></>}</span></>}
    </div>
  );
}

const still3 = fib(150);
/** Server-rendered fallback still for one view: dots, plus the ring (B) or the orbit (C). */
function Still({ i }: { readonly i: number }) {
  const R = i === 2 ? 22 : 40;
  return (
    <svg className={s.still} viewBox="0 0 200 200" aria-hidden="true">
      {still3.map((p, k) => {
        const y = p[1] * Math.cos(0.4) - p[2] * Math.sin(0.4), z = p[1] * Math.sin(0.4) + p[2] * Math.cos(0.4);
        return <circle key={k} cx={(100 + p[0] * R).toFixed(1)} cy={(100 + y * R).toFixed(1)} r={0.9} fill="currentColor" opacity={(0.2 + 0.5 * (z + 1) / 2).toFixed(2)} />;
      })}
      {i === 1 && <><circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeOpacity="0.16" /><circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeOpacity="0.8" strokeDasharray="183 400" transform="rotate(-90 100 100)" /></>}
      {i === 2 && <>
        <ellipse cx="100" cy="100" rx="86" ry="31" transform="rotate(-17 100 100)" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeDasharray="1 4" />
        {C_SAT.map((n, k) => { const a = (k / C_SAT.length) * Math.PI * 2, ex = Math.cos(a) * 86, ey = Math.sin(a) * 31; return <circle key={n} cx={(100 + ex * 0.955 + ey * 0.296).toFixed(1)} cy={(100 - ex * 0.296 + ey * 0.955).toFixed(1)} r="3" fill="none" stroke="currentColor" strokeOpacity="0.5" />; })}
      </>}
    </svg>
  );
}

export function ThreeViews() {
  const cvs = useRef<Array<HTMLCanvasElement | null>>([null, null, null]);
  const [view, setView] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [live, setLive] = useState(false);
  const [st, setSt] = useState<LoopState>(() => stateAt(0));
  const key = useRef('');
  const clock = useRef(0);
  const labelsFor = useMemo(() => layers.views.map((v) => v.alt), []);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(rm.matches); setLive(true);
    const on = () => setReduce(rm.matches);
    rm.addEventListener('change', on);
    return () => rm.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const els = cvs.current.filter((c): c is HTMLCanvasElement => c !== null);
    if (els.length < 3) return;
    const v = els.map((cv) => ({ cv, g: cv.getContext('2d'), S: 0, dpr: 1, on: false, ink: { ink: '#f5f5f7', trigger: '#d8412f' } as Ink }));
    let raf = 0, last = 0;
    const paint = (all: boolean) => {
      const state = stateAt(clock.current);
      v.forEach((x, i) => {
        const g = x.g;
        if (!g || !x.S || !(x.on || all)) return;
        g.setTransform(x.dpr, 0, 0, x.dpr, 0, 0); g.clearRect(0, 0, x.S, x.S); g.lineCap = 'round';
        DRAW[i](g, x.S, clock.current, state, x.ink);
        g.globalAlpha = 1; g.setLineDash([]);
      });
      const k = clockKey(state);
      if (k !== key.current) { key.current = k; setSt(state); }
    };
    const run = () => !paused && !reduce && !document.hidden && v.some((x) => x.on);
    const frame = (now: number) => { raf = 0; clock.current += last ? Math.min(now - last, 50) : 16; last = now; paint(false); schedule(); };
    const schedule = () => { if (raf) return; if (!run()) { last = 0; return; } raf = requestAnimationFrame(frame); };
    if (reduce) clock.current = still;
    const ros = v.map((x) => {
      const ro = new ResizeObserver(() => {
        const w = x.cv.clientWidth;
        if (!w) return;
        x.S = w; x.dpr = Math.min(window.devicePixelRatio || 1, 2); x.cv.width = x.cv.height = Math.round(w * x.dpr);
        const cs = getComputedStyle(x.cv);
        x.ink = { ink: cs.color, trigger: cs.getPropertyValue('--r2-trigger').trim() || '#d8412f' };
        paint(true);
      });
      ro.observe(x.cv);
      return ro;
    });
    const ios = v.map((x) => { const io = new IntersectionObserver(([e]) => { x.on = e.isIntersecting; schedule(); }); io.observe(x.cv); return io; });
    document.addEventListener('visibilitychange', schedule);
    return () => { cancelAnimationFrame(raf); ros.forEach((r) => r.disconnect()); ios.forEach((o) => o.disconnect()); document.removeEventListener('visibilitychange', schedule); };
  }, [paused, reduce]);

  return (
    <section className={s.layers} data-live={live ? '1' : undefined} aria-labelledby="three-views-h">
      <div className={s.head}>
        <h2 className={s.h2} id="three-views-h">{layers.heading}</h2>
        <p className={s.line}>{layers.line}</p>
      </div>
      <div className={s.clock}>
        <Clock st={st} />
        {live && !reduce && (
          <button type="button" className={s.pause} aria-label={paused ? layers.playName : layers.pauseName} onClick={() => setPaused((p) => !p)}>
            {paused ? layers.play : layers.pause}
          </button>
        )}
      </div>
      <div className={s.switch} role="group" aria-label={layers.switchName}>
        {layers.views.map((x, i) => (
          <button key={x.id} type="button" className={s.trackBtn} aria-pressed={view === i} onClick={() => setView(i)}>
            <span className={s.trackDot} /><span>{x.short}</span>
          </button>
        ))}
      </div>
      <div className={s.panels}>
        {layers.views.map((x, i) => (
          <div key={x.id} className={s.panel} data-on={view === i ? '1' : undefined}>
            <canvas ref={(el) => { cvs.current[i] = el; }} className={s.canvas} role="img" aria-label={labelsFor[i]} />
            <Still i={i} />
            <h3 className={s.h3}>{x.topic}</h3>
            <p className={s.cap}>{x.line}</p>
          </div>
        ))}
      </div>
      <p className={s.line}>{layers.compare}</p>
    </section>
  );
}
