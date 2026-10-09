/**
 * Apple world · phone hero: the contract between the artwork (PhoneArtwork.tsx + poses.ts) and the playback
 * engine (useStagePlayback.ts + HeroStages.tsx). ONE svg, ONE set of parts; the four stages are four poses of
 * the same parts. Nothing is swapped between stages.
 *
 * DOM contract (inside PhoneArtwork's <svg viewBox="0 0 1600 900">):
 *   [data-rig]                 the camera group; receives CameraPose (incl. the flat ↔ isometric un-projection)
 *   [data-part="<PartId>"]     one <g> per part, child of the rig; receives translate(x, y) + opacity o
 *     [data-layer="plan"]      dashed / unresolved drawing of the part; opacity = pose.plan
 *     [data-layer="build"]     solid / resolved drawing of the part;   opacity = pose.build
 *   [data-part="testPath"] path[data-draw]   stroke-drawn 0..1 by pose.draw (pathLength="1" on the path)
 */
import type { StageId } from '../../_content/home';

export const VIEWBOX = { w: 1600, h: 900 } as const;

export const PART_IDS = [
  'sheet', // the flat PLAN drawing on the ground plane (plan layer only); the parts lift off it
  'construction', // dashed drop lines, registration nodes, dimension lines
  'display',
  'shield', // the plate that sits above the board, left of centre
  'sensor', // the small daughterboard that TEST isolates
  'connector', // the board-to-board connector between sensor and pcb
  'pcb',
  'camera',
  'module', // the far-right breakout board
  'battery',
  'frame', // midframe + enclosure
  'testPath', // the one validation path (warm white; ends in the red test point)
  'marker', // the one red editorial marker
] as const;
export type PartId = (typeof PART_IDS)[number];

export interface PartPose {
  /** translate in viewBox units, relative to the part's assembled position */
  readonly x: number;
  readonly y: number;
  /** whole-part opacity (focus hierarchy) */
  readonly o: number;
  /** sub-layer opacities */
  readonly plan: number;
  readonly build: number;
  /** testPath only: stroke drawn 0..1 */
  readonly draw?: number;
}

export interface CameraPose {
  /** translate in viewBox units, applied before scale about the viewBox centre */
  readonly x: number;
  readonly y: number;
  readonly s: number;
  /** 1 = the isometric ground plane un-projected to a true top view (the PLAN sheet); 0 / omitted = isometric */
  readonly flat?: number;
}

export interface StagePose {
  readonly camera: CameraPose;
  readonly parts: Readonly<Record<PartId, PartPose>>;
}

export type Poses = Readonly<Record<StageId, StagePose>>;

export const STAGE_ORDER: readonly StageId[] = ['plan', 'prototype', 'test', 'integrate'];
