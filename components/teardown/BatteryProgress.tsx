'use client';

import { cn } from '@/lib/utils';

interface BatteryProgressProps {
  className?: string;
  fillRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Apple-style horizontal battery shell; fill width is driven by the teardown
 * scroll loop via fillRef (0 → 100% of the inner track).
 */
export function BatteryProgress({ className, fillRef }: BatteryProgressProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-[3px]', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Teardown progress"
    >
      <div className="relative h-[16px] w-[min(280px,42vw)] rounded-[5px] border-[1.5px] border-line/90 bg-white/25 p-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,.06)] backdrop-blur-sm">
        <div
          ref={fillRef}
          className="h-full w-0 min-w-0 rounded-[3px] bg-accent shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-[width] duration-75 ease-studio"
        />
      </div>
      {/* Positive terminal */}
      <div
        className="h-[7px] w-[3px] shrink-0 rounded-[1px] bg-line/90"
        aria-hidden
      />
    </div>
  );
}
