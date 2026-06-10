/** When true, renderers use <picture> AVIF/WebP srcsets (requires npm run encode:teardown). */
export const TEARDOWN_ENCODED_ASSETS = false;

/** Responsive widths emitted by scripts/encode-teardown-assets.mjs */
export const TEARDOWN_WIDTHS = [760, 1100, 1700] as const;

export type TeardownWidth = (typeof TEARDOWN_WIDTHS)[number];

export function frameAssetBase(index: number): string {
  return `frame-${String(index).padStart(2, '0')}`;
}

export function layerAssetBase(asset: string): string {
  return asset;
}

/** Build srcset for AVIF/WebP frame sequence assets. */
export function frameSrcSet(
  index: number,
  format: 'avif' | 'webp'
): string {
  return TEARDOWN_WIDTHS.map(
    (w) => `/assets/frames/${frameAssetBase(index)}-${w}.${format} ${w}w`
  ).join(', ');
}

export function layerSrcSet(
  asset: string,
  format: 'avif' | 'webp'
): string {
  return TEARDOWN_WIDTHS.map(
    (w) => `/assets/layers/${layerAssetBase(asset)}-${w}.${format} ${w}w`
  ).join(', ');
}

export function posterSrcSet(format: 'avif' | 'webp'): string {
  return TEARDOWN_WIDTHS.map(
    (w) => `/assets/frames/poster-${w}.${format} ${w}w`
  ).join(', ');
}

/** PNG source of truth (always present). Encoded WebP preferred when available. */
export function framePngSrc(index: number): string {
  return `/assets/frames/${frameAssetBase(index)}.png`;
}

export function layerPngSrc(asset: string): string {
  return `/assets/layers/${layerAssetBase(asset)}.png`;
}

export function posterPngSrc(): string {
  return `/assets/frames/frame-12.png`;
}

/** Fallback img src: encoded WebP at width, else PNG. */
export function frameFallbackSrc(index: number, width: TeardownWidth = 1700): string {
  return `/assets/frames/${frameAssetBase(index)}-${width}.webp`;
}

export function layerFallbackSrc(
  asset: string,
  width: TeardownWidth = 1700
): string {
  return `/assets/layers/${layerAssetBase(asset)}-${width}.webp`;
}

export function posterFallbackSrc(width: TeardownWidth = 1100): string {
  return `/assets/frames/poster-${width}.webp`;
}

/** Eager low-res first frame for hero paint. */
export const EAGER_FRAME_SRC = '/assets/frames/frame-01-760.webp';
