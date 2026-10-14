import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { Highlights, PlayOnce, PlayOnceStage } from '../../_system';
import { CineClip } from '../../_system/cine';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Reader } from '../../_shades/Reader';
import { Scanpath } from '../../_shades/Scanpath';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from './Glasses';
import { LightPin } from './LightPin';
import { Art } from './HighlightArt';
import s from './apple.module.css';

export const metadata: Metadata = { title: SHADES.meta.title, description: SHADES.meta.description };


export default function AppleShadesPage() {
  const { hero, problem, method, reader, tracks, scope, roadmap, join, spacing } = SHADES;
  return (
    <ShadesRoot className={`${s.root} ${fontReadingText}`}>
      {/* One sticky bar: the wordmark, the three builds, the reader setting, and the one filled CTA (→ #join). */}
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.replace(/\.$/, ''), href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
        utility={<SpacingToggle className={s.localSpacing} label={spacing.label} stateText={{ on: spacing.more, off: spacing.standard }} />}
      />

      <main id="r2-main">
        {/* Hero: the glasses as the object */}
        <section className={s.hero} data-tone="dark" aria-labelledby="ap-hero">
          <div className={s.heroCopy}>
            <h1 id="ap-hero" className={s.hero1}>{hero.headline}</h1>
            <p className={s.heroLead}>{hero.lead}</p>
            <a className={s.textLink} href="#reader">
              {hero.action}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M9.5 6.5L15 12l-5.5 5.5" />
              </svg>
            </a>
          </div>
          <Glasses className={s.heroArt} />
          <p className={s.heroFoot}>
            <strong className={s.boundaryShort}>{SHADES.boundaryShort}</strong> {SHADES.status.text}
          </p>
          <p className={s.heroFine}>{SHADES.expansion}</p>
        </section>

        {/* Problem: the eyes chase the line (plays once on entry) */}
        <section className={s.chapter} data-tone="dark" aria-labelledby="ap-problem">
          <header className={s.chapterHead}>
            <h2 id="ap-problem" className={s.h2}>{problem.headline}</h2>
            <p className={s.lead}>{problem.pinLead}</p>
          </header>
          <figure className={s.scanFig}>
            <PlayOnce className={s.scanWrap}>
              <Scanpath once k={0} />
            </PlayOnce>
            <figcaption className={s.figCaption}>{problem.figureNote}</figcaption>
          </figure>
        </section>

        {/* Method: one word lands on one point (shades-fixate plays once on entry) */}
        <section className={s.chapter} data-tone="dark" aria-labelledby="ap-method">
          <header className={s.chapterHead}>
            <h2 id="ap-method" className={s.h2}>{method.appleHeadline}</h2>
            <p className={s.lead}>{method.appleLead}</p>
          </header>
          <CineClip
            name="shades-fixate"
            world="apple"
            mode="once"
            className={s.fixClip}
            label={method.fixateLabel}
            fallback={
              <PlayOnceStage
                verb="fixate"
                size={420}
                density={2.2}
                seed={5}
                anchor
                duration={2800}
                armBelowFold
                label={method.fixateLabel}
                className={s.fixFallback}
              />
            }
          />
        </section>

        {/* The live reader */}
        <section id="reader" className={`${s.chapter} ${s.readerChapter}`} data-tone="dark" aria-labelledby="ap-reader">
          <header className={s.chapterHead}>
            <h2 id="ap-reader" className={s.h2}>{reader.headline}</h2>
            <p className={s.lead}>{reader.lead}</p>
          </header>
          <Reader variant="apple" headingId="ap-reader" spacing={false} />
        </section>

        {/* Signature: pinned light path, six played stages */}
        <LightPin />

        {/* Flip to light: breadth in the highlights strip */}
        <Highlights
          id="details"
          title={SHADES.highlights.headline}
          label={SHADES.highlights.headline}
          className={s.highlights}
          items={SHADES.highlights.items.map((h) => ({
            id: h.id,
            media: <Art id={h.id} />,
            title: h.title,
            caption: h.caption,
          }))}
        />

        {/* Tracks + the honest boundary */}
        <section className={s.light} aria-labelledby="ap-tracks">
          <header className={s.chapterHead}>
            <h2 id="ap-tracks" className={s.h2}>
              {tracks.headline}
            </h2>
          </header>
          <div className={s.trackCols}>
            {tracks.items.map((t) => (
              <div key={t.id} className={s.track}>
                <h3 className={s.h3}>{t.name}</h3>
                <p className={s.body}>{t.line}</p>
              </div>
            ))}
          </div>
          <div className={s.boundary}>
            <p className={s.boundaryIs}>{tracks.boundary.is}</p>
            <p className={s.boundaryNot}>{tracks.boundary.isNot}</p>
            <p className={s.boundaryNever}>
              <span className={s.neverLabel}>{SHADES.labels.never}</span>
              {tracks.boundary.never}
            </p>
            <p className={s.body}>{tracks.boundary.line}</p>
            <p className={s.body}>{join.mentor}</p>
          </div>
        </section>

        {/* MVP scope, compare-style */}
        <section className={`${s.light} ${s.grey}`} aria-labelledby="ap-scope">
          <header className={s.chapterHead}>
            <h2 id="ap-scope" className={s.h2}>
              {scope.headline}
            </h2>
          </header>
          <div className={s.compare}>
            <div>
              <h3 className={s.compareHead}>{scope.inLabel}</h3>
              <ul className={s.compareList}>
                {scope.in.map((x) => (
                  <li key={x} data-kind="in">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.compareHead}>{scope.outLabel}</h3>
              <ul className={s.compareList}>
                {scope.out.map((x) => (
                  <li key={x} data-kind="out">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className={s.light} aria-labelledby="ap-road">
          <header className={s.chapterHead}>
            <h2 id="ap-road" className={s.h2}>{roadmap.headline}</h2>
            <p className={s.lead}>{roadmap.lead}</p>
          </header>
          <ol className={s.timeline}>
            {roadmap.phases.map((ph) => (
              <li key={ph.n} className={s.tPhase} data-current={roadmap.current === ph.n ? 'true' : undefined}>
                <span className={s.tDot} aria-hidden="true" />
                <span className={s.tN}>{ph.n}</span>
                <span className={s.tName}>{ph.name}</span>
              </li>
            ))}
          </ol>
          <p className={s.noteCenter}>
            {roadmap.note}
          </p>
        </section>

        {/* Join: the shared ending; seats are links, the LocalNav pill stays the one filled CTA */}
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
