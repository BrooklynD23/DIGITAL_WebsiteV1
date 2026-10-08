'use client';

import { type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'span';
}

/**
 * Wrapper marking a block for scroll reveal via `lib/useReveal`.
 * Base styles live in `globals.css` (`[data-reveal]`).
 */
export function Reveal({ children, delay, className, as = 'div' }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      data-reveal
      {...(delay !== undefined ? { 'data-reveal-delay': String(delay) } : {})}
      className={className}
    >
      {children}
    </Tag>
  );
}
