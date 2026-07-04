'use client';

/**
 * R3F <Canvas> wrapper for the smart-glasses hero. Client-only (mounted via dynamic
 * import with ssr:false). Uses local lighting only — NO drei <Environment preset>, which
 * would fetch an HDR from a CDN and break the static-export / offline contract.
 */

import { Suspense, useEffect, type MutableRefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three-stdlib';
import * as THREE from 'three';
import GlassesModel from './GlassesModel';

interface GlassesSceneProps {
  progressRef: MutableRefObject<number>;
}

/** PMREM-baked RoomEnvironment — ships in three-stdlib, zero network fetches. */
function LocalEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

export default function GlassesScene({ progressRef }: GlassesSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0 z-[2]"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
    >
      <LocalEnvironment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#cfd8e6" />
      <directionalLight position={[0, 4, -6]} intensity={0.9} color="#fff4dd" />
      <Suspense fallback={null}>
        <GlassesModel progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
