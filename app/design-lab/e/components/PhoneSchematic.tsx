import type { ReactNode } from 'react';
import s from '../e.module.css';

/**
 * Procedural exploded view of DG-001: 7 isometric layers, one per subsystem in phoneV2.ts.
 * This is a diagram of the subsystem split, not a render of the club's hardware (none exists yet).
 * Default (no JS / reduced motion / mobile) is fully exploded. GSAP collapses then re-explodes it on scroll.
 */

const W = 150;
const H = 300;
const GAP = 66;
const ISO = 'matrix(0.866 0.5 -0.866 0.5 0 0)';
const STROKE = 'currentColor';

interface LayerDef {
  readonly id: string;
  readonly label: string;
  readonly draw: ReactNode;
}

const frame = (inset = 0, rx = 16, dash?: string, fill = '#1b1d1a') => (
  <rect
    x={inset}
    y={inset}
    width={W - inset * 2}
    height={H - inset * 2}
    rx={rx}
    fill={fill}
    stroke={STROKE}
    strokeDasharray={dash}
    vectorEffect="non-scaling-stroke"
  />
);

const line = (d: string, opacity = 0.7) => (
  <path d={d} fill="none" stroke={STROKE} strokeOpacity={opacity} vectorEffect="non-scaling-stroke" />
);

/** Top of stack first (= content.ts STACK_ORDER, = step numbering 01–07); drawn last (painter's order reversed below). */
const LAYERS: readonly LayerDef[] = [
  {
    id: 'apps-ux',
    label: 'Apps / UX',
    draw: (
      <>
        {frame(0, 18)}
        <rect x={10} y={16} width={W - 20} height={H - 40} rx={8} fill="none" stroke={STROKE} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={22} y={44 + i * 34} width={i === 0 ? 92 : 70} height={14} rx={2} fill={STROKE} fillOpacity={0.18} />
        ))}
        <circle cx={W / 2} cy={H - 12} r={4} fill="none" stroke={STROKE} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
      </>
    ),
  },
  {
    id: 'operating-system',
    label: 'Operating System',
    draw: (
      <>
        {frame(6, 14)}
        {[0, 1].map((c) =>
          [0, 1, 2, 3].map((r) => (
            <rect key={`${c}-${r}`} x={22 + c * 56} y={30 + r * 60} width={50} height={50} rx={3} fill="none" stroke={STROKE} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
          )),
        )}
      </>
    ),
  },
  {
    id: 'systems-architecture',
    label: 'Systems Architecture',
    draw: (
      <>
        {frame(0, 18, '5 4', 'transparent')}
        <rect x={10} y={10} width={W - 20} height={H - 20} rx={12} fill="#1b1d1a" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        <rect x={24} y={30} width={W - 48} height={110} rx={4} fill="none" stroke={STROKE} strokeOpacity={0.5} vectorEffect="non-scaling-stroke" />
        <rect x={24} y={160} width={W - 48} height={110} rx={4} fill="none" stroke={STROKE} strokeOpacity={0.5} vectorEffect="non-scaling-stroke" />
      </>
    ),
  },
  {
    id: 'firmware-embedded',
    label: 'Firmware / Embedded',
    draw: (
      <>
        {frame(14, 10, '2 5')}
        <rect x={50} y={110} width={50} height={50} rx={3} fill="#1b1d1a" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            {line(`M${56 + i * 9.5} 110 V100`)}
            {line(`M${56 + i * 9.5} 160 V170`)}
          </g>
        ))}
        {line('M75 170 V240 H40', 0.5)}
        {line('M100 135 H120 V60', 0.5)}
      </>
    ),
  },
  {
    id: 'hardware-pcb',
    label: 'Hardware / PCB',
    draw: (
      <>
        <rect x={12} y={20} width={W - 24} height={210} rx={6} fill="#1b1d1a" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        {line('M30 50 H90 V90 H120', 0.6)}
        {line('M30 70 H70 V150 H118', 0.6)}
        {line('M40 200 V120 H60', 0.6)}
        {line('M110 210 V170 H80', 0.6)}
        <rect x={84} y={38} width={26} height={16} rx={1} fill="none" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        <rect x={24} y={186} width={30} height={20} rx={1} fill="none" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        <rect x={20} y={244} width={W - 40} height={40} rx={4} fill="none" stroke={STROKE} strokeOpacity={0.5} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </>
    ),
  },
  {
    id: 'integration-testing',
    label: 'Integration / Testing',
    draw: (
      <>
        {frame(4, 16, '1 6', 'transparent')}
        {[
          [18, 18],
          [W - 18, 18],
          [18, H - 18],
          [W - 18, H - 18],
          [W / 2, H / 2],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={6} fill="#1b1d1a" stroke={STROKE} vectorEffect="non-scaling-stroke" />
            {line(`M${x - 10} ${y} H${x + 10} M${x} ${y - 10} V${y + 10}`, 0.6)}
          </g>
        ))}
      </>
    ),
  },
  {
    id: 'mechanical-cad',
    label: 'Mechanical / CAD',
    draw: (
      <>
        {frame(0, 20)}
        <rect x={16} y={16} width={44} height={60} rx={10} fill="none" stroke={STROKE} vectorEffect="non-scaling-stroke" />
        <circle cx={38} cy={34} r={8} fill="none" stroke={STROKE} strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />
        <circle cx={38} cy={58} r={8} fill="none" stroke={STROKE} strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />
        {line(`M20 ${H - 40} H${W - 20}`, 0.4)}
      </>
    ),
  },
];

export const SCHEMATIC_LAYER_COUNT = LAYERS.length;
export const SCHEMATIC_GAP = GAP;

export function PhoneSchematic({ title }: { readonly title: string }) {
  const count = LAYERS.length;
  // Projected footprint: x from -0.866*H to 0.866*W, y from 0 to 0.5*(W+H).
  const minX = -0.866 * H - 8;
  const labelX = 0.866 * W + 64;
  const vbW = labelX + 280 - minX;
  const vbH = 0.5 * (W + H) + GAP * (count - 1) + 24;
  const rightCornerY = 0.5 * W; // projected y of (W, 0)

  return (
    <svg
      viewBox={`${minX} -12 ${vbW} ${vbH}`}
      role="img"
      aria-labelledby="dg001-schematic-title"
      data-schematic
      style={{ color: '#f1f1ec' }}
    >
      <title id="dg001-schematic-title">{title}</title>
      {[...LAYERS].reverse().map((layer, revIdx) => {
        const idx = count - 1 - revIdx; // 0 = top of stack
        const y = idx * GAP;
        return (
          <g key={layer.id} className={s.layer} data-layer={layer.id} data-index={idx}>
            <g data-shift transform={`translate(0 ${y})`}>
              <g transform={ISO} className={s.layerShape}>
                {layer.draw}
              </g>
              <path
                d={`M${0.866 * W + 6} ${rightCornerY} H${labelX - 8}`}
                className={s.leader}
                stroke="currentColor"
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={labelX - 4} cy={rightCornerY} r={3.5} fill="#d8412f" />
              <text x={labelX + 6} y={rightCornerY + 5} className={s.layerLabel}>
                <tspan className={s.layerNum}>{String(idx + 1).padStart(2, '0')}</tspan>
                <tspan className={s.layerName}> {layer.label}</tspan>
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
