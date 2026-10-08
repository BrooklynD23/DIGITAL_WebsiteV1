/**
 * BoardSvg — line-art renderer for the club's real KiCad board geometry (see ./index.ts).
 * Pure + hook-free: safe in server and client components, no rAF. Colour comes from currentColor and
 * optional CSS custom properties, so the same drawing fits a dark graticule world or a light Apple world:
 *   --board-ink, --board-copper, --board-silk, --board-substrate, --board-hole (default: currentColor / none)
 * Each layer is its own <g data-layer>; `explode` (0..1) separates them along Z for the scroll teardown.
 */
import type { CSSProperties, ReactNode } from 'react';
import type { BoardData, BoardPad, Side } from './types';

export const BOARD_LAYERS = ['B.Silk', 'B.Pads', 'B.Cu', 'substrate', 'edge', 'vias', 'F.Cu', 'F.Pads', 'F.Silk', 'bodies'] as const;
export type BoardLayer = (typeof BOARD_LAYERS)[number];

/** Focus states: which layers stay at full strength; the rest recede. */
export const BOARD_STATES = {
  assembled: null,
  outline: ['substrate', 'edge'],
  copper: ['B.Cu', 'F.Cu', 'vias', 'F.Pads', 'B.Pads'],
  parts: ['F.Pads', 'B.Pads', 'bodies', 'F.Silk', 'B.Silk'],
} as const satisfies Record<string, ReadonlyArray<BoardLayer> | null>;
export type BoardState = keyof typeof BOARD_STATES;

/** Default set: everything except component bodies (bodies are courtyard boxes, not real 3D models). */
const DEFAULT_LAYERS: ReadonlyArray<BoardLayer> = BOARD_LAYERS.filter((l) => l !== 'bodies');

/** Z tier per layer, in units of the explode gap. */
const TIER: Record<BoardLayer, number> = {
  'B.Silk': -2.4,
  'B.Pads': -1.6,
  'B.Cu': -1,
  substrate: 0,
  edge: 0,
  vias: 0,
  'F.Cu': 1,
  'F.Pads': 1.6,
  'F.Silk': 2.4,
  bodies: 3.2,
};

const LABEL: Record<BoardLayer, string> = {
  'B.Silk': 'Back silkscreen',
  'B.Pads': 'Back pads',
  'B.Cu': 'Back copper',
  substrate: 'FR-4 substrate',
  edge: 'Board edge',
  vias: 'Vias',
  'F.Cu': 'Front copper',
  'F.Pads': 'Front pads',
  'F.Silk': 'Front silkscreen',
  bodies: 'Part courtyards',
};

const ISO = 'matrix(0.866 0.5 -0.866 0.5 0 0)';
const COS30 = 0.866;
const FLAT_DX = 0.5;
const FLAT_DY = -0.6;
const DIM = 0.16;

export interface BoardSvgProps {
  readonly board: BoardData;
  readonly layers?: ReadonlyArray<BoardLayer>;
  /** 0 = assembled, 1 = fully separated along Z. */
  readonly explode?: number;
  /** 30° isometric projection (same matrix as concept E's PhoneSchematic). */
  readonly iso?: boolean;
  readonly state?: BoardState;
  /** Explode gap per tier in mm (default 28% of the board's long side). */
  readonly gap?: number;
  /** Layer names beside each tier (iso/exploded views). */
  readonly labels?: boolean;
  /** Also draw footprints parked beside the board (not yet placed in the layout). Default false. */
  readonly parked?: boolean;
  /** Keep the viewBox sized for explode=1 so scrubbing never rescales the drawing (default true). */
  readonly stableFrame?: boolean;
  readonly title?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const ink = 'var(--board-ink, currentColor)';
const copper = 'var(--board-copper, currentColor)';
const silkInk = 'var(--board-silk, currentColor)';
const NS = { vectorEffect: 'non-scaling-stroke' } as const;

function project(x: number, y: number, z: number, iso: boolean): [number, number] {
  return iso ? [COS30 * (x - y), 0.5 * (x + y) - z] : [x + FLAT_DX * z, y + FLAT_DY * z];
}

function padShape(p: BoardPad, key: number): ReactNode {
  const t = p.a ? `rotate(${-p.a} ${p.x} ${p.y})` : undefined;
  if (p.s === 'circle') return <circle key={key} cx={p.x} cy={p.y} r={p.w / 2} />;
  const m = Math.min(p.w, p.h);
  const rx = p.s === 'oval' ? m / 2 : p.s === 'roundrect' ? (p.rr ?? 0.25) * m : 0;
  return <rect key={key} x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx={rx} transform={t} />;
}

function padsFor(board: BoardData, side: Side): ReactNode {
  const pads = board.footprints.flatMap((f) => f.pads.filter((p) => p.l === side || p.l === 'FB'));
  const holes = pads.filter((p) => p.d);
  return (
    <>
      <g fill={copper} fillOpacity={0.55} stroke={copper} strokeWidth={0.6} {...NS}>
        {pads.map(padShape)}
      </g>
      {holes.length > 0 && (
        <g fill="var(--board-hole, none)" stroke={ink} strokeWidth={0.6} {...NS}>
          {holes.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={(p.d ?? 0) / 2} />)}
        </g>
      )}
    </>
  );
}

function copperFor(board: BoardData, side: Side): ReactNode {
  return (
    <>
      <g fill={copper} fillOpacity={0.1} stroke={copper} strokeOpacity={0.45} strokeWidth={0.5} {...NS}>
        {board.zones.filter((z) => z.l === side).map((z, i) => (
          <path key={i} d={z.d} fill={z.filled ? undefined : 'none'} strokeDasharray={z.filled ? undefined : '3 3'} />
        ))}
      </g>
      <g fill="none" stroke={copper} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.9}>
        {board.tracks.filter((t) => t.l === side).map((t, i) => <path key={i} d={t.d} strokeWidth={t.w} />)}
      </g>
    </>
  );
}

function layerContent(board: BoardData, layer: BoardLayer): ReactNode {
  switch (layer) {
    case 'substrate':
      return <path d={[board.outline, ...board.cutouts].join('')} fill="var(--board-substrate, currentColor)" fillOpacity={0.07} fillRule="evenodd" />;
    case 'edge': {
      const npth = board.footprints.flatMap((f) => f.pads.filter((p) => p.l === 'H'));
      return (
        <g fill="none" stroke={ink} {...NS}>
          <path d={[board.outline, ...board.cutouts].join('')} strokeWidth={1.25} {...NS} />
          {npth.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={(p.d ?? p.w) / 2} strokeWidth={0.75} {...NS} />)}
        </g>
      );
    }
    case 'B.Cu':
      return copperFor(board, 'B');
    case 'F.Cu':
      return copperFor(board, 'F');
    case 'B.Pads':
      return padsFor(board, 'B');
    case 'F.Pads':
      return padsFor(board, 'F');
    case 'B.Silk':
      return board.silk.B ? <path d={board.silk.B} fill="none" stroke={silkInk} strokeOpacity={0.7} strokeWidth={0.75} {...NS} /> : null;
    case 'F.Silk':
      return board.silk.F ? <path d={board.silk.F} fill="none" stroke={silkInk} strokeOpacity={0.7} strokeWidth={0.75} {...NS} /> : null;
    case 'vias':
      return (
        <g fill="var(--board-hole, none)" stroke={copper} strokeWidth={0.75} {...NS}>
          {board.vias.map(([x, y, size, drill], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={size / 2} />
              <circle cx={x} cy={y} r={drill / 2} strokeOpacity={0.6} />
            </g>
          ))}
        </g>
      );
    case 'bodies':
      return (
        <g fill="none" stroke={ink} strokeOpacity={0.55} strokeWidth={0.6} strokeDasharray="2 2" {...NS}>
          {board.footprints.filter((f) => f.body).map((f, i) => (
            <path key={i} d={`M${f.body!.map((p) => p.join(' ')).join('L')}Z`} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

/** Z offset of a layer at the current explode amount. */
function tierZ(layer: BoardLayer, gap: number, explode: number): number {
  return TIER[layer] * gap * explode;
}

export function BoardSvg({
  board: source,
  parked = false,
  layers = DEFAULT_LAYERS,
  explode = 0,
  iso = false,
  state = 'assembled',
  gap,
  labels = false,
  stableFrame = true,
  title,
  className,
  style,
}: BoardSvgProps) {
  // Effective board: parked (off-board) parts are excluded unless asked for.
  const board: BoardData = parked
    ? { ...source, silk: { F: source.silk.F + source.silkParked.F, B: source.silk.B + source.silkParked.B } }
    : { ...source, footprints: source.footprints.filter((f) => !f.parked) };
  const e = Math.min(1, Math.max(0, explode));
  const g = gap ?? Math.max(board.size.w, board.size.h) * 0.28;
  const active = BOARD_LAYERS.filter((l) => layers.includes(l));
  const focus = BOARD_STATES[state] as ReadonlyArray<BoardLayer> | null;
  const { w, h } = board.size;

  // Frame: project the board corners at the extreme tiers (at explode=1 when stableFrame).
  const frameE = stableFrame ? 1 : e;
  const zs = active.length ? active.map((l) => tierZ(l, g, frameE)) : [0];
  const padXs = board.footprints.flatMap((f) => f.pads.flatMap((p) => [p.x - p.w / 2, p.x + p.w / 2]));
  const padYs = board.footprints.flatMap((f) => f.pads.flatMap((p) => [p.y - p.h / 2, p.y + p.h / 2]));
  const [x0, x1] = [Math.min(0, ...padXs), Math.max(w, ...padXs)];
  const [y0, y1] = [Math.min(0, ...padYs), Math.max(h, ...padYs)];
  const pts = [Math.min(...zs), Math.max(...zs)].flatMap((z) =>
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => project(x, y, z, iso)),
  );
  const labelW = labels ? Math.max(w, h) * 0.9 : 0;
  const pad = Math.max(w, h) * 0.04;
  const minX = Math.min(...pts.map((p) => p[0])) - pad;
  const maxX = Math.max(...pts.map((p) => p[0])) + pad + labelW;
  const minY = Math.min(...pts.map((p) => p[1])) - pad;
  const maxY = Math.max(...pts.map((p) => p[1])) + pad;

  // Drill axes: every via and through-hole pad, drawn from back copper to front copper when exploded.
  const throughs: Array<[number, number]> = [
    ...board.vias.map(([x, y]) => [x, y] as [number, number]),
    ...board.footprints.flatMap((f) => f.pads.filter((p) => p.l === 'FB' || p.l === 'H').map((p) => [p.x, p.y] as [number, number])),
  ];
  const zTop = tierZ('F.Pads', g, e);
  const zBot = tierZ('B.Pads', g, e);
  const axes = throughs
    .map(([x, y]) => {
      const a = project(x, y, zBot, iso);
      const b = project(x, y, zTop, iso);
      return `M${a[0].toFixed(2)} ${a[1].toFixed(2)}L${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
    })
    .join('');

  const label = title ?? `${board.title}, ${w} by ${h} millimetres, from the club's KiCad file`;

  return (
    <svg
      viewBox={`${minX.toFixed(2)} ${minY.toFixed(2)} ${(maxX - minX).toFixed(2)} ${(maxY - minY).toFixed(2)}`}
      role="img"
      aria-label={label}
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      data-board={board.id}
      data-state={state}
      data-iso={iso ? '' : undefined}
    >
      <title>{label}</title>
      {e > 0.01 && throughs.length > 0 && (active.includes('vias') || active.includes('F.Pads')) && (
        <path data-layer="drill-axes" d={axes} fill="none" stroke={ink} strokeOpacity={0.3 * e} strokeWidth={0.6} strokeDasharray="1.5 2.5" {...NS} />
      )}
      {active.map((layer) => {
        const z = tierZ(layer, g, e);
        const shift = iso ? `translate(0 ${(-z).toFixed(3)})` : `translate(${(FLAT_DX * z).toFixed(3)} ${(FLAT_DY * z).toFixed(3)})`;
        const dim = focus && !focus.includes(layer) ? DIM : 1;
        const anchor = project(w, 0, 0, iso);
        return (
          <g key={layer} data-layer={layer} opacity={dim} transform={shift}>
            <g transform={iso ? ISO : undefined}>{layerContent(board, layer)}</g>
            {labels && e > 0.01 && layer !== 'edge' && layer !== 'vias' && (
              <text
                x={anchor[0] + pad * 1.5}
                y={anchor[1]}
                fontSize={Math.max(w, h) * 0.045}
                fill={ink}
                fillOpacity={e}
                dominantBaseline="middle"
                style={{ fontFamily: 'var(--board-label-font, ui-monospace, monospace)' }}
              >
                {LABEL[layer]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
