import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useC } from '../tokens.js';
import { FONT } from '../fonts.js';
import { Stage } from '../DotLayer.jsx';
import { getBoard, clamp } from '../engine.js';
import { IsoBoard, TIER, isoBounds, iso } from '../IsoBoard.jsx';

// sidekick-explode (6 s, scrub): the REAL power carrier + fingerprint boards (KiCad geometry)
// separate into their copper / pad / silkscreen / substrate tiers in 30° iso.
// Built to be scrubbed: one continuous, nearly linear motion, no cuts, no camera jumps.
// Frame 0 = assembled, last frame (rest/poster) = fully exploded.

export const SIDEKICK_EXPLODE_FRAMES = 180;

const GAP = 6.5; // mm per tier, shared so both stacks read as one system
const carrier = getBoard('zynq-carrier-power');
const finger = getBoard('fingerprint');

// Gentle in-out (sine) so scrubbing feels steady: velocity never spikes, ends ease to rest.
const sine = (t) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));
const span = (fr, a, b) => sine((fr - a) / (b - a));

const LABELS = [
  ['F.Silk', 'F.SILK'],
  ['F.Pads', 'F.PADS'],
  ['F.Cu', 'F.CU'],
  ['substrate', 'FR-4 1.6'],
  ['B.Cu', 'B.CU'],
  ['B.Pads', 'B.PADS'],
  ['B.Silk', 'B.SILK'],
];

function layout(width, height) {
  const tall = height > width;
  const bc = isoBounds(carrier, GAP);
  const bf = isoBounds(finger, GAP);
  // Board origins in iso-mm space. 16:9 = side by side; 4:5 = carrier above, module below-right.
  const fOff = tall ? [bc.maxX - bf.maxX + 2, bc.maxY - bf.minY + 8] : [bc.maxX - bf.minX + 40, (bc.minY + bc.maxY) / 2 - (bf.minY + bf.maxY) / 2 + 6];
  const labelW = 44; // iso-mm reserved for layer tags right of the carrier (16:9) or module (4:5)
  const minX = Math.min(bc.minX, fOff[0] + bf.minX);
  const maxX = Math.max(bc.maxX + (tall ? labelW : 0), fOff[0] + bf.maxX + (tall ? 0 : 0));
  const minY = Math.min(bc.minY, fOff[1] + bf.minY);
  const maxY = Math.max(bc.maxY, fOff[1] + bf.maxY);
  const mx = tall ? 0.1 : 0.1;
  const my = tall ? 0.1 : 0.1;
  const s = Math.min((width * (1 - 2 * mx)) / (maxX - minX), (height * (1 - 2 * my)) / (maxY - minY));
  const ox = width / 2 - ((minX + maxX) / 2) * s;
  const oy = height / 2 - ((minY + maxY) / 2) * s;
  return { s, carrier: [ox, oy], finger: [ox + fOff[0] * s, oy + fOff[1] * s], tall };
}

export const SidekickExplode = () => {
  const C = useC();
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = layout(width, height);
  const eC = span(fr, 14, 150);
  const eF = span(fr, 30, 166);
  // No camera move: a locked frame keeps scrubbing legible (and the GOP-15 encode inside budget).
  const z = 1;
  const tagA = clamp((eC - 0.72) / 0.28);
  const [cx0, cy0] = L.carrier;
  const tagX = cx0 + iso(carrier.size.w, 0)[0] * L.s + 22;
  const tagY = (tier) => cy0 + (iso(carrier.size.w, 0)[1] - TIER[tier] * GAP * eC) * L.s;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        <g transform={`translate(${width / 2} ${height / 2}) scale(${z}) translate(${-width / 2} ${-height / 2})`}>
          <IsoBoard board={carrier} ox={L.carrier[0]} oy={L.carrier[1]} s={L.s} explode={eC} gap={GAP} />
          <IsoBoard board={finger} ox={L.finger[0]} oy={L.finger[1]} s={L.s} explode={eF} gap={GAP} />
          {tagA > 0 && (
            <g opacity={tagA} fontFamily={FONT.mono} fontSize={L.tall ? 24 : 26} fontWeight={500} fill={C.ink2} letterSpacing="0.08em">
              {LABELS.map(([tier, text]) => (
                <g key={tier}>
                  <line x1={tagX - 18} y1={tagY(tier)} x2={tagX - 6} y2={tagY(tier)} stroke={C.ink2} strokeWidth={1.5} />
                  <text x={tagX} y={tagY(tier)} dominantBaseline="middle">
                    {text}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
