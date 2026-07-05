'use client';

/**
 * Final-beat exhibits. The block field forms the phone; this adds the real
 * glasses FBX on the right pedestal, invisible hit-boxes over both exhibits,
 * and spotlights that answer hover. Click = brief beat, then route.
 */

import { useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';
import { LANDING_CONTENT } from '@/lib/data/landing';

const GLASSES_URL = '/assets/experiments/glasses/Sunglasses.fbx';
const KEEP = 'Large_Framed_Glasses_';

function normalize(obj: THREE.Object3D, target: number): THREE.Object3D {
  const clone = obj.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3(); const center = new THREE.Vector3();
  box.getSize(size); box.getCenter(center);
  clone.position.sub(center);
  const wrapper = new THREE.Group();
  wrapper.add(clone);
  wrapper.scale.setScalar(target / (Math.max(size.x, size.y, size.z) || 1));
  return wrapper;
}

interface ProductChamberProps {
  progressRef: MutableRefObject<number>;
  onPortal: (href: string) => void;
  onHover: (id: string | null) => void;
}

export default function ProductChamber({ progressRef, onPortal, onHover }: ProductChamberProps) {
  const root = useRef<THREE.Group>(null);
  const exhibit = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const leaving = useRef(false);

  const fbx = useLoader(FBXLoader, GLASSES_URL);
  const glasses = useMemo(() => {
    const clone = fbx.clone(true);
    const drop: THREE.Object3D[] = [];
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o.name !== KEEP) drop.push(o);
    });
    drop.forEach((o) => o.parent?.remove(o));
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: '#17171c', roughness: 0.32, metalness: 0.08,
          clearcoat: 1, clearcoatRoughness: 0.22,
        });
      }
    });
    return normalize(clone, 1.7);
  }, [fbx]);

  useFrame((state) => {
    const g = root.current;
    if (!g) return;
    const p = progressRef.current;
    const vis = THREE.MathUtils.clamp((p - 0.78) / 0.08, 0, 1);
    g.visible = vis > 0.01;
    g.position.y = (1 - vis) * -1.2;
    if (exhibit.current) exhibit.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
  });

  const enter = (id: string) => { setHovered(id); onHover(id); document.body.style.cursor = 'pointer'; };
  const leave = () => { setHovered(null); onHover(null); document.body.style.cursor = ''; };
  const click = (href: string) => {
    if (leaving.current) return;
    leaving.current = true;
    setTimeout(() => onPortal(href), 350);
  };
  const [phone, glassesPortal] = LANDING_CONTENT.chamber.portals;

  return (
    <group ref={root}>
      <spotLight position={[-1.6, 3.2, 2]} angle={0.5} penumbra={0.6}
        intensity={hovered === 'phone' ? 2.4 : 1.2} color="#fff4dd" />
      <spotLight position={[1.6, 3.2, 2]} angle={0.5} penumbra={0.6}
        intensity={hovered === 'glasses' ? 2.4 : 1.2} color="#fff4dd" />

      <group ref={exhibit} position={[1.6, -0.4, 0]} scale={hovered === 'glasses' ? 1.05 : 1}>
        <primitive object={glasses} />
      </group>

      <mesh position={[-1.6, 0, 0]} visible={false}
        onPointerOver={(e) => { e.stopPropagation(); enter('phone'); }}
        onPointerOut={leave}
        onClick={(e) => { e.stopPropagation(); click(phone.href); }}>
        <boxGeometry args={[1.6, 3.8, 1]} />
      </mesh>
      <mesh position={[1.6, -0.4, 0]} visible={false}
        onPointerOver={(e) => { e.stopPropagation(); enter('glasses'); }}
        onPointerOut={leave}
        onClick={(e) => { e.stopPropagation(); click(glassesPortal.href); }}>
        <boxGeometry args={[2.2, 1.6, 1.4]} />
      </mesh>
    </group>
  );
}
