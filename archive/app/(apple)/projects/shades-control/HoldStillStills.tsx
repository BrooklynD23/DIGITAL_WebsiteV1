import { Fragment } from 'react';
import { control } from '../../_content/shades-control';
import { FOCUS, WORDS } from './words';
import s from './control.module.css';

/**
 * The no-JS still of the "Hold still" control (server-safe, no hooks). Shown by the caller only under
 * `@media (scripting: none)`; styles live in ./control.module.css (.stills).
 */
/** No-JS still: the five steps as five frames, each with its caption. */
const FRAMES: ReadonlyArray<readonly string[]> = [
  WORDS,
  WORDS.slice(FOCUS - 4, FOCUS + 1),
  WORDS.slice(FOCUS - 2, FOCUS + 1),
  [control.heldWord],
  [control.heldWord],
];

export function HoldStillStills() {
  return (
    <ol className={s.stills}>
      {control.steps.map((st, i) => (
        <li key={st.id} className={s.still} data-step={st.id}>
          <p className={s.stillFig} aria-hidden="true">
            {FRAMES[i].map((w, j) => {
              const focus = i === 0 ? j === FOCUS : j === FRAMES[i].length - 1;
              return (
                <Fragment key={`${w}${j}`}>
                  {focus ? (
                    <span className={s.stillFocus}>
                      <span className={s.stillDot} />
                      {w}
                    </span>
                  ) : (
                    w
                  )}
                  {j < FRAMES[i].length - 1 ? ' ' : null}
                </Fragment>
              );
            })}
          </p>
          <p className={s.stillName}>{st.name}</p>
          <p className={s.stillCaption}>{st.caption}</p>
        </li>
      ))}
    </ol>
  );
}
