import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-1 flex-col">
        {label && (
          <label
            htmlFor={selectId}
            className="pb-2 font-mono text-[11px] font-medium uppercase tracking-[.16em] text-ink-soft"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex min-h-[44px] w-full min-w-0 flex-1 cursor-pointer appearance-none rounded border border-line bg-white/55',
              'px-4 py-[14px] pr-11 font-body text-base leading-normal text-ink',
              'transition-[border-color,box-shadow] duration-200 ease-studio',
              'focus:outline-none focus-visible:border-accent-blue focus-visible:ring-2 focus-visible:ring-accent-blue',
              error && 'border-accent focus-visible:border-accent focus-visible:ring-accent',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option disabled value="">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-soft">
            <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
          </div>
        </div>
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

Select.displayName = 'Select';
