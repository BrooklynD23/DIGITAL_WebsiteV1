import clsx from 'clsx';

export interface TickScrubberProps {
  readonly activeIndex: number;
  readonly count: number;
  readonly label: string;
  readonly detail?: string;
  readonly progress?: number;
  readonly className?: string;
  readonly compact?: boolean;
}

export function TickScrubber({
  activeIndex,
  count,
  label,
  detail,
  progress,
  className,
  compact = false,
}: TickScrubberProps) {
  const ticks = Array.from({ length: count }, (_, index) => index);
  const normalizedProgress =
    progress === undefined
      ? count > 1
        ? activeIndex / (count - 1)
        : 1
      : Math.min(Math.max(progress, 0), 1);

  return (
    <div
      className={clsx(
        'pointer-events-none flex items-end gap-3 text-right font-mono text-[10px] uppercase tracking-[0.24em]',
        className
      )}
      aria-label={[label, detail].filter(Boolean).join(': ')}
      role="img"
    >
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-end gap-1.5">
          {ticks.map((index) => (
            <span
              key={index}
              className={clsx(
                'inline-block rounded-full transition-all duration-300 ease-out',
                compact ? 'h-1.5 w-1.5' : 'h-2 w-2',
                index <= activeIndex ? 'bg-[#F1F5F9]' : 'bg-[#94A3B8]/45'
              )}
              style={{
                opacity:
                  index < normalizedProgress * count
                    ? 1
                    : 0.45,
              }}
            />
          ))}
        </div>
        <div className="space-y-0.5">
          <div className="text-[#F1F5F9]">{label}</div>
          {detail ? <div className="text-[#94A3B8]">{detail}</div> : null}
        </div>
      </div>
    </div>
  );
}

