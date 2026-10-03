'use client';

import { useState } from 'react';
import { BoardLayers } from '../../_system/boards/BoardLayers';
import { Chevron } from '../../_system/ui/Chevron';
import { modules } from '../../_content/sidekick';
import { ComputeModule, PlannedModules, SensorModule } from '../../_sidekick/IsoModules';
import s from './sidekick.module.css';

const VIEWS = [
  { id: 'flat', label: 'Flat' },
  { id: 'iso', label: 'Angled' },
  { id: 'exploded', label: 'Exploded' },
] as const;
type View = (typeof VIEWS)[number]['id'];

const NO_FILE = 'No board file yet';

/**
 * A product viewer over all five modules: arrows step through them, a segmented control picks the view.
 * The two real boards (BoardLayers, the club's KiCad files) mount their three views once and cross-fade between
 * them; the three modules with no board file show their outline drawing and say why the other views are off.
 */
export function CloserLook() {
  const [i, setI] = useState(0);
  const [view, setView] = useState<View>('iso');
  const m = modules[i];
  const step = (d: number): void => setI((v) => (v + d + modules.length) % modules.length);
  const shown: View = m.board ? view : 'iso';

  return (
    <div className={s.viewer}>
      <div className={s.viewerStage}>
        <figure className={s.viewerFig} key={m.id}>
          <div className={s.viewerArt}>
            {m.board ? (
              VIEWS.map((v) => (
                <div key={v.id} className={s.viewLayer} data-on={shown === v.id ? 'true' : 'false'} aria-hidden={shown === v.id ? undefined : true}>
                  <BoardLayers
                    board={m.board!}
                    proj={v.id === 'flat' ? 'flat' : 'iso'}
                    explode={v.id === 'exploded' ? 1 : 0}
                    labels={v.id === 'exploded'}
                    stableFrame={v.id === 'exploded'}
                    className={s.viewBoard}
                  />
                </div>
              ))
            ) : (
              <div className={s.viewLayer} data-on="true">
                {m.id === 'sensor' ? <SensorModule w={26} h={20} /> : m.id === 'compute' ? <ComputeModule w={40} h={30} /> : <PlannedModules w={40} h={40} />}
              </div>
            )}
          </div>
          <figcaption className={s.viewerCap} aria-live="polite">
            <span className={s.viewerName}>{m.name}</span>
            <span className={s.viewerSpec}>
              {m.spec} <span className={s.confirm}>[confirm]</span>
            </span>
          </figcaption>
        </figure>
      </div>
      <div className={s.viewerBar}>
        <div className={s.segmented} role="group" aria-label="View">
          {VIEWS.map((v) => {
            const off = !m.board && v.id !== 'iso';
            return (
              <button key={v.id} type="button" aria-pressed={shown === v.id} onClick={() => setView(v.id)} disabled={off} title={off ? NO_FILE : undefined}>
                {v.label}
              </button>
            );
          })}
        </div>
        {!m.board ? <span className={s.noFile}>{NO_FILE}</span> : null}
        <div className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => step(-1)} aria-label="Previous module">
            <Chevron dir="left" />
          </button>
          <span className={s.count} aria-hidden="true">
            {i + 1} / {modules.length}
          </span>
          <button type="button" className={s.arrow} onClick={() => step(1)} aria-label="Next module">
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
