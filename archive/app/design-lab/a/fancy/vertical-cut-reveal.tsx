/**
 * Vertical Cut Reveal — adapted from fancy components by Daniel Petho.
 * Source: https://github.com/danielpetho/fancy/blob/main/src/fancy/components/text/vertical-cut-reveal.tsx
 *
 * MIT License · Copyright (c) 2024 Daniel Petho
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files, to deal in the Software without restriction,
 * subject to the inclusion of this notice in all copies or substantial portions.
 *
 * DIGITAL design-lab changes (concept A):
 * - Kept: split by words/characters, staggerFrom first|last|center|number, sr-only full
 *   text + aria-hidden animated copy, per-word overflow mask.
 * - Changed: the motion spring is replaced by a CSS keyframe that reads a per-element
 *   `--cut-delay`. Reason: motion's `initial="hidden"` is serialized into the server HTML
 *   as translateY(100%), so the headline would be invisible without JS or before
 *   hydration. CSS runs on first paint, needs no hydration, and is skipped entirely under
 *   prefers-reduced-motion (see a.module.css `.cut*`).
 * - Added: trigger="inView" — server renders the final text; once JS is present the
 *   element is armed (masked) and plays when 20% of it enters the viewport.
 */
'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ElementType } from 'react';
import styles from '../a.module.css';

type StaggerFrom = 'first' | 'last' | 'center' | number;

interface VerticalCutRevealProps {
  readonly children: string;
  readonly as?: ElementType;
  readonly splitBy?: 'words' | 'characters';
  readonly staggerDuration?: number;
  readonly staggerFrom?: StaggerFrom;
  readonly delay?: number;
  readonly trigger?: 'load' | 'inView';
  readonly className?: string;
  readonly wordClassName?: string;
}

function splitIntoCharacters(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

function staggerDelay(index: number, total: number, from: StaggerFrom, step: number): number {
  if (from === 'first') return index * step;
  if (from === 'last') return (total - 1 - index) * step;
  if (from === 'center') return Math.abs(Math.floor(total / 2) - index) * step;
  return Math.abs(from - index) * step;
}

export default function VerticalCutReveal({
  children,
  as: Tag = 'span',
  splitBy = 'words',
  staggerDuration = 0.07,
  staggerFrom = 'first',
  delay = 0,
  trigger = 'load',
  className,
  wordClassName,
}: VerticalCutRevealProps) {
  const ref = useRef<HTMLElement>(null);
  // 'load' plays from first paint via CSS; 'inView' starts as final text (no-JS safe).
  const [state, setState] = useState<'idle' | 'armed' | 'run'>(trigger === 'load' ? 'run' : 'idle');

  const words = useMemo(
    () =>
      children.split(' ').map((word, i, arr) => ({
        chars: splitBy === 'characters' ? splitIntoCharacters(word) : [word],
        needsSpace: i !== arr.length - 1,
      })),
    [children, splitBy],
  );
  const total = words.reduce((acc, w) => acc + w.chars.length, 0);

  useEffect(() => {
    if (trigger !== 'inView') return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already on screen: leave it static
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('run');
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  let running = 0;
  return (
    <Tag ref={ref} className={[styles.cut, className].filter(Boolean).join(' ')} data-cut={state}>
      <span className={styles.srOnly}>{children}</span>
      {words.map((word, wi) => (
        // Space sits outside the masked inline-block: trailing spaces inside it collapse.
        <Fragment key={wi}>
          <span aria-hidden="true" className={[styles.cutWord, wordClassName].filter(Boolean).join(' ')}>
            {word.chars.map((char, ci) => {
              const index = running++;
              const style = {
                '--cut-delay': `${delay + staggerDelay(index, total, staggerFrom, staggerDuration)}s`,
              } as CSSProperties;
              return (
                <span key={ci} className={styles.cutEl} style={style}>
                  {char}
                </span>
              );
            })}
          </span>
          {word.needsSpace ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
