'use client';

import { useState } from 'react';
import { BoardLayers } from '../_system/boards/BoardLayers';
import type { LayerBoardId, LayerFocus } from '../_system/boards/BoardLayers';
import s from './boards.module.css';

const STATES: ReadonlyArray<LayerFocus> = ['assembled', 'outline', 'copper', 'parts'];

/** Exploded isometric view with a manual explode slider. Receives only an id: no geometry crosses to the client. */
export function BoardExplorer({ board }: { readonly board: LayerBoardId }) {
  const [explode, setExplode] = useState(0.6);
  const [state, setState] = useState<LayerFocus>('assembled');
  const [live, setLive] = useState(false);
  const sliderId = `explode-${board}`;
  return (
    <div className={s.explorer}>
      <BoardLayers board={board} explode={explode} state={state} labels live={live} />
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
          onPointerDown={() => setLive(true)}
          onPointerUp={() => setLive(false)}
          onBlur={() => setLive(false)}
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
