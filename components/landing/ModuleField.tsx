'use client';

import type { MutableRefObject } from 'react';

/** Instanced block field — full implementation lands in the next task. */
export default function ModuleField(_: { progressRef: MutableRefObject<number> }) {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#16161a" />
    </mesh>
  );
}
