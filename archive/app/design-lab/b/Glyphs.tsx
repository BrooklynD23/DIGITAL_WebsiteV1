import { buildInterfaceMap, WIDE_MAP, type SubsystemInput } from './schematic';
import s from './b.module.css';

/** Per-build signature glyphs for the index, computed from the same records as the figures. */

/** DG-001: subsystem × part incidence matrix (7 × 10) from activePartIds. */
export function MatrixGlyph({ subsystems }: { readonly subsystems: readonly SubsystemInput[] }) {
  const map = buildInterfaceMap(subsystems, WIDE_MAP);
  const c = 5;
  const w = map.parts.length * c;
  const h = map.subsystems.length * c;
  return (
    <svg className={s.sig} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {map.subsystems.map((n, r) =>
        map.parts.map((p, k) => {
          const on = p.owners.includes(n.id);
          return (
            <rect
              key={`${n.id}-${p.id}`}
              x={k * c + 0.5}
              y={r * c + 0.5}
              width={c - 1}
              height={c - 1}
              className={on ? (p.handoff ? s.sigRed : s.sigOn) : s.sigOff}
            />
          );
        }),
      )}
    </svg>
  );
}

/** DG-002: one gate pulse per word in the RSVP demo stream. */
export function PulseGlyph({ count }: { readonly count: number }) {
  const step = 5;
  const w = count * step;
  const d = Array.from({ length: count }, (_, i) => `M${i * step} 30 V4 H${i * step + 3} V30 H${(i + 1) * step}`).join(' ');
  return (
    <svg className={s.sig} width={w} height={35} viewBox={`0 0 ${w} 35`} aria-hidden="true">
      <path d={d} className={s.sigLine} />
    </svg>
  );
}

/** Open slot: an unsigned, dashed block. */
export function OpenGlyph() {
  return (
    <svg className={s.sig} width={50} height={35} viewBox="0 0 50 35" aria-hidden="true">
      <rect x={1} y={1} width={48} height={33} className={s.sigOpen} />
    </svg>
  );
}
