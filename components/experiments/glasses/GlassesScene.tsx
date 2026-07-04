'use client';

/**
 * R3F <Canvas> wrapper for the smart-glasses hero. Client-only (mounted via dynamic
 * import with ssr:false). Uses plain lights only — NO drei <Environment preset>, which
 * would fetch an HDR from a CDN and break the static-export / offline contract.
 */

import { Suspense, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import GlassesModel from './GlassesModel';

interface GlassesSceneProps {
  progressRef: MutableRefObject<number>;
}

export default function GlassesScene({ progressRef }: GlassesSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0 z-[2]"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#9ec5ff" />
      <pointLight position={[0, -3, 4]} intensity={0.6} color="#ffe17a" />
      <Suspense fallback={null}>
        <GlassesModel progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
