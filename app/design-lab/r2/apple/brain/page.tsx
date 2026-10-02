import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { LocalNav, WorldFooter, WorldNav } from '../../_chrome';
import { GLYPHS } from '../../_system';
import { CineClip } from '../../_system/cine';
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
  title: 'BRAIN · DIGITAL lab r2',
  description: 'A model predicts. A system gets work done. Eight mechanisms of agentic systems, one per chapter.',
};

const WORLD: World = 'apple';
const DEMOS: Partial<Record<ChapterId, ComponentType<{ world: World }>>> = {
  loop: LoopDemo,
  tools: ToolsDemo,
  mcp: McpDemo,
  engineering: EngineeringDemo,
  harness: HarnessDemo,
  subagents: SubagentsDemo,
  evals: EvalsDemo,
};

const glyphOf = (name: string) => GLYPHS.find((g) => g.name === name)?.Component;

export default function BrainApplePage() {
  return (
    <>
      <WorldNav world="apple" current="brain" />
      <LocalNav
        title={brain.name}
        titleHref="/design-lab/r2/apple/brain/"
        tone="dark"
        links={[
          { label: 'Concepts', href: '#concepts' },
          { label: 'Chapters', href: '#ch-loop' },
          { label: 'About BRAIN', href: '#brain' },
        ]}
        cta={{ label: close.join.cta, href: '/design-lab/r2/apple/#join' }}
      />
      <main id="r2-main" className={s.page}>
        <section className={s.hero} data-tone="dark" aria-labelledby="brain-hero">
          <h1 id="brain-hero" className={s.h1}>
            <span className={s.line}>A model predicts.</span>
            <span className={s.line}>A system gets work done.</span>
          </h1>
          <div className={s.heroStage}>
            <CineClip name="brain-orb" mode="once" fallback={<HeroOrb world={WORLD} tuck />} />
          </div>
          <p className={s.lead}>
            {hero.lead} <Confirm />
          </p>
        </section>

        <section id="concepts" className={s.highlights} data-tone="dark" aria-labelledby="h-concepts">
          <h2 id="h-concepts" className={s.h2}>
            Eight ideas. One system.
          </h2>
          <ul className={s.strip}>
            {chapters.map((ch) => {
              const G = glyphOf(ch.glyph);
              return (
                <li key={ch.id} className={s.card} data-glyph-host="">
                  <a href={`#ch-${ch.id}`} className={s.cardLink}>
                    {G ? <G size={64} state="idle" /> : null}
                    <span className={s.cardName}>{ch.name}</span>
                    <span className={s.cardLine}>{ch.card}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className={s.key}>{hero.key}</p>
        </section>

        {chapters.map((ch) => {
          const head = (
            <>
              <h2 id={`h-${ch.id}`} className={s.h2}>
                {ch.headline}
              </h2>
              <p className={s.caption}>{ch.caption}</p>
            </>
          );
          if (ch.id === 'context') {
            return (
              <ContextChapter
                key={ch.id}
                world={WORLD}
                id={`ch-${ch.id}`}
                labelledBy={`h-${ch.id}`}
                tone="dark"
                className={`${s.chapter} ${s.pinned}`}
                stickyClassName={s.sticky}
                textClassName={s.head}
                stageClassName={s.stage}
              >
                {head}
                <Fidelity ch={ch} world={WORLD} />
              </ContextChapter>
            );
          }
          const Demo = DEMOS[ch.id];
          return (
            <section key={ch.id} id={`ch-${ch.id}`} className={s.chapter} data-tone="dark" aria-labelledby={`h-${ch.id}`}>
              <div className={s.head}>{head}</div>
              <div className={s.stage}>{Demo ? <Demo world={WORLD} /> : null}</div>
              <div className={s.foot}>
                <Fidelity ch={ch} world={WORLD} />
                {ch.id === 'harness' ? <NotesCoda world={WORLD} /> : null}
              </div>
            </section>
          );
        })}

        <section id="brain" className={s.about} aria-labelledby="h-brain">
          <PlanMark size={140} label="The orb returns to its plan outline" />
          <h2 id="h-brain" className={s.h1}>
            {brain.name}
          </h2>
          <p className={s.expansion}>{brain.expansion}</p>
          <p className={s.caption}>
            {close.thesis} <Confirm />
          </p>
          <MethodLoop world={WORLD} />
          <p className={s.small}>{close.methodLine}</p>
        </section>

        <section className={s.facts} aria-label="What BRAIN asks and does">
          <ul className={s.qList} aria-label="Three questions per project">
            {close.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <ul className={s.does}>
            {close.does.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className={s.small}>
            {`Status: ${brain.status}.`} <Confirm />
          </p>
        </section>

        <section className={s.join} aria-labelledby="h-join">
          <h2 id="h-join" className={s.h2}>
            {close.join.headline}
          </h2>
          <p className={s.caption}>{`${close.join.when} · ${close.join.where}`}</p>
          <a className={s.cta} href="/design-lab/r2/apple/#join">
            {close.join.cta}
          </a>
          <Sources world={WORLD} />
        </section>
      </main>
      <WorldFooter world="apple" />
    </>
  );
}
