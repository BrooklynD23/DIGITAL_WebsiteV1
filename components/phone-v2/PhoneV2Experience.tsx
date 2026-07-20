'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { animate } from 'animejs';
import EscapeHatch from '@/components/ui/EscapeHatch';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { Loader } from './Loader';
import { Hero } from './Hero';
import { HUD } from './HUD';
import { SpecCard } from './SpecCard';
import { SubsystemStage } from './SubsystemStage';
import { FinalCta } from './FinalCta';

const DARK_BG = '#0F172A';
const PANEL = '#1E293B';
const RAISED = '#334155';
const TEXT = '#F1F5F9';
const TEXT_DIM = '#94A3B8';
const CTA = '#818CF8';

export default function PhoneV2Experience() {
  const [showLoader, setShowLoader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const loaderDismissedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      loaderDismissedRef.current = true;
      setShowLoader(false);
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      if (!loaderDismissedRef.current) {
        setShowLoader(true);
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const completeLoader = useCallback(() => {
    if (loaderDismissedRef.current) return;
    loaderDismissedRef.current = true;
    if (rootRef.current) {
      animate(rootRef.current, {
        opacity: [0.96, 1],
        duration: 220,
        ease: 'out(3)',
      });
    }
    setShowLoader(false);
  }, []);

  return (
    <div
      ref={rootRef}
      data-phone-root
      className="min-h-screen bg-[#0F172A] text-[#F1F5F9]"
      style={
        {
          '--phone-bg': DARK_BG,
          '--phone-panel': PANEL,
          '--phone-raised': RAISED,
          '--phone-text': TEXT,
          '--phone-text-dim': TEXT_DIM,
          '--phone-cta': CTA,
        } as CSSProperties
      }
    >
      <EscapeHatch tone="dark" />

      {showLoader ? (
        <Loader onComplete={completeLoader} accent={CTA} reduceMotion={reduceMotion} />
      ) : null}

      <Hero accent={CTA} />

      <section id="phone-toolbox" className="relative border-b border-white/10 bg-[#0F172A] px-6 py-16 text-[#F1F5F9] md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start">
          <div className="max-w-[40ch]">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
              {phoneV2Copy.toolbox.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(30px,5vw,58px)] font-bold uppercase leading-[0.9] tracking-[-0.04em]">
              {phoneV2Copy.toolbox.headline}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#CBD5E1]">
              {phoneV2Copy.toolbox.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
            <HUD
              label={phoneV2Copy.toolbox.lensLabel}
              title={phoneV2Copy.toolbox.specHeading}
              description={phoneV2Copy.toolbox.specLead}
              lines={phoneV2Copy.toolbox.specLines}
              accent={CTA}
            />
            <SpecCard
              heading={phoneV2Copy.toolbox.specHeading}
              lead={phoneV2Copy.toolbox.specLead}
              lines={phoneV2Copy.toolbox.specLines}
              accent={CTA}
              className="self-start"
            />
          </div>
        </div>
      </section>

      <SubsystemStage accentBase={CTA} reduceMotion={reduceMotion} />

      <section className="border-b border-white/10 bg-[#F1F5F9] px-6 py-16 text-[#0F172A] md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] md:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#475569]">
              {phoneV2Copy.buildScope.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.8vw,56px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
              {phoneV2Copy.buildScope.headline}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[16px] leading-[1.6] text-[#334155]">
              {phoneV2Copy.buildScope.description}
            </p>
          </div>

          <SpecCard
            heading={phoneV2Copy.buildScope.scopeTitle}
            lead={phoneV2Copy.buildScope.scopeItems[0]}
            lines={phoneV2Copy.buildScope.scopeItems.slice(1)}
            accent={CTA}
            dark={false}
          />
        </div>
      </section>

      <FinalCta accent={CTA} reduceMotion={reduceMotion} />
    </div>
  );
}
