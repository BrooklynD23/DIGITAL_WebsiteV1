import { disciplineCodes, type MatrixRow } from './copy';
import s from './b.module.css';

interface Props {
  readonly rows: readonly MatrixRow[];
  readonly titleId: string;
  readonly legendRecord: string;
  readonly legendInferred: string;
}

/**
 * Fig. 4 — build × discipline incidence matrix (same grammar as the DG-001 glyph).
 * A real table: row = subsystem or build, column = DESIGN.md §9.3 discipline code.
 * Filled cell = stated in the record; hatched cell = inferred from scope text [confirm].
 * Column totals are computed, so the "every column is needed" claim is checkable.
 */
export function DisciplineMatrix({ rows, titleId, legendRecord, legendInferred }: Props) {
  const totals = disciplineCodes.map((d) => rows.filter((r) => r.codes.includes(d.code)).length);
  return (
    <div className={s.matrixWrap}>
      <table className={s.matrix} aria-labelledby={titleId}>
        <thead>
          <tr>
            <th scope="col" className={s.matrixCorner}>
              <span className={s.srOnly}>Build</span>
            </th>
            {disciplineCodes.map((d) => (
              <th key={d.code} scope="col" title={d.name}>
                <abbr title={d.name}>{d.code}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ref} data-source={r.source}>
              <th scope="row">
                <span className={s.matrixRef}>{r.ref}</span> {r.label}
              </th>
              {disciplineCodes.map((d) => {
                const on = r.codes.includes(d.code);
                return (
                  <td key={d.code}>
                    {on ? (
                      <span className={r.source === 'record' ? s.cellRecord : s.cellInferred}>
                        <span className={s.srOnly}>{`${d.name}: ${r.source === 'record' ? 'stated' : 'inferred, to confirm'}`}</span>
                      </span>
                    ) : (
                      <span className={s.srOnly}>{`${d.name}: no`}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Builds needing it</th>
            {totals.map((n, i) => (
              <td key={disciplineCodes[i].code}>{n}</td>
            ))}
          </tr>
        </tfoot>
      </table>
      <dl className={s.matrixLegend}>
        <div>
          <dt><span className={s.cellRecord} aria-hidden="true" /></dt>
          <dd>{legendRecord}</dd>
        </div>
        <div>
          <dt><span className={s.cellInferred} aria-hidden="true" /></dt>
          <dd>{legendInferred}</dd>
        </div>
        {disciplineCodes.map((d) => (
          <div key={d.code}>
            <dt className={s.matrixCode}>{d.code}</dt>
            <dd>{d.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
