import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'featured' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      padding = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl border',
          'transition-all duration-300 ease-smooth',
          'transform-gpu',
          // Padding variants
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-5 md:p-6',
          padding === 'lg' && 'p-6 md:p-8',
          // Variant styles
          variant === 'default' && [
            'bg-white dark:bg-surface-dark',
            'border-surface-border-light dark:border-surface-border',
          ],
          variant === 'interactive' && [
            'bg-white dark:bg-surface-dark',
            'border-surface-border-light dark:border-surface-border',
            'cursor-pointer',
            'hover:-translate-y-1',
            'hover:shadow-lift',
            'hover:border-primary/30 dark:hover:border-primary/30',
            'active:-translate-y-0.5',
            'active:shadow-md',
          ],
          variant === 'featured' && [
            'bg-white dark:bg-surface-dark',
            'border-primary/20 dark:border-primary/20',
            'shadow-sm',
            'hover:-translate-y-1',
            'hover:shadow-glow',
            'hover:border-primary/40 dark:hover:border-primary/40',
          ],
          variant === 'glass' && [
            'bg-white/70 dark:bg-surface-dark/70',
            'backdrop-blur-md',
            'border-white/20 dark:border-white/10',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents for structured content
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({
  children,
  className,
  as: Component = 'h3',
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        'font-display font-semibold text-lg text-slate-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-sm text-text-muted-light dark:text-text-muted-dark',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('mt-4 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
