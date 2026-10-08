import { GLYPHS } from '../../_system/icons/glyphs';
import type { GlyphState } from '../../_system/icons/Glyph';
import { StateMark, type ChannelState } from '../../_system/icons/StateMark';
import s from '../system.module.css';

const STATES: readonly GlyphState[] = ['idle', 'working', 'done'];
const SIZES = [16, 24, 64] as const;
const CHANNEL_STATES: readonly ChannelState[] = ['live', 'pending', 'stale', 'paused'];

/** Server-rendered. Hover or focus a row: its working glyphs animate (pure CSS, no JS). */
export function IconMatrix({ set }: { readonly set: 'build' | 'agentic' }) {
  return (
    <div className={s.matrix} role="list">
      <div className={s.matrixHead} aria-hidden="true">
        <span />
        {STATES.map((st) => (
          <span key={st} className={s.monoLabel}>
            {st} · 16 / 24 / 64
          </span>
        ))}
      </div>
      {GLYPHS.filter((g) => g.set === set).map(({ name, means, Component }) => (
        <div key={name} className={s.matrixRow} role="listitem" tabIndex={0} data-glyph-host aria-label={`${name}: ${means}`}>
          <div className={s.matrixName}>
            <span className={s.glyphName}>{name}</span>
            <span className={s.small}>{means}</span>
          </div>
          {STATES.map((st) => (
            <div key={st} className={s.matrixCell} data-state-col={st}>
              <span className={s.cellState} aria-hidden="true">
                {st}
              </span>
              {SIZES.map((px) => (
                <Component key={px} state={st} size={px} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function StateMarks() {
  return (
    <ul className={s.stateMarks}>
      {CHANNEL_STATES.map((st) => (
        <li key={st}>
          <StateMark state={st} size={48} />
          <span className={s.glyphName}>{st}</span>
          <span className={s.small}>
            {st === 'live'
              ? 'Solid: running now'
              : st === 'pending'
                ? 'Dashed: planned, not started'
                : st === 'stale'
                  ? 'Half height: last signal is old'
                  : 'Struck: on hold'}
          </span>
        </li>
      ))}
    </ul>
  );
}
