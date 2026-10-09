import { GATE_HEADS, OWNERSHIP_MODEL, type Subsystem } from '../content';
import s from '../e.module.css';

/**
 * DG-001 outcome as structure, not a fake KPI: 7 subsystems × the 4 ownership-model gates
 * (phoneV2.ts buildScope). Every cell is "not reported" today, which is the honest zero state;
 * cells fill as the club publishes gate results.
 */
export function GateBoard({ subsystems }: { readonly subsystems: readonly Subsystem[] }) {
  const total = subsystems.length * GATE_HEADS.length;
  return (
    <div className={s.gateBoard}>
      <div className={s.gateCaption} aria-hidden="true">
        <span>Gate board · DG-001</span>
        <span>0 of {total} gate results reported</span>
      </div>
      <table className={s.gateTable}>
        <caption className={s.srOnly}>
          DG-001 gate board: {subsystems.length} subsystems by {GATE_HEADS.length} gates. 0 of {total} results
          reported.
        </caption>
        <thead>
          <tr>
            <th scope="col">Subsystem</th>
            {GATE_HEADS.map((head, i) => (
              <th key={head} scope="col" title={OWNERSHIP_MODEL[i]}>
                <span className={s.gateHeadLong}>{head}</span>
                <span className={s.gateHeadShort} aria-hidden="true">
                  G{i + 1}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subsystems.map((sub, r) => (
            <tr key={sub.id}>
              <th scope="row">
                <span className={s.gateRowNum}>{String(r + 1).padStart(2, '0')}</span> {sub.title}
              </th>
              {GATE_HEADS.map((head) => (
                <td key={head}>
                  <span className={s.gateCell} aria-label="Not reported" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ol className={s.gateLegend}>
        {OWNERSHIP_MODEL.map((gate, i) => (
          <li key={gate}>
            <b>G{i + 1}</b> {gate}
          </li>
        ))}
      </ol>
    </div>
  );
}
