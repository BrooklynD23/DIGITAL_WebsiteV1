'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, svg } from 'animejs';
import { TickScrubber } from './TickScrubber';
import { PhoneSchematicSvg } from './PhoneSchematicSvg';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import {
  CLOSE_MS,
  DRAG_THRESHOLD_PX,
  EXPLODE_END,
  EXPLODE_START,
  FAST_FORWARD_RATE,
  LOADER_STAGES,
  OPEN_MS,
  OUTRO_FADE_MS,
  STAGES_MS,
  STAGE_COUNT,
  STAGE_MS,
  TIMELINE_MS,
  clamp01,
  clampInt,
  collectStageStrokes,
  easeInOutCubic,
} from './loaderSequence';

export interface LoaderProps {
  /** Fired once, at the START of the outro fade — the parent begins the hero reveal now. */
  readonly onHandoffStart: () => void;
  /** Fired once, after the fade completes — the parent unmounts this overlay. */
  readonly onComplete: () => void;
  readonly accent: string;
  readonly reduceMotion: boolean;
}

/** Pressing Shift on its own is not intent to skip. */
const BARE_MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/** Upper bound on waiting for webfonts before starting the timeline (cause 7 cap). */
const FONTS_READY_CAP_MS = 1000;

export function Loader({
  onHandoffStart,
  onComplete,
  accent,
  reduceMotion,
}: LoaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const handoffStartedRef = useRef(false);

  /**
   * Single source of truth: elapsed timeline time in ms (throttled to ~30fps).
   * Stage index, explode ramp and tick progress are all derived at render.
   * `currentTime` is used rather than `progress` because it stays meaningful
   * when playback rate changes mid-fast-forward.
   */
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Reduced motion: the parent has already jumped to `ready`; do nothing so
    // the timeline never initializes and this overlay unmounts immediately.
    if (reduceMotion) return;

    const root = rootRef.current;
    const svgNode = svgRef.current;
    if (!root || !svgNode) return;

    let cancelled = false;
    let fade: ReturnType<typeof animate> | null = null;
    let didFastForward = false;
    let didRestoreSpeed = false;
    let lastQuantized = -1;

    const finish = () => {
      onComplete();
    };

    const startTimeline = () => {
      if (cancelled) return;

      const wordmark = root.querySelector('[data-loader-wordmark]');
      const tagline = root.querySelector('[data-loader-tagline]');
      const scrubber = root.querySelector('[data-loader-scrubber]');
      if (!wordmark || !tagline || !scrubber) return;

      // Every stage's strokes are made drawable up front, in one pass, so the
      // whole phone starts hidden. createDrawable initialises an element only
      // once (it guards on pathLength), so creating these lazily per stage would
      // leave later parts fully visible from the first frame.
      const strokeBuckets = collectStageStrokes(svgNode);
      const drawables = strokeBuckets.map((bucket) =>
        bucket.length > 0 ? svg.createDrawable(bucket) : null
      );

      const dismiss = () => {
        if (handoffStartedRef.current || fade) return;
        handoffStartedRef.current = true;
        // Pause first, or per-frame state updates keep running through the fade.
        timeline.pause();
        // ONE overlapping transition: the hero reveal begins as this fade runs.
        onHandoffStart();
        fade = animate(root, {
          opacity: [1, 0],
          duration: OUTRO_FADE_MS,
          ease: 'out(3)',
          onComplete: finish,
        });
      };

      const fastForward = () => {
        if (handoffStartedRef.current || fade || didFastForward) return;
        didFastForward = true;
        timeline.speed = FAST_FORWARD_RATE;
      };

      const timeline = createTimeline({
        autoplay: true,
        defaults: { ease: 'out(3)' },
        onUpdate: (self) => {
          // Throttle to ~30fps of state updates — the SVG re-renders per
          // update, so full-rate setState was wasted work (cause 8).
          const quantized = Math.round(self.currentTime / 33) * 33;
          if (quantized !== lastQuantized) {
            lastQuantized = quantized;
            setElapsed(quantized);
          }
          // Let the closing frame settle at normal speed after a fast-forward,
          // so the last stage's 420ms CSS transitions land before the fade.
          if (didFastForward && !didRestoreSpeed && self.currentTime >= OPEN_MS + STAGES_MS) {
            didRestoreSpeed = true;
            self.speed = 1;
          }
        },
        onComplete: () => dismiss(),
      });

      timeline
        .add(wordmark, { opacity: [0, 1], translateY: [12, 0], duration: 380 }, 0)
        .add(tagline, { opacity: [0, 1], translateY: [8, 0], duration: 320 }, 120)
        .add(scrubber, { opacity: [0, 1], translateY: [8, 0], duration: 320 }, 200);

      drawables.forEach((drawable, index) => {
        if (!drawable) return;
        const count = strokeBuckets[index].length;
        // Bound the cascade so a stage's draw cannot run into the stage after next.
        const step = count > 1 ? Math.min(34, 180 / (count - 1)) : 0;
        timeline.add(
          drawable,
          { draw: ['0 0', '0 1'], duration: 240, delay: stagger(step) },
          OPEN_MS + index * STAGE_MS
        );
      });

      // Holds the finished phone before the handoff. Opacity 1 → 1 is a no-op;
      // this occupies time so the sequence runs its full length.
      timeline.add(root, { opacity: [1, 1], duration: CLOSE_MS }, OPEN_MS + STAGES_MS);

      const onWheel = () => fastForward();
      const onKeyDown = (event: KeyboardEvent) => {
        if (BARE_MODIFIERS.has(event.key)) return;
        dismiss();
      };

      // Pointer gesture: a drag fast-forwards, a tap skips. Binding skip to
      // pointerdown (as this component used to) would make every swipe an instant
      // skip and leave fast-forward unreachable on touch.
      let originX = 0;
      let originY = 0;
      let dragged = false;
      const onPointerDown = (event: PointerEvent) => {
        originX = event.clientX;
        originY = event.clientY;
        dragged = false;
      };
      const onPointerMove = (event: PointerEvent) => {
        if (dragged) return;
        if (Math.hypot(event.clientX - originX, event.clientY - originY) > DRAG_THRESHOLD_PX) {
          dragged = true;
          fastForward();
        }
      };
      const onPointerUp = () => {
        if (!dragged) dismiss();
      };
      const onPointerCancel = () => {
        dragged = false;
      };

      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('keydown', onKeyDown);
      root.addEventListener('pointerdown', onPointerDown);
      root.addEventListener('pointermove', onPointerMove);
      root.addEventListener('pointerup', onPointerUp);
      root.addEventListener('pointercancel', onPointerCancel);

      cleanupFns.push(() => window.removeEventListener('wheel', onWheel));
      cleanupFns.push(() => window.removeEventListener('keydown', onKeyDown));
      cleanupFns.push(() => root.removeEventListener('pointerdown', onPointerDown));
      cleanupFns.push(() => root.removeEventListener('pointermove', onPointerMove));
      cleanupFns.push(() => root.removeEventListener('pointerup', onPointerUp));
      cleanupFns.push(() => root.removeEventListener('pointercancel', onPointerCancel));

      // The overlay is a multi-second modal now, so the page must not scroll
      // behind it — otherwise a fast-forwarding visitor lands partway into the
      // hero. Compensate for the scrollbar so clearing it causes no layout shift.
      const { style } = document.body;
      const previousOverflow = style.overflow;
      const previousPaddingRight = style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      style.overflow = 'hidden';
      if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;
      cleanupFns.push(() => {
        style.overflow = previousOverflow;
        style.paddingRight = previousPaddingRight;
      });

      cleanupFns.push(() => timeline.revert());
    };

    const cleanupFns: Array<() => void> = [];

    // Gate the sequence on real readiness — webfonts — with a hard cap so the
    // approved budget can never stretch (cause 7).
    const fontsReady: Promise<unknown> =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((resolve) => window.setTimeout(resolve, FONTS_READY_CAP_MS)),
    ]).then(() => {
      startTimeline();
    });

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      fade?.revert();
    };
  }, [onComplete, onHandoffStart, reduceMotion]);

  // Derived render state — see `elapsed` above.
  const stageProgress = clamp01((elapsed - OPEN_MS) / STAGES_MS);
  const stageIndex = clampInt(Math.floor(stageProgress * STAGE_COUNT), 0, STAGE_COUNT - 1);
  const stage = LOADER_STAGES[stageIndex];
  const inOpening = elapsed < OPEN_MS;
  const explode = EXPLODE_START + (EXPLODE_END - EXPLODE_START) * easeInOutCubic(stageProgress);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex touch-none items-center justify-center bg-[#0F172A] text-[#F1F5F9]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(15,23,42,0.98))]" />
      <div className="relative flex w-full max-w-6xl flex-col items-center px-6 py-10 md:px-10">
        <div className="w-full max-w-3xl">
          {/*
            Initial hidden state is a CLASS, never an inline style. This
            component re-renders every frame, so an inline opacity would let
            React overwrite anime's inline value 60x a second and the chrome
            would never appear. Inline (anime) outranks class (React).
          */}
          <div
            data-loader-wordmark
            className="font-display text-[clamp(48px,10vw,150px)] font-extrabold leading-[0.85] tracking-[-0.04em] opacity-0"
          >
            {phoneV2Copy.loaderWordmark}
          </div>
          <p
            data-loader-tagline
            className="mt-4 max-w-[28ch] font-mono text-[11px] uppercase tracking-[0.24em] text-[#94A3B8] opacity-0"
          >
            {phoneV2Copy.loaderTagline}
          </p>
        </div>

        <div className="mt-10 flex w-full items-end justify-between gap-8 md:mt-16">
          <div className="max-w-[38ch] text-[15px] leading-[1.55] text-[#CBD5E1]">
            {phoneV2Copy.hero.subline}
          </div>
          <div data-loader-scrubber className="opacity-0">
            <TickScrubber
              activeIndex={inOpening ? -1 : stageIndex}
              count={STAGE_COUNT}
              label={phoneV2Copy.loaderScrubberLabel}
              detail={inOpening ? phoneV2Copy.hero.skipLabel : stage.scrubberLabel}
              progress={clamp01(elapsed / TIMELINE_MS)}
              compact
              className="shrink-0"
            />
          </div>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <PhoneSchematicSvg
            ref={svgRef}
            accent={inOpening ? accent : stage.accent}
            activePartIds={inOpening ? [] : stage.activePartIds}
            progress={explode}
            assembled={false}
            focusMode="dim"
            /* transitionGeometry intentionally omitted: React drives `progress`
               every frame, and a CSS transform transition would interpolate
               between those frames and smear the bloom. */
            className="mx-auto h-auto w-full max-w-[860px]"
          />
        </div>
      </div>
    </div>
  );
}
