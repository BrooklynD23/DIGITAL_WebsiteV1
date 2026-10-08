import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Accent-red mono kicker placed above section intros (DESIGN §5.3).
 * Styling lives in the `.eyebrow` class in globals.css.
 */
export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <p className={cn('eyebrow', className)} {...props}>
      {children}
    </p>
  );
}
