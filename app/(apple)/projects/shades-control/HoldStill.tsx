'use client';

/**
 * "Hold still": the one control. A typeset page (the site's own copy, set live) above a native range input with
 * five named steps. Each step is a pose of the same words; the slider picks the step, one anime.js tween plays it
 * (900 ms per step, inOut(3), DESIGN.md §10/§14). On landing, the red fixation point plays that step's jumps once
 * (one jump = 120 ms snap) and leaves the drawn scanpath at rest. At Hold the dot does not move: the word turns
 * HUD green (120 ms colour snap) and holds.
 *
 * The Page pose IS the browser's own layout: words stay in normal flow and every later pose is a transform delta
 * from that flow position, so the server HTML is the Page still and hydration moves nothing.
 * Reduced motion: poses snap, the whole scanpath is drawn at once. No JS: hidden by CSS, the five-frame still shows.
 * 0 rAF at rest. No per-frame React state.
 */
import { animate, type JSAnimation } from 'animejs';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../_system';
import { control } from '../../_content/shades-control';
import { pivotIndex, splitWord } from '../../_shades/rsvp';
import { FOCUS, WORDS } from './words';
import s from './control.module.css';

const STEPS = control.steps;
const LAST = STEPS.length - 1;
const MS_PER_STEP = 900; // DESIGN.md §14 stage playback (900–1200 ms), same as BRAIN
const HOP_MS = 120; // --r2-dur-snap
const GHOST = 0.08; // the page around the line: still there, barely

interface Box { x: number; y: number; w: number; h: number }
interface Pose { dx: number; dy: number; o: number; sc: number }
interface Pt { x: number; y: number }
interface Fix extends Pt { r: number }
interface Geo {
  w: number;
  h: number;
  fs: number;
  lh: number;
  boxes: Box[];
  pivot: number; // pivot centre, relative to the focus word's left edge
  poses: Pose[][]; // [step][word]
  fix: Fix[][]; // [step] fixation sequence, at that step's pose
  hops: Hop[][]; // [step] the jump into each fixation
  rest: Pt[]; // [step] where the dot rests
  hold: { x: number; top: number; bottom: number };
}

const bare = (w: string): number => w.replace(/[^A-Za-z0-9]/g, '').length;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/* ------------------------------------------------------------------ geometry: five poses from one measured layout */

function build(w: number, h: number, inner: number, fs: number, lh: number, boxes: Box[], pivot: number): Geo {
  const F = FOCUS;
  const n = boxes.length;
  const C = { x: w / 2, y: h / 2 };
  const fb = boxes[F];
  const cy = (b: Box): number => b.y + b.h / 2;
  // gap between two words set on one line (the face's own space)
  let space = fs * 0.26;
  for (let i = 1; i < n; i += 1) if (boxes[i].y === boxes[i - 1].y) { space = boxes[i].x - boxes[i - 1].x - boxes[i - 1].w; break; }

  // The line: words ending on the held word, as many as fit one line of the box.
  let k = F;
  let span = fb.w;
  while (k > 0 && span + space + boxes[k - 1].w <= inner * 0.94) { k -= 1; span += space + boxes[k].w; }
  k = Math.min(k, F - 2);
  const inLine = (i: number): boolean => i >= k && i <= F;
  const lineX: number[] = [];
  let x = C.x - span / 2;
  for (let i = k; i <= F; i += 1) { lineX[i] = x; x += boxes[i].w + space; }
  const P0 = F - 2;
  const phraseShift = C.x - (lineX[P0] + (lineX[F] + fb.w - lineX[P0]) / 2);
  const push = (b: Box, f: number): number => (cy(b) < C.y - 1 ? -1 : 1) * lh * f;

  const sc = Math.min(2, Math.max(1.25, 46 / fs));
  const focusDx = C.x - (fb.x + pivot);
  const focusDy = C.y - cy(fb);

  const page: Pose[] = boxes.map(() => ({ dx: 0, dy: 0, o: 1, sc: 1 }));
  const line: Pose[] = boxes.map((b, i) =>
    inLine(i) ? { dx: lineX[i] - b.x, dy: C.y - cy(b), o: 1, sc: 1 } : { dx: 0, dy: push(b, 0.9), o: b.y === fb.y ? 0 : GHOST, sc: 1 },
  );
  const phrase: Pose[] = boxes.map((b, i) =>
    inLine(i)
      ? { dx: lineX[i] + phraseShift - b.x, dy: C.y - cy(b), o: i >= P0 ? 1 : 0.16, sc: 1 }
      : { dx: 0, dy: push(b, 1.3), o: 0, sc: 1 },
  );
  // Collapse: every neighbour is pulled toward the one point (k = 0.42 at Word, 0 at Hold) as it fades.
  const toward = (b: Box, i: number, kk: number, o: number, s2: number): Pose => {
    const p = phrase[i];
    const px = b.x + b.w / 2 + p.dx;
    const py = cy(b) + p.dy;
    return { dx: C.x + (px - C.x) * kk - (b.x + b.w / 2), dy: C.y + (py - C.y) * kk - cy(b), o, sc: s2 };
  };
  const focus: Pose = { dx: focusDx, dy: focusDy, o: 1, sc };
  const word: Pose[] = boxes.map((b, i) => (i === F ? focus : toward(b, i, 0, 0, 0.4)));
  const poses = [page, line, phrase, word, word]; // Hold = Word's pose; only the dot and the colour change

  // Fixation sequences (illustrative): skip short words, one regression, always end on the held word.
  // Each dot sits in the gap above its line, over the word's pivot letter.
  const lift = Math.max(9, (lh - fs * 1.15) / 2);
  const at = (st: number, i: number, frac?: number, r?: number): Fix => {
    const b = boxes[i];
    const p = poses[st][i];
    const x = i === F ? b.x + pivot + p.dx + (frac ?? 0) * b.w * p.sc : b.x + (b.w * (pivotIndex(WORDS[i]) + 0.5)) / Math.max(1, WORDS[i].length) + p.dx;
    return { x, y: cy(b) + p.dy - fs * 0.55 * p.sc - lift, r: r ?? 3 + Math.min(3, bare(WORDS[i]) * 0.5) };
  };
  const reading = (from: number): number[] => {
    const seq: number[] = [];
    for (let i = from; i <= F; i += 1) if (bare(WORDS[i]) >= 3 || i === F) seq.push(i);
    if (seq.length > 4) seq.splice(4, 0, seq[2]); // one regression, early
    return seq;
  };
  const fix: Fix[][] = [
    reading(0).map((i) => at(0, i)),
    reading(k).map((i) => at(1, i)),
    [P0, P0 + 1, F].map((i) => at(2, i)),
    [-0.16, 0.12, -0.06, 0].map((f, j) => at(3, F, f, j === 3 ? 4 : 2.5)),
    [],
  ];
  const rest = poses.map((_, st) => at(st, F));
  const hops = fix.map((seq, st) => seq.map((f, j) => hop(j === 0 ? rest[st] : seq[j - 1], f)));
  const top = cy(fb) + focusDy - fs * 0.55 * sc;
  return { w, h, fs, lh, boxes, pivot, poses, fix, hops, rest, hold: { x: C.x, top: rest[4].y + 8, bottom: top - 3 } };
}

interface Hop { d: string; at: (t: number) => Pt }

/** One jump between two fixations: a low arc forward, a higher arc back. */
function hop(a: Pt, b: Pt): Hop {
  // A return sweep to the next line: the dot flies straight back; no line is drawn (it would cross the text).
  if (Math.abs(b.y - a.y) > 4) return { d: '', at: (t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }) };
  const back = b.x < a.x;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const lift = (back ? 0.4 : 0.16) * Math.min(dist, 160) + Math.min(4, dist / 4);
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - lift };
  return {
    d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
    at: (t) => ({
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
    }),
  };
}

/* ------------------------------------------------------------------ component */

export function HoldStill() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [scan, setScan] = useState<{ step: number; shown: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const pivotRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const head = useRef({ pos: 0 });
  const target = useRef(-1); // -1 until the first effect; then the selected step
  const pageRef = useRef<HTMLParagraphElement>(null);
  const dot = useRef<Pt>({ x: 0, y: 0 });
  const geoRef = useRef<Geo | null>(null);
  const timers = useRef<number[]>([]);
  const hopAnim = useRef<JSAnimation | null>(null);
  const capId = useId();
  const sliderId = useId();

  const moveDot = (p: Pt): void => {
    dot.current = p;
    const el = dotRef.current;
    if (el) el.style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`;
  };

  /** Write one frame of the word poses at playhead `pos`. */
  const paint = useCallback((pos: number): void => {
    const g = geoRef.current;
    if (!g) return;
    const a = Math.floor(pos);
    const b = Math.min(LAST, a + 1);
    const t = pos - a;
    g.boxes.forEach((_, i) => {
      const el = wordRefs.current[i];
      if (!el) return;
      const p = g.poses[a][i];
      const q = g.poses[b][i];
      el.style.transform = `translate(${lerp(p.dx, q.dx, t).toFixed(2)}px, ${lerp(p.dy, q.dy, t).toFixed(2)}px) scale(${lerp(p.sc, q.sc, t).toFixed(4)})`;
      // a word leaves early and arrives late, so collapsing words never sit on top of each other at full ink
      el.style.opacity = lerp(p.o, q.o, q.o < p.o ? Math.sqrt(t) : t * t).toFixed(3);
    });
    const box = boxRef.current;
    // Hold: the moment the playhead reaches the collapsed pose on its way to Hold, the dot is already still;
    // the word turns green at once (colour snap), not after the rest of the tween.
    if (box) box.dataset.hold = target.current === LAST && pos >= LAST - 1 ? 'true' : 'false';
  }, []);

  const stopScan = (): void => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    hopAnim.current?.cancel();
    hopAnim.current = null;
  };

  /** Landed on a step: play its jumps once (or draw them all at once under reduced motion). */
  const land = useCallback(
    (st: number): void => {
      const g = geoRef.current;
      if (!g) return;
      stopScan();
      const seq = g.fix[st];
      if (seq.length === 0) {
        moveDot(g.rest[st]);
        setScan({ step: st, shown: 0 });
        return;
      }
      if (reduced) {
        moveDot(g.rest[st]);
        setScan({ step: st, shown: seq.length });
        return;
      }
      setScan({ step: st, shown: 0 });
      const dwell = [96, 130, 180, 150][st];
      let t = 0;
      seq.forEach((f, i) => {
        timers.current.push(
          window.setTimeout(() => {
            const path = g.hops[st][i];
            const o = { t: 0 };
            hopAnim.current = animate(o, {
              t: 1,
              duration: HOP_MS,
              ease: 'inOut(2)',
              onUpdate: () => moveDot(path.at(o.t)),
            });
            setScan({ step: st, shown: i + 1 });
          }, t),
        );
        t += HOP_MS + dwell * (f.r / 4.5);
      });
    },
    [reduced],
  );

  /* measure the browser's own layout (flow positions are not affected by transforms) */
  const measure = useCallback((): void => {
    const box = boxRef.current;
    const pv = pivotRef.current;
    if (!box || !pv) return;
    const cs = window.getComputedStyle(box);
    const fs = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight) || fs * 1.45;
    const boxes = wordRefs.current.map((el) => (el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : { x: 0, y: 0, w: 0, h: 0 }));
    const inner = pageRef.current?.clientWidth ?? box.clientWidth;
    const g = build(box.clientWidth, box.clientHeight, inner, fs, lh, boxes, pv.offsetLeft + pv.offsetWidth / 2);
    const fe = wordRefs.current[FOCUS];
    if (fe) fe.style.transformOrigin = `${g.pivot.toFixed(1)}px 50%`;
    geoRef.current = g;
    setGeo(g);
    stopScan();
    paint(head.current.pos);
    const st = Math.max(0, target.current);
    moveDot(g.rest[st]);
    if (head.current.pos === Math.min(st, LAST - 1)) setScan({ step: st, shown: g.fix[st].length });
  }, [paint]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (boxRef.current) ro.observe(boxRef.current);
    document.fonts?.ready.then(() => measure()).catch(() => undefined);
    return () => {
      ro.disconnect();
      stopScan();
    };
  }, [measure]);

  /* The playhead: one tween per target change, retargetable, interruptible. Hold shares Word's pose, so the
     playhead never travels 3 → 4: it parks at 3 and Hold is a state change (the dot stops, the green snaps on). */
  useEffect(() => {
    const h = head.current;
    const g = geoRef.current;
    const first = target.current === -1;
    target.current = step;
    if (!g || first) return undefined; // first render: the Page scanpath is already drawn at rest; nothing plays
    stopScan();
    setScan(null);
    const to = Math.min(step, LAST - 1);
    h.pos = Math.min(h.pos, LAST - 1);
    const from = h.pos;
    const d0 = dot.current;
    const update = (): void => {
      paint(h.pos);
      const k = from === to ? 1 : Math.min(1, Math.abs(h.pos - from) / Math.abs(to - from));
      const e = g.rest[step];
      moveDot({ x: lerp(d0.x, e.x, k), y: lerp(d0.y, e.y, k) });
    };
    if (reduced || from === to) {
      h.pos = to;
      update();
      land(step);
      return undefined;
    }
    const tween = animate(h, {
      pos: to,
      duration: Math.min(MS_PER_STEP * 1.5, MS_PER_STEP * Math.abs(to - from)),
      ease: 'inOut(3)',
      onUpdate: update,
      onComplete: () => land(step),
    });
    return () => {
      tween.cancel();
    };
  }, [step, reduced, paint, land]);

  const shown = geo && scan ? geo.fix[scan.step].slice(0, scan.shown) : [];
  const cur = STEPS[step];

  return (
    <div className={s.control} data-step={cur.id}>
      <figure className={s.figure} aria-labelledby={capId}>
        <div ref={boxRef} className={s.box} data-live={geo ? 'true' : 'false'} aria-hidden="true">
          <p ref={pageRef} className={s.page}>
            {WORDS.map((w, i) => {
              const parts = i === FOCUS ? splitWord(w) : null;
              return (
                <span key={`${w}${i}`}>
                  <span ref={(el) => { wordRefs.current[i] = el; }} className={i === FOCUS ? `${s.w} ${s.focus}` : s.w}>
                    {parts ? (
                      <>
                        {parts.pre}
                        <span ref={pivotRef}>{parts.pivot}</span>
                        {parts.post}
                      </>
                    ) : (
                      w
                    )}
                  </span>
                  {i < WORDS.length - 1 ? ' ' : null}
                </span>
              );
            })}
          </p>
          {geo ? (
            <svg className={s.scan} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} focusable="false">
              {shown.map((f, i) => {
                const a = i === 0 ? null : shown[i - 1];
                return (
                  <g key={`${scan?.step}-${i}`}>
                    {i > 0 && scan && geo.hops[scan.step][i].d ? <path className={s.arc} d={geo.hops[scan.step][i].d} pathLength={1} /> : null}
                    <circle className={s.mark} cx={f.x} cy={f.y} r={f.r} style={{ '--r': f.r } as CSSProperties} />
                  </g>
                );
              })}
              <line className={s.tick} x1={geo.hold.x} y1={geo.hold.top} x2={geo.hold.x} y2={geo.hold.bottom} />
            </svg>
          ) : null}
          <span ref={dotRef} className={s.dot} />
        </div>
        <figcaption className={s.note}>{control.simulationNote}</figcaption>
      </figure>

      <div className={s.slider}>
        <input
          id={sliderId}
          className={s.range}
          type="range"
          min={0}
          max={LAST}
          step={1}
          value={step}
          aria-label={control.label}
          aria-valuetext={cur.name}
          aria-describedby={capId}
          onChange={(e) => setStep(Math.min(LAST, Math.max(0, Math.round(Number(e.target.value)))))}
          style={{ '--p': step / LAST } as CSSProperties}
        />
        <ol className={s.names} aria-hidden="true">
          {STEPS.map((st, i) => (
            <li key={st.id} data-on={i === step ? 'true' : undefined} data-past={i < step ? 'true' : undefined}>
              {st.name}
            </li>
          ))}
        </ol>
      </div>
      <p id={capId} className={s.caption} aria-live="polite" key={cur.id}>
        {cur.caption}
      </p>
    </div>
  );
}
