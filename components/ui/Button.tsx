import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
          'transition-all duration-300 ease-smooth',
          'transform-gpu', // Enable GPU acceleration for smooth animations
          // Focus state with glow
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
          'focus:ring-offset-background-light dark:focus:ring-offset-background-dark',
          // Hover scale + active press
          'hover:scale-[1.03] active:scale-[0.98]',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100',
          // Variants
          variant === 'primary' && [
            'bg-primary text-white',
            'shadow-md shadow-primary/20',
            'hover:bg-primary-hover hover:shadow-glow',
            'active:shadow-md',
          ],
          variant === 'secondary' && [
            'bg-white dark:bg-surface-dark',
            'border border-surface-border-light dark:border-surface-border',
            'text-slate-900 dark:text-white',
            'hover:border-primary dark:hover:border-primary',
            'hover:bg-primary-subtle dark:hover:bg-primary-subtle',
            'hover:shadow-glow-sm',
          ],
          variant === 'ghost' && [
            'bg-transparent',
            'text-slate-700 dark:text-slate-300',
            'hover:bg-primary-subtle',
            'hover:text-primary dark:hover:text-primary-light',
          ],
          variant === 'outline' && [
            'bg-transparent',
            'border border-slate-300 dark:border-slate-600',
            'text-slate-900 dark:text-white',
            'hover:border-primary dark:hover:border-primary',
            'hover:text-primary dark:hover:text-primary-light',
            'hover:shadow-glow-sm',
          ],
          // Sizes
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-[15px]',
          size === 'lg' && 'h-12 px-6 text-base',
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
