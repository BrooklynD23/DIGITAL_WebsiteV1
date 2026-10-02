import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react';
import { Ledger } from './components/Ledger';
import { SmoothScroll } from './components/SmoothScroll';
import { PhoneSequence } from './components/PhoneSequence';
import { RsvpDemo } from './components/RsvpDemo';
import { CaseStudy } from './components/CaseStudy';
import {
  COMPANY_PATHS,
  GLASSES_FACTS,
  LEDGER,
  LINKS,
  MEETING,
  OWNERSHIP_MODEL,
  PHONE_FACTS,
  PHONE_SUBSYSTEMS,
  PHONE_WORKFLOW,
  PLACEHOLDER_DATE,
  RSVP_WORDS,
  RSVP_WPM,
  SEATS,
} from './content';
import s from './e.module.css';

const NAV = [
  { label: 'Ledger', href: '#top' },
  { label: 'Case studies', href: '#cases' },
  { label: 'Roles', href: '#roles' },
  { label: 'Join', href: '#join' },
] as const;

const i = (n: number) => ({ '--i': n }) as CSSProperties;

const leadFor = (projectLead: string) => SEATS.find((seat) => seat.role === projectLead);

export default function ConceptEPage() {
  const openSeats = SEATS.filter((seat) => seat.open).length;
  const activeBuilds = LEDGER.filter((e) => e.status === 'active').length;

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
            <span className={s.brandMark}>DIGITAL</span>
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

      <main id="e-main">
        {/* ---------------- hero ---------------- */}
        <section className={s.hero} aria-labelledby="e-hero-title">
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <p className={`${s.eyebrow} ${s.rise}`} style={i(0)}>
                <b>Student-run venture studio</b> <span>Cal Poly Pomona</span>
              </p>
              <h1 id="e-hero-title" className={`${s.display} ${s.rise}`} style={i(1)}>
                Make something worth putting your name on.
              </h1>
              <p className={`${s.lead} ${s.rise}`} style={i(2)}>
                Two builds active. None shipped yet. This page is the ledger: what we build, who owns which part, and
                what is still blank.
              </p>
              <dl className={`${s.heroFacts} ${s.rise}`} style={{ ...i(3), margin: 0 }}>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Builds active</dt>
                  <dd className={s.heroFactNum} style={{ margin: 0 }}>
                    {activeBuilds}
                  </dd>
                </div>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Shipped</dt>
                  <dd className={s.heroFactNum} style={{ margin: 0 }}>
                    0
                  </dd>
                </div>
                <div className={s.heroFact}>
                  <dt className={s.heroFactLabel}>Seats open</dt>
                  <dd className={s.heroFactNum} style={{ margin: 0 }}>
                    {openSeats}
                  </dd>
                </div>
              </dl>
              <div className={`${s.heroActions} ${s.rise}`} style={i(4)}>
                <a href="#cases" className={s.btnGhost}>
                  Read the case studies <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a href="#join" className={s.textLink}>
                  {MEETING.when} · {MEETING.where}
                </a>
              </div>
            </div>
            <Ledger entries={LEDGER} asOf={PLACEHOLDER_DATE} />
          </div>
        </section>

        {/* ---------------- case studies ---------------- */}
        <section id="cases" className={s.section} aria-labelledby="e-cases-title" style={{ paddingBottom: 0 }}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div style={{ display: 'grid', gap: 12 }}>
                <p className={s.eyebrow}>
                  <b>Case studies</b> <span>2 of 2 builds</span>
                </p>
                <h2 id="e-cases-title" className={s.h2}>
                  Same template for every build. Blanks stay blank.
                </h2>
              </div>
              <p className={s.body}>
                Each case study answers the same questions in the same order: problem, approach, team, outcome, who
                signed it. Where the answer does not exist yet, the field says so.
              </p>
            </div>

            <CaseStudy
              anchor="case-dg-001"
              code="DG-001"
              title="The Modular Smartphone"
              headline="One phone, owned in seven parts."
              line="Build a modular smartphone around repair, upgrades, and real subsystem interfaces."
              statusLabel="Active · phase [confirm]"
              route={LINKS.phoneRoute}
              facts={PHONE_FACTS}
              plateLabel="[ PROJECT PHOTO — DG-001 BENCH ] [placeholder]"
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
                    {PHONE_WORKFLOW.join(' → ')}. Nothing joins the phone without passing these four gates:
                  </p>
                  <ol className={s.gates} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {OWNERSHIP_MODEL.map((gate, n) => (
                      <li key={gate} className={s.gate}>
                        <span className={s.gateNum}>Gate {n + 1}</span>
                        <span className={s.gateText}>{gate.charAt(0).toUpperCase() + gate.slice(1)}</span>
                      </li>
                    ))}
                  </ol>
                </>
              }
              team={
                <p className={s.body}>
                  One owner per subsystem across {PHONE_SUBSYSTEMS.length} subsystems. Project lead:{' '}
                  {leadFor('Project Lead — Modular Smartphone')?.open ? 'to be announced' : '[confirm]'}. Owners are
                  named here when the seats are taken.
                </p>
              }
              outcomes={[
                { value: <>—<span> / {PHONE_SUBSYSTEMS.length}</span></>, label: 'Subsystems through the test gate', note: '[placeholder — not measured]' },
                { value: '—', label: 'Published revisions', note: '[placeholder — none yet]' },
                { value: '—', label: 'Repair plan', note: '[placeholder — due before release]' },
              ]}
              signoff={[
                { role: 'Project lead' },
                { role: 'Subsystem owners' },
                { role: 'Reviewer' },
                { role: 'Test gate' },
              ]}
              next={
                <p className={s.body}>
                  Next milestone: <span className={s.ph}>[placeholder — phase to confirm]</span>. Take a subsystem
                  to move it.
                </p>
              }
            />

            <CaseStudy
              anchor="case-dg-002"
              code="DG-002"
              title="Smart Reading"
              headline="One word, held still."
              line="FPGA-based heads-up glasses that show one word at a time, right where you look. Built with dyslexic readers in mind."
              statusLabel="Active · phase [confirm]"
              route={LINKS.glassesRoute}
              facts={GLASSES_FACTS}
              plateLabel="[ PROJECT PHOTO — DG-002 PROTOTYPE ] [placeholder]"
              artifact={
                <div className={s.artifactSplit}>
                  <RsvpDemo words={RSVP_WORDS} wpm={RSVP_WPM} />
                  <div className={s.block}>
                    <p className={s.blockLabel}>Artifact · the method, running</p>
                    <p className={s.body}>
                      RSVP (rapid serial visual presentation) shows one word at a fixed point. The eyes stay still; the
                      words move. The reader sets the pace. Press play to read the sample at {RSVP_WPM} wpm, the pace
                      in the project&apos;s HUD demo.
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
                  Needs engineering, optics, firmware, design and research. Faculty mentor: Dr. Mohamed El Hadedy.
                  Project lead: {leadFor('Project Lead — Smart Reading')?.open ? 'to be announced' : '[confirm]'}. Free
                  to join.
                </p>
              }
              outcomes={[
                { value: '—', label: 'Reader sessions logged', note: '[placeholder — no study yet]' },
                { value: RSVP_WPM, label: 'Demo pace (wpm), reader-set', note: 'from the project HUD demo' },
                { value: '—', label: 'Prototype shown', note: '[placeholder — not shown yet]' },
              ]}
              signoff={[
                { role: 'Project lead' },
                { role: 'Faculty mentor', name: 'Dr. Mohamed El Hadedy' },
                { role: 'Optics' },
                { role: 'Firmware' },
              ]}
              next={
                <p className={s.body}>
                  Next milestone: <span className={s.ph}>[placeholder — phase to confirm]</span>. Eight-month build
                  cycle.
                </p>
              }
            />
          </div>
        </section>

        {/* ---------------- secondary: open roles + partner slots ---------------- */}
        <section id="roles" className={s.section} aria-labelledby="e-roles-title">
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div style={{ display: 'grid', gap: 12 }}>
                <p className={s.eyebrow}>
                  <b>Open roles</b> <span>2026–27</span>
                </p>
                <h2 id="e-roles-title" className={s.h2}>
                  {openSeats === SEATS.length ? 'Seven seats. All open.' : `${openSeats} seats open.`}
                </h2>
              </div>
              <p className={s.body}>
                Every leadership seat is unfilled. Names go on this board when people take them. Companies: the partner
                slots are open too, and listed the same way.
              </p>
            </div>
            <div className={s.rolesGrid}>
              <div className={s.board}>
                <div className={s.boardHead}>
                  <span>Seat</span>
                  <span style={{ color: 'var(--muted)' }}>Term</span>
                </div>
                <ul className={s.seatList}>
                  {SEATS.map((seat) => (
                    <li key={seat.id} className={s.seat}>
                      <span className={s.seatRole}>{seat.role}</span>
                      <span className={s.seatName}>{seat.open ? 'Open · to be announced' : 'Filled'}</span>
                      <span className={s.seatTerm}>{seat.term}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'grid', gap: 28, alignContent: 'start' }}>
                <div className={s.partnerSlots}>
                  <p className={s.blockLabel}>Partner slots</p>
                  <div className={s.slots}>
                    <div className={s.slot}>
                      <span className={s.mono}>DG-001</span>
                      <span className={s.slotLabel}>Partner slot open</span>
                      <span className={s.slotNote}>No company backs this build yet.</span>
                    </div>
                    <div className={s.slot}>
                      <span className={s.mono}>DG-002</span>
                      <span className={s.slotLabel}>Partner slot open</span>
                      <span className={s.slotNote}>No company backs this build yet.</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={s.blockLabel}>For companies</p>
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
          </div>
        </section>

        {/* ---------------- join ---------------- */}
        <section id="join" className={s.section} aria-labelledby="e-join-title">
          <div className={`${s.wrap} ${s.joinGrid}`}>
            <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
              <p className={s.eyebrow}>
                <b>Join</b> <span>Free · no project experience required</span>
              </p>
              <h2 id="e-join-title" className={s.h2}>
                Put your name on a build.
              </h2>
              <p className={s.body}>Bring engineering, computer science, design, or business.</p>
              <div className={s.heroActions}>
                <a href={LINKS.join} className={s.btnPrimary}>
                  Take a subsystem <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>
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
                  <h3 className={s.joinTitle}>Join the Discord.</h3>
                  <p className={s.joinBody}>
                    Watch the builds before you pick one.{' '}
                    <a href={LINKS.discord} className={s.textLink} rel="noopener noreferrer" target="_blank">
                      Open Discord <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                      <span className={s.srOnly}>(opens in a new tab)</span>
                    </a>
                  </p>
                </div>
              </li>
              <li className={s.joinStep}>
                <span className={s.joinNum} aria-hidden="true">
                  3
                </span>
                <div>
                  <h3 className={s.joinTitle}>Take a subsystem.</h3>
                  <p className={s.joinBody}>
                    Tell us the build and the part. One form, routed to the project team.{' '}
                    <a href={LINKS.join} className={s.textLink}>
                      Open the form
                    </a>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>

      {/* ---------------- footer ---------------- */}
      <footer className={s.footer}>
        <div className={`${s.wrap}`}>
          <div className={s.footGrid}>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
              <p className={s.footMark}>DIGITAL</p>
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
                <li><a href="#roles">Open roles</a></li>
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
          <div className={s.footBase}>
            <span>Ledger as of {PLACEHOLDER_DATE}</span>
            <span>Design lab · concept E · exploratory copy, not production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
