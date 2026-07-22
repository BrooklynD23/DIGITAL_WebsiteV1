'use client';

import { createElement, useLayoutEffect, useRef } from 'react';
import { gsap, SplitText } from './gsapSetup';

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface TextRevealProps {
  readonly as: TextRevealTag;
  readonly split?: 'lines' | 'words';
  readonly trigger?: 'mount' | 'scroll';
  readonly stagger?: number;
  readonly delay?: number;
  readonly className?: string;
  readonly children: string;
}

/**
 * Wraps a text node and reveals it via GSAP SplitText, once, on mount or on
 * scroll-enter. Renders plain unsplit text under prefers-reduced-motion.
 * Scoped to the smartphone page — never mixed with anime.js on the same node.
 */
export function TextReveal({
  as: Component,
  split = 'lines',
  trigger = 'scroll',
  stagger = 0.06,
  delay = 0,
  className,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const splitInstance = new SplitText(el, {
      type: split,
      mask: split,
      linesClass: 'text-reveal-line',
      wordsClass: 'text-reveal-word',
    });
    const targets = split === 'lines' ? splitInstance.lines : splitInstance.words;

    const tween = gsap.fromTo(
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

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      splitInstance.revert();
    };
  }, [split, trigger, stagger, delay]);

  return createElement(
    Component,
    { ref: ref as React.Ref<HTMLElement>, className },
    children
  );
}
