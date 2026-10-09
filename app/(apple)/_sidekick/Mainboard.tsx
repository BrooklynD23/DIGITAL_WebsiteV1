/**
 * The SIDEKICK FPGA main board in isometric line art: one composited box per copper layer, one for the FR-4 core,
 * and one per part group and board side. Every box is a static SVG file referenced through <use>, so no geometry
 * enters the HTML or the RSC payload and a pose only writes transform / opacity on whole boxes.
 * Part boxes carry two copies of the same file: copper underneath, the group colour on top (cross-faded by opacity).
 * Hook-free. `stage` renders that pose inline (SSR first paint, static stills); BoardStory then drives the boxes.
 * `still` reserves the room the pose needs, so a still never overlaps its neighbours.
 */
import type { CSSProperties } from 'react';
import type { BoardStageId } from '../_content/sidekick';
import { BASE, ELEMENTS, POSES, VIEW_BOX, extent, stateOf } from './mainboardPoses';
import s from './mainboard.module.css';

const VB = VIEW_BOX.join(' ');
const [, , VW, VH] = VIEW_BOX;
/** Millimetres up → CSS translate of a box (percent of its own height). */
export const liftY = (mm: number): string => `translate3d(0, ${((-mm / VH) * 100).toFixed(3)}%, 0)`;

export function Mainboard({ stage = 'board', still = false, className }: { readonly stage?: BoardStageId; readonly still?: boolean; readonly className?: string }) {
  const pose = POSES[stage];
  const room = extent(pose);
  const style = {
    '--mb-ratio': (VW / VH).toFixed(4),
    aspectRatio: `${VW} / ${VH}`,
    ...(still ? { marginTop: `${((room.up / VW) * 100).toFixed(2)}%`, marginBottom: `${((room.down / VW) * 100).toFixed(2)}%` } : {}),
  } as CSSProperties;
  return (
    <div className={className ? `${s.rig} ${className}` : s.rig} style={style} data-mb-rig="" aria-hidden="true">
      {ELEMENTS.map((el) => {
        const st = stateOf(el, pose);
        return (
          <div key={el.key} className={s.box} data-mb={el.key} data-kind={el.group ? 'part' : el.key === 'core' ? 'core' : 'copper'} data-g={el.group} style={{ transform: liftY(st.y), opacity: st.o }}>
            <svg viewBox={VB} focusable="false" className={s.svg}>
              <use href={`${BASE}/${el.file}#l`} />
            </svg>
            {el.group ? (
              <svg viewBox={VB} focusable="false" className={s.tint} data-mb-tint="" style={{ opacity: st.tint }}>
                <use href={`${BASE}/${el.file}#l`} />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
