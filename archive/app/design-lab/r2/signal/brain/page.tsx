import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { JoinChapter, WorldFooter, WorldNav } from '../../_chrome';
import { brain, chapters, close, coda, hero, type ChapterId } from '../../_content/brain';
import {
  ChapterPin,
  Confirm,
  ContextChapter,
  EvalsDemo,
  HarnessDemo,
  HeroOrb,
  HowItWorks,
  LoopDemo,
  McpDemo,
  MethodLoop,
  PlanMark,
  Sources,
  SubagentsCoda,
  ToolsDemo,
  type World,
} from '../../_brain';
import s from './brain.module.css';

export const metadata: Metadata = {
  title: 'BRAIN · Signal Capture · DIGITAL lab r2',
  description: 'How agentic systems work, one mechanism at a time: a live capture on the CH3 timebase.',
};

const WORLD: World = 'signal';
const DEMOS: Partial<Record<ChapterId, ComponentType<{ world: World }>>> = {
  loop: LoopDemo,
  tools: ToolsDemo,
  mcp: McpDemo,
  harness: HarnessDemo,
  evals: EvalsDemo,
};

const t = (n: number): string => `T+${String(n).padStart(2, '0')}`;

export default function BrainSignalPage() {
  return (
    <>
      <WorldNav world="signal" current="brain" />
      <main id="r2-main" className={s.page}>
        {/* T+00: the live capture */}
        <section className={s.hero} aria-labelledby="brain-hero">
          <span className={s.tick} aria-hidden="true">
            {t(0)}
          </span>
          <div className={s.heroText}>
            <h1 id="brain-hero" className={s.h1}>
              {hero.headline}
            </h1>
            <p className={s.lead}>
              {hero.lead} <Confirm />
            </p>
          </div>
          <div className={s.heroStage}>
            <HeroOrb world={WORLD} />
          </div>
        </section>

        {chapters.map((ch) => {
          const tick = (
            <span className={s.tick} aria-hidden="true">
              {t(ch.n)}
            </span>
          );
          const head = (
            <h2 id={`h-${ch.id}`} className={s.h2}>
              {ch.headline}
            </h2>
          );
          const caption = (
            <p className={s.caption} data-late="">
              {ch.caption}
            </p>
          );
          const how = (
            <div data-late="">
              <HowItWorks ch={ch} world={WORLD} />
            </div>
          );
          if (ch.id === 'context') {
            return (
              <ContextChapter
                key={ch.id}
                world={WORLD}
                id={`ch-${ch.id}`}
                labelledBy={`h-${ch.id}`}
                classes={{ pin: `${s.capture} ${s.scrub}`, sticky: s.sticky, text: s.text, stage: s.instrument }}
                tick={tick}
                head={head}
                caption={caption}
                how={how}
              />
            );
          }
          const Demo = DEMOS[ch.id];
          return (
            <div key={ch.id} className={s.group}>
              <ChapterPin id={`ch-${ch.id}`} labelledBy={`h-${ch.id}`} className={s.capture} stickyClassName={s.sticky}>
                {tick}
                <div className={s.text}>
                  {head}
                  {caption}
                  {how}
                </div>
                <div className={s.instrument}>{Demo ? <Demo world={WORLD} /> : null}</div>
              </ChapterPin>
              {ch.id === 'harness' ? (
                <section className={s.coda} aria-labelledby="h-coda">
                  <span className={s.tick} aria-hidden="true">{`${t(ch.n)} · CODA`}</span>
                  <div className={s.text}>
                    <h3 id="h-coda" className={s.h3}>
                      {coda.label}
                    </h3>
                  </div>
                  <div className={s.instrument}>
                    <SubagentsCoda world={WORLD} />
                  </div>
                </section>
              ) : null}
            </div>
          );
        })}

        {/* T+07: BRAIN itself */}
        <section id="brain" className={s.mark} aria-labelledby="h-brain">
          <span className={s.tick} aria-hidden="true">
            {t(7)}
          </span>
          <div className={s.markArt}>
            <PlanMark size={220} label="The orb returns to its plan outline" />
          </div>
          <div className={s.markText}>
            <h2 id="h-brain" className={s.h1}>
              {brain.name}
            </h2>
            <p className={s.expansion}>{brain.expansion}</p>
          </div>
        </section>

        <JoinChapter world="signal" headline={close.join.headline}>
          <div className={s.facts}>
            <p className={s.thesis}>
              {close.thesis} <Confirm />
            </p>
            <MethodLoop world={WORLD} />
            <ul className={s.qList} aria-label="Three questions per project">
              {close.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p className={s.small}>
              {`${close.does[0]} ${close.does[1]}`} <Confirm /> {`${close.does[2]} Status: ${brain.status}.`} <Confirm />
            </p>
          </div>
        </JoinChapter>

        <div className={s.sources}>
          <Sources world={WORLD} />
        </div>
      </main>
      <WorldFooter world="signal" />
    </>
  );
}
