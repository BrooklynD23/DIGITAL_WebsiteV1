/**
 * <DotGlyph> — SVG renderer for one engine frame. No hooks, no client JS:
 * safe in Server Components. Use it for small marks, for the SSR / no-JS /
 * reduced-motion rest pose, and for print. Ink = currentColor; the anchor
 * dot uses var(--r2-trigger).
 */
import type { CSSProperties } from 'react';
import { REST_T, frame, verbSpec } from './engine';
import { r2 } from './math';
import type { Frame, FrameOpts, LineForm, Verb } from './types';

export interface DotGlyphProps extends FrameOpts {
  readonly verb: Verb;
  /** 0..1, default 1 (rest pose). */
  readonly t?: number;
  /** Rendered px (also the engine size). Default 64. */
  readonly size?: number;
  /** Accessible name. Omit for decorative use (aria-hidden). */
  readonly label?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Pre-computed frame (skips the engine call). */
  readonly frameData?: Frame;
}

/** Dash patterns in screen px (lines use non-scaling strokes, so dashes are screen units). */
export const DASH: Readonly<Record<LineForm, string | undefined>> = {
  solid: undefined,
  dashed: '4 3',
  dotted: '1 3',
};

/** Normalised [-1, 1] → px. 4% margin so edge dots are not clipped. */
export const toPx = (v: number, size: number): number => ((v * 0.92 + 1) * size) / 2;

export function DotGlyph({ verb, t = REST_T, size = 64, label, className, style, frameData, ...opts }: DotGlyphProps) {
  const f = frameData ?? frame(verb, t, { ...opts, size });
  const px = (v: number) => r2(toPx(v, size));
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: 'false' as const };
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      data-verb={verb}
      data-t={r2(t)}
      {...a11y}
    >
      {label ? <title>{`${label} (${verbSpec(verb).means})`}</title> : null}
      <g fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeLinecap="round">
        {f.lines.map((l, i) => (
          <line
            key={`l${i}`}
            x1={px(l.x1)}
            y1={px(l.y1)}
            x2={px(l.x2)}
            y2={px(l.y2)}
            strokeOpacity={r2(l.a)}
            strokeDasharray={DASH[l.form]}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <g>
        {f.dots.map((d, i) =>
          d.kind === 'hollow' ? (
            <circle
              key={`d${i}`}
              cx={px(d.x)}
              cy={px(d.y)}
              r={r2(d.r)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={r2(d.a)}
              strokeWidth={1}
              strokeDasharray="2 1.5"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <circle
              key={`d${i}`}
              cx={px(d.x)}
              cy={px(d.y)}
              r={r2(d.r)}
              fill={d.kind === 'anchor' ? 'var(--r2-trigger, #d8412f)' : 'currentColor'}
              fillOpacity={r2(d.a)}
            />
          ),
        )}
      </g>
    </svg>
  );
}
