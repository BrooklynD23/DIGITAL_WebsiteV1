import { cn } from '@/lib/utils';
import { ElementType } from 'react';

interface OutlineHeadingProps {
  /** Leading plain text, e.g. "take it ". */
  children?: React.ReactNode;
  /** The single keyword rendered with the outline (stroked) treatment. */
  outline: React.ReactNode;
  /** Trailing plain text after the keyword. */
  after?: React.ReactNode;
  /** Append the signature accent-red `.` after the headline. */
  dot?: boolean;
  /** Heading level / element. Defaults to `h2`. */
  as?: ElementType;
  /** Size preset: `hero` (H1) or `section` (H2 `.big`). */
  size?: 'hero' | 'section';
  className?: string;
}

/**
 * Industrial uppercase Archivo headline with exactly one stroked keyword
 * and an optional trailing accent `.` (DESIGN §2.3). Apply the outline to
 * a single keyword per headline.
 */
export function OutlineHeading({
  children,
  outline,
  after,
  dot = false,
  as,
  size = 'section',
  className,
}: OutlineHeadingProps) {
  const Component = (as ?? 'h2') as ElementType;

  return (
    <Component
      className={cn(
        'font-display uppercase',
        size === 'hero' &&
          'text-[clamp(52px,10.5vw,150px)] font-extrabold leading-[.86] tracking-[-.03em]',
        size === 'section' &&
          'text-[clamp(34px,6vw,76px)] font-extrabold leading-[.92] tracking-[-.03em]',
        className
      )}
    >
      {children}
      <span className="text-outline">{outline}</span>
      {after}
      {dot && <span className="text-accent">.</span>}
    </Component>
  );
}
