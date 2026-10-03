import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { JoinChapter, LocalNav, WorldFooter, WorldNav } from '../../_chrome';
import { brain, chapters, close, coda, hero, type ChapterId } from '../../_content/brain';
import {
  ChapterPin,
  Confirm,
  ContextChapter,
  EvalsDemo,
  HarnessDemo,
  HeroClip,
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
  title: 'BRAIN · DIGITAL lab r2',
  description: 'A model predicts. A system gets work done. Six mechanisms of agentic systems, one per chapter.',
};

const WORLD: World = 'apple';
const DEMOS: Partial<Record<ChapterId, ComponentType<{ world: World }>>> = {
  loop: LoopDemo,
  tools: ToolsDemo,
  mcp: McpDemo,
  harness: HarnessDemo,
  evals: EvalsDemo,
};

export default function BrainApplePage() {
  return (
    <>
      <WorldNav world="apple" current="brain" join={false} />
      <LocalNav
        title={brain.name}
        titleHref="/design-lab/r2/apple/brain/"
        tone="dark"
        links={[
          { label: 'Chapters', href: '#ch-loop' },
          { label: 'About BRAIN', href: '#brain' },
        ]}
      />
      <main id="r2-main" className={s.page}>
        <section className={s.hero} data-tone="dark" aria-labelledby="brain-hero">
          <h1 id="brain-hero" className={s.h1}>
            <span className={s.line}>A model predicts.</span>
            <span className={s.line}>A system gets work done.</span>
          </h1>
          <div className={s.heroStage}>
            <HeroClip fallback={<HeroOrb world={WORLD} />} />
          </div>
          <p className={s.lead}>
            {hero.lead} <Confirm />
          </p>
        </section>

        {chapters.map((ch) => {
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
            <div className={s.howRow} data-late="">
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
                classes={{ pin: s.chapter, pinB: `${s.chapter} ${s.chapterB}`, sticky: s.sticky, text: s.head, stage: s.stage }}
                head={head}
                caption={caption}
                how={how}
              />
            );
          }
          const Demo = DEMOS[ch.id];
          return (
            <div key={ch.id} className={s.group} data-tone="dark">
              <ChapterPin id={`ch-${ch.id}`} labelledBy={`h-${ch.id}`} tone="dark" className={s.chapter} stickyClassName={s.sticky}>
                <div className={s.head}>
                  {head}
                  {caption}
                </div>
                <div className={s.stage}>{Demo ? <Demo world={WORLD} /> : null}</div>
                {how}
              </ChapterPin>
              {ch.id === 'harness' ? (
                <section className={s.coda} aria-labelledby="h-coda">
                  <h3 id="h-coda" className={s.h3}>
                    {coda.label}
                  </h3>
                  <SubagentsCoda world={WORLD} />
                </section>
              ) : null}
            </div>
          );
        })}

        <section id="brain" className={s.about} aria-labelledby="h-brain">
          <PlanMark size={160} label="The orb returns to its plan outline" />
          <h2 id="h-brain" className={s.h1}>
            {brain.name}
          </h2>
          <p className={s.expansion}>{brain.expansion}</p>
        </section>

        <JoinChapter world="apple" headline={close.join.headline}>
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
      <WorldFooter world="apple" />
    </>
  );
}
