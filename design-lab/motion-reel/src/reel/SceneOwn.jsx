import { AbsoluteFill, interpolate, spring } from 'remotion';
import { COLOR, EASE, FONT, FRAME, OWNERSHIP, SPRING, ramp } from './tokens.js';
import { T } from './timing.js';

// Scene 03: one subsystem traced through the ownership model.
// A marker stops at owner -> review -> test gate -> repair plan (phoneV2.ts:295-300).

const M = FRAME.margin;
const TRACK_Y = 600;
const X0 = M + 190;
const X1 = FRAME.w - M - 190;
const STATION_X = OWNERSHIP.map((_, i) => X0 + (i * (X1 - X0)) / (OWNERSHIP.length - 1));
const GATE = 2;

export const SceneOwn = ({ frame, fps }) => {
  if (frame < T.workExit[1] || frame > T.ownExit[1]) return null;
  const [a0, a1, a2, a3] = T.stations;
  const exit = ramp(frame, T.ownExit, [0, 1], EASE.in);
  const track = ramp(frame, T.track, [0, 1], EASE.inOut);
  const markerIn = spring({ frame: frame - (a0 - 6), fps, config: SPRING.tick });
  const markerX = interpolate(
    frame,
    [a0, a0 + 4, a1, a1 + 4, a2, a2 + 4, a3],
    [STATION_X[0], STATION_X[0], STATION_X[1], STATION_X[1], STATION_X[2], STATION_X[2], STATION_X[3]],
    { easing: EASE.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div style={{ position: 'absolute', left: M, top: 176 }}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: COLOR.muted,
            opacity: ramp(frame, T.ownMeta),
            marginBottom: 20,
          }}
        >
          03 · FIRMWARE / EMBEDDED · THE OWNERSHIP MODEL
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
          <div
            style={{
              transform: `translateY(${(1 - ramp(frame, T.ownTitle)) * 110}%)`,
              fontFamily: FONT.display,
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.04,
              color: COLOR.ink,
            }}
          >
            You take a subsystem.
          </div>
        </div>
      </div>

      <svg width={FRAME.w} height={FRAME.h} style={{ position: 'absolute' }}>
        <line x1={X0} x2={X0 + (X1 - X0) * track} y1={TRACK_Y} y2={TRACK_Y} stroke={COLOR.hair} strokeWidth={2} />
        <line x1={X0} x2={markerX} y1={TRACK_Y} y2={TRACK_Y} stroke={COLOR.ink} strokeWidth={3} opacity={markerIn > 0 ? 1 : 0} />
        {STATION_X.map((x, i) => {
          const lit = spring({ frame: frame - T.stations[i], fps, config: SPRING.tick });
          const seen = ramp(frame, [T.track[0] + 2 + i * 5, T.track[0] + 14 + i * 5]);
          const color = i === GATE ? COLOR.accent : COLOR.ink;
          if (i === GATE) {
            // gate glyph: two posts, filled when the marker clears it
            return (
              <g key={i} opacity={seen}>
                <rect x={x - 14} y={TRACK_Y - 26} width={6} height={52} fill={color} opacity={0.35 + 0.65 * lit} />
                <rect x={x + 8} y={TRACK_Y - 26} width={6} height={52} fill={color} opacity={0.35 + 0.65 * lit} />
              </g>
            );
          }
          return (
            <g key={i} opacity={seen}>
              <rect x={x - 11} y={TRACK_Y - 11} width={22} height={22} fill={COLOR.paper} stroke={color} strokeWidth={2} />
              <rect
                x={x - 11}
                y={TRACK_Y - 11}
                width={22}
                height={22}
                fill={color}
                transform={`translate(${x} ${TRACK_Y}) scale(${lit}) translate(${-x} ${-TRACK_Y})`}
              />
            </g>
          );
        })}
        <circle cx={markerX} cy={TRACK_Y} r={13 * markerIn} fill={COLOR.ink} />
      </svg>

      {OWNERSHIP.map((st, i) => {
        const p = ramp(frame, [T.stations[i] - 4, T.stations[i] + 10]);
        const q = ramp(frame, [T.stations[i] + 2, T.stations[i] + 14]);
        return (
          <div
            key={st.label}
            style={{
              position: 'absolute',
              left: STATION_X[i],
              top: TRACK_Y + 52,
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: 380,
            }}
          >
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 44,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: i === GATE ? COLOR.accent : COLOR.ink,
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px)`,
              }}
            >
              {st.label}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 21, color: COLOR.muted, marginTop: 12, opacity: q }}>{st.rule}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
