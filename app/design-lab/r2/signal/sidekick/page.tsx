import type { Metadata } from 'next';
import { CLUB, JoinChapter, WorldFooter, WorldNav } from '../../_chrome';
import { GlyphSeat, StateMark } from '../../_system';
import { BoardLayers } from '../../_system/boards/BoardLayers';
import { join, modules, ruleSentences, rulesHeadline, sidekick, status } from '../../_content/sidekick';
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

// Iso projection used by BoardLayers (board mm → view units): x' = 0.866(x − y), y' = 0.5(x + y).
const iso = (x: number, y: number): string => `${(0.866 * (x - y)).toFixed(2)} ${(0.5 * (x + y)).toFixed(2)}`;

/** Two oscilloscope cursors measuring the carrier's real edges (49.0 and 41.0 mm). Part of the figure: aria-hidden. */
function MeasureCursors() {
  return (
    <svg viewBox="-37.9 -2.21 82.73 49.42" className={s.cursors} aria-hidden="true">
      <path className={s.cursorExt} d={`M${iso(0, -1)}L${iso(0, -7)}M${iso(49, -1)}L${iso(49, -7)}M${iso(50, 0)}L${iso(56, 0)}M${iso(50, 41)}L${iso(56, 41)}`} />
      <path className={s.cursorLine} d={`M${iso(0, -5)}L${iso(49, -5)}M${iso(54, 0)}L${iso(54, 41)}`} />
      <text x={0.866 * (24.5 + 11)} y={0.5 * (24.5 - 11)} className={s.cursorText}>A 49.0 mm</text>
      <text x={0.866 * (60 - 20.5)} y={0.5 * (60 + 20.5) + 1} className={s.cursorText}>B 41.0 mm</text>
      <text x={44.5} y={0.5 * (60 + 41) + 4} textAnchor="end" className={s.cursorText}>KiCad 9 · 2 layers [confirm]</text>
    </svg>
  );
}

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
            <div className={s.heroFig}>
              <div className={s.heroBoard}>
                <BoardLayers
                  board="zynq-carrier-power"
                  stableFrame={false}
                  label="Power carrier, 49.0 by 41.0 millimetres, two copper layers, from the club's KiCad 9 file (to be confirmed by the club)"
                />
                <MeasureCursors />
              </div>
            </div>
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
                      <BoardLayers board={m.board} proj="flat" stableFrame={false} className={s.flatBoard} />
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
              <ul className={s.notStarted}>
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
          <h2 id="rules-title" className={s.h2}>{rulesHeadline}</h2>
          <ul className={s.rules}>
            {ruleSentences.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <JoinChapter
          world="signal"
          headline={join.headline}
          lead={join.lead}
          primary={{ label: 'Take a subsystem on Discord', href: CLUB.discord, external: true }}
        >
          <p className={s.seatOwner} id="sk-seats">Every seat unassigned</p>
          <ul className={s.seats} aria-labelledby="sk-seats">
            {modules.map((m) => (
              <li key={m.id}>
                <GlyphSeat size={24} />
                <span className={s.seatName}>{m.name}</span>
              </li>
            ))}
          </ul>
        </JoinChapter>
      </main>
      <WorldFooter world="signal" />
    </div>
  );
}
