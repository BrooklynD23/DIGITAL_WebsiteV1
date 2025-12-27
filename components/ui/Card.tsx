import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark',
        hover && 'transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
}
