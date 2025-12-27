import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, placeholder, ...props }, ref) => {
    return (
      <label className="flex flex-col flex-1">
        {label && (
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">
            {label}
          </p>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg',
              'text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50',
              'border border-slate-300 dark:border-surface-border',
              'bg-slate-50 dark:bg-[#111418] focus:border-primary',
              'h-14 placeholder:text-slate-400 dark:placeholder:text-[#9cabba]',
              'px-[15px] text-base font-normal leading-normal appearance-none cursor-pointer transition-all',
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-[#9cabba]">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </label>
    );
  }
);

Select.displayName = 'Select';
