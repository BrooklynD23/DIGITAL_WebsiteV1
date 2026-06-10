import type { FrameAdjust, TeardownConfig } from '@/lib/teardown/types';
import { smoothstep } from '@/lib/teardown/utils';
import { framePngSrc, TEARDOWN_ENCODED_ASSETS, frameSrcSet } from '@/lib/teardown/assets';

export interface SequenceRendererContext {
  cfg: TeardownConfig;
  phone: HTMLDivElement;
}

export interface SequenceRenderer {
  layers: HTMLImageElement[];
  preload: Promise<void>[];
  renderProgress: (p: number) => void;
  destroy: () => void;
}

function applyFrameStyle(
  img: HTMLImageElement,
  adjust: FrameAdjust,
  opacity: number,
  blur: number,
  scale: number
) {
  const tx = adjust.dx.toFixed(1);
  const ty = adjust.dy.toFixed(1);
  const s = (adjust.scale * scale).toFixed(4);
  const op = opacity.toFixed(3);
  const b = blur.toFixed(2);
  img.style.cssText =
    `opacity:${op};filter:blur(${b}px);` +
    `transform:translate3d(${tx}px,${ty}px,0) scale(${s})`;
}

export function createSequenceRenderer(
  ctx: SequenceRendererContext
): SequenceRenderer {
  const { cfg, phone } = ctx;
  const N = cfg.frameCount;
  const layers: HTMLImageElement[] = [];
  let ready = false;
  let prevI = -1;
  let prevJ = -1;

  for (let i = 0; i < N; i++) {
    const img = document.createElement('img');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.src = framePngSrc(i + 1);
    img.className =
      'absolute inset-0 block h-full w-full object-contain opacity-0 [pointer-events:none] [backface-visibility:hidden] [will-change:opacity,transform,filter]';

    if (TEARDOWN_ENCODED_ASSETS) {
      const picture = document.createElement('picture');
      picture.className = 'absolute inset-0 block h-full w-full [pointer-events:none]';
      const avif = document.createElement('source');
      avif.type = 'image/avif';
      avif.srcset = frameSrcSet(i + 1, 'avif');
      avif.sizes = 'min(86vw, 1180px)';
      const webp = document.createElement('source');
      webp.type = 'image/webp';
      webp.srcset = frameSrcSet(i + 1, 'webp');
      webp.sizes = 'min(86vw, 1180px)';
      picture.appendChild(avif);
      picture.appendChild(webp);
      picture.appendChild(img);
      phone.appendChild(picture);
    } else {
      phone.appendChild(img);
    }

    layers.push(img);
  }

  const preload = layers.map(
    (img, i) =>
      new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => {
          // eslint-disable-next-line no-console
          console.warn('Failed to load teardown frame', i + 1, img.src);
          resolve();
        };
      })
  );

  const renderProgress = (p: number) => {
    if (!ready) return;

    const HOLD = cfg.hold;
    const MAXBLUR = 14;

    const s = p * (N - 1);
    const i = Math.min(Math.max(Math.floor(s), 0), N - 1);
    const localT = s - i;

    let tau = 0;
    if (i < N - 1 && localT >= HOLD) {
      tau = smoothstep((localT - HOLD) / (1 - HOLD));
    }
    if (i === N - 1) tau = 0;

    const j = i + 1 < N ? i + 1 : -1;
    const adjI = cfg.frameAdjust[i] ?? { dx: 0, dy: 0, scale: 1 };
    const adjJ =
      j >= 0
        ? (cfg.frameAdjust[j] ?? { dx: 0, dy: 0, scale: 1 })
        : { dx: 0, dy: 0, scale: 1 };

    if (prevI !== i && prevI >= 0 && prevI !== j)
      layers[prevI].style.cssText = 'opacity:0';
    if (prevJ !== j && prevJ >= 0 && prevJ !== i)
      layers[prevJ].style.cssText = 'opacity:0';

    const opOut = 1 - tau;
    const blurOut = MAXBLUR * tau;
    const scaleOut = 1 + 0.06 * tau;
    applyFrameStyle(layers[i], adjI, opOut, blurOut, scaleOut);

    if (j >= 0) {
      const blurIn = MAXBLUR * (1 - tau);
      const scaleIn = 0.94 + 0.06 * tau;
      applyFrameStyle(layers[j], adjJ, tau, blurIn, scaleIn);
    }

    prevI = i;
    prevJ = j;
  };

  const preloadAll = Promise.all(preload).then(() => {
    ready = true;
  });

  return {
    layers,
    preload: [preloadAll],
    renderProgress,
    destroy: () => {
      phone.querySelectorAll('picture, img[aria-hidden]').forEach((el) =>
        el.remove()
      );
    },
  };
}
