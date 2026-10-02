import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useC } from '../tokens.js';
import { Stage } from '../DotLayer.jsx';
import { TAU, clamp, easeInOut, hash, lerp, project, shade } from '../engine.js';

// brain-orb (6 s, seamless loop — hero background only, page supplies the pause control).
// Illustrative agent loop: a ring-lattice orb turns slowly; one tool at a time is wired, a call
// packet leaves the orb, a 3-dot result returns and merges, and the wire releases. Five tools,
// staggered, so the loop never rests on one beat. Every value is periodic in u = frame / 180,
// so frame 180 ≡ frame 0. Poster = frame 0. No red: a background must not carry the trigger.

export const BRAIN_ORB_FRAMES = 180;

const TOOLS = 5;
// Uneven offsets so calls don't fire on a metronome; each tool still runs exactly one cycle per loop.
const PHASE = [0, 0.17, 0.43, 0.58, 0.81];
const RINGS = 11;
const PER = 6; // ring counts are multiples of PER → rotating by TAU / PER per loop is seamless

/** Latitude rings; each ring's point count is a multiple of PER. */
const SPHERE = (() => {
  const pts = [];
  for (let r = 0; r < RINGS; r++) {
    const lat = ((r + 0.5) / RINGS) * Math.PI - Math.PI / 2;
    const n = Math.max(1, Math.round((Math.cos(lat) * 36) / PER)) * PER;
    for (let k = 0; k < n; k++) pts.push({ lat, lon: (k / n) * TAU + (r % 2 ? Math.PI / n : 0), i: pts.length });
  }
  return pts;
})();

const bump = (x, a, b) => {
  // 0 outside [a, b], smooth 0→1→0 inside
  if (x <= a || x >= b) return 0;
  return Math.sin(((x - a) / (b - a)) * Math.PI) ** 2;
};

export const BrainOrb = () => {
  const C = useC();
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const u = (fr % BRAIN_ORB_FRAMES) / BRAIN_ORB_FRAMES;
  const cx = width / 2;
  const cy = height / 2;
  const R = tall ? 220 : 210; // orb radius px
  const TR = tall ? 400 : 420; // tool ring radius px
  const yaw = 0.6 + (u * TAU) / PER;
  const breathe = 1 + 0.025 * Math.sin(u * TAU * 2);

  // tools: fixed positions on an ellipse around the orb
  const tools = Array.from({ length: TOOLS }, (_, k) => {
    const ang = -Math.PI / 2 + (k / TOOLS) * TAU + 0.31;
    return [cx + Math.cos(ang) * TR * (tall ? 0.95 : 1.25), cy + Math.sin(ang) * TR * (tall ? 1.25 : 0.82)];
  });

  // per-tool cycle phase: tool k is active over 0.0..0.62 of its own (shifted) cycle
  const calls = tools.map((pos, k) => {
    const v = (u + PHASE[k]) % 1;
    const wire = clamp(v / 0.12) * (1 - clamp((v - 0.5) / 0.12)); // draw on, hold, release
    const out = easeInOut(clamp((v - 0.08) / 0.16)); // call packet 0 → 1
    const back = easeInOut(clamp((v - 0.28) / 0.2)); // result 1 → 0
    const merge = bump(v, 0.44, 0.62); // orb swell as the result merges
    return { pos, v, wire, out, back, merge };
  });
  const swell = 1 + 0.04 * Math.max(...calls.map((c) => c.merge));

  const dots = SPHERE.map((p) => {
    const x = Math.cos(p.lat) * Math.cos(p.lon);
    const y = Math.sin(p.lat);
    const z = Math.cos(p.lat) * Math.sin(p.lon);
    const [px, py, pz] = project(x, y, z, yaw, 0.35);
    const jitter = 1 + 0.018 * Math.sin(u * TAU * 3 + hash(p.i, 7) * TAU);
    const rr = R * breathe * swell * jitter;
    return { x: cx + px * rr, y: cy + py * rr, z: pz, r: 2.2 + 1.3 * (pz + 1) * 0.5, a: shade(pz, 0.95) };
  }).sort((a, b) => a.z - b.z);

  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        {calls.map(({ pos: [tx, ty], wire, out, back, v }, k) => {
          const ang = Math.atan2(ty - cy, tx - cx);
          const sx = cx + Math.cos(ang) * (R + 26);
          const sy = cy + Math.sin(ang) * (R + 26);
          const ex = tx - Math.cos(ang) * 34;
          const ey = ty - Math.sin(ang) * 34;
          const live = wire > 0.01;
          return (
            <g key={k}>
              {/* planned link: always dotted */}
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={C.ink} strokeOpacity={0.16} strokeWidth={1.5} strokeDasharray="1 7" strokeLinecap="round" />
              {/* live link draws on from the orb */}
              {live && <line x1={sx} y1={sy} x2={lerp(sx, ex, wire)} y2={lerp(sy, ey, wire)} stroke={C.ink} strokeOpacity={0.75} strokeWidth={1.5} strokeLinecap="round" />}
              {/* tool node: 3×3, brighter while wired */}
              {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={tx + ((i % 3) - 1) * 13} cy={ty + (Math.floor(i / 3) - 1) * 13} r={3.4} fill={C.ink} fillOpacity={lerp(0.35, 0.95, wire)} />
              ))}
              {/* call packet */}
              {out > 0 && out < 1 && <circle cx={lerp(sx, ex, out)} cy={lerp(sy, ey, out)} r={6} fill={C.ink} />}
              {/* result: 3 dots return */}
              {back > 0 && back < 1 && v < 0.6 &&
                [-1, 0, 1].map((o) => {
                  const nx = -Math.sin(ang) * o * 12 * (1 - back);
                  const ny = Math.cos(ang) * o * 12 * (1 - back);
                  return <circle key={o} cx={lerp(ex, sx, back) + nx} cy={lerp(ey, sy, back) + ny} r={4.5} fill={C.ink} fillOpacity={0.95} />;
                })}
            </g>
          );
        })}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={C.ink} fillOpacity={d.a} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};
