import type { RegisteredLayer, TeardownConfig } from '@/lib/teardown/types';
import { clamp, easeOut } from '@/lib/teardown/utils';
import { layerPngSrc, TEARDOWN_ENCODED_ASSETS, layerSrcSet } from '@/lib/teardown/assets';

export interface RegisteredRendererContext {
  cfg: TeardownConfig;
  phone: HTMLDivElement;
}

export interface RegisteredRenderer {
  preload: Promise<void>[];
  renderProgress: (p: number) => void;
  destroy: () => void;
}

interface LayerNodes {
  wrap: HTMLDivElement;
  shadow: HTMLDivElement;
  img: HTMLImageElement;
  layer: RegisteredLayer;
}

export function createRegisteredRenderer(
  ctx: RegisteredRendererContext
): RegisteredRenderer {
  const { cfg, phone } = ctx;
  const nodes: LayerNodes[] = [];

  const contactShadow = document.createElement('div');
  contactShadow.setAttribute('aria-hidden', 'true');
  contactShadow.className =
    'pointer-events-none absolute bottom-[8%] left-1/2 z-[1] h-[18px] w-[42%] -translate-x-1/2 rounded-[50%] bg-[rgba(0,0,0,0.12)] blur-md transition-opacity duration-300';
  phone.appendChild(contactShadow);

  for (const layer of cfg.layers) {
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className =
      'absolute inset-0 [pointer-events:none] [will-change:transform]';
    wrap.style.zIndex = String(Math.round(layer.depth * 100));

    const shadow = document.createElement('div');
    shadow.className =
      'pointer-events-none absolute inset-[18%_22%_28%_22%] rounded-[40%] bg-[rgba(0,0,0,0.22)] opacity-0 blur-xl [will-change:transform,opacity]';
    wrap.appendChild(shadow);

    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = layerPngSrc(layer.asset);
    img.className =
      'block h-full w-full object-contain [backface-visibility:hidden] [will-change:transform]';

    if (TEARDOWN_ENCODED_ASSETS) {
      const picture = document.createElement('picture');
      picture.className = 'absolute inset-0 block h-full w-full';
      const avif = document.createElement('source');
      avif.type = 'image/avif';
      avif.srcset = layerSrcSet(layer.asset, 'avif');
      avif.sizes = 'min(86vw, 1180px)';
      const webp = document.createElement('source');
      webp.type = 'image/webp';
      webp.srcset = layerSrcSet(layer.asset, 'webp');
      webp.sizes = 'min(86vw, 1180px)';
      picture.appendChild(avif);
      picture.appendChild(webp);
      picture.appendChild(img);
      wrap.appendChild(picture);
    } else {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'absolute inset-0 block h-full w-full';
      imgWrap.appendChild(img);
      wrap.appendChild(imgWrap);
    }
    phone.appendChild(wrap);
    nodes.push({ wrap, shadow, img, layer });
  }

  const preload = nodes.map(
    ({ img }, idx) =>
      new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => {
          // eslint-disable-next-line no-console
          console.warn('Failed to load teardown layer', cfg.layers[idx].asset);
          resolve();
        };
      })
  );

  const renderProgress = (p: number) => {
    let maxSep = 0;

    for (const { wrap, shadow, layer } of nodes) {
      const span = Math.max(layer.end - layer.start, 0.001);
      const e = easeOut(clamp((p - layer.start) / span, 0, 1));
      const travel = 1 - layer.depth * 0.35;
      const tx = layer.dx * e * travel;
      const ty = layer.dy * e * travel;
      const scale = 1 - 0.03 * layer.depth * e;

      wrap.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;

      const sep = Math.hypot(tx, ty);
      maxSep = Math.max(maxSep, sep);
      const shadowOp = Math.min(0.55, sep / 180);
      const shadowScale = 1 + sep / 420;
      shadow.style.opacity = shadowOp.toFixed(3);
      shadow.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${shadowScale.toFixed(3)})`;
    }

    contactShadow.style.opacity = String(Math.min(0.35, maxSep / 260));
    contactShadow.style.transform = `translateX(-50%) scaleX(${1 + maxSep / 500})`;
  };

  const preloadAll = Promise.all(preload).then(() => undefined);

  return {
    preload: [preloadAll],
    renderProgress,
    destroy: () => {
      nodes.forEach(({ wrap }) => wrap.remove());
      contactShadow.remove();
    },
  };
}
