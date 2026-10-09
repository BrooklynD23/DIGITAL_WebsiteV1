/**
 * Procedural pixel drawings of the two real builds. Illustrations, not the prototypes:
 * no photos exist yet (CONTEXT-PACK §1). One cell = one unit; crispEdges keeps the grid.
 * Layer → subsystem highlight is driven by phoneV2.ts activePartIds (see content.ts).
 */
import type { PhoneLayerId } from './content';

type Cell = readonly [x: number, y: number, w: number, h: number];

const toPath = (cells: readonly Cell[], dx = 0, dy = 0): string =>
  cells.map(([x, y, w, h]) => `M${x + dx} ${y + dy}h${w}v${h}h${-w}z`).join('');

const W = 12;
const H = 22;
const BODY: readonly Cell[] = [
  [1, 0, W - 2, H],
  [0, 1, W, H - 2],
];
const OUTLINE: readonly Cell[] = [
  [1, 0, W - 2, 1],
  [1, H - 1, W - 2, 1],
  [0, 1, 1, H - 2],
  [W - 1, 1, 1, H - 2],
];

const DETAILS: Record<PhoneLayerId, readonly Cell[]> = {
  'back-cover': [
    [2, 2, 4, 1], [2, 5, 4, 1], [2, 2, 1, 4], [5, 2, 1, 4], [3, 3, 2, 2],
    [5, 11, 2, 2],
  ],
  'small-parts': [
    [1, 1, 1, 1], [10, 1, 1, 1], [1, 20, 1, 1], [10, 20, 1, 1],
    [4, 8, 4, 1], [4, 11, 4, 1], [4, 8, 1, 4], [7, 8, 1, 4],
    [3, 15, 6, 1],
  ],
  battery: [
    [4, 4, 4, 1],
    [2, 5, 8, 1], [2, 17, 8, 1], [2, 5, 1, 13], [9, 5, 1, 13],
    [5, 9, 2, 6], [3, 11, 6, 2],
  ],
  pcb: [
    [3, 4, 4, 4], [8, 4, 2, 2], [8, 8, 2, 2],
    [3, 10, 1, 6], [3, 15, 6, 1], [6, 10, 1, 5], [7, 5, 1, 1],
    [4, 18, 4, 2],
  ],
  midframe: [
    [2, 2, 8, 1], [2, 19, 8, 1], [2, 2, 1, 18], [9, 2, 1, 18],
  ],
  display: [
    [2, 3, 8, 1], [2, 17, 8, 1], [2, 3, 1, 15], [9, 3, 1, 15],
    [3, 5, 4, 1], [3, 7, 5, 1], [3, 9, 3, 1], [3, 14, 6, 2],
  ],
  glass: [
    [4, 1, 4, 1], [7, 3, 2, 1], [9, 4, 1, 2], [8, 7, 1, 1],
  ],
};

/** Back to front. */
export const PHONE_LAYERS: readonly PhoneLayerId[] = [
  'back-cover',
  'small-parts',
  'battery',
  'pcb',
  'midframe',
  'display',
  'glass',
];

const STEP_X = 13;
const STEP_Y = 2;

interface PixelPhoneProps {
  readonly highlight?: readonly PhoneLayerId[];
  readonly className?: string;
}

export function PixelPhone({ highlight = [], className }: PixelPhoneProps) {
  const vbW = (PHONE_LAYERS.length - 1) * STEP_X + W;
  const vbH = (PHONE_LAYERS.length - 1) * STEP_Y + H;
  return (
    <svg
      className={className}
      viewBox={`-1 -1 ${vbW + 2} ${vbH + 2}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel drawing of a phone pulled apart into seven layers, back cover to front glass. Illustration, not the prototype."
    >
      {PHONE_LAYERS.map((layer, i) => {
        const dx = i * STEP_X;
        const dy = i * STEP_Y;
        const on = highlight.includes(layer);
        return (
          <g key={layer} data-layer={layer} data-on={on ? '' : undefined}>
            <path d={toPath(BODY, dx, dy)} fill={on ? 'var(--ink)' : 'var(--sheet)'} />
            <path d={toPath(OUTLINE, dx, dy)} fill="var(--ink)" />
            <path d={toPath(DETAILS[layer], dx, dy)} fill={on ? 'var(--sheet)' : 'var(--ink)'} />
          </g>
        );
      })}
    </svg>
  );
}

const GW = 44;
const GH = 14;
const LENS = (x: number): Cell[] => [
  [x + 1, 2, 14, 1], [x + 1, 11, 14, 1], [x, 3, 1, 8], [x + 15, 3, 1, 8],
  [x + 1, 3, 1, 1], [x + 14, 3, 1, 1], [x + 1, 10, 1, 1], [x + 14, 10, 1, 1],
];
const FRAME: readonly Cell[] = [
  ...LENS(2),
  ...LENS(26),
  [18, 4, 8, 1], [19, 3, 6, 1],
  [0, 3, 2, 1], [42, 3, 2, 1],
  // FPGA pod on the right temple
  [38, 0, 5, 2],
];

/** Glasses front view. The right lens is left empty: the live RSVP word sits over it in the DOM. */
export function PixelGlasses({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`-1 -1 ${GW + 2} ${GH + 2}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={toPath([[3, 3, 13, 8], [27, 3, 13, 8]])} fill="var(--sheet)" />
      <path d={toPath(FRAME)} fill="var(--ink)" />
    </svg>
  );
}

/** Position of the right-lens centre, as % of the glasses box, for the DOM overlay. */
export const RIGHT_LENS_CENTER = {
  left: `${((34 + 1) / (GW + 2)) * 100}%`,
  top: `${((7 + 1) / (GH + 2)) * 100}%`,
} as const;

/**
 * 24px per-seat glyph: the 7 phone layers as bars, back to front (same order as the big figure).
 * Filled bars = the layers this subsystem touches, so cause and effect sit in the seat's own row.
 */
export function SeatGlyph({ layers }: { readonly layers: readonly PhoneLayerId[] }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {PHONE_LAYERS.map((layer, i) => (
        <rect
          key={layer}
          x={1 + i * 3}
          y={layers.includes(layer) ? 3 : 15}
          width={2}
          height={layers.includes(layer) ? 18 : 6}
          fill={layers.includes(layer) ? 'var(--ink)' : 'var(--hair-strong)'}
        />
      ))}
    </svg>
  );
}
