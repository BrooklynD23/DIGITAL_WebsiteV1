import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Icon({ name, className, size = 'md' }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined',
        size === 'sm' && 'text-[16px]',
        size === 'md' && 'text-[20px]',
        size === 'lg' && 'text-[24px]',
        size === 'xl' && 'text-[32px]',
        className
      )}
    >
      {name}
    </span>
  );
}
