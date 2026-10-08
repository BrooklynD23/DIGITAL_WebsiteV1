import type { CSSProperties } from 'react';
import type { StageId } from '../../_content/home';
import { VIEWBOX, type CameraPose, type PartId, type PartPose } from './contract';
import { MARKER, PAINT_ORDER, PARTS, TEST_PATH, type Tier } from './geometry';
import { NARROW_CAMERA, POSES } from './poses';

const RED = 'var(--r2-trigger, #d8412f)';
const CX = VIEWBOX.w / 2;
const CY = VIEWBOX.h / 2;

const TAN30 = 0.5774;
const r4 = (n: number): number => Math.round(n * 1e4) / 1e4;

/**
 * Camera: translate (viewBox units), then scale about the viewBox centre. `flat` blends in the matrix that
 * un-projects the isometric ground plane to a true top view (the PLAN sheet). CSS transform string.
 */
export function rigTransform(c: CameraPose): string {
  const f = c.flat ?? 0;
  const m = `matrix(${r4(1 + (TAN30 - 1) * f)}, ${r4(-TAN30 * f)}, ${r4(f)}, 1, 0, 0)`;
  return `translate(${c.x + CX}px, ${c.y + CY}px) scale(${c.s}) ${m} translate(${-CX}px, ${-CY}px)`;
}

export function partTransform(p: PartPose): string {
  return `translate(${p.x}px, ${p.y}px)`;
}

function Tiers({ tiers }: { readonly tiers: readonly Tier[] }) {
  return (
    <>
      {tiers.map((t, i) =>
        t.fill !== undefined ? (
          <path key={i} d={t.d} fill="#000" fillOpacity={t.fill} stroke="none" />
        ) : (
          <path
            key={i}
            d={t.d}
            strokeOpacity={t.o}
            strokeDasharray={t.dash ? '5 4' : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ),
      )}
    </>
  );
}

function PartBody({ id, pose }: { readonly id: PartId; readonly pose: PartPose }) {
  if (id === 'testPath') {
    return (
      <>
        <g data-layer="plan" style={{ opacity: pose.plan }}>
          <path d={TEST_PATH.assembled} vectorEffect="non-scaling-stroke" />
        </g>
        <g data-layer="build" style={{ opacity: pose.build }}>
          <path d={TEST_PATH.pad} strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />
          {/* no non-scaling-stroke here: it breaks pathLength-normalised dashes under a scaled rig */}
          <path
            data-draw
            d={TEST_PATH.exploded}
            pathLength={1}
            strokeDasharray="1"
            strokeWidth={3.6}
            strokeLinecap="butt"
            style={{ strokeDashoffset: 1 - (pose.draw ?? 0) }}
          />
        </g>
        <circle cx={TEST_PATH.end[0]} cy={TEST_PATH.end[1]} r={6} fill={RED} stroke="none" />
      </>
    );
  }
  if (id === 'marker') {
    return (
      <g data-layer="build" style={{ opacity: pose.build }}>
        <path d={MARKER.leader} strokeOpacity={0.35} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        <path d={MARKER.triangle} fill={RED} stroke="none" />
      </g>
    );
  }
  const art = PARTS[id];
  return (
    <>
      <g data-layer="plan" style={{ opacity: pose.plan }}>
        <Tiers tiers={art.plan} />
      </g>
      <g data-layer="build" style={{ opacity: pose.build }}>
        <Tiers tiers={art.build} />
      </g>
    </>
  );
}

export function PhoneArtwork({ stage = 'plan', className }: { stage?: StageId; className?: string }) {
  const { camera, parts } = POSES[stage];
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* two cameras, one picked in CSS (--rig is set to --rig-n at ≤734px by hero.module.css): no JS breakpoint, no hydration jump */}
      <g data-rig style={{ '--rig-d': rigTransform(camera), '--rig-n': rigTransform(NARROW_CAMERA[stage]), transform: 'var(--rig, var(--rig-d))' } as CSSProperties}>
        {PAINT_ORDER.map((id) => (
          <g key={id} data-part={id} style={{ transform: partTransform(parts[id]), opacity: parts[id].o }}>
            <PartBody id={id} pose={parts[id]} />
          </g>
        ))}
      </g>
    </svg>
  );
}
