import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Pipeline smoke test: deterministic keyframes, no external assets.
export const Smoke = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  const rule = interpolate(frame, [10, 40], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#111', color: '#f2f0ea', justifyContent: 'center', padding: 96, fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: 72, fontWeight: 700, transform: `translateY(${(1 - rise) * 40}px)`, opacity: rise }}>
        remotion smoke test
      </div>
      <div style={{ height: 4, width: `${rule}%`, background: '#f2f0ea', marginTop: 24 }} />
    </AbsoluteFill>
  );
};
