/**
 * BoardLayers — the real KiCad boards as a stack of static per-layer SVG files (public/boards/),
 * one composited box per layer. Prefer this over BoardSvg for large or animated figures:
 *   - no geometry in the HTML / RSC payload: props are ids and numbers, files are fetched + cached once;
 *   - exploding moves whole boxes with translate3d (compositor only), never paths inside one SVG.
 * Explode comes from the `explode` prop, or from an ancestor's CSS variable (`--board-explode`, else `--e`), so a
 * scroll driver can write one variable per frame without re-rendering. No transition on the transform: the scroll
 * position is the timebase. `will-change` is applied only while live (`live` prop, or an ancestor carrying
 * [data-board-live] or [data-exploding='true']).
 * Colour inherits like BoardSvg: currentColor + --board-ink/-copper/-silk/-substrate/-hole (via <use>, not <img>).
 * Hook-free: works in server and client components. Import this file directly (not ./index) from client code so
 * the board JSON never enters the client bundle.
 */
import type { CSSProperties } from 'react';
import manifest from './layers-manifest.json';
import s from './BoardLayers.module.css';

export const LAYER_IDS = ['B.Silk', 'B.Pads', 'B.Cu', 'substrate', 'edge', 'vias', 'F.Cu', 'F.Pads', 'F.Silk', 'bodies'] as const;
export type LayerId = (typeof LAYER_IDS)[number];
export type LayerBoardId = 'zynq-carrier-power' | 'fingerprint' | 'carrier';
export type LayerProj = 'flat' | 'iso';
export type LayerFocus = 'assembled' | 'outline' | 'copper' | 'parts';

interface ManifestEntry {
  readonly size: { readonly w: number; readonly h: number };
  readonly layers: ReadonlyArray<string>;
  readonly viewBox: Record<LayerProj, ReadonlyArray<number>>;
  readonly anchor: Record<LayerProj, ReadonlyArray<number>>;
}
const MANIFEST = manifest as unknown as Record<'zynq-carrier-power' | 'fingerprint', ManifestEntry>;

/** Z tier per layer in units of the gap (same as BoardSvg). */
export const LAYER_TIER: Record<LayerId, number> = {
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

const LABEL: Record<LayerId, string> = {
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

const FOCUS: Record<LayerFocus, ReadonlyArray<LayerId> | null> = {
  assembled: null,
  outline: ['substrate', 'edge'],
  copper: ['B.Cu', 'F.Cu', 'vias', 'F.Pads', 'B.Pads'],
  parts: ['F.Pads', 'B.Pads', 'bodies', 'F.Silk', 'B.Silk'],
};

const DEFAULT_LAYERS: ReadonlyArray<LayerId> = LAYER_IDS.filter((l) => l !== 'bodies');
const FLAT_DX = 0.5;
const FLAT_DY = -0.6;
const BASE = '/boards';

export const layerFile = (board: LayerBoardId, layer: LayerId, proj: LayerProj) =>
  `${BASE}/${board === 'carrier' ? 'zynq-carrier-power' : board}/${layer.toLowerCase().replace('.', '-')}-${proj}.svg`;

export interface BoardLayersProps {
  readonly board: LayerBoardId;
  readonly proj?: LayerProj;
  /** 0..1. Omit to read --board-explode (else --e) from an ancestor. */
  readonly explode?: number;
  readonly layers?: ReadonlyArray<LayerId>;
  readonly state?: LayerFocus;
  /** Gap per tier in board mm (default 28% of the long side, same as BoardSvg). */
  readonly gap?: number;
  readonly labels?: boolean;
  /** Size the box for explode = 1 so scrubbing never reflows (default true). */
  readonly stableFrame?: boolean;
  /** Promote layers (will-change: transform). Set only while the figure is being scrubbed. */
  readonly live?: boolean;
  readonly label?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const pct = (v: number) => `${v.toFixed(3)}%`;

export function BoardLayers({
  board,
  proj = 'iso',
  explode,
  layers = DEFAULT_LAYERS,
  state = 'assembled',
  gap,
  labels = false,
  stableFrame = true,
  live = false,
  label,
  className,
  style,
}: BoardLayersProps) {
  const id = board === 'carrier' ? 'zynq-carrier-power' : board;
  const m = MANIFEST[id];
  const [vx, vy, vw, vh] = m.viewBox[proj];
  const g = gap ?? Math.max(m.size.w, m.size.h) * 0.28;
  const active = LAYER_IDS.filter((l) => layers.includes(l) && m.layers.includes(l));
  const focus = FOCUS[state];
  const off = (t: number): [number, number] => (proj === 'iso' ? [0, -t * g] : [FLAT_DX * t * g, FLAT_DY * t * g]);

  // Frame = base viewBox shifted to the extreme tiers (explode = 1), plus a label column.
  const tiers = stableFrame && active.length ? active.map((l) => LAYER_TIER[l]) : [0];
  const shifts = [Math.min(...tiers), Math.max(...tiers)].map(off);
  const fx = Math.min(...shifts.map((o) => vx + o[0]));
  const fy = Math.min(...shifts.map((o) => vy + o[1]));
  const labelW = labels ? Math.max(m.size.w, m.size.h) * 0.9 : 0;
  const fw = Math.max(...shifts.map((o) => vx + vw + o[0])) + labelW - fx;
  const fh = Math.max(...shifts.map((o) => vy + vh + o[1])) - fy;
  const [ax, ay] = m.anchor[proj];
  const vbStr = `${vx} ${vy} ${vw} ${vh}`;

  const rootStyle = {
    ...style,
    aspectRatio: `${fw.toFixed(2)} / ${fh.toFixed(2)}`,
    ...(explode === undefined ? {} : { '--board-explode': Math.min(1, Math.max(0, explode)).toFixed(3) }),
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={label ?? `${id === 'fingerprint' ? 'Fingerprint module' : 'Power carrier'}, ${m.size.w} by ${m.size.h} millimetres, from the club's KiCad file`}
      className={className ? `${s.root} ${className}` : s.root}
      style={rootStyle}
      data-board={id}
      data-proj={proj}
      data-state={state}
      data-board-live={live ? '' : undefined}
    >
      {active.map((layer) => {
        const [ox, oy] = off(LAYER_TIER[layer]);
        const layerStyle = {
          left: pct(((vx - fx) / fw) * 100),
          top: pct(((vy - fy) / fh) * 100),
          width: pct((vw / fw) * 100),
          height: pct((vh / fh) * 100),
          '--ux': ((ox / vw) * 100).toFixed(3),
          '--uy': ((oy / vh) * 100).toFixed(3),
        } as CSSProperties;
        return (
          <div
            key={layer}
            className={s.layer}
            style={layerStyle}
            data-board-layer={layer}
            data-dim={focus && !focus.includes(layer) ? '' : undefined}
          >
            <svg viewBox={vbStr} aria-hidden="true" focusable="false" className={s.svg}>
              <use href={`${layerFile(id, layer, proj)}#l`} />
            </svg>
            {labels && layer !== 'edge' && layer !== 'vias' ? (
              <span className={s.label} style={{ left: pct(((ax - vx) / vw) * 100 + 4), top: pct(((ay - vy) / vh) * 100) }}>
                {LABEL[layer]}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
