'use client';

/**
 * Orchestrator for the Modules landing. Lenis smooth scroll; useScroll progress
 * mirrored into progressRef for the R3F scene; background interpolates the
 * light→dark studio journey. Exposes window.__lenis for the screenshot harness.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import { LANDING_CONTENT, LANDING_PALETTE } from '@/lib/data/landing';
import EscapeHatch from '@/components/ui/EscapeHatch';
import LandingScene from './LandingScene';
import MissionBeats from './MissionBeats';
import ClubStrip from './ClubStrip';

export default function LandingExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();
  const [webgl, setWebgl] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const canvas = document.createElement('canvas');
    setWebgl(!!(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
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
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenisRef.current = null;
    };
  }, [reduce]);

  const bg = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.82],
    [LANDING_PALETTE.studio, LANDING_PALETTE.studio, LANDING_PALETTE.studioMid, LANDING_PALETTE.chamber]
  );

  const onPortal = (href: string) => router.push(href);

  // Static fallback (no WebGL / reduced motion).
  if (!webgl || reduce) {
    return (
      <>
        <main className="min-h-screen bg-[#16161a] px-8 py-24 text-center text-white">
          <p className="font-mono text-xs uppercase tracking-[0.26em] opacity-70">
            {LANDING_CONTENT.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-6xl font-extrabold uppercase tracking-tight">
            {LANDING_CONTENT.wordmark}
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-base opacity-75">
            {LANDING_CONTENT.tagline}
          </p>
          <div className="mx-auto mt-12 flex max-w-2xl flex-col justify-center gap-6 sm:flex-row">
            {LANDING_CONTENT.chamber.portals.map((pt) => (
              <a key={pt.id} href={pt.href} className="rounded-lg border border-white/20 p-6 text-left hover:border-white">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#d8412f]">{pt.eyebrow}</p>
                <p className="mt-2 font-display text-xl font-bold uppercase">{pt.title}</p>
                <p className="mt-1 font-body text-sm opacity-60">{pt.caption}</p>
              </a>
            ))}
          </div>
        </main>
        <ClubStrip />
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative h-[700vh] bg-[#d6d4d3]">
        <motion.div
          style={{ backgroundColor: bg }}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          <EscapeHatch tone="light" />

          {/* sweep + grain (same treatment as the glasses regrade) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-60"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 38%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.24) 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <LandingScene
            progressRef={progressRef}
            onPortal={onPortal}
            introDone={introDone}
            onIntroEnd={() => setIntroDone(true)}
            onHover={setHoveredPortal}
          />
          {!introDone && (
            <button
              type="button"
              onClick={() => setIntroDone(true)}
              className="absolute bottom-8 right-8 z-30 rounded-full border border-ink/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              {LANDING_CONTENT.skipLabel}
            </button>
          )}
          <MissionBeats scrollYProgress={scrollYProgress} hoveredId={hoveredPortal} />
        </motion.div>
      </div>
      <ClubStrip />
    </>
  );
}
