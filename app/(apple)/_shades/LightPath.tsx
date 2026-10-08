/**
 * The SHADES light path, exploded along the ray (server-safe, no hooks). Diagram, not a render:
 * stations are generic line art; no unconfirmed component (panel type, optics type, part number) is drawn or named.
 *
 * Two layouts in the DOM, switched by CSS: horizontal (≥ 735px) and vertical (phones).
 * Progress:
 *   - mode "scrub": inherits CSS number --k (0..1) from a scroll driver; station i lights at k ≥ i/6.
 *   - mode "step":  `active` index (null = all lit, the static / no-JS state).
 *   - mode "play":  inherits CSS number --pos (float stage index 0..5) from a timed playhead: the lit ray is drawn
 *                   to the playhead, a packet rides its tip, and the emphasis crossfades between the two neighbouring
 *                   stations. One horizontal layout with larger stations; `active` only marks the current label.
 */
import type { CSSProperties, ReactNode } from 'react';
import { SHADES, type LightStage } from '../_content/shades';
import s from './lightpath.module.css';

const STAGES = SHADES.lightPath.stages;
const N = STAGES.length;

function Station({ id }: { readonly id: LightStage['id'] }): ReactNode {
  switch (id) {
    case 'text':
      return (
        <g>
          <path className={s.solidFill} d="M-30 -42h44l16 16v68h-60z" />
          <path className={s.hair} d="M14 -42v16h16" />
          {[-20, -8, 4, 16, 28].map((y, i) => (
            <line key={y} className={s.dotted} x1={-20} y1={y} x2={i % 2 ? 8 : 18} y2={y} />
          ))}
        </g>
      );
    case 'timing':
      return (
        <g>
          {[-24, -12, 0, 12, 24].map((v) => (
            <g key={v}>
              <line className={s.hair} x1={v} y1={-46} x2={v} y2={-36} />
              <line className={s.hair} x1={v} y1={36} x2={v} y2={46} />
              <line className={s.hair} x1={-46} y1={v} x2={-36} y2={v} />
              <line className={s.hair} x1={36} y1={v} x2={46} y2={v} />
            </g>
          ))}
          <rect className={s.solidFill} x={-36} y={-36} width={72} height={72} rx={3} />
          <rect className={s.hair} x={-16} y={-16} width={32} height={32} />
          {/* word slots in time: a clock train */}
          <path className={s.line} d="M-26 26h6v-8h8v8h6v-8h8v8h6v-8h8v8h6" />
        </g>
      );
    case 'control':
      return (
        <g>
          <rect className={s.solidFill} x={-40} y={-28} width={80} height={56} rx={10} />
          <circle className={s.hair} cx={-18} cy={0} r={8} />
          <circle className={s.hair} cx={4} cy={0} r={8} />
          <path className={s.line} d="M-21 -3.5v7M-15 -3.5v7" />
          <path className={s.line} d="M1.5 -4l6 4-6 4z" />
          <line className={s.hair} x1={22} y1={-10} x2={22} y2={10} />
          <circle className={s.node} cx={22} cy={3} r={3} />
        </g>
      );
    case 'display':
      return (
        <g>
          <rect className={s.solidFill} x={-34} y={-24} width={68} height={48} rx={2} />
          <rect className={s.dotted} x={-26} y={-16} width={52} height={32} />
          <line className={s.line} x1={-12} y1={0} x2={12} y2={0} />
          <line className={s.hair} x1={0} y1={-9} x2={0} y2={-5} />
          <line className={s.hair} x1={0} y1={5} x2={0} y2={9} />
        </g>
      );
    case 'optics':
      return (
        <g>
          <path className={s.solidFill} d="M0 -50Q22 0 0 50Q-22 0 0 -50z" />
          <line className={s.hair} x1={0} y1={-56} x2={0} y2={56} strokeDasharray="2 4" />
        </g>
      );
    case 'eye':
      return (
        <g>
          <path className={s.solidFill} d="M-34 0Q4 -34 40 0Q4 34 -34 0z" />
          <circle className={s.hair} cx={-8} cy={0} r={15} />
          <circle className={s.pupil} cx={-8} cy={0} r={6} />
        </g>
      );
    default:
      return null;
  }
}

interface Layout {
  readonly w: number;
  readonly h: number;
  readonly at: (i: number) => readonly [number, number];
  readonly label: (i: number) => { x: number; y: number; anchor: 'middle' | 'start' };
  readonly ray: readonly [number, number, number, number];
  readonly point: readonly [number, number];
  readonly eyeRotate: number;
  readonly note: { x: number; y: number };
  /** Station icon scale (default 1). */
  readonly scale?: number;
}

const H_LAYOUT: Layout = {
  w: 1200,
  h: 300,
  at: (i) => [100 + i * 196, 140],
  label: (i) => ({ x: 100 + i * 196, y: 232, anchor: 'middle' }),
  ray: [100, 140, 1080, 140],
  point: [1010, 140],
  eyeRotate: 0,
  note: { x: 600, y: 292 },
};

const P_X0 = 110;
const P_DX = 196;
const P_LAYOUT: Layout = {
  w: 1200,
  h: 206,
  at: (i) => [P_X0 + i * P_DX, 96],
  label: (i) => ({ x: P_X0 + i * P_DX, y: 212, anchor: 'middle' }),
  ray: [P_X0, 96, P_X0 + (N - 1) * P_DX, 96],
  point: [P_X0 + 4.5 * P_DX, 96],
  eyeRotate: 0,
  note: { x: 600, y: 0 },
  scale: 1.4,
};

const V_LAYOUT: Layout = {
  w: 360,
  h: 760,
  at: (i) => [96, 60 + i * 124],
  label: (i) => ({ x: 170, y: 66 + i * 124, anchor: 'start' }),
  ray: [96, 60, 96, 700],
  point: [96, 638],
  eyeRotate: 90,
  note: { x: 180, y: 752 },
};

function Figure({ layout, mode, active, labels, note }: { readonly layout: Layout; readonly mode: LightPathProps['mode']; readonly active: number | null; readonly labels: boolean; readonly note: boolean }) {
  const [x1, y1, x2, y2] = layout.ray;
  const reach = mode === 'step' ? (active === null ? 1 : active / (N - 1)) : undefined;
  const fillStyle =
    mode === 'step'
      ? ({ transform: layout.eyeRotate ? `scaleY(${reach})` : `scaleX(${reach})` } as CSSProperties)
      : undefined;
  return (
    <svg
      viewBox={`0 0 ${layout.w} ${layout.h + (layout.eyeRotate ? 10 : 20)}`}
      className={s.svg}
      aria-hidden="true"
      focusable="false"
      style={mode === 'play' ? ({ ['--n' as string]: N - 1, ['--dx' as string]: P_DX } as CSSProperties) : undefined}
    >
      <line className={s.ray} x1={x1} y1={y1} x2={x2} y2={y2} />
      <line
        className={`${s.rayLit} ${layout.eyeRotate ? s.vertical : s.horizontal}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={{ ...fillStyle, transformOrigin: `${x1}px ${y1}px` }}
      />
      {/* behind the stations: visible only in transit between two of them */}
      {mode === 'play' ? <circle className={s.packet} cx={x1} cy={y1} r={5} /> : null}
      {STAGES.map((st, i) => {
        const [x, y] = layout.at(i);
        const reached = mode === 'step' ? active === null || i <= active : undefined;
        const lab = layout.label(i);
        return (
          <g
            key={st.id}
            className={s.station}
            data-reached={reached === undefined ? undefined : reached ? 'true' : 'false'}
            data-current={mode !== 'scrub' && active === i ? 'true' : undefined}
            style={{ ['--t' as string]: (i / N).toFixed(3), ['--i' as string]: i } as CSSProperties}
          >
            <g transform={`translate(${x} ${y})${st.id === 'eye' && layout.eyeRotate ? ` rotate(${layout.eyeRotate})` : ''}${layout.scale ? ` scale(${layout.scale})` : ''}`}>
              <g className={s.icon}>
                <Station id={st.id} />
              </g>
            </g>
            {labels ? (
              <text className={`${s.label} ${layout.eyeRotate ? s.labelV : ''}`} x={lab.x} y={lab.y} textAnchor={lab.anchor}>
                {st.name}
              </text>
            ) : null}
          </g>
        );
      })}
      <g className={s.fixation} data-reached={mode === 'step' ? (active === null || active === N - 1 ? 'true' : 'false') : undefined}>
        <circle className={s.anchor} cx={layout.point[0]} cy={layout.point[1]} r={6} />
      </g>
      {labels && note ? (
        <text className={`${s.note} ${layout.eyeRotate ? s.noteV : ''}`} x={layout.note.x} y={layout.note.y} textAnchor="middle">
          {SHADES.lightPath.note}
        </text>
      ) : null}
    </svg>
  );
}

/** One station's line art on its own (the static stacked list). */
export function StationIcon({ id, className }: { readonly id: LightStage['id']; readonly className?: string }) {
  return (
    <svg viewBox="-60 -60 120 120" className={className} aria-hidden="true" focusable="false">
      <Station id={id} />
    </svg>
  );
}

export interface LightPathProps {
  readonly mode: 'scrub' | 'step' | 'play';
  readonly active?: number | null;
  readonly labels?: boolean;
  /** Force one layout (e.g. the compact sticky strip stays horizontal on phones). */
  readonly layout?: 'auto' | 'h';
  /** Draw the in-figure "Diagram, not a render" label. Off when the caller prints it as HTML. */
  readonly note?: boolean;
  readonly className?: string;
}

export function LightPath({ mode, active = null, labels = true, layout = 'auto', note = true, className }: LightPathProps) {
  const play = mode === 'play';
  return (
    <div
      className={[s.wrap, className ?? ''].join(' ')}
      data-mode={mode}
      data-layout={play ? 'h' : layout}
      role="img"
      aria-label={SHADES.lightPath.figureLabel}
      style={play ? ({ ['--c0' as string]: P_X0 / P_LAYOUT.w, ['--dc' as string]: P_DX / P_LAYOUT.w } as CSSProperties) : undefined}
    >
      <div className={s.h}>
        <Figure layout={play ? P_LAYOUT : H_LAYOUT} mode={mode} active={active} labels={labels} note={note && !play} />
      </div>
      {layout === 'auto' && !play ? (
        <div className={s.v}>
          <Figure layout={V_LAYOUT} mode={mode} active={active} labels={labels} note={note} />
        </div>
      ) : null}
    </div>
  );
}
