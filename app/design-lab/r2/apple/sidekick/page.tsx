import type { Metadata } from 'next';
import { CLUB, JoinChapter, LocalNav, WorldFooter, WorldNav } from '../../_chrome';
import { GlyphSeat, Highlights, StateMark } from '../../_system';
import { BoardLayers } from '../../_system/boards/BoardLayers';
import { CineClip } from '../../_system/cine';
import { highlights, join, modules, ruleSentences, rulesHeadline, sidekick, status, swap } from '../../_content/sidekick';
import { ComputeModule, SensorModule } from '../../_sidekick/IsoModules';
import { ApplePinned } from './ApplePinned';
import { CloserLook } from './CloserLook';
import { HeroSettle } from './HeroSettle';
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

const HL_MEDIA = {
  compute: (
    <div className={s.hlMedia}>
      <ComputeModule w={40} h={30} />
    </div>
  ),
  kicad: (
    <div className={s.hlOutlines}>
      <BoardLayers board="zynq-carrier-power" proj="flat" layers={['substrate', 'edge']} stableFrame={false} label="Power carrier outline" />
      <BoardLayers board="fingerprint" proj="flat" layers={['substrate', 'edge']} stableFrame={false} label="Fingerprint module outline" />
    </div>
  ),
  fingerprint: (
    <div className={s.hlMedia}>
      <BoardLayers board="fingerprint" stableFrame={false} />
    </div>
  ),
  scope: (
    <div className={s.hlMedia}>
      <NoRadio />
    </div>
  ),
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
      <WorldNav world="apple" current="sidekick" join={false} />
      <LocalNav
        title={sidekick.name}
        titleHref="#overview"
        tone="dark"
        cta={{ label: sidekick.joinLink, href: '#join' }}
        links={[
          { label: 'Teardown', href: '#teardown' },
          { label: 'Boards', href: '#boards' },
          { label: 'Status', href: '#status' },
        ]}
      />

      <main id="r2-main">
        {/* Hero: the carrier is the product. */}
        <section className={s.hero} data-tone="dark" id="overview" aria-labelledby="sk-title">
          <div className={s.heroCopy}>
            <h1 id="sk-title" className={s.hero1}>{sidekick.headline}</h1>
            <p className={s.heroLead}>{sidekick.lead}</p>
          </div>
          <figure className={s.heroFig}>
            <HeroSettle className={s.heroBoard}>
              <BoardLayers board="zynq-carrier-power" stableFrame={false} label="Power carrier, 49 by 41 millimetres, from the club's KiCad file" />
            </HeroSettle>
            <figcaption className={s.heroCap}>
              {sidekick.heroCaption} <span className={s.confirm}>[confirm]</span>
            </figcaption>
          </figure>
        </section>

        {/* The one scrubbed asset: the pinned explode, then the module beats, one caption at a time. */}
        <section className={s.dark} data-tone="dark" id="teardown" aria-labelledby="teardown-title">
          <ApplePinned />
        </section>

        {/* Signature beat: the swap, played once on entry. */}
        <section className={s.swap} data-tone="dark" aria-labelledby="swap-title">
          <div className={s.chapterHead}>
            <h2 id="swap-title" className={s.h1}>{swap.headline}</h2>
            <p className={s.chapterLead}>{swap.lead}</p>
          </div>
          <div className={s.swapMedia}>
            <CineClip name="sidekick-swap" world="apple" mode="once" />
          </div>
        </section>

        {/* Product viewer over all five modules. */}
        <section className={s.closer} data-tone="dark" id="boards" aria-labelledby="boards-title">
          <h2 id="boards-title" className={s.h2}>Every module, up close.</h2>
          <CloserLook />
        </section>

        {/* Light from here on: highlights, status, rules, join. */}
        <section className={s.hl}>
          <Highlights
            id="highlights"
            title="At a glance."
            label="SIDEKICK highlights"
            items={highlights.map((h) => ({ id: h.id, title: h.title, caption: h.line, media: HL_MEDIA[h.id] }))}
          />
          <p className={s.hlNote}>
            From the club’s KiCad files and notes <span className={s.confirm}>[confirm]</span>
          </p>
        </section>

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
                    {m.board ? <BoardLayers board={m.board} proj="flat" stableFrame={false} className={s.flatBoard} /> : <SensorModule w={26} h={20} />}
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

        <section className={s.rulesSec} aria-labelledby="rules-title">
          <h2 id="rules-title" className={s.h1}>{rulesHeadline}</h2>
          <ul className={s.rules}>
            {ruleSentences.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <JoinChapter
          world="apple"
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
      <WorldFooter world="apple" />
    </div>
  );
}
