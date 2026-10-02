import { allBoards, getBoard, thermometerSummary, BoardSvg, BoardLayers } from '../_system/boards';
import type { BoardData, LayerBoardId } from '../_system/boards';
import { BoardExplorer } from './BoardExplorer';
import s from './boards.module.css';

const mm = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

function BoardSpecimen({ board }: { readonly board: BoardData }) {
  const c = board.counts;
  return (
    <section className={s.board} aria-labelledby={`h-${board.id}`}>
      <header className={s.boardHead}>
        <h2 id={`h-${board.id}`} className={s.boardTitle}>{board.title}</h2>
        <span className={s.pill} data-status={board.status}>{board.statusLabel}</span>
        <p className={s.dims}>
          <span className={s.mono}>{mm(board.size.w)} × {mm(board.size.h)} mm</span> · {board.copperLayers} copper layers ·{' '}
          {board.thickness} mm thick · <em>from the club&apos;s KiCad files [confirm]</em>
        </p>
        <p className={`${s.counts} ${s.mono}`}>
          {c.tracks} tracks · {c.vias} vias · {c.footprints} footprints · {c.pads} pads · {c.zones} copper fills
          {c.teardropZones ? ` (${c.teardropZones} teardrops)` : ''}
          {c.parked ? ` · ${c.parked} parts parked beside the board, not yet placed` : ''}
        </p>
      </header>
      <div className={s.views}>
        <figure className={s.fig}>
          <BoardLayers board={board.id as LayerBoardId} proj="flat" stableFrame={false} />
          <figcaption>
            Flat · top view, both copper layers{c.parked ? ` · ${c.parked} parked parts not drawn` : ''}
          </figcaption>
        </figure>
        <figure className={s.fig}>
          <BoardLayers board={board.id as LayerBoardId} stableFrame={false} />
          <figcaption>Isometric · assembled</figcaption>
        </figure>
        <figure className={s.fig}>
          <BoardExplorer board={board.id as LayerBoardId} />
          <figcaption>Exploded · drag to separate layers</figcaption>
        </figure>
      </div>
    </section>
  );
}

export default function BoardsSpecimenPage() {
  const t = thermometerSummary;
  return (
    <main className={s.page}>
      <div className={`${s.world} ${s.graticule}`}>
        <header className={s.intro}>
          <p className={s.eyebrow}>R2 system · boards</p>
          <h1 className={s.h1}>The real boards, drawn from their files</h1>
          <p className={s.lede}>
            Outline, copper, pads, vias and silkscreen are parsed from the club&apos;s KiCad 9 board files. Nothing here
            is hand-drawn. Personal fields, values and text were stripped at conversion.
          </p>
          <p className={s.lede}>
            Drawn with <code>BoardLayers</code>: one cached SVG file per layer, one composited box per layer. Scroll
            benches: <a href="/design-lab/r2/boards/bench-layers/">BoardLayers</a> ·{' '}
            <a href="/design-lab/r2/boards/bench-svg/">BoardSvg (old path)</a>.
          </p>
        </header>
        {allBoards.map((b) => (
          <BoardSpecimen key={b.id} board={b} />
        ))}
        <section className={s.board} aria-labelledby="h-thermo">
          <header className={s.boardHead}>
            <h2 id="h-thermo" className={s.boardTitle}>{t.title}</h2>
            <span className={s.pill} data-status={t.status}>{t.statusLabel}</span>
          </header>
          <p className={s.lede}>
            No board outline or copper exists yet, so nothing is drawn. Schematic summary from the club&apos;s KiCad
            file [confirm]:
          </p>
          <dl className={`${s.summary} ${s.mono}`}>
            <div><dt>Components</dt><dd>{t.components} ({t.refs.join(', ')})</dd></div>
            <div><dt>Named nets</dt><dd>{t.namedNets}</dd></div>
            <div><dt>Sheets</dt><dd>{t.sheets} ({t.sheetNames.join(', ')}, {t.paper})</dd></div>
            <div><dt>Wires</dt><dd>{t.wires}</dd></div>
          </dl>
        </section>
      </div>

      <div className={`${s.world} ${s.apple}`}>
        <header className={s.intro}>
          <p className={s.eyebrow}>Same renderer · light world</p>
          <h2 className={s.h2}>currentColor and CSS variables, no fixed palette</h2>
        </header>
        <div className={s.lightRow}>
          {allBoards.map((b) => (
            <figure key={b.id} className={s.fig}>
              <BoardLayers board={b.id as LayerBoardId} explode={0.55} state="copper" />
              <figcaption>{b.title} · exploded 0.55 · focus: copper</figcaption>
            </figure>
          ))}
        </div>
        <header className={s.intro} style={{ marginTop: 64 }}>
          <p className={s.eyebrow}>Parity check · fingerprint module</p>
          <h2 className={s.h2}>Inline BoardSvg (left) vs file-backed BoardLayers (right)</h2>
        </header>
        <div className={s.lightRow}>
          <figure className={s.fig} style={{ maxWidth: 420 }}>
            <BoardSvg board={getBoard('fingerprint')} stableFrame={false} className={s.svg} />
            <figcaption>BoardSvg · inline paths · keep for small static figures</figcaption>
          </figure>
          <figure className={s.fig} style={{ maxWidth: 420 }}>
            <BoardLayers board="fingerprint" proj="flat" stableFrame={false} />
            <figcaption>BoardLayers · per-layer files · use for large or animated figures</figcaption>
          </figure>
        </div>
      </div>
    </main>
  );
}
