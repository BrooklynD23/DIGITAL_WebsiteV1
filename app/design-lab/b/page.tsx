import { IconArrowRight, IconArrowUpRight, IconBrandDiscord } from '@tabler/icons-react';
import { BuildRun } from './BuildRun';
import { copy, rsvp, signalStages, subsystems, workflowStages, ownershipRules } from './copy';
import { InterfaceMap } from './InterfaceMap';
import { MatrixGlyph, OpenGlyph, PulseGlyph } from './Glyphs';
import { ProjectIndex, StatusGlyph } from './ProjectIndex';
import { RsvpTiming } from './RsvpTiming';
import { SignalChain } from './SignalChain';
import { buildInterfaceMap, WIDE_MAP } from './schematic';
import s from './b.module.css';

const splitSpec = (line: string) => {
  const i = line.indexOf(':');
  return { k: line.slice(0, i).trim(), v: line.slice(i + 1).trim() };
};

export default function ConceptBPage() {
  const { nav, hero, index, dg001, dg002, vs, dg003, process, join, footer } = copy;
  const map = buildInterfaceMap(subsystems, WIDE_MAP);
  const handoffs = Object.fromEntries(
    subsystems.map((sub) => [
      sub.id,
      map.parts
        .filter((p) => p.handoff && p.owners.includes(sub.id))
        .map((p) => ({
          ref: p.handoff ?? '',
          part: p.label,
          partners: p.owners
            .filter((o) => o !== sub.id)
            .map((o) => {
              const n = map.subsystems.find((x) => x.id === o);
              return `${n?.ref ?? ''} ${subsystems.find((x) => x.id === o)?.title ?? ''}`;
            }),
        })),
    ]),
  );

  return (
    <div className={s.page}>
      {/* ───────── NAV ───────── */}
      <header className={s.nav}>
        <a href="#top" className={s.brand} aria-label="DIGITAL @ Cal Poly Pomona, top of page">
          <span className={s.brandMark} aria-hidden="true" />
          <span className={s.brandWord}>DIGITAL</span>
          <span className={s.brandSub}>@ CPP</span>
        </a>
        <nav aria-label="Concept B" className={s.navLinks}>
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className={s.navLink}>
              <span className={s.navCode}>{l.code}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <a href={nav.cta.href} className={`${s.btn} ${s.btnPrimary} ${s.navCta}`}>
          {nav.cta.label}
        </a>
        <details className={s.menu}>
          <summary className={s.menuSummary}>{nav.menuLabel}</summary>
          <nav aria-label="Concept B, mobile" className={s.menuPanel}>
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className={s.menuLink}>
                <span className={s.navCode}>{l.code}</span>
                {l.label}
              </a>
            ))}
            <a href={nav.cta.href} className={`${s.btn} ${s.btnPrimary}`}>
              {nav.cta.label}
            </a>
          </nav>
        </details>
      </header>

      {/* ───────── HERO ───────── */}
      <section id="top" className={s.hero} aria-labelledby="hero-title">
        <div className={s.heroText}>
          <p className={s.eyebrow}>{hero.eyebrow}</p>
          <h1 id="hero-title" className={s.display}>
            {hero.lines.map((line) => (
              <span key={line} className={s.displayLine}>
                {line}
              </span>
            ))}
          </h1>
          <p className={s.heroLede}>
            <strong>{hero.positioning}</strong> {hero.mechanism}
          </p>
          <div className={s.ctaRow}>
            <a href={hero.primary.href} className={`${s.btn} ${s.btnPrimary}`}>
              {hero.primary.label}
              <IconArrowRight size={20} stroke={1.5} aria-hidden="true" />
            </a>
            <a href={hero.secondary.href} className={s.textLink}>
              {hero.secondary.label}
            </a>
          </div>
          <dl className={s.heroMeta}>
            {hero.meta.map((m) => (
              <div key={m.k}>
                <dt>{m.k}</dt>
                <dd>{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className={s.figure}>
          <div className={s.figHead}>
            <span id="fig1-title">{hero.figure.title}</span>
            <span className={s.figCount}>
              {`${map.subsystems.length} subsystems · ${map.parts.length} parts · `}
              <span className={s.redText}>{`${map.handoffCount} handoffs`}</span>
            </span>
          </div>
          <div className={s.figBody}>
            <InterfaceMap subsystems={subsystems} titleId="fig1-title" />
          </div>
          <figcaption className={s.figCaption}>
            <span className={s.monoLabel}>{hero.figure.caption}</span>
            <span>{hero.figure.note}</span>
            <span className={s.figSource}>{hero.figure.source}</span>
          </figcaption>
        </figure>
      </section>

      {/* ───────── 01 WORK ───────── */}
      <section id="work" className={s.section} aria-labelledby="work-title">
        <SectionHead code={index.code} eyebrow={index.eyebrow} title={index.heading} id="work-title" lede={index.lede} />
        <ProjectIndex
          rows={index.rows}
          columns={index.columns}
          labels={index.statusLabels}
          filterLabel={index.filterLabel}
          glyphs={{
            'dg-001': <MatrixGlyph subsystems={subsystems} />,
            'dg-002': <PulseGlyph count={rsvp.words.length} />,
            'dg-003': <OpenGlyph />,
          }}
        />

        {/* DG-001 */}
        <article id="dg-001" className={s.record} aria-labelledby="dg001-title">
          <RecordStrip code={dg001.code} title={dg001.title} status="active" titleId="dg001-title" />
          <div className={s.recordGrid}>
            <div className={s.recordMain}>
              <p className={s.h2}>{dg001.heading}</p>
              <dl className={s.pod}>
                <div><dt>Problem</dt><dd>{dg001.problem}</dd></div>
                <div><dt>Object</dt><dd>{dg001.object}</dd></div>
              </dl>
              <a href={dg001.link.href} className={s.textLink}>
                {dg001.link.label}
                <IconArrowUpRight size={16} stroke={1.5} aria-hidden="true" />
              </a>
            </div>
            <dl className={s.fields}>
              {dg001.fields.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd className={f.v.includes('[') || f.v.includes('___') ? s.unverified : undefined}>{f.v}</dd>
                </div>
              ))}
            </dl>
            <Plate label={dg001.plate} />
          </div>
          <p className={s.registerCaption} aria-hidden="true">{dg001.tableCaption}</p>
          <div className={s.tableWrap}>
            <table className={s.register}>
              <caption className={s.srOnly}>{dg001.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Subsystem</th>
                  <th scope="col">Boundary</th>
                  <th scope="col">Scope</th>
                  <th scope="col">Risk</th>
                  <th scope="col">Owner</th>
                </tr>
              </thead>
              <tbody>
                {subsystems.map((sub, i) => {
                  const spec = sub.specLines.map(splitSpec);
                  const get = (k: string) => spec.find((x) => x.k === k)?.v ?? '';
                  return (
                    <tr key={sub.id} id={`sub-${sub.id}`}>
                      <td className={s.cellCode}>S{i + 1}</td>
                      <th scope="row">{sub.title}</th>
                      <td>{sub.description}</td>
                      <td className={s.cellMono}>{get('scope')}</td>
                      <td className={s.cellMono}>{get('risk')}</td>
                      <td className={`${s.cellMono} ${s.blank}`}>______</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        {/* DG-002 */}
        <article id="dg-002" className={s.record} aria-labelledby="dg002-title">
          <RecordStrip code={dg002.code} title={dg002.title} status="active" titleId="dg002-title" />
          <div className={s.recordGrid}>
            <div className={s.recordMain}>
              <p className={s.h2}>{dg002.heading}</p>
              <dl className={s.pod}>
                <div><dt>Problem</dt><dd>{dg002.problem}</dd></div>
                <div><dt>Object</dt><dd>{dg002.object}</dd></div>
              </dl>
              <a href={dg002.link.href} className={s.textLink}>
                {dg002.link.label}
                <IconArrowUpRight size={16} stroke={1.5} aria-hidden="true" />
              </a>
            </div>
            <dl className={s.fields}>
              {dg002.fields.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd className={f.v.includes('[') || f.v.includes('___') ? s.unverified : undefined}>{f.v}</dd>
                </div>
              ))}
            </dl>
            <Plate label={dg002.plate} />
          </div>
          <div className={s.figPair}>
            <figure className={s.figure}>
              <div className={s.figHead}>
                <span id="fig2-title">{dg002.chainTitle}</span>
              </div>
              <div className={s.figBody}>
                <SignalChain stages={signalStages} titleId="fig2-title" paceLabel={rsvp.paceLabel} />
              </div>
            </figure>
            <figure className={s.figure}>
              <div className={s.figHead}>
                <span id="fig3-title">{dg002.timingTitle}</span>
              </div>
              <div className={s.figBody}>
                <RsvpTiming words={rsvp.words} wpm={rsvp.wpm} titleId="fig3-title" />
              </div>
              <figcaption className={s.figCaption}>
                <span>{dg002.timingNote}</span>
              </figcaption>
            </figure>
          </div>
        </article>

        {/* VS + DG-003 */}
        <div className={s.recordPair}>
          <article id="vs" className={`${s.record} ${s.recordSmall}`} aria-labelledby="vs-title">
            <RecordStrip code={vs.code} title={vs.title} status="program" titleId="vs-title" />
            <div className={s.smallBody}>
              <p className={s.monoLabel}>{vs.kicker}</p>
              <p className={s.h3}>{vs.line}</p>
              <ul className={s.learn}>
                {vs.learn.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className={s.muted}>{vs.note}</p>
            </div>
          </article>
          <article id="dg-003" className={`${s.record} ${s.recordSmall} ${s.recordOpen}`} aria-labelledby="dg003-title">
            <RecordStrip code={dg003.code} title="Unsigned" status="open" titleId="dg003-title" />
            <div className={s.smallBody}>
              <p className={s.h3}>{dg003.heading}</p>
              <p className={s.body}>{dg003.body}</p>
              <dl className={s.blankFields}>
                <div><dt>Problem</dt><dd>______</dd></div>
                <div><dt>Built by</dt><dd>______</dd></div>
              </dl>
              <a href={dg003.cta.href} className={`${s.btn} ${s.btnOutline}`}>
                {dg003.cta.label}
                <IconArrowRight size={20} stroke={1.5} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ───────── 02 PROCESS ───────── */}
      <section id="process" className={s.section} aria-labelledby="process-title">
        <SectionHead code={process.code} eyebrow={process.eyebrow} title={process.heading} id="process-title" lede={process.lede} />
        <BuildRun subsystems={subsystems} handoffs={handoffs} stages={workflowStages} rules={ownershipRules} labels={process} />
      </section>

      {/* ───────── 03 JOIN ───────── */}
      <section id="join" className={s.section} aria-labelledby="join-title">
        <SectionHead code={join.code} eyebrow={join.eyebrow} title={join.heading} id="join-title" lede={join.lede} />
        <div className={s.joinGrid}>
          <div>
            <ol className={s.steps}>
              {join.steps.map((st) => (
                <li key={st.n} className={s.step}>
                  <span className={s.stepNum}>{st.n}</span>
                  <div>
                    <p className={s.h3}>{st.title}</p>
                    <p className={s.body}>{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.ctaRow}>
              <a href={join.primary.href} className={`${s.btn} ${s.btnPrimary}`}>
                {join.primary.label}
                <IconArrowRight size={20} stroke={1.5} aria-hidden="true" />
              </a>
              <a href={join.discord.href} className={s.textLink} rel="noopener noreferrer" target="_blank">
                <IconBrandDiscord size={20} stroke={1.5} aria-hidden="true" />
                {join.discord.label}
                <span className={s.srOnly}> (opens in a new tab)</span>
              </a>
            </div>
            <p className={s.muted}>{join.cost}.</p>
          </div>
          <div className={s.seats}>
            <p className={s.monoLabel}>{join.seatsHeading}</p>
            <p className={s.body}>{join.seatsNote}</p>
            <table className={s.seatTable}>
              <caption className={s.srOnly}>Open leadership seats</caption>
              <thead>
                <tr>
                  <th scope="col">Seat</th>
                  <th scope="col">Term</th>
                  <th scope="col">Signed</th>
                </tr>
              </thead>
              <tbody>
                {join.seats.map((seat) => (
                  <tr key={seat.id}>
                    <th scope="row">{seat.role}</th>
                    <td className={s.cellMono}>{seat.term}</td>
                    <td className={s.cellMono}>
                      <span className={s.openTag}>
                        <StatusGlyph status="open" />
                        open
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER / TITLE BLOCK ───────── */}
      <footer className={s.footer}>
        <p className={s.footerVision}>{footer.vision}</p>
        <dl className={s.titleBlock}>
          {footer.cells.map((c) => (
            <div key={c.k}>
              <dt>{c.k}</dt>
              <dd>{'href' in c && c.href ? <a href={c.href}>{c.v}</a> : c.v}</dd>
            </div>
          ))}
        </dl>
        <div className={s.footerBase}>
          <nav aria-label="Legal" className={s.legal}>
            {footer.legal.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <p>{footer.lab}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ code, eyebrow, title, id, lede }: { code: string; eyebrow: string; title: string; id: string; lede: string }) {
  return (
    <div className={s.sectionHead}>
      <p className={s.sectionCode} aria-hidden="true">
        {code}
      </p>
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 id={id} className={s.h1}>
          {title}
        </h2>
      </div>
      <p className={s.sectionLede}>{lede}</p>
    </div>
  );
}

function RecordStrip({ code, title, status, titleId }: { code: string; title: string; status: 'active' | 'program' | 'open'; titleId: string }) {
  const label = { active: 'Active', program: 'Program', open: 'Open' }[status];
  return (
    <header className={s.strip}>
      <span className={s.stripCode}>{code}</span>
      <h3 id={titleId} className={s.stripTitle}>
        {title}
      </h3>
      <span className={s.status} data-status={status}>
        <StatusGlyph status={status} />
        {label}
      </span>
    </header>
  );
}

function Plate({ label }: { label: string }) {
  return (
    <div className={s.plate} role="img" aria-label={label}>
      <span aria-hidden="true">{label}</span>
    </div>
  );
}
