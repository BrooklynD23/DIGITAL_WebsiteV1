'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import { systemGroups, type SystemGroup } from '../_content/shades-concept';
import { VIEW_ANGLES, draw, type Box, type Drawing, type Face, type P2, type Slab, type ViewName } from './geometry';
import s from './glasses.module.css';

/**
 * SHADES glasses, drawn in code. One original frame, three renderings of the same geometry:
 *   solid     a product shot: graphite acetate with tone-stepped occlusion faces, tinted lenses, one contact shadow
 *   line      anatomy line art: 1.25px union outlines (no stray segments at joints), creases at the same weight
 *   exploded  flat solid bodies in their group hue (2–3 tone steps, 1.25px outline); display rises, optics drop;
 *             word timing and control drawn off the frame, dashed, because no source places them; with `tether`
 *             they are solid modules lifted out of the controller box, which places them
 * Switching mode crossfades; entering `exploded` also slides the parts out and fades the labels in (CSS, off under
 * reduced motion). Labels exist only in `exploded`, so they never add scrollable overflow in other modes.
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
  /** Draw the wired setup: a cable from the end of the right temple to the external controller box
   *  (compute and power live in the box; no software runs on the glasses). The root's aspect ratio grows
   *  to fit the box only when this is on. Exploded: word timing and control become modules of the box.
   *  Default false: output and aspect ratio are unchanged. */
  readonly tether?: boolean;
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

const union = (a: Box, b: Box): Box => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
};
/** Room kept right of a tether module for its label, viewBox units. */
const TETHER_LABEL_ROOM = 58;

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
  // A narrow front (the side view) has no room for two boxes side by side: stack them, labels centred below.
  const stack = fb.w < 2 * bw + 40;
  const bcx = stack ? lr.x - 12 - bw / 2 : Math.min(ll.x + ll.w / 2, lr.x - 10 - bw - 6);
  const boxes = stack
    ? { timing: { x: bcx - bw / 2, y: by, w: bw, h: bh }, control: { x: bcx - bw / 2, y: by + bh + 22, w: bw, h: bh } }
    : { timing: { x: bcx - bw - 6, y: by, w: bw, h: bh }, control: { x: bcx + 6, y: by, w: bw, h: bh } };
  const dx = g.displayAt[0];
  const dy = g.displayAt[1] + display[1];
  const t = g.tether;
  const modLabel = (k: 'timing' | 'control'): { at: P2; anchor: 'left' | 'below' } =>
    t
      ? { at: [t.moduleEnd[k][0] + t.lift[k][0] + 5, t.moduleEnd[k][1] + t.lift[k][1]], anchor: 'left' }
      : { at: [boxes[k].x + bw / 2, boxes[k].y + bh + 3], anchor: 'below' };
  const labels: Layout['labels'] = {
    frame: { at: [fb.x + 2, fb.y - 3], anchor: 'above' },
    display: { at: [dx + 13, dy], anchor: 'left' },
    optics: { at: [lr.x + lr.w / 2, lr.y + lr.h + optics[1] + 3], anchor: 'below' },
    timing: modLabel('timing'),
    control: modLabel('control'),
  };
  const b = t ? union(g.box, t.bounds) : g.box;
  let vb: Box;
  if (fit === 'object') {
    const p = Math.max(b.w, b.h) * 0.04;
    vb = { x: b.x - p, y: b.y - p, w: b.w + 2 * p, h: b.h + 2 * p };
  } else if (t) {
    const e = t.explodedBounds;
    const x0 = Math.min(b.x, e.x) - 6;
    const xr = Math.max(b.x + b.w, e.x + e.w, lr.x + lr.w + 4, dx + 46);
    const room = Math.max(TETHER_LABEL_ROOM, (xr - x0) * 0.27);
    const x1 = Math.max(xr, labels.timing.at[0] + room, labels.control.at[0] + room) + 4;
    const y0 = Math.min(b.y, e.y, dy - dispHalfH - 6, fb.y - 12) - 4;
    const y1 = Math.max(b.y + b.h, e.y + e.h, lr.y + lr.h + optics[1] + 12) + 4;
    vb = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  } else {
    const x0 = Math.min(b.x, boxes.timing.x) - 6;
    const x1 = Math.max(b.x + b.w, lr.x + lr.w + 4, dx + 46) + 4;
    const y0 = Math.min(b.y, dy - dispHalfH - 6, fb.y - 12) - 4;
    const y1 = Math.max(b.y + b.h, lr.y + lr.h + optics[1] + 12, boxes.control.y + bh + 12) + 4;
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
  tether = false,
  className,
  title,
}: GlassesProps) {
  const uid = useId().replace(/:/g, '');
  const id = (k: string): string => `g${uid}${k}`;
  const angles = VIEW_ANGLES[view];
  const g = draw(yaw ?? angles.yaw, angles.pitch, tether);
  const T = g.tether;
  // Near-frontal views: perspective pulls the temple end inside the lens, so the cable would show through the
  // lens hole as a stray line. Hide it behind the front, as the temples drop their ear bend there.
  const cableMask = T && Math.abs(yaw ?? angles.yaw) < 15 ? `url(#${id('cablemask')})` : undefined;
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
    ? { f0: '#55595f', f1: '#2b2d31', f2: '#111214', w0: '#2a2c30', w1: '#08090a', bevel: '#767b83', tLo: '#16171a', tHi: '#71767e', pad: '#2e3034', cable: '#1b1c1f' }
    : { f0: '#4a4d53', f1: '#26282c', f2: '#0e0f10', w0: '#26282b', w1: '#060607', bevel: '#7d828a', tLo: '#0b0c0d', tHi: '#575b62', pad: '#45484e', cable: '#17181a' };

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
        {T ? <path d={T.shadow} fill="#000" fillOpacity={dark ? 0.75 : 0.22} /> : null}
      </g>
      {T ? (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" mask={cableMask}>
          <path d={T.cable} stroke={SOL.cable} strokeWidth={T.width} />
          <path d={T.cable} stroke="#fff" strokeOpacity={dark ? 0.1 : 0.16} strokeWidth={T.width * 0.28} transform={`translate(0 ${-T.width * 0.24})`} />
          <path d={T.boot} stroke={SOL.cable} strokeWidth={T.bootWidth} />
        </g>
      ) : null}
      {g.temples.map((faces, ti) => (
        <g key={ti}>
          {faces.map((f, i) => (
            <path key={i} d={f.d} fill={templeFill(f)} stroke={templeFill(f)} strokeWidth={0.15} strokeLinejoin="round" />
          ))}
        </g>
      ))}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {g.seams.map((d, i) => (
          <g key={i}>
            <path d={d} stroke={SOL.tHi} strokeOpacity={0.55} strokeWidth={0.32} transform="translate(0 0.28)" />
            <path d={d} stroke="#000" strokeOpacity={0.75} strokeWidth={0.32} />
          </g>
        ))}
      </g>
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
      {T ? (
        <g>
          <path d={T.box.hull} fill={SOL.tLo} />
          {T.box.sides.map((f, i) => (
            <path key={i} d={f.d} fill={templeFill(f)} stroke={templeFill(f)} strokeWidth={0.15} strokeLinejoin="round" />
          ))}
          <path d={T.box.top} fill={mix(SOL.tLo, SOL.tHi, 0.1 + 0.6 * T.box.topLight)} />
          <path d={T.box.top} fill={`url(#${id('boxsheen')})`} />
          {T.ports.map((d, i) => (
            <path key={i} d={d} fill="#040405" stroke={SOL.bevel} strokeOpacity={0.35} strokeWidth={0.25} />
          ))}
        </g>
      ) : null}
    </g>
  );

  /* -------- LINE: anatomy line art -------- */
  const seamLines = (
    <g fill="none" stroke="currentColor" strokeWidth={OUTLINE * 0.8} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.8}>
      {g.seams.map((d, i) => (
        <path key={i} d={d} {...nsProps} />
      ))}
    </g>
  );
  const templeUnion = (faces: readonly Face[], key: number) => (
    <g key={key}>
      <Union>{() => faces.map((f, i) => <path key={i} d={f.d} {...nsProps} />)}</Union>
      {faces.map((f, i) => (
        <Union key={i}>{() => <path d={f.d} {...nsProps} />}</Union>
      ))}
    </g>
  );
  /** Tube outline: a wide currentColor stroke, the ground stroke inside it. */
  const cableTube = (fill: string, open = false) =>
    T ? (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" mask={cableMask}>
        <path d={open ? T.cableOpen : T.cable} stroke="currentColor" strokeWidth={T.width + OUTLINE * 1.6} />
        {[T.boot, ...(open ? [T.plug] : [])].map((d) => (
          <path key={d} d={d} stroke="currentColor" strokeWidth={T.bootWidth + OUTLINE * 1.6} />
        ))}
        <path d={open ? T.cableOpen : T.cable} stroke={fill} strokeWidth={T.width - OUTLINE * 0.4} />
        {[T.boot, ...(open ? [T.plug] : [])].map((d) => (
          <path key={d} d={d} stroke={fill} strokeWidth={T.bootWidth - OUTLINE * 0.4} />
        ))}
      </g>
    ) : null;
  /** One clean silhouette from the hull, then the strips and the top; the top's edge is the one crease. */
  const slabUnion = (sl: Slab, fill?: (f: Face) => string, top?: string) => (
    <>
      <path d={sl.hull} fill={fill ? top : 'var(--gg)'} stroke="currentColor" strokeWidth={OUTLINE * 2} strokeLinejoin="round" {...nsProps} />
      {fill
        ? sl.sides.map((f, i) => <path key={i} d={f.d} fill={fill(f)} stroke={fill(f)} strokeWidth={0.2} strokeLinejoin="round" />)
        : null}
      <path d={sl.hull} fill={fill ? 'none' : 'var(--gg)'} />
      {fill ? <path d={sl.top} fill={top} /> : null}
      <path d={sl.top} fill="none" stroke="currentColor" strokeWidth={OUTLINE} strokeLinejoin="round" {...nsProps} />
    </>
  );
  const tetherLine = T ? (
    <>
      {slabUnion(T.box)}
      {T.ports.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={OUTLINE} {...nsProps} />
      ))}
    </>
  ) : null;
  const line = (
    <g className={s.layer} style={{ opacity: mode === 'line' ? 1 : 0 }}>
      {T ? <g className={s.group} style={{ opacity: highlight ? 0.3 : 1 }}>{cableTube('var(--gg)')}</g> : null}
      <g className={s.group} style={{ opacity: dim('frame') }}>
        {g.temples.map((faces, i) => templeUnion(faces, i))}
        {seamLines}
        <Union>{() => g.pads.map((d, i) => <path key={i} d={d} {...nsProps} />)}</Union>
        <Union>{() => copies(1, -1).map((t) => faceCopy(t))}</Union>
        <Union>{() => <use href={faceRef} />}</Union>
      </g>
      {T ? <g className={s.group} style={{ opacity: highlight ? 0.3 : 1 }}>{tetherLine}</g> : null}
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
  const lensBack: P2 = [g.depth[0] * 0.26, g.depth[1] * 0.26];
  const slab: P2 = [g.depth[0] * 0.5, g.depth[1] * 0.5];
  const displayRect = (extra: Record<string, unknown>) => (
    <rect transform={dm} x={-dw / 2} y={-dh / 2} width={dw} height={dh} rx={1.1} {...extra} />
  );
  const shade = (f: Face): number => 0.42 * (1 - f.light);
  const moduleSlab = (k: 'timing' | 'control') => {
    if (!T) return null;
    const sl = T.modules[k];
    const hue = `var(--g-${k})`;
    return (
      <g key={k} className={s.group} style={{ opacity: dim(k), transform: exploded ? tr(T.lift[k]) : 'none' }}>
        {slabUnion(sl, () => hue, hue)}
        {sl.sides.map((f, i) => (
          <path key={i} d={f.d} fill="#000" fillOpacity={shade(f)} />
        ))}
      </g>
    );
  };
  const tetherExploded = T ? (
    <>
      <g className={s.group} style={{ opacity: highlight ? 0.3 : 1, transform: exploded ? tr(T.lift.body) : 'none' }}>
        {slabUnion(T.body, tone, 'var(--g-frame-1)')}
        {T.ports.map((d, i) => (
          <path key={i} d={d} fill="var(--g-frame-3)" stroke="currentColor" strokeWidth={OUTLINE} {...nsProps} />
        ))}
      </g>
      {moduleSlab('control')}
      {moduleSlab('timing')}
      <g className={s.group} style={{ opacity: highlight ? 0.3 : 1 }}>
        {slabUnion(T.lid, tone, 'var(--g-frame-1)')}
      </g>
    </>
  ) : null;
  const explodedLayer = (
    <g className={s.layer} style={{ opacity: exploded ? 1 : 0, color: 'var(--g-outline)' }}>
      {T ? <g className={s.group} style={{ opacity: highlight ? 0.3 : 1 }}>{cableTube('var(--g-frame-2)', true)}</g> : null}
      <g className={s.group} style={{ opacity: dim('frame') }}>
        {g.temples.map((faces, ti) => (
          <Union key={ti} fills={faces.map((f, i) => <path key={i} d={f.d} fill={tone(f)} stroke={tone(f)} strokeWidth={0.15} />)}>
            {() => faces.map((f, i) => <path key={i} d={f.d} {...nsProps} />)}
          </Union>
        ))}
        {seamLines}
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
              <path d={g.holeR} fill="var(--g-optics-2)" transform={`translate(${lensBack[0]} ${lensBack[1]})`} />
              <path d={g.holeR} fill="var(--g-optics-1)" />
              <path d={g.holeR} fill={`url(#${id('reflect')}x)`} />
            </>
          }
        >
          {() => (
            <>
              <path d={g.holeR} transform={`translate(${lensBack[0]} ${lensBack[1]})`} {...nsProps} />
              <path d={g.holeR} {...nsProps} />
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
      {tetherExploded}
      {(T ? [] : (['timing', 'control'] as const)).map((k) => {
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
          {cableMask ? (
            <mask id={id('cablemask')} maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
              <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="#fff" />
              <g fill="#000">
                <path d={g.face} />
                <path d={g.lensR} />
                <path d={g.lensL} />
              </g>
            </mask>
          ) : null}
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
          <linearGradient id={id('boxsheen')} x1={0} y1={0} x2={1} y2={1}>
            <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.07 : 0.1} />
            <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id('reflect')}x`} x1={0} y1={0} x2={0.7} y2={1}>
            <stop offset="0.28" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.28" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="0.35" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={id('tint')} gradientUnits="userSpaceOnUse" x1={0} y1={fb.y} x2={0} y2={fb.y + fb.h}>
            {dark ? (
              <>
                <stop offset="0" stopColor="#9aa8b8" stopOpacity={0.16} />
                <stop offset="1" stopColor="#0a0c10" stopOpacity={0.55} />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#8ea9c4" stopOpacity={0.24} />
                <stop offset="1" stopColor="#5a7894" stopOpacity={0.3} />
              </>
            )}
          </linearGradient>
          <linearGradient id={id('reflect')} x1={0} y1={0} x2={0.7} y2={1}>
            {dark ? (
              <>
                <stop offset="0.2" stopColor="#fff" stopOpacity={0} />
                <stop offset="0.34" stopColor="#fff" stopOpacity={0.12} />
                <stop offset="0.44" stopColor="#fff" stopOpacity={0.035} />
                <stop offset="0.58" stopColor="#fff" stopOpacity={0} />
              </>
            ) : (
              <>
                {/* clear glass on paper: two crisp bands, hard edged */}
                <stop offset="0.27" stopColor="#fff" stopOpacity={0} />
                <stop offset="0.27" stopColor="#fff" stopOpacity={0.62} />
                <stop offset="0.335" stopColor="#fff" stopOpacity={0.62} />
                <stop offset="0.335" stopColor="#fff" stopOpacity={0} />
                <stop offset="0.37" stopColor="#fff" stopOpacity={0} />
                <stop offset="0.37" stopColor="#fff" stopOpacity={0.4} />
                <stop offset="0.385" stopColor="#fff" stopOpacity={0.4} />
                <stop offset="0.385" stopColor="#fff" stopOpacity={0} />
              </>
            )}
          </linearGradient>
        </defs>
        {solid}
        {line}
        {explodedLayer}
      </svg>
      {(Object.keys(L.labels) as SystemGroupId[]).map((k) => {
        const lab = L.labels[k];
        const off = !T && (k === 'timing' || k === 'control');
        const hidden = (k === 'display' || k === 'optics') && g.display.visible === 0;
        // Not rendered while hidden: an invisible label would still widen the page's scrollable overflow.
        if (!exploded || hidden) return null;
        return (
          <span
            key={k}
            className={s.label}
            aria-hidden="true"
            style={{ ...pct(lab.at), transform: ANCHOR[lab.anchor], opacity: dim(k) }}
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
