import { cn } from '@/lib/utils';
import { ElementType, HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  /** Render as a `.band`: 120px vertical rhythm + hairline top border (DESIGN §2.4 / §7). */
  band?: boolean;
  /** Drop the top border on a band (e.g. the first band on a page). */
  noBorder?: boolean;
  /** Constrain content to the 1180px `.wrap` container. Default true. */
  wrap?: boolean;
  /** Underlying element. Defaults to `section`. */
  as?: ElementType;
}

/**
 * Layout band primitive. Applies the 1180px content container (`.wrap`)
 * and, when `band`, the 120px vertical rhythm with a hairline top border.
 * Pages compose their content inside; no per-section background fills
 * (the global studio sweep shows through).
 */
export function Section({
  children,
  className,
  band = false,
  noBorder = false,
  wrap = true,
  as,
  ...props
}: SectionProps) {
  const Component = (as ?? 'section') as ElementType;

  return (
    <Component
      className={cn(
        band && 'py-[120px]',
        band && !noBorder && 'border-t border-line',
        className
      )}
      {...props}
    >
      {wrap ? (
        <div className="mx-auto max-w-content px-7">{children}</div>
      ) : (
        children
      )}
    </Component>
  );
}
