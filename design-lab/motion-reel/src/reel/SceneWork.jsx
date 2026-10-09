import { AbsoluteFill, spring } from 'remotion';
import { COLOR, FONT, FRAME, SPRING, SUBSYSTEMS, ramp, EASE } from './tokens.js';
import { T } from './timing.js';

// Scenes 01 + 02: one person (a dot) on build night, then the seven subsystems of
// DG-001 radiate from that dot and lock into a flat-lay of the phone.

const CX = FRAME.w / 2;
const CY = FRAME.h / 2;
const RING_R = 300;
const PHONE = { x: 1140, y: 236, w: 300, h: 616, r: 40 };
const BAND_H = PHONE.h / SUBSYSTEMS.length;
const NODE_X = PHONE.x + PHONE.w + 48;
const PHONE_PERIM = 2 * (PHONE.w + PHONE.h); // close enough for a dash draw
const HIGHLIGHT = 2; // Firmware / Embedded is traced in scene 03

const ringPos = (i) => {
  const a = (-90 + (i * 360) / SUBSYSTEMS.length) * (Math.PI / 180);
  return { x: CX + RING_R * Math.cos(a), y: CY + RING_R * Math.sin(a) };
};
const flatPos = (i) => ({ x: NODE_X, y: PHONE.y + BAND_H * (i + 0.5) });
const lerp = (a, b, t) => a + (b - a) * t;

const CAPTION = 'THURSDAY 6:00 PM  ·  BUILD NIGHT';

const CutLine = ({ frame, start, children, style }) => {
  const p = ramp(frame, [start, start + 20]);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: 8, ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{children}</div>
    </div>
  );
};

export const SceneWork = ({ frame, fps }) => {
  if (frame > T.workExit[1]) return null;
  const hub = 1; // present from frame 0: the loop seam lands here
  const flat = spring({ frame: frame - T.flatStart, fps, config: SPRING.settle, durationInFrames: T.flatFrames });
  const hubFade = 1 - ramp(frame, [T.flatStart, T.flatStart + 16]);
  const typed = Math.round(ramp(frame, T.captionType, [0, CAPTION.length], (t) => t));
  const captionOpacity = 1 - ramp(frame, T.captionOut);
  const outline = ramp(frame, [T.flatStart + 6, T.flatStart + 38], [0, 1], EASE.inOut);
  const bands = ramp(frame, [T.flatStart + 16, T.flatStart + 38]);
  const highlight = ramp(frame, T.highlight);
  const exit = ramp(frame, T.workExit, [0, 1], EASE.in);

  const nodes = SUBSYSTEMS.map((name, i) => {
    const s = spring({ frame: frame - (T.ringIn + i * T.ringStagger), fps, config: SPRING.settle, durationInFrames: 20 });
    const r = ringPos(i);
    const f = flatPos(i);
    return { name, i, s, x: lerp(r.x, f.x, flat), y: lerp(r.y, f.y, flat), rx: r.x, ry: r.y };
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateX(${-exit * 60}px)` }}>
      <svg width={FRAME.w} height={FRAME.h} style={{ position: 'absolute' }}>
        {/* spokes: hub to each discipline */}
        {nodes.map((n) => (
          <line
            key={`spoke-${n.i}`}
            x1={CX}
            y1={CY}
            x2={lerp(CX, n.rx, n.s)}
            y2={lerp(CY, n.ry, n.s)}
            stroke={COLOR.hair}
            strokeWidth={1.5}
            opacity={hubFade}
          />
        ))}
        {/* phone flat-lay */}
        <rect
          x={PHONE.x}
          y={PHONE.y}
          width={PHONE.w}
          height={PHONE.h}
          rx={PHONE.r}
          fill="none"
          stroke={COLOR.ink}
          strokeWidth={2}
          strokeDasharray={PHONE_PERIM}
          strokeDashoffset={PHONE_PERIM * (1 - outline)}
        />
        <rect x={PHONE.x + 1} y={PHONE.y + BAND_H * HIGHLIGHT} width={PHONE.w - 2} height={BAND_H} fill={COLOR.ink} opacity={highlight} />
        {SUBSYSTEMS.slice(1).map((_, k) => {
          const y = PHONE.y + BAND_H * (k + 1);
          return (
            <line
              key={`band-${k}`}
              x1={PHONE.x}
              x2={PHONE.x + PHONE.w}
              y1={y}
              y2={y}
              stroke={COLOR.ink}
              strokeOpacity={0.35}
              opacity={bands}
            />
          );
        })}
        {nodes.map((n) => (
          <line
            key={`lead-${n.i}`}
            x1={PHONE.x + PHONE.w}
            x2={n.x}
            y1={n.y}
            y2={n.y}
            stroke={COLOR.ink}
            strokeOpacity={0.35}
            opacity={bands}
          />
        ))}
        {/* hub = one person */}
        <circle cx={CX} cy={CY} r={12 * hub} fill={COLOR.ink} opacity={hubFade} />
        {nodes.map((n) => (
          <circle key={`node-${n.i}`} cx={n.x} cy={n.y} r={8 * n.s} fill={COLOR.ink} />
        ))}
      </svg>

      {/* caption, typed */}
      <div
        style={{
          position: 'absolute',
          top: CY + 44,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: COLOR.ink,
          opacity: captionOpacity,
          whiteSpace: 'pre',
        }}
      >
        {CAPTION.slice(0, typed)}
      </div>

      {/* subsystem labels: centered under the node on the ring, right of it in the flat-lay */}
      {nodes.map((n) => (
        <div
          key={`label-${n.i}`}
          style={{
            position: 'absolute',
            left: n.x + 22 * flat,
            top: n.y + lerp(20, -17, flat),
            transform: `translateX(${-(1 - flat) * 50}%)`,
            fontFamily: FONT.display,
            fontSize: 26,
            fontWeight: 500,
            color: COLOR.ink,
            whiteSpace: 'nowrap',
            opacity: n.s,
          }}
        >
          <span style={{ fontFamily: FONT.mono, fontSize: 18, color: COLOR.muted, marginRight: 12, opacity: flat }}>
            {String(n.i + 1).padStart(2, '0')}
          </span>
          {n.name}
        </div>
      ))}

      {/* headline */}
      <div style={{ position: 'absolute', left: FRAME.margin, top: 330 }}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: COLOR.muted,
            opacity: ramp(frame, [T.flatStart + 6, T.flatStart + 22]),
            marginBottom: 24,
          }}
        >
          DG-001 · MODULAR SMARTPHONE · ACTIVE
        </div>
        {['Seven subsystems.', 'One phone.'].map((line, k) => (
          <CutLine key={line} frame={frame} start={T.flatStart + 10 + k * 6}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 104,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.04,
                color: COLOR.ink,
              }}
            >
              {line}
            </div>
          </CutLine>
        ))}
      </div>
    </AbsoluteFill>
  );
};
