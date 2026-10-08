/**
 * <Graticule> — the Signal world's measuring surface, one pitch scale (replaces 4 copies at 3 pitches:
 * worlds.css 80px, _shades/reader 50px, _brain/demo 10×8 divisions, signal/brain).
 *   pitch="base"  80px squares + centre axes (page ground)
 *   pitch="fine"  40px squares + centre axes (dense panels, readers)
 *   pitch="scope" 10 × 8 divisions + centre axes (an instrument screen sized to its box)
 * Server-safe. Same classes are usable without the component: className="r2-graticule" data-pitch="fine".
 */
import type { CSSProperties, ElementType, ReactNode } from 'react';

export type GraticulePitch = 'base' | 'fine' | 'scope';

export function Graticule({
  pitch = 'base',
  as: Tag = 'div',
  className,
  style,
  children,
  ...rest
}: {
  readonly pitch?: GraticulePitch;
  readonly as?: ElementType;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
} & Partial<Record<`aria-${string}` | `data-${string}` | 'id' | 'role', string>>) {
  return (
    <Tag className={className ? `r2-graticule ${className}` : 'r2-graticule'} data-pitch={pitch} style={style} {...rest}>
      {children}
    </Tag>
  );
}
