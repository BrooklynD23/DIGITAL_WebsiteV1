import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'completed' | 'paused' | 'flagship' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  /** Renders a small leading status dot. No glow/animation per design system. */
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
        // Industrial chip — DM Mono, uppercase, 4px radius, 1px border
        'inline-flex items-center gap-1.5 rounded border font-mono font-medium uppercase tracking-[.1em]',
        // Size variants
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-3 py-1 text-[11px]',
        // Color variants — flagship/accent use red border + tint
        variant === 'default' && 'border-ink/30 text-ink',
        variant === 'outline' && 'border-line text-ink-soft',
        variant === 'active' && 'border-accent/40 bg-accent/[.08] text-accent',
        variant === 'completed' && 'border-ink/30 text-ink',
        variant === 'paused' && 'border-line text-ink-soft',
        variant === 'flagship' && 'border-accent/40 bg-accent/[.08] text-accent',
        className
      )}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'size-1.5 rounded-full',
            variant === 'active' || variant === 'flagship'
              ? 'bg-accent'
              : 'bg-ink-soft'
          )}
        />
      )}
      {children}
    </span>
  );
}
