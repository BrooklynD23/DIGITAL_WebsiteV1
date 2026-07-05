'use client';

/**
 * The instanced block field. A time-based intro assembles the logo formation;
 * after that, scroll progress drives eased transitions between formations:
 * logo → orbit → compass → grid → stack → wave → chamber (phone + pedestals).
 */

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LANDING_CONTENT } from '@/lib/data/landing';
import {
  BLOCK_COUNT, sphere, compass, blueprintGrid, stack, wave, pedestals,
  phoneSlab, logoFromImage, type Formation,
} from './formations';

const { clamp, lerp } = THREE.MathUtils;
const ease = (t: number) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };

/** progress boundaries between consecutive formations (spec §2.4). */
const SEGS = [0.12, 0.25, 0.4, 0.55, 0.7, 0.82] as const;

interface ModuleFieldProps {
  progressRef: MutableRefObject<number>;
  introDone: boolean;
  onIntroEnd: () => void;
}

/** Chamber = phone slab for the first half of blocks, pedestals for the rest. */
function mergeChamber(a: Formation, b: Formation): Formation {
  const out = new Float32Array(a.length);
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const src = i < BLOCK_COUNT / 2 ? a : b;
    out[i * 3] = src[i * 3]; out[i * 3 + 1] = src[i * 3 + 1]; out[i * 3 + 2] = src[i * 3 + 2];
  }
  return out;
}

export default function ModuleField({ progressRef, introDone, onIntroEnd }: ModuleFieldProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [, setLogoReady] = useState(false);
  const intro = useRef(0); // 0→1 over ~2.8s
  const introFired = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const forms = useMemo(() => {
    const start = sphere(BLOCK_COUNT, 6);
    return {
      start,
      list: [
        start, // index 0 = logo; replaced when sampling resolves
        sphere(BLOCK_COUNT, 3),
        compass(BLOCK_COUNT),
        blueprintGrid(BLOCK_COUNT),
        stack(BLOCK_COUNT),
        wave(BLOCK_COUNT),
        mergeChamber(phoneSlab(BLOCK_COUNT), pedestals(BLOCK_COUNT)),
      ] as Formation[],
    };
  }, []);

  useEffect(() => {
    logoFromImage(LANDING_CONTENT.logoSrc, BLOCK_COUNT)
      .then((f) => { forms.list[0] = f; setLogoReady(true); })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') console.warn('[landing] logo sample failed:', err);
        forms.list[0] = blueprintGrid(BLOCK_COUNT); // graceful fallback shape
        setLogoReady(true);
      });
  }, [forms]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;

    if (!introDone) {
      intro.current = Math.min(1, intro.current + delta / 2.8);
      if (intro.current >= 1 && !introFired.current) {
        introFired.current = true;
        onIntroEnd();
      }
    }

    const p = progressRef.current;
    let from: Formation; let to: Formation; let t: number;
    if (!introDone || p <= SEGS[0]) {
      from = forms.start; to = forms.list[0]; t = introDone ? 1 : ease(intro.current);
    } else if (p >= SEGS[SEGS.length - 1]) {
      from = forms.list[forms.list.length - 1]; to = from; t = 1;
    } else {
      let seg = 0;
      while (seg < SEGS.length - 1 && p > SEGS[seg + 1]) seg++;
      from = forms.list[seg]; to = forms.list[seg + 1];
      t = ease((p - SEGS[seg]) / (SEGS[seg + 1] - SEGS[seg]));
    }

    for (let i = 0; i < BLOCK_COUNT; i++) {
      dummy.position.set(
        lerp(from[i * 3], to[i * 3], t),
        lerp(from[i * 3 + 1], to[i * 3 + 1], t),
        lerp(from[i * 3 + 2], to[i * 3 + 2], t)
      );
      dummy.rotation.set(0, (i % 7) * 0.12 + t * 0.4, 0);
      dummy.scale.setScalar(0.11 + (i % 5) * 0.012);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BLOCK_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#16161a" roughness={0.5} metalness={0.15} />
    </instancedMesh>
  );
}
