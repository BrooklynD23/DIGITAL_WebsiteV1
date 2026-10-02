'use client';

/**
 * Concept C — the WebGL particle field (R3F v8, GLSL ShaderMaterial).
 * Loaded only through next/dynamic (ssr:false) from HeroFormation, and only
 * when WebGL is available, motion is allowed and the device isn't low-power.
 *
 * Render policy: frameloop="demand". A frame is drawn only while something is
 * moving (morph, pointer probe, scroll spread); a settled field costs 0 GPU.
 * Offscreen, the parent switches frameloop to "never".
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { POINT_COUNT, SPARSE_SHARE, WORLD_W, glassesCloud, phoneCloud, signCloud } from './geometry';

export interface LiveInput {
  px: number;
  py: number;
  hover: boolean;
  explode: number;
}

export interface FormationCanvasProps {
  readonly formation: 0 | 1 | 2;
  readonly highlight: number;
  readonly signPoints: Float32Array | null;
  readonly live: MutableRefObject<LiveInput>;
  readonly kick: MutableRefObject<(() => void) | null>;
  readonly active: boolean;
  readonly dense: boolean;
  readonly onReady: () => void;
}

const MORPH_SECONDS = 1.25;
const INK = new THREE.Color('#ece8de');
const ACCENT = new THREE.Color('#ff5a36');

const vertexShader = /* glsl */ `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute float aLayer;
  attribute float aSeed;
  uniform float uFrom;
  uniform float uTo;
  uniform float uP;
  uniform float uExplode;
  uniform vec3 uAxis;
  uniform vec2 uPointer;
  uniform float uPush;
  uniform float uHighlight;
  uniform float uHiMix;
  uniform float uSize;
  varying float vAlpha;
  varying float vHi;

  vec3 pick(float i) {
    if (i < 0.5) return aPos0;
    if (i < 1.5) return aPos1;
    if (i < 2.5) return aPos2;
    return aPos3;
  }

  void main() {
    // aSeed = x-rank in [0,1]: a left-to-right sweep with a soft per-point jitter
    float jitter = fract(sin(aSeed * 12.9898 + aLayer) * 43758.5453) * 0.12;
    float t = clamp(uP * 1.55 - aSeed * 0.45 - jitter, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(pick(uFrom), pick(uTo), t);
    float arc = sin(t * 3.14159265);
    p.y += arc * 0.06 * (jitter * 8.0 - 0.5);
    p.z += arc * 0.3;

    float phoneW = (uFrom < 0.5 ? 1.0 - t : 0.0) + (uTo < 0.5 ? t : 0.0);
    p += uAxis * (aLayer - 3.0) * uExplode * phoneW;

    vec2 dv = p.xy - uPointer;
    float dist = length(dv);
    float f = uPush * (1.0 - smoothstep(0.0, 0.4, dist));
    p.xy += (dv / max(dist, 1e-4)) * f * 0.2;

    vHi = phoneW * step(abs(aLayer - uHighlight), 0.5) * uHiMix;
    float depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
    float dimOthers = phoneW > 0.5 ? mix(1.0, mix(0.4, 1.0, step(abs(aLayer - uHighlight), 0.5)), uHiMix) : 1.0;
    vAlpha = mix(0.4, 1.0, depth) * dimOthers;
    gl_PointSize = uSize * mix(0.8, 1.15, depth) * (1.0 + vHi * 0.45);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vHi;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float edge = 1.0 - smoothstep(0.32, 0.5, r);
    gl_FragColor = vec4(mix(uInk, uAccent, vHi), vAlpha * edge);
  }
`;

function FitCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    camera.zoom = size.width / WORLD_W;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Field({ formation, highlight, signPoints, live, kick, dense, onReady }: Omit<FormationCanvasProps, 'active'>) {
  const invalidate = useThree((s) => s.invalidate);
  const dpr = useThree((s) => s.viewport.dpr);
  const morph = useRef({ from: 0, to: 0, p: 1 });
  const signSlot = useRef(2);
  const smooth = useRef({ px: 0, py: 0, push: 0, explode: 0 });

  const { geometry, material } = useMemo(() => {
    const phone = phoneCloud();
    const glasses = glassesCloud();
    const sign = signCloud(null);
    const g = new THREE.BufferGeometry();
    const seeds = new Float32Array(POINT_COUNT);
    const split = Math.floor(POINT_COUNT * SPARSE_SHARE);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      seeds[i] = i < split ? i / split : (i - split) / (POINT_COUNT - split);
    }
    g.setAttribute('position', new THREE.BufferAttribute(phone.positions, 3));
    g.setAttribute('aPos0', new THREE.BufferAttribute(phone.positions, 3));
    g.setAttribute('aPos1', new THREE.BufferAttribute(glasses.positions, 3));
    g.setAttribute('aPos2', new THREE.BufferAttribute(sign.slice(), 3));
    g.setAttribute('aPos3', new THREE.BufferAttribute(sign.slice(), 3));
    g.setAttribute('aLayer', new THREE.BufferAttribute(phone.layers, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uFrom: { value: 0 },
        uTo: { value: 0 },
        uP: { value: 1 },
        uExplode: { value: 0 },
        uAxis: { value: new THREE.Vector3(...phone.axis) },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPush: { value: 0 },
        uHighlight: { value: -1 },
        uHiMix: { value: 0 },
        uSize: { value: 2 },
        uInk: { value: INK },
        uAccent: { value: ACCENT },
      },
    });
    return { geometry: g, material: m };
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useEffect(() => {
    geometry.setDrawRange(0, dense ? POINT_COUNT : Math.floor(POINT_COUNT * SPARSE_SHARE));
    material.uniforms.uSize.value = (dense ? 2.7 : 3.0) * dpr;
    invalidate();
  }, [dense, dpr, geometry, material, invalidate]);

  // formation change → start a morph from whatever is on screen
  useEffect(() => {
    const target = formation === 2 ? signSlot.current : formation;
    const m = morph.current;
    if (target === m.to && m.p >= 1) return;
    m.from = m.p >= 0.5 ? m.to : m.from;
    m.to = target;
    m.p = 0;
    invalidate();
  }, [formation, invalidate]);

  // a new signature → write it into the idle sign slot and morph into it
  useEffect(() => {
    const next = signSlot.current === 2 ? 3 : 2;
    const attr = geometry.getAttribute(`aPos${next}`) as THREE.BufferAttribute;
    (attr.array as Float32Array).set(signCloud(signPoints));
    attr.needsUpdate = true;
    const m = morph.current;
    if (m.to === signSlot.current) {
      m.from = m.p >= 0.5 ? m.to : m.from;
      m.to = next;
      m.p = 0;
    }
    signSlot.current = next;
    invalidate();
  }, [signPoints, geometry, invalidate]);

  // highlight: swap layer instantly between layers, fade in/out from none
  const hiTarget = useRef(0);
  useEffect(() => {
    if (highlight >= 0) material.uniforms.uHighlight.value = highlight;
    hiTarget.current = highlight >= 0 ? 1 : 0;
    invalidate();
  }, [highlight, material, invalidate]);

  useEffect(() => {
    kick.current = invalidate;
    const id = requestAnimationFrame(() => onReady());
    return () => {
      cancelAnimationFrame(id);
      kick.current = null;
    };
  }, [kick, invalidate, onReady]);

  useFrame((_, rawDelta) => {
    const d = Math.min(rawDelta, 1 / 30);
    const u = material.uniforms;
    const m = morph.current;
    const s = smooth.current;
    const L = live.current;
    let busy = false;
    if (m.p < 1) {
      m.p = Math.min(1, m.p + d / MORPH_SECONDS);
      busy = true;
    }
    const pushT = L.hover ? 1 : 0;
    s.push += (pushT - s.push) * Math.min(1, d * 7);
    const kx = Math.min(1, d * 14);
    s.px += (L.px - s.px) * kx;
    s.py += (L.py - s.py) * kx;
    s.explode += (L.explode - s.explode) * Math.min(1, d * 8);
    if (Math.abs(pushT - s.push) > 0.002 || (s.push > 0.01 && (Math.abs(L.px - s.px) > 0.0008 || Math.abs(L.py - s.py) > 0.0008))) busy = true;
    if (Math.abs(L.explode - s.explode) > 0.0005) busy = true;
    const hm = u.uHiMix.value as number;
    const hmNext = hm + (hiTarget.current - hm) * Math.min(1, d * 12);
    u.uHiMix.value = Math.abs(hiTarget.current - hmNext) < 0.004 ? hiTarget.current : hmNext;
    if (u.uHiMix.value !== hiTarget.current) busy = true;
    u.uFrom.value = m.from;
    u.uTo.value = m.to;
    u.uP.value = m.p;
    u.uPush.value = s.push;
    u.uPointer.value.set(s.px, s.py);
    u.uExplode.value = s.explode;
    if (busy) invalidate();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function FormationCanvas({ active, ...rest }: FormationCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], near: 0.1, far: 20, zoom: 100 }}
      frameloop={active ? 'demand' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <FitCamera />
      <Field {...rest} />
    </Canvas>
  );
}
