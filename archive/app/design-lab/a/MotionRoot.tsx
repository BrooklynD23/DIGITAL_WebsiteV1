'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

/** Route-wide: motion drops transform/layout animation when the OS asks for reduced motion. */
export default function MotionRoot({ children }: { readonly children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
