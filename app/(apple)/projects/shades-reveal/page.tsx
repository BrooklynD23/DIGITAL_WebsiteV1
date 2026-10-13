import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { approach, boxCaption, closing, deeper, disclaimer, hero, milestones, problem, renderCaption, vision } from '../../_content/shades-reveal';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from '../../_shades-art/Glasses';
import v1 from '../shades/apple.module.css';
import s from './reveal.module.css';

/** SHADES round 2, approach 1: product reveal. Review route; not in the nav or the sitemap. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

const conceptLine = hero.conceptLines.find((l) => l.isDefault)?.text ?? hero.conceptLines[0].text;
const boxLine = boxCaption.options.find((l) => l.isDefault)?.text ?? boxCaption.options[0].text;

/** Both object figures: the render caption, then the controller-box line. */
function RenderCaption() {
  return (
    <figcaption className={s.renderCaption}>
      <span>{renderCaption}</span>
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
              <Glasses mode="solid" view="three-quarter" ground="dark" tether title={renderCaption} />
            </div>
            <RenderCaption />
          </figure>
        </section>

        {/* 2 · Two beats: the problem, then how SHADES approaches it. */}
        <section className={`${s.what} ${s.col}`} data-tone="dark">
          {[problem, approach, vision].map((beat) => (
            <div key={beat.title} className={s.beat}>
              <h2 className={s.h2}>{beat.title}</h2>
              {beat.lines.map((line) => (
                <p key={line} className={s.lead}>{line}</p>
              ))}
            </div>
          ))}
        </section>


        {/* 3 · Go deeper: the anatomy pin and word demo moved to Concept X (2026-10-12). */}
        <section id="deeper" className={s.view} data-tone="dark" aria-labelledby="rv-deeper">
          <header className={s.head}>
            <h2 id="rv-deeper" className={s.h2}>{deeper.title}</h2>
            <p className={s.lead}>{deeper.line}</p>
            <p>
              <a className={chrome.link} href={deeper.link.href}>{deeper.link.label}</a>
            </p>
          </header>
        </section>

        {/* 4 · Close: the object again, then the milestones. */}
        <section id="roadmap" className={s.close} data-tone="dark" aria-labelledby="rv-road">
          <figure className={s.render}>
            <div className={s.closeObject}>
              <Glasses mode="solid" view="front" ground="dark" tether title={renderCaption} />
            </div>
            <RenderCaption />
          </figure>
          <div className={`${s.road} ${s.col}`}>
            <header className={s.roadHead}>
              <h2 id="rv-road" className={s.h2}>{milestones.title}</h2>
              <p className={s.lead}>{milestones.intro}</p>
            </header>
            <ol className={s.milestones}>
              {milestones.phases.map((ph) => (
                <li key={ph.n} className={s.milestone}>
                  <span className={s.phaseN}>{ph.n}</span>
                  <span>{ph.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <p className={`${s.note} ${s.col} ${s.disclaimer}`}>{disclaimer.text}</p>

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
