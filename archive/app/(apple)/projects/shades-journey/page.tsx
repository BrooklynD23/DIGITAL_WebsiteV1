import type { Metadata } from 'next';
import { Architects_Daughter, IBM_Plex_Mono } from 'next/font/google';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { boxCaption, closing, hero, view } from '../../_content/shades-reveal';
import { intro, join } from '../../_content/shades-journey';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from '../../_shades-art/Glasses';
import v1 from '../shades/apple.module.css';
import { HoldStill } from '../shades-control/HoldStill';
import hold from '../shades-control/control.module.css';
import { HoldStillStills } from '../shades-control/HoldStillStills';
import k from '../shades-drawings/drawings.module.css';
import s from '../shades-reveal/reveal.module.css';
import { JourneyPin } from './JourneyPin';

/** MOCKUP: SHADES as the team's design process, ideation to render. Third sibling of shades-process / shades-drawings. Review route; not in the nav or the sitemap. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

const draft = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-draft' });
/** Hand lettering for the sketch callouts, this mockup only. */
const hand = Architects_Daughter({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-hand' });

const conceptLine = hero.conceptLines.find((l) => l.isDefault)?.text ?? hero.conceptLines[0].text;
const boxLine = boxCaption.options.find((l) => l.isDefault)?.text ?? boxCaption.options[0].text;

export default function ShadesJourneyPage() {
  const { spacing } = SHADES;
  return (
    <ShadesRoot className={`${v1.root} ${fontReadingText} ${draft.variable} ${hand.variable} ${s.page}`}>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.text, href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
        utility={<SpacingToggle className={v1.localSpacing} label={spacing.label} stateText={{ on: spacing.more, off: spacing.standard }} />}
      />

      <main id="r2-main">
        {/* 1 · The object, as on the reveal page. */}
        <section className={s.hero} data-tone="dark" aria-labelledby="rv-hero">
          <header className={s.heroHead}>
            <h1 id="rv-hero" className={s.heroName}>{hero.h1}</h1>
            <p className={s.heroLine}>{conceptLine}</p>
          </header>
          <figure className={s.render}>
            <div className={s.heroObject}>
              <Glasses mode="solid" view="three-quarter" ground="dark" tether title={hero.renderCaption} />
            </div>
            <figcaption className={s.renderCaption}>
              <span>{hero.renderCaption}</span>
              <span>{boxLine}</span>
            </figcaption>
          </figure>
        </section>

        {/* 2 · How it got here: six sheets, then the teams who draw them. */}
        <header className={`${s.head} ${k.intro}`} data-tone="dark">
          <p className={k.draft}>{intro.draftTag.text}</p>
          <h2 className={s.h2}>{intro.title.text}</h2>
          <p className={s.lead}>{intro.lead.text}</p>
        </header>
        <JourneyPin />

        {/* 3 · Hold still, as on the reveal page. */}
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

        <JoinChapter
          world="apple"
          visual={<SeatRing world="apple" />}
          headline={join.headline.text}
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
