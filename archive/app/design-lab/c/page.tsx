import { ArrowUpRight } from 'lucide-react';
import HeroFormation from './HeroFormation';
import RsvpReader from './RsvpReader';
import BuildStages from './BuildStages';
import FooterSignature from './FooterSignature';
import { POSTER_VIEWBOX, dotPath, glassesCloud, phoneCloud } from './geometry';
import styles from './c.module.css';
import {
  footer,
  join,
  links,
  meeting,
  ownershipRules,
  process,
  program,
  records,
  rsvp,
  subsystems,
  unsigned,
  work,
  workflowStages,
  type BuildRecord,
  type RecordField,
} from './content';

const ICON = { size: 18, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Join', href: '#join' },
] as const;

function FieldValue({ field }: { readonly field: RecordField }) {
  if (field.v === null) {
    return (
      <span className={styles.noSignal}>
        <span className={styles.noSignalTag}>No signal</span>
        <span className={styles.noSignalNote}>{field.note ?? 'not recorded yet'}</span>
      </span>
    );
  }
  if (typeof field.v === 'string') return <>{field.v}</>;
  return (
    <ul className={styles.inlineList}>
      {field.v.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

/** The build's own dot drawing (same geometry as the hero), in place of a stock plate. */
function DotPlate({ kind, caption }: { readonly kind: 'phone' | 'reading'; readonly caption: string }) {
  const d = kind === 'phone' ? dotPath(phoneCloud().positions, undefined, 4) : dotPath(glassesCloud().positions, undefined, 4);
  return (
    <figure className={styles.dotPlate}>
      <svg viewBox={POSTER_VIEWBOX} role="img" aria-label={caption} preserveAspectRatio="xMidYMid meet">
        <path d={d} />
      </svg>
      <figcaption>{caption} · build photo [placeholder]</figcaption>
    </figure>
  );
}

function SubsystemList() {
  return (
    <div className={styles.subsystems}>
      <p className={styles.blockLabel}>Take one apart · {subsystems.length} subsystems</p>
      {subsystems.map((s) => (
        <details key={s.id} className={styles.sub}>
          <summary>
            <span className={styles.subIdx}>{s.index}</span>
            <span className={styles.subTitle}>{s.title}</span>
            <span className={styles.subScope}>{s.scope}</span>
          </summary>
          <div className={styles.subBody}>
            <p>{s.description}</p>
            <ul>
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className={styles.subRisk}>Risk · {s.risk}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

function Record({ record, visual }: { readonly record: BuildRecord; readonly visual: React.ReactNode }) {
  const headId = `c-${record.id.toLowerCase()}`;
  return (
    <article className={styles.record} aria-labelledby={headId}>
      <header className={styles.recordHead}>
        <p className={styles.recordMeta}>
          <span className={styles.recordId}>{record.id}</span>
          <span>{record.kicker}</span>
        </p>
        <p className={styles.status}>
          <span className={styles.statusMark} aria-hidden />
          {record.status}
        </p>
        <h3 id={headId} className={styles.recordTitle}>
          {record.title}
        </h3>
        <p className={styles.recordPromise}>{record.promise}</p>
      </header>
      <div className={styles.recordBody}>
        <div className={styles.recordVisual}>{visual}</div>
        <div>
          <dl className={styles.fields}>
            {record.fields.map((f) => (
              <div key={f.k} className={styles.fieldRow}>
                <dt>{f.k}</dt>
                <dd>
                  <FieldValue field={f} />
                </dd>
              </div>
            ))}
          </dl>
          {record.href ? (
            <a className={styles.textLink} href={record.href}>
              Open the {record.id} build page
              <ArrowUpRight {...ICON} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function ConceptCPage() {
  const [phoneRecord, readingRecord] = records;
  return (
    <div className={styles.root} id="top">
      <header className={styles.nav}>
        <a className={styles.wordmark} href="#top" aria-label="DIGITAL at Cal Poly Pomona, back to top">
          <span>
            DIGI<span className={styles.kernT}>T</span>AL
          </span>
          <span className={styles.wordmarkSub}>@ Cal Poly Pomona</span>
        </a>
        <nav aria-label="Concept C" className={styles.navLinks}>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className={styles.navCta} href={links.projectTeam}>
          {join.cta}
        </a>
        <details className={styles.menu}>
          <summary>Menu</summary>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href={links.projectTeam}>{join.cta}</a>
            </li>
          </ul>
        </details>
      </header>

      <div className={styles.main}>
        <HeroFormation />

        <section id="work" className={styles.section} aria-labelledby="c-work-title">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{work.eyebrow}</p>
            <h2 id="c-work-title" className={styles.h2}>
              {work.title}
            </h2>
            <p className={styles.sectionSub}>{work.sub}</p>
          </div>

          <Record
            record={phoneRecord}
            visual={
              <>
                <DotPlate kind="phone" caption={`Drawn from the ${subsystems.length} subsystems`} />
                <SubsystemList />
              </>
            }
          />
          <Record
            record={readingRecord}
            visual={
              <>
                <p className={styles.blockLabel}>{work.rsvpLabel} · RSVP</p>
                <RsvpReader words={rsvp.words} defaultWpm={rsvp.wpm} />
                <DotPlate kind="reading" caption="Drawn from the frame, HUD window and FPGA module" />
              </>
            }
          />

          <div className={styles.rows}>
            <article className={styles.row} aria-labelledby="c-program">
              <p className={styles.rowId}>{program.id}</p>
              <div>
                <h3 id="c-program" className={styles.rowTitle}>
                  {program.title} <span className={styles.rowKicker}>{program.kicker}</span>
                </h3>
                <p className={styles.rowLine}>{program.line}</p>
              </div>
              <ul className={styles.rowList}>
                {program.learnings.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </article>
            <article className={`${styles.row} ${styles.rowOpen}`} aria-labelledby="c-unsigned">
              <p className={styles.rowId}>{unsigned.id}</p>
              <div>
                <h3 id="c-unsigned" className={styles.rowTitle}>
                  {unsigned.title}
                </h3>
                <p className={styles.rowLine}>{unsigned.line}</p>
              </div>
              <a className={styles.textLink} href={links.projectTeam}>
                {unsigned.cta}
                <ArrowUpRight {...ICON} aria-hidden />
              </a>
            </article>
          </div>
        </section>

        <section id="process" className={styles.section} aria-labelledby="c-process-title">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{process.eyebrow}</p>
            <h2 id="c-process-title" className={styles.h2}>
              {process.title}
            </h2>
            <p className={styles.sectionSub}>{process.sub}</p>
          </div>
          <BuildStages stages={workflowStages} />
          <ul className={styles.rules} aria-label="Ownership rules">
            {ownershipRules.map((r) => (
              <li key={r}>
                <span className={styles.ruleOne} aria-hidden>
                  1
                </span>
                <span>{r.replace(/^one /i, '')}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="join" className={styles.section} aria-labelledby="c-join-title">
          <div className={styles.joinGrid}>
            <div>
              <p className={styles.eyebrow}>{join.eyebrow}</p>
              <h2 id="c-join-title" className={styles.h2}>
                {join.title}
              </h2>
              <p className={styles.sectionSub}>{join.sub}</p>
              <p className={styles.joinAside}>{join.aside}</p>
            </div>
            <div>
              <ol className={styles.steps}>
                {join.steps.map((s) => (
                  <li key={s.n}>
                    <span className={styles.stepN}>{s.n}</span>
                    <div>
                      <h3 className={styles.stepTitle}>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.joinCtas}>
                <a className={styles.btnPrimary} href={links.projectTeam}>
                  {join.cta}
                  <ArrowUpRight {...ICON} aria-hidden />
                </a>
                <a className={styles.textLink} href={links.discord} rel="noopener noreferrer" target="_blank">
                  Discord · {links.discordLabel}
                  <ArrowUpRight {...ICON} aria-hidden />
                  <span className={styles.srOnly}>(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <FooterSignature
          blankTitle={footer.blankTitle}
          blankSub={footer.blankSub}
          signedTitle={footer.signedTitle}
          signedSub={footer.signedSub}
        />
        <div className={styles.footGrid}>
          <div>
            <p className={styles.footName}>
              DIGI<span className={styles.kernT}>T</span>AL @ Cal Poly Pomona
            </p>
            <p className={styles.footVision}>{footer.vision}</p>
          </div>
          <div className={styles.footCol}>
            <p className={styles.blockLabel}>Build night</p>
            <p>
              {meeting.schedule}
              <br />
              {meeting.location}, {meeting.campus}
            </p>
          </div>
          <div className={styles.footCol}>
            <p className={styles.blockLabel}>Reach</p>
            <p>
              <a href={`mailto:${links.email}`}>{links.email}</a>
              <br />
              <a href={links.discord} rel="noopener noreferrer" target="_blank">
                {links.discordLabel}
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <nav className={styles.footCol} aria-label="Legal">
            <p className={styles.blockLabel}>Legal</p>
            <ul>
              {footer.legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={styles.labNote}>{footer.labNote}</p>
      </footer>
    </div>
  );
}
