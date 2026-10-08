import type { Metadata } from 'next';
import { CLUB, JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { localTitle } from '../../_content/home';
import { archive, boardFacts, join, mainboard, ruleSentences, rulesHeadline, sidekick, subsystems } from '../../_content/sidekick';
import { BoardStory } from './BoardStory';
import s from './sidekick.module.css';

export const metadata: Metadata = {
  title: 'SIDEKICK · DIGITAL',
  description: mainboard.metaDescription,
};

export default function AppleSidekickPage() {
  return (
    <div className={s.page}>
      {/* One sticky bar (same as the home prototype): the wordmark goes home, the three builds sit beside it. */}
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'sidekick')}
        tone="dark"
        cta={{ label: sidekick.joinLink, href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
      />

      <main id="r2-main">
        {/* The hero is the board story: the real main board, pinned, nine played poses. */}
        <BoardStory />

        {/* Still black: the numbers finish the board story. The catalogue (subsystems onward) is light. */}
        <section className={s.facts} data-tone="dark" aria-labelledby="facts-title">
          <div className={s.factsInner}>
            <h2 id="facts-title" className={s.h1}>{boardFacts.headline}</h2>
            <dl className={s.factGrid}>
              {boardFacts.items.map((f) => (
                <div key={f.term}>
                  <dt>{f.term}</dt>
                  <dd className={s.factValue}>{f.value}</dd>
                  <dd className={s.factNote}>{f.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={s.subs} id="subsystems" aria-labelledby="subs-title">
          <div className={s.chapterHead}>
            <h2 id="subs-title" className={s.h1}>{subsystems.headline}</h2>
            <p className={s.chapterLead}>{subsystems.lead}</p>
          </div>
          <ul className={s.subList}>
            {subsystems.items.map((x) => (
              <li key={x.id}>
                <span className={s.subName}>{x.name}</span>
                {x.part ? <span className={s.subPart}>{x.part}</span> : null}
                <span className={s.subLine}>{x.line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.status} id="status" aria-labelledby="status-title">
          <div className={s.chapterHead}>
            <h2 id="status-title" className={s.h1}>{archive.headline}</h2>
            <p className={s.chapterLead}>{archive.lead}</p>
          </div>
          <div className={s.statusFoot}>
            <div>
              <h3 className={s.h3}>{archive.pathTitle}</h3>
              <ol className={s.next}>
                {archive.path.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className={s.h3}>{archive.targetsTitle}</h3>
              <ul className={s.targets}>
                {archive.targets.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className={s.targetsNote}>{archive.targetsNote}</p>
            </div>
          </div>
        </section>

        <section className={s.rulesSec} aria-labelledby="rules-title">
          <h2 id="rules-title" className={s.h1}>{rulesHeadline}</h2>
          <ul className={s.rules}>
            {ruleSentences.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <JoinChapter
          world="apple"
          headline={join.headline}
          lead={join.lead}
          {...MEETINGS.subteam}
          primary={{ label: 'Take a subsystem on Discord', href: CLUB.discord, external: true }}
        />
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
