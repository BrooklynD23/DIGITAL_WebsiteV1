'use client';

/** R3F canvas for the Modules landing. Client-only; plain local lights only. */

import { Suspense, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import ModuleField from './ModuleField';

export interface LandingSceneProps {
  progressRef: MutableRefObject<number>;
  onPortal: (href: string) => void;
  introDone: boolean;
  onIntroEnd: () => void;
}

export default function LandingScene({ progressRef, onPortal, introDone, onIntroEnd }: LandingSceneProps) {
  void onPortal; // consumed by ProductChamber in Task 7
  return (
    <Canvas
      className="!absolute inset-0 z-[2]"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7], fov: 40 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <directionalLight position={[0, 3, -6]} intensity={0.7} color="#fff2df" />
      <Suspense fallback={null}>
        <ModuleField progressRef={progressRef} introDone={introDone} onIntroEnd={onIntroEnd} />
      </Suspense>
    </Canvas>
  );
}
