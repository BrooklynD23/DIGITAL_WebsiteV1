import type { TeardownConfig } from '@/lib/teardown/types';

export interface VideoRendererContext {
  cfg: TeardownConfig;
  phone: HTMLDivElement;
}

export interface VideoRenderer {
  preload: Promise<void>[];
  renderProgress: (p: number) => void;
  destroy: () => void;
}

/**
 * Scroll-scrubbed <video> renderer (ione.mykm.dev style).
 *
 * Maps scroll progress 0..1 onto video.currentTime, forward and reverse. The
 * source video must be encoded all-keyframe (GOP=1) so any seek decodes a single
 * frame instantly in both directions. Seeks are coalesced through the
 * seeking/seeked cycle so a fast scroll never queues a backlog of seeks.
 *
 * The scroll/lerp/RAF loop in Teardown.tsx is unchanged — this renderer only
 * implements the shared { preload, renderProgress, destroy } contract.
 */
export function createVideoRenderer(ctx: VideoRendererContext): VideoRenderer {
  const { cfg, phone } = ctx;

  /** Skip seeks smaller than ~one frame to avoid redundant thrash. */
  const SEEK_EPSILON = 1 / 48;

  const video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.loop = false;
  video.autoplay = false;
  video.tabIndex = -1;
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('disablepictureinpicture', '');
  video.className =
    'absolute inset-0 block h-full w-full object-contain [pointer-events:none] [backface-visibility:hidden] [will-change:transform]';
  if (cfg.videoPoster) video.poster = cfg.videoPoster;

  if (cfg.videoWebm) {
    const webm = document.createElement('source');
    webm.type = 'video/webm';
    webm.src = cfg.videoWebm;
    video.appendChild(webm);
  }
  if (cfg.videoSrc) {
    const mp4 = document.createElement('source');
    mp4.type = 'video/mp4';
    mp4.src = cfg.videoSrc;
    video.appendChild(mp4);
  }

  phone.appendChild(video);

  let ready = false;
  let duration = 0;
  let seeking = false;
  let pendingT: number | null = null;
  let lastSeekT = -1;

  const seekTo = (t: number) => {
    seeking = true;
    lastSeekT = t;
    try {
      video.currentTime = t;
    } catch {
      // Seeking before the media is seekable can throw; the next
      // renderProgress (post-canplay) will retry.
      seeking = false;
    }
  };

  const onSeeked = () => {
    seeking = false;
    if (pendingT !== null) {
      const t = pendingT;
      pendingT = null;
      if (Math.abs(t - lastSeekT) >= SEEK_EPSILON) seekTo(t);
    }
  };
  video.addEventListener('seeked', onSeeked);

  const renderProgress = (p: number) => {
    if (!ready || duration <= 0) return;

    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    const t = clamped * duration;

    if (Math.abs(t - lastSeekT) < SEEK_EPSILON) return;

    if (seeking) {
      pendingT = t;
      return;
    }
    seekTo(t);
  };

  const preload = new Promise<void>((resolve) => {
    const markReady = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      ready = duration > 0;
      resolve();
    };
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      markReady();
      return;
    }
    video.addEventListener('loadedmetadata', markReady, { once: true });
    video.addEventListener('canplay', markReady, { once: true });
    video.addEventListener(
      'error',
      () => {
        // eslint-disable-next-line no-console
        console.warn('Failed to load teardown video', cfg.videoSrc);
        resolve();
      },
      { once: true }
    );
  });

  video.load();

  return {
    preload: [preload],
    renderProgress,
    destroy: () => {
      video.removeEventListener('seeked', onSeeked);
      video.pause();
      video.removeAttribute('src');
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
      video.remove();
    },
  };
}
