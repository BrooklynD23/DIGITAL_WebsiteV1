'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, svg } from 'animejs';
import { TickScrubber } from './TickScrubber';
import { PhoneSchematicSvg } from './PhoneSchematicSvg';
import { phoneV2Copy } from '@/lib/data/phoneV2';

export interface LoaderProps {
  readonly onComplete: () => void;
  readonly accent: string;
  readonly reduceMotion: boolean;
}

export function Loader({ onComplete, accent, reduceMotion }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const didCompleteRef = useRef(false);
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }

    const root = rootRef.current;
    const svgNode = svgRef.current;
    if (!root || !svgNode) return;

    const drawTargets = svg.createDrawable(
      Array.from(
        svgNode.querySelectorAll(
          '#phone-front-glass rect, #phone-display-panel rect, #phone-midframe path, #phone-back-cover rect'
        )
      )
    );
    const wordmark = root.querySelector('[data-loader-wordmark]');
    const tagline = root.querySelector('[data-loader-tagline]');
    const scrubber = root.querySelector('[data-loader-scrubber]');
    if (!wordmark || !tagline || !scrubber) return;

    const timeline = createTimeline({
      autoplay: true,
      defaults: { duration: 620, ease: 'out(3)' },
      onUpdate: (self) => {
        setDrawProgress(Math.min(Math.max(self.progress, 0), 1));
      },
      onComplete: () => {
        if (didCompleteRef.current) return;
        didCompleteRef.current = true;
        onComplete();
      },
    });

    timeline
      .add(drawTargets, { draw: ['0 0', '0 1'], delay: stagger(70), duration: 900 }, 0)
      .add(
        wordmark,
        { opacity: [0, 1], translateY: [12, 0], duration: 420 },
        120
      )
      .add(
        tagline,
        { opacity: [0, 1], translateY: [8, 0], duration: 360 },
        240
      )
      .add(
        scrubber,
        { opacity: [0, 1], translateY: [8, 0], duration: 360 },
        280
      );

    const skip = () => {
      if (didCompleteRef.current) return;
      didCompleteRef.current = true;
      timeline.pause();
      animate(root, { opacity: [1, 0], duration: 220, ease: 'out(3)', onComplete });
    };

    window.addEventListener('wheel', skip, { passive: true, once: true });
    window.addEventListener('scroll', skip, { passive: true, once: true });
    window.addEventListener('keydown', skip, { once: true });

    root.addEventListener('pointerdown', skip, { once: true });

    return () => {
      timeline.pause();
      window.removeEventListener('wheel', skip);
      window.removeEventListener('scroll', skip);
      window.removeEventListener('keydown', skip);
      root.removeEventListener('pointerdown', skip);
    };
  }, [onComplete, reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A] text-[#F1F5F9]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(15,23,42,0.98))]" />
      <div className="relative flex w-full max-w-6xl flex-col items-center px-6 py-10 md:px-10">
        <div className="w-full max-w-3xl">
          <div data-loader-wordmark className="font-display text-[clamp(48px,10vw,150px)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em]">
            {phoneV2Copy.loaderWordmark}
          </div>
          <p data-loader-tagline className="mt-4 max-w-[28ch] font-mono text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">
            {phoneV2Copy.loaderTagline}
          </p>
        </div>

        <div className="mt-10 flex w-full items-end justify-between gap-8 md:mt-16">
          <div className="max-w-[38ch] text-[15px] leading-[1.55] text-[#CBD5E1]">
            {phoneV2Copy.hero.subline}
          </div>
          <div data-loader-scrubber>
            <TickScrubber
              activeIndex={Math.min(6, Math.floor(drawProgress * 7))}
              count={7}
              label={phoneV2Copy.loaderScrubberLabel}
              detail={phoneV2Copy.hero.skipLabel}
              progress={drawProgress}
              compact
              className="shrink-0"
            />
          </div>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <PhoneSchematicSvg
            ref={svgRef}
            accent={accent}
            activePartIds={['phone-front-glass', 'phone-display-panel']}
            progress={0}
            assembled={false}
            className="mx-auto h-auto w-full max-w-[860px]"
          />
        </div>
      </div>
    </div>
  );
}
