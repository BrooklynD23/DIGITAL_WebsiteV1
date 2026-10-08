import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          // Base — square 4px, 1.5px ink border, uppercase Archivo
          'inline-flex items-center justify-center gap-2 rounded border-[1.5px]',
          'font-display font-semibold uppercase tracking-[.04em]',
          'transition-[transform,background-color,color,border-color] duration-200 ease-studio',
          'transform-gpu',
          // Focus ring — functional electric blue
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-studio',
          // Hover lift (skip when disabled)
          !isDisabled && 'hover:-translate-y-0.5',
          // Variants
          variant === 'primary' && [
            'border-ink bg-ink text-studio',
            !isDisabled && 'hover:border-accent hover:bg-accent',
          ],
          // secondary + outline + ghost all map to the ghost treatment
          (variant === 'ghost' ||
            variant === 'secondary' ||
            variant === 'outline') && [
            'border-ink bg-transparent text-ink',
            !isDisabled && 'hover:bg-ink/[.04]',
          ],
          // Disabled
          isDisabled && 'cursor-not-allowed opacity-50',
          // Sizes
          size === 'sm' && 'px-[18px] py-[10px] text-[13px]',
          size === 'md' && 'px-[26px] py-4 text-sm',
          size === 'lg' && 'px-[30px] py-[18px] text-[15px]',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
