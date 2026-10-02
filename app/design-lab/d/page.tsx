import { ArrowDown, ArrowRight, ArrowUpRight, CalendarBlank, DiscordLogo, MapPin } from '@phosphor-icons/react/dist/ssr';
import { DrawOn } from './DrawOn';
import { Sketch, sk } from './sketch';
import { dg001, dg002, links, meeting, openSeats, ownership, subsystems, ventureStudies, workflow } from './content';
import s from './d.module.css';

const ROOT_ID = 'concept-d';

/* ---------- small pieces ---------- */

function Placeholder({ children }: { readonly children?: React.ReactNode }) {
  return <span className={s.ph}>[placeholder]{children ? <> {children}</> : null}</span>;
}

/** Hand-drawn blank: the signature line. v2: used 3 times, and the seat echo fills it. */
function Blank({ wide = false, label = 'blank, for your name' }: { readonly wide?: boolean; readonly label?: string }) {
  return (
    <span className={wide ? `${s.blank} ${s.blankWide}` : s.blank}>
      <span className="sr-only">{label}</span>
      <Sketch
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        nonScaling
        className={s.blankLine}
        drawables={[sk.line(2, 8, 198, 6, { roughness: 1.1, seed: wide ? 11 : 5, strokeWidth: 1.4 })]}
      />
    </span>
  );
}

/** The chosen seat, echoed anywhere on the page with CSS :has() (no JS). One span per seat; only the checked one shows. */
function SeatEcho({ render }: { readonly render: (sub: (typeof subsystems)[number]) => React.ReactNode }) {
  return (
    <>
      {subsystems.map((sub) => (
        <span key={sub.id} className={s.echo} data-echo={sub.id}>
          {render(sub)}
        </span>
      ))}
    </>
  );
}

/* ---------- pencil plates: each build drawn from its own data ---------- */

/** DG-001: the 7 real subsystems (phoneV2.ts) as an exploded ownership stack. A diagram, not hardware. */
function PhonePlate() {
  const W = 560;
  const H = 470;
  const cx = 180;
  const top = 50;
  const gap = 56;
  const slab = (y: number, seed: number) =>
    sk.path(`M${cx - 96},${y} L${cx + 6},${y - 24} L${cx + 104},${y} L${cx},${y + 24} Z`, {
      seed,
      strokeWidth: 1.4,
      roughness: 1,
    });
  const ys = subsystems.map((_, i) => top + i * gap);
  return (
    <figure className={s.plate}>
      <div className={s.plateArt} style={{ aspectRatio: `${W} / ${H}` }}>
        <Sketch
          viewBox={`0 0 ${W} ${H}`}
          className={s.plateSvg}
          drawables={[
            ...ys.map((y, i) => slab(y, 100 + i)),
            ...ys.map((y, i) => sk.line(cx + 108, y, 300, y, { seed: 120 + i, strokeWidth: 0.8, roughness: 0.8 })),
            ...ys.slice(0, -1).map((y, i) =>
              sk.curve(
                [
                  [cx - 100, y + 4],
                  [cx - 118, y + gap / 2],
                  [cx - 100, y + gap - 4],
                ],
                { seed: 140 + i, strokeWidth: 0.9 },
              ),
            ),
          ]}
        />
        <ol className={s.plateLabels}>
          {subsystems.map((sub, i) => (
            <li key={sub.id} style={{ top: `${((ys[i] ?? 0) / H) * 100}%`, left: `${(306 / W) * 100}%` }}>
              {sub.title}
            </li>
          ))}
        </ol>
        <p className={s.plateNote} style={{ left: '0%', top: `${((top + gap * 2.6) / H) * 100}%` }} aria-hidden="true">
          every
          <br />
          handoff
          <br />
          reviewed
        </p>
      </div>
      <figcaption className={s.plateCaption}>
        Pencil plate drawn from the build&apos;s own subsystem list: seven parts, one owner each. An ownership map, not
        a hardware stack.
      </figcaption>
    </figure>
  );
}

/** DG-002: the problem (saccades along a line) beside the method (one word at one fixed point). From glasses.ts. */
function ReadingPlate() {
  const W = 560;
  const H = 300;
  const lines = [70, 110, 150, 190];
  const words = (y: number, seed: number) => {
    const out = [];
    let x = 24;
    let k = 0;
    while (x < 236) {
      const w = 14 + ((seed * 7 + k * 13) % 22);
      out.push(sk.line(x, y, Math.min(x + w, 240), y, { seed: seed + k, strokeWidth: 2.4, roughness: 0.6 }));
      x += w + 9;
      k += 1;
    }
    return out;
  };
  const hops = [30, 74, 118, 160, 206];
  return (
    <figure className={s.plate}>
      <div className={s.plateArt} style={{ aspectRatio: `${W} / ${H}` }}>
        <Sketch
          viewBox={`0 0 ${W} ${H}`}
          className={s.plateSvg}
          drawables={[
            ...lines.flatMap((y, i) => words(y, 200 + i * 10)),
            ...hops.slice(0, -1).map((x, i) =>
              sk.curve(
                [
                  [x, 100],
                  [(x + (hops[i + 1] ?? x)) / 2, 84],
                  [hops[i + 1] ?? x, 100],
                ],
                { seed: 260 + i, strokeWidth: 1 },
              ),
            ),
            sk.curve(
              [
                [222, 128],
                [130, 136],
                [30, 140],
              ],
              { seed: 270, strokeWidth: 0.9, strokeLineDash: [4, 5] },
            ),
            sk.line(272, 30, 272, 270, { seed: 280, strokeWidth: 0.8, roughness: 1.6 }),
            sk.rect(330, 96, 200, 92, { seed: 290, strokeWidth: 1.5 }),
            // fixation marks: the point the eye never leaves
            sk.line(430, 100, 430, 114, { seed: 291, strokeWidth: 1.8 }),
            sk.line(430, 170, 430, 184, { seed: 292, strokeWidth: 1.8 }),
          ]}
        />
        <span className={s.plateWord} style={{ left: `${(430 / W) * 100}%`, top: `${(142 / H) * 100}%` }} aria-hidden="true">
          {dg002.word}
        </span>
        <p className={s.plateNote} style={{ left: '3%', top: '74%' }} aria-hidden="true">
          before: the eyes chase the line
        </p>
        <p className={s.plateNote} style={{ left: '55%', top: '80%' }} aria-hidden="true">
          after: one word, one point
        </p>
        <span className={s.plateMono} style={{ left: '59%', top: '18%' }} aria-hidden="true">
          RSVP, {dg002.wpm} wpm demo
        </span>
      </div>
      <figcaption className={s.plateCaption}>
        Pencil plate of the method: reading by saccades (left) versus RSVP, one word held at a fixed point (right).
        Drawn from the project&apos;s own description; not a prototype photo.
      </figcaption>
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
        <nav aria-label="Sections" className={s.navLinks}>
          <a href="#work">The work</a>
          <a href="#how">How a build runs</a>
          <a href="#seats">Seats</a>
        </nav>
        <details className={s.navIndex}>
          <summary>Contents</summary>
          <nav aria-label="Sections, compact" className={s.navCard}>
            <a href="#work">1. The work</a>
            <a href="#how">2. How a build runs</a>
            <a href="#seats">3. Seats</a>
            <a href="#join">4. Come Thursday</a>
          </nav>
        </details>
        <a href="#join" className={s.navCta}>
          <span className={s.ctaLong}>Come Thursday</span>
          <span className={s.ctaShort}>Thu 6 PM</span> <ArrowDown size={16} aria-hidden />
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
          Different majors, one product. You take one part of a real build, see it through testing, and sign it.
        </p>
        <div className={s.heroActions}>
          <a href="#join" className={s.button}>
            Come Thursday <ArrowDown size={20} aria-hidden />
          </a>
          <a href="#work" className={s.textLink}>
            See the two builds
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
        <figure className={`${s.print} ${s.proof}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimized webp ≤80 KB */}
          <img
            src="/design-lab/d/d-room.webp"
            alt="[placeholder] Generated scene, not a DIGITAL photo and not Building 17: an empty lab classroom at dusk, tables pushed together, laptops open, chairs pulled out."
            width={1400}
            height={939}
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className={s.printCaption}>
            <Placeholder /> Generated room, not Building 17. A build-night photo goes here.
          </figcaption>
        </figure>
        <div className={s.heroTagRow}>
          <div className={s.tag}>
            <span className={s.tagLabel}>Built by</span>
            <Blank label="Built by: blank, for your name" />
          </div>
          <p className={s.heroNote} aria-hidden="true">
            ← the empty chair is yours
          </p>
        </div>
      </div>
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
        <h2 id="d-work-h" className={s.h2}>
          Two builds on the bench.
          <br />
          Both need owners.
        </h2>
        <p className={s.sectionLead}>
          Each record says the problem, the thing being made, what it needs, and what isn&apos;t done yet.
        </p>
      </div>

      <article className={s.record} aria-labelledby="dg001-h">
        <div className={s.recordMedia}>
          <PhonePlate />
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
            <Field k="Owned in 7 parts">{dg001.parts.join(', ')}</Field>
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
          <p className={s.signoffNote}>Seven owner slots. Names are added at sign-off.</p>
          <a href={dg001.href} className={s.textLink}>
            Open the Modular Smartphone build <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </article>

      <article className={`${s.record} ${s.recordFlip}`} aria-labelledby="dg002-h">
        <div className={s.recordMedia}>
          <ReadingPlate />
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
            <Field k="Who it needs">{dg002.needs.join(', ')}</Field>
            <Field k="Built with">{dg002.tech.join(', ')}</Field>
            <Field k="Mentor">{dg002.mentor}</Field>
            <Field k="Duration">{dg002.cycle}</Field>
            <Field k="Outcome so far">
              <Placeholder>prototype state</Placeholder>
            </Field>
            <Field k="Cost">{dg002.cost}</Field>
          </dl>
          <p className={s.signoffNote}>Contributors are named at sign-off.</p>
          <a href={dg002.href} className={s.textLink}>
            Open Smart Reading <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </article>

      <div className={s.ledger}>
        <article className={s.ledgerRow} aria-labelledby="vs-h">
          <p className={s.recordId}>Program · {ventureStudies.kicker}</p>
          <h3 id="vs-h" className={s.h4}>
            {ventureStudies.title}
          </h3>
          <p>{ventureStudies.line}</p>
          <p className={s.muted}>
            You learn to{' '}
            {ventureStudies.learns.map((l) => l.charAt(0).toLowerCase() + l.slice(1)).join(', and ')}.
          </p>
        </article>
        <article className={`${s.ledgerRow} ${s.ledgerOpen}`} aria-labelledby="dg003-h">
          <p className={s.recordId}>DG-003 · unsigned</p>
          <h3 id="dg003-h" className={s.h4}>
            The next build isn&apos;t picked yet.
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

/** The ONE sequenced drawing: rail first, then each stop circled in order, ending on the red "Signed". */
function HowABuildRuns() {
  const steps = [
    { k: 'Thursday, 6 PM', line: 'You walk in. Subsystem standups first, workshop after.', mono: meeting.room },
    { k: 'Owner', line: 'You take a subsystem. It is yours, start to finish.', mono: ownership[0] },
    { k: 'Review', line: 'Someone reviews every handoff before it moves on.', mono: ownership[1] },
    { k: 'Test gate', line: 'Your part passes a test before it joins the phone.', mono: ownership[2] },
    { k: 'Repair plan', line: 'You write down how to fix it when it breaks.', mono: ownership[3] },
    { k: 'Signed', line: 'Then your name goes on it.', mono: 'owner named at sign-off' },
  ] as const;

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

  return (
    <section id="how" className={s.how} aria-labelledby="d-how-h">
      <div className={s.howHead}>
        <div className={s.sectionHead}>
          <h2 id="d-how-h" className={s.h2}>
            How a part gets
            <br />
            your name on it.
          </h2>
          <p className={s.sectionLead}>The smartphone build runs on four rules: {ownership.join('; ')}.</p>
        </div>
      </div>

      <div className={s.rail}>
        <Sketch
          still={false}
          viewBox={`0 0 ${RAIL_W} 80`}
          className={s.railH}
          drawables={[
            sk.curve(railPts, { seed: 31, roughness: 1.1, strokeWidth: 1.4 }),
            ...cx.map((x, i) =>
              sk.circle(x, 40, 40, {
                seed: 50 + i,
                strokeWidth: i === cx.length - 1 ? 2.2 : 1.5,
                fill: 'var(--d-paper-2)',
                fillStyle: 'solid',
              }),
            ),
          ]}
        />
        <Sketch
          still={false}
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
                {i + 1}
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

/** CSS-only seat picker. The chosen seat is echoed in Join, the CTA and the footer via :has(). */
function Seats() {
  const n = subsystems.length;
  const SEAT_POS = [
    { left: 20, top: 13 },
    { left: 40, top: 13 },
    { left: 60, top: 13 },
    { left: 80, top: 13 },
    { left: 30, top: 87 },
    { left: 50, top: 87 },
    { left: 70, top: 87 },
  ] as const;
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
          You arrive with a major.
          <br />
          You leave owning a part.
        </h2>
        <p className={s.sectionLead}>
          Seven subsystems, seven seats. Pick the one you&apos;d take, and the rest of the page follows your pick.
          Products need more than programmers.
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
              style={{ left: `${SEAT_POS[i]?.left ?? 50}%`, top: `${SEAT_POS[i]?.top ?? 50}%` }}
            >
              <input
                type="radio"
                name="d-seat"
                value={sub.id}
                defaultChecked={i === 0}
                className={s.seatInput}
                aria-describedby={`seat-desc-${sub.id}`}
              />
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
              <div id={`seat-desc-${sub.id}`}>
                <p className={s.leaveAs}>You leave as the person who {sub.leaveAs}.</p>
                <p className={s.recordObject}>{sub.description}</p>
                <ul className={s.youList}>
                  {sub.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <p className={s.stepMono}>{sub.specLines.join(' / ')}</p>
              <div className={s.signoff}>
                <span className={s.signoffLabel}>Owner</span>
                <Blank label={`${sub.title} owner: open`} />
              </div>
            </article>
          ))}
        </div>
      </div>
      <p className={s.footnote}>
        &ldquo;You leave as&rdquo; lines paraphrase each subsystem&apos;s own notes. Any major can take any seat.
      </p>
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
            <span className={s.nowrap}>{meeting.day}, 6:00&nbsp;PM.</span>{' '}
            <span className={s.nowrap}>Building&nbsp;17, Room&nbsp;1635.</span>
          </h2>
          <ol className={s.joinSteps}>
            <li>
              <h3>Show up.</h3>
              <p>No project experience required. Free to join. Bring engineering, computer science, design, or business.</p>
            </li>
            <li>
              <h3>Sit in on a standup.</h3>
              <p>{meeting.rhythm}</p>
            </li>
            <li>
              <h3>
                Take the <SeatEcho render={(sub) => sub.title} />
                <span className={s.echoFallback}>one you picked</span> seat.
              </h3>
              <p>Tell us which part you want. Someone walks you through what it needs next.</p>
            </li>
          </ol>
          <div className={s.joinActions}>
            <SeatEcho
              render={(sub) => (
                <a href={`${links.projectTeam}&seat=${sub.id}`} className={s.buttonLight}>
                  Take the {sub.title} seat <ArrowRight size={20} aria-hidden />
                </a>
              )}
            />
            <a href={links.projectTeam} className={`${s.buttonLight} ${s.echoFallback}`}>
              Take a seat <ArrowRight size={20} aria-hidden />
            </a>
            <a href={links.discord} className={s.textLinkDark} rel="noopener noreferrer" target="_blank">
              <DiscordLogo size={20} aria-hidden /> Say hi on Discord first
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className={s.joinSmall}>
            Not sure yet? <a href={links.join}>Ask a question instead</a>.
          </p>
        </div>

        <section className={s.sheet} aria-labelledby="d-sheet-h">
          <h3 id="d-sheet-h" className={s.sheetH}>
            Sign-up sheet: leadership, {openSeats[0]?.term ?? ''}
          </h3>
          <ul className={s.sheetList}>
            {openSeats.map((seat) => (
              <li key={seat.id}>
                <span className={s.sheetRole}>
                  {seat.role}
                  {seat.project ? <span className={s.sheetProject}>{seat.project}</span> : null}
                </span>
                <span className={s.sheetOpen}>{seat.open ? 'open' : 'filled'}</span>
              </li>
            ))}
          </ul>
          <a href={links.leadership} className={s.textLinkSheet}>
            Put your name down <ArrowRight size={18} aria-hidden />
          </a>
        </section>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <p className={s.footerClose}>
          <SeatEcho render={(sub) => <>Put your name on {sub.title}.</>} />
          <span className={s.echoFallback}>Put your name on one.</span>
        </p>
        <div className={s.footerSign}>
          <Blank wide label="signature line" />
          <span className={s.signoffLabel}>
            <SeatEcho render={(sub) => <>Owner, {sub.title}</>} />
            <span className={s.echoFallback}>Signed</span>
          </span>
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
