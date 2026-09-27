'use client';

import { createElement, useLayoutEffect, useRef } from 'react';
import { gsap, SplitText } from './gsapSetup';
import { cn } from '@/lib/utils';

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface TextRevealProps {
  readonly as: TextRevealTag;
  readonly split?: 'lines' | 'words';
  readonly trigger?: 'mount' | 'scroll';
  readonly stagger?: number;
  readonly delay?: number;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly children: string;
}

/**
 * Wraps a text node and reveals it via GSAP SplitText, once, on mount or on
 * scroll-enter. Renders plain unsplit text under prefers-reduced-motion.
 * Scoped to the smartphone page — never mixed with anime.js on the same node.
 *
 * `disabled` renders an ARMED pre-state (`text-reveal-armed`, opacity:0) so
 * prerendered HTML never shows the finished headline uncovered — the loader
 * fade and the reveal can then overlap without a double reveal. A
 * `<noscript>` style block on the route layout un-arms the class when JS
 * never runs, and any split/tween failure below also un-arms, so content is
 * never withheld when animation fails.
 */
export function TextReveal({
  as: Component,
  split = 'lines',
  trigger = 'scroll',
  stagger = 0.06,
  delay = 0,
  className,
  disabled = false,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) return; // stay armed

    // Un-arm first: the element becomes visible even if anything below fails.
    el.classList.remove('text-reveal-armed');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let splitInstance: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    try {
      splitInstance = new SplitText(el, {
        type: split,
        mask: split,
        linesClass: 'text-reveal-line',
        wordsClass: 'text-reveal-word',
      });
      const targets = split === 'lines' ? splitInstance.lines : splitInstance.words;

      tween = gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger,
          delay,
          scrollTrigger:
            trigger === 'scroll'
              ? { trigger: el, start: 'top 85%', once: true }
              : undefined,
        }
      );
    } catch {
      // Split/tween failed — text is already visible via un-arm above.
      splitInstance?.revert();
      tween?.kill();
      return;
    }

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      splitInstance?.revert();
    };
  }, [split, trigger, stagger, delay, disabled]);

  return createElement(
    Component,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: cn(className, disabled && 'text-reveal-armed'),
    },
    children
  );
}
