import { Composition } from 'remotion';
import './fonts.js';
import { ASPECTS, FPS, PALETTES, PaletteContext, WORLDS } from './tokens.js';
import { HomeStages, HOME_STAGES_FRAMES } from './clips/HomeStages.jsx';
import { SidekickExplode, SIDEKICK_EXPLODE_FRAMES } from './clips/SidekickExplode.jsx';
import { SidekickSwap, SIDEKICK_SWAP_FRAMES } from './clips/SidekickSwap.jsx';
import { ShadesLightpath, SHADES_LIGHTPATH_FRAMES } from './clips/ShadesLightpath.jsx';
import { ShadesFixate, SHADES_FIXATE_FRAMES } from './clips/ShadesFixate.jsx';
import { BrainOrb, BRAIN_ORB_FRAMES } from './clips/BrainOrb.jsx';
import { BrainContext, BRAIN_CONTEXT_FRAMES } from './clips/BrainContext.jsx';

// Clip registry. Names are the manifest contract (app/design-lab/r2/_system/cine/manifest.ts).
// Remotion ids cannot contain '/', so each clip registers as <name>--16x9 and <name>--4x5.
export const CLIPS = [
  { name: 'home-stages', component: HomeStages, frames: HOME_STAGES_FRAMES },
  { name: 'sidekick-explode', component: SidekickExplode, frames: SIDEKICK_EXPLODE_FRAMES },
  { name: 'sidekick-swap', component: SidekickSwap, frames: SIDEKICK_SWAP_FRAMES },
  { name: 'shades-lightpath', component: ShadesLightpath, frames: SHADES_LIGHTPATH_FRAMES },
  { name: 'shades-fixate', component: ShadesFixate, frames: SHADES_FIXATE_FRAMES },
  { name: 'brain-orb', component: BrainOrb, frames: BRAIN_ORB_FRAMES },
  { name: 'brain-context', component: BrainContext, frames: BRAIN_CONTEXT_FRAMES },
];

/** Wrap a clip so it renders with one world's palette. */
const inWorld = (Component, world) => {
  const Wrapped = () => (
    <PaletteContext.Provider value={PALETTES[world]}>
      <Component />
    </PaletteContext.Provider>
  );
  Wrapped.displayName = `${Component.name}-${world}`;
  return Wrapped;
};

/** Composition id: signal keeps the original ids (<name>--<aspect>); apple = <name>--apple--<aspect>. */
export const compId = (name, world, aspect) => (world === 'signal' ? `${name}--${aspect}` : `${name}--${world}--${aspect}`);

const VARIANTS = CLIPS.flatMap((c) => WORLDS.map((world) => ({ ...c, world, component: inWorld(c.component, world) })));

export const R2Compositions = () => (
  <>
    {VARIANTS.flatMap((c) =>
      Object.entries(ASPECTS).map(([aspect, { width, height }]) => (
        <Composition
          key={compId(c.name, c.world, aspect)}
          id={compId(c.name, c.world, aspect)}
          component={c.component}
          durationInFrames={c.frames}
          fps={FPS}
          width={width}
          height={height}
        />
      )),
    )}
  </>
);
