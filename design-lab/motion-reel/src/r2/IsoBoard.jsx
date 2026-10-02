import { C } from './tokens.js';

// Iso renderer for the club's real KiCad geometry (app/design-lab/r2/_system/boards/*.json).
// Same 30° matrix and layer tiers as BoardSvg, but drawn into one shared clip SVG so several
// boards share a mm scale and can move independently (BoardSvg owns its own viewBox).

export const ISO_M = 'matrix(0.866 0.5 -0.866 0.5 0 0)';
export const COS30 = 0.866;

/** Board-plane (x, y mm) + height z (mm) → projected iso mm. */
export const iso = (x, y, z = 0) => [COS30 * (x - y), 0.5 * (x + y) - z];

export const TIER = {
  'B.Silk': -2.4,
  'B.Pads': -1.6,
  'B.Cu': -1,
  substrate: 0,
  edge: 0,
  vias: 0,
  'F.Cu': 1,
  'F.Pads': 1.6,
  'F.Silk': 2.4,
};
export const LAYERS = Object.keys(TIER);

const INK = {
  ink: C.ink,
  copper: '#c9c2b0',
  silk: C.ink2,
};

function pads(board, side) {
  const list = board.footprints.filter((f) => !f.parked).flatMap((f) => f.pads.filter((p) => p.l === side || p.l === 'FB'));
  return (
    <>
      <g fill={INK.copper} fillOpacity={0.5} stroke={INK.copper} strokeWidth={0.9} vectorEffect="non-scaling-stroke">
        {list.map((p, i) => {
          const t = p.a ? `rotate(${-p.a} ${p.x} ${p.y})` : undefined;
          if (p.s === 'circle') return <circle key={i} cx={p.x} cy={p.y} r={p.w / 2} vectorEffect="non-scaling-stroke" />;
          const m = Math.min(p.w, p.h);
          const rx = p.s === 'oval' ? m / 2 : p.s === 'roundrect' ? (p.rr ?? 0.25) * m : 0;
          return <rect key={i} x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx={rx} transform={t} vectorEffect="non-scaling-stroke" />;
        })}
      </g>
      <g fill={C.ground} stroke={INK.ink} strokeWidth={0.8}>
        {list.filter((p) => p.d).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.d / 2} vectorEffect="non-scaling-stroke" />)}
      </g>
    </>
  );
}

function copper(board, side) {
  return (
    <>
      <g fill={INK.copper} fillOpacity={0.09} stroke={INK.copper} strokeOpacity={0.5} strokeWidth={0.8}>
        {board.zones.filter((z) => z.l === side).map((z, i) => (
          <path key={i} d={z.d} fill={z.filled ? undefined : 'none'} strokeDasharray={z.filled ? undefined : '3 3'} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill="none" stroke={INK.copper} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.95}>
        {board.tracks.filter((t) => t.l === side).map((t, i) => <path key={i} d={t.d} strokeWidth={Math.max(t.w, 0.22)} />)}
      </g>
    </>
  );
}

function content(board, layer) {
  switch (layer) {
    case 'substrate':
      return <path d={[board.outline, ...board.cutouts].join('')} fill={C.ink} fillOpacity={0.06} fillRule="evenodd" />;
    case 'edge':
      return <path d={[board.outline, ...board.cutouts].join('')} fill="none" stroke={INK.ink} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />;
    case 'vias':
      return (
        <g fill={C.ground} stroke={INK.copper} strokeWidth={0.9}>
          {board.vias.map(([x, y, s, d], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={s / 2} vectorEffect="non-scaling-stroke" />
              <circle cx={x} cy={y} r={d / 2} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </g>
      );
    case 'F.Cu':
      return copper(board, 'F');
    case 'B.Cu':
      return copper(board, 'B');
    case 'F.Pads':
      return pads(board, 'F');
    case 'B.Pads':
      return pads(board, 'B');
    case 'F.Silk':
      return board.silk.F ? <path d={board.silk.F} fill="none" stroke={INK.silk} strokeWidth={0.9} vectorEffect="non-scaling-stroke" /> : null;
    case 'B.Silk':
      return board.silk.B ? <path d={board.silk.B} fill="none" stroke={INK.silk} strokeWidth={0.9} vectorEffect="non-scaling-stroke" /> : null;
    default:
      return null;
  }
}

/** Projected bounds (iso mm) of a board at a given explode/gap, relative to its own origin. */
export function isoBounds(board, gap, explode = 1, lift = 0) {
  const { w, h } = board.size;
  const zs = [TIER['B.Silk'] * gap * explode + lift, TIER['F.Silk'] * gap * explode + lift];
  const pts = zs.flatMap((z) => [[0, 0], [w, 0], [w, h], [0, h]].map(([x, y]) => iso(x, y, z)));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

/**
 * One board, drawn in iso into the parent SVG.
 *   ox, oy — screen px where the board origin (0,0,0) lands; s — px per mm
 *   explode 0..1, gap mm per tier, lift mm (whole board raised on z), alpha per layer
 */
export function IsoBoard({ board, ox, oy, s, explode = 0, gap = 7, lift = 0, opacity = 1, layerAlpha = {}, axes = true, opaque = false }) {
  const zOf = (layer) => TIER[layer] * gap * explode + lift;
  const throughs = [
    ...board.vias.map(([x, y]) => [x, y]),
    ...board.footprints.filter((f) => !f.parked).flatMap((f) => f.pads.filter((p) => p.l === 'FB' || p.l === 'H').map((p) => [p.x, p.y])),
  ];
  const zTop = zOf('F.Pads');
  const zBot = zOf('B.Pads');
  const axisPath = throughs
    .map(([x, y]) => {
      const a = iso(x, y, zBot);
      const b = iso(x, y, zTop);
      return `M${(ox + a[0] * s).toFixed(1)} ${(oy + a[1] * s).toFixed(1)}L${(ox + b[0] * s).toFixed(1)} ${(oy + b[1] * s).toFixed(1)}`;
    })
    .join('');
  return (
    <g opacity={opacity}>
      {axes && explode > 0.01 && (
        <path d={axisPath} fill="none" stroke={C.ink} strokeOpacity={0.28 * Math.min(1, explode * 1.6)} strokeWidth={1} strokeDasharray="2 4" />
      )}
      {opaque && (
        // solid ground under the stack so a board sitting on another occludes it (physical stacking)
        <g transform={`translate(${ox.toFixed(2)} ${(oy - zOf('B.Silk') * s).toFixed(2)}) scale(${s}) ${ISO_M}`}>
          <path d={board.outline} fill={C.ground} />
        </g>
      )}
      {LAYERS.map((layer) => (
        <g
          key={layer}
          opacity={layerAlpha[layer] ?? 1}
          transform={`translate(${ox.toFixed(2)} ${(oy - zOf(layer) * s).toFixed(2)}) scale(${s}) ${ISO_M}`}
        >
          {content(board, layer)}
        </g>
      ))}
    </g>
  );
}
