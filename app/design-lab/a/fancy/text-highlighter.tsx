/**
 * Text Highlighter — adapted from fancy components by Daniel Petho.
 * Source: https://github.com/danielpetho/fancy/blob/main/src/fancy/components/text/text-highlighter.tsx
 *
 * MIT License · Copyright (c) 2024 Daniel Petho
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files, to deal in the Software without restriction,
 * subject to the inclusion of this notice in all copies or substantial portions.
 *
 * DIGITAL design-lab changes (concept A):
 * - Kept: background-size wipe on a box-decoration-break:clone span (works across line
 *   wraps), direction ltr/rtl/ttb/btt, inView trigger via motion `useInView`.
 * - Changed: server HTML and the first client render show the highlight FULLY drawn, so the
 *   marked clause is visible without JS. After mount the highlight is retracted only if
 *   the element is still below the fold and motion is allowed, then drawn on scroll.
 * - Added: `useReducedMotion()` → the highlight stays drawn and never animates.
 * - Added: `mark="band"` draws a proofreader's band under the lower x-height instead of a
 *   full-height block (reads as print markup, not a UI highlighter).
 * - Removed: hover/ref triggers and the imperative handle (unused here).
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt';

interface TextHighlighterProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly highlightColor?: string;
  readonly direction?: Direction;
  readonly delay?: number;
  readonly mark?: 'block' | 'band';
  readonly className?: string;
}

const sizeFor = (direction: Direction, drawn: boolean): string => {
  const vertical = direction === 'ttb' || direction === 'btt';
  if (drawn) return '100% 100%';
  return vertical ? '100% 0%' : '0% 100%';
};

const positionFor = (direction: Direction): string => {
  if (direction === 'rtl') return '100% 0%';
  if (direction === 'btt') return '0% 100%';
  return '0% 0%';
};

export default function TextHighlighter({
  children,
  as: Tag = 'span',
  highlightColor = 'var(--a-highlight)',
  direction = 'ltr',
  delay = 0,
  mark = 'block',
  className,
}: TextHighlighterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const top = ref.current.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.85) setArmed(true);
  }, [reduce]);

  const drawn = !armed || inView;
  const style: CSSProperties = {
    backgroundImage:
      mark === 'band'
        ? `linear-gradient(transparent 58%, ${highlightColor} 58%, ${highlightColor} 86%, transparent 86%)`
        : `linear-gradient(${highlightColor}, ${highlightColor})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: positionFor(direction),
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };

  return (
    <Tag ref={ref}>
      <motion.span
        className={className}
        style={style}
        initial={false}
        animate={{ backgroundSize: sizeFor(direction, drawn) }}
        transition={
          armed ? { type: 'spring', duration: 0.9, bounce: 0, delay } : { duration: 0 }
        }
      >
        {children}
      </motion.span>
    </Tag>
  );
}
