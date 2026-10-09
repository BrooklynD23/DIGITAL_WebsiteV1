import { BoardSvg, getBoard } from '../../_system/boards';
import { ScrollDrive } from '../_bench/ScrollDrive';
import s from '../_bench/bench.module.css';

/** Bench (old path): inline BoardSvg, layers moved inside the SVG, 420 ms transition on the scrub. */
export default function BenchSvgPage() {
  return (
    <main className={s.page}>
      <p className={s.note}>Bench · BoardSvg inline (SIDEKICK v1 path). Scroll to explode.</p>
      <div id="band" className={s.band}>
        <div id="stage" className={`${s.stage} ${s.old}`}>
          <div className={s.fig} style={{ ['--g' as string]: 13.72 }}>
            <BoardSvg board={getBoard('zynq-carrier-power')} iso />
          </div>
          <div className={s.fig} style={{ ['--g' as string]: 7.31 }}>
            <BoardSvg board={getBoard('fingerprint')} iso />
          </div>
        </div>
      </div>
      <ScrollDrive band="band" stage="stage" />
    </main>
  );
}
