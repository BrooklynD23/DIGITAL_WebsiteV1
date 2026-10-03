/**
 * The SHADES seat ring: one node per real open role (5), so the drawing matches "five kinds of builders".
 * Server-safe SVG. Each node lights while its seat row is hovered or focused (CSS :has, no JS); idle nodes are
 * dashed rings (open), the lit node solid. Replaces JoinChapter's default 8-seat orb on this page.
 */
import { SHADES } from '../_content/shades';
import s from './seats.module.css';

const ROLES = SHADES.join.roles;
const R = 38;

export function SeatRing({ world }: { readonly world: 'signal' | 'apple' }) {
  const pts = ROLES.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ROLES.length;
    return [50 + Math.cos(a) * R, 50 + Math.sin(a) * R] as const;
  });
  return (
    <svg className={s.ring} data-world={world} viewBox="0 0 100 100" role="img" aria-label={`${ROLES.length} open seats on SHADES, one per role`}>
      <circle className={s.ringTrack} cx={50} cy={50} r={R} />
      {pts.map(([x, y], i) => (
        <g key={ROLES[i].id} className={s.node} data-node={i}>
          <circle className={s.nodeRing} cx={x} cy={y} r={6} />
          <circle className={s.nodeCore} cx={x} cy={y} r={2.4} />
        </g>
      ))}
    </svg>
  );
}
