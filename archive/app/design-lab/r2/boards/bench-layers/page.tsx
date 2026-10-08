import { BoardLayers } from '../../_system/boards/BoardLayers';
import { ScrollDrive } from '../_bench/ScrollDrive';
import s from '../_bench/bench.module.css';

/** Bench (new path): BoardLayers, one composited box per layer, explode read from --e, no transition. */
export default function BenchLayersPage() {
  return (
    <main className={s.page}>
      <p className={s.note}>Bench · BoardLayers (static per-layer files). Scroll to explode.</p>
      <div id="band" className={s.band}>
        <div id="stage" className={s.stage}>
          <div className={s.fig}>
            <BoardLayers board="carrier" />
          </div>
          <div className={s.fig}>
            <BoardLayers board="fingerprint" />
          </div>
        </div>
      </div>
      <ScrollDrive band="band" stage="stage" />
    </main>
  );
}
