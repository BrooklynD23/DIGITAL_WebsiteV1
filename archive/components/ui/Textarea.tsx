import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-1 flex-col">
        {label && (
          <label
            htmlFor={textareaId}
            className="pb-2 font-mono text-[11px] font-medium uppercase tracking-[.16em] text-ink-soft"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex min-h-40 w-full min-w-0 flex-1 rounded border border-line bg-white/55',
            'px-4 py-[14px] font-body text-base leading-normal text-ink',
            'placeholder:text-ink-soft/70',
            'transition-[border-color,box-shadow] duration-200 ease-studio',
            'focus:outline-none focus-visible:border-accent-blue focus-visible:ring-2 focus-visible:ring-accent-blue',
            error && 'border-accent focus-visible:border-accent focus-visible:ring-accent',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 font-mono text-[12px] text-accent"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
