/**
 * Illustrative scanpath over one line of text (server-safe, no hooks).
 * Word boxes, fixation dots sized by (illustrative) dwell time, saccade arcs (one regression),
 * and optionally an eye-position trace below: a staircase of x-position over time.
 *
 * Collapse is driven by the inherited CSS number --k (0 = reading a line, 1 = RSVP: one fixation point).
 * `k` pins it for static figures (no-JS, reduced motion). `once` plays a short draw-in when the
 * parent sets data-run="play" (Apple chapter); its default state is fully drawn.
 */
import type { CSSProperties } from 'react';
import { SHADES } from '../_content/shades';
import s from './scanpath.module.css';

const W = 1000;
const CX = W / 2;
const FONT = 34;
const CHAR = FONT * 0.56;
const GAP = 24;
const LINE_Y = 122;
/** Fixation dots sit on their own row above the words, so the text stays readable. */
const DOT_Y = 66;

const LINE = SHADES.problem.line;
const widths = LINE.map((w) => w.length * CHAR);
const total = widths.reduce((a, b) => a + b, 0) + GAP * (LINE.length - 1);
const starts = widths.reduce<number[]>((acc, w, i) => {
  acc.push(i === 0 ? (W - total) / 2 : acc[i - 1] + widths[i - 1] + GAP);
  return acc;
}, []);

/** Fixation sequence: word index + illustrative dwell (ms). Word 1 ("a") is skipped; one regression (5 → 4). */
const SEQ: ReadonlyArray<readonly [number, number]> = [
  [0, 220], [2, 260], [3, 200], [4, 240], [5, 290], [4, 170], [6, 260], [7, 210], [8, 300],
];

const fixations = SEQ.map(([wi, dwell], k) => {
  // Fixations land a little left of a word's centre (the preferred viewing position).
  const x = starts[wi] + widths[wi] * 0.42;
  return { k, wi, dwell, x, r: 5 + (dwell - 160) / 22, back: k > 0 && wi < SEQ[k - 1][0] };
});

const arcs = fixations.slice(1).map((f, i) => {
  const a = fixations[i];
  const mid = (a.x + f.x) / 2;
  const lift = (f.back ? 62 : 22) + Math.min(16, Math.abs(f.x - a.x) / 10);
  return { k: i + 1, back: f.back, d: `M${a.x.toFixed(1)} ${DOT_Y}Q${mid.toFixed(1)} ${(DOT_Y - lift).toFixed(1)} ${f.x.toFixed(1)} ${DOT_Y}` };
});

/* Trace: x = time, y = eye position (right = up). */
const T0 = 70;
const T1 = 930;
const TOP = 214;
const BOT = 350;
const TMID = (TOP + BOT) / 2;
const dwellTotal = SEQ.reduce((a, [, d]) => a + d, 0) + 40 * (SEQ.length - 1);
const xMin = fixations[0].x;
const xMax = Math.max(...fixations.map((f) => f.x));
const posY = (x: number): number => BOT - 12 - ((x - xMin) / (xMax - xMin)) * (BOT - TOP - 24);
const tracePath = (() => {
  let t = T0;
  const scale = (T1 - T0) / dwellTotal;
  let d = '';
  fixations.forEach((f, i) => {
    const y = posY(f.x);
    if (i === 0) d += `M${t.toFixed(1)} ${y.toFixed(1)}`;
    else {
      t += 40 * scale; // saccade: ~40 ms, near-vertical
      d += `L${t.toFixed(1)} ${y.toFixed(1)}`;
    }
    t += f.dwell * scale;
    d += `L${t.toFixed(1)} ${y.toFixed(1)}`;
  });
  return d;
})();

export interface ScanpathProps {
  readonly trace?: boolean;
  /** Pin the collapse (static figures). Omit to inherit --k from a scroll driver. */
  readonly k?: 0 | 1;
  /** Short draw-in when an ancestor sets data-run="play". */
  readonly once?: boolean;
  readonly label?: string;
  readonly className?: string;
}

export function Scanpath({ trace = false, k, once = false, label, className }: ScanpathProps) {
  const H = trace ? 420 : 196;
  const style = (k === undefined ? undefined : ({ '--k': k } as CSSProperties));
  const fl = SHADES.problem;
  return (
    <svg
      className={[s.fig, once ? s.once : '', className ?? ''].join(' ')}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label ?? fl.figureLabel}
      style={style}
      data-trace={trace ? 'true' : undefined}
    >
      <g aria-hidden="true">
        {LINE.map((w, i) => (
          <g key={`${w}${i}`} className={s.word} style={{ ['--dx' as string]: (starts[i] + widths[i] / 2 - CX).toFixed(1) } as CSSProperties}>
            <rect className={s.box} x={starts[i] - 6} y={LINE_Y - 26} width={widths[i] + 12} height={52} rx={3} />
            <text className={s.wordText} x={starts[i] + widths[i] / 2} y={LINE_Y + 12} textAnchor="middle" fontSize={FONT}>
              {w}
            </text>
          </g>
        ))}
        {arcs.map((a) => (
          <path
            key={a.k}
            className={`${s.arc} ${a.back ? s.back : ''}`}
            d={a.d}
            pathLength={1}
            style={{ ['--i' as string]: a.k } as CSSProperties}
          />
        ))}
        {fixations.map((f) => (
          <g key={f.k} className={s.fixWrap} style={{ ['--dx' as string]: (f.x - CX).toFixed(1), ['--i' as string]: f.k } as CSSProperties}>
            <circle className={s.fix} cx={CX} cy={DOT_Y} r={f.r} />
          </g>
        ))}
        {/* The collapsed state: one fixation point, one word. */}
        <g className={s.point}>
          <line className={s.tick} x1={CX} y1={DOT_Y + 12} x2={CX} y2={LINE_Y - 36} />
          <text className={s.oneWord} x={CX} y={LINE_Y + 12} textAnchor="middle" fontSize={FONT + 6}>
            {SHADES.method.oneWord}
          </text>
          <circle className={s.anchor} cx={CX} cy={DOT_Y} r={6} />
        </g>
        {trace ? (
          <g className={s.plot}>
            <line className={s.axis} x1={T0} y1={BOT + 8} x2={T1} y2={BOT + 8} />
            <line className={s.axis} x1={T0 - 8} y1={TOP} x2={T0 - 8} y2={BOT + 8} />
            <text className={s.axisLabel} x={T1} y={BOT + 30} textAnchor="end">
              {fl.timeAxis}
            </text>
            <text className={s.axisLabel} x={T0 - 8} y={TOP - 12}>
              {fl.traceAxis}
            </text>
            <line className={s.flat} x1={T0} y1={TMID} x2={T1} y2={TMID} />
            <path className={s.trace} d={tracePath} style={{ transformOrigin: `0px ${TMID}px` } as CSSProperties} />
          </g>
        ) : null}
        <text className={s.note} x={CX} y={H - 8} textAnchor="middle">
          {fl.figureNote}
        </text>
      </g>
    </svg>
  );
}
