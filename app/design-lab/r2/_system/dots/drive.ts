'use client';

/**
 * Drive helpers for <DotStage>.
 *   useScrollDrive(targetRef, stageRef, { range, map })  scroll progress of target → stage.setProgress
 *   useTimeDrive(stageRef)                                 { play, stop } with explicit start/stop
 */
import { useCallback, useRef, type RefObject } from 'react';
import { useScrollProgress, type ScrollRange } from '../tokens/scroll';
import type { DotStageHandle } from './DotStage';

export interface ScrollDriveOptions {
  readonly range?: ScrollRange;
  /** Remap scroll progress to t (e.g. p => seg(p, .1, .9)). Default identity. */
  readonly map?: (p: number) => number;
  /** Also receive the raw progress (captions, counters). */
  readonly onProgress?: (p: number) => void;
  /** Custom property written on the target each frame. Default '--p'; false = none. */
  readonly cssVar?: string | false;
}

export function useScrollDrive<T extends HTMLElement>(
  target: RefObject<T>,
  stage: RefObject<DotStageHandle>,
  options: ScrollDriveOptions = {},
): void {
  const opt = useRef(options);
  opt.current = options;
  const onProgress = useCallback(
    (p: number) => {
      const { map, onProgress: cb } = opt.current;
      stage.current?.setProgress(map ? map(p) : p);
      cb?.(p);
    },
    [stage],
  );
  useScrollProgress(target, { range: options.range ?? 'contain', onProgress, cssVar: options.cssVar });
}

export function useTimeDrive(stage: RefObject<DotStageHandle>) {
  const play = useCallback((loop = false) => stage.current?.play({ loop }), [stage]);
  const stop = useCallback(() => stage.current?.stop(), [stage]);
  return { play, stop } as const;
}
