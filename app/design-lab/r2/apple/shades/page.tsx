import type { Metadata } from 'next';
import { WorldNav } from '../../_chrome/WorldNav';
import { WorldFooter } from '../../_chrome/WorldFooter';
import { GlyphSeat } from '../../_system';
import { atkinsonNext } from '../../_system/fonts';
import { SHADES } from '../../_content/shades';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Reader } from '../../_shades/Reader';
import { Scanpath } from '../../_shades/Scanpath';
import { PlayOnce } from '../../_shades/PlayOnce';
import { Glasses } from './Glasses';
import { FixateClip } from './FixateClip';
import { LightPin } from './LightPin';
import { Highlights } from './Highlights';
import s from './apple.module.css';

export const metadata: Metadata = { title: SHADES.meta.title, description: SHADES.meta.description };

const C = () => <span className={s.confirm}>{SHADES.confirmTag}</span>;

export default function AppleShadesPage() {
  const { hero, problem, method, reader, tracks, scope, roadmap, join, spacing } = SHADES;
  return (
    <ShadesRoot className={`${s.root} ${atkinsonNext.variable}`}>
      <WorldNav world="apple" current="shades" />

      {/* Local product nav: one filled CTA; the reader setting lives here so it is always in reach */}
      <nav className={s.local} aria-label="SHADES" data-tone="dark" data-chrome="local">
        <div className={s.localInner}>
          <a className={s.localName} href="#r2-main">
            {SHADES.name}
          </a>
          <ul className={s.localLinks}>
            {SHADES.nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <SpacingToggle className={s.localSpacing} label={spacing.label} />
          <a className={s.localCta} href="#join">
            {SHADES.nav.cta}
          </a>
        </div>
      </nav>

      <main id="r2-main">
        {/* Hero: the glasses as the object */}
        <section className={s.hero} data-tone="dark" aria-labelledby="ap-hero">
          <div className={s.heroCopy}>
            <p className={s.productName}>{SHADES.name}</p>
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
            {SHADES.expansion}. {SHADES.formerly}. <C />
          </p>
        </section>

        {/* Problem: the eyes chase the line (plays once on entry) */}
        <section className={s.chapter} data-tone="dark" aria-labelledby="ap-problem">
          <header className={s.chapterHead}>
            <h2 id="ap-problem" className={s.h2}>{problem.headline}</h2>
            <p className={s.lead}>{problem.pinLead}</p>
          </header>
          <PlayOnce className={s.scanWrap}>
            <Scanpath once k={0} />
          </PlayOnce>
        </section>

        {/* Method: one word lands on one point (shades-fixate plays once on entry) */}
        <section className={s.chapter} data-tone="dark" aria-labelledby="ap-method">
          <header className={s.chapterHead}>
            <h2 id="ap-method" className={s.h2}>{method.appleHeadline}</h2>
            <p className={s.lead}>
              <abbr title={method.abbrTitle}>{method.abbr}</abbr>: {method.appleLead}
            </p>
          </header>
          <FixateClip className={s.fixClip} />
        </section>

        {/* The live reader */}
        <section id="reader" className={`${s.chapter} ${s.readerChapter}`} data-tone="dark" aria-labelledby="ap-reader">
          <header className={s.chapterHead}>
            <h2 id="ap-reader" className={s.h2}>{reader.headline}</h2>
            <p className={s.lead}>{reader.lead}</p>
          </header>
          <Reader variant="apple" headingId="ap-reader" />
        </section>

        {/* Signature: pinned light path, one scrubbed asset */}
        <LightPin />

        {/* Flip to light: breadth in the highlights strip */}
        <Highlights />

        {/* Tracks + the honest boundary */}
        <section className={s.light} aria-labelledby="ap-tracks">
          <header className={s.chapterHead}>
            <h2 id="ap-tracks" className={s.h2}>
              {tracks.headline} <C />
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
            <p className={s.body}>{tracks.boundary.line}</p>
          </div>
        </section>

        {/* MVP scope, compare-style */}
        <section className={`${s.light} ${s.grey}`} aria-labelledby="ap-scope">
          <header className={s.chapterHead}>
            <h2 id="ap-scope" className={s.h2}>
              {scope.headline} <C />
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
            {roadmap.note} <C />
          </p>
        </section>

        {/* Join */}
        <section id="join" className={`${s.light} ${s.grey} ${s.join}`} aria-labelledby="ap-join">
          <header className={s.chapterHead}>
            <h2 id="ap-join" className={s.h2}>{join.headline}</h2>
            <p className={s.lead}>{join.lead}</p>
          </header>
          <ul className={s.roles}>
            {join.roles.map((r) => (
              <li key={r.id} className={s.role} data-glyph-host="">
                <GlyphSeat size={64} className={s.seat} />
                <h3 className={s.roleName}>{r.name}</h3>
                <p className={s.roleLine}>{r.line}</p>
              </li>
            ))}
          </ul>
          <div className={s.joinMeta}>
            <p className={s.night}>
              {join.night.label}: {join.night.when}, {join.night.where}
            </p>
            <p className={s.body}>{join.mentor}</p>
            <a className={s.textLink} href={join.discord.href} rel="noopener noreferrer" target="_blank">
              {join.discord.label}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M8 16L16 8M9.5 8H16v6.5" />
              </svg>
            </a>
          </div>
        </section>
      </main>
      <WorldFooter world="apple" />
    </ShadesRoot>
  );
}
