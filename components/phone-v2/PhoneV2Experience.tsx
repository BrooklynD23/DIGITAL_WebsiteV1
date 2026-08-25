'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { TextReveal } from '@/components/motion/TextReveal';
import EscapeHatch from '@/components/ui/EscapeHatch';
import { phoneV2Copy } from '@/lib/data/phoneV2';
import { Loader } from './Loader';
import { Hero } from './Hero';
import { WorkflowRail } from './WorkflowRail';
import { SpecCard } from './SpecCard';
import { SubsystemStage } from './SubsystemStage';
import { FinalCta } from './FinalCta';

const DARK_BG = '#0F172A';
const PANEL = '#1E293B';
const RAISED = '#334155';
const TEXT = '#F1F5F9';
const TEXT_DIM = '#94A3B8';
const CTA = '#818CF8';

/**
 * Handoff state machine (ui-revision 04 §4):
 * - `booting`  — overlay opaque from FIRST PAINT (it renders in the
 *                prerendered HTML; JS dismisses, never summons). Hero text is
 *                armed (`.text-reveal-armed`, opacity 0).
 * - `handoff`  — 220ms overlap: the Loader fades itself out while the hero's
 *                TextReveal timelines start. One owner: this component.
 * - `ready`    — overlay unmounted; scroll unlocked.
 *
 * Reduced motion jumps `booting → ready` on the first client effect, before
 * the Loader initializes its timeline. There is no page-level opacity
 * animation — deleting it also removed the light-wash flash at handoff.
 */
type HandoffPhase = 'booting' | 'handoff' | 'ready';

export default function PhoneV2Experience() {
  const [phase, setPhase] = useState<HandoffPhase>('booting');
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduceMotion(mq.matches);
      if (mq.matches) {
        setPhase((current) => (current === 'booting' ? 'ready' : current));
      }
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const beginHandoff = useCallback(() => {
    setPhase((current) => (current === 'booting' ? 'handoff' : current));
  }, []);

  const completeHandoff = useCallback(() => {
    setPhase((current) => (current === 'handoff' ? 'ready' : current));
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

      {phase !== 'ready' ? (
        <Loader
          onHandoffStart={beginHandoff}
          onComplete={completeHandoff}
          accent={CTA}
          reduceMotion={reduceMotion}
        />
      ) : null}

      <Hero accent={CTA} revealReady={phase !== 'booting'} />

      <section id="phone-toolbox" className="relative border-b border-white/10 bg-[#0F172A] px-6 py-16 text-[#F1F5F9] md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start">
          <div className="max-w-[40ch]">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
              {phoneV2Copy.toolbox.eyebrow}
            </p>
            <TextReveal
              as="h2"
              split="lines"
              trigger="scroll"
              className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-bold leading-[0.9] tracking-[-0.04em]"
            >
              {phoneV2Copy.toolbox.headline}
            </TextReveal>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#CBD5E1]">
              {phoneV2Copy.toolbox.description}
            </p>
          </div>

          <WorkflowRail
            label={phoneV2Copy.toolbox.railLabel}
            title={phoneV2Copy.toolbox.specHeading}
            description={phoneV2Copy.toolbox.specLead}
            stages={phoneV2Copy.toolbox.workflowStages}
            lines={phoneV2Copy.toolbox.specLines}
            accent={CTA}
            reduceMotion={reduceMotion}
          />
        </div>
      </section>

      <SubsystemStage accentBase={CTA} reduceMotion={reduceMotion} />

      <section className="border-b border-white/10 bg-[#F1F5F9] px-6 py-16 text-[#0F172A] md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] md:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#475569]">
              {phoneV2Copy.buildScope.eyebrow}
            </p>
            <TextReveal
              as="h2"
              split="lines"
              trigger="scroll"
              className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-bold leading-[0.92] tracking-[-0.04em]"
            >
              {phoneV2Copy.buildScope.headline}
            </TextReveal>
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
