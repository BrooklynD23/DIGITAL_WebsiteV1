'use client';

/**
 * The hero smart-glasses 3D object for /experiments/glasses.
 *
 * Model source (in priority order):
 *   - `?model=sunglasses` or `?model=vuzix` query → loads that FBX (for A/B comparison)
 *   - MODEL_URL (a GLB) if set
 *   - otherwise a procedurally-built realistic reading-glasses model
 * Any loaded model is normalized (recentered + scaled to fit) so scale/units don't matter.
 *
 * Scroll-driven motion (shared `progressRef`, 0..1), lerped at 60fps:
 *   0–.15 hero (offset right) → .15–.40 swirl to center → .40–.60 face forward (HUD beat)
 *   → .60–1 tilt + drop to mid-bottom with a GENTLE sway (no runaway spinning).
 */

import { useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';
import { GLASSES_CONTENT } from '@/lib/data/experiments/glasses';

/** Optional GLB swap point (unused while FBX/procedural is active). */
export const MODEL_URL: string | null = null;

/** FBX models selectable via the ?model= query param. */
const FBX_MODELS: Record<string, string> = {
  sunglasses: '/assets/experiments/glasses/Sunglasses.fbx',
  vuzix: '/assets/experiments/glasses/vuzix-re2-hipoly.fbx',
};

/** Model shown when no ?model= override is present. */
const DEFAULT_MODEL = 'sunglasses';

/** Some FBX files bundle multiple meshes; keep only this one (by name) for that model. */
const FBX_KEEP: Record<string, string> = {
  sunglasses: 'Large_Framed_Glasses_',
};

const { lerp, clamp } = THREE.MathUtils;
const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

function track(p: number, stops: readonly number[], vals: readonly number[]): number {
  if (p <= stops[0]) return vals[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = smoothstep((p - stops[i - 1]) / (stops[i] - stops[i - 1]));
      return lerp(vals[i - 1], vals[i], t);
    }
  }
  return vals[vals.length - 1];
}

const STOPS = [0, 0.15, 0.4, 0.5, 0.6, 1] as const;
const POS_Y = [0.15, 0.15, 0.12, 0.1, -0.4, -1.3] as const;
const POS_Z = [0, 0, 0.5, 0.7, 0.4, 0.5] as const;
// Keep the end tilt gentle so the parked glasses reads as a frame, not two temple tips.
const ROT_X = [0.12, 0.12, 0.0, 0.0, 0.2, 0.24] as const;
const SCALE = [0.95, 0.95, 1.02, 1.06, 0.9, 0.72] as const;

interface GlassesModelProps {
  progressRef: MutableRefObject<number>;
}

/** One-time HUD snapshot rendered into a canvas: phosphor corner brackets + RSVP readout. */
function createHudGlimpseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const phosphor = 'rgba(127,230,163,0.95)';
    const margin = 24;
    const arm = 30;
    ctx.strokeStyle = phosphor;
    ctx.lineWidth = 3;
    const corners: Array<[number, number, number, number]> = [
      [margin, margin, 1, 1],
      [canvas.width - margin, margin, -1, 1],
      [margin, canvas.height - margin, 1, -1],
      [canvas.width - margin, canvas.height - margin, -1, -1],
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + arm * dy);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arm * dx, y);
      ctx.stroke();
    });
    ctx.fillStyle = phosphor;
    ctx.font = '28px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const { label, wpm } = GLASSES_CONTENT.hud;
    ctx.fillText(`${label} · ${wpm} WPM`, canvas.width / 2, canvas.height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Adds the in-lens HUD glimpse plane as a child of the normalized wrapper. */
function attachHudGlimpse(wrapper: THREE.Group, size: THREE.Vector3): void {
  const geo = new THREE.PlaneGeometry(size.x * 0.38, size.y * 0.55);
  const mat = new THREE.MeshBasicMaterial({
    map: createHudGlimpseTexture(),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'hud-glimpse';
  mesh.position.set(-size.x * 0.22, 0, size.z / 2 + 0.01);
  wrapper.add(mesh);
}

/**
 * Recenter to origin + scale so the largest dimension fits a target size.
 * The recentered model is nested inside a wrapper that carries the scale, so scaling can't
 * reintroduce a pivot offset (FBX pivots are often far from the geometry).
 */
function normalize(obj: THREE.Object3D, target = 3.0): THREE.Object3D {
  const clone = obj.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  clone.position.sub(center); // center content at the wrapper's origin
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = target / maxDim;
  const wrapper = new THREE.Group();
  wrapper.add(clone);
  wrapper.scale.setScalar(scale);
  // wrapper's own scale already applies to children's local coordinates —
  // position/size the glimpse using the UNSCALED size, not size*scale.
  attachHudGlimpse(wrapper, size);
  return wrapper;
}

/** 1x1 transparent PNG — FBX-referenced textures are missing on disk; redirect
 *  their fetches here so the loader never 404s (we replace materials anyway). */
const BLANK_PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const ACETATE = new THREE.MeshPhysicalMaterial({
  color: '#17171c',
  roughness: 0.32,
  metalness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.22,
});
const LENS = new THREE.MeshPhysicalMaterial({
  color: '#2a3a3f',
  roughness: 0.06,
  metalness: 0,
  transmission: 0.85,
  transparent: true,
  opacity: 0.5,
  thickness: 0.25,
});

function FbxModel({ url, keep }: { url: string; keep?: string }) {
  const fbx = useLoader(FBXLoader, url, (loader) => {
    const mgr = new THREE.LoadingManager();
    mgr.setURLModifier((u) => (/\.(png|jpe?g|tga|tif|bmp)$/i.test(u) ? BLANK_PX : u));
    loader.manager = mgr;
  });
  const obj = useMemo(() => {
    const clone = fbx.clone(true);
    if (keep) {
      const drop: THREE.Object3D[] = [];
      clone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh && o.name !== keep) drop.push(o);
      });
      drop.forEach((o) => o.parent?.remove(o));
    }
    // PBR pass: acetate frame; if the mesh has multiple material groups,
    // treat any material whose name hints at glass/lens as the lens.
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const assign = (m: THREE.Material) =>
        /lens|glass|transparent/i.test(m.name ?? '') ? LENS : ACETATE;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(assign)
        : assign(mesh.material);
    });
    return normalize(clone, 2.7);
  }, [fbx, keep]);
  return <primitive object={obj} />;
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => normalize(scene, 3.2), [scene]);
  return <primitive object={obj} />;
}

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function ProceduralGlasses() {
  const geo = useMemo(() => {
    const lensW = 1.45;
    const lensH = 1.02;
    const r = 0.36;
    const ft = 0.085;
    const depth = 0.11;
    const outer = roundedRect(lensW, lensH, r);
    const inner = roundedRect(lensW - ft * 2, lensH - ft * 2, Math.max(r - ft, 0.04));
    outer.holes.push(inner);
    const rim = new THREE.ExtrudeGeometry(outer, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      steps: 1,
    });
    rim.translate(0, 0, -depth / 2);
    rim.computeVertexNormals();
    const lens = new THREE.ShapeGeometry(roundedRect(lensW - ft, lensH - ft, Math.max(r - ft, 0.04)));
    return { rim, lens, lensW };
  }, []);

  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#16171c', metalness: 0.35, roughness: 0.45 }),
    []
  );
  const lensMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#aee0ff',
        metalness: 0,
        roughness: 0.08,
        transmission: 0.9,
        transparent: true,
        opacity: 0.32,
        thickness: 0.2,
        reflectivity: 0.3,
      }),
    []
  );

  const cx = geo.lensW / 2 + 0.16;
  const outerX = cx + geo.lensW / 2 - 0.05;

  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * cx, 0, 0]}>
          <mesh geometry={geo.rim} material={frameMat} />
          <mesh geometry={geo.lens} material={lensMat} position={[0, 0, 0.01]} />
        </group>
      ))}
      <mesh material={frameMat} position={[0, 0.18, 0]}>
        <boxGeometry args={[0.34, 0.085, 0.085]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * outerX, 0.16, 0]}>
          <mesh material={frameMat}>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
          </mesh>
          <mesh material={frameMat} position={[s * 0.06, -0.02, -0.85]} rotation={[0.04, s * 0.16, 0]}>
            <boxGeometry args={[0.07, 0.09, 1.7]} />
          </mesh>
          <mesh material={frameMat} position={[s * 0.12, -0.12, -1.62]} rotation={[0.35, s * 0.16, 0]}>
            <boxGeometry args={[0.07, 0.08, 0.32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Chooses the model source; each hook lives in its own component (no conditional hooks). */
function ModelContent() {
  const selected = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('model');
  }, []);
  const key = selected ?? DEFAULT_MODEL;
  const fbxUrl = FBX_MODELS[key];
  if (fbxUrl) return <FbxModel url={fbxUrl} keep={FBX_KEEP[key]} />;
  if (MODEL_URL) return <GltfModel url={MODEL_URL} />;
  return <ProceduralGlasses />;
}

export default function GlassesModel({ progressRef }: GlassesModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    const wideness = clamp((state.viewport.aspect - 0.8) * 1.6, 0, 1);
    const heroOffsetX = 1.7 * wideness;
    const toCenter = smoothstep((p - 0.15) / (0.4 - 0.15));
    const targetX = heroOffsetX * (1 - toCenter);

    const targetY = track(p, STOPS, POS_Y);
    const targetZ = track(p, STOPS, POS_Z);
    const tiltX = track(p, STOPS, ROT_X);
    const baseScale = track(p, STOPS, SCALE) * (clicked ? 1.05 : 1) * (hovered ? 1.04 : 1);

    const heroYaw = 0.5 * (1 - smoothstep((p - 0.12) / (0.34 - 0.12)));
    const swirl = (1 - smoothstep((p - 0.15) / (0.4 - 0.15))) * Math.PI * 2;
    // Parked: a gentle bounded sway instead of a runaway continuous spin.
    const parkedSway = smoothstep((p - 0.62) / 0.18) * Math.sin(t * 0.5) * 0.12;
    const targetYaw = heroYaw + swirl + parkedSway;

    const aliveness = 1 - smoothstep((p - 0.6) / 0.1);
    const floatY = aliveness * Math.sin(t * 1.1) * 0.07;
    const parallaxX = aliveness * state.pointer.y * 0.16 + (hovered ? -state.pointer.y * 0.08 : 0);
    const parallaxY = aliveness * state.pointer.x * 0.3 + (hovered ? state.pointer.x * 0.12 : 0);

    // First-person POV: fly up out of frame during the book/HUD window (you're wearing them),
    // then fly back in once the book background has cleared.
    const hidden = smoothstep((p - 0.32) / 0.06) * (1 - smoothstep((p - 0.6) / 0.06));
    const povY = targetY + hidden * 5.5;
    const povZ = targetZ + hidden * 1.2;

    const k = 1 - Math.pow(0.001, delta);
    g.position.x = lerp(g.position.x, targetX, k);
    g.position.y = lerp(g.position.y, povY + floatY, k);
    g.position.z = lerp(g.position.z, povZ, k);
    g.rotation.x = lerp(g.rotation.x, tiltX + parallaxX, k);
    g.rotation.y = lerp(g.rotation.y, targetYaw + parallaxY, k);
    const sc = lerp(g.scale.x, baseScale, k);
    g.scale.set(sc, sc, sc);

    // In-lens HUD glimpse: only visible on the fly-back beat.
    const hud = g.getObjectByName('hud-glimpse') as THREE.Mesh | undefined;
    if (hud && hud.material instanceof THREE.MeshBasicMaterial) {
      hud.material.opacity =
        smoothstep((p - 0.6) / 0.04) * (1 - smoothstep((p - 0.68) / 0.04)) * 0.85;
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setClicked((c) => !c);
      }}
    >
      <ModelContent />
    </group>
  );
}

if (MODEL_URL) useGLTF.preload(MODEL_URL);
