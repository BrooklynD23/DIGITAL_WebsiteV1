/**
 * The SHADES glasses, front view, drawn in dots (round-cap dash dots). Illustrative line art, not a render:
 * one display region in the right lens (monocular), a wire to the external controller. Server-safe.
 */
import { SHADES } from '../../_content/shades';
import { splitWord } from '../../_shades/rsvp';
import s from './apple.module.css';

const LEFT =
  'M176 140Q176 114 204 112L398 112Q426 114 428 142L421 232Q411 292 331 294L266 294Q186 292 179 232Z';
const RIGHT =
  'M784 140Q784 114 756 112L562 112Q534 114 532 142L539 232Q549 292 629 294L694 294Q774 292 781 232Z';

const WORD = 'here';

export function Glasses({ className }: { readonly className?: string }) {
  const w = splitWord(WORD);
  return (
    <svg className={[s.glasses, className ?? ''].join(' ')} viewBox="0 0 960 420" role="img" aria-label={SHADES.hero.glassesLabel}>
      <g aria-hidden="true">
        <path className={s.gLens} d={LEFT} />
        <path className={s.gLens} d={RIGHT} />
        <path className={s.gDots} d={LEFT} />
        <path className={s.gDots} d={RIGHT} />
        <path className={s.gDots} d="M428 150Q480 116 532 150" />
        <path className={s.gDots} d="M176 136L112 124M784 136L848 124" />
        <path className={s.gHair} d="M440 206q8 18 2 34M520 206q-8 18-2 34" />
        {/* the wire to the external controller (MVP: compute and power off the head) */}
        <path className={s.gWire} d="M850 128Q900 150 902 250T930 420" />
        {/* the display region: one word, luminous inside the lens (no box) */}
        <defs>
          <radialGradient id="shades-lens-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5f5f7" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#f5f5f7" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f5f5f7" stopOpacity="0" />
          </radialGradient>
          <filter id="shades-lens-bloom" x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="bloom" />
            <feMerge>
              <feMergeNode in="bloom" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse className={s.gGlow} cx={660} cy={200} rx={92} ry={52} fill="url(#shades-lens-glow)" />
        <line className={s.gTick} x1={660} y1={176} x2={660} y2={184} />
        <line className={s.gTick} x1={660} y1={216} x2={660} y2={224} />
        <text className={s.gWord} x={660} y={209} textAnchor="middle">
          <tspan>{w.pre}</tspan>
          <tspan className={s.gPivot}>{w.pivot}</tspan>
          <tspan>{w.post}</tspan>
        </text>
        <circle className={s.gAnchor} cx={660} cy={160} r={3.5} />
      </g>
    </svg>
  );
}
