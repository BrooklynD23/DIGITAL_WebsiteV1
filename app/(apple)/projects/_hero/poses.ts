/**
 * Apple world · phone hero: the four poses of the one phone. PLAN is the flat drawing; PROTOTYPE / TEST share
 * one explosion (only focus and camera change); INTEGRATE is every offset at zero.
 */
import type { StageId } from '../../_content/home';
import type { CameraPose, PartPose, Poses } from './contract';
import { EXPLODE as E } from './geometry';

type Off = readonly [number, number];
const ZERO: Off = [0, 0];

const p = (off: Off, o: number, plan: number, build: number, draw?: number): PartPose =>
  draw === undefined ? { x: off[0], y: off[1], o, plan, build } : { x: off[0], y: off[1], o, plan, build, draw };

export const POSES: Poses = {
  // PLAN is paper: only the flat drawing shows, seen straight on. Every part waits at its seated position.
  plan: {
    camera: { x: 0, y: -12, s: 1.24, flat: 1 },
    parts: {
      sheet: p(ZERO, 1, 1, 0),
      construction: p(ZERO, 0, 1, 0),
      display: p(ZERO, 0, 1, 0),
      shield: p(ZERO, 0, 1, 0),
      sensor: p(ZERO, 0, 1, 0),
      connector: p(ZERO, 0, 1, 0),
      pcb: p(ZERO, 0, 1, 0),
      camera: p(ZERO, 0, 1, 0),
      module: p(ZERO, 0, 1, 0),
      battery: p(ZERO, 0, 1, 0),
      frame: p(ZERO, 0, 1, 0),
      testPath: p(ZERO, 0, 0, 1, 0),
      marker: p(ZERO, 0, 0, 1),
    },
  },
  prototype: {
    camera: { x: -90, y: 0, s: 0.62 },
    parts: {
      sheet: p(E.sheet, 0.08, 1, 0),
      construction: p(ZERO, 1, 0.3, 0),
      display: p(E.display, 1, 0.1, 1),
      shield: p(E.shield, 1, 0.1, 1),
      sensor: p(E.sensor, 1, 0.1, 1),
      connector: p(E.connector, 1, 0.1, 1),
      pcb: p(E.pcb, 1, 0.1, 1),
      camera: p(E.camera, 1, 0.1, 1),
      module: p(E.module, 1, 0.1, 1),
      battery: p(E.battery, 1, 0.1, 1),
      frame: p(E.frame, 1, 0.1, 1),
      testPath: p(ZERO, 0, 0, 1, 0),
      marker: p(E.sensor, 0, 0, 1),
    },
  },
  test: {
    camera: { x: -105, y: 35, s: 1 },
    parts: {
      sheet: p(E.sheet, 0, 1, 0),
      construction: p(ZERO, 0.5, 0.3, 0),
      display: p(E.display, 0.16, 0, 1),
      shield: p(E.shield, 0.16, 0, 1),
      sensor: p(E.sensor, 1, 0, 1),
      connector: p(E.connector, 1, 0, 1),
      pcb: p(E.pcb, 0.25, 0, 1),
      camera: p(E.camera, 0.18, 0, 1),
      module: p(E.module, 0.14, 0, 1),
      battery: p(E.battery, 0.12, 0, 1),
      frame: p(E.frame, 0.12, 0, 1),
      testPath: p(ZERO, 1, 0, 1, 1),
      marker: p(E.sensor, 1, 0, 1),
    },
  },
  integrate: {
    camera: { x: -40, y: 20, s: 1.04 },
    parts: {
      sheet: p(ZERO, 0, 1, 0),
      construction: p(ZERO, 1, 0, 1),
      display: p(ZERO, 1, 0, 1),
      shield: p(ZERO, 0.5, 0, 1),
      sensor: p(ZERO, 0.7, 0, 1),
      connector: p(ZERO, 0.5, 0, 1),
      pcb: p(ZERO, 0.6, 0, 1),
      camera: p(ZERO, 0.7, 0, 1),
      module: p(ZERO, 0.6, 0, 1),
      battery: p(ZERO, 0.5, 0, 1),
      frame: p(ZERO, 1, 0, 1),
      // testPath: `build` = the exploded routing (the stroke-drawn path), `plan` = the same route once seated.
      testPath: p(ZERO, 0.6, 1, 0, 1),
      marker: p(ZERO, 1, 0, 1),
    },
  },
};

/**
 * Cameras for the narrow layout (≤734px), where the art box is 150% of the viewport wide: the desktop x offsets
 * would push the device off-centre and the Plan sheet must stay inside 390px. Chosen in CSS (hero.module.css).
 */
export const NARROW_CAMERA: Readonly<Record<StageId, CameraPose>> = {
  plan: { x: 0, y: 0, s: 0.98, flat: 1 },
  prototype: { x: -34, y: -40, s: 0.64 },
  test: { x: -21, y: 35, s: 1 },
  integrate: { x: -8, y: -20, s: 0.92 },
};
