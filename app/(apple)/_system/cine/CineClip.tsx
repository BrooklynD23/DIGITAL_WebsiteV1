'use client';

/**
 * <CineClip name world? mode? progress? /> — plays a procedural clip from the CINE manifest.
 *
 * Layers: a <picture> poster (rest/final frame, 4:5 under 640px) is the server HTML, the no-JS state and
 * the reduced-motion state. A muted, playsInline <video> (no autoplay attribute) mounts on the client
 * above it and becomes visible once its first frame is decoded.
 *
 *   once  — plays once when ≥60% visible (retries if play() is rejected); pause/replay button (44px).
 *   loop  — loops while on screen, pauses offscreen; pause/play button; optional maxLoops. Hero background only.
 *   scrub — paused all-intra video; currentTime follows `progress` (0..1) or ref.setProgress(p).
 *           rAF runs only while the target changes.
 *
 * world: 'signal' (default, #0b0c0a bone) | 'apple' (#000, Apple greys, copper boards). Pick the page's world:
 * the files and the control's colours both follow it.
 * Reduced motion: poster only, never autoplays. once/loop keep a "Play animation" button (opt-in).
 * 0 rAF at rest. If the clip is not rendered yet (manifest ready:false) the `fallback` renders instead.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '../tokens/scroll';
import { CINE, type CineMode, type CineName, type CineWorld } from './manifest';
import styles from './cine.module.css';

export interface CineClipProps {
  name: CineName;
  /** Which world's render to use. Default 'signal'. Apple pages must pass 'apple'. */
  world?: CineWorld;
  /** Defaults to the manifest mode for this clip (brain-orb is authored as 'loop'). */
  mode?: CineMode;
  /** scrub only: 0..1. For per-frame scroll drives prefer the ref's setProgress (no React re-render). */
  progress?: number;
  /** Rendered while the clip is not ready (e.g. a DotStage / BoardSvg rest pose). Default: nothing. */
  fallback?: ReactNode;
  /** Accessible label; defaults to the manifest label. Pass '' to mark the clip decorative. */
  label?: string;
  /** Default 'auto' = 4:5 under 640px, else 16:9. Only force an aspect for a fixed-shape slot. */
  aspect?: 'auto' | '16x9' | '4x5';
  /** Show the play/pause control (once/loop). Default true. Scrub never shows one. */
  controls?: boolean;
  /** IntersectionObserver threshold for 'once'. Default 0.6. */
  threshold?: number;
  /** loop only: pause after this many loops (the control can resume). Default: unlimited. */
  maxLoops?: number;
  /** Clip time in seconds, from the video's timeupdate (~4 Hz, no rAF) and after each scrub seek. */
  onTime?: (seconds: number) => void;
  onEnded?: () => void;
  /** Hero / LCP use: load the poster eagerly with high fetch priority. Default false (lazy). */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Imperative handle (ref). */
export interface CineClipHandle {
  /** scrub: drive progress 0..1 without a React re-render. */
  setProgress: (p: number) => void;
  play: () => void;
  pause: () => void;
  /** The mounted <video>, or null (poster-only states). */
  video: () => HTMLVideoElement | null;
}

type Aspect = '16x9' | '4x5';
type Status = 'idle' | 'playing' | 'paused' | 'ended';

const MOBILE_QUERY = '(max-width: 639px)';
const SCRUB_EASE = 0.45; // fraction of the remaining distance covered per frame
const SCRUB_EPS = 1 / 60; // seconds

function useAspect(forced: CineClipProps['aspect']): Aspect {
  const [aspect, setAspect] = useState<Aspect>(forced === '4x5' ? '4x5' : '16x9');
  useEffect(() => {
    if (forced && forced !== 'auto') {
      setAspect(forced);
      return;
    }
    const mq = window.matchMedia(MOBILE_QUERY);
    const on = (): void => setAspect(mq.matches ? '4x5' : '16x9');
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [forced]);
  return aspect;
}

const clamp01 = (n: number): number => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

export const CineClip = forwardRef<CineClipHandle, CineClipProps>(function CineClip(
  {
    name,
    world = 'signal',
    mode,
    progress,
    fallback = null,
    label,
    aspect: forcedAspect = 'auto',
    controls = true,
    threshold = 0.6,
    maxLoops,
    onTime,
    onEnded,
    eager = false,
    className,
    style,
  },
  ref,
) {
  const clip = CINE[name];
  const files = clip.worlds[world] ?? clip.worlds.signal;
  const m: CineMode = mode ?? clip.mode;
  const reduced = useReducedMotion();
  const aspect = useAspect(forcedAspect);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [near, setNear] = useState(false);
  const [visibleFrame, setVisibleFrame] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [optIn, setOptIn] = useState(false); // reduced-motion user pressed play
  const userPaused = useRef(false);
  const loops = useRef(0);
  const lastTime = useRef(0);
  const scrubTarget = useRef(0);
  const scrubShown = useRef(-1);
  const scrubRaf = useRef<number | null>(null);
  const onTimeRef = useRef(onTime);
  onTimeRef.current = onTime;

  const motionOk = !reduced || optIn;
  const showVideo = mounted && clip.ready && (m === 'scrub' ? !reduced : motionOk);

  useEffect(() => setMounted(true), []);

  // Preload upgrade once the clip is within half a viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !clip.ready) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [clip.ready]);

  // Reset when the source changes (aspect or world switch).
  useEffect(() => {
    setVisibleFrame(false);
    scrubShown.current = -1;
  }, [aspect, world]);

  // once / loop: viewport-driven playback.
  useEffect(() => {
    const el = rootRef.current;
    const v = videoRef.current;
    if (!el || !v || !showVideo || m === 'scrub') return;
    if (reduced && !optIn) return;
    let played = false;
    let pending = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (m === 'once') {
          if (e.isIntersecting && !played && !pending && !userPaused.current) {
            pending = true;
            v.play()
              .then(() => {
                played = true;
                io.disconnect();
              })
              .catch(() => undefined) // rejected (e.g. not yet loadable): stay observed and retry on the next entry
              .finally(() => {
                pending = false;
              });
          }
          return;
        }
        if (e.isIntersecting && !userPaused.current) void v.play().catch(() => undefined);
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: m === 'once' ? threshold : 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showVideo, m, reduced, optIn, threshold, aspect, world]);

  // scrub: coalesce target changes into rAF steps that stop when settled.
  const step = useCallback(() => {
    scrubRaf.current = null;
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration === 0) return;
    const target = scrubTarget.current * v.duration;
    if (v.seeking) {
      scrubRaf.current = requestAnimationFrame(step);
      return;
    }
    const cur = scrubShown.current < 0 ? target : scrubShown.current;
    let next = cur + (target - cur) * SCRUB_EASE;
    if (Math.abs(target - next) < SCRUB_EPS) next = target;
    if (Math.abs(v.currentTime - next) > 1e-3) v.currentTime = next;
    scrubShown.current = next;
    onTimeRef.current?.(next);
    if (next !== target) scrubRaf.current = requestAnimationFrame(step);
  }, []);

  const drive = useCallback(
    (p: number) => {
      scrubTarget.current = clamp01(p);
      if (scrubRaf.current === null && videoRef.current) scrubRaf.current = requestAnimationFrame(step);
    },
    [step],
  );

  useEffect(() => {
    if (m !== 'scrub' || !showVideo || progress === undefined) return;
    drive(progress);
  }, [progress, m, showVideo, drive]);

  useEffect(
    () => () => {
      if (scrubRaf.current !== null) cancelAnimationFrame(scrubRaf.current);
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (p: number) => {
        if (m === 'scrub') drive(p);
      },
      play: () => {
        userPaused.current = false;
        if (reduced && !optIn) setOptIn(true);
        else void videoRef.current?.play().catch(() => undefined);
      },
      pause: () => {
        userPaused.current = true;
        videoRef.current?.pause();
      },
      video: () => videoRef.current,
    }),
    [m, drive, reduced, optIn],
  );

  const onToggle = (): void => {
    const v = videoRef.current;
    if (reduced && !optIn) {
      userPaused.current = false;
      setOptIn(true); // mounts the video; the effect below starts it
      return;
    }
    if (!v) return;
    if (status === 'playing') {
      userPaused.current = true;
      v.pause();
    } else {
      userPaused.current = false;
      loops.current = 0;
      if (status === 'ended') v.currentTime = 0;
      void v.play().catch(() => undefined);
    }
  };

  // Reduced-motion opt-in: start as soon as the video exists.
  useEffect(() => {
    if (optIn && videoRef.current) void videoRef.current.play().catch(() => undefined);
  }, [optIn, showVideo]);

  if (!clip.ready) return fallback ? <>{fallback}</> : null;

  const src = aspect === '4x5' ? files.src4x5 : files.src16x9;
  const sources =
    clip.order === 'mp4-first'
      ? [
          { src: src.mp4, type: 'video/mp4' },
          { src: src.webm, type: 'video/webm; codecs=vp9' },
        ]
      : [
          { src: src.webm, type: 'video/webm; codecs=vp9' },
          { src: src.mp4, type: 'video/mp4' },
        ];
  const a11yLabel = label ?? clip.label;
  const decorative = a11yLabel === '';
  const showButton = controls && m !== 'scrub' && mounted;
  const buttonLabel =
    reduced && !optIn
      ? 'Play animation'
      : status === 'playing'
        ? 'Pause animation'
        : status === 'ended'
          ? 'Replay animation'
          : 'Play animation';
  const icon = status === 'playing' && motionOk ? 'pause' : status === 'ended' ? 'replay' : 'play';

  return (
    <div
      ref={rootRef}
      className={[styles.clip, className].filter(Boolean).join(' ')}
      style={{ background: files.ground, ...style }}
      data-cine={name}
      data-world={world}
      data-mode={m}
      data-aspect={forcedAspect}
      data-status={status}
    >
      <div
        className={styles.media}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : a11yLabel}
        aria-hidden={decorative ? true : undefined}
      >
        <picture className={styles.poster}>
          {forcedAspect === 'auto' && <source media={MOBILE_QUERY} srcSet={files.poster4x5} type="image/webp" />}
          <img
            src={forcedAspect === '4x5' ? files.poster4x5 : files.poster}
            alt=""
            decoding="async"
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            draggable={false}
          />
        </picture>
        {showVideo && (
          <video
            key={`${world}-${aspect}`}
            ref={videoRef}
            className={styles.video}
            data-visible={visibleFrame ? 'true' : 'false'}
            muted
            playsInline
            loop={m === 'loop'}
            preload={near ? 'auto' : 'metadata'}
            disablePictureInPicture
            aria-hidden
            tabIndex={-1}
            onLoadedData={() => {
              setVisibleFrame(true);
              if (m === 'scrub') {
                scrubShown.current = -1;
                if (scrubRaf.current === null) scrubRaf.current = requestAnimationFrame(step);
              }
            }}
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              if (m === 'loop' && t < lastTime.current - 0.5) {
                loops.current += 1;
                if (maxLoops !== undefined && loops.current >= maxLoops) {
                  userPaused.current = true; // stays paused on re-entry; the control resumes it
                  e.currentTarget.pause();
                }
              }
              lastTime.current = t;
              if (m !== 'scrub') onTimeRef.current?.(t);
            }}
            onPlay={() => setStatus('playing')}
            onPause={(e) => setStatus(e.currentTarget.ended ? 'ended' : 'paused')}
            onEnded={() => {
              setStatus('ended');
              onEnded?.();
            }}
          >
            {sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
      </div>
      {showButton && (
        <button type="button" className={styles.control} onClick={onToggle} aria-label={buttonLabel}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
            {icon === 'pause' && (
              <g fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </g>
            )}
            {icon === 'play' && <path d="M8 5.5v13l11-6.5z" fill="currentColor" />}
            {icon === 'replay' && (
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12a7 7 0 1 0 2.05-4.95" />
                <path d="M5 4v4h4" strokeLinejoin="round" />
              </g>
            )}
          </svg>
        </button>
      )}
    </div>
  );
});
