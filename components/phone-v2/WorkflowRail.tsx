'use client';

import { useEffect, useRef } from 'react';
import { createTimeline, stagger, svg } from 'animejs';

export interface WorkflowRailProps {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly stages: readonly [string, string, string, string];
  readonly lines: readonly string[];
  readonly accent: string;
  readonly reduceMotion: boolean;
  readonly className?: string;
}

/** Pad centres along the routed trace, in viewBox units. */
const PADS = [
  { x: 46, y: 116 },
  { x: 158, y: 66 },
  { x: 270, y: 116 },
  { x: 382, y: 66 },
] as const;

/**
 * A routed board trace: horizontal runs with 45° mitres at each level change,
 * broken by a gap at every pad. Mitred corners are how signal is actually routed
 * on a PCB, so the drawing states "workflow" in the page's own vernacular rather
 * than decorating it.
 */
const TRACE_D =
  'M 14 116 H 33 M 59 116 H 116 L 144 88 M 171 66 H 228 L 256 94 M 283 116 H 340 L 368 88 M 395 66 H 426';

export function WorkflowRail({
  label,
  title,
  description,
  stages,
  lines,
  accent,
  reduceMotion,
  className,
}: WorkflowRailProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const root = svgRef.current;
    if (
      !root ||
      reduceMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const trace = root.querySelector<SVGPathElement>('[data-rail-trace="true"]');
    const pads = Array.from(root.querySelectorAll<SVGRectElement>('[data-rail-pad="true"]'));
    if (!trace || pads.length === 0) return;

    const drawable = svg.createDrawable([trace]);

    const timeline = createTimeline({
      loop: true,
      loopDelay: 700,
      defaults: { ease: 'out(3)' },
    })
      .add(drawable, { draw: ['0 0', '0 1'], duration: 1500, ease: 'inOut(2)' }, 0)
      .add(
        pads,
        {
          strokeOpacity: [0.35, 1, 0.35],
          scale: [1, 1.22, 1],
          duration: 520,
          delay: stagger(340),
        },
        220
      )
      .add(drawable, { draw: ['1 1'], duration: 700, ease: 'inOut(2)' }, 2100);

    return () => {
      timeline.revert();
    };
  }, [reduceMotion]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox="0 0 440 200"
        className="w-full max-w-[440px]"
        role="img"
        aria-label={`Workflow: ${stages.join(', ')}`}
      >
        <path
          data-rail-trace="true"
          d={TRACE_D}
          fill="none"
          stroke={accent}
          strokeOpacity={0.85}
          strokeWidth={1.6}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
        />

        {PADS.map((pad, index) => (
          <g key={stages[index]}>
            <rect
              data-rail-pad="true"
              x={pad.x - 13}
              y={pad.y - 13}
              width={26}
              height={26}
              rx={3}
              fill="none"
              stroke="#F1F5F9"
              strokeOpacity={0.35}
              strokeWidth={1.3}
              vectorEffect="non-scaling-stroke"
              style={{ transformBox: 'fill-box', transformOrigin: 'center center' }}
            />
            {/* Drilled centre — the one filled mark, per the page's stroke-only rule. */}
            <circle cx={pad.x} cy={pad.y} r={3.2} fill={accent} fillOpacity={0.85} />
            <text
              x={pad.x}
              y={pad.y - 22}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              letterSpacing="0.18em"
              fill="#94A3B8"
              fillOpacity={0.65}
            >
              {String(index + 1).padStart(2, '0')}
            </text>
            <text
              x={pad.x}
              y={pad.y + 34}
              textAnchor="middle"
              className="font-mono uppercase"
              fontSize={10}
              letterSpacing="0.24em"
              fill="#94A3B8"
            >
              {stages[index]}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-5 max-w-[34ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">{label}</p>
        <h3 className="mt-3 font-display text-[clamp(28px,3vw,42px)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[#F1F5F9]">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.55] text-[#CBD5E1]">{description}</p>
        <ul className="mt-5 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#CBD5E1]">
          {lines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-[5px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
