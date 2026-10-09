import { Fragment } from 'react';
import { view } from '../../_content/shades-reveal';
import { FOCUS, WORDS } from '../shades-control/words';
import hold from '../shades-control/control.module.css';

/**
 * No-JS still for the "Hold still" beat: the five steps as five frames, each with its name and caption.
 * Same frames as the shades-control page's own still (that one is local to its page.tsx, so it is mirrored here).
 */
const FRAMES: ReadonlyArray<readonly string[]> = [
  WORDS,
  WORDS.slice(FOCUS - 4, FOCUS + 1),
  WORDS.slice(FOCUS - 2, FOCUS + 1),
  [view.heldWord],
  [view.heldWord],
];

export function ViewStills() {
  return (
    <ol className={hold.stills}>
      {view.steps.map((st, i) => (
        <li key={st.id} className={hold.still} data-step={st.id}>
          <p className={hold.stillFig} aria-hidden="true">
            {FRAMES[i].map((w, j) => {
              const focus = i === 0 ? j === FOCUS : j === FRAMES[i].length - 1;
              return (
                <Fragment key={`${w}${j}`}>
                  {focus ? (
                    <span className={hold.stillFocus}>
                      <span className={hold.stillDot} />
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
          <p className={hold.stillName}>{st.name}</p>
          <p className={hold.stillCaption}>{st.caption}</p>
        </li>
      ))}
    </ol>
  );
}
