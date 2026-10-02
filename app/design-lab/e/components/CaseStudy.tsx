import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { FactRow } from '../content';
import s from '../e.module.css';

export interface OutcomeSlot {
  readonly value: ReactNode;
  readonly label: string;
  readonly note: string;
}

export interface SignCell {
  readonly role: string;
  readonly name?: string;
}

export interface CaseStudyProps {
  readonly anchor: string;
  readonly code: string;
  readonly title: string;
  readonly headline: string;
  readonly line: string;
  readonly statusLabel: string;
  readonly facts: readonly FactRow[];
  readonly problem: ReactNode;
  readonly approach: ReactNode;
  readonly artifact: ReactNode;
  readonly team: ReactNode;
  readonly outcomes: readonly OutcomeSlot[];
  readonly signoff: readonly SignCell[];
  readonly next: ReactNode;
  readonly plateLabel: string;
  readonly route: string;
}

/**
 * §41 case-study template. Every build gets the same anatomy, in the same order:
 * strip → headline → artifact (full width) → fact sheet | problem → approach → team → outcome → sign-off → next.
 * Empty fields stay visible and labelled; nothing is filled with an invented value.
 */
export function CaseStudy(p: CaseStudyProps) {
  const headingId = `${p.anchor}-heading`;
  return (
    <article id={p.anchor} className={s.case} aria-labelledby={headingId}>
      <div className={s.caseStrip}>
        <span className={s.mono}>{p.code}</span>
        <span className={s.mono}>Case study</span>
        <span className={s.status} data-kind="active">
          {p.statusLabel}
        </span>
        <span className={s.mono}>Outcome: not shipped</span>
        <a href={p.route} className={s.textLink} style={{ marginLeft: 'auto', minHeight: 0 }}>
          Current project page <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>

      <div className={s.caseTop}>
        <div style={{ display: 'grid', gap: 12 }}>
          <p className={s.eyebrow}>
            <b>{p.title}</b>
          </p>
          <h3 id={headingId} className={s.h2} tabIndex={-1} data-case-heading>
            {p.headline}
          </h3>
        </div>
        <p className={s.lead}>{p.line}</p>
      </div>

      <div className={s.caseArtifact}>{p.artifact}</div>

      <div className={s.caseGrid}>
        <aside className={s.facts} aria-label={`${p.code} fact sheet`}>
          <div className={s.factsHead}>
            <span>Fact sheet</span>
            <span style={{ color: 'var(--muted)' }}>{p.code}</span>
          </div>
          <dl className={s.factsList}>
            {p.facts.map((f) => (
              <div key={f.k} className={s.factRow} data-ph={f.placeholder ? 'true' : 'false'}>
                <dt>{f.k}</dt>
                <dd>{f.placeholder ? <span className={s.ph}>{f.v}</span> : f.v}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className={s.narrative}>
          <section className={s.block} aria-label="Problem">
            <h4 className={s.blockLabel}>Problem</h4>
            {p.problem}
          </section>
          <section className={s.block} aria-label="Approach">
            <h4 className={s.blockLabel}>Approach</h4>
            {p.approach}
          </section>
          <section className={s.block} aria-label="Team">
            <h4 className={s.blockLabel}>Team</h4>
            {p.team}
          </section>
          <section className={s.block} aria-label="Outcome">
            <h4 className={s.blockLabel}>Outcome</h4>
            <p className={s.body}>
              Not shipped yet. These slots fill when a test log backs them; until then they stay empty on purpose.
            </p>
            <div className={s.slots}>
              {p.outcomes.map((o) => (
                <div key={o.label} className={s.slot}>
                  <span className={s.slotNum}>{o.value}</span>
                  <span className={s.slotLabel}>{o.label}</span>
                  <span className={s.slotNote}>{o.note}</span>
                </div>
              ))}
            </div>
            <div className={s.plate}>
              <span className={s.plateLabel}>{p.plateLabel}</span>
            </div>
          </section>
          <section className={s.block} aria-label="Sign-off">
            <h4 className={s.blockLabel}>Sign-off</h4>
            <dl className={s.signoff} style={{ margin: 0 }}>
              {p.signoff.map((c) => (
                <div key={c.role} className={s.signCell}>
                  <dt>{c.role}</dt>
                  <dd>{c.name ? <span style={{ color: 'var(--fg)' }}>{c.name}</span> : <span>[unsigned]</span>}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={s.block} aria-label="What is next">
            <h4 className={s.blockLabel}>What&apos;s next</h4>
            {p.next}
          </section>
        </div>
      </div>
    </article>
  );
}
