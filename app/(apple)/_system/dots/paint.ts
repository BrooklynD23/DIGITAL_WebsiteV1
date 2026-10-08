/** 2D canvas painter for engine frames. Lines first, then dots (already z-sorted). */
import type { Frame, LineForm } from './types';

const DASH_PX: Readonly<Record<LineForm, number[]>> = { solid: [], dashed: [4, 3], dotted: [1, 3] };

export interface Inks {
  /** Ink colour (any CSS colour). */
  readonly ink: string;
  /** Trigger red for the anchor dot. */
  readonly trigger: string;
}

/**
 * Paint `f` into a canvas whose backing store is size*dpr square.
 * Coordinates map exactly like DotGlyph's toPx, so the SVG rest pose and the
 * canvas frame at t = 1 overlap pixel for pixel.
 */
export function paintFrame(ctx: CanvasRenderingContext2D, f: Frame, size: number, dpr: number, inks: Inks): void {
  const s = size * dpr;
  const px = (v: number): number => ((v * 0.92 + 1) * s) / 2;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, s, s);
  ctx.lineCap = 'round';
  ctx.lineWidth = dpr;
  ctx.strokeStyle = inks.ink;
  for (const l of f.lines) {
    ctx.globalAlpha = l.a;
    ctx.setLineDash(DASH_PX[l.form].map((v) => v * dpr));
    ctx.beginPath();
    ctx.moveTo(px(l.x1), px(l.y1));
    ctx.lineTo(px(l.x2), px(l.y2));
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = inks.ink;
  for (const d of f.dots) {
    ctx.globalAlpha = d.a;
    ctx.beginPath();
    ctx.arc(px(d.x), px(d.y), d.r * dpr, 0, Math.PI * 2);
    if (d.kind === 'hollow') {
      ctx.setLineDash([2 * dpr, 1.5 * dpr]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (d.kind === 'anchor') {
      ctx.fillStyle = inks.trigger;
      ctx.fill();
      ctx.fillStyle = inks.ink;
    } else {
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
