import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-1 flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="pb-2 font-mono text-[11px] font-medium uppercase tracking-[.16em] text-ink-soft"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex min-h-[44px] w-full min-w-0 flex-1 rounded border border-line bg-white/55',
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

Input.displayName = 'Input';
