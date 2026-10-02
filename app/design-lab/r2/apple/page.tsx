import type { Metadata } from 'next';
import { GlyphGate, GlyphHandoff, GlyphSeat, GlyphSwap } from '../_system';
import { LocalNav, WorldFooter, WorldNav } from '../_chrome';
import { channels, channelsHeadline, rules, strip, type RuleGlyph } from '../_content/home';
import { BuildChapter } from './_home/BuildChapter';
import { Highlights } from './_home/Highlights';
import { JoinChapter } from './_home/JoinChapter';
import { StagePin } from './_home/StagePin';
import s from './_home/home.module.css';

export const metadata: Metadata = {
  title: 'Home · Apple page · R2 lab',
  description: 'DIGITAL home, Apple-page world: one build method, four stages, three builds.',
};

const RULE_GLYPH: Record<RuleGlyph, typeof GlyphSeat> = { seat: GlyphSeat, handoff: GlyphHandoff, gate: GlyphGate, swap: GlyphSwap };

export default function AppleHome() {
  return (
    <div className={s.page}>
      <WorldNav world="apple" current="home" />
      <LocalNav
        title="DIGITAL"
        titleHref="/design-lab/r2/apple/"
        tone="dark"
        links={[
          { label: 'Stages', href: '#stages' },
          { label: 'Builds', href: '#builds' },
          { label: 'Rules', href: '#rules' },
        ]}
        cta={{ label: 'Join', href: '#join' }}
      />
      <main id="r2-main">
        <StagePin />

        <section id="builds" data-tone="dark" className={s.builds} aria-labelledby="builds-title">
          <div className={s.inner}>
            <h2 id="builds-title" className={`${s.h2} ${s.center} r2-reveal`}>{channelsHeadline}</h2>
          </div>
          {channels.map((c, i) => (
            <BuildChapter key={c.id} channel={c} flip={i % 2 === 1} />
          ))}
        </section>

        <section id="rules" className={s.rules} aria-labelledby="rules-title">
          <div className={s.inner}>
            <h2 id="rules-title" className={`${s.h2} r2-reveal`}>{strip.rulesHeadline}</h2>
            <ul className={s.stats}>
              {rules.map((r) => {
                const G = RULE_GLYPH[r.glyph];
                return (
                  <li key={r.id} className={`${s.stat} r2-reveal`} data-glyph-host>
                    <G size={48} className={s.statGlyph} />
                    <span className={s.statNum}>{r.count}</span>
                    <span className={s.statText}>{r.unit} <span className={s.statPer}>{r.per}</span></span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <Highlights />
        <JoinChapter />
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
