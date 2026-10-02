'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildInterfaceMap, COMPACT_MAP, WIDE_MAP, type MapLayout, type SubsystemInput } from './schematic';
import s from './b.module.css';

interface Props {
  readonly subsystems: readonly SubsystemInput[];
  readonly titleId: string;
}

/**
 * Fig. 1 — subsystem → part interface map, generated from phoneV2 activePartIds.
 * Two layouts from the same generator (wide ≥ 900px, compact below); CSS shows one.
 * Subsystem blocks are links to their register rows, so hover and keyboard focus
 * both trace a subsystem's wires.
 */
export function InterfaceMap({ subsystems, titleId }: Props) {
  const [active, setActive] = useState<string | null>(null);
  // Draw-in runs once after hydration, then the animation is removed entirely, so
  // server HTML (no JS) and any later capture always show the finished drawing.
  const [drawing, setDrawing] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setDrawing(true);
    const id = window.setTimeout(() => setDrawing(false), 1600);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className={drawing ? s.drawing : undefined}>
      <MapSvg layout={WIDE_MAP} subsystems={subsystems} active={active} setActive={setActive} titleId={titleId} className={s.mapWide} />
      <MapSvg layout={COMPACT_MAP} subsystems={subsystems} active={active} setActive={setActive} titleId={titleId} className={s.mapCompact} />
    </div>
  );
}

function MapSvg({
  layout,
  subsystems,
  active,
  setActive,
  titleId,
  className,
}: {
  readonly layout: MapLayout;
  readonly subsystems: readonly SubsystemInput[];
  readonly active: string | null;
  readonly setActive: (id: string | null) => void;
  readonly titleId: string;
  readonly className: string;
}) {
  const map = useMemo(() => buildInterfaceMap(subsystems, layout), [subsystems, layout]);
  const lit = (subId: string) => active === subId;
  const partLit = (owners: readonly string[]) => active !== null && owners.includes(active);
  const fs = layout.compact ? 10 : 11.5;
  const descId = `${titleId}-${layout.compact ? 'c' : 'w'}-desc`;

  return (
    <svg
      className={`${s.map} ${className}`}
      viewBox={`-2 -2 ${map.width + 4} ${map.height + 4}`}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descId}
      data-active={active ?? undefined}
    >
      <desc id={descId}>
        {`${map.subsystems.length} subsystems connect to ${map.parts.length} parts. ${map.handoffCount} parts are shared by two subsystems: `}
        {map.parts
          .filter((p) => p.handoff)
          .map((p) => `${p.label.toLowerCase()} (${p.owners.map((o) => subsystems.find((x) => x.id === o)?.title).join(' and ')})`)
          .join('; ')}
        .
      </desc>

      {/* wires */}
      <g aria-hidden="true">
        {map.wires.map((w, i) => (
          <path
            key={w.key}
            d={w.d}
            pathLength={1}
            className={`${s.wire} ${lit(w.subsystemId) ? s.wireLit : ''} ${active && !lit(w.subsystemId) ? s.wireDim : ''}`}
            style={{ ['--i' as string]: i }}
          />
        ))}
        {map.wires.map((w) => (
          <circle key={`${w.key}-pin`} cx={w.pin.x} cy={w.pin.y} r={2.4} className={s.pin} />
        ))}
      </g>

      {/* subsystem blocks */}
      {map.subsystems.map((n) => (
        <a
          key={n.id}
          href={`#sub-${n.id}`}
          className={s.mapLink}
          onMouseEnter={() => setActive(n.id)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(n.id)}
          onBlur={() => setActive(null)}
        >
          <rect x={n.x} y={n.y} width={n.w} height={n.h} className={`${s.block} ${lit(n.id) ? s.blockLit : ''}`} />
          <text x={n.x + 8} y={n.y + n.h / 2} dy="0.35em" className={s.ref} fontSize={fs}>
            {n.ref}
          </text>
          <text x={n.x + (layout.compact ? 28 : 34)} y={n.y + n.h / 2} dy="0.35em" className={s.blockText} fontSize={fs}>
            {n.label}
          </text>
        </a>
      ))}

      {/* parts */}
      <g aria-hidden="true">
        {map.parts.map((p) => (
          <g key={p.id}>
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              className={`${s.part} ${partLit(p.owners) ? s.partLit : ''} ${p.handoff ? s.partShared : ''}`}
            />
            <text x={p.x + 8} y={p.y + p.h / 2} dy="0.35em" className={s.partText} fontSize={fs}>
              {layout.compact ? p.label : `${p.ref}  ${p.label}`}
            </text>
            {p.handoff && (
              <g>
                <rect
                  x={p.x + p.w - (layout.compact ? 22 : 30)}
                  y={p.y + p.h / 2 - 7}
                  width={layout.compact ? 16 : 24}
                  height={14}
                  className={s.handoffTag}
                />
                <text
                  x={p.x + p.w - (layout.compact ? 14 : 18)}
                  y={p.y + p.h / 2}
                  dy="0.35em"
                  textAnchor="middle"
                  className={s.handoffText}
                  fontSize={layout.compact ? 8.5 : 9.5}
                >
                  {p.handoff}
                </text>
              </g>
            )}
          </g>
        ))}
      </g>

      {/* wide layout: handoff annotations in the right margin */}
      {!layout.compact && (
        <g aria-hidden="true">
          {map.parts
            .filter((p) => p.handoff)
            .map((p) => {
              const ax = p.x + p.w + 14;
              const refs = p.owners.map((o) => map.subsystems.find((n) => n.id === o)?.ref).join(' ↔ ');
              return (
                <g key={`${p.id}-note`}>
                  <path d={`M${p.x + p.w} ${p.y + p.h / 2} H${ax - 4}`} className={s.leader} />
                  <text x={ax} y={p.y + p.h / 2} dy="0.35em" className={s.note} fontSize={10.5}>
                    {`${p.handoff} · ${refs}`}
                  </text>
                </g>
              );
            })}
        </g>
      )}
    </svg>
  );
}
