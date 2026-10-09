import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from './tokens.js';
import { Chrome, DotGrid } from './Chrome.jsx';
import { SceneWork } from './SceneWork.jsx';
import { SceneOwn } from './SceneOwn.jsx';
import { SceneClose } from './SceneClose.jsx';

// DIGITAL brand reel: "Make something worth putting your name on."
// Deterministic: every value is a pure function of the frame number.
export const Reel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <DotGrid />
      <SceneWork frame={frame} fps={fps} />
      <SceneOwn frame={frame} fps={fps} />
      <SceneClose frame={frame} />
      <Chrome frame={frame} />
    </AbsoluteFill>
  );
};
