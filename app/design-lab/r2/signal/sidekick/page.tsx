import type { Metadata } from 'next';
import { WorldFooter } from '../../_chrome/WorldFooter';
import { WorldNav } from '../../_chrome/WorldNav';
import { GlyphSeat, StateMark } from '../../_system';
import { BoardSvg, getBoard } from '../../_system/boards';
import { join, modules, rules, sidekick, status } from '../../_content/sidekick';
import { SensorModule } from '../../_sidekick/IsoModules';
import { LINE_FORM } from '../../_sidekick/lineForm';
import { SignalTeardown } from './SignalTeardown';
import s from './sidekick.module.css';

export const metadata: Metadata = {
  title: 'SIDEKICK · Signal Capture · DIGITAL lab',
  description: 'SIDEKICK, formerly the Modular Smartphone: the club’s real KiCad boards, torn down by scroll.',
};

// Day offsets from the first commit (2025-07-19), all from the KB [confirm].
const SPAN = 131; // → 2025-11-27, last fingerprint file
const PAUSE = 38; // 2025-08-26
const BRANCH = 66; // 2025-09-23, first fingerprint file
const x = (d: number): number => 8 + (d / SPAN) * 584;

function Timebase() {
  return (
    <svg viewBox="0 0 640 112" className={s.timebase} role="img" aria-label="Timeline: first commit 19 July 2025, main design paused 26 August 2025, fingerprint branch active from September to November 2025">
      <title>SIDEKICK design timeline</title>
      <g className={s.tbGrid}>
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${8 + i * 73} 22V86`} />
        ))}
      </g>
      <path className={s.tbMain} d={`M${x(0)} 46H${x(PAUSE)}`} />
      <path className={s.tbStrike} d={`M${x(PAUSE) - 7} 56L${x(PAUSE) + 7} 36`} />
      <path className={s.tbBranch} d={`M${x(PAUSE)} 46V70H${x(BRANCH)}`} />
      <path className={s.tbMain} d={`M${x(BRANCH)} 70H${x(SPAN)}`} />
      <path className={s.tbStrike} d={`M${x(SPAN) - 7} 80L${x(SPAN) + 7} 60`} />
      <g className={s.tbText}>
        <text x={x(0)} y={14}>2025-07-19</text>
        <text x={x(PAUSE)} y={14} textAnchor="middle">2025-08-26</text>
        <text x={x(SPAN)} y={14} textAnchor="end">2025-11</text>
        <text x={x(0)} y={104}>main</text>
        <text x={x(BRANCH)} y={104}>fingerprint branch</text>
      </g>
    </svg>
  );
}

export default function SignalSidekickPage() {
  return (
    <div className={`${s.page} r2-graticule`}>
      <WorldNav world="signal" current="sidekick" />
      <main id="r2-main">
        {/* Hero: channel strip, headline, the carrier as the probed object. */}
        <section className={s.hero} aria-labelledby="sk-title">
          <dl className={s.strip}>
            <div>
              <dt>{sidekick.channel}</dt>
              <dd>{sidekick.name}</dd>
            </div>
            <div>
              <dt>was</dt>
              <dd>DG-001</dd>
            </div>
            <div>
              <dt>state</dt>
              <dd className={s.stripState}>
                <StateMark state="paused" size={16} />
                paused <span className={s.confirm}>[confirm]</span>
              </dd>
            </div>
            <div>
              <dt>timebase</dt>
              <dd>scroll</dd>
            </div>
          </dl>
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <h1 id="sk-title" className={s.hero1}>{sidekick.headline}</h1>
              <p className={s.lead}>{sidekick.lead}</p>
              <a className={s.textLink} href="#join">
                {sidekick.joinLink}
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" /></svg>
              </a>
            </div>
            <figure className={s.heroFig}>
              <div className={s.heroBoard}>
                <BoardSvg board={getBoard('zynq-carrier-power')} iso stableFrame={false} />
              </div>
              <figcaption className={s.measure}>
                <span>A 49.0 mm</span>
                <span>B 41.0 mm</span>
                <span>2 layers · KiCad 9</span>
                <span className={s.confirm}>[confirm]</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <SignalTeardown />

        {/* Honest status. */}
        <section className={s.section} aria-labelledby="status-title">
          <div className={s.sectionHead}>
            <h2 id="status-title" className={s.h2}>{status.headline}</h2>
            <p className={s.leadSmall}>{status.lead} <span className={s.confirm}>[confirm]</span></p>
          </div>
          <Timebase />
          <ul className={s.boards}>
            {status.boards.map((b) => {
              const m = modules.find((mm) => mm.id === b.id)!;
              return (
                <li key={b.id} className={s.boardCell}>
                  <div className={s.boardArt}>
                    {m.board ? (
                      <BoardSvg board={getBoard(m.board)} stableFrame={false} />
                    ) : (
                      <SensorModule w={26} h={20} />
                    )}
                  </div>
                  <p className={s.boardName}>{b.name}</p>
                  <p className={s.boardWord}>
                    <StateMark state={LINE_FORM[m.state]} size={16} />
                    {b.word}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className={s.statusFoot}>
            <div>
              <h3 className={s.h3}>Never started</h3>
              <ul className={s.struck}>
                {status.notStarted.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.h3}>Next</h3>
              <ol className={s.next}>
                {status.next.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* The four "1" rules. */}
        <section className={s.section} aria-labelledby="rules-title">
          <h2 id="rules-title" className={s.h2}>Every part has one.</h2>
          <ul className={s.rules}>
            {rules.map((r) => (
              <li key={r.what}>
                <span className={s.one} aria-hidden="true">1</span>
                <span className={s.ruleWhat}>
                  <span className="sr-only">One </span>
                  {r.what}
                </span>
                <span className={s.ruleLine}>{r.line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Join. */}
        <section className={s.join} id="join" aria-labelledby="join-title">
          <h2 id="join-title" className={s.hero1}>{join.headline}</h2>
          <p className={s.lead}>{join.lead}</p>
          <ul className={s.seats}>
            {modules.map((m) => (
              <li key={m.id} data-glyph-host="">
                <GlyphSeat size={24} />
                <span className={s.seatName}>{m.name}</span>
                <span className={s.seatOwner}>Unassigned</span>
              </li>
            ))}
          </ul>
          <p className={s.when}>
            <span>{join.when}</span>
            <span>{join.where}</span>
          </p>
          <div className={s.joinLinks}>
            <a className={s.textLink} href={join.discord} rel="noopener noreferrer" target="_blank">
              Say which one on Discord
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6" /></svg>
            </a>
          </div>
        </section>
      </main>
      <WorldFooter world="signal" />
    </div>
  );
}
