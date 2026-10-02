import rough from 'roughjs';
import type { CSSProperties } from 'react';

/**
 * Rough.js, server-side. `rough.generator()` needs no DOM, so every sketch is computed
 * at build time with a fixed seed: identical SSR/CSR output, zero client JS for the
 * drawing itself, and the strokes are visible without JavaScript.
 * The optional draw-on effect is a CSS dash animation armed by <DrawOn/> (client).
 */
const gen = rough.generator();

type Drawable = ReturnType<typeof gen.line>;
type Options = NonNullable<Parameters<typeof gen.line>[4]>;

const BASE: Options = {
  stroke: 'currentColor',
  strokeWidth: 1.6,
  roughness: 1.4,
  bowing: 1.2,
  seed: 7,
  disableMultiStroke: false,
};

const withBase = (o: Options = {}): Options => ({ ...BASE, ...o });

export const sk = {
  line: (x1: number, y1: number, x2: number, y2: number, o?: Options) => gen.line(x1, y1, x2, y2, withBase(o)),
  rect: (x: number, y: number, w: number, h: number, o?: Options) => gen.rectangle(x, y, w, h, withBase(o)),
  circle: (cx: number, cy: number, d: number, o?: Options) => gen.circle(cx, cy, d, withBase(o)),
  ellipse: (cx: number, cy: number, w: number, h: number, o?: Options) => gen.ellipse(cx, cy, w, h, withBase(o)),
  curve: (pts: readonly (readonly [number, number])[], o?: Options) =>
    gen.curve(pts.map(([x, y]) => [x, y] as [number, number]), withBase(o)),
  path: (d: string, o?: Options) => gen.path(d, withBase(o)),
};

interface SketchProps {
  readonly viewBox: string;
  readonly drawables: readonly Drawable[];
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly preserveAspectRatio?: string;
  /** Keep strokes the same width when the SVG is stretched. */
  readonly nonScaling?: boolean;
  /** Accessible label; omit for decorative sketches (then aria-hidden). */
  readonly label?: string;
  /** Never animate. Default true: the page has ONE sequenced drawing (the How rail). */
  readonly still?: boolean;
}

export function Sketch({ viewBox, drawables, className, style, preserveAspectRatio, nonScaling, label, still = true }: SketchProps) {
  // Keep each drawable's index so CSS can stagger strokes in drawing order (--i).
  const paths = drawables.flatMap((d, di) => gen.toPaths(d).map((p) => ({ ...p, di })));
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      preserveAspectRatio={preserveAspectRatio}
      data-sketch=""
      data-still={still ? '' : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke === 'none' ? 'none' : 'currentColor'}
          strokeWidth={p.strokeWidth}
          fill="none"
          style={
            (p.fill && p.fill !== 'none'
              ? { fill: p.fill, ['--i' as string]: p.di }
              : { ['--i' as string]: p.di }) as CSSProperties
          }
          data-fill={p.fill && p.fill !== 'none' ? '' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          vectorEffect={nonScaling ? 'non-scaling-stroke' : undefined}
        />
      ))}
    </svg>
  );
}
