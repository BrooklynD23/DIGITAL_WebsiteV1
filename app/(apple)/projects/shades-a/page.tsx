import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Reader } from '../../_shades/Reader';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
/* Catalogue styles (tracks, boundary, first-build scope) are the V0.1 page's, imported unchanged for this review route. */
import v1 from '../shades/apple.module.css';
import { ConceptStages } from './ConceptStages';
import s from './concept.module.css';

/** Review route for SHADES concept mockup A ("the object leads"). Not linked from the nav or the sitemap. */
export const metadata: Metadata = {
  title: SHADES.meta.title,
  description: SHADES.meta.description,
  robots: { index: false },
};

export default function ShadesConceptAPage() {
  const { reader, tracks, scope, join, spacing } = SHADES;
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
        {/* The concept: hero + six stages, one artwork, pinned and played. */}
        <ConceptStages />

        {/* Still dark: the method, live. */}
        <section id="reader" className={`${v1.chapter} ${v1.readerChapter}`} data-tone="dark" aria-labelledby="sa-reader">
          <header className={v1.chapterHead}>
            <h2 id="sa-reader" className={v1.h2}>{reader.headline}</h2>
            <p className={v1.lead}>{reader.lead}</p>
          </header>
          <Reader variant="apple" headingId="sa-reader" spacing={false} />
        </section>

        {/* The one seam. Light catalogue: the two tracks and the boundary, then what the first build covers. */}
        <section className={v1.light} aria-labelledby="sa-tracks">
          <header className={v1.chapterHead}>
            <h2 id="sa-tracks" className={v1.h2}>{tracks.headline}</h2>
          </header>
          <div className={v1.trackCols}>
            {tracks.items.map((t) => (
              <div key={t.id} className={v1.track}>
                <h3 className={v1.h3}>{t.name}</h3>
                <p className={v1.body}>{t.line}</p>
              </div>
            ))}
          </div>
          <div className={v1.boundary}>
            <p className={v1.boundaryIs}>{tracks.boundary.is}</p>
            <p className={v1.boundaryNot}>{tracks.boundary.isNot}</p>
            <p className={v1.boundaryNever}>
              <span className={v1.neverLabel}>{SHADES.labels.never}</span>
              {tracks.boundary.never}
            </p>
            <p className={v1.body}>{tracks.boundary.line}</p>
            <p className={v1.body}>{join.mentor}</p>
          </div>
        </section>

        <section className={`${v1.light} ${v1.grey}`} aria-labelledby="sa-scope">
          <header className={v1.chapterHead}>
            <h2 id="sa-scope" className={v1.h2}>{scope.headline}</h2>
          </header>
          <div className={v1.compare}>
            <div>
              <h3 className={v1.compareHead}>{scope.inLabel}</h3>
              <ul className={v1.compareList}>
                {scope.in.map((x) => (
                  <li key={x} data-kind="in">{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={v1.compareHead}>{scope.outLabel}</h3>
              <ul className={v1.compareList}>
                {scope.out.map((x) => (
                  <li key={x} data-kind="out">{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
    </ShadesRoot>
  );
}
