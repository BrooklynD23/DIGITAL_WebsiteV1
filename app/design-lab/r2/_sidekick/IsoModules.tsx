/**
 * Iso line drawings for the three SIDEKICK modules that have no board file.
 * Line form says how real each one is: dotted = planned / no outline exists, dashed = boundary of an outside design.
 * Same 30° iso matrix as BoardSvg, so they stack with the real boards. Server-safe, no hooks.
 */
import type { ReactNode } from 'react';

const ISO = 'matrix(0.866 0.5 -0.866 0.5 0 0)';
const NS = { vectorEffect: 'non-scaling-stroke' } as const;

function IsoFrame({ w, h, label, children }: { readonly w: number; readonly h: number; readonly label: string; readonly children: ReactNode }) {
  const pad = Math.max(w, h) * 0.04;
  const minX = -0.866 * h - pad;
  const vbW = 0.866 * (w + h) + pad * 2;
  const vbH = 0.5 * (w + h) + pad * 2;
  return (
    <svg viewBox={`${minX.toFixed(2)} ${(-pad).toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}`} role="img" aria-label={label} style={{ display: 'block', overflow: 'visible' }}>
      <title>{label}</title>
      <g transform={ISO}>{children}</g>
    </svg>
  );
}

const ink = 'var(--board-ink, currentColor)';

/** Sensor module: no board outline exists. Dotted slab, four parts, the 7-pin 1.00 mm header as 7 pads. */
export function SensorModule({ w, h }: { readonly w: number; readonly h: number }) {
  return (
    <IsoFrame w={w} h={h} label="Sensor module, schematic only: four parts and a 7-pin header, no board outline yet (not to scale)">
      <rect x={0} y={0} width={w} height={h} rx={1.5} fill="var(--board-substrate, currentColor)" fillOpacity={0.04} stroke={ink} strokeWidth={1} strokeDasharray="1 3" {...NS} />
      <g fill="none" stroke={ink} strokeWidth={1} {...NS}>
        <rect x={4} y={4} width={6} height={6} rx={0.6} />
        <rect x={13} y={4.5} width={4.5} height={4.5} rx={0.5} />
        <rect x={20} y={5} width={3} height={5} rx={0.4} />
      </g>
      <g fill={ink} fillOpacity={0.7}>
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={4 + i * 2.6} y={h - 5} width={1.2} height={2.4} rx={0.2} />
        ))}
      </g>
      <path d={`M7 10V${h - 8}H20M15.25 9V13H21.5V10`} fill="none" stroke={ink} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="1 2" {...NS} />
    </IsoFrame>
  );
}

/** Compute: the Zynq-7000 module is an outside design. Dashed boundary, a 2 × 50 mezzanine land as the one solid part. */
export function ComputeModule({ w, h }: { readonly w: number; readonly h: number }) {
  const cx = w / 2;
  return (
    <IsoFrame w={w} h={h} label="Compute: Zynq-7000 module, ARM and FPGA, an outside design shown as a dashed boundary (outline illustrative)">
      <rect x={0} y={0} width={w} height={h} rx={2} fill="var(--board-substrate, currentColor)" fillOpacity={0.05} stroke={ink} strokeWidth={1} strokeDasharray="5 4" {...NS} />
      <rect x={w * 0.3} y={h * 0.22} width={w * 0.4} height={h * 0.4} rx={1} fill="none" stroke={ink} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="5 4" {...NS} />
      <g fill={ink} fillOpacity={0.55}>
        {Array.from({ length: 25 }, (_, i) => (
          <g key={i}>
            <rect x={cx - 12 + i} y={h - 7.2} width={0.5} height={1.4} />
            <rect x={cx - 12 + i} y={h - 4.4} width={0.5} height={1.4} />
          </g>
        ))}
      </g>
      <rect x={cx - 13} y={h - 8.4} width={26} height={6.4} rx={0.6} fill="none" stroke={ink} strokeWidth={1} {...NS} />
    </IsoFrame>
  );
}

/** Planned modules: nine dotted seats, no files. */
export function PlannedModules({ w, h }: { readonly w: number; readonly h: number }) {
  const cell = (w - 8) / 3;
  return (
    <IsoFrame w={w} h={h} label="Planned modules: nine dotted seats for modules that exist only as research notes">
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={2 + (i % 3) * (cell + 2)}
          y={2 + Math.floor(i / 3) * (cell + 2)}
          width={cell}
          height={cell}
          rx={1}
          fill="none"
          stroke={ink}
          strokeOpacity={0.75}
          strokeWidth={1}
          strokeDasharray="1 3"
          {...NS}
        />
      ))}
    </IsoFrame>
  );
}

/** The empty seat a module leaves when it swaps out: dashed outline + the page's one red anchor (an open seat). */
export function EmptySeat({ w, h }: { readonly w: number; readonly h: number }) {
  return (
    <IsoFrame w={w} h={h} label="Empty seat: the module has been lifted out">
      <rect x={0} y={0} width={w} height={h} rx={1} fill="none" stroke={ink} strokeWidth={1} strokeDasharray="4 3" {...NS} />
      <circle cx={w / 2} cy={h / 2} r={1.6} fill="var(--r2-trigger)" />
    </IsoFrame>
  );
}

/**
 * The phone shell (enclosure), never started: dashed outline, struck through. Front carries a screen inset and
 * speaker slot, back a camera ring, so the stack reads as a phone without claiming any enclosure design exists.
 */
export function PhoneShell({ w, h, side }: { readonly w: number; readonly h: number; readonly side: 'front' | 'back' }) {
  return (
    <IsoFrame w={w} h={h} label={`Phone ${side === 'front' ? 'front shell' : 'back cover'}: never started, drawn dashed and struck (outline illustrative)`}>
      <rect x={0} y={0} width={w} height={h} rx={7} fill="none" stroke={ink} strokeOpacity={0.8} strokeWidth={1} strokeDasharray="4 3" {...NS} />
      {side === 'front' ? (
        <>
          <rect x={3} y={3} width={w - 6} height={h - 6} rx={5} fill="none" stroke={ink} strokeOpacity={0.45} strokeWidth={1} strokeDasharray="1 3" {...NS} />
          <path d={`M${w / 2 - 5} 6.5H${w / 2 + 5}`} fill="none" stroke={ink} strokeOpacity={0.7} strokeWidth={1} {...NS} />
        </>
      ) : (
        <>
          <rect x={4} y={4} width={13} height={20} rx={4} fill="none" stroke={ink} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="2 2" {...NS} />
          <circle cx={10.5} cy={10} r={3} fill="none" stroke={ink} strokeOpacity={0.6} strokeWidth={1} {...NS} />
          <circle cx={10.5} cy={18} r={3} fill="none" stroke={ink} strokeOpacity={0.6} strokeWidth={1} {...NS} />
        </>
      )}
      <path d={`M${w * 0.15} ${h * 0.85}L${w * 0.85} ${h * 0.15}`} fill="none" stroke={ink} strokeOpacity={0.8} strokeWidth={1} {...NS} />
    </IsoFrame>
  );
}
