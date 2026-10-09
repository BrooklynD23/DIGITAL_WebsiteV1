import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { bookWords, heldWord } from '../../_content/shades-concept';
import { closing, faq, hero, view, whatItIs } from '../../_content/shades-reveal';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from '../../_shades-art/Glasses';
import v1 from '../shades/apple.module.css';
import { AnatomyPin } from './AnatomyPin';
import s from './reveal.module.css';

/** SHADES round 2, approach 1: product reveal. Review route; not in the nav or the sitemap. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

/** Paragraph break in the typeset page, after "Each word hands you to the next." The held word sits in the gap. */
const PARA = 23;

const conceptLine = hero.conceptLines.find((l) => l.isDefault)?.text ?? hero.conceptLines[0].text;

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
            <figcaption className={s.renderCaption}>{hero.renderCaption}</figcaption>
          </figure>
        </section>

        {/* 2 · What SHADES is: three declaratives. */}
        <section className={s.what} data-tone="dark">
          {whatItIs.map((line) => (
            <p key={line} className={s.whatLine}>{line}</p>
          ))}
        </section>

        {/* 3 · Anatomy: the same object separates. One pin, four stages. */}
        <AnatomyPin />

        {/* 4 · The view: a page typeset live behind one held word. */}
        <section className={s.view} data-tone="dark" aria-labelledby="rv-view">
          <header className={s.head}>
            <h2 id="rv-view" className={s.h2}>{view.title}</h2>
            <p className={s.lead}>{view.caption}</p>
          </header>
          <figure className={s.viewFig}>
            <div className={s.lens}>
              <div className={s.paper} aria-hidden="true">
                <p className={s.pageText}>{bookWords.slice(0, PARA).join(' ')}</p>
                <div className={s.hud}>
                  <span className={s.point} />
                  <span className={s.heldWord}>{heldWord}</span>
                </div>
                <p className={s.pageText}>{bookWords.slice(PARA).join(' ')}</p>
              </div>
            </div>
            <figcaption className={s.renderCaption}>{view.figureLabel}</figcaption>
          </figure>
        </section>

        {/* 5 · Close: the object again, the roadmap, the honest answers. */}
        <section id="roadmap" className={s.close} data-tone="dark" aria-labelledby="rv-road">
          <figure className={s.render}>
            <div className={s.closeObject}>
              <Glasses mode="solid" view="front" ground="dark" tether title={hero.renderCaption} />
            </div>
            <figcaption className={s.renderCaption}>{hero.renderCaption}</figcaption>
          </figure>
          <header className={s.head}>
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
        </section>

        <section className={s.faq} data-tone="dark" aria-labelledby="rv-faq">
          <h2 id="rv-faq" className={s.h2}>{faq.heading}</h2>
          <div className={s.faqList}>
            {faq.items.map((it) => (
              <div key={it.q} className={s.faqRow}>
                <h3 className={s.faqQ}>{it.q}</h3>
                <p className={s.faqA}>{it.a}</p>
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
        </JoinChapter>
      </main>
      <WorldFooter world="apple" />
    </ShadesRoot>
  );
}
