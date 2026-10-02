import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { WorldFooter, WorldNav } from '../../_chrome';
import { brain, chapters, close, hero, type ChapterId } from '../../_content/brain';
import {
  Confirm,
  ContextChapter,
  EngineeringDemo,
  EvalsDemo,
  Fidelity,
  HarnessDemo,
  HeroOrb,
  LoopDemo,
  McpDemo,
  MethodLoop,
  NotesCoda,
  PlanMark,
  Sources,
  SubagentsDemo,
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
  engineering: EngineeringDemo,
  harness: HarnessDemo,
  subagents: SubagentsDemo,
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
            <p className={s.status}>
              {`CH3 · ${brain.name} · STATUS ${brain.status.toUpperCase()}`} <Confirm />
            </p>
            <p className={s.key}>{hero.key}</p>
          </div>
          <div className={s.heroStage}>
            <HeroOrb world={WORLD} />
          </div>
        </section>

        {chapters.map((ch) => {
          const head = (
            <>
              <h2 id={`h-${ch.id}`} className={s.h2}>
                {ch.headline}
              </h2>
              <p className={s.caption}>{ch.caption}</p>
              <Fidelity ch={ch} world={WORLD} />
              {ch.id === 'harness' ? <NotesCoda world={WORLD} /> : null}
            </>
          );
          if (ch.id === 'context') {
            return (
              <ContextChapter
                key={ch.id}
                world={WORLD}
                id={`ch-${ch.id}`}
                labelledBy={`h-${ch.id}`}
                className={`${s.capture} ${s.pinned}`}
                stickyClassName={s.sticky}
                textClassName={s.text}
                stageClassName={s.instrument}
              >
                <span className={s.tickInline} aria-hidden="true">{`${t(ch.n)} · SCRUB`}</span>
                {head}
              </ContextChapter>
            );
          }
          const Demo = DEMOS[ch.id];
          return (
            <section key={ch.id} id={`ch-${ch.id}`} className={s.capture} aria-labelledby={`h-${ch.id}`}>
              <span className={s.tick} aria-hidden="true">
                {t(ch.n)}
              </span>
              <div className={s.text}>{head}</div>
              <div className={s.instrument}>{Demo ? <Demo world={WORLD} /> : null}</div>
            </section>
          );
        })}

        {/* T+09: BRAIN itself */}
        <section id="brain" className={s.close} aria-labelledby="h-brain">
          <span className={s.tick} aria-hidden="true">
            {t(9)}
          </span>
          <div className={s.closeMark}>
            <PlanMark size={200} label="The orb returns to its plan outline" />
          </div>
          <div className={s.closeText}>
            <h2 id="h-brain" className={s.h2}>
              {brain.name}
            </h2>
            <p className={s.expansion}>{brain.expansion}</p>
            <p className={s.caption}>
              {close.thesis} <Confirm />
            </p>
            <MethodLoop world={WORLD} />
            <p className={s.small}>{close.methodLine}</p>
          </div>
        </section>

        <section className={s.closeTwo} aria-labelledby="h-join">
          <div className={s.questions}>
            <ul className={s.qList} aria-label="Three questions per project">
              {close.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <ul className={s.does}>
              {close.does.map((d) => (
                <li key={d}>{d}</li>
              ))}
              <li>
                <Confirm />
              </li>
            </ul>
          </div>
          <div className={s.join}>
            <h2 id="h-join" className={s.h2}>
              {close.join.headline}
            </h2>
            <p className={s.when}>
              <span>{close.join.when}</span>
              <span>{close.join.where}</span>
            </p>
            <a className={s.cta} href="/design-lab/r2/signal/#join">
              {close.join.cta}
            </a>
          </div>
          <div className={s.sources}>
            <Sources world={WORLD} />
          </div>
        </section>
      </main>
      <WorldFooter world="signal" />
    </>
  );
}
