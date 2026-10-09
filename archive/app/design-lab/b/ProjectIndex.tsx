'use client';

import { useState, type ReactNode } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import type { BuildStatus, IndexRow } from './copy';
import s from './b.module.css';

interface Props {
  readonly rows: readonly IndexRow[];
  readonly columns: readonly string[];
  readonly labels: Readonly<Record<BuildStatus, string>>;
  readonly filterLabel: string;
  readonly glyphs?: Readonly<Record<string, ReactNode>>;
}

type Filter = 'all' | BuildStatus;

/** Status-driven index. Rows sort by status; filters only hide rows (all rows render without JS). */
export function ProjectIndex({ rows, columns, labels, filterLabel, glyphs = {} }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const order: readonly BuildStatus[] = ['active', 'program', 'open'];
  const count = (f: Filter) => (f === 'all' ? rows.length : rows.filter((r) => r.status === f).length);
  const filters: readonly Filter[] = ['all', ...order];
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div>
      <div className={s.filters} role="group" aria-label={filterLabel}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={s.filter}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f !== 'all' && <StatusGlyph status={f} />}
            <span>{f === 'all' ? 'All' : labels[f]}</span>
            <span className={s.filterCount}>{count(f)}</span>
          </button>
        ))}
        <p className={s.srOnly} aria-live="polite">{`${shown.length} of ${rows.length} rows shown`}</p>
      </div>

      <table className={s.ledger}>
        <caption className={s.srOnly}>Build index, sorted by status</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id} data-status={r.status}>
              <td className={s.cellCode}>
                {r.code}
                {glyphs[r.id] && <span className={s.sigWrap}>{glyphs[r.id]}</span>}
              </td>
              <th scope="row" className={s.cellTitle}>
                <a href={r.href} className={s.rowLink}>
                  {r.title}
                  <IconArrowDown size={16} stroke={1.5} aria-hidden="true" />
                </a>
              </th>
              <td className={s.cellProblem}>{r.problem}</td>
              <td className={s.cellMeta} data-label="Needs">{r.needs}</td>
              <td className={s.cellMeta} data-label="Cycle">{r.cycle}</td>
              <td className={s.cellStatus}>
                <span className={s.status} data-status={r.status}>
                  <StatusGlyph status={r.status} />
                  {labels[r.status]}
                </span>
                <span className={s.statusNote}>{r.statusNote}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Square status glyphs: filled = active, half = program, dashed red = needs a person. */
export function StatusGlyph({ status }: { readonly status: BuildStatus }) {
  return (
    <svg className={s.glyph} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      {status === 'active' && <rect x="1" y="1" width="10" height="10" className={s.glyphFill} />}
      {status === 'program' && (
        <>
          <rect x="1.5" y="1.5" width="9" height="9" className={s.glyphLine} />
          <path d="M1.5 10.5 L10.5 1.5 V10.5 Z" className={s.glyphFill} />
        </>
      )}
      {status === 'open' && <rect x="1.5" y="1.5" width="9" height="9" className={s.glyphOpen} />}
    </svg>
  );
}
