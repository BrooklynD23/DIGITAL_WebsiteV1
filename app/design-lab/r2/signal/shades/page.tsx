import type { Metadata } from 'next';
import { JoinChapter, WorldFooter, WorldNav } from '../../_chrome';
import { PlayOnceStage, StateMark } from '../../_system';
import { fontReadingText } from '../../_system/fonts';
import { SHADES } from '../../_content/shades';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Reader } from '../../_shades/Reader';
import { Seats } from '../../_shades/Seats';
import { Saccade } from './Saccade';
import { Band } from './Band';
import s from './signal.module.css';

export const metadata: Metadata = { title: SHADES.meta.title, description: SHADES.meta.description };

const C = () => <span className={s.confirm}>{SHADES.confirmTag}</span>;

export default function SignalShadesPage() {
  const { hero, reader, tracks, scope, roadmap, join, spacing } = SHADES;
  return (
    <ShadesRoot className={`${s.root} ${fontReadingText}`}>
      <WorldNav world="signal" current="shades" sticky />
      <main id="r2-main">
        {/* 1 · Hero: the fixation point sits on the graticule's centre crosshair */}
        <section className={`r2-graticule ${s.hero}`} aria-labelledby="sh-hero">
          {/* one fixate pass on load (≤1.5 s), then rest; reduced motion: rest pose */}
          <PlayOnceStage
            verb="fixate"
            size={560}
            density={2.4}
            seed={2}
            anchor
            duration={1400}
            threshold={0.2}
            label={SHADES.method.fixateLabel}
            className={s.heroStage}
          />
          <div className={s.heroTop}>
            <p className={s.readout}>
              <span className={s.channel}>{SHADES.channel}</span> {SHADES.name}
              <span className={s.status}>
                <StateMark state="pending" size={20} />
                {SHADES.status.text} <C />
              </span>
            </p>
            <SpacingToggle className={s.spacingChip} label={`${spacing.label}:`} stateText={{ on: spacing.more, off: spacing.standard }} />
          </div>
          <div className={s.heroCopy}>
            <h1 id="sh-hero" className={s.hero1}>{hero.headline}</h1>
            <p className={s.heroLead}>{hero.lead}</p>
            <p className={s.expansion}>
              {SHADES.expansion}. <strong className={s.boundaryShort}>{SHADES.boundaryShort}</strong>
            </p>
            <a className={s.action} href="#reader">
              {hero.action}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M12 5v14M6.5 13.5L12 19l5.5-5.5" />
              </svg>
            </a>
          </div>
        </section>

        {/* 2 · Signature: saccades collapse into one fixation point */}
        <Saccade />

        {/* 3 · The live RSVP reader */}
        <section id="reader" className={s.reader} aria-labelledby="sh-reader">
          <header className={s.readerHead}>
            <h2 id="sh-reader" className={s.h2}>{reader.headline}</h2>
            <p className={s.lead}>{reader.lead}</p>
          </header>
          <Reader variant="signal" headingId="sh-reader" />
        </section>

        {/* 4 · Light path teardown band */}
        <Band />

        {/* 5 · Two tracks and the boundary */}
        <section className={s.tracks} aria-labelledby="sh-tracks">
          <h2 id="sh-tracks" className={s.h2}>
            {tracks.headline} <C />
          </h2>
          <svg className={s.tracksFig} viewBox="0 0 1000 120" aria-hidden="true" focusable="false">
            <path className={s.trackLine} d="M0 30H640C720 30 760 60 820 60" />
            <path className={s.trackLine} d="M0 90H640C720 90 760 60 820 60" />
            <path className={s.trackJoin} d="M820 60H1000" />
            <circle className={s.trackPoint} cx="820" cy="60" r="5" />
          </svg>
          <div className={s.trackCols}>
            {tracks.items.map((t, i) => (
              <div key={t.id} className={s.track}>
                <h3 className={s.h3}>{t.name}</h3>
                <p className={s.body}>{t.line}</p>
              </div>
            ))}
          </div>
          <dl className={s.boundary}>
            <div>
              <dt>{SHADES.labels.is}</dt>
              <dd>{tracks.boundary.is}</dd>
            </div>
            <div>
              <dt>{SHADES.labels.isNot}</dt>
              <dd>{tracks.boundary.isNot}</dd>
            </div>
            <div data-never="">
              <dt>{SHADES.labels.never}</dt>
              <dd>{tracks.boundary.never}</dd>
            </div>
          </dl>
          <p className={s.body}>{tracks.boundary.line}</p>
          <p className={s.body}>{join.mentor}</p>
        </section>

        {/* 6 · MVP scope, in and out */}
        <section className={s.scope} aria-labelledby="sh-scope">
          <h2 id="sh-scope" className={s.h2}>
            {scope.headline} <C />
          </h2>
          <div className={s.scopeCols}>
            <div>
              <h3 className={s.h3}>{scope.inLabel}</h3>
              <ul className={s.inList}>
                {scope.in.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.h3}>{scope.outLabel}</h3>
              <ul className={s.outList}>
                {scope.out.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7 · Roadmap: seven phases, all pending until the club confirms one */}
        <section className={s.roadmap} aria-labelledby="sh-road">
          <header className={s.roadHead}>
            <h2 id="sh-road" className={s.h2}>{roadmap.headline}</h2>
            <p className={s.lead}>{roadmap.lead}</p>
          </header>
          <ol className={s.phases}>
            {roadmap.phases.map((ph) => (
              <li key={ph.n} className={s.phase} data-current={roadmap.current === ph.n ? 'true' : undefined}>
                <span className={s.phaseTick} aria-hidden="true" />
                <span className={s.phaseN}>{ph.n}</span>
                <span className={s.phaseName}>{ph.name}</span>
              </li>
            ))}
          </ol>
          <p className={s.roadNote}>
            <StateMark state="pending" size={20} />
            {roadmap.note} <C />
          </p>
        </section>

        {/* 8 · Join: the shared ending, with SHADES' open seats as links */}
        <JoinChapter
          world="signal"
          headline={join.headline}
          lead={join.lead}
          primary={join.action}
          secondary={{ label: join.discord.label, href: join.discord.href, external: true }}
        >
          <Seats world="signal" />
        </JoinChapter>
      </main>
      <WorldFooter world="signal" />
    </ShadesRoot>
  );
}
