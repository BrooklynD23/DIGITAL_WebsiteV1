'use client';

import { useState } from 'react';
import s from './b.module.css';

interface Subsystem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly specLines: readonly string[];
}

export interface Handoff {
  readonly ref: string;
  readonly part: string;
  readonly partners: readonly string[];
}

interface Props {
  readonly subsystems: readonly Subsystem[];
  /** Shared parts per subsystem, computed from the Fig. 1 interface map. */
  readonly handoffs: Readonly<Record<string, readonly Handoff[]>>;
  readonly stages: readonly string[];
  readonly rules: readonly string[];
  readonly labels: {
    readonly selectLabel: string;
    readonly ownerLabel: string;
    readonly ownerValue: string;
    readonly gateBeforeMerge: string;
    readonly gateBeforeRelease: string;
    readonly release: string;
  };
}

const splitSpec = (line: string) => {
  const i = line.indexOf(':');
  return i === -1 ? { k: '', v: line } : { k: line.slice(0, i).trim(), v: line.slice(i + 1).trim() };
};

/**
 * Traces one subsystem through plan → prototype → test → integrate and the four
 * ownership rules. The rail is generated from phoneV2 workflowStages + scopeItems.
 * Without JS it shows S1; the full register sits in DG-001 below.
 */
export function BuildRun({ subsystems, handoffs, stages, rules, labels }: Props) {
  const [activeId, setActiveId] = useState(subsystems[0]?.id ?? '');
  const idx = Math.max(0, subsystems.findIndex((x) => x.id === activeId));
  const sub = subsystems[idx];
  const specs = sub.specLines.map(splitSpec);
  const risk = specs.find((x) => x.k === 'risk')?.v ?? '';
  const mine = handoffs[sub.id] ?? [];

  return (
    <div className={s.run}>
      <div className={s.runTabs} role="group" aria-label={labels.selectLabel}>
        {subsystems.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={s.runTab}
            aria-pressed={x.id === activeId}
            onClick={() => setActiveId(x.id)}
          >
            <span className={s.runTabRef}>S{i + 1}</span>
            <span>{x.title}</span>
          </button>
        ))}
      </div>

      <p className={s.srOnly} aria-live="polite">
        {`S${idx + 1} ${sub.title} selected. Owner unassigned. ${mine.length} ${mine.length === 1 ? 'handoff' : 'handoffs'}.`}
      </p>
      <div className={s.runBody}>
        <div className={s.runDiagram}>
          <p className={s.ownerBar}>
            <span className={s.monoLabel}>{labels.ownerLabel}</span>
            <span>
              S{idx + 1} {sub.title} · <span className={s.unassigned}>{labels.ownerValue}</span>
            </span>
            <span className={s.ruleRef}>{rules[0]}</span>
          </p>
          <ol className={s.rail}>
            {stages.map((st, i) => (
              <li key={st} className={s.railStage}>
                <span className={s.railNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.railName}>{st}</span>
                {st === 'test' && risk && <span className={s.railNote}>checks: {risk}</span>}
                {st === 'integrate' &&
                  (mine.length > 0 ? (
                    mine.map((h) => (
                      <span key={h.ref} className={s.railNote}>
                        <span className={s.redText}>{h.ref}</span> {h.part.toLowerCase()} → review with {h.partners.join(', ')}
                      </span>
                    ))
                  ) : (
                    <span className={s.railNote}>no shared part in the model; review at the system test</span>
                  ))}
                {i === stages.length - 2 && (
                  <span className={s.gate}>
                    <span aria-hidden="true">G1</span>
                    <span className={s.srOnly}>{`${labels.gateBeforeMerge}: ${rules[2]}`}</span>
                  </span>
                )}
              </li>
            ))}
            <li className={`${s.railStage} ${s.railRelease}`}>
              <span className={s.gate}>
                <span aria-hidden="true">G2</span>
                <span className={s.srOnly}>{`${labels.gateBeforeRelease}: ${rules[3]}`}</span>
              </span>
              <span className={s.railNum}>→</span>
              <span className={s.railName}>{labels.release}</span>
            </li>
          </ol>
          <ul className={s.ruleList}>
            {rules.map((r, i) => (
              <li key={r}>
                <span className={s.ruleKey}>{['OWN', 'REV', 'G1', 'G2'][i] ?? `R${i + 1}`}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className={s.runPanel}>
          <p className={s.monoLabel}>S{idx + 1} · {sub.title}</p>
          <p className={s.runDesc}>{sub.description}</p>
          <ul className={s.runBullets}>
            {sub.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <dl className={s.kv}>
            {specs.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
