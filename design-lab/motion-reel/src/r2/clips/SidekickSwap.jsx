import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../tokens.js';
import { Stage } from '../DotLayer.jsx';
import { getBoard, clamp, easeInOut, easeOutBack, lerp } from '../engine.js';
import { IsoBoard, isoBounds, iso } from '../IsoBoard.jsx';

// sidekick-swap (4 s, once): the fingerprint module lifts off the power carrier, slides out along
// the board's x axis, waits, then slides back and seats. Illustrative stacking; both boards are the
// real KiCad geometry. The one red mark is the seat (carrier J3 area) lighting as the module locks.
// Rest (final frame / poster) = module seated, seat marked.

export const SIDEKICK_SWAP_FRAMES = 120;

const carrier = getBoard('zynq-carrier-power');
const finger = getBoard('fingerprint');

// Module seat on the carrier (board mm). Module sits over the right half, near J3.
const SEAT = { x: 24, y: 8 };
const STANDOFF = 7; // mm above the carrier when seated
const LIFT = 7; // extra mm while travelling
const SLIDE = 36; // mm out along +x
const MARK = { x: 47.6, y: 12 }; // J3 connector (real footprint), its edge just outside the module's shadow

const seg = (fr, a, b) => clamp((fr - a) / (b - a));

// Insertion: quick acceleration, long heavy deceleration (quintic out), so the module reads as mass.
const decel = (t) => 1 - (1 - t) ** 5;

function moduleState(fr) {
  // 0–12 hold · 12–30 lift · 30–52 slide out · 52–66 hold · 66–88 slide in · 88–104 lower + seat · hold
  const lift = easeInOut(seg(fr, 12, 30)) * (1 - easeOutBack(seg(fr, 88, 104)));
  const out = easeInOut(seg(fr, 30, 52)) * (1 - decel(seg(fr, 66, 90)));
  return { dx: out * SLIDE, dz: lift * LIFT };
}

function layout(width, height) {
  const tall = height > width;
  // Centre on the REST pose (carrier + seated module) so the poster is balanced; scale so the
  // slid-out module still fits on the side it travels to.
  const bc = isoBounds(carrier, 0, 0, 0);
  const bf = isoBounds(finger, 0, 0, STANDOFF + LIFT);
  const [rx, ry] = iso(SEAT.x, SEAT.y, 0);
  const [sx, sy] = iso(SEAT.x + SLIDE, SEAT.y, 0);
  const restMinX = Math.min(bc.minX, rx + bf.minX);
  const restMaxX = Math.max(bc.maxX, rx + bf.maxX);
  const restMinY = Math.min(bc.minY, ry + bf.minY);
  const restMaxY = Math.max(bc.maxY, ry + bf.maxY);
  const mx = (restMinX + restMaxX) / 2;
  const my = (restMinY + restMaxY) / 2;
  const halfW = Math.max(mx - restMinX, sx + bf.maxX - mx);
  const halfH = Math.max(my - restMinY, sy + bf.maxY - my, restMaxY - my);
  const m = tall ? 0.06 : 0.08;
  const s = Math.min((width * (0.5 - m)) / halfW, (height * (0.5 - m)) / halfH);
  return { s, ox: width / 2 - mx * s, oy: height / 2 - my * s };
}

export const SidekickSwap = () => {
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { s, ox, oy } = layout(width, height);
  const { dx, dz } = moduleState(fr);
  const [mx, my] = iso(SEAT.x + dx, SEAT.y, 0);
  const seatA = clamp(dx / 12); // dashed seat outline shows while the module is away
  const lock = seg(fr, 100, 106);
  const p = (x, y, z = 0) => {
    const [a, b] = iso(x, y, z);
    return [ox + a * s, oy + b * s];
  };
  const { w, h } = finger.size;
  const seatPath = [[0, 0], [w, 0], [w, h], [0, h]].map(([x, y], i) => `${i ? 'L' : 'M'}${p(SEAT.x + x, SEAT.y + y).join(' ')}`).join('') + 'Z';
  const posts = [[1.5, 1.5], [w - 1.5, 1.5], [w - 1.5, h - 1.5], [1.5, h - 1.5]];
  const [mkx, mky] = p(MARK.x, MARK.y, 0);
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        <IsoBoard board={carrier} ox={ox} oy={oy} s={s} explode={0} />
        {/* empty seat: dashed while the module is out */}
        <path d={seatPath} fill="none" stroke={C.ink} strokeOpacity={0.5 * seatA} strokeWidth={1.5} strokeDasharray="6 6" />
        {/* standoff posts: leaders from carrier to module corners */}
        {posts.map(([x, y], i) => {
          const a = p(SEAT.x + dx + x, SEAT.y + y, 0);
          const b = p(SEAT.x + dx + x, SEAT.y + y, STANDOFF + dz);
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.ink} strokeOpacity={0.35 * (1 - seatA)} strokeWidth={1.2} strokeDasharray="2 4" />;
        })}
        <IsoBoard board={finger} ox={ox + mx * s} oy={oy + my * s} s={s} explode={0} lift={STANDOFF + dz} opaque />
        {lock > 0 && (
          <g>
            <circle cx={mkx} cy={mky} r={lerp(26, 9, lock)} fill="none" stroke={C.trigger} strokeOpacity={1 - lock} strokeWidth={2} />
            <circle cx={mkx} cy={mky} r={8} fill={C.trigger} opacity={lock} />
          </g>
        )}
      </Stage>
    </AbsoluteFill>
  );
};
