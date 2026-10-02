/**
 * Glyph frame shared by every round-2 icon. Server-safe (no hooks).
 * One SVG source per glyph; `state` is the axis (idle | working | done) that CSS reads.
 * Working motion runs only when the glyph is live: hovered, inside a hovered / focused
 * `[data-glyph-host]` row, a host with data-active="true", or `live` set. Reduced motion: never.
 */
import type { CSSProperties, ReactNode } from 'react';
import './icons.css';

export type GlyphState = 'idle' | 'working' | 'done';
export type GlyphSize = 16 | 24 | 64;

export interface GlyphProps {
  readonly state?: GlyphState;
  /** 16 inline, 24 UI, 64 tile. Any px works; these three are tuned. Default 24. */
  readonly size?: GlyphSize | number;
  /** Accessible name. Omit when a visible label sits next to the glyph (default: aria-hidden). */
  readonly label?: string;
  /** Force the working animation on (ignores hover gating; still off under reduced motion). */
  readonly live?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function GlyphFrame({
  name,
  state = 'idle',
  size = 24,
  label,
  live,
  className,
  style,
  children,
}: GlyphProps & { readonly name: string; readonly children: ReactNode }) {
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      focusable="false"
      className={className ? `r2g r2g--${name} ${className}` : `r2g r2g--${name}`}
      data-glyph={name}
      data-state={state}
      data-live={live ? 'true' : undefined}
      style={{ ['--u' as string]: String(size / 24), ...style }}
      {...a11y}
    >
      {children}
    </svg>
  );
}

/** Inline custom properties for the animation slot (`--a` keyframe name + params). */
export type Anim = Record<`--${string}`, string | number>;
export const anim = (a: Anim): CSSProperties => a as CSSProperties;
