import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex flex-col flex-1">
        {label && (
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
            {label}
          </p>
        )}
        <textarea
          ref={ref}
          className={cn(
            'form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg',
            'text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50',
            'border border-slate-300 dark:border-surface-border',
            'bg-slate-50 dark:bg-[#111418] focus:border-primary',
            'min-h-40 placeholder:text-slate-400 dark:placeholder:text-[#9cabba]',
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

Textarea.displayName = 'Textarea';
