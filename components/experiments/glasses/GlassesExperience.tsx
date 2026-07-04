'use client';

/**
 * Orchestrator for the /experiments/glasses scroll hero (Smart Reading).
 *
 * - Lenis provides inertial smooth scroll (the smoothness ingredient Mana uses).
 * - framer-motion useScroll reads scrollYProgress over a tall pin-track container.
 * - scrollYProgress is mirrored into progressRef, which the R3F scene lerps toward at 60fps.
 * - Layout is a SPLIT hero (text left, glasses right) so copy never sits under the device.
 * - A wearer-POV HUD beat fades in when the glasses face forward, then the device drops to the
 *   mid-bottom and the detail panels reveal.
 */

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';
import GlassesScene from './GlassesScene';
import ExperienceNav from './ExperienceNav';
import FloatingDecor from './FloatingDecor';
import PovBackground from './PovBackground';
import HudOverlay from './HudOverlay';
import InfoPanels from './InfoPanels';

/** Where each nav target lands along the scroll track (0..1). Keys match info-section ids. */
// Land on each panel's CENTER (full opacity) so a nav jump never stops in a crossfade gap
// where two panels overlap. Centers derive from InfoPanels band base 0.74, span 0.065.
const NAV_TARGET: Record<string, number> = {
  '#info-approach': 0.84,
  '#info-platform': 0.9,
  '#info-join': 0.97,
};

export default function GlassesExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });

  // Lenis inertial scroll (respects reduced-motion by skipping smoothing).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    // Debug handle (used for deterministic scroll jumps in screenshots/E2E).
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const onNavigate = (href: string) => {
    const el = containerRef.current;
    if (!el) return;
    const frac = NAV_TARGET[href] ?? 0.78;
    const dist = el.offsetHeight - window.innerHeight;
    const y = el.offsetTop + dist * frac;
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // --- Scroll-driven overlay transforms -------------------------------------
  const bg = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42, 0.8],
    ['#FACC15', '#FACC15', '#111827', '#0b0e16']
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -30]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  // Beat AFTER the POV/HUD has fully cleared (≤0.60) and BEFORE the panels (≥0.74), on charcoal.
  const revealOpacity = useTransform(scrollYProgress, [0.6, 0.64, 0.7, 0.74], [0, 1, 1, 0]);
  const revealY = useTransform(scrollYProgress, [0.6, 0.64], [24, 0]);

  const { hero, reveal, nav, cta, hud, pov, info } = GLASSES_CONTENT;

  return (
    <div ref={containerRef} className="relative h-[460vh] bg-[#FACC15]">
      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <ExperienceNav nav={nav} cta={cta} onNavigate={onNavigate} />

        {/* POV "reading world" — sits behind the glasses, blurry -> clear */}
        <PovBackground scrollYProgress={scrollYProgress} pov={pov} />

        {/* 3D glasses canvas (right side in hero; in front of the POV text) */}
        <GlassesScene progressRef={progressRef} />

        {/* Floating decor (hero only) */}
        <FloatingDecor scrollYProgress={scrollYProgress} />

        {/* Hero — LEFT column (split layout; stacks to top-center on small screens) */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-y-0 left-0 z-20 flex w-full max-w-xl flex-col justify-center px-8 text-left max-sm:max-w-none max-sm:items-center max-sm:justify-start max-sm:px-6 max-sm:pt-[16vh] max-sm:text-center sm:px-14"
        >
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-black/70">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight text-black sm:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-md font-body text-base leading-relaxed text-black/75">
            {hero.lede}
          </p>
          <div className="mt-7">
            <button
              type="button"
              onClick={() => onNavigate(cta.href)}
              className="pointer-events-auto rounded-full bg-black px-6 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#d8412f]"
            >
              {cta.label}
            </button>
          </div>
        </motion.div>

        {/* Wearer-POV HUD (fades in when the glasses face forward) */}
        <HudOverlay scrollYProgress={scrollYProgress} words={pov.words} hud={hud} />

        {/* Resolve headline — lands just after the HUD beat */}
        <motion.div
          style={{ opacity: revealOpacity, y: revealY }}
          className="pointer-events-none absolute inset-x-0 top-[16%] z-20 px-6 text-center"
        >
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
            {reveal.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-white/65">
            {reveal.sub}
          </p>
        </motion.div>

        {/* Phase-3 detail panels */}
        <InfoPanels sections={info} scrollYProgress={scrollYProgress} />

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center font-mono text-xs uppercase tracking-[0.3em] text-black/60"
        >
          {hero.footnote} ↓
        </motion.div>
      </motion.div>
    </div>
  );
}
