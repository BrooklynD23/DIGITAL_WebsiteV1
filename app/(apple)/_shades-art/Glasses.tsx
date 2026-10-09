'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import { systemGroups, type SystemGroup } from '../_content/shades-concept';
import { VIEW_ANGLES, draw, type Box, type Drawing, type Face, type P2, type ViewName } from './geometry';
import s from './glasses.module.css';

/**
 * SHADES glasses, drawn in code. One original frame, three renderings of the same geometry:
 *   solid     a product shot: graphite acetate with tone-stepped occlusion faces, tinted lenses, one contact shadow
 *   line      anatomy line art: 1.25px union outlines (no stray segments at joints), creases at the same weight
 *   exploded  flat solid bodies in their group hue (2–3 tone steps, 1.25px outline); display rises, optics drop;
 *             word timing and control drawn off the frame, dashed, because no source places them
 * Switching mode crossfades; entering `exploded` also slides the parts out (CSS transitions, off under reduced motion).
 * `yaw` overrides the view's turn so a consumer can play a turn frame by frame.
 */
export type GlassesMode = 'solid' | 'line' | 'exploded';
export type GlassesView = ViewName;
export type SystemGroupId = SystemGroup['id'];
export interface GlassesDisplay {
  readonly word: string;
  /** Word colour. Default HUD green #7FE6A3, flat. */
  readonly color?: string;
}
export interface GlassesProps {
  readonly mode?: GlassesMode;
  readonly view?: GlassesView;
  /** Degrees. Overrides the view's yaw (pitch follows the view). */
  readonly yaw?: number;
  /** Word shown in the right lens's see-through display region. null / omitted: region empty. */
  readonly display?: GlassesDisplay | null;
  /** Red fixation point above the word (site red #d8412f). */
  readonly fixation?: boolean;
  /** Line and exploded only: this group at full strength, the rest dimmed. */
  readonly highlight?: SystemGroupId | null;
  readonly ground?: 'dark' | 'light';
  /** 'object' crops tight to the glasses; 'room' leaves space for the exploded parts and labels.
   *  Default: 'object' for solid, 'room' for line and exploded, so line ↔ exploded animates in place. */
  readonly fit?: 'object' | 'room';
  readonly className?: string;
  /** Accessible name (role="img"). */
  readonly title: string;
}

export const HUD_GREEN = '#7FE6A3';
const RED = '#d8412f';
const N_COPIES = 24;
const LENS_T = 0.45;
const OUTLINE = 1.25;

const LABEL: Readonly<Record<SystemGroupId, string>> = Object.fromEntries(systemGroups.map((g) => [g.id, g.label])) as Record<
  SystemGroupId,
  string
>;

/* ------------------------------------------------------------------ layout of the exploded pose */

interface Layout {
  readonly vb: Box;
  readonly move: Readonly<Record<'optics' | 'display', P2>>;
  readonly boxes: Readonly<Record<'timing' | 'control', Box>>;
  readonly labels: Readonly<Record<SystemGroupId, { readonly at: P2; readonly anchor: 'left' | 'below' | 'above' }>>;
}

function layout(g: Drawing, fit: 'object' | 'room'): Layout {
  const fb = g.frontBox;
  const lr = g.lensRBox;
  const ll = g.lensLBox;
  const dispHalfH = 5;
  const display: P2 = [0, fb.y - 10 - dispHalfH - g.displayAt[1]];
  const optics: P2 = [0, fb.y + fb.h + 9 - lr.y];
  const bw = 34;
  const bh = 15;
  const by = fb.y + fb.h + 12;
  const bcx = Math.min(ll.x + ll.w / 2, lr.x - 10 - bw - 6);
  const boxes = {
    timing: { x: bcx - bw - 6, y: by, w: bw, h: bh },
    control: { x: bcx + 6, y: by, w: bw, h: bh },
  };
  const dx = g.displayAt[0];
  const dy = g.displayAt[1] + display[1];
  const labels: Layout['labels'] = {
    frame: { at: [fb.x + 2, fb.y - 3], anchor: 'above' },
    display: { at: [dx + 13, dy], anchor: 'left' },
    optics: { at: [lr.x + lr.w / 2, lr.y + lr.h + optics[1] + 3], anchor: 'below' },
    timing: { at: [boxes.timing.x + bw / 2, by + bh + 3], anchor: 'below' },
    control: { at: [boxes.control.x + bw / 2, by + bh + 3], anchor: 'below' },
  };
  const b = g.box;
  let vb: Box;
  if (fit === 'object') {
    const p = Math.max(b.w, b.h) * 0.04;
    vb = { x: b.x - p, y: b.y - p, w: b.w + 2 * p, h: b.h + 2 * p };
  } else {
    const x0 = Math.min(b.x, boxes.timing.x) - 6;
    const x1 = Math.max(b.x + b.w, lr.x + lr.w + 4, dx + 46) + 4;
    const y0 = Math.min(b.y, dy - dispHalfH - 6, fb.y - 12) - 4;
    const y1 = Math.max(b.y + b.h, lr.y + lr.h + optics[1] + 12, by + bh + 12) + 4;
    vb = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  return { vb, move: { optics, display }, boxes, labels };
}

/* ------------------------------------------------------------------ small helpers */

const tr = (p: P2, k = 1): string => `translate(${(p[0] * k).toFixed(3)}px, ${(p[1] * k).toFixed(3)}px)`;

function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))).toString(16).padStart(2, '0')).join('')}`;
}

/** Depth copies of the front, back (t = 1) to front (t = 0), split around the lens plane. */
function copies(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = N_COPIES - 1; i >= 0; i--) {
    const t = i / (N_COPIES - 1);
    if (t <= from && t > to) out.push(t);
  }
  return out;
}

/** The outline trick: every piece stroked at 2× width, then every piece filled on top. Leaves one clean 1.25px
 *  silhouette around the union with no stray segments where pieces overlap. */
function Union({ children, fills }: { readonly children: (stroke: boolean) => ReactNode; readonly fills?: ReactNode }) {
  return (
    <>
      <g fill="none" stroke="currentColor" strokeWidth={OUTLINE * 2} strokeLinejoin="round">
        {children(true)}
      </g>
      {fills ?? <g className={s.ground}>{children(false)}</g>}
    </>
  );
}

function fitWord(word: string, w: number): number {
  return Math.min(4.6, (w * 0.84) / Math.max(1, word.length * 0.56));
}

/* ------------------------------------------------------------------ component */

export function Glasses({
  mode = 'solid',
  view = 'three-quarter',
  yaw,
  display = null,
  fixation = false,
  highlight = null,
  ground = 'dark',
  fit,
  className,
  title,
}: GlassesProps) {
  const uid = useId().replace(/:/g, '');
  const id = (k: string): string => `g${uid}${k}`;
  const angles = VIEW_ANGLES[view];
  const g = draw(yaw ?? angles.yaw, angles.pitch);
  const L = layout(g, fit ?? (mode === 'solid' ? 'object' : 'room'));
  const { vb } = L;
  const dark = ground === 'dark';
  const exploded = mode === 'exploded';
  const dim = (grp: SystemGroupId): number => (highlight && highlight !== grp ? 0.3 : 1);
  const fb = g.frontBox;
  const word = display?.word ?? '';
  const wordColor = display?.color ?? HUD_GREEN;
  const [ma, mb, mc, md, me, mf] = g.display.m;
  const dm = `matrix(${ma} ${mb} ${mc} ${md} ${me} ${mf})`;
  const dw = g.display.w;
  const dh = g.display.h;
  const showWord = word !== '' && g.display.visible > 0;
  const nsProps = { vectorEffect: 'non-scaling-stroke' as const };

  const faceRef = `#${id('face')}`;
  const faceCopy = (t: number, extra: Record<string, unknown> = {}) => (
    <use key={t} href={faceRef} transform={`translate(${(g.depth[0] * t).toFixed(3)} ${(g.depth[1] * t).toFixed(3)})`} {...extra} />
  );

  /* -------- solid palette -------- */
  const SOL = dark
    ? { f0: '#55595f', f1: '#2b2d31', f2: '#111214', w0: '#2a2c30', w1: '#08090a', bevel: '#767b83', tLo: '#16171a', tHi: '#71767e', pad: '#2e3034' }
    : { f0: '#4a4d53', f1: '#26282c', f2: '#0e0f10', w0: '#26282b', w1: '#060607', bevel: '#7d828a', tLo: '#0b0c0d', tHi: '#575b62', pad: '#45484e' };

  const templeFill = (f: Face): string => mix(SOL.tLo, SOL.tHi, 0.18 + 0.82 * f.light);
  const tone = (f: Face): string => (f.light > 0.62 ? 'var(--g-frame-1)' : f.light > 0.3 ? 'var(--g-frame-2)' : 'var(--g-frame-3)');

  const wordEl = (color: string) =>
    showWord ? (
      <g transform={dm}>
        <text
          x={0}
          y={0.2}
          fill={color}
          fontSize={fitWord(word, dw)}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: 'var(--font-text, system-ui, sans-serif)', letterSpacing: '0.01em' }}
        >
          {word}
        </text>
        {fixation ? <circle cx={0} cy={-dh / 2 + 1.05} r={0.5} fill={RED} /> : null}
      </g>
    ) : null;

  /* -------- SOLID: product shot -------- */
  const solid = (
    <g className={s.layer} style={{ opacity: mode === 'solid' ? 1 : 0 }}>
      <g filter={`url(#${id('blur')})`}>
        <path d={g.shadow[0]} fill="#000" fillOpacity={dark ? 0.5 : 0.1} />
        <path d={g.shadow[1]} fill="#000" fillOpacity={dark ? 0.8 : 0.3} />
      </g>
      {g.temples.map((faces, ti) => (
        <g key={ti}>
          {faces.map((f, i) => (
            <path key={i} d={f.d} fill={templeFill(f)} stroke={templeFill(f)} strokeWidth={0.15} strokeLinejoin="round" />
          ))}
        </g>
      ))}
      {g.pads.map((d, i) => (
        <path key={i} d={d} fill={SOL.pad} />
      ))}
      <g fill={`url(#${id('wall')})`}>{copies(1, LENS_T).map((t) => faceCopy(t))}</g>
      {/* lenses: tint, then one soft reflection band */}
      <path d={g.lensL} fill={`url(#${id('tint')})`} />
      <path d={g.lensR} fill={`url(#${id('tint')})`} />
      <path d={g.lensL} fill={`url(#${id('reflect')})`} />
      <path d={g.lensR} fill={`url(#${id('reflect')})`} />
      {showWord ? (
        <g style={{ opacity: g.display.visible }}>
          <rect transform={dm} x={-dw / 2} y={-dh / 2} width={dw} height={dh} rx={0.9} fill="#050807" fillOpacity={dark ? 0.3 : 0.5} />
          <rect
            transform={dm}
            x={-dw / 2}
            y={-dh / 2}
            width={dw}
            height={dh}
            rx={1.1}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.06}
            strokeWidth={0.2}
          />
          {wordEl(wordColor)}
        </g>
      ) : null}
      <g fill={`url(#${id('wall')})`}>{copies(LENS_T, 0).map((t) => faceCopy(t))}</g>
      {/* front face: bevel light on upward edges, the face, a broad sheen */}
      <use href={faceRef} fill={SOL.bevel} />
      <use href={faceRef} fill={`url(#${id('face')}g)`} transform="translate(0 0.3)" />
      <use href={faceRef} fill={`url(#${id('sheen')})`} transform="translate(0 0.3)" />
    </g>
  );

  /* -------- LINE: anatomy line art -------- */
  const templeUnion = (faces: readonly Face[], key: number) => (
    <g key={key}>
      <Union>{() => faces.map((f, i) => <path key={i} d={f.d} {...nsProps} />)}</Union>
      {faces.map((f, i) => (
        <Union key={i}>{() => <path d={f.d} {...nsProps} />}</Union>
      ))}
    </g>
  );
  const line = (
    <g className={s.layer} style={{ opacity: mode === 'line' ? 1 : 0 }}>
      <g className={s.group} style={{ opacity: dim('frame') }}>
        {g.temples.map((faces, i) => templeUnion(faces, i))}
        <Union>{() => g.pads.map((d, i) => <path key={i} d={d} {...nsProps} />)}</Union>
        <Union>{() => copies(1, -1).map((t) => faceCopy(t))}</Union>
        <Union>{() => <use href={faceRef} />}</Union>
      </g>
      <g className={s.group} style={{ opacity: dim('display') * (g.display.visible || 0) }}>
        <rect
          transform={dm}
          x={-dw / 2}
          y={-dh / 2}
          width={dw}
          height={dh}
          rx={1.1}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1}
          {...nsProps}
        />
        {wordEl(wordColor)}
      </g>
    </g>
  );

  /* -------- EXPLODED: flat bodies in group hues -------- */
  const lensBack: P2 = [g.depth[0] * 0.38, g.depth[1] * 0.38];
  const slab: P2 = [g.depth[0] * 0.5, g.depth[1] * 0.5];
  const displayRect = (extra: Record<string, unknown>) => (
    <rect transform={dm} x={-dw / 2} y={-dh / 2} width={dw} height={dh} rx={1.1} {...extra} />
  );
  const explodedLayer = (
    <g className={s.layer} style={{ opacity: exploded ? 1 : 0, color: 'var(--g-outline)' }}>
      <g className={s.group} style={{ opacity: dim('frame') }}>
        {g.temples.map((faces, ti) => (
          <Union key={ti} fills={faces.map((f, i) => <path key={i} d={f.d} fill={tone(f)} stroke={tone(f)} strokeWidth={0.15} />)}>
            {() => faces.map((f, i) => <path key={i} d={f.d} {...nsProps} />)}
          </Union>
        ))}
        <Union fills={g.pads.map((d, i) => <path key={i} d={d} fill="var(--g-frame-2)" />)}>
          {() => g.pads.map((d, i) => <path key={i} d={d} {...nsProps} />)}
        </Union>
        <Union
          fills={
            <>
              <g fill="var(--g-frame-3)">{copies(1, -1).map((t) => faceCopy(t))}</g>
              <use href={faceRef} fill="var(--g-frame-1)" />
              <use href={faceRef} fill="var(--g-frame-2)" transform="translate(0 0.5)" />
            </>
          }
        >
          {() => copies(1, -1).map((t) => faceCopy(t))}
        </Union>
      </g>
      <g className={s.group} style={{ opacity: dim('optics'), transform: exploded ? tr(L.move.optics) : 'none' }}>
        <Union
          fills={
            <>
              <path d={g.lensR} fill="var(--g-optics-3)" transform={`translate(${lensBack[0]} ${lensBack[1]})`} />
              <path d={g.lensR} fill="var(--g-optics-2)" />
              <path d={g.lensR} fill="var(--g-optics-1)" transform="translate(0 0.6)" />
            </>
          }
        >
          {() => (
            <>
              <path d={g.lensR} transform={`translate(${lensBack[0]} ${lensBack[1]})`} {...nsProps} />
              <path d={g.lensR} {...nsProps} />
            </>
          )}
        </Union>
      </g>
      <g className={s.group} style={{ opacity: dim('display'), transform: exploded ? tr(L.move.display) : 'none' }}>
        <g style={{ opacity: g.display.visible }}>
          <Union
            fills={
              <>
                <g transform={`translate(${slab[0]} ${slab[1]})`}>{displayRect({ fill: 'var(--g-display-2)' })}</g>
                {displayRect({ fill: 'var(--g-display-1)' })}
                <g transform="translate(0 0.4)">{displayRect({ fill: 'var(--g-display-3)' })}</g>
              </>
            }
          >
            {() => (
              <>
                <g transform={`translate(${slab[0]} ${slab[1]})`}>{displayRect(nsProps)}</g>
                {displayRect(nsProps)}
              </>
            )}
          </Union>
          {wordEl(wordColor)}
        </g>
      </g>
      {(['timing', 'control'] as const).map((k) => {
        const b = L.boxes[k];
        const hue = `var(--g-${k})`;
        const cx = b.x + b.w / 2;
        const cy = b.y + b.h / 2;
        return (
          <g key={k} className={s.group} style={{ opacity: exploded ? dim(k) : 0 }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2.4} fill={hue} fillOpacity={0.12} stroke={hue} strokeWidth={OUTLINE} strokeDasharray="4 3" {...nsProps} />
            <g stroke={hue} strokeWidth={OUTLINE} strokeLinecap="round" fill="none">
              {k === 'timing' ? (
                [-7.5, -2.5, 2.5, 7.5].map((x, i) => (
                  <path key={i} d={`M${cx + x - 1.6} ${cy + 2.4}H${cx + x + 1.6}M${cx + x} ${cy + 2.4}V${cy - 2.4 + (i % 2) * 1.6}`} {...nsProps} />
                ))
              ) : (
                <>
                  <path d={`M${cx - 6} ${cy - 2.6}V${cy + 2.6}M${cx - 3.4} ${cy - 2.6}V${cy + 2.6}`} {...nsProps} />
                  <path d={`M${cx + 1.6} ${cy - 2.8}L${cx + 6.4} ${cy}L${cx + 1.6} ${cy + 2.8}Z`} fill={hue} fillOpacity={0.35} strokeLinejoin="round" {...nsProps} />
                </>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );

  /* -------- labels (HTML, positioned in % of the viewBox) -------- */
  const pct = (p: P2): CSSProperties => ({ left: `${((p[0] - vb.x) / vb.w) * 100}%`, top: `${((p[1] - vb.y) / vb.h) * 100}%` });
  const ANCHOR = { left: 'translate(0, -50%)', below: 'translate(-50%, 0)', above: 'translate(0, -100%)' } as const;
  const SWATCH: Record<SystemGroupId, string> = {
    frame: 'var(--g-frame-2)',
    optics: 'var(--g-optics-2)',
    display: 'var(--g-display-2)',
    timing: 'var(--g-timing)',
    control: 'var(--g-control)',
  };

  return (
    <div
      className={`${s.root} ${dark ? s.dark : s.light}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio: `${vb.w.toFixed(2)} / ${vb.h.toFixed(2)}` }}
      role="img"
      aria-label={title}
    >
      <svg className={s.svg} viewBox={`${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`} aria-hidden="true" focusable="false">
        <defs>
          <path id={id('face')} d={g.face} vectorEffect="non-scaling-stroke" />
          <filter id={id('blur')} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation={2.2} />
          </filter>
          <linearGradient id={`${id('face')}g`} gradientUnits="userSpaceOnUse" x1={0} y1={fb.y} x2={0} y2={fb.y + fb.h}>
            <stop offset="0" stopColor={SOL.f0} />
            <stop offset="0.42" stopColor={SOL.f1} />
            <stop offset="1" stopColor={SOL.f2} />
          </linearGradient>
          <linearGradient id={id('wall')} gradientUnits="userSpaceOnUse" x1={0} y1={fb.y} x2={0} y2={fb.y + fb.h}>
            <stop offset="0" stopColor={SOL.w0} />
            <stop offset="1" stopColor={SOL.w1} />
          </linearGradient>
          <linearGradient id={id('sheen')} gradientUnits="userSpaceOnUse" x1={fb.x} y1={fb.y} x2={fb.x + fb.w} y2={fb.y + fb.h}>
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.3" stopColor="#fff" stopOpacity={0.09} />
            <stop offset="0.48" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.7" stopColor="#fff" stopOpacity={0.04} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={id('tint')} gradientUnits="userSpaceOnUse" x1={0} y1={fb.y} x2={0} y2={fb.y + fb.h}>
            {dark ? (
              <>
                <stop offset="0" stopColor="#9aa8b8" stopOpacity={0.16} />
                <stop offset="1" stopColor="#0a0c10" stopOpacity={0.55} />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#3b4552" stopOpacity={0.16} />
                <stop offset="1" stopColor="#1a1e24" stopOpacity={0.34} />
              </>
            )}
          </linearGradient>
          <linearGradient id={id('reflect')} x1={0} y1={0} x2={0.7} y2={1}>
            <stop offset="0.2" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.34" stopColor="#fff" stopOpacity={dark ? 0.12 : 0.3} />
            <stop offset="0.44" stopColor="#fff" stopOpacity={dark ? 0.035 : 0.09} />
            <stop offset="0.58" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        {solid}
        {line}
        {explodedLayer}
      </svg>
      {(Object.keys(L.labels) as SystemGroupId[]).map((k) => {
        const lab = L.labels[k];
        const off = k === 'timing' || k === 'control';
        const hidden = (k === 'display' || k === 'optics') && g.display.visible === 0;
        return (
          <span
            key={k}
            className={s.label}
            aria-hidden="true"
            style={{ ...pct(lab.at), transform: ANCHOR[lab.anchor], opacity: exploded && !hidden ? dim(k) : 0 }}
          >
            <i
              className={`${s.swatch}${off ? ` ${s.swatchDashed}` : ''}`}
              style={off ? { borderColor: SWATCH[k] } : { background: SWATCH[k] }}
            />
            {LABEL[k]}
          </span>
        );
      })}
    </div>
  );
}
