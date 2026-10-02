import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react';
import { Ledger } from './components/Ledger';
import { SmoothScroll } from './components/SmoothScroll';
import { PhoneSequence } from './components/PhoneSequence';
import { RsvpDemo } from './components/RsvpDemo';
import { CaseStudy } from './components/CaseStudy';
import { GateBoard } from './components/GateBoard';
import { Assignee, OpenChip, Pending } from './components/Chips';
import {
  COMPANY_PATHS,
  GLASSES_FACTS,
  LAB_NOTES,
  LEDGER,
  LEDGER_AS_OF,
  LINKS,
  MEETING,
  OWNERSHIP_MODEL,
  PHONE_FACTS,
  PHONE_SUBSYSTEMS,
  PHONE_WORKFLOW,
  RSVP_WORDS,
  RSVP_WPM,
  SEATS,
} from './content';
import s from './e.module.css';

const NAV = [
  { label: 'Ledger', href: '#top' },
  { label: 'Case studies', href: '#cases' },
  { label: 'Seats', href: '#roles' },
  { label: 'Join', href: '#join' },
] as const;

const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export default function ConceptEPage() {
  const activeBuilds = LEDGER.filter((e) => e.status === 'active').length;
  const ownerSeats = PHONE_SUBSYSTEMS.length;

  return (
    <div className={s.root} id="top">
      <SmoothScroll />
      <a href="#e-main" className={s.skip}>
        Skip to content
      </a>

      {/* ---------------- nav ---------------- */}
      <header className={s.nav}>
        <nav aria-label="Concept E" className={`${s.wrap} ${s.navInner}`}>
          <a href="#top" className={s.brand} aria-label="DIGITAL, Cal Poly Pomona, back to top">
            <span className={s.brandMark} translate="no">
              DIGITAL
            </span>
            <span className={s.brandSub}>Cal Poly Pomona</span>
          </a>
          <ul className={s.navLinks}>
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <span className={s.navMeta}>Build night · Thu 6:00 PM</span>
          <div className={s.navCta}>
            <a href="#join" className={s.btnPrimary}>
              Take a subsystem
            </a>
          </div>
          <details className={s.menu}>
            <summary aria-label="Menu">
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </summary>
            <ul className={s.menuPanel}>
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </header>

      <div id="e-main" tabIndex={-1}>
        {/* ---------------- hero ---------------- */}
        <section className={s.hero} aria-labelledby="e-hero-title">
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <p className={s.eyebrow}>
                <b>Student-run venture studio</b> <span>Cal Poly Pomona</span>
              </p>
              <h1 id="e-hero-title" className={s.display}>
                Make something worth putting your name on.
              </h1>
              <p className={s.lead}>
                Two builds active. None shipped yet. This page is the ledger: what we build, which seats are open, and
                what is still pending.
              </p>
              <dl className={s.heroFacts} style={{ margin: 0 }}>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Builds active</dt>
                  <dd className={s.heroFactNum}>{activeBuilds}</dd>
                </div>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Shipped</dt>
                  <dd className={s.heroFactNum}>0</dd>
                </div>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Owners unassigned</dt>
                  <dd className={s.heroFactNum}>{ownerSeats}</dd>
                </div>
              </dl>
              <div className={s.heroActions}>
                <a href="#cases" className={s.btnGhost}>
                  Read the case studies <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a href="#join" className={s.linkBlock}>
                  {MEETING.when} · {MEETING.where}
                </a>
              </div>
            </div>
            <Ledger entries={LEDGER} asOf={LEDGER_AS_OF} />
          </div>
        </section>

        {/* ---------------- case studies ---------------- */}
        <section id="cases" className={s.section} aria-labelledby="e-cases-title" style={{ paddingBottom: 0 }}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div style={{ display: 'grid', gap: 12 }}>
                <p className={s.eyebrow}>
                  <b>Case studies</b> <span>2 active builds</span>
                </p>
                <h2 id="e-cases-title" className={s.h2}>
                  Two builds. Every field reported.
                </h2>
              </div>
              <p className={s.body}>
                Same questions, same order, for every build: problem, approach, team, outcome, assignees. A field is
                either filled, open for you, or pending with a reason.
              </p>
            </div>

            <CaseStudy
              anchor="case-dg-001"
              code="DG-001"
              title="The Modular Smartphone"
              headline="One phone, owned in seven parts."
              line="Build a modular smartphone around repair, upgrades, and real subsystem interfaces."
              route={LINKS.phoneRoute}
              facts={PHONE_FACTS}
              artifact={<PhoneSequence subsystems={PHONE_SUBSYSTEMS} />}
              problem={
                <p className={s.body}>
                  Phones are built to be thrown away. DG-001 treats repair as a design requirement: every part has a
                  boundary you can open, test and replace.
                </p>
              }
              approach={
                <>
                  <p className={s.body}>
                    Seven subsystems, each with an owner, a scope and a known risk. Work moves{' '}
                    {PHONE_WORKFLOW.join(' → ')}. Nothing joins the phone without passing four gates:
                  </p>
                  <ol className={s.gates}>
                    {OWNERSHIP_MODEL.map((gate, n) => (
                      <li key={gate} className={s.gate}>
                        <span className={s.gateNum}>G{n + 1}</span>
                        <span className={s.gateText}>{capital(gate)}</span>
                      </li>
                    ))}
                  </ol>
                </>
              }
              team={
                <p className={s.body}>
                  One owner per subsystem. All {ownerSeats} owner seats and the project lead are unassigned today; the
                  seat list is <a href="#roles" className={s.textLink}>below</a>.
                </p>
              }
              outcome={<GateBoard subsystems={PHONE_SUBSYSTEMS} />}
              assignees={[
                { role: 'Project lead' },
                { role: `Subsystem owners (${ownerSeats})` },
                { role: 'Reviewer' },
              ]}
              next={
                <p className={s.body}>
                  Each gate result lands on the board as it passes. Take a seat to move one.
                </p>
              }
            />

            <CaseStudy
              anchor="case-dg-002"
              code="DG-002"
              title="Smart Reading"
              headline="One word, held still."
              line="FPGA-based heads-up glasses that show one word at a time, right where you look. Built with dyslexic readers in mind."
              route={LINKS.glassesRoute}
              facts={GLASSES_FACTS}
              artifact={
                <div className={s.artifactSplit}>
                  <RsvpDemo words={RSVP_WORDS} wpm={RSVP_WPM} />
                  <div className={s.block}>
                    <p className={s.blockLabel}>Artifact · the method, running</p>
                    <p className={s.body}>
                      RSVP (rapid serial visual presentation) shows one word at a fixed point. The eyes stay still; the
                      words move. The reader sets the pace. {RSVP_WPM} wpm is the pace in the project&apos;s HUD demo.
                    </p>
                  </div>
                </div>
              }
              problem={
                <p className={s.body}>
                  Reading asks the eyes to jump along every line and find their place again. For many dyslexic readers
                  that chase is the hard part, not the words.
                </p>
              }
              approach={
                <p className={s.body}>
                  Hold each word at one point and let the reader choose the speed. An FPGA renders the stream in real
                  time, on hardware the wearer looks through.
                </p>
              }
              team={
                <p className={s.body}>
                  Needs engineering, optics, firmware, design and research. Faculty mentor: Dr. Mohamed El Hadedy. Free
                  to join.
                </p>
              }
              outcome={
                <dl className={s.outcomeList}>
                  <div>
                    <dt>Reader sessions logged</dt>
                    <dd>
                      <Pending>no study yet</Pending>
                    </dd>
                  </div>
                  <div>
                    <dt>Prototype shown</dt>
                    <dd>
                      <Pending>not shown yet</Pending>
                    </dd>
                  </div>
                  <div>
                    <dt>Demo pace</dt>
                    <dd>{RSVP_WPM} wpm, reader-set</dd>
                  </div>
                </dl>
              }
              assignees={[
                { role: 'Project lead' },
                { role: 'Faculty mentor', name: 'Dr. Mohamed El Hadedy' },
                { role: 'Optics' },
                { role: 'Firmware' },
              ]}
              next={
                <p className={s.body}>
                  Eight-month build cycle. Bring engineering, optics, firmware, design or research to build night.
                </p>
              }
            />
          </div>
        </section>

        {/* ---------------- secondary: owner seats ---------------- */}
        <section id="roles" className={s.section} aria-labelledby="e-roles-title">
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div style={{ display: 'grid', gap: 12 }}>
                <p className={s.eyebrow}>
                  <b>Open seats</b> <span>DG-001 · 2026–27</span>
                </p>
                <h2 id="e-roles-title" className={s.h2}>
                  Seven owner seats. All unassigned.
                </h2>
              </div>
              <p className={s.body}>
                Each seat owns one layer of the phone from first decision to test gate. Read it like a role spec: what
                you own, what can go wrong, what the work looks like.
              </p>
            </div>

            <ol className={s.specList}>
              {PHONE_SUBSYSTEMS.map((sub, i) => (
                <li key={sub.id} className={s.spec}>
                  <div className={s.specHead}>
                    <span className={s.specNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={s.specTitle}>{sub.title}</h3>
                    <Assignee />
                  </div>
                  <p className={s.specDesc}>{sub.description}</p>
                  <dl className={s.kv}>
                    <div>
                      <dt>You own</dt>
                      <dd>{sub.scope}</dd>
                    </div>
                    <div>
                      <dt>Risk</dt>
                      <dd>{sub.risk}</dd>
                    </div>
                    <div>
                      <dt>The work</dt>
                      <dd>{sub.bullets[0]}</dd>
                    </div>
                  </dl>
                  <a href={`/contact?type=project-team&seat=${sub.id}`} className={s.linkBlock}>
                    Take this seat <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>

            <div className={s.rolesGrid}>
              <div className={s.board}>
                <div className={s.boardHead}>
                  <span>Studio operations · {SEATS.length} seats</span>
                  <span style={{ color: 'var(--muted)' }}>2026–27</span>
                </div>
                <ul className={s.seatList}>
                  {SEATS.map((seat) => (
                    <li key={seat.id} className={s.seat}>
                      <span className={s.seatRole}>{seat.role}</span>
                      <Assignee />
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
                <p className={s.blockLabel}>For companies</p>
                <p className={s.body}>
                  Partner slots: <OpenChip href="/contact?type=sponsor">2 open</OpenChip>, one per build. A partner
                  is listed on the build it backs.
                </p>
                <ul className={s.pathList}>
                  {COMPANY_PATHS.map((path) => (
                    <li key={path.id}>
                      <a href={path.href} className={s.pathLink}>
                        <span className={s.pathTitle}>{path.title}</span>
                        <span className={s.pathDesc}>{path.description}</span>
                        <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- join: a draft ledger row ---------------- */}
        <section id="join" className={s.section} aria-labelledby="e-join-title">
          <div className={`${s.wrap} ${s.joinGrid}`}>
            <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
              <p className={s.eyebrow}>
                <b>Join</b> <span>Free · no project experience required</span>
              </p>
              <h2 id="e-join-title" className={s.h2}>
                Add your row to the ledger.
              </h2>
              <p className={s.body}>Bring engineering, computer science, design, or business.</p>
              <ol className={s.steps}>
                <li className={s.joinStep}>
                  <span className={s.joinNum} aria-hidden="true">
                    1
                  </span>
                  <div>
                    <h3 className={s.joinTitle}>Come to build night.</h3>
                    <p className={s.joinBody}>
                      {MEETING.when} · {MEETING.where}, {MEETING.campus}. {MEETING.line}
                    </p>
                  </div>
                </li>
                <li className={s.joinStep}>
                  <span className={s.joinNum} aria-hidden="true">
                    2
                  </span>
                  <div>
                    <h3 className={s.joinTitle}>Watch the builds on Discord.</h3>
                    <p className={s.joinBody}>
                      <a href={LINKS.discord} className={s.textLink} rel="noopener noreferrer" target="_blank">
                        Open Discord
                        <span className={s.srOnly}> (opens in a new tab)</span>
                      </a>
                    </p>
                  </div>
                </li>
                <li className={s.joinStep}>
                  <span className={s.joinNum} aria-hidden="true">
                    3
                  </span>
                  <div>
                    <h3 className={s.joinTitle}>Draft your row.</h3>
                    <p className={s.joinBody}>Pick a seat. The form goes to the project team.</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Works without JS: a GET form to the existing contact route. */}
            <form action="/contact" method="get" className={s.draft} aria-labelledby="e-draft-title">
              <input type="hidden" name="type" value="project-team" />
              <div className={s.ledgerHead}>
                <h3 id="e-draft-title" className={s.ledgerTitle}>
                  Draft row
                </h3>
                <span className={s.ledgerAsOf}>Not submitted</span>
              </div>
              <dl className={s.draftGrid}>
                <div>
                  <dt>
                    <label htmlFor="e-seat">Seat</label>
                  </dt>
                  <dd>
                    <select id="e-seat" name="seat" className={s.select} defaultValue="firmware-embedded">
                      <optgroup label="DG-001 · The Modular Smartphone">
                        {PHONE_SUBSYSTEMS.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.title}
                          </option>
                        ))}
                      </optgroup>
                      <option value="smart-reading">DG-002 · Smart Reading</option>
                      <option value="venture-studies">Program · Venture Studies</option>
                      <option value="pitch">DG-003 · Pitch a build</option>
                    </select>
                  </dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>
                    <span className={s.assignee} data-assigned="true">
                      <span className={s.avatar} aria-hidden="true">
                        You
                      </span>
                      You
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={s.status} data-kind="open">
                      Proposed
                    </span>
                  </dd>
                </div>
              </dl>
              <div className={s.draftFoot}>
                <button type="submit" className={s.btnPrimary}>
                  Open the form <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* ---------------- footer ---------------- */}
      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footGrid}>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
              <p className={s.footMark} translate="no">
                DIGITAL
              </p>
              <p style={{ margin: 0, color: 'var(--dark-muted)', maxWidth: '36ch' }}>
                Make something worth putting your name on. A student-run venture studio at Cal Poly Pomona.
              </p>
            </div>
            <div>
              <p className={s.footHead}>Work</p>
              <ul className={s.footList}>
                <li><a href={LINKS.phoneRoute}>DG-001 Modular Smartphone</a></li>
                <li><a href={LINKS.glassesRoute}>DG-002 Smart Reading</a></li>
                <li><a href={LINKS.join}>DG-003 Pitch a build</a></li>
              </ul>
            </div>
            <div>
              <p className={s.footHead}>Studio</p>
              <ul className={s.footList}>
                <li><a href="#roles">Open seats</a></li>
                <li><a href={LINKS.membership}>Become a member</a></li>
                <li><a href="/contact?type=sponsor">Back a build</a></li>
              </ul>
            </div>
            <div>
              <p className={s.footHead}>Contact</p>
              <ul className={s.footList}>
                <li><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
                <li><a href={LINKS.discord} rel="noopener noreferrer" target="_blank">Discord<span className={s.srOnly}> (opens in a new tab)</span></a></li>
                <li><span style={{ display: 'inline-flex', minHeight: 44, alignItems: 'center' }}>{MEETING.where}</span></li>
              </ul>
            </div>
          </div>
          <details className={s.labNotes}>
            <summary>Design-lab notes · {LAB_NOTES.length} facts to confirm before production</summary>
            <ol>
              {LAB_NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </details>
          <div className={s.footBase}>
            <span>{LEDGER_AS_OF ? `Ledger as of ${LEDGER_AS_OF}` : 'Ledger date pending'}</span>
            <span>Design lab · concept E v2 · exploratory copy, not production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
