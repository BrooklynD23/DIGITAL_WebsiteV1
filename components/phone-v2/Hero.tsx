import Link from 'next/link';
import { TextReveal } from '@/components/motion/TextReveal';
import { PhoneSchematicSvg } from './PhoneSchematicSvg';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { TickScrubber } from './TickScrubber';

export interface HeroProps {
  readonly accent: string;
  readonly revealReady: boolean;
}

export function Hero({ accent, revealReady }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0F172A] text-[#F1F5F9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(129,140,248,0.13),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(74,222,128,0.08),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1360px] flex-col gap-10 px-6 py-10 md:flex-row md:items-center md:px-8 lg:px-10">
        <div className="max-w-[38rem] md:w-[40%]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#94A3B8]">
            {phoneV2Copy.hero.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-[#F1F5F9]">
            {phoneV2Copy.hero.headline.map((line, index) => (
              <TextReveal
                key={line}
                as="span"
                split="words"
                trigger="mount"
                delay={index * 0.12}
                className="block"
                disabled={!revealReady}
              >
                {line}
              </TextReveal>
            ))}
          </h1>
          <TextReveal
            as="p"
            split="lines"
            trigger="mount"
            delay={0.4}
            className="mt-6 max-w-[34ch] text-[16px] leading-[1.6] text-[#CBD5E1] md:text-[17px]"
            disabled={!revealReady}
          >
            {phoneV2Copy.hero.subline}
          </TextReveal>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#phone-toolbox"
              className="inline-flex items-center justify-center rounded-[4px] border border-transparent bg-[#818CF8] px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-[#0F172A] transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              {phoneV2Copy.hero.primaryCta}
            </Link>
            <Link
              href="#phone-systems"
              className="inline-flex items-center justify-center rounded-[4px] border border-white/14 bg-white/5 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-[#F1F5F9] transition-colors duration-200 ease-out hover:border-white/24 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              {phoneV2Copy.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="relative md:w-[60%]">
          <div className="absolute right-4 top-4 z-10 hidden md:block">
            <TickScrubber
              activeIndex={6}
              count={7}
              label={phoneV2Copy.hero.scrubberLabel}
              detail={phoneV2Copy.hero.scrubberDetail}
              progress={1}
            />
          </div>
          <PhoneSchematicSvg
            accent={accent}
            activePartIds={['phone-front-glass', 'phone-screen-ui', 'phone-display-panel']}
            progress={0.96}
            assembled={false}
            className="mx-auto w-full max-w-[860px]"
          />
        </div>
      </div>
    </section>
  );
}
