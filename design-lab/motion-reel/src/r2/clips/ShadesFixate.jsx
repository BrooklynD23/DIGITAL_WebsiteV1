import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../tokens.js';
import { FONT } from '../fonts.js';
import { DotLayer, Stage } from '../DotLayer.jsx';
import { frame as engineFrame, clamp, easeOut } from '../engine.js';

// shades-fixate (4 s, once): the live engine's `fixate` verb (scattered dots converge on one point
// inside a reticle), then a single word lands on that point, RSVP style: the word's optimal
// recognition letter sits exactly on the fixation point and is the clip's one red mark.
// Rest (final frame / poster) = word on the reticle.

export const SHADES_FIXATE_FRAMES = 120;

const ENGINE = 560;
const WORD = ['f', 'o', 'cus']; // ORP = 2nd letter of a 5-letter word (≈ 35% in)

export const ShadesFixate = () => {
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const draw = tall ? 1240 : 1300;
  const cx = width / 2;
  const cy = height / 2;
  const t = clamp(fr / 78);
  const f = engineFrame('fixate', t, { size: ENGINE, seed: 'shades-fixate' });
  const land = easeOut(clamp((fr - 80) / 14)); // word lands over ~0.5 s
  // the centre point hands over to the word: hide the engine's point dot as the word arrives
  const dots = f.dots.filter((d) => !(Math.abs(d.x) < 1e-6 && Math.abs(d.y) < 1e-6) || land < 0.5);
  const size = tall ? 84 : 88;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        <DotLayer f={{ dots, lines: f.lines }} cx={cx} cy={cy} size={draw} k={draw / ENGINE} stroke={1.4} />
      </Stage>
      {land > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx - 600,
            width: 1200,
            top: cy - size * 0.62,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            fontFamily: FONT.reading,
            fontSize: size,
            lineHeight: `${size * 1.2}px`,
            fontWeight: 500,
            color: C.ink,
            opacity: land,
            transform: `translateY(${(1 - land) * 10}px)`,
          }}
        >
          <span style={{ textAlign: 'right' }}>{WORD[0]}</span>
          <span style={{ color: C.trigger }}>{WORD[1]}</span>
          <span style={{ textAlign: 'left' }}>{WORD[2]}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
