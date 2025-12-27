import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'active' | 'completed' | 'paused' | 'flagship';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export function Badge({ variant = 'default', children, className, pulse = false }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
        variant === 'default' && 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        variant === 'active' && 'bg-green-500/10 border border-green-500/20 text-green-500',
        variant === 'completed' && 'bg-blue-500/10 border border-blue-500/20 text-blue-500',
        variant === 'paused' && 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500',
        variant === 'flagship' && 'bg-primary/20 border border-primary/40 text-primary',
        className
      )}
    >
      {pulse && (
        <span
          className={cn(
            'size-2 rounded-full',
            variant === 'active' && 'bg-green-500 animate-pulse',
            variant === 'flagship' && 'bg-primary animate-pulse',
            variant === 'default' && 'bg-primary animate-pulse'
          )}
        />
      )}
      {children}
    </div>
  );
}
