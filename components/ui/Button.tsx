import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all rounded-lg',
          // Variants
          variant === 'primary' &&
            'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20',
          variant === 'secondary' &&
            'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white',
          variant === 'ghost' &&
            'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-white',
          variant === 'outline' &&
            'bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white',
          // Sizes
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'md' && 'h-12 px-6 text-base',
          size === 'lg' && 'h-14 px-8 text-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
