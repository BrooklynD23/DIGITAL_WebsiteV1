import { ArrowRight, ArrowUpRight, CalendarBlank, DiscordLogo, MapPin } from '@phosphor-icons/react/dist/ssr';
import { DrawOn } from './DrawOn';
import { Sketch, sk } from './sketch';
import {
  becoming,
  dg001,
  dg002,
  links,
  meeting,
  openSeats,
  ownership,
  subsystems,
  ventureStudies,
  workflow,
} from './content';
import s from './d.module.css';

const ROOT_ID = 'concept-d';

/* ---------- small pieces ---------- */

function Placeholder({ children }: { readonly children?: React.ReactNode }) {
  return <span className={s.ph}>[placeholder]{children ? <> {children}</> : null}</span>;
}

/** Hand-drawn blank: the signature line that recurs down the page. */
function Blank({ wide = false, label = 'blank, for your name' }: { readonly wide?: boolean; readonly label?: string }) {
  return (
    <span className={wide ? `${s.blank} ${s.blankWide}` : s.blank}>
      <span className="sr-only">{label}</span>
      <Sketch
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        nonScaling
        className={s.blankLine}
        still
        drawables={[sk.line(2, 8, 198, 6, { roughness: 1.1, seed: wide ? 11 : 5, strokeWidth: 1.4 })]}
      />
    </span>
  );
}

function Photo({
  src,
  alt,
  caption,
  className,
  priority = false,
}: {
  readonly src: string;
  readonly alt: string;
  readonly caption: React.ReactNode;
  readonly className?: string;
  readonly priority?: boolean;
}) {
  return (
    <figure className={`${s.print} ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimized webp ≤120 KB */}
      <img
        src={src}
        alt={alt}
        width={1400}
        height={939}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
      <figcaption className={s.printCaption}>{caption}</figcaption>
    </figure>
  );
}

/* ---------- sections ---------- */

function SiteNav() {
  return (
    <header className={s.nav}>
      <div className={s.navInner}>
        <a href="#top" className={s.wordmark} aria-label="DIGITAL at Cal Poly Pomona, top of page">
          DIGITAL<span className={s.wordmarkAt}> @ Cal Poly Pomona</span>
        </a>
        <nav aria-label="Concept D" className={s.navLinks}>
          <a href="#work">The work</a>
          <a href="#how">How a build runs</a>
          <a href="#seats">Seats</a>
        </nav>
        <a href="#join" className={s.navCta}>
          <span className={s.navCtaMeta}>Thu 6 PM</span> Come build
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={s.hero} aria-labelledby="d-hero-h">
      <div className={s.heroText}>
        <p className={s.eyebrow}>A student-run venture studio at Cal Poly Pomona</p>
        <h1 id="d-hero-h" className={s.heroH}>
          Make something worth putting{' '}
          <span className={s.nameMark}>
            your name
            <Sketch
              viewBox="0 0 320 28"
              preserveAspectRatio="none"
              className={s.nameUnderline}
              drawables={[
                sk.curve(
                  [
                    [4, 16],
                    [90, 10],
                    [190, 14],
                    [316, 8],
                  ],
                  { strokeWidth: 3, roughness: 1.6, seed: 3 },
                ),
              ]}
            />
          </span>{' '}
          on.
        </h1>
        <p className={s.lead}>
          Different majors, one product. You take one part of a real build, carry it through review and
          testing, and sign it. Nobody hands you a finished project.
        </p>
        <div className={s.heroActions}>
          <a href="#join" className={s.button}>
            Come on a Thursday <ArrowRight size={20} weight="regular" aria-hidden />
          </a>
          <a href="#work" className={s.textLink}>
            See what&apos;s on the bench
          </a>
        </div>
        <ul className={s.heroMeta} aria-label="Build night">
          <li>
            <CalendarBlank size={20} aria-hidden /> {meeting.schedule}
          </li>
          <li>
            <MapPin size={20} aria-hidden /> {meeting.room}
          </li>
          <li>No project experience required</li>
        </ul>
      </div>

      <div className={s.heroPhoto}>
        <Photo
          priority
          src="/design-lab/d/d-workbench.webp"
          alt="[placeholder] Generated scene, not a DIGITAL photo: an evening lab bench with a circuit board in a vise, a soldering iron, a multimeter, a sketchbook of block diagrams and a grey 3D-printed phone enclosure."
          caption={
            <>
              <Placeholder /> Generated scene. Not a DIGITAL photo. Real build-night photos replace it.
            </>
          }
        />
        <div className={s.tag} aria-hidden="true">
          <span className={s.tagLabel}>Built by</span>
          <span className={s.tagBlank} />
        </div>
        <p className={s.heroNote} aria-hidden="true">
          this part&apos;s yours
          <Sketch
            viewBox="0 0 90 60"
            className={s.heroNoteArrow}
            drawables={[
              sk.curve(
                [
                  [80, 6],
                  [60, 30],
                  [22, 46],
                ],
                { seed: 9 },
              ),
              sk.line(22, 46, 36, 36, { seed: 10 }),
              sk.line(22, 46, 38, 52, { seed: 12 }),
            ]}
          />
        </p>
      </div>
    </section>
  );
}

function Becoming() {
  return (
    <section className={s.becoming} aria-labelledby="d-become-h">
      <div className={s.sectionHead}>
        <p className={s.eyebrow}>Who you become</p>
        <h2 id="d-become-h" className={s.h2}>
          You arrive with a major.
          <br />
          You leave owning a part.
        </h2>
      </div>
      <ol className={s.becomeList}>
        {becoming.map((row, i) => (
          <li key={row.arrive} className={s.becomeRow}>
            <span className={s.becomeArrive}>{row.arrive}</span>
            <Sketch
              viewBox="0 0 120 24"
              preserveAspectRatio="none"
              nonScaling
              className={s.becomeArrow}
              drawables={[
                sk.line(2, 12, 112, 12, { seed: 20 + i, roughness: 1.2 }),
                sk.line(112, 12, 102, 5, { seed: 40 + i }),
                sk.line(112, 12, 102, 19, { seed: 60 + i }),
              ]}
            />
            <span className={s.becomeLeave}>
              {row.leave}
              <span className={s.becomeSource}>{row.source}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className={s.footnote}>
        Pairings are examples, not assignments. Any major can take any part. Each right-hand line paraphrases the
        build&apos;s own subsystem notes.
      </p>
    </section>
  );
}

function Field({ k, children }: { readonly k: string; readonly children: React.ReactNode }) {
  return (
    <div className={s.field}>
      <dt>{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className={s.work} aria-labelledby="d-work-h">
      <div className={s.sectionHead}>
        <p className={s.eyebrow}>The work</p>
        <h2 id="d-work-h" className={s.h2}>
          Two builds on the bench.
          <br />
          Both need owners.
        </h2>
        <p className={s.sectionLead}>
          Each entry says what the problem is, what is being made, who it needs, and what isn&apos;t done yet.
        </p>
      </div>

      {/* DG-001 */}
      <article className={s.record} aria-labelledby="dg001-h">
        <div className={s.recordMedia}>
          <Photo
            src="/design-lab/d/d-hands.webp"
            alt="[placeholder] Generated scene, not a DIGITAL photo: two people's hands over a green circuit board, one with tweezers, one with a multimeter probe, beside a handwritten checklist."
            caption={
              <>
                <Placeholder /> Generated scene, not DG-001 hardware. Bench photos of the real board go here.
              </>
            }
          />
        </div>
        <div className={s.recordBody}>
          <p className={s.recordId}>
            {dg001.id} <span aria-hidden>·</span> <span className={s.status}>Active</span>{' '}
            <span className={s.statusNote}>prototyping, not shipped [confirm phase]</span>
          </p>
          <h3 id="dg001-h" className={s.h3}>
            {dg001.title}
          </h3>
          <p className={s.recordProblem}>{dg001.problem}</p>
          <p className={s.recordObject}>{dg001.oneLine}</p>
          <dl className={s.fields}>
            <Field k="Who it needs">{dg001.needs.join(' · ')}</Field>
            <Field k="How it runs">{workflow.join(' → ')}</Field>
            <Field k="What you learn">{dg001.learns.join('. ')}.</Field>
            <Field k="Duration">
              <Placeholder>start date and length</Placeholder>
            </Field>
            <Field k="Outcome so far">
              <Placeholder>first test-gate result</Placeholder>
            </Field>
            <Field k="Repo / demo">
              <Placeholder>not public yet</Placeholder>
            </Field>
          </dl>
          <div className={s.signoff}>
            <span className={s.signoffLabel}>Built by</span>
            <Blank wide label="Built by: owners are listed when they sign off" />
            <span className={s.signoffNote}>7 subsystems, 7 owners. Names go here when they sign off.</span>
          </div>
          <a href={dg001.href} className={s.textLink}>
            Open the {dg001.title.replace('The ', '').toLowerCase()} build <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </article>

      {/* DG-002 */}
      <article className={`${s.record} ${s.recordFlip}`} aria-labelledby="dg002-h">
        <div className={s.recordMedia}>
          <figure className={s.print}>
            <div className={s.pov}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimized webp */}
              <img src="/design-lab/d/d-book-pov.webp" alt="" width={1200} height={676} loading="lazy" decoding="async" />
              <span className={s.povWord} aria-hidden="true">
                {dg002.word}
              </span>
              <span className={s.povHud} aria-hidden="true">
                RSVP · {dg002.wpm} wpm
              </span>
            </div>
            <figcaption className={s.printCaption}>
              What the wearer sees: one word held at a fixed point over the page. Page art is the Smart Reading
              route&apos;s own render asset; not a prototype photo.
            </figcaption>
          </figure>
        </div>
        <div className={s.recordBody}>
          <p className={s.recordId}>
            {dg002.id} <span aria-hidden>·</span> <span className={s.status}>Active</span>{' '}
            <span className={s.statusNote}>phase [confirm]</span>
          </p>
          <h3 id="dg002-h" className={s.h3}>
            {dg002.title}
          </h3>
          <p className={s.recordProblem}>{dg002.problem}</p>
          <p className={s.recordObject}>{dg002.object}</p>
          <dl className={s.fields}>
            <Field k="Who it needs">{dg002.needs.join(' · ')}</Field>
            <Field k="Built with">{dg002.tech.join(' · ')}</Field>
            <Field k="Mentor">{dg002.mentor}</Field>
            <Field k="Duration">{dg002.cycle}</Field>
            <Field k="Outcome so far">
              <Placeholder>prototype state</Placeholder>
            </Field>
            <Field k="Cost">{dg002.cost}</Field>
          </dl>
          <div className={s.signoff}>
            <span className={s.signoffLabel}>Built by</span>
            <Blank wide label="Built by: contributors are listed when they sign off" />
          </div>
          <a href={dg002.href} className={s.textLink}>
            Read without the chase <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </article>

      {/* Program + open slot */}
      <div className={s.ledger}>
        <article className={s.ledgerRow} aria-labelledby="vs-h">
          <p className={s.recordId}>Program · {ventureStudies.kicker}</p>
          <h3 id="vs-h" className={s.h4}>
            {ventureStudies.title}
          </h3>
          <p>{ventureStudies.line}</p>
          <p className={s.muted}>You learn to {ventureStudies.learns.map((l) => l.charAt(0).toLowerCase() + l.slice(1)).join(', and ')}.</p>
        </article>
        <article className={`${s.ledgerRow} ${s.ledgerOpen}`} aria-labelledby="dg003-h">
          <p className={s.recordId}>DG-003 · unsigned</p>
          <h3 id="dg003-h" className={s.h4}>
            The next build is <Blank label="blank: not decided yet" />
          </h3>
          <p>Bring the problem. If a team signs on, it gets a number.</p>
          <a href={links.projectTeam} className={s.textLink}>
            Pitch the next build <ArrowRight size={18} aria-hidden />
          </a>
        </article>
      </div>
    </section>
  );
}

/** The Rough.js process layer: owner → review → test gate → repair plan → signature. */
function HowABuildRuns() {
  const steps = [
    { k: 'Thursday, 6 PM', line: 'You walk in. Subsystem standups first, workshop after.', mono: meeting.room },
    { k: 'Owner', line: 'You take a subsystem. It is yours, start to finish.', mono: ownership[0] },
    { k: 'Review', line: 'Someone reviews every handoff before it moves on.', mono: ownership[1] },
    { k: 'Test gate', line: 'Your part passes a test before it joins the phone.', mono: ownership[2] },
    { k: 'Repair plan', line: 'You write down how to fix it when it breaks.', mono: ownership[3] },
    { k: 'Signed', line: 'Then your name goes on it.', mono: 'built by ______' },
  ] as const;

  // Horizontal rail (≥1100px): circles sit on each step column's left edge, so the
  // hand-lettered numbers line up with them. Units match px at the 1184px max width.
  const RAIL_W = 1184;
  const GAP = 20;
  const colW = (RAIL_W - GAP * 5) / 6;
  const cx = steps.map((_, i) => i * (colW + GAP) + 20);
  const wobble = [-6, 5, -4, 6, -5];
  const railPts: (readonly [number, number])[] = [];
  cx.forEach((x, i) => {
    railPts.push([x, 40] as const);
    const next = cx[i + 1];
    if (next !== undefined) railPts.push([(x + next) / 2, 40 + (wobble[i] ?? 0)] as const);
  });
  const stops = cx.map((x) => [x, 40] as const);

  return (
    <section id="how" className={s.how} aria-labelledby="d-how-h">
      <div className={s.howHead}>
        <div className={s.sectionHead}>
          <p className={s.eyebrow}>How a build runs</p>
          <h2 id="d-how-h" className={s.h2}>
            How a part gets
            <br />
            your name on it.
          </h2>
          <p className={s.sectionLead}>
            The smartphone build runs on four rules: {ownership.join('; ')}. Here is what that looks like from your
            seat.
          </p>
        </div>
        <Photo
          className={s.howPhoto}
          src="/design-lab/d/d-whiteboard.webp"
          alt="[placeholder] Generated scene, not a DIGITAL photo: a whiteboard with a hand-drawn phone outline surrounded by boxes, arrows and sticky notes."
          caption={
            <>
              <Placeholder /> Generated whiteboard. The real subsystem map lives on the smartphone page.
            </>
          }
        />
      </div>

      <div className={s.rail}>
        <Sketch
          viewBox={`0 0 ${RAIL_W} 80`}
          className={s.railH}
          drawables={[
            sk.curve(railPts, { seed: 31, roughness: 1.1, strokeWidth: 1.4 }),
            ...stops.map(([x, y], i) =>
              sk.circle(x, y, 40, {
                seed: 50 + i,
                strokeWidth: i === stops.length - 1 ? 2.2 : 1.5,
                fill: 'var(--d-paper-2)',
                fillStyle: 'solid',
              }),
            ),
          ]}
        />
        <Sketch
          viewBox="0 0 40 600"
          preserveAspectRatio="none"
          nonScaling
          className={s.railV}
          drawables={[sk.curve([[20, 8], [14, 160], [26, 320], [16, 470], [20, 592]], { seed: 33, strokeWidth: 1.4 })]}
        />
        <ol className={s.steps}>
          {steps.map((step, i) => (
            <li key={step.k} className={i === steps.length - 1 ? `${s.step} ${s.stepLast}` : s.step}>
              <span className={s.stepNum} aria-hidden="true">
                {i}
              </span>
              <h3 className={s.stepK}>{step.k}</h3>
              <p className={s.stepLine}>{step.line}</p>
              <p className={s.stepMono}>{step.mono}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className={s.handNote}>
        <span aria-hidden="true">↳ </span>same four stages for every part: {workflow.join(', ')}.
      </p>
    </section>
  );
}

/** Secondary section: CSS-only seat picker (radio group). Works without JS; arrow keys move between seats. */
function Seats() {
  const n = subsystems.length;
  // Seats around a long workbench, seen from above: 4 along the far side, 3 along the near side.
  const SEAT_POS = [
    { left: 20, top: 13 },
    { left: 40, top: 13 },
    { left: 60, top: 13 },
    { left: 80, top: 13 },
    { left: 30, top: 87 },
    { left: 50, top: 87 },
    { left: 70, top: 87 },
  ] as const;
  const seatPos = subsystems.map((_, i) => SEAT_POS[i] ?? { left: 50, top: 50 });
  // Exploded phone on the bench: three offset layers (back, board, glass), drawn by hand.
  const phoneLayer = (x: number, y: number, seed: number, w = 46, h = 78, r = 9) =>
    sk.path(
      `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`,
      { seed, strokeWidth: 1.3, roughness: 0.9 },
    );

  return (
    <section id="seats" className={s.seats} aria-labelledby="d-seats-h">
      <div className={s.sectionHead}>
        <p className={s.eyebrow}>Pull up a chair</p>
        <h2 id="d-seats-h" className={s.h2}>
          Seven seats at one table.
          <br />
          Pick the one you&apos;d take.
        </h2>
        <p className={s.sectionLead}>
          The smartphone splits into seven subsystems. Each seat is one owner. Products need more than programmers.
        </p>
      </div>

      <div className={s.seatGrid}>
        <fieldset className={s.table}>
          <legend className="sr-only">Choose a subsystem seat</legend>
          <Sketch
            viewBox="0 0 400 300"
            className={s.tableSketch}
            drawables={[
              sk.rect(40, 92, 320, 116, { seed: 70, strokeWidth: 1.7, roughness: 1.1 }),
              sk.line(48, 100, 352, 100, { seed: 71, strokeWidth: 0.7, roughness: 1.6 }),
              phoneLayer(214, 112, 72),
              phoneLayer(234, 106, 73),
              phoneLayer(254, 100, 74),
              sk.rect(262, 112, 30, 50, { seed: 75, strokeWidth: 0.8, roughness: 1.4 }),
              sk.line(208, 186, 226, 196, { seed: 76, strokeWidth: 0.8 }),
              sk.line(228, 180, 246, 190, { seed: 77, strokeWidth: 0.8 }),
            ]}
          />
          <span className={s.tableLabel} aria-hidden="true">
            one phone,
            <br />
            seven owners
          </span>
          {subsystems.map((sub, i) => (
            <label
              key={sub.id}
              className={i < 4 ? `${s.seat} ${s.seatFar}` : s.seat}
              style={{ left: `${seatPos[i]?.left ?? 50}%`, top: `${seatPos[i]?.top ?? 50}%` }}
            >
              <input type="radio" name="d-seat" value={sub.id} defaultChecked={i === 0} className={s.seatInput} />
              <span className={s.seatChair} aria-hidden="true" />
              <span className={s.seatName}>{sub.title}</span>
            </label>
          ))}
        </fieldset>

        <div className={s.seatPanels}>
          {subsystems.map((sub, i) => (
            <article key={sub.id} className={s.seatPanel} data-seat={sub.id} aria-labelledby={`seat-${sub.id}`}>
              <p className={s.recordId}>
                Seat {i + 1} of {n}
              </p>
              <h3 id={`seat-${sub.id}`} className={s.h3}>
                {sub.title}
              </h3>
              <p className={s.recordObject}>{sub.description}</p>
              <ul className={s.youList}>
                {sub.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className={s.stepMono}>{sub.specLines.join(' · ')}</p>
              <div className={s.signoff}>
                <span className={s.signoffLabel}>Owner</span>
                <Blank label={`${sub.title} owner: open`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Join() {
  return (
    <section id="join" className={s.join} aria-labelledby="d-join-h">
      <div className={s.joinInner}>
        <div className={s.joinText}>
          <p className={s.eyebrowDark}>Come build</p>
          <h2 id="d-join-h" className={s.joinH}>
            {meeting.day}, {meeting.time}.
            <br />
            {meeting.room}.
          </h2>
          <ol className={s.joinSteps}>
            <li>
              <h3>Show up.</h3>
              <p>No project experience required. Free to join. Bring engineering, computer science, design, or business.</p>
            </li>
            <li>
              <h3>Sit in on a standup.</h3>
              <p>{meeting.rhythm} Watch how a handoff gets reviewed before you take one.</p>
            </li>
            <li>
              <h3>Take a seat.</h3>
              <p>Tell us which part you want. Someone walks you through what it needs next.</p>
            </li>
          </ol>
          <div className={s.joinActions}>
            <a href={links.join} className={s.buttonLight}>
              Tell us you&apos;re coming <ArrowRight size={20} aria-hidden />
            </a>
            <a href={links.discord} className={s.textLinkDark} rel="noopener noreferrer" target="_blank">
              <DiscordLogo size={20} aria-hidden /> Say hi on Discord first
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className={s.joinSide}>
          <Photo
            className={s.joinPhoto}
            src="/design-lab/d/d-room.webp"
            alt="[placeholder] Generated scene, not a DIGITAL photo: a lab classroom at dusk with tables pushed together, open laptops showing CAD models, calipers and a box of parts, chairs pulled out."
            caption={
              <>
                <Placeholder /> Generated room. Not {meeting.room}.
              </>
            }
          />
          <div className={s.sheet} aria-labelledby="d-sheet-h">
            <h3 id="d-sheet-h" className={s.sheetH}>
              Sign-up sheet · leadership, 2026–27
            </h3>
            <ul className={s.sheetList}>
              {openSeats.map((seat) => (
                <li key={seat.id}>
                  <span className={s.sheetRole}>{seat.role}</span>
                  <Blank label={`${seat.role}: open`} />
                  <span className={s.sheetOpen}>{seat.open ? 'open' : 'filled'}</span>
                </li>
              ))}
            </ul>
            <a href={links.leadership} className={s.textLinkDark}>
              Put your name down <ArrowRight size={18} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <p className={s.footerClose}>Put your name on one.</p>
        <div className={s.footerSign}>
          <Blank wide label="signature line" />
          <span className={s.signoffLabel}>Signed</span>
        </div>
        <div className={s.footerCols}>
          <ul>
            <li>
              <a href={dg001.href}>Modular Smartphone</a>
            </li>
            <li>
              <a href={dg002.href}>Smart Reading</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </li>
            <li>
              <a href={links.discord} rel="noopener noreferrer" target="_blank">
                Discord<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              {meeting.schedule} · {meeting.room}
            </li>
          </ul>
          <ul>
            <li>
              <a href="/privacy">Privacy</a>
            </li>
            <li>
              <a href="/terms">Terms</a>
            </li>
            <li className={s.muted}>Concept D · design lab prototype</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function ConceptDPage() {
  return (
    <div id={ROOT_ID} data-concept="d" className={s.root}>
      <a href="#d-content" className={s.skip}>
        Skip to content
      </a>
      <span id="top" />
      <SiteNav />
      <div id="d-content">
        <Hero />
        <Becoming />
        <Work />
        <HowABuildRuns />
        <Seats />
        <Join />
      </div>
      <SiteFooter />
      <DrawOn rootId={ROOT_ID} />
    </div>
  );
}
