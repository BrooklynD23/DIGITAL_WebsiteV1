'use client';

import { useState } from 'react';
import { BoardSvg, BOARD_STATES } from '../_system/boards/BoardSvg';
import type { BoardState } from '../_system/boards/BoardSvg';
import type { BoardData } from '../_system/boards/types';
import s from './boards.module.css';

const STATES = Object.keys(BOARD_STATES) as BoardState[];

/** Exploded isometric view with a manual explode slider (stand-in for the scroll scrub). */
export function BoardExplorer({ board }: { readonly board: BoardData }) {
  const [explode, setExplode] = useState(0.6);
  const [state, setState] = useState<BoardState>('assembled');
  const sliderId = `explode-${board.id}`;
  return (
    <div className={s.explorer}>
      <BoardSvg board={board} iso explode={explode} state={state} labels className={s.svg} />
      <div className={s.controls}>
        <label htmlFor={sliderId} className={s.ctlLabel}>
          Explode <output className={s.mono}>{explode.toFixed(2)}</output>
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={Math.round(explode * 100)}
          onChange={(ev) => setExplode(Number(ev.target.value) / 100)}
          className={s.range}
        />
        <div className={s.states} role="group" aria-label="Focus">
          {STATES.map((st) => (
            <button key={st} type="button" aria-pressed={state === st} onClick={() => setState(st)} className={s.stateBtn}>
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
