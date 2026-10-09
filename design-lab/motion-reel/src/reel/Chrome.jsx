import { AbsoluteFill } from 'remotion';
import { COLOR, FONT, FRAME, ramp } from './tokens.js';
import { DURATION, SCENES } from './timing.js';

const M = FRAME.margin;

const monoLabel = {
  position: 'absolute',
  fontFamily: FONT.mono,
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: COLOR.ink,
  whiteSpace: 'pre',
};

export const DotGrid = () => (
  <AbsoluteFill>
    <svg width={FRAME.w} height={FRAME.h}>
      <defs>
        <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse" x={M % 32} y={M % 32}>
          <circle cx="1.25" cy="1.25" r="1.25" fill={COLOR.grid} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  </AbsoluteFill>
);

// Persistent frame: org mark, chapter index, progress rail. Never fades, so the loop
// seam only resets the rail.
export const Chrome = ({ frame }) => {
  const progress = frame / (DURATION - 1);
  return (
    <AbsoluteFill>
      <div style={{ ...monoLabel, left: M, top: 56 }}>DIGITAL @ CAL POLY POMONA</div>
      {SCENES.map((s) => {
        const inP = ramp(frame, [s.from, s.from + 8]);
        const outP = s.to >= DURATION ? ramp(frame, [DURATION - 14, DURATION - 4]) : ramp(frame, [s.to - 4, s.to + 2]);
        const opacity = inP * (1 - outP);
        if (opacity <= 0) return null;
        return (
          <div
            key={s.id}
            style={{
              ...monoLabel,
              right: M,
              top: 56,
              color: COLOR.muted,
              opacity,
              transform: `translateY(${(1 - inP) * 10 - outP * 10}px)`,
            }}
          >
            {s.chapter}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: M, right: M, top: 1012, height: 1, background: COLOR.hair }} />
      <div
        style={{
          position: 'absolute',
          left: M,
          top: 1011,
          height: 3,
          width: (FRAME.w - 2 * M) * progress,
          background: COLOR.accent,
        }}
      />
    </AbsoluteFill>
  );
};
