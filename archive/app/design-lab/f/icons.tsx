/**
 * Pixelarticons (MIT, halfmage/pixelarticons) — SVG source fetched 2026-10-02 via
 * `npx aria-icons@0.1.0 get pixelarticons:<name>`. Inlined so no dependency is added.
 * Rule: render at 24px (or 48px) only, so the 2px pixel grid stays crisp.
 */
import type { SVGProps } from 'react';

const PATHS = {
  'arrow-right':
    'M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2zM14 15V7h2v8zm-2 2V5h2v12z',
  'arrow-down': 'M13 12h6v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h6V4h2z',
  'external-link':
    'M11 5H5v2h6zM5 7H3v12h2zm12 12H5v2h12zm2-6h-2v6h2zm-8 0H9v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v8h2zM21 3h-8v2h8z',
  'drag-and-drop':
    'M11 21H9v-2h2zm10 0h-2v-2h2zM9 19H7V9h2zm10-4h-2v2h-2v2h-2v-6h6zm0 4h-2v-2h2zM5 17H3v-2h2zm0-4H3v-2h2zm16-2h-2V9h2zM5 9H3V7h2zm14 0H9V7h10zM5 5H3V3h2zm4 0H7V3h2zm4 0h-2V3h2zm4 0h-2V3h2z',
  calendar:
    'M5 4h14v2H5zm0 16h14v2H5zM3 10h2v10H3zm0-4h2v2H3zm16 0h2v2h-2zm0 4h2v10h-2zM3 8h18v2H3zm12-6h2v2h-2zM7 2h2v2H7z',
  map: 'M4 20h2v2H2V6h2zm12 0h2v2h-4v-2h-2v-2h2V8h-2V6h4zm-8 0H6v-2h2zm12 0h-2v-2h2zM10 4h2v2h-2v10h2v2H8V4H6V2h4zm12 14h-2V4h-2V2h4zM6 6H4V4h2zm12 0h-2V4h2z',
  message: 'M20 2H4v2h16zm0 14H6v2h14zm2-12h-2v12h2zM4 4H2v18h2zm2 14H4v2h2z',
  check:
    'M10 18H8v-2h2zm-2-2H6v-2h2zm4-2v2h-2v-2zm-6 0H4v-2h2zm8 0h-2v-2h2zm2-2h-2v-2h2zm2-2h-2V8h2zm2-2h-2V6h2z',
  close:
    'M7 19H5v-2h2zm12 0h-2v-2h2zM9 15v2H7v-2zm8 2h-2v-2h2zm-6-2H9v-2h2zm4 0h-2v-2h2zm-2-2h-2v-2h2zm-2-2H9V9h2zm4 0h-2V9h2zM9 9H7V7h2zm8 0h-2V7h2zM7 7H5V5h2zm12 0h-2V5h2z',
  reload:
    'M16 4h2v6h-2zm-2-2h2v2h-2zm0 2h2v8h-2zM4 8H2v5h2zM4 6h16v2H4zm4 14H6v-6h2zm2 2H8v-2h2zm0-2H8v-8h2zm10-4h2v-5h-2zM20 18H4v-2h16z',
  play: 'M15 11h-2V9h2zm0 4h-2v-2h2zm-2 2h-2v-2h2zm0-8h-2V7h2zm-2-2H9V5h2zM9 21H7V3h2zm6-8h2v-2h-2zm-6 4h2v2H9z',
  list: 'M6 6H4v2h2zm14 0H8v2h12zM4 11h2v2H4zm16 0H8v2h12zM4 16h2v2H4zm16 0H8v2h12z',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  readonly name: IconName;
  readonly size?: 24 | 48;
}

export function PixelIcon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      {...rest}
    >
      <path fill="currentColor" d={PATHS[name]} />
    </svg>
  );
}
