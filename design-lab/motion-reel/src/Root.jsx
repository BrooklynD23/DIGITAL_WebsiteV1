import { Composition } from 'remotion';
import { Smoke } from './Smoke.jsx';

// Compositions live here. Smoke is a pipeline check only, not a brand concept.
export const Root = () => (
  <Composition id="Smoke" component={Smoke} durationInFrames={45} fps={30} width={1280} height={720} />
);
