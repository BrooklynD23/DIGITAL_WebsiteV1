'use client';

/**
 * Stage playback: scroll only picks the TARGET stage; the motion is time-based. When the target changes, one
 * anime.js tween moves a plain playhead (float 0..count-1) from wherever it is to the new index, so a retarget
 * mid-flight continues from the current value (interruptible, reversible, no jumps). 0 rAF at rest, no React state.
 */
import { useEffect, useRef, type MutableRefObject } from 'react';
import { animate } from 'animejs';

export function useStagePlayback(target: number, count: number, msPerStage: number, onUpdate: (pos: number) => void): MutableRefObject<{ pos: number }> {
  const head = useRef({ pos: 0 });
  const cb = useRef(onUpdate);
  cb.current = onUpdate;

  useEffect(() => {
    const h = head.current;
    const to = Math.min(count - 1, Math.max(0, target));
    if (to === h.pos) return undefined;
    const tween = animate(h, {
      pos: to,
      duration: Math.min(msPerStage * 1.5, msPerStage * Math.abs(to - h.pos)),
      ease: 'inOut(3)',
      onUpdate: () => cb.current(h.pos),
    });
    return () => {
      tween.cancel(); // not revert(): the playhead must stay where it is for the next retarget
    };
  }, [target, count, msPerStage]);

  return head;
}
