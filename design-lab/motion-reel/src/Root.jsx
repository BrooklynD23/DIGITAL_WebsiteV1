import { Composition } from 'remotion';
import { Smoke } from './Smoke.jsx';
import { Reel } from './reel/Reel.jsx';
import { DURATION } from './reel/timing.js';

// Compositions live here. Smoke is a pipeline check only, not a brand concept.
export const Root = () => (
  <>
    <Composition id="Smoke" component={Smoke} durationInFrames={45} fps={30} width={1280} height={720} />
    <Composition id="Reel" component={Reel} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
  </>
);
