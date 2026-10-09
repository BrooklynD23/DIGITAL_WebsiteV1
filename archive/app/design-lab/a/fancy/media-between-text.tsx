/**
 * Media Between Text — adapted from fancy components by Daniel Petho.
 * Source: https://github.com/danielpetho/fancy/blob/main/src/fancy/components/blocks/media-between-text.tsx
 *
 * MIT License · Copyright (c) 2024 Daniel Petho
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files, to deal in the Software without restriction,
 * subject to the inclusion of this notice in all copies or substantial portions.
 *
 * DIGITAL design-lab changes (concept A):
 * - Kept: first text · media · second text in one flex row; media container opens from
 *   width 0 with a no-bounce spring; inView trigger via motion `useInView`.
 * - Changed: `media` is a ReactNode (procedural SVG / live RSVP plate) instead of an
 *   img/video URL — DIGITAL has no real project photos yet.
 * - Changed: server HTML renders the media OPEN (no-JS safe). After mount it collapses only
 *   when below the fold and motion is allowed, then opens on scroll.
 * - Added: `useReducedMotion()` → always open, no width animation. The heading text is a
 *   single accessible string (`label`); the split halves are aria-hidden.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from '../a.module.css';

interface MediaBetweenTextProps {
  readonly firstText: string;
  readonly secondText: string;
  readonly media: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly mediaClassName?: string;
}

export default function MediaBetweenText({
  firstText,
  secondText,
  media,
  as: Tag = 'p',
  className,
  mediaClassName,
}: MediaBetweenTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const top = ref.current.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.8) setArmed(true);
  }, [reduce]);

  const open = !armed || inView;

  return (
    <div ref={ref} className={[styles.mbt, className].filter(Boolean).join(' ')}>
      <Tag className={styles.srOnly}>{`${firstText} ${secondText}`}</Tag>
      <span aria-hidden="true" className={styles.mbtText}>
        {firstText}
      </span>
      <motion.span
        aria-hidden="true"
        className={[styles.mbtMedia, mediaClassName].filter(Boolean).join(' ')}
        initial={false}
        animate={open ? { width: 'auto', opacity: 1 } : { width: 0, opacity: 1 }}
        transition={armed ? { type: 'spring', duration: 0.7, bounce: 0 } : { duration: 0 }}
      >
        {media}
      </motion.span>
      <span aria-hidden="true" className={styles.mbtText}>
        {secondText}
      </span>
    </div>
  );
}
