'use client';

/**
 * Concept C — the WebGL particle field (R3F v8, GLSL ShaderMaterial).
 * Loaded only through next/dynamic (ssr:false) from HeroFormation, and only
 * when WebGL is available, motion is allowed and the device isn't low-power.
 *
 * Render policy: frameloop="demand". A frame is drawn only while something is
 * moving (morph, pointer probe, highlight fade, scroll spread); a settled
 * field costs 0 GPU. Offscreen, the parent switches frameloop to "never".
 *
 * Interruptible morphs (v2): a new target mid-morph bakes the on-screen blend
 * into a snapshot slot (aPos4) on the CPU, using the same per-point timing as
 * the shader (aSeed, aJit), and morphs from there. No snap-back.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { POINT_COUNT, SPARSE_SHARE, WORLD_W, glassesCloud, mulberry32, phoneCloud, signCloud } from './geometry';

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
  /** Fires when a morph passes 60%: labels land with the form, not before it. */
  readonly onShown: (formation: 0 | 1 | 2) => void;
  /** Fires when a morph completes. */
  readonly onSettled: (formation: 0 | 1 | 2) => void;
}

const MORPH_SECONDS = 1.25;
const SHOWN_AT = 0.6;
const ARC_Z = 0.12;
const SNAP = 4;
const INK = new THREE.Color('#ece8de');
const ACCENT = new THREE.Color('#f0573a');

const vertexShader = /* glsl */ `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute float aLayer;
  attribute float aSeed;
  attribute float aJit;
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
    if (i < 3.5) return aPos3;
    return aPos4;
  }

  void main() {
    // aSeed = x-rank in [0,1]: a left-to-right sweep; aJit = soft per-point offset
    float t = clamp(uP * 1.55 - aSeed * 0.45 - aJit, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(pick(uFrom), pick(uTo), t);
    float arc = sin(t * 3.14159265);
    p.y += arc * 0.06 * (aJit * 8.0 - 0.5);
    p.z += arc * ${ARC_Z.toFixed(2)};

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

const slotToFormation = (slot: number): 0 | 1 | 2 => (slot === 0 ? 0 : slot === 1 ? 1 : 2);

function Field({
  formation,
  highlight,
  signPoints,
  live,
  kick,
  dense,
  onReady,
  onShown,
  onSettled,
}: Omit<FormationCanvasProps, 'active'>) {
  const invalidate = useThree((s) => s.invalidate);
  const dpr = useThree((s) => s.viewport.dpr);
  const morph = useRef({ from: 0, to: 0, p: 1, shown: true, settled: true });
  const signSlot = useRef(2);
  const smooth = useRef({ px: 0, py: 0, push: 0, explode: 0 });
  const hiTarget = useRef(0);
  const cb = useRef({ onShown, onSettled });
  cb.current = { onShown, onSettled };

  const { geometry, material, axis } = useMemo(() => {
    const phone = phoneCloud();
    const glasses = glassesCloud();
    const sign = signCloud(null);
    const g = new THREE.BufferGeometry();
    const seeds = new Float32Array(POINT_COUNT);
    const jits = new Float32Array(POINT_COUNT);
    const rand = mulberry32(4242);
    const split = Math.floor(POINT_COUNT * SPARSE_SHARE);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      seeds[i] = i < split ? i / split : (i - split) / (POINT_COUNT - split);
      jits[i] = rand() * 0.12;
    }
    g.setAttribute('position', new THREE.BufferAttribute(phone.positions, 3));
    g.setAttribute('aPos0', new THREE.BufferAttribute(phone.positions, 3));
    g.setAttribute('aPos1', new THREE.BufferAttribute(glasses.positions, 3));
    g.setAttribute('aPos2', new THREE.BufferAttribute(sign.slice(), 3));
    g.setAttribute('aPos3', new THREE.BufferAttribute(sign.slice(), 3));
    g.setAttribute('aPos4', new THREE.BufferAttribute(phone.positions.slice(), 3));
    g.setAttribute('aLayer', new THREE.BufferAttribute(phone.layers, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    g.setAttribute('aJit', new THREE.BufferAttribute(jits, 1));
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
    return { geometry: g, material: m, axis: phone.axis };
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useEffect(() => {
    geometry.setDrawRange(0, dense ? POINT_COUNT : Math.floor(POINT_COUNT * SPARSE_SHARE));
    material.uniforms.uSize.value = (dense ? 2.7 : 3.0) * dpr;
    invalidate();
  }, [dense, dpr, geometry, material, invalidate]);

  /** Bake the on-screen blend (minus pointer push) into the snapshot slot. */
  const bakeSnapshot = () => {
    const m = morph.current;
    const src = (slot: number) => (geometry.getAttribute(`aPos${slot}`) as THREE.BufferAttribute).array as Float32Array;
    const a = src(m.from);
    const b = src(m.to);
    const seeds = (geometry.getAttribute('aSeed') as THREE.BufferAttribute).array as Float32Array;
    const jits = (geometry.getAttribute('aJit') as THREE.BufferAttribute).array as Float32Array;
    const layers = (geometry.getAttribute('aLayer') as THREE.BufferAttribute).array as Float32Array;
    const ex = smooth.current.explode;
    const out = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      let t = Math.min(1, Math.max(0, m.p * 1.55 - seeds[i] * 0.45 - jits[i]));
      t = t * t * (3 - 2 * t);
      const arc = Math.sin(t * Math.PI);
      const phoneW = (m.from === 0 ? 1 - t : 0) + (m.to === 0 ? t : 0);
      const lift = (layers[i] - 3) * ex * phoneW;
      for (let k = 0; k < 3; k += 1) out[i * 3 + k] = a[i * 3 + k] + (b[i * 3 + k] - a[i * 3 + k]) * t + axis[k] * lift;
      out[i * 3 + 1] += arc * 0.06 * (jits[i] * 8 - 0.5);
      out[i * 3 + 2] += arc * ARC_Z;
    }
    const snap = geometry.getAttribute(`aPos${SNAP}`) as THREE.BufferAttribute;
    (snap.array as Float32Array).set(out);
    snap.needsUpdate = true;
    m.from = SNAP;
  };

  const startMorph = (target: number) => {
    const m = morph.current;
    if (m.p >= 1) {
      if (target === m.to) return;
      m.from = m.to;
    } else {
      bakeSnapshot();
    }
    m.to = target;
    m.p = 0;
    m.shown = false;
    m.settled = false;
    invalidate();
  };

  // formation change → morph from whatever is on screen
  useEffect(() => {
    startMorph(formation === 2 ? signSlot.current : formation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  // a new signature → write it into the idle sign slot and morph into it
  useEffect(() => {
    const next = signSlot.current === 2 ? 3 : 2;
    const attr = geometry.getAttribute(`aPos${next}`) as THREE.BufferAttribute;
    (attr.array as Float32Array).set(signCloud(signPoints));
    attr.needsUpdate = true;
    const wasSign = morph.current.to === signSlot.current;
    signSlot.current = next;
    if (wasSign) startMorph(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signPoints, geometry]);

  // highlight: swap layer instantly between layers, fade in/out from none
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
    if (!m.shown && m.p >= SHOWN_AT) {
      m.shown = true;
      cb.current.onShown(slotToFormation(m.to));
    }
    if (!m.settled && m.p >= 1) {
      m.settled = true;
      cb.current.onSettled(slotToFormation(m.to));
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
