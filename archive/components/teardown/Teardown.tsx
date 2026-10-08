'use client';

import { useEffect, useRef, useState } from 'react';
import { TEARDOWN_CFG } from '@/lib/teardown/config';
import type { TeardownConfig, TeardownRenderer } from '@/lib/teardown/types';
import { MOBILE_MAX_WIDTH } from '@/lib/teardown/utils';
import Lenis from 'lenis';
import { createSequenceRenderer } from './engine/sequenceRenderer';
import { createRegisteredRenderer } from './engine/registeredRenderer';
import { createVideoRenderer } from './engine/videoRenderer';
import { createCanvasSeqRenderer } from './engine/canvasSeqRenderer';
import { TeardownMobilePoster } from './TeardownMobilePoster';
import { BatteryProgress } from './BatteryProgress';

interface TeardownProps {
  config?: Partial<TeardownConfig>;
  eyebrow?: string;
  heading?: React.ReactNode;
  caption?: string;
}

export function Teardown({
  config,
  eyebrow = 'Scroll to disassemble',
  heading = (
    <>
      twelve layers,
      <br />
      one device.
    </>
  ),
  caption = 'Scroll down and the Modular Smartphone comes apart — board by board, part by part. Scroll back up and it reassembles. Every layer is tied to your scroll.',
}: TeardownProps) {
  // Dev/preview A/B: ?renderer=video|sequence|registered overrides the configured renderer.
  const [rendererOverride, setRendererOverride] =
    useState<TeardownRenderer | null>(null);

  const cfg = {
    ...TEARDOWN_CFG,
    ...config,
    ...(rendererOverride ? { renderer: rendererOverride } : {}),
  };
  const N = cfg.frameCount;
  const layerCount =
    cfg.renderer === 'registered' ? cfg.layers.length : cfg.frameCount;

  const [showMobilePoster, setShowMobilePoster] = useState(false);

  const trackRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const railCountRef = useRef<HTMLDivElement | null>(null);
  const stateLabelRef = useRef<HTMLDivElement | null>(null);
  const stateNoteRef = useRef<HTMLDivElement | null>(null);
  const stateWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('renderer');
    if (
      param === 'video' ||
      param === 'sequence' ||
      param === 'registered' ||
      param === 'canvas'
    ) {
      setRendererOverride(param);
    }
  }, []);

  useEffect(() => {
    const mobileMq = window.matchMedia(
      `(max-width: ${MOBILE_MAX_WIDTH}px)`
    );
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      setShowMobilePoster(mobileMq.matches || motionMq.matches);
    };

    updateMode();
    mobileMq.addEventListener('change', updateMode);
    motionMq.addEventListener('change', updateMode);
    return () => {
      mobileMq.removeEventListener('change', updateMode);
      motionMq.removeEventListener('change', updateMode);
    };
  }, []);

  // Lenis inertial smooth-scroll for the scrubbed renderers (ione-style). Lenis
  // drives the real document scroll, so the render effect's scroll listener
  // picks up its interpolated position automatically.
  useEffect(() => {
    if (showMobilePoster) return;
    const wantsLenis =
      cfg.renderer === 'canvas' ||
      cfg.renderer === 'video' ||
      cfg.smoothScroll;
    if (!wantsLenis) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [showMobilePoster, cfg.renderer, cfg.smoothScroll]);

  useEffect(() => {
    if (showMobilePoster) return;

    const track = trackRef.current;
    const phone = phoneRef.current;
    const railEl = railRef.current;
    const railCount = railCountRef.current;
    const stateLabel = stateLabelRef.current;
    const stateNote = stateNoteRef.current;
    const stateWrap = stateWrapRef.current;
    if (!track || !phone) return;

    const renderer =
      cfg.renderer === 'registered'
        ? createRegisteredRenderer({ cfg, phone })
        : cfg.renderer === 'video'
          ? createVideoRenderer({ cfg, phone })
          : cfg.renderer === 'canvas'
            ? createCanvasSeqRenderer({ cfg, phone })
            : createSequenceRenderer({ cfg, phone });

    // Canvas/video scrubbing is fed by Lenis-smoothed scroll; track it directly
    // (lerp = 1) so we don't compound two smoothing passes into visible lag.
    const effLerp =
      cfg.renderer === 'canvas' || cfg.renderer === 'video' ? 1 : cfg.lerp;

    let progress = 0;
    let targetP = 0;
    let raf: number | null = null;
    const computeTarget = () => {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const passed = Math.min(Math.max(-r.top, 0), total);
      targetP = total > 0 ? passed / total : 0;
    };

    const resolveState = (p: number) => {
      if (cfg.renderer === 'registered') {
        let active = cfg.layers[0];
        for (const layer of cfg.layers) {
          const mid = (layer.start + layer.end) / 2;
          if (p >= mid) active = layer;
        }
        return { label: active.label, note: active.note };
      }

      let label = cfg.states[0].label;
      let note = cfg.states[0].note;
      for (const st of cfg.states) {
        if (p >= st.at) {
          label = st.label;
          note = st.note;
        }
      }
      return { label, note };
    };

    const updateMarginNote = (p: number) => {
      const { label, note } = resolveState(p);
      if (!stateLabel || !stateNote || !stateWrap) return;

      if (
        stateLabel.textContent !== label ||
        stateNote.textContent !== note
      ) {
        stateWrap.style.opacity = '0';
        stateWrap.style.transform = 'translateY(8px)';
        window.setTimeout(() => {
          if (!stateLabel || !stateNote || !stateWrap) return;
          stateLabel.textContent = label;
          stateNote.textContent = note;
          stateWrap.style.opacity = '1';
          stateWrap.style.transform = 'translateY(0)';
        }, 120);
      }
    };

    const render = () => {
      progress += (targetP - progress) * effLerp;
      if (Math.abs(targetP - progress) < 0.0004) progress = targetP;

      renderer.renderProgress(progress);

      const counterMax =
        cfg.renderer === 'registered' ? layerCount : N;
      let counterVal = 1;
      if (cfg.renderer === 'registered') {
        for (let i = 0; i < cfg.layers.length; i++) {
          if (progress >= cfg.layers[i].start) counterVal = i + 1;
        }
      } else {
        counterVal = Math.round(progress * (N - 1)) + 1;
      }

      if (railEl) {
        railEl.style.width = (progress * 100).toFixed(1) + '%';
        const bar = railEl.closest('[role="progressbar"]');
        if (bar) {
          bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
        }
      }
      if (railCount)
        railCount.textContent =
          String(counterVal).padStart(2, '0') +
          ' / ' +
          String(counterMax).padStart(2, '0');

      updateMarginNote(progress);

      raf =
        Math.abs(targetP - progress) > 0.0004
          ? requestAnimationFrame(render)
          : null;
    };

    const onScroll = () => {
      computeTarget();
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    Promise.all(renderer.preload).then(() => {
      computeTarget();
      renderer.renderProgress(progress);
      render();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      renderer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMobilePoster, cfg.renderer, N, layerCount]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!nodes.length) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.2 }
    );
    nodes.forEach((n) => obs.observe(n));

    return () => obs.disconnect();
  }, []);

  if (showMobilePoster) {
    return (
      <TeardownMobilePoster
        cfg={cfg}
        eyebrow={eyebrow}
        heading={heading}
        caption={caption}
      />
    );
  }

  const initialLabel =
    cfg.renderer === 'registered'
      ? cfg.layers[0].label
      : cfg.states[0].label;
  const initialNote =
    cfg.renderer === 'registered'
      ? cfg.layers[0].note
      : cfg.states[0].note;

  return (
    <section
      ref={trackRef}
      id="teardown"
      aria-label="Modular Smartphone teardown"
      className="relative"
      style={{ height: cfg.pinLen }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute left-[max(4vw,24px)] top-1/2 z-[3] hidden max-w-[250px] -translate-y-1/2 [@media(min-width:821px)]:block">
          <p className="eyebrow mb-[14px] block">{eyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.6vw,42px)] font-bold uppercase leading-none tracking-[-.02em]">
            {heading}
          </h2>
          <p className="mt-[14px] text-sm leading-[1.55] text-ink-soft">
            {caption}
          </p>
        </div>

        <div
          ref={phoneRef}
          aria-hidden="true"
          className="relative h-[min(82vh,820px)] w-[min(86vw,1180px)]"
        />

        <div className="absolute right-[max(4vw,24px)] top-1/2 z-[3] hidden max-w-[230px] -translate-y-1/2 text-left [@media(min-width:821px)]:block">
          <div
            ref={stateWrapRef}
            className="transition-all duration-300 ease-out"
          >
            <div
              ref={stateLabelRef}
              className="font-mono text-[11px] leading-none tracking-label text-ink-soft"
            >
              {initialLabel}
            </div>
            <div
              ref={stateNoteRef}
              className="mt-[10px] font-display text-[clamp(26px,3.4vw,46px)] font-bold uppercase leading-[.95] tracking-[-.01em] text-accent before:align-[.4em] before:text-[.5em] before:content-['◂_']"
            >
              {initialNote}
            </div>
          </div>
        </div>

        <div
          ref={railCountRef}
          className="absolute bottom-[calc(4.5vh+14px)] left-1/2 z-[3] -translate-x-1/2 font-mono text-[10px] leading-none tracking-[.2em] text-ink-soft"
        >
          {`01 / ${String(layerCount).padStart(2, '0')}`}
        </div>
        <div className="absolute bottom-[4.5vh] left-1/2 z-[3] -translate-x-1/2">
          <BatteryProgress fillRef={railRef} />
        </div>
      </div>
    </section>
  );
}

export default Teardown;
