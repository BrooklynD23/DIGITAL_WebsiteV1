'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { useSign } from './SignProvider';
import styles from './f.module.css';

type TagSize = 'hero' | 'tray' | 'slot';

interface NameTagProps extends HTMLAttributes<HTMLSpanElement> {
  readonly size: TagSize;
  readonly lifted?: boolean;
  readonly ghost?: boolean;
}

/** Scale the written name down as it gets longer, so the sticker never overflows. */
export function nameScale(len: number): string {
  if (len <= 8) return '1';
  if (len <= 12) return '0.78';
  if (len <= 17) return '0.6';
  return '0.46';
}

/**
 * The "HELLO, BUILT BY" sticker: the one rounded, red object on the page.
 * Purely visual; callers supply the accessible name.
 */
export const NameTag = forwardRef<HTMLSpanElement, NameTagProps>(function NameTag(
  { size, lifted = false, ghost = false, className, ...rest },
  ref,
) {
  const { name } = useSign();
  const written = name.trim();
  return (
    <span
      ref={ref}
      className={[styles.tag, styles[`tag_${size}`], lifted ? styles.tagLifted : '', ghost ? styles.tagGhost : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span className={styles.tagBand} aria-hidden="true">
        BUILT BY
      </span>
      <span
        className={styles.tagName}
        data-empty={written ? undefined : ''}
        style={{ ['--name-scale' as string]: nameScale(written.length || 9) }}
        aria-hidden="true"
      >
        {written || 'your name'}
      </span>
    </span>
  );
});
