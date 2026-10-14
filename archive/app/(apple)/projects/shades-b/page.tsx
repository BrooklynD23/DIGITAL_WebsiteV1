import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { systemGroups } from '../../_content/shades-concept';
import { Reader } from '../../_shades/Reader';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { BookStory } from './BookStory';
import s from './book.module.css';

// Review mockup B ("the book leads"). Not in the nav or the sitemap.
export const metadata: Metadata = { title: SHADES.meta.title, description: SHADES.meta.description, robots: { index: false } };

export default function ShadesBookPage() {
  const { reader, tracks, scope, roadmap, join } = SHADES;
  const [engineering, research] = tracks.items;
  return (
    <div className={`${s.root} ${fontReadingText}`}>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.replace(/\.$/, ''), href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
      />

      <main id="r2-main">
        {/* The concept, on the book: hero + six played stages. */}
        <BookStory />

        {/* The one thing that runs today. */}
        <section id="reader" className={s.chapter} data-tone="dark" aria-labelledby="sb-reader">
          <header className={s.chapterHead}>
            <h2 id="sb-reader" className={s.h2c}>{reader.headline}</h2>
            <p className={s.lead}>{reader.lead}</p>
          </header>
          <Reader variant="apple" headingId="sb-reader" spacing={false} />
        </section>

        {/* The system in words: the five functions under the engineering track, the boundary under the research track. */}
        <section className={`${s.chapter} ${s.raised}`} data-tone="dark" aria-labelledby="sb-tracks">
          <header className={s.chapterHead}>
            <h2 id="sb-tracks" className={s.h2c}>{tracks.headline}</h2>
          </header>
          <div className={s.cols}>
            <div className={s.col}>
              <h3 className={s.h3}>{engineering.name}</h3>
              <p className={s.copy}>{engineering.line}</p>
              <dl className={s.groups}>
                {systemGroups.map((g) => (
                  <div key={g.id} data-off={g.onFrame ? undefined : ''}>
                    <dt>{g.label}</dt>
                    <dd>{g.role}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.col}>
              <h3 className={s.h3}>{research.name}</h3>
              <p className={s.copy}>{research.line}</p>
              <div className={s.boundary}>
                <strong>{tracks.boundary.is}</strong>
                <strong>{tracks.boundary.isNot}</strong>
                <p className={s.never}>
                  <span className={s.neverLabel}>{SHADES.labels.never}</span>
                  {tracks.boundary.never}
                </p>
                <p className={s.copy}>{tracks.boundary.line}</p>
                <p className={s.copy}>{join.mentor}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={s.chapter} data-tone="dark" aria-labelledby="sb-scope">
          <header className={s.chapterHead}>
            <h2 id="sb-scope" className={s.h2c}>{scope.headline}</h2>
          </header>
          <div className={s.compare}>
            <div>
              <h3 className={s.compareHead}>{scope.inLabel}</h3>
              <ul className={s.compareList}>
                {scope.in.map((x) => (
                  <li key={x} data-kind="in">{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.compareHead}>{scope.outLabel}</h3>
              <ul className={s.compareList}>
                {scope.out.map((x) => (
                  <li key={x} data-kind="out">{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="roadmap" className={`${s.chapter} ${s.raised}`} data-tone="dark" aria-labelledby="sb-road">
          <header className={s.chapterHead}>
            <h2 id="sb-road" className={s.h2c}>{roadmap.headline}</h2>
            <p className={s.lead}>{roadmap.lead}</p>
          </header>
          <ol className={s.timeline}>
            {roadmap.phases.map((ph) => (
              <li key={ph.n} className={s.tPhase}>
                <span className={s.tDot} aria-hidden="true" />
                <span className={s.tN}>{ph.n}</span>
                <span className={s.tName}>{ph.name}</span>
              </li>
            ))}
          </ol>
          <p className={s.note}>{roadmap.note}</p>
        </section>

        {/* The shared ending, as on the other project pages. */}
        <JoinChapter
          world="apple"
          visual={<SeatRing world="apple" />}
          headline={join.headline}
          lead={join.lead}
          {...MEETINGS.subteam}
          primary={{ label: join.discord.label, href: join.discord.href, external: true }}
        >
          <Seats world="apple" />
        </JoinChapter>
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
