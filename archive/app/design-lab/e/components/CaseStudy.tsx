import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { FactRow } from '../content';
import { Assignee, OpenChip } from './Chips';
import s from '../e.module.css';

export interface AssigneeRow {
  readonly role: string;
  readonly name?: string;
}

export interface CaseStudyProps {
  readonly anchor: string;
  readonly code: string;
  readonly title: string;
  readonly headline: string;
  readonly line: string;
  readonly facts: readonly FactRow[];
  readonly problem: ReactNode;
  readonly approach: ReactNode;
  readonly artifact: ReactNode;
  readonly team: ReactNode;
  readonly outcome: ReactNode;
  readonly assignees: readonly AssigneeRow[];
  readonly next: ReactNode;
  readonly route: string;
}

function FactValue({ row }: { readonly row: FactRow }) {
  if (row.state === 'open') return <OpenChip href={row.href}>{row.v}</OpenChip>;
  if (row.state === 'pending') return <span className={s.pendingText}>{row.v}</span>;
  return <>{row.v}</>;
}

/**
 * §41 case-study template = a ledger entry, expanded. Same anatomy for every build:
 * strip → headline → artifact → narrative (problem, approach, team, outcome, assignees, next) | fact sheet.
 * Blanks are typed: Open (an invitation) or Pending (an honest gap). No bracketed placeholders.
 */
export function CaseStudy(p: CaseStudyProps) {
  const headingId = `${p.anchor}-heading`;
  const block = (label: string, body: ReactNode) => {
    const id = `${p.anchor}-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
    return (
      <div className={s.block}>
        <h4 id={id} className={s.blockLabel}>
          {label}
        </h4>
        {body}
      </div>
    );
  };
  return (
    <article id={p.anchor} className={s.case} aria-labelledby={headingId}>
      <div className={s.caseStrip}>
        <span className={s.mono} translate="no">
          {p.code}
        </span>
        <span className={s.status} data-kind="active">
          Active
        </span>
        <a href={p.route} className={s.linkBlock} style={{ marginLeft: 'auto' }}>
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
            <span style={{ color: 'var(--muted)' }} translate="no">
              {p.code}
            </span>
          </div>
          <dl className={s.factsList}>
            {p.facts.map((f) => (
              <div key={f.k} className={s.factRow}>
                <dt>{f.k}</dt>
                <dd>
                  <FactValue row={f} />
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className={s.narrative}>
          {block('Problem', p.problem)}
          {block('Approach', p.approach)}
          {block('Team', p.team)}
          {block('Outcome', p.outcome)}
          {block(
            'Assignees',
            <dl className={s.assignees}>
              {p.assignees.map((a) => (
                <div key={a.role} className={s.assigneeRow}>
                  <dt>{a.role}</dt>
                  <dd>
                    <Assignee name={a.name} />
                  </dd>
                </div>
              ))}
            </dl>,
          )}
          {block("What's next", p.next)}
        </div>
      </div>
    </article>
  );
}
