/**
 * Concept C — rasterise a typed name into particle targets (client only).
 * Nothing is sent anywhere: the name lives in this tab's memory.
 */
import { SIGN_BASELINE_Y, SIGN_NAME_POINTS, mulberry32 } from './geometry';

const CANVAS_W = 1200;
const CANVAS_H = 300;
const BASE_PX = 236;
const MAX_WORLD_W = 1.78;
/** Shift right so a long name clears the × mark at the line's start. */
const NAME_X_OFFSET = 0.07;
const MAX_WORLD_CAP = 0.5;

export function nameToPoints(name: string, fontFamily: string): Float32Array | null {
  const text = name.trim();
  if (!text || typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  let size = 200;
  ctx.font = `600 ${size}px ${fontFamily}`;
  const w0 = ctx.measureText(text).width;
  if (w0 > CANVAS_W - 40) {
    size = Math.floor((size * (CANVAS_W - 40)) / w0);
    ctx.font = `600 ${size}px ${fontFamily}`;
  }
  const textW = ctx.measureText(text).width;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, (CANVAS_W - textW) / 2, BASE_PX);
  const { data } = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const hits: number[] = [];
  for (let y = 0; y < CANVAS_H; y += 2) {
    for (let x = 0; x < CANVAS_W; x += 2) {
      if (data[(y * CANVAS_W + x) * 4 + 3] > 128) hits.push(x, y);
    }
  }
  if (hits.length < 8) return null;
  // pixels → world: fit text width to MAX_WORLD_W and cap height to MAX_WORLD_CAP
  const ppu = Math.max(textW / MAX_WORLD_W, (size * 0.72) / MAX_WORLD_CAP);
  const rand = mulberry32(text.length * 7919 + text.charCodeAt(0));
  const out = new Float32Array(SIGN_NAME_POINTS * 3);
  const count = hits.length / 2;
  for (let i = 0; i < SIGN_NAME_POINTS; i += 1) {
    const k = Math.floor(rand() * count);
    const px = hits[k * 2] + rand() * 2;
    const py = hits[k * 2 + 1] + rand() * 2;
    out[i * 3] = (px - CANVAS_W / 2) / ppu + NAME_X_OFFSET;
    out[i * 3 + 1] = SIGN_BASELINE_Y + 0.05 + (BASE_PX - py) / ppu;
    out[i * 3 + 2] = (rand() - 0.5) * 0.12;
  }
  return out;
}
