'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createTimeline, stagger } from 'animejs';
import { TextReveal } from '@/components/motion/TextReveal';
import { PhoneSchematicSvg } from './PhoneSchematicSvg';
import { phoneV2Copy } from '@/lib/data/phoneV2';

export interface FinalCtaProps {
  readonly accent: string;
  readonly reduceMotion: boolean;
}

export function FinalCta({ accent, reduceMotion }: FinalCtaProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<SVGSVGElement | null>(null);
  const [assembled, setAssembled] = useState(reduceMotion);

  useEffect(() => {
    if (
      reduceMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setAssembled(true);
      return;
    }

    const section = sectionRef.current;
    const phone = phoneRef.current;
    if (!section || !phone) return;

    let timeline: ReturnType<typeof createTimeline> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || timeline) return;
        timeline = createTimeline({
          autoplay: true,
          defaults: { ease: 'inOut(3)' },
          onComplete: () => setAssembled(true),
        }).add(
          phone.querySelectorAll('[data-phone-part="true"]'),
          {
            translateX: 0,
            translateY: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 1050,
            delay: stagger(45, { from: 'center' }),
          },
          0
        );
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      timeline?.pause();
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F172A] text-[#F1F5F9]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(129,140,248,0.16),transparent_26%),radial-gradient(circle_at_80%_75%,rgba(74,222,128,0.10),transparent_22%)]" />
      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
              {phoneV2Copy.finalCta.eyebrow}
            </p>
            <TextReveal
              as="h2"
              split="words"
              trigger="scroll"
              className="mt-4 max-w-[12ch] font-display text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]"
            >
              {phoneV2Copy.finalCta.headline}
            </TextReveal>
            <p className="mt-5 max-w-[36ch] text-[16px] leading-[1.6] text-[#CBD5E1]">
              {phoneV2Copy.finalCta.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center rounded-[4px] bg-[#818CF8] px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-[#0F172A] transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              >
                {phoneV2Copy.finalCta.primaryLabel}
              </Link>
              <Link
                href="/pillars"
                className="inline-flex items-center justify-center rounded-[4px] border border-white/14 bg-white/5 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-[#F1F5F9] transition-colors duration-200 ease-out hover:border-white/24 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              >
                {phoneV2Copy.finalCta.secondaryLabel}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-[4px] border border-white/14 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-[#CBD5E1] transition-colors duration-200 ease-out hover:border-white/24 hover:bg-white/10 hover:text-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              >
                {phoneV2Copy.finalCta.tertiaryLabel}
              </Link>
            </div>
            <p className="mt-6 max-w-[46ch] font-mono text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">
              {phoneV2Copy.finalCta.supportLine}
            </p>
          </div>

          <div className="relative">
            <PhoneSchematicSvg
              ref={phoneRef}
              accent={accent}
              activePartIds={[]}
              progress={0.86}
              assembled={assembled}
              className="mx-auto w-full max-w-[760px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

