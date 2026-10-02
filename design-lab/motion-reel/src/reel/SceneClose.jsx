import { AbsoluteFill } from 'remotion';
import { COLOR, EASE, FONT, FRAME, THESIS, ramp } from './tokens.js';
import { T } from './timing.js';

// Scenes 04-06: Smart Reading's RSVP mechanism delivers the thesis one word at a time,
// the line sets, then the unsigned sign-off and build-night details.

const M = FRAME.margin;
const CX = FRAME.w / 2;
const CY = FRAME.h / 2;
const BOX = { w: 1040, h: 260 };

// Optimal recognition point: the letter the eye fixes on, pinned to the focal column.
const orpIndex = (word) => {
  const n = word.replace(/[^A-Za-z]/g, '').length;
  if (n <= 1) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  return 3;
};

const Bracket = ({ x, y, sx, sy }) => (
  <path d={`M ${x} ${y + sy * 36} L ${x} ${y} L ${x + sx * 36} ${y}`} fill="none" stroke={COLOR.ink} strokeWidth={2} />
);

const SceneRsvp = ({ frame }) => {
  if (frame < T.rsvpIn[0] || frame > T.rsvpExit[1]) return null;
  const inP = ramp(frame, T.rsvpIn);
  const exit = ramp(frame, T.rsvpExit, [0, 1], EASE.in);
  const k = Math.floor((frame - T.rsvpWord0) / T.rsvpWordFrames);
  const word = k < 0 ? null : THESIS[Math.min(k, THESIS.length - 1)];
  const L = CX - BOX.w / 2;
  const R = CX + BOX.w / 2;
  const top = CY - BOX.h / 2;
  const bot = CY + BOX.h / 2;
  const o = word ? orpIndex(word) : 0;

  return (
    <AbsoluteFill style={{ opacity: inP * (1 - exit) }}>
      <svg width={FRAME.w} height={FRAME.h} style={{ position: 'absolute' }}>
        <Bracket x={L} y={top} sx={1} sy={1} />
        <Bracket x={R} y={top} sx={-1} sy={1} />
        <Bracket x={L} y={bot} sx={1} sy={-1} />
        <Bracket x={R} y={bot} sx={-1} sy={-1} />
        <line x1={CX} x2={CX} y1={top + 20} y2={top + 52} stroke={COLOR.accent} strokeWidth={3} />
        <line x1={CX} x2={CX} y1={bot - 52} y2={bot - 20} stroke={COLOR.accent} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: L,
          top: top - 56,
          fontFamily: FONT.mono,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: COLOR.muted,
        }}
      >
        DG-002 · SMART READING · FPGA HEADS-UP GLASSES
      </div>
      <div
        style={{
          position: 'absolute',
          left: L,
          top: bot + 30,
          fontFamily: FONT.mono,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: COLOR.muted,
        }}
      >
        RSVP · ONE WORD AT A TIME · THE READER SETS THE PACE
      </div>
      {word && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: CY - 72,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            fontFamily: FONT.display,
            fontSize: 120,
            fontWeight: 500,
            lineHeight: '144px',
            color: COLOR.ink,
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ textAlign: 'right' }}>{word.slice(0, o)}</span>
          <span style={{ color: COLOR.accent }}>{word[o]}</span>
          <span style={{ textAlign: 'left' }}>{word.slice(o + 1)}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const LINES = [THESIS.slice(0, 3), THESIS.slice(3)];

const SceneThesisSign = ({ frame }) => {
  if (frame < T.thesisLine1) return null;
  const fade = 1 - ramp(frame, T.seamFade, [0, 1], EASE.in);
  const collapse = ramp(frame, T.seamCollapse, [0, 1], EASE.inOut);
  const travel = ramp(frame, T.seamTravel, [0, 1], EASE.inOut);
  const line = ramp(frame, T.signLine, [0, 1], EASE.inOut);
  const cursorVisible = frame >= T.cursorOn && frame < T.seamFade[0] && (frame - T.cursorOn) % 20 < 12;
  const LINE_W = 720;
  const LINE_TOP = 700 + 28 + 80 - 3; // label line box (28) + signature box (80) - stroke
  // Seam: the blank signature line shrinks to a 24px dot, then travels to frame centre,
  // where frame 0 already shows the build-night dot (r = 12).
  const segW = LINE_W * line + (24 - LINE_W) * collapse;
  const segH = 3 + 21 * collapse;
  const segCx = M + (LINE_W * line) / 2 + (CX - (M + LINE_W / 2)) * travel;
  const segCy = LINE_TOP + 1.5 + (CY - (LINE_TOP + 1.5)) * travel;
  const details = ['THURSDAYS 6:00 PM', 'BUILDING 17, ROOM 1635', 'NO PROJECT EXPERIENCE REQUIRED'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: segCx - segW / 2,
          top: segCy - segH / 2,
          width: segW,
          height: segH,
          borderRadius: 12 * collapse,
          background: COLOR.ink,
        }}
      />
      <AbsoluteFill style={{ opacity: fade }}>
        <div style={{ position: 'absolute', left: M, top: 236 }}>
          {LINES.map((words, li) => (
            <div
              key={li}
              style={{
                display: 'flex',
                gap: '0.24em',
                fontFamily: FONT.display,
                fontSize: 140,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.02,
                color: COLOR.ink,
              }}
            >
              {words.map((w, wi) => {
                const start = (li === 0 ? T.thesisLine1 : T.thesisLine2) + wi * 2;
                const p = ramp(frame, [start, start + 18]);
                const isLast = li === 1 && wi === words.length - 1;
                return (
                  <span key={w} style={{ overflow: 'hidden', display: 'inline-block', paddingBottom: 12 }}>
                    <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}>
                      {isLast ? (
                        <>
                          {w.slice(0, -1)}
                          <span style={{ color: COLOR.accent }}>.</span>
                        </>
                      ) : (
                        w
                      )}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* unsigned sign-off */}
        <div style={{ position: 'absolute', left: M, top: 700 }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.1em',
              lineHeight: '28px',
              color: COLOR.ink,
              opacity: ramp(frame, T.builtBy),
            }}
          >
            BUILT BY
          </div>
          <div style={{ position: 'relative', width: LINE_W, height: 80 }}>
            <div
              style={{
                position: 'absolute',
                left: 4,
                bottom: 12,
                width: 4,
                height: 52,
                background: COLOR.accent,
                opacity: cursorVisible ? 1 : 0,
              }}
            />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1200, top: 716 }}>
          {details.map((d, i) => {
            const p = ramp(frame, [T.details + i * 4, T.details + 14 + i * 4]);
            return (
              <div
                key={d}
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  color: i === 2 ? COLOR.muted : COLOR.ink,
                  lineHeight: 1.7,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SceneClose = ({ frame }) => (
  <>
    <SceneRsvp frame={frame} />
    <SceneThesisSign frame={frame} />
  </>
);
