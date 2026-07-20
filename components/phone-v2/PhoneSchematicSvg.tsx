import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { phoneV2Copy } from '@/lib/data/phoneV2';

const PART_IDS = [
  'phone-front-glass',
  'phone-screen-ui',
  'phone-display-panel',
  'phone-midframe',
  'phone-main-pcb',
  'phone-battery',
  'phone-camera-module',
  'phone-antenna-module',
  'phone-speakers',
  'phone-buttons',
  'phone-haptics',
  'phone-flex-cables',
  'phone-screws',
  'phone-back-cover',
] as const;

type PhonePartId = (typeof PART_IDS)[number];

export interface PhoneSchematicSvgProps {
  readonly accent: string;
  readonly activePartIds: readonly string[];
  readonly progress: number;
  readonly className?: string;
  readonly mobile?: boolean;
  readonly assembled?: boolean;
}

interface PartTransform {
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
  readonly scale: number;
}

const PART_TRANSFORMS: Record<PhonePartId, PartTransform> = {
  'phone-front-glass': { x: 0, y: -8, rotate: -1.4, scale: 1 },
  'phone-screen-ui': { x: 0, y: 0, rotate: 0, scale: 1 },
  'phone-display-panel': { x: 0, y: 0, rotate: 0, scale: 1 },
  'phone-midframe': { x: 18, y: -16, rotate: 7, scale: 1.02 },
  'phone-main-pcb': { x: -170, y: -56, rotate: -17, scale: 1.03 },
  'phone-battery': { x: 162, y: 68, rotate: 14, scale: 1.04 },
  'phone-camera-module': { x: 150, y: -132, rotate: 11, scale: 1.02 },
  'phone-antenna-module': { x: -166, y: 132, rotate: -8, scale: 1.01 },
  'phone-speakers': { x: -120, y: 150, rotate: -6, scale: 1.01 },
  'phone-buttons': { x: 182, y: -16, rotate: 2, scale: 1 },
  'phone-haptics': { x: -148, y: 162, rotate: -14, scale: 1 },
  'phone-flex-cables': { x: 132, y: -164, rotate: 15, scale: 1.02 },
  'phone-screws': { x: 0, y: 0, rotate: 0, scale: 1 },
  'phone-back-cover': { x: 0, y: 0, rotate: 0, scale: 1 },
};

const LOADER_PARTS = new Set<PhonePartId>([
  'phone-front-glass',
  'phone-display-panel',
  'phone-midframe',
  'phone-back-cover',
]);

const MOBILE_PARTS = new Set<PhonePartId>([
  'phone-front-glass',
  'phone-screen-ui',
  'phone-main-pcb',
  'phone-battery',
  'phone-back-cover',
]);

const BODY_STYLE: CSSProperties = {
  filter: 'drop-shadow(0 38px 60px rgba(15, 23, 42, 0.45))',
};

export const PhoneSchematicSvg = forwardRef<SVGSVGElement, PhoneSchematicSvgProps>(
  function PhoneSchematicSvg(
    { accent, activePartIds, progress, className, mobile = false, assembled = false },
    ref
  ) {
    const exploded = assembled ? 0 : progress;
    const activeSet = new Set(activePartIds);
    const visibleParts = mobile ? MOBILE_PARTS : null;

    const partStyle = (partId: PhonePartId): CSSProperties => {
      const transform = PART_TRANSFORMS[partId];
      const focus = activeSet.has(partId) ? 1.18 : 1;
      const spread = exploded * (activeSet.has(partId) ? 1.2 : 1);
      const x = transform.x * spread;
      const y = transform.y * spread;
      const rotate = transform.rotate * spread;
      const scale = assembled ? 1 : transform.scale * (1 + exploded * 0.02) * focus;
      return {
        opacity:
          visibleParts && !visibleParts.has(partId)
            ? 0
            : assembled
              ? 1
              : activeSet.has(partId)
                ? 1
                : 0.58,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        transformBox: 'fill-box',
        transformOrigin: 'center center',
        transition: 'filter 420ms ease-out, opacity 420ms ease-out',
        filter: activeSet.has(partId)
          ? `drop-shadow(0 0 20px ${accent}66)`
          : 'drop-shadow(0 0 0 rgba(0,0,0,0))',
      };
    };

    const strokeBase = (partId: PhonePartId) =>
      activeSet.has(partId) ? accent : '#94A3B8';

    const lineOpacity = (partId: PhonePartId) => (activeSet.has(partId) ? 1 : 0.88);

    return (
      <svg
        ref={ref}
        viewBox="0 0 920 760"
        className={className}
        role="img"
        aria-label={phoneV2Copy.schematicAriaLabel}
        style={BODY_STYLE}
      >
        {/* Placeholder CAD paths: swap these technical strokes with real CAD-derived geometry later. */}
        <defs>
          <linearGradient id="phone-v2-surface" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" stopOpacity=".18" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity=".04" />
          </linearGradient>
        </defs>
        <style>{`
          [data-phone-part="true"][data-active="false"] [fill]:not([fill="none"]) {
            fill-opacity: 0.08;
          }
        `}</style>

        <g transform="translate(460 380)">
          <g id="phone-back-cover" data-phone-part="true" data-active={activeSet.has('phone-back-cover')} style={partStyle('phone-back-cover')}>
            <rect
              x={-128}
              y={-236}
              width={256}
              height={472}
              rx={40}
              fill="url(#phone-v2-surface)"
              stroke={strokeBase('phone-back-cover')}
              strokeWidth={1.7}
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={-106}
              y={-214}
              width={212}
              height={428}
              rx={30}
              fill="none"
              stroke="#F1F5F9"
              strokeOpacity={0.42}
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g id="phone-display-panel" data-phone-part="true" data-active={activeSet.has('phone-display-panel')} style={partStyle('phone-display-panel')}>
            <rect
              x={-116}
              y={-220}
              width={232}
              height={440}
              rx={34}
              fill="none"
              stroke={strokeBase('phone-display-panel')}
              strokeOpacity={lineOpacity('phone-display-panel')}
              strokeWidth={1.7}
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g id="phone-midframe" data-phone-part="true" data-active={activeSet.has('phone-midframe')} style={partStyle('phone-midframe')}>
            <path
              d="M -126 -200 C -140 -155 -140 155 -126 200"
              fill="none"
              stroke={strokeBase('phone-midframe')}
              strokeOpacity={lineOpacity('phone-midframe')}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 126 -200 C 140 -155 140 155 126 200"
              fill="none"
              stroke={strokeBase('phone-midframe')}
              strokeOpacity={lineOpacity('phone-midframe')}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g id="phone-front-glass" data-phone-part="true" data-active={activeSet.has('phone-front-glass')} style={partStyle('phone-front-glass')}>
            <rect
              x={-112}
              y={-212}
              width={224}
              height={424}
              rx={30}
              fill="none"
              stroke="#F1F5F9"
              strokeOpacity={0.96}
              strokeWidth={1.45}
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g id="phone-screen-ui" data-phone-part="true" data-active={activeSet.has('phone-screen-ui')} style={partStyle('phone-screen-ui')}>
            <rect
              x={-84}
              y={-182}
              width={168}
              height={310}
              rx={20}
              fill="none"
              stroke="#94A3B8"
              strokeOpacity={0.28}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M -58 -138 H 58"
              fill="none"
              stroke="#F1F5F9"
              strokeOpacity={0.65}
              strokeWidth={1.3}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M -58 -108 H 34"
              fill="none"
              stroke="#94A3B8"
              strokeOpacity={0.5}
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M -58 -78 H 48"
              fill="none"
              stroke="#94A3B8"
              strokeOpacity={0.5}
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={60} cy={-138} r={8.5} fill="none" stroke="#F1F5F9" strokeOpacity={0.85} strokeWidth={1.2} />
            <circle cx={60} cy={-138} r={2.5} fill={accent} fillOpacity={0.9} />
          </g>

          <g id="phone-main-pcb" data-phone-part="true" data-active={activeSet.has('phone-main-pcb')} style={partStyle('phone-main-pcb')}>
            {/* Placeholder CAD traces: replace with real board outlines and routing later. */}
            <rect
              x={-194}
              y={-82}
              width={132}
              height={164}
              rx={16}
              fill="none"
              stroke={strokeBase('phone-main-pcb')}
              strokeOpacity={lineOpacity('phone-main-pcb')}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <path d="M -182 -50 H -92" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M -182 -18 H -100" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M -182 14 H -104" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M -182 46 H -94" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <circle cx={-108} cy={-48} r={11} fill="none" stroke={accent} strokeOpacity={0.8} strokeWidth={1.3} />
            <circle cx={-108} cy={-48} r={3.2} fill={accent} fillOpacity={0.8} />
          </g>

          <g id="phone-battery" data-phone-part="true" data-active={activeSet.has('phone-battery')} style={partStyle('phone-battery')}>
            <rect
              x={72}
              y={34}
              width={132}
              height={174}
              rx={16}
              fill="none"
              stroke={strokeBase('phone-battery')}
              strokeOpacity={lineOpacity('phone-battery')}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <path d="M 96 58 H 178" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M 96 88 H 162" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M 96 118 H 186" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M 96 148 H 156" fill="none" stroke="#F1F5F9" strokeOpacity={0.52} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          </g>

          <g id="phone-camera-module" data-phone-part="true" data-active={activeSet.has('phone-camera-module')} style={partStyle('phone-camera-module')}>
            <rect
              x={78}
              y={-202}
              width={104}
              height={102}
              rx={24}
              fill="none"
              stroke={strokeBase('phone-camera-module')}
              strokeOpacity={lineOpacity('phone-camera-module')}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={110} cy={-168} r={16} fill="none" stroke="#F1F5F9" strokeOpacity={0.92} strokeWidth={1.3} />
            <circle cx={152} cy={-168} r={16} fill="none" stroke="#F1F5F9" strokeOpacity={0.92} strokeWidth={1.3} />
            <circle cx={110} cy={-168} r={5} fill={accent} fillOpacity={0.9} />
            <circle cx={152} cy={-168} r={5} fill={accent} fillOpacity={0.9} />
          </g>

          <g id="phone-antenna-module" data-phone-part="true" data-active={activeSet.has('phone-antenna-module')} style={partStyle('phone-antenna-module')}>
            <path d="M -178 176 H -82" fill="none" stroke={strokeBase('phone-antenna-module')} strokeOpacity={lineOpacity('phone-antenna-module')} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            <path d="M -170 190 H -92" fill="none" stroke="#F1F5F9" strokeOpacity={0.45} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M -160 204 H -100" fill="none" stroke="#F1F5F9" strokeOpacity={0.45} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          </g>

          <g id="phone-speakers" data-phone-part="true" data-active={activeSet.has('phone-speakers')} style={partStyle('phone-speakers')}>
            <path d="M -178 130 H -112" fill="none" stroke={strokeBase('phone-speakers')} strokeOpacity={lineOpacity('phone-speakers')} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            <path d="M -174 142 H -108" fill="none" stroke="#F1F5F9" strokeOpacity={0.48} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M -170 154 H -104" fill="none" stroke="#F1F5F9" strokeOpacity={0.48} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          </g>

          <g id="phone-buttons" data-phone-part="true" data-active={activeSet.has('phone-buttons')} style={partStyle('phone-buttons')}>
            <path d="M 178 -132 H 202" fill="none" stroke={strokeBase('phone-buttons')} strokeOpacity={lineOpacity('phone-buttons')} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            <path d="M 178 -104 H 202" fill="none" stroke="#F1F5F9" strokeOpacity={0.48} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
            <path d="M 178 -76 H 202" fill="none" stroke="#F1F5F9" strokeOpacity={0.48} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          </g>

          <g id="phone-haptics" data-phone-part="true" data-active={activeSet.has('phone-haptics')} style={partStyle('phone-haptics')}>
            <rect
              x={-168}
              y={138}
              width={50}
              height={34}
              rx={10}
              fill="none"
              stroke={strokeBase('phone-haptics')}
              strokeOpacity={lineOpacity('phone-haptics')}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={-143} cy={155} r={5} fill="none" stroke="#F1F5F9" strokeOpacity={0.85} strokeWidth={1.1} />
          </g>

          <g id="phone-flex-cables" data-phone-part="true" data-active={activeSet.has('phone-flex-cables')} style={partStyle('phone-flex-cables')}>
            <path d="M 102 -126 C 84 -112 74 -84 62 -42" fill="none" stroke={strokeBase('phone-flex-cables')} strokeOpacity={lineOpacity('phone-flex-cables')} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            <path d="M 96 -118 C 70 -92 62 -60 48 -18" fill="none" stroke="#F1F5F9" strokeOpacity={0.46} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          </g>

          <g id="phone-screws" data-phone-part="true" data-active={activeSet.has('phone-screws')} style={partStyle('phone-screws')}>
            <circle cx={-100} cy={-206} r={3.2} fill={accent} fillOpacity={0.78} />
            <circle cx={100} cy={-206} r={3.2} fill={accent} fillOpacity={0.78} />
            <circle cx={-100} cy={206} r={3.2} fill={accent} fillOpacity={0.78} />
            <circle cx={100} cy={206} r={3.2} fill={accent} fillOpacity={0.78} />
            <circle cx={0} cy={-224} r={3.2} fill={accent} fillOpacity={0.78} />
            <circle cx={0} cy={224} r={3.2} fill={accent} fillOpacity={0.78} />
          </g>
        </g>

        <desc>{phoneV2Copy.loaderTagline}</desc>
      </svg>
    );
  }
);
