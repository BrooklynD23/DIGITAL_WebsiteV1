import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex flex-col flex-1">
        {label && (
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
            {label}
          </p>
        )}
        <input
          ref={ref}
          className={cn(
            'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg',
            'text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50',
            'border border-slate-300 dark:border-surface-border',
            'bg-slate-50 dark:bg-[#111418] focus:border-primary',
            'h-14 placeholder:text-slate-400 dark:placeholder:text-[#9cabba]',
            'p-[15px] text-base font-normal leading-normal transition-all',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </label>
    );
  }
);

Input.displayName = 'Input';
