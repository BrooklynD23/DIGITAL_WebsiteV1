'use client';

/**
 * The merged Context chapter (window + engineering), the page's one scrubbed beat.
 *   Signal: one pin. Scroll fills the window to 95% (stage-only), then the document card, the caption and
 *           the three strategies arrive.
 *   Apple:  pin A scrubs the brain-context clip (headline + clip + a ≤3-word readout); pin B is the
 *           interactive window, already full, whose caption and strategies arrive with scroll.
 * Reduced motion / no JS: no pins, the window shows full (95%), every control visible.
 */
import { useRef, type ReactNode } from 'react';
import { ChapterPin } from './ChapterPin';
import { ContextClip, ContextDemo, type ClipDrive, type ContextDrive } from './DemosB';
import type { World } from './DemoShell';

export interface ContextClasses {
  readonly pin: string;
  readonly sticky: string;
  readonly text: string;
  readonly stage: string;
  /** Apple pin B (interactive) variant. */
  readonly pinB?: string;
}

export function ContextChapter({
  world,
  id,
  labelledBy,
  classes,
  head,
  caption,
  after,
}: {
  readonly world: World;
  readonly id: string;
  readonly labelledBy: string;
  readonly classes: ContextClasses;
  readonly head: ReactNode;
  readonly caption: ReactNode;
  readonly after?: ReactNode;
}) {
  const drive = useRef<ContextDrive>(null);
  const clip = useRef<ClipDrive>(null);
  if (world === 'signal') {
    return (
      <ChapterPin
        id={id}
        labelledBy={labelledBy}
        className={classes.pin}
        stickyClassName={classes.sticky}
        reveal={[0.56, 0.93]}
        revealNarrow={[0.62, 0.94]}
        onProgress={(p) => drive.current?.setFill(p / 0.52)}
        after={after}
      >
        <div className={classes.text}>
          {head}
          {caption}
        </div>
        <div className={classes.stage}>
          <ContextDemo ref={drive} world="signal" scrubbed />
        </div>
      </ChapterPin>
    );
  }
  return (
    <>
      <ChapterPin
        id={id}
        labelledBy={labelledBy}
        tone="dark"
        className={classes.pin}
        stickyClassName={classes.sticky}
        reveal={[2, 2]}
        onProgress={(p) => clip.current?.setProgress(Math.min(1, p / 0.9))}
      >
        <div className={classes.text}>{head}</div>
        <div className={classes.stage}>
          <ContextClip ref={clip} />
        </div>
      </ChapterPin>
      <ChapterPin label="Context: choose what stays" tone="dark" className={classes.pinB ?? classes.pin} stickyClassName={classes.sticky} after={after}>
        <div className={classes.text}>{caption}</div>
        <div className={classes.stage}>
          <ContextDemo world="apple" />
        </div>
      </ChapterPin>
    </>
  );
}
