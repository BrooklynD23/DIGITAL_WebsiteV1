import type { TeardownConfig } from '@/lib/teardown/types';

export interface CanvasSeqRendererContext {
  cfg: TeardownConfig;
  phone: HTMLDivElement;
}

export interface CanvasSeqRenderer {
  preload: Promise<void>[];
  renderProgress: (p: number) => void;
  destroy: () => void;
}

/**
 * Canvas frame-sequence renderer (ione.mykm.dev style).
 *
 * Scroll progress 0..1 maps to a frame index in a preloaded image array; the
 * current frame is painted to a <canvas> with an alpha crossfade into its
 * neighbour. Unlike a scrubbed <video>, drawing image[i] is stateless and
 * symmetric, so reverse scrubbing is exactly as smooth as forward — there is no
 * decoder seek. Pairs with Lenis smooth-scroll (see Teardown.tsx) so progress
 * arrives as small continuous deltas in both directions.
 *
 * Implements the shared { preload, renderProgress, destroy } renderer contract.
 */
export function createCanvasSeqRenderer(
  ctx: CanvasSeqRendererContext
): CanvasSeqRenderer {
  const { cfg, phone } = ctx;
  const N = Math.max(1, cfg.canvasFrameCount ?? 0);
  const dir = cfg.canvasFrameDir ?? '/assets/teardown/frames';
  const framePath = (i: number) =>
    `${dir}/f-${String(i).padStart(4, '0')}.webp`;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className =
    'absolute inset-0 block h-full w-full [pointer-events:none]';
  phone.appendChild(canvas);
  const g = canvas.getContext('2d');

  const images: HTMLImageElement[] = [];
  let ready = false;
  let cw = 0;
  let ch = 0;
  let lastDraw = -1;
  let lastReq = 0;

  for (let i = 1; i <= N; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.src = framePath(i);
    images.push(img);
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = phone.getBoundingClientRect();
    cw = Math.max(1, Math.round(rect.width));
    ch = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    if (g) g.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastDraw = -1; // force repaint at new size
  };

  /** object-contain placement of a frame within the canvas. */
  const placement = (img: HTMLImageElement) => {
    const iw = img.naturalWidth || cw;
    const ih = img.naturalHeight || ch;
    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    return { dx: (cw - dw) / 2, dy: (ch - dh) / 2, dw, dh };
  };

  const drawFrame = (img: HTMLImageElement, alpha: number) => {
    if (!g || !img.complete || img.naturalWidth === 0) return;
    g.globalAlpha = alpha;
    const { dx, dy, dw, dh } = placement(img);
    g.drawImage(img, dx, dy, dw, dh);
  };

  const renderProgress = (p: number) => {
    lastReq = p;
    if (!ready || !g) return;
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    const s = clamped * (N - 1);
    const i = Math.min(Math.max(Math.floor(s), 0), N - 1);
    const tau = s - i;
    const j = i + 1 < N ? i + 1 : -1;

    // Skip repaint when neither the base frame nor a meaningful blend changed.
    const key = i + (j >= 0 ? Math.round(tau * 100) / 1000 : 0);
    if (key === lastDraw) return;
    lastDraw = key;

    g.globalAlpha = 1;
    g.clearRect(0, 0, cw, ch);
    drawFrame(images[i], 1);
    if (j >= 0 && tau > 0.001) drawFrame(images[j], tau);
    g.globalAlpha = 1;
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (ready) renderProgress(lastReq);
  });
  ro.observe(phone);

  const preload = Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          img.onload = () => resolve();
          img.onerror = () => {
            // eslint-disable-next-line no-console
            console.warn('Failed to load teardown frame', img.src);
            resolve();
          };
        })
    )
  ).then(() => {
    resize();
    ready = true;
  });

  return {
    preload: [preload],
    renderProgress,
    destroy: () => {
      ro.disconnect();
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      canvas.remove();
    },
  };
}
