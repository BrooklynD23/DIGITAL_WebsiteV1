import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import styles from './a.module.css';
import VerticalCutReveal from './fancy/vertical-cut-reveal';
import TextHighlighter from './fancy/text-highlighter';
import MediaBetweenText from './fancy/media-between-text';
import RsvpPlate from './RsvpPlate';
import { FigSubsystems, PhoneGlyph, PhotoPlate, WordGlyph } from './Figures';
import {
  colophon,
  credits,
  fit,
  hero,
  join,
  ledger,
  masthead,
  ownershipRules,
  rules,
  subsystems,
  work,
  workflowStages,
} from './content';

const ICON = { size: 20, weight: 'light' as const, 'aria-hidden': true };

function ChapterHead({ n, title, lede, id }: { n: string; title: string; lede: string; id: string }) {
  return (
    <header className={styles.chapterHead}>
      <p className={styles.chapterMeta}>
        <span className={styles.chapterNo}>{n}</span>
        <span className={styles.chapterRule} aria-hidden="true" />
        <span>{title}</span>
      </p>
      <h2 id={id} className={styles.chapterLede}>
        <VerticalCutReveal trigger="inView" staggerDuration={0.06}>
          {lede}
        </VerticalCutReveal>
      </h2>
    </header>
  );
}

function Record({ rows, title }: { rows: readonly { k: string; v: string }[]; title: string }) {
  return (
    <aside className={styles.record} aria-label={`${title} build record`}>
      <p className={styles.recordHead}>Build record</p>
      <dl className={styles.recordList}>
        {rows.map((r) => (
          <div key={r.k} className={styles.recordRow}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
        <div className={`${styles.recordRow} ${styles.recordSign}`}>
          <dt>Built by</dt>
          <dd>
            <span className={styles.signLine}>
              <span className={styles.srOnly}>Blank. No names confirmed yet.</span>
            </span>
          </dd>
        </div>
      </dl>
    </aside>
  );
}

function splitRule(rule: string): { lead: string; mark: string; tail: string } {
  const m = /^one (.+?) (per|before) (.+)$/i.exec(rule);
  if (!m) return { lead: rule, mark: '', tail: '' };
  return { lead: 'One ', mark: m[1], tail: ` ${m[2]} ${m[3]}.` };
}

export default function ConceptAPage() {
  const { phone, reading } = work;
  return (
    <div className={styles.page}>
      {/* ───────────── Masthead ───────────── */}
      <header className={styles.masthead}>
        <a href="#top" className={styles.wordmark} aria-label="DIGITAL, top of page">
          {masthead.wordmark}
          <span className={styles.wordmarkSub}>@ {masthead.campus}</span>
        </a>
        <p className={styles.mastMeta}>{masthead.meeting}</p>
        <nav aria-label="Concept A" className={styles.mastNav}>
          <ul>
            {masthead.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href={masthead.cta.href} className={styles.mastCta}>
            {masthead.cta.label}
            <ArrowRight {...ICON} size={16} />
          </a>
        </nav>
      </header>

      <div id="top">
        {/* ───────────── Cover ───────────── */}
        <section className={styles.cover} aria-labelledby="thesis">
          <p className={styles.kicker}>{hero.kicker}</p>
          <h1 id="thesis" className={styles.thesis}>
            <span className={styles.srOnly}>{hero.thesis}</span>
            <span aria-hidden="true" className={styles.thesisLines}>
              <span className={styles.line1}>
                <VerticalCutReveal staggerDuration={0.08}>Make something</VerticalCutReveal>
              </span>
              <span className={styles.line2}>
                <VerticalCutReveal delay={0.16} staggerDuration={0.08}>worth</VerticalCutReveal>
                <sup className={styles.fnMark}>1</sup>{' '}
                <VerticalCutReveal delay={0.24} staggerDuration={0.08}>putting</VerticalCutReveal>
              </span>
              <span className={styles.line3}>
                <VerticalCutReveal delay={0.32}>your</VerticalCutReveal>{' '}
                <span className={styles.signName}>
                  <span className={styles.signX}>×</span>
                  <VerticalCutReveal delay={0.4}>name</VerticalCutReveal>
                  <span className={styles.signRule} />
                </span>{' '}
                <VerticalCutReveal delay={0.48}>on.</VerticalCutReveal>
              </span>
            </span>
          </h1>

          <div className={styles.coverBand}>
            <div className={styles.coverText}>
              <p className={styles.footnote} id="fn-worth">
                <span className={styles.fnNum}>1</span> {hero.footnote}
              </p>
              <p className={styles.dek}>{hero.dek}</p>
              <a href="#work" className={styles.textLink}>
                See the work <ArrowRight {...ICON} size={16} />
              </a>
            </div>
            <div className={styles.coverFig}>
              <FigSubsystems items={subsystems} />
            </div>
            <nav aria-label="In this edition" className={styles.contents}>
              <p className={styles.contentsHead}>In this edition</p>
              <ol>
                {hero.contents.map((c) => (
                  <li key={c.n}>
                    <a href={c.href}>
                      <span className={styles.contentsNo}>{c.n}</span>
                      <span className={styles.contentsLabel}>{c.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        {/* ───────────── 01 The work ───────────── */}
        <section id="work" className={styles.chapter} aria-labelledby="work-title">
          <ChapterHead n={work.chapter} title={work.title} lede={work.lede} id="work-title" />

          <nav aria-label="Builds in this edition">
            <ol className={styles.ledger}>
              {ledger.map((row) => (
                <li key={row.id}>
                  <a href={row.anchor} className={styles.ledgerRow}>
                    <span className={styles.ledgerId}>{row.id}</span>
                    <span className={styles.ledgerTitle}>{row.title}</span>
                    <span className={styles.ledgerProblem}>{row.problem}</span>
                    <span className={styles.ledgerStatus}>
                      <span className={row.status === 'Open' ? styles.dotOpen : styles.dot} aria-hidden="true" />
                      {row.status}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* DG-001 */}
          <article id="dg-001" className={styles.feature} aria-labelledby="dg001-title">
            <div className={styles.featHead}>
              <p className={styles.featKicker}>
                <span className={styles.featId}>{phone.id}</span> {phone.kicker}
              </p>
              <h3 id="dg001-title" className={styles.featTitle}>
                {phone.title}
              </h3>
              <MediaBetweenText
                firstText={phone.splitFirst}
                secondText={phone.splitSecond}
                media={<PhoneGlyph />}
                className={styles.featSplit}
                mediaClassName={styles.featSplitMedia}
              />
            </div>
            <div className={styles.featGrid}>
              <div className={styles.featBody}>
                <p className={styles.dropcap}>{phone.body[0]}</p>
                <p>{phone.body[1]}</p>
                <ol className={styles.partsList}>
                  {subsystems.map((s) => (
                    <li key={s.id}>
                      <span className={styles.partsNo}>{s.n}</span>
                      <span className={styles.partsTitle}>{s.title}</span>
                      <span className={styles.partsDesc}>{s.description}</span>
                    </li>
                  ))}
                </ol>
                <a href={phone.href} className={styles.textLink}>
                  Open the DG-001 build <ArrowRight {...ICON} size={16} />
                </a>
              </div>
              <Record rows={phone.record} title={phone.title} />
            </div>
            <figure className={styles.plateFig}>
              <PhotoPlate label={phone.plate} ratio="3 / 1" />
              <figcaption className={styles.caption}>
                <span className={styles.figNo}>Fig. 2</span> Reserved for a real bench photo of DG-001. No photo
                exists yet.
              </figcaption>
            </figure>
          </article>

          {/* DG-002 */}
          <article id="dg-002" className={`${styles.feature} ${styles.featureMirror}`} aria-labelledby="dg002-title">
            <div className={styles.featHead}>
              <p className={styles.featKicker}>
                <span className={styles.featId}>{reading.id}</span> {reading.kicker}
              </p>
              <h3 id="dg002-title" className={styles.featTitle}>
                {reading.title}
              </h3>
              <MediaBetweenText
                firstText={reading.splitFirst}
                secondText={reading.splitSecond}
                media={<WordGlyph />}
                className={styles.featSplit}
                mediaClassName={styles.featSplitMedia}
              />
            </div>
            <div className={styles.featGrid}>
              <div className={styles.featBody}>
                <p className={styles.dropcap}>{reading.body[0]}</p>
                <p>{reading.body[1]}</p>
                <p>{reading.body[2]}</p>
                <RsvpPlate words={reading.words} demoWpm={reading.demoWpm} />
                <a href={reading.href} className={styles.textLink}>
                  Open the DG-002 build <ArrowRight {...ICON} size={16} />
                </a>
              </div>
              <Record rows={reading.record} title={reading.title} />
            </div>
          </article>

          {/* Also on the bench */}
          <div className={styles.alsoGrid}>
            <article className={styles.also} aria-labelledby="venture-title">
              <p className={styles.featKicker}>Program · {work.venture.kicker}</p>
              <h3 id="venture-title" className={styles.alsoTitle}>
                {work.venture.title}
              </h3>
              <p className={styles.alsoLine}>{work.venture.line}</p>
              <ul className={styles.alsoList}>
                {work.venture.learns.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </article>
            <article id="dg-003" className={`${styles.also} ${styles.alsoOpen}`} aria-labelledby="dg003-title">
              <p className={styles.featKicker}>
                <span className={styles.featId}>{work.open.id}</span> Unsigned
              </p>
              <h3 id="dg003-title" className={styles.alsoTitle}>
                {work.open.title}
              </h3>
              <p className={styles.alsoLine}>{work.open.line}</p>
              <a href={work.open.href} className={styles.textLink}>
                {work.open.cta} <ArrowRight {...ICON} size={16} />
              </a>
            </article>
          </div>
        </section>

        {/* ───────────── 02 How a build runs ───────────── */}
        <section id="rules" className={`${styles.chapter} ${styles.rulesChapter}`} aria-labelledby="rules-title">
          <ChapterHead n={rules.chapter} title={rules.title} lede={rules.lede} id="rules-title" />
          <ol className={styles.rules}>
            {ownershipRules.map((rule, i) => {
              const { lead, mark, tail } = splitRule(rule);
              return (
                <li key={rule} className={styles.rule}>
                  <span className={styles.ruleNo} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={styles.ruleText}>
                    {lead}
                    <TextHighlighter delay={0.1} mark="band">
                      {mark}
                    </TextHighlighter>
                    {tail}
                  </p>
                  <p className={styles.ruleGloss}>{rules.glosses[i]}</p>
                </li>
              );
            })}
          </ol>
          <p className={styles.rail} aria-label={`Workflow: ${workflowStages.join(', then ')}`}>
            {workflowStages.map((s, i) => (
              <span key={s} className={styles.railStage} aria-hidden="true">
                <span className={styles.railNo}>{i + 1}</span>
                {s}
              </span>
            ))}
          </p>
        </section>

        {/* ───────────── 03 Where you fit ───────────── */}
        <section id="fit" className={styles.chapter} aria-labelledby="fit-title">
          <ChapterHead n={fit.chapter} title={fit.title} lede={fit.lede} id="fit-title" />
          <div className={styles.fitGrid}>
            {fit.columns.map((col) => (
              <div key={col.head} className={styles.fitCol}>
                <h3 className={styles.fitHead}>{col.head}</h3>
                <ul>
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className={styles.fitNote}>{fit.note}</p>
        </section>

        {/* ───────────── 04 Credits ───────────── */}
        <section id="credits" className={styles.chapter} aria-labelledby="credits-title">
          <ChapterHead n={credits.chapter} title={credits.title} lede={credits.lede} id="credits-title" />
          <p className={styles.creditsLine}>{credits.line}</p>
          <ul className={styles.credits}>
            {credits.seats.map((seat) => (
              <li key={seat.id} className={styles.creditRow}>
                <span className={styles.creditRole}>{seat.role}</span>
                <span className={styles.creditLeader} aria-hidden="true" />
                <span className={styles.signLine}>
                  <span className={styles.srOnly}>Open seat, no name yet.</span>
                </span>
              </li>
            ))}
          </ul>
          <a href={credits.cta.href} className={styles.textLink}>
            {credits.cta.label} <ArrowRight {...ICON} size={16} />
          </a>
        </section>

        {/* ───────────── 05 Thursday / Join ───────────── */}
        <section id="join" className={`${styles.chapter} ${styles.join}`} aria-labelledby="join-title">
          <p className={styles.chapterMeta}>
            <span className={styles.chapterNo}>{join.chapter}</span>
            <span className={styles.chapterRule} aria-hidden="true" />
            <span>{join.title}</span>
          </p>
          <h2 id="join-title" className={styles.joinWhen}>
            <span>{join.day}</span> <span className={styles.joinTime}>{join.time}</span>
          </h2>
          <div className={styles.joinGrid}>
            <div>
              <p className={styles.joinPlace}>{join.place}</p>
              <p className={styles.joinDesc}>{join.description}</p>
            </div>
            <ol className={styles.steps}>
              {join.steps.map((s) => (
                <li key={s.n}>
                  <span className={styles.stepNo}>{s.n}</span>
                  {s.text}
                </li>
              ))}
            </ol>
          </div>
          <p className={styles.joinClose}>{join.close}</p>
          <div className={styles.joinActions}>
            <a href={join.primary.href} className={styles.primaryCta}>
              {join.primary.label} <ArrowRight {...ICON} />
            </a>
            <a href={join.discord.href} className={styles.textLink} rel="noopener noreferrer" target="_blank">
              {join.discord.label} <ArrowUpRight {...ICON} size={16} />
              <span className={styles.srOnly}> (opens in a new tab)</span>
            </a>
          </div>
        </section>
      </div>

      {/* ───────────── Colophon ───────────── */}
      <footer className={styles.colophon}>
        <p className={styles.colophonMark}>{masthead.wordmark}</p>
        <div className={styles.colophonGrid}>
          <div>
            <p className={styles.colophonHead}>Colophon</p>
            <p>{colophon.name}</p>
            <p>{colophon.meeting}</p>
          </div>
          <div>
            <p className={styles.colophonHead}>Write</p>
            <p>
              <a href={`mailto:${colophon.email}`}>{colophon.email}</a>
            </p>
            <p>
              <a href={colophon.discord} rel="noopener noreferrer" target="_blank">
                Discord<span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <div>
            <p className={styles.colophonHead}>Print</p>
            <p>{colophon.setIn}</p>
            <p>{colophon.disclaimer}</p>
          </div>
          <ul className={styles.colophonLegal}>
            {colophon.legal.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
