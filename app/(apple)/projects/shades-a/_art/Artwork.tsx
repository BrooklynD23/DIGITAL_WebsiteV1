/**
 * The SHADES concept artwork as markup: one SVG, the same parts in every stage. Server-safe (no hooks).
 * Stills render it with a viewBox at a fixed pose; the pin renders stage 0 and repaints `d` / opacity per frame
 * (ConceptStages.paint). Paint order is far to near: temples, back face, front, lenses, display region.
 */
import { heldWord } from '../../../_content/shades-concept';
import { PATH_KEYS, STILL_VIEW, type PathKey, type Scene } from './scene';
import s from '../concept.module.css';

/** Which functional group a path belongs to (systemGroups ids). Colour is always paired with a text label. */
const GROUP: Partial<Record<PathKey, string>> = {
  tL: 'frame', tR: 'frame', pads: 'frame', back: 'frame', lugs: 'frame', bridge: 'frame', rimL: 'frame', rimR: 'frame', hinges: 'frame',
  lensL: 'optics', lensR: 'optics', glint: 'optics',
  disp: 'display', chipT: 'timing', chipC: 'control',
};
const KIND: Partial<Record<PathKey, string>> = {
  matte: 'matte', cons: 'cons', tL: 'solid', tR: 'solid', back: 'solid', lugs: 'solid', bridge: 'solid', rimL: 'solid', rimR: 'solid',
  lensL: 'glass', lensR: 'glass', disp: 'region', chipT: 'region', chipC: 'region',
};

export function Artwork({ scene, still = false, word = heldWord, className }: { readonly scene: Scene; readonly still?: boolean; readonly word?: string; readonly className?: string }) {
  return (
    <svg
      className={[s.svg, className ?? ''].join(' ')}
      viewBox={`0 0 ${STILL_VIEW.w} ${STILL_VIEW.h}`}
      data-art={still ? 'still' : 'live'}
      style={{ ['--tint' as string]: scene.tint.toFixed(3) }}
      aria-hidden="true"
      focusable="false"
    >
      {PATH_KEYS.map((k) => (
        <path key={k} data-k={k} data-g={GROUP[k]} data-kind={KIND[k] ?? 'line'} d={scene.d[k]} style={{ opacity: Number(scene.o[k].toFixed(3)) }} fillRule="evenodd" />
      ))}
      <text className={s.word} data-word="" x={scene.word.x.toFixed(1)} y={scene.word.y.toFixed(1)} fontSize={scene.word.size.toFixed(1)} textAnchor="middle">
        {word}
      </text>
      <circle className={s.fix} data-fix="" cx={scene.dot.x.toFixed(1)} cy={scene.dot.y.toFixed(1)} r={scene.dot.r.toFixed(1)} />
    </svg>
  );
}
