import type { Metadata } from 'next';
import { JoinChapter, LocalNav, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { heldWord } from '../../_content/shades-concept';
import { boundary, hero, roadmap, scope, seats, tracks, whatItIs } from '../../_content/shades-research';
import { hero as revealHero } from '../../_content/shades-reveal';
import { Glasses } from '../../_shades-art/Glasses';
import { Seats } from '../../_shades/Seats';
import s from './research.module.css';

/**
 * SHADES round 2, approach 2: research platform. Review route, not in the nav or the sitemap.
 * A calm lab notice: type carries it; hairlines only inside data (dl rows, lists). No pin, no diagram, no call to action above the description.
 * Dark story (hero, what it is, two tracks) → one seam → light catalogue (boundary, scope, seats, roadmap, join).
 */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

const conceptLine = hero.conceptLines.find((l) => l.isDefault) ?? hero.conceptLines[0];

export default function ShadesResearchPage() {
  return (
    <div className={`${s.page} ${fontReadingText}`}>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      {/* One sticky bar. No filled CTA up here: the page describes SHADES before it asks anything. */}
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={null}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
      />

      <main id="r2-main">
        <div className={s.dark} data-tone="dark">
          {/* Hero: name, stage and aim, then the one visual: the solid glasses on their tether, captioned. */}
          <section className={s.hero} aria-labelledby="sr-h1">
            <h1 id="sr-h1" className={s.h1}>{hero.h1}</h1>
            {/* One sentence per line: stage, then aim. Split for layout only; the string is unchanged. */}
            <p className={s.stage}>
              {conceptLine.text.split(/(?<=\.) /).map((t) => (
                <span key={t}>{t} </span>
              ))}
            </p>
            <figure className={s.object}>
              <Glasses
                mode="solid"
                view="three-quarter"
                ground="dark"
                tether
                display={{ word: heldWord }}
                title={SHADES.hero.glassesLabel}
              />
              <figcaption className={s.caption}>
                <span className={s.renderCaption}>{revealHero.renderCaption}</span>
                <span className={s.fine}>{SHADES.expansion}</span>
              </figcaption>
            </figure>
          </section>

          {/* What it is: one sentence, then the two tracks. */}
          <section className={s.notice} aria-labelledby="sr-tracks">
            <p className={s.statement}>{whatItIs}</p>
            <div className={s.row}>
              <h2 id="sr-tracks" className={s.h2}>{tracks.title}</h2>
              <dl className={s.defs}>
                {tracks.items.map((t) => (
                  <div key={t.id} className={s.def}>
                    <dt className={s.term}>{t.name}</dt>
                    <dd className={s.detail}>{t.line}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        <div className={s.light}>
          {/* The boundary: the page's centrepiece, set large. */}
          <section className={s.boundary} aria-labelledby="sr-boundary">
            <h2 id="sr-boundary" className={s.h2}>{boundary.title}</h2>
            <dl className={s.bigDefs}>
              {boundary.rows.map((r) => (
                <div key={r.term} className={s.bigDef}>
                  <dt className={s.bigTerm}>{r.term}</dt>
                  <dd className={s.bigDetail}>{r.detail}</dd>
                </div>
              ))}
            </dl>
            <p className={s.note}>{boundary.line}</p>
          </section>

          {/* What the first build covers: two hairline lists. */}
          <section className={s.stack} aria-labelledby="sr-scope">
            <div className={s.head}>
              <h2 id="sr-scope" className={s.h2}>{scope.title}</h2>
              <p className={s.lead}>{scope.intro}</p>
            </div>
            <div className={s.lists}>
              <div>
                <h3 className={s.h3}>{scope.inLabel}</h3>
                <ul className={s.list}>
                  {scope.in.map((x) => (
                    <li key={x} data-kind="in">{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={s.h3}>{scope.outLabel}</h3>
                <ul className={s.list}>
                  {scope.out.map((x) => (
                    <li key={x} data-kind="out">{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Seats: the five roles, each a link to ask on Discord. */}
          <section id="seats" className={s.row} aria-labelledby="sr-seats">
            <div className={s.head}>
              <h2 id="sr-seats" className={s.h2}>{seats.title}</h2>
              <p className={s.lead}>{seats.intro}</p>
              <p className={s.mentor}>{SHADES.join.mentor}</p>
            </div>
            <div className={s.seats}>
              <Seats world="apple" />
            </div>
          </section>

          {/* Roadmap: seven phases as a numbered list, no current phase claimed. */}
          <section id="roadmap" className={s.stack} aria-labelledby="sr-road">
            <div className={s.head}>
              <h2 id="sr-road" className={s.h2}>{roadmap.title}</h2>
              <p className={s.lead}>{roadmap.intro}</p>
            </div>
            <ol className={s.phases}>
              {roadmap.phases.map((p) => (
                <li key={p.n}>
                  <span className={s.n}>{p.n}</span>
                  <span className={s.phaseName}>{p.name}</span>
                </li>
              ))}
            </ol>
            <p className={s.note}>{roadmap.note}</p>
          </section>
        </div>

        <JoinChapter
          world="apple"
          className={s.join}
          primary={{ label: seats.action.label, href: seats.action.href }}
          primaryStyle="pill"
          secondary={{ label: seats.discord.label, href: seats.discord.href, external: true }}
          visual={null}
        />
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
