'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, createTimeline, onScroll, stagger } from 'animejs';
import { PhoneSchematicSvg } from './PhoneSchematicSvg';
import { SpecCard } from './SpecCard';
import { TickScrubber } from './TickScrubber';
import { TextReveal } from '@/components/motion/TextReveal';
import { phoneV2Copy } from '@/lib/data/phoneV2';

const ACTIVE_STYLE = 'transition-all duration-700 ease-out';

export interface SubsystemStageProps {
  readonly accentBase: string;
  readonly reduceMotion: boolean;
}

const PART_IDS = [
  'phone-front-glass',
  'phone-screen-ui',
  'phone-display-panel',
  'phone-midframe',
  'phone-main-pcb',
  'phone-battery',
  'phone-camera-module',
  'phone-antenna-module',
  'phone-speakers',
  'phone-buttons',
  'phone-haptics',
  'phone-flex-cables',
  'phone-screws',
  'phone-back-cover',
] as const;

export function SubsystemStage({ accentBase, reduceMotion }: SubsystemStageProps) {
  const sections = phoneV2Copy.subsystemSections;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<SVGSVGElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const current = sections[activeIndex] ?? sections[0];
  const currentAccent = current.accent ?? accentBase;

  const activeIds = useMemo<readonly string[]>(
    () => (reduceMotion ? PART_IDS : current.activePartIds),
    [current, reduceMotion]
  );

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!stageRef.current || !isDesktop) return;

    if (reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(0);
      return;
    }

    const timeline = createTimeline({
      autoplay: onScroll({
        target: stageRef.current,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
      }),
      defaults: { duration: 1000, ease: 'linear' },
    });

    timeline.add({
      duration: sections.length * 1000,
      onUpdate: (self) => {
        const rawProgress = self.progress > 1 ? self.progress / 100 : self.progress;
        const p = Math.min(Math.max(rawProgress, 0), 1);
        const nextIndex = Math.min(
          sections.length - 1,
          Math.floor(p * sections.length)
        );
        setActiveIndex(nextIndex);
      },
    });

    return () => {
      timeline.revert();
    };
  }, [isDesktop, reduceMotion, sections.length]);

  useEffect(() => {
    const svg = phoneRef.current;
    if (
      !svg ||
      !isDesktop ||
      reduceMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const activeSelector = activeIds.map((id) => `#${id}`).join(', ');
    const inactiveSelector = PART_IDS.filter((id) => !activeIds.includes(id)).map((id) => `#${id}`).join(', ');

    const animations: ReturnType<typeof animate>[] = [];

    if (activeSelector) {
      animations.push(animate(svg.querySelectorAll(activeSelector), {
        opacity: [0.65, 1],
        duration: 640,
        ease: 'out(3)',
        delay: stagger(40),
      }));
    }

    if (inactiveSelector) {
      animations.push(animate(svg.querySelectorAll(inactiveSelector), {
        opacity: [0.9, 0.58],
        duration: 520,
        ease: 'out(3)',
        delay: stagger(18),
      }));
    }

    return () => animations.forEach((animation) => animation.pause());
  }, [activeIds, isDesktop, reduceMotion]);

  return (
    <section id="phone-systems" className="relative border-b border-white/10 bg-[#0F172A] text-[#F1F5F9]">
      <div
        ref={stageRef}
        className={`mx-auto max-w-[1360px] px-6 py-16 md:px-8 lg:px-10 ${
          reduceMotion ? '' : 'md:min-h-[700svh]'
        }`}
      >
        <div className="mb-8 max-w-[52ch] md:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
            {phoneV2Copy.mobileStage.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(28px,6vw,48px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
            {phoneV2Copy.mobileStage.headline}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-[#CBD5E1]">
            {phoneV2Copy.mobileStage.description}
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] md:gap-8 lg:gap-12">
          <div className="relative">
            {sections.map((section, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              return (
                <article
                  key={section.id}
                  className={`flex items-center border-b border-white/5 py-12 ${
                    reduceMotion ? '' : 'min-h-[100svh]'
                  }`}
                  style={{
                    opacity: reduceMotion ? 1 : isActive ? 1 : isPast ? 0.34 : 0.48,
                  }}
                >
                  <div className={ACTIVE_STYLE}>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.24em]"
                      style={{
                        color:
                          reduceMotion || isActive
                            ? section.accent
                            : '#94A3B8',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')} / 07
                    </p>
                    <TextReveal
                      as="h3"
                      split="words"
                      trigger="scroll"
                      className="mt-4 max-w-[12ch] font-display text-[clamp(34px,5vw,72px)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-[#F1F5F9]"
                      disabled={!isDesktop}
                    >
                      {section.title}
                    </TextReveal>
                    <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.6] text-[#CBD5E1]">
                      {section.description}
                    </p>
                    <ul className="mt-6 space-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#CBD5E1]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span className="mt-[6px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: section.accent }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative">
            <div
              className={`flex flex-col justify-center pb-10 pt-10 ${
                reduceMotion ? '' : 'sticky top-0 h-[100svh]'
              }`}
            >
              <div className="relative">
                <div className="absolute right-0 top-0 z-10">
                  <TickScrubber
                    activeIndex={activeIndex}
                    count={sections.length}
                    label={current.scrubberLabel}
                    detail={`${String(activeIndex + 1).padStart(2, '0')} / 07`}
                    progress={(activeIndex + 1) / sections.length}
                  />
                </div>
                <PhoneSchematicSvg
                  ref={phoneRef}
                  accent={currentAccent}
                  activePartIds={activeIds}
                  progress={0.68}
                  assembled={false}
                  className="mx-auto w-full max-w-[860px]"
                />
              </div>

              <SpecCard
                heading={current.specHeading}
                lead={current.specLines[0]}
                lines={current.specLines.slice(1)}
                accent={currentAccent}
                className="mt-6 ml-auto w-full max-w-[340px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-10 md:hidden">
          {sections.map((section, index) => (
            <article key={section.id} className="rounded-[10px] border border-white/10 bg-white/[0.03] p-4">
              <PhoneSchematicSvg
                accent={section.accent}
                activePartIds={section.activePartIds}
                progress={0.42}
                assembled={false}
                mobile
                className="mx-auto w-full max-w-[420px]"
              />
              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: section.accent }}>
                  {String(index + 1).padStart(2, '0')} / 07
                </p>
                <h3 className="mt-3 font-display text-[clamp(28px,6vw,48px)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
                  {section.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.55] text-[#CBD5E1]">{section.description}</p>
                <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#CBD5E1]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-[5px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: section.accent }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <SpecCard
                  heading={section.specHeading}
                  lead={section.specLines[0]}
                  lines={section.specLines.slice(1)}
                  accent={section.accent}
                  dark
                  collapsed
                  className="mt-4"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
