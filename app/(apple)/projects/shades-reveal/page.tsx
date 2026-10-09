import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { boundaryTable, boxCaption, closing, faq, hero, view, whatItIs } from '../../_content/shades-reveal';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from '../../_shades-art/Glasses';
import v1 from '../shades/apple.module.css';
import { HoldStill } from '../shades-control/HoldStill';
import hold from '../shades-control/control.module.css';
import { AnatomyPin } from './AnatomyPin';
import { HoldStillStills } from '../shades-control/HoldStillStills';
import s from './reveal.module.css';

/** SHADES round 2, approach 1: product reveal. Review route; not in the nav or the sitemap. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

const conceptLine = hero.conceptLines.find((l) => l.isDefault)?.text ?? hero.conceptLines[0].text;
const boxLine = boxCaption.options.find((l) => l.isDefault)?.text ?? boxCaption.options[0].text;
/** "Is SHADES a medical device?" carries the Is / Is not / Never rows under its sentence. */
const BOUNDARY_FAQ = 2;

/** Both object figures: the render caption, then the controller-box line. */
function RenderCaption() {
  return (
    <figcaption className={s.renderCaption}>
      <span>{hero.renderCaption}</span>
      <span>{boxLine}</span>
    </figcaption>
  );
}

export default function ShadesRevealPage() {
  const { join, spacing } = SHADES;
  return (
    <ShadesRoot className={`${v1.root} ${fontReadingText} ${s.page}`}>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.replace(/\.$/, ''), href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
        utility={<SpacingToggle className={v1.localSpacing} label={spacing.label} stateText={{ on: spacing.more, off: spacing.standard }} />}
      />

      <main id="r2-main">
        {/* 1 · The object. Lens empty: no word in the hero. */}
        <section className={s.hero} data-tone="dark" aria-labelledby="rv-hero">
          <header className={s.heroHead}>
            <h1 id="rv-hero" className={s.heroName}>{hero.h1}</h1>
            <p className={s.heroLine}>{conceptLine}</p>
          </header>
          <figure className={s.render}>
            <div className={s.heroObject}>
              <Glasses mode="solid" view="three-quarter" ground="dark" tether title={hero.renderCaption} />
            </div>
            <RenderCaption />
          </figure>
        </section>

        {/* 2 · What SHADES is: three declaratives. */}
        <section className={`${s.what} ${s.col}`} data-tone="dark">
          {whatItIs.map((line) => (
            <p key={line} className={s.whatLine}>{line}</p>
          ))}
        </section>

        {/* 3 · Anatomy: the same object separates. One pin, four stages. */}
        <AnatomyPin />

        {/* 4 · The view: the "Hold still" slider. Not pinned; the visitor drives it. */}
        <section id="view" className={s.view} data-tone="dark" aria-labelledby="rv-view">
          <header className={s.head}>
            <h2 id="rv-view" className={s.h2}>{view.title}</h2>
            <p className={s.lead}>{view.caption}</p>
          </header>
          <div className={`${hold.live} ${s.holdWrap}`}>
            <HoldStill pageAtHold={0.18} />
          </div>
          <div className={`${hold.noscript} ${s.holdWrap}`}>
            <HoldStillStills />
            <p className={hold.note}>{view.simulationNote}</p>
          </div>
        </section>

        {/* 5 · Close: the object again, the roadmap, the honest answers. */}
        <section id="roadmap" className={s.close} data-tone="dark" aria-labelledby="rv-road">
          <figure className={s.render}>
            <div className={s.closeObject}>
              <Glasses mode="solid" view="front" ground="dark" tether title={hero.renderCaption} />
            </div>
            <RenderCaption />
          </figure>
          <div className={`${s.road} ${s.col}`}>
            <header className={s.roadHead}>
              <h2 id="rv-road" className={s.h2}>{closing.title}</h2>
              <p className={s.lead}>{closing.intro}</p>
            </header>
            <ol className={s.phases}>
              {closing.phases.map((ph) => (
                <li key={ph.n}>
                  <span className={s.phaseN}>{ph.n}</span>
                  <span>{ph.name}</span>
                </li>
              ))}
            </ol>
            <p className={s.note}>{closing.note}</p>
          </div>
        </section>

        <section className={`${s.faq} ${s.col}`} data-tone="dark" aria-labelledby="rv-faq">
          <h2 id="rv-faq" className={s.h2}>{faq.heading}</h2>
          <div className={s.faqList}>
            {faq.items.map((it, i) => (
              <div key={it.q} className={s.faqRow}>
                <h3 className={s.faqQ}>{it.q}</h3>
                <div className={s.faqA}>
                  <p>{it.a}</p>
                  {i === BOUNDARY_FAQ ? (
                    <dl className={s.bounds}>
                      {boundaryTable.rows.map((r) => (
                        <div key={r.term}>
                          <dt>{r.term}</dt>
                          <dd>{r.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <JoinChapter
          world="apple"
          visual={<SeatRing world="apple" />}
          headline={closing.join.headline}
          lead={closing.join.lead}
          {...MEETINGS.subteam}
          primary={{ label: closing.join.discord.label, href: closing.join.discord.href, external: true }}
        >
          <Seats world="apple" />
          <p className={s.note}>{SHADES.join.mentor}</p>
          <p className={s.note}>{SHADES.join.affiliation}</p>
        </JoinChapter>
      </main>
      <WorldFooter world="apple" />
    </ShadesRoot>
  );
}
