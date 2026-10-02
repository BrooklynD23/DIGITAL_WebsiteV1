import type { Metadata } from 'next';
import { WorldFooter } from '../../_chrome/WorldFooter';
import { WorldNav } from '../../_chrome/WorldNav';
import { GlyphSeat, StateMark } from '../../_system';
import { BoardSvg, getBoard } from '../../_system/boards';
import { highlights, join, modules, rules, sidekick, status, swap } from '../../_content/sidekick';
import { ComputeModule, SensorModule } from '../../_sidekick/IsoModules';
import { ApplePinned } from './ApplePinned';
import { AppleWalk } from './AppleWalk';
import { CloserLook } from './CloserLook';
import { CineClip } from '../../_system/cine';
import { Highlights } from './Highlights';
import { SwapClip } from './SwapClip';
import s from './sidekick.module.css';

export const metadata: Metadata = {
  title: 'SIDEKICK · DIGITAL lab',
  description: 'SIDEKICK, formerly the Modular Smartphone: a phone, part by part, drawn from the club’s real KiCad boards.',
};

function NoRadio() {
  return (
    <svg viewBox="0 0 120 120" className={s.hlIcon} role="img" aria-label="Radio waves, struck through">
      <g fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke">
        <path d="M60 60v38" />
        <path d="M48 98h24" />
        <path d="M44 44a22 22 0 0 0 0 32M76 44a22 22 0 0 1 0 32" strokeDasharray="2 4" />
        <path d="M32 32a40 40 0 0 0 0 56M88 32a40 40 0 0 1 0 56" strokeDasharray="2 4" />
        <path d="M24 100L96 20" />
      </g>
      <circle cx={60} cy={60} r={3} fill="currentColor" />
    </svg>
  );
}

const HL_ART = {
  compute: <ComputeModule w={40} h={30} />,
  kicad: (
    <div className={s.hlOutlines}>
      <BoardSvg board={getBoard('zynq-carrier-power')} layers={['substrate', 'edge']} stableFrame={false} />
      <BoardSvg board={getBoard('fingerprint')} layers={['substrate', 'edge']} stableFrame={false} />
    </div>
  ),
  fingerprint: <BoardSvg board={getBoard('fingerprint')} iso stableFrame={false} />,
  scope: <NoRadio />,
  paused: (
    <div className={s.hlPaused}>
      <StateMark state="paused" size={96} />
      <span>2025-08-26</span>
    </div>
  ),
} as const;

export default function AppleSidekickPage() {
  return (
    <div className={s.page}>
      <WorldNav world="apple" current="sidekick" />
      <nav className={s.local} aria-label="SIDEKICK" data-chrome="localnav" data-tone="dark">
        <div className={s.localInner}>
          <a className={s.localName} href="#overview">SIDEKICK</a>
          <ul className={s.localLinks}>
            <li><a href="#teardown">Teardown</a></li>
            <li><a href="#boards">Boards</a></li>
            <li><a href="#status">Status</a></li>
          </ul>
          <a className={s.pill} href="#join">{sidekick.joinLink}</a>
        </div>
      </nav>

      <main id="r2-main">
        {/* Hero: the carrier is the product. */}
        <section className={s.hero} data-tone="dark" id="overview" aria-labelledby="sk-title">
          <div className={s.heroCopy}>
            <h1 id="sk-title" className={s.heroTitle}>
              <span className={s.productName}>{sidekick.name}</span>
              <span className={s.hero1}>{sidekick.headline}</span>
            </h1>
            <p className={s.heroLead}>{sidekick.lead}</p>
            <a className={s.chev} href="#teardown">
              See it come apart
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
            </a>
          </div>
          <figure className={s.heroFig}>
            <div className={s.heroBoard}>
              <BoardSvg board={getBoard('zynq-carrier-power')} iso stableFrame={false} />
            </div>
            <figcaption className={s.heroCap}>
              {sidekick.heroCaption} <span className={s.confirm}>[confirm]</span>
            </figcaption>
          </figure>
        </section>

        {/* Highlights strip carries the breadth. */}
        <section className={s.hl} aria-labelledby="hl-title">
          <h2 id="hl-title" className={s.h2}>SIDEKICK at a glance.</h2>
          <Highlights label="SIDEKICK highlights">
            {highlights.map((h) => (
              <li key={h.id} className={s.hlCard}>
                <div className={s.hlArt}>{HL_ART[h.id]}</div>
                <p className={s.hlText}>
                  <strong>{h.title}.</strong> {h.line} <span className={s.confirm}>[confirm]</span>
                </p>
              </li>
            ))}
          </Highlights>
        </section>

        {/* The one scrubbed asset: the pinned explode, one caption per layer. */}
        <section className={s.dark} data-tone="dark" id="teardown" aria-labelledby="teardown-title">
          <ApplePinned />
        </section>

        {/* The subsystem walk: the stack holds, each module states its scope, risk and owner. */}
        <section className={s.walkSec} data-tone="dark" aria-labelledby="walk-title">
          <div className={s.chapterHead}>
            <h2 id="walk-title" className={s.h1}>Five modules. One stack.</h2>
            <p className={s.chapterLead}>Two are real boards. Three are drawn as outlines.</p>
          </div>
          <AppleWalk />
        </section>

        {/* Signature beat: the swap, played once on entry. */}
        <section className={s.swap} data-tone="dark" aria-labelledby="swap-title">
          <div className={s.chapterHead}>
            <h2 id="swap-title" className={s.h1}>{swap.headline}</h2>
            <p className={s.chapterLead}>{swap.lead}</p>
          </div>
          <div className={s.swapMedia}>
            <CineClip name="sidekick-swap" mode="once" fallback={<SwapClip />} aspect="16x9" />
          </div>
        </section>

        {/* Product viewer. */}
        <section className={s.closer} id="boards" aria-labelledby="boards-title">
          <h2 id="boards-title" className={s.h2}>Every board, up close.</h2>
          <CloserLook />
        </section>

        {/* Honest status. */}
        <section className={s.status} id="status" aria-labelledby="status-title">
          <div className={s.chapterHead}>
            <h2 id="status-title" className={s.h1}>{status.headline}</h2>
            <p className={s.chapterLead}>
              {status.lead} <span className={s.confirm}>[confirm]</span>
            </p>
          </div>
          <ol className={s.timeline}>
            {status.timeline.map((t) => (
              <li key={t.date}>
                <span className={s.tlDate}>{t.date}</span>
                <span className={s.tlLabel}>{t.label}</span>
              </li>
            ))}
          </ol>
          <ul className={s.statusBoards}>
            {status.boards.map((b) => {
              const m = modules.find((mm) => mm.id === b.id)!;
              return (
                <li key={b.id}>
                  <div className={s.statusArt}>
                    {m.board ? <BoardSvg board={getBoard(m.board)} stableFrame={false} /> : <SensorModule w={26} h={20} />}
                  </div>
                  <p className={s.statusName}>{b.name}</p>
                  <p className={s.statusWord}>{b.word}</p>
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

        {/* Ownership rules. */}
        <section className={s.rulesSec} aria-labelledby="rules-title">
          <h2 id="rules-title" className={s.h1}>Every part has one.</h2>
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
          <p className={s.chapterLead}>{join.lead}</p>
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
            {join.when} · {join.where}
          </p>
          <a className={s.chev} href={join.discord} rel="noopener noreferrer" target="_blank">
            Say which one on Discord
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
          </a>
        </section>
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
