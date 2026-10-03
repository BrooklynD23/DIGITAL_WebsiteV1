'use client';

/**
 * Home (both worlds): one build's signature verb at chapter scale.
 * - Fit: every verb's rest pose is scaled to fill the same share of its box, so SIDEKICK's explode, SHADES'
 *   fixate and BRAIN's bud read as equally weighted objects (raw rest poses range from ~25% to ~90% of the box).
 * - Motion: plays one pass on entry (PlayOnceStage), replays on hover / focus of the row. No ambient loop.
 * - SHADES: the fixate rest pose is a point in a reticle; an RSVP word sits at the fixation point so the
 *   artifact reads as reading, not as an empty crosshair.
 */
import { useMemo } from 'react';
import { PlayOnceStage, frame, restFrame, type Frame, type FrameOpts, type Verb } from '../_system';
import s from './channel.module.css';

const FILL = 0.84;

function fitScene(verb: Verb): (t: number, opts: FrameOpts) => Frame {
  const scale = new Map<string, number>();
  return (t, opts) => {
    const key = `${opts.size}|${opts.seed}`;
    let k = scale.get(key);
    if (k === undefined) {
      const rest = restFrame(verb, opts);
      let ext = 0.05;
      for (const d of rest.dots) ext = Math.max(ext, Math.abs(d.x), Math.abs(d.y));
      for (const l of rest.lines) ext = Math.max(ext, Math.abs(l.x1), Math.abs(l.y1), Math.abs(l.x2), Math.abs(l.y2));
      k = Math.min(2.4, FILL / ext);
      scale.set(key, k);
    }
    const f = frame(verb, t, opts);
    const c = (v: number): number => Math.max(-1, Math.min(1, v * (k as number)));
    return {
      dots: f.dots.map((d) => ({ ...d, x: c(d.x), y: c(d.y) })),
      lines: f.lines.map((l) => ({ ...l, x1: c(l.x1), y1: c(l.y1), x2: c(l.x2), y2: c(l.y2) })),
    };
  };
}

export interface ChannelOrbProps {
  readonly verb: Verb;
  readonly size: number;
  readonly seed: string;
  readonly label: string;
  readonly className?: string;
  /** RSVP word shown at the fixation point (SHADES). */
  readonly word?: string;
}

export function ChannelOrb({ verb, size, seed, label, className, word }: ChannelOrbProps) {
  const scene = useMemo(() => fitScene(verb), [verb]);
  return (
    <div className={className ? `${s.wrap} ${className}` : s.wrap}>
      <PlayOnceStage verb={verb} size={size} seed={seed} scene={scene} playOnHover threshold={0.6} label={label} className={s.stage} />
      {word ? (
        <span className={s.word} aria-hidden="true">
          {word}
        </span>
      ) : null}
    </div>
  );
}
