/**
 * Illustrative scanpath over a line of text (server-safe, no hooks).
 * Word boxes, fixation dots sized by (illustrative) dwell time on their own row above the words, saccade arcs
 * (one regression), and optionally an eye-position trace below: a staircase of x-position over time.
 *
 * Two layouts in the DOM, switched by CSS at 734px: one line (wide) and two lines (narrow, with a return sweep),
 * so the words are never cropped on phones.
 *
 * Collapse is driven by the inherited CSS number --k (0 = reading a line, 1 = RSVP: one fixation point).
 * `k` pins it for static figures (no-JS, reduced motion). `once` plays a short draw-in when an ancestor
 * sets data-run="play" (Apple chapter); its default state is fully drawn.
 * The "Illustrative, not recorded data" note is the caller's HTML caption, not SVG text.
 */
import type { CSSProperties } from 'react';
import { SHADES } from '../_content/shades';
import s from './scanpath.module.css';

const LINE = SHADES.problem.line;
const FONT = 34;
const CHAR = FONT * 0.56;
const GAP = 24;
const widths = LINE.map((w) => w.length * CHAR);

/** Fixation sequence: word index + illustrative dwell (ms). Word 1 ("a") is skipped; one regression (5 → 4). */
const SEQ: ReadonlyArray<readonly [number, number]> = [
  [0, 220], [2, 260], [3, 200], [4, 240], [5, 290], [4, 170], [6, 260], [7, 210], [8, 300],
];

interface Geometry {
  readonly w: number;
  readonly h: number;
  readonly words: ReadonlyArray<{ x: number; y: number; w: number; dx: number }>;
  readonly fix: ReadonlyArray<{ k: number; x: number; y: number; r: number; dx: number; dy: number }>;
  readonly arcs: ReadonlyArray<{ k: number; back: boolean; d: string }>;
  readonly point: { x: number; y: number; wordY: number };
  readonly trace: { d: string; t0: number; t1: number; top: number; bot: number; mid: number } | null;
  readonly axisFont: number;
}

/** Lay the words out in `rows` (word index ranges), each row centred in width `w`. */
function geometry(w: number, rows: ReadonlyArray<readonly [number, number]>, trace: boolean, axisFont: number): Geometry {
  const ROW_H = 132;
  const FIRST_DOT = 66;
  const words: Array<{ x: number; y: number; w: number; dx: number }> = [];
  rows.forEach(([a, b], r) => {
    const span = widths.slice(a, b + 1).reduce((s0, x) => s0 + x, 0) + GAP * (b - a);
    let x = (w - span) / 2;
    for (let i = a; i <= b; i += 1) {
      words[i] = { x, y: FIRST_DOT + 56 + r * ROW_H, w: widths[i], dx: x + widths[i] / 2 - w / 2 };
      x += widths[i] + GAP;
    }
  });
  const cx = w / 2;
  const rowOf = (wi: number): number => rows.findIndex(([a, b]) => wi >= a && wi <= b);
  const pointY = FIRST_DOT + ((rows.length - 1) * ROW_H) / 2;
  const fix = SEQ.map(([wi, dwell], k) => {
    const x = words[wi].x + words[wi].w * 0.42;
    const y = FIRST_DOT + rowOf(wi) * ROW_H;
    return { k, x, y, r: 5 + (dwell - 160) / 22, dx: x - cx, dy: y - pointY };
  });
  const arcs = fix.slice(1).map((f, i) => {
    const a = fix[i];
    const back = SEQ[i + 1][0] < SEQ[i][0];
    if (a.y !== f.y) {
      // Return sweep to the next line: a long diagonal, drawn as a straight leader.
      return { k: i + 1, back: false, d: `M${a.x.toFixed(1)} ${a.y}L${f.x.toFixed(1)} ${f.y}` };
    }
    const lift = (back ? 62 : 22) + Math.min(16, Math.abs(f.x - a.x) / 10);
    return {
      k: i + 1,
      back,
      d: `M${a.x.toFixed(1)} ${a.y}Q${((a.x + f.x) / 2).toFixed(1)} ${(a.y - lift).toFixed(1)} ${f.x.toFixed(1)} ${f.y}`,
    };
  });
  const textBottom = FIRST_DOT + 56 + (rows.length - 1) * ROW_H + 30;
  let tr: Geometry['trace'] = null;
  if (trace) {
    const t0 = w * 0.07;
    const t1 = w * 0.93;
    const top = textBottom + 40;
    const bot = top + 136;
    const xs = fix.map((f) => f.x);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const posY = (x: number): number => bot - 12 - ((x - xMin) / (xMax - xMin || 1)) * (bot - top - 24);
    const total = SEQ.reduce((acc, [, d]) => acc + d, 0) + 40 * (SEQ.length - 1);
    const scale = (t1 - t0) / total;
    let t = t0;
    let d = '';
    fix.forEach((f, i) => {
      const y = posY(f.x);
      if (i === 0) d += `M${t.toFixed(1)} ${y.toFixed(1)}`;
      else {
        t += 40 * scale;
        d += `L${t.toFixed(1)} ${y.toFixed(1)}`;
      }
      t += SEQ[i][1] * scale;
      d += `L${t.toFixed(1)} ${y.toFixed(1)}`;
    });
    tr = { d, t0, t1, top, bot, mid: (top + bot) / 2 };
  }
  const h = tr ? tr.bot + 8 + axisFont * 2.2 : textBottom + 12;
  return { w, h, words, fix, arcs, point: { x: cx, y: pointY, wordY: pointY + 56 }, trace: tr, axisFont };
}

const WIDE = { plain: geometry(1000, [[0, 8]], false, 15), trace: geometry(1000, [[0, 8]], true, 15) };
const NARROW = { plain: geometry(600, [[0, 3], [4, 8]], false, 22), trace: geometry(600, [[0, 3], [4, 8]], true, 22) };

export interface ScanpathProps {
  readonly trace?: boolean;
  /** Pin the collapse (static figures). Omit to inherit --k from a scroll driver. */
  readonly k?: 0 | 1;
  /** Short draw-in when an ancestor sets data-run="play". */
  readonly once?: boolean;
  readonly label?: string;
  readonly className?: string;
}

function Figure({ g }: { readonly g: Geometry }) {
  const fl = SHADES.problem;
  return (
    <g>
      {LINE.map((word, i) => {
        const b = g.words[i];
        return (
          <g key={`${word}${i}`} className={s.word} style={{ ['--dx' as string]: b.dx.toFixed(1) } as CSSProperties}>
            <rect className={s.box} x={b.x - 6} y={b.y - 26} width={b.w + 12} height={52} rx={3} />
            <text className={s.wordText} x={b.x + b.w / 2} y={b.y + 12} textAnchor="middle" fontSize={FONT}>
              {word}
            </text>
          </g>
        );
      })}
      {g.arcs.map((a) => (
        <path
          key={a.k}
          className={`${s.arc} ${a.back ? s.back : ''}`}
          d={a.d}
          pathLength={1}
          style={{ ['--i' as string]: a.k } as CSSProperties}
        />
      ))}
      {g.fix.map((f) => (
        <g
          key={f.k}
          className={s.fixWrap}
          style={{ ['--dx' as string]: f.dx.toFixed(1), ['--dy' as string]: f.dy.toFixed(1), ['--i' as string]: f.k } as CSSProperties}
        >
          <circle className={s.fix} cx={g.point.x} cy={g.point.y} r={f.r} />
        </g>
      ))}
      {/* The collapsed state: one fixation point, one word. */}
      <g className={s.point}>
        <line className={s.tick} x1={g.point.x} y1={g.point.y + 12} x2={g.point.x} y2={g.point.wordY - 34} />
        <text className={s.oneWord} x={g.point.x} y={g.point.wordY + 12} textAnchor="middle" fontSize={FONT + 6}>
          {SHADES.method.oneWord}
        </text>
        <circle className={s.anchor} cx={g.point.x} cy={g.point.y} r={6} />
      </g>
      {g.trace ? (
        <g className={s.plot}>
          <line className={s.axis} x1={g.trace.t0} y1={g.trace.bot + 8} x2={g.trace.t1} y2={g.trace.bot + 8} />
          <line className={s.axis} x1={g.trace.t0 - 8} y1={g.trace.top} x2={g.trace.t0 - 8} y2={g.trace.bot + 8} />
          <text className={s.axisLabel} x={g.trace.t1} y={g.trace.bot + 8 + g.axisFont * 1.6} textAnchor="end" fontSize={g.axisFont}>
            {fl.timeAxis}
          </text>
          <text className={s.axisLabel} x={g.trace.t0 - 8} y={g.trace.top - g.axisFont * 0.8} fontSize={g.axisFont}>
            {fl.traceAxis}
          </text>
          <line className={s.flat} x1={g.trace.t0} y1={g.trace.mid} x2={g.trace.t1} y2={g.trace.mid} />
          <path className={s.trace} d={g.trace.d} style={{ transformOrigin: `0px ${g.trace.mid}px` } as CSSProperties} />
        </g>
      ) : null}
    </g>
  );
}

export function Scanpath({ trace = false, k, once = false, label, className }: ScanpathProps) {
  const style = k === undefined ? undefined : ({ '--k': k } as CSSProperties);
  const wide = trace ? WIDE.trace : WIDE.plain;
  const narrow = trace ? NARROW.trace : NARROW.plain;
  return (
    <div
      className={[s.wrap, once ? s.once : '', className ?? ''].join(' ')}
      style={style}
      role="img"
      aria-label={label ?? SHADES.problem.figureLabel}
    >
      <svg className={`${s.fig} ${s.wide}`} viewBox={`0 0 ${wide.w} ${wide.h}`} focusable="false" aria-hidden="true">
        <Figure g={wide} />
      </svg>
      <svg className={`${s.fig} ${s.narrow}`} viewBox={`0 0 ${narrow.w} ${narrow.h}`} focusable="false" aria-hidden="true">
        <Figure g={narrow} />
      </svg>
    </div>
  );
}
