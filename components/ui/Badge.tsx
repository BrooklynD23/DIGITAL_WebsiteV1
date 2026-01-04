import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'completed' | 'paused' | 'flagship' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  pulse?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  pulse = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide',
        'transition-all duration-200',
        // Size variants
        size === 'sm' && 'px-2 py-0.5 rounded-md text-[10px]',
        size === 'md' && 'px-3 py-1 rounded-lg text-xs',
        // Color variants
        variant === 'default' && [
          'bg-slate-100 dark:bg-slate-800',
          'text-slate-600 dark:text-slate-400',
        ],
        variant === 'active' && [
          'bg-emerald-500/10 border border-emerald-500/20',
          'text-emerald-600 dark:text-emerald-400',
        ],
        variant === 'completed' && [
          'bg-primary-subtle border border-primary/20',
          'text-primary',
        ],
        variant === 'paused' && [
          'bg-amber-500/10 border border-amber-500/20',
          'text-amber-600 dark:text-amber-400',
        ],
        variant === 'flagship' && [
          'bg-primary/15 border border-primary/30',
          'text-primary',
        ],
        variant === 'outline' && [
          'bg-transparent border border-surface-border-light dark:border-surface-border',
          'text-slate-600 dark:text-slate-400',
        ],
        className
      )}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'size-1.5 rounded-full animate-subtle-pulse',
            variant === 'active' && 'bg-emerald-500',
            variant === 'flagship' && 'bg-primary',
            variant === 'completed' && 'bg-primary',
            (variant === 'default' || variant === 'outline') && 'bg-slate-500'
          )}
        />
      )}
      {children}
    </span>
  );
}
