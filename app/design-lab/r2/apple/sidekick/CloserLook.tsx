'use client';

import { useState } from 'react';
import { BoardSvg, getBoard } from '../../_system/boards';
import { SensorModule } from '../../_sidekick/IsoModules';
import s from './sidekick.module.css';

const BOARDS = [
  { id: 'carrier', name: 'Power carrier', spec: '49.0 × 41.0 mm · partly routed', board: 'zynq-carrier-power' as const },
  { id: 'fingerprint', name: 'Fingerprint module', spec: '22.81 × 26.12 mm · routed', board: 'fingerprint' as const },
  { id: 'sensor', name: 'Sensor module', spec: 'Schematic only · no outline yet', board: null },
] as const;

const VIEWS = [
  { id: 'flat', label: 'Flat' },
  { id: 'iso', label: 'Angled' },
  { id: 'exploded', label: 'Exploded' },
] as const;
type View = (typeof VIEWS)[number]['id'];

/**
 * A product viewer over the club's boards: arrows step through the boards, a segmented control picks the view.
 * Every view is the real KiCad geometry (the sensor module has none, so it shows its schematic-only drawing).
 */
export function CloserLook() {
  const [i, setI] = useState(0);
  const [view, setView] = useState<View>('iso');
  const b = BOARDS[i];
  const step = (d: number): void => setI((v) => (v + d + BOARDS.length) % BOARDS.length);

  return (
    <div className={s.viewer}>
      <div className={s.viewerStage} aria-live="polite">
        <figure className={s.viewerFig} key={`${b.id}-${view}`}>
          <div className={s.viewerArt} data-view={view}>
            {b.board ? (
              <BoardSvg
                board={getBoard(b.board)}
                iso={view !== 'flat'}
                explode={view === 'exploded' ? 1 : 0}
                labels={view === 'exploded'}
                stableFrame={false}
                parked={b.board === 'zynq-carrier-power' && view === 'flat'}
              />
            ) : (
              <SensorModule w={26} h={20} />
            )}
          </div>
          <figcaption className={s.viewerCap}>
            <span className={s.viewerName}>{b.name}</span>
            <span className={s.viewerSpec}>
              {b.spec}
              {b.board === 'zynq-carrier-power' && view === 'flat' ? ' · 19 parts unplaced' : ''} <span className={s.confirm}>[confirm]</span>
            </span>
          </figcaption>
        </figure>
      </div>
      <div className={s.viewerBar}>
        <div className={s.segmented} role="group" aria-label="View">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => setView(v.id)} disabled={!b.board && v.id !== 'iso'}>
              {v.label}
            </button>
          ))}
        </div>
        <div className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => step(-1)} aria-label="Previous board">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5L9 12l5.5 5.5" /></svg>
          </button>
          <span className={s.count} aria-hidden="true">{i + 1} / {BOARDS.length}</span>
          <button type="button" className={s.arrow} onClick={() => step(1)} aria-label="Next board">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5L15 12l-5.5 5.5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
