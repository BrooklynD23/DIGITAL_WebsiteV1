import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { PlayOnce } from '../../_system';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { control, glasses, hero, pace } from '../../_content/shades-control';
import { Glasses } from '../../_shades-art/Glasses';
import { Reader } from '../../_shades/Reader';
import { SeatRing } from '../../_shades/SeatRing';
import { Seats } from '../../_shades/Seats';
import { HoldStill } from './HoldStill';
import { HoldStillStills } from './HoldStillStills';
import s from './control.module.css';

/** SHADES round 2, approach 3: one signature control ("Hold still"). Review route: not linked, not indexed. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

const conceptLine = hero.conceptLines.find((l) => l.isDefault) ?? hero.conceptLines[0];

export default function ShadesControlPage() {
  const { join } = SHADES;
  return (
    <div className={`${s.root} ${fontReadingText}`}>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.replace(/\.$/, ''), href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
      />

      <main id="r2-main">
        {/* Hero + beat 1: the one control */}
        <section className={s.hero} data-tone="dark" aria-labelledby="hc-h1">
          <header className={s.heroHead}>
            <h1 id="hc-h1" className={s.h1}>{hero.h1}</h1>
            <p className={s.concept}>{conceptLine.text}</p>
            <p className={s.boundary}>{hero.boundary}</p>
          </header>
          <div className={s.live}>
            <HoldStill />
          </div>
          <div className={s.noscript}>
            <HoldStillStills />
            <p className={s.note}>{control.simulationNote}</p>
          </div>
        </section>

        {/* Beat 2: set the pace (the shared reader; nothing plays until Read) */}
        <section id="pace" className={s.chapter} data-tone="dark" aria-labelledby="hc-pace">
          <header className={s.chapterHead}>
            <h2 id="hc-pace" className={s.h2}>{pace.title}</h2>
            <p className={s.lead}>{pace.caption}</p>
          </header>
          <Reader variant="apple" headingId="hc-pace" spacing={false} />
          <p className={s.note}>{pace.simulationNote}</p>
        </section>

        {/* Beat 3: the glasses arrive, the held word in the right lens (plays once on entry) */}
        <section className={`${s.chapter} ${s.arrival}`} data-tone="dark" aria-labelledby="hc-glasses">
          <header className={s.chapterHead}>
            <h2 id="hc-glasses" className={s.h2}>{glasses.title}</h2>
          </header>
          <figure className={s.glassesFig}>
            <PlayOnce className={s.arrive} threshold={0.35}>
              <Glasses
                mode="solid"
                view="three-quarter"
                ground="dark"
                display={{ word: control.heldWord }}
                tether
                className={s.glasses}
                title={`${glasses.figureLabel}. ${glasses.caption}`}
              />
            </PlayOnce>
            <figcaption className={s.figCaption}>{glasses.caption}</figcaption>
          </figure>
        </section>

        {/* Beat 4: the shared ending */}
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
