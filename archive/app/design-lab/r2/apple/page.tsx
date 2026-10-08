import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DotGlyph, GlyphNight, Highlights } from '../_system';
import { CineClip } from '../_system/cine';
import { JoinChapter, LocalNav, WorldFooter, WorldNav } from '../_chrome';
import { channels, channelsHeadline, highlights, highlightsHeadline, join, localTitle } from '../_content/home';
import { BuildChapter } from './_home/BuildChapter';
import { StagePin } from './_home/StagePin';
import s from './_home/home.module.css';

export const metadata: Metadata = {
  title: 'Home · Apple page · R2 lab',
  description: 'DIGITAL home, Apple-page world: one build method, four stages, three builds.',
};

/** Highlight media. Verbs keep their real-state meaning: form = scope drawn, seat = open role. */
const MEDIA: Record<string, ReactNode> = {
  stages: (
    <div className={s.clipCard} data-tone="dark">
      <CineClip
        name="home-stages"
        world="apple"
        fallback={<DotGlyph verb="wire" size={220} seed="hl-stages" label="Integrate: separate nodes wired into one graph" />}
      />
    </div>
  ),
  venture: <DotGlyph verb="form" size={260} seed="hl-venture" label="Plan: a scope being drawn" />,
  night: <GlyphNight size={200} state="idle" label="Build night: a ring of seats, one open" />,
  majors: <DotGlyph verb="seat" size={260} seed="hl-majors" label="An open seat: a part without an owner yet" />,
};

export default function AppleHome() {
  return (
    <div className={s.page}>
      <WorldNav world="apple" current="home" join={false} />
      <LocalNav
        title={localTitle}
        titleHref="/design-lab/r2/apple/"
        tone="dark"
        links={[
          { label: 'Stages', href: '#stages' },
          { label: 'Builds', href: '#builds' },
          { label: 'Highlights', href: '#highlights' },
        ]}
      />
      <main id="r2-main">
        <StagePin />

        <section id="builds" data-tone="dark" className={s.builds} aria-labelledby="builds-title">
          <div className={s.inner}>
            <h2 id="builds-title" className={`${s.h2} r2-reveal`}>{channelsHeadline}</h2>
          </div>
          {channels.map((c, i) => (
            <BuildChapter key={c.id} channel={c} flip={i % 2 === 1} />
          ))}
        </section>

        <Highlights title={highlightsHeadline} items={highlights.map((h) => ({ ...h, media: MEDIA[h.id] }))} />
        <JoinChapter world="apple" secondary={{ label: join.secondary, href: '#builds' }} />
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
