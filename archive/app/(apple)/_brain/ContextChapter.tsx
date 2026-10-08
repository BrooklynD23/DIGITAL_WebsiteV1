'use client';

/**
 * The merged Context chapter (window + engineering) on the Signal page, its one scrubbed beat: scroll fills the
 * window to 95% (stage-only), then the document card, the caption and the three strategies arrive.
 * Reduced motion / no JS: no pin, the window shows full (95%), every control visible.
 */
import { useRef, type ReactNode } from 'react';
import { ChapterPin } from './ChapterPin';
import { ContextDemo, type ContextDrive } from './DemosB';
import type { World } from './DemoShell';

export interface ContextClasses {
  readonly pin: string;
  readonly sticky: string;
  readonly text: string;
  readonly stage: string;
}

export function ContextChapter({
  world,
  id,
  labelledBy,
  classes,
  head,
  caption,
  how,
  tick,
}: {
  readonly world: World;
  readonly id: string;
  readonly labelledBy: string;
  readonly classes: ContextClasses;
  readonly head: ReactNode;
  readonly caption: ReactNode;
  /** "How it works", shown with the caption (late). */
  readonly how?: ReactNode;
  /** The T+ tick that sits on the timebase rule. */
  readonly tick?: ReactNode;
}) {
  const drive = useRef<ContextDrive>(null);
  return (
    <ChapterPin
      id={id}
      labelledBy={labelledBy}
      className={classes.pin}
      stickyClassName={classes.sticky}
      reveal={[0.56, 2]}
      revealNarrow={[0.6, 2]}
      onProgress={(p) => drive.current?.setFill(p / 0.52)}
    >
      {tick}
      <div className={classes.text}>
        {head}
        {caption}
        {how}
      </div>
      <div className={classes.stage}>
        <ContextDemo ref={drive} world={world} scrubbed />
      </div>
    </ChapterPin>
  );
}
