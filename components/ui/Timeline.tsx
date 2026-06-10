import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Timeline({
  steps,
  className,
  orientation = 'horizontal',
}: TimelineProps) {
  return (
    <div
      className={cn(
        'relative',
        orientation === 'horizontal' && 'flex items-start gap-0',
        orientation === 'vertical' && 'flex flex-col gap-0',
        className
      )}
    >
      {steps.map((step, index) => (
        <TimelineItem
          key={step.id}
          step={step}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          orientation={orientation}
        />
      ))}
    </div>
  );
}

interface TimelineItemProps {
  step: TimelineStep;
  isFirst: boolean;
  isLast: boolean;
  orientation: 'horizontal' | 'vertical';
}

function TimelineItem({ step, isFirst, isLast, orientation }: TimelineItemProps) {
  const isHorizontal = orientation === 'horizontal';
  const isDone = step.status === 'completed' || step.status === 'current';

  return (
    <div
      className={cn(
        'relative flex',
        isHorizontal ? 'flex-1 flex-col items-center' : 'items-start gap-4'
      )}
    >
      {/* Connector Line - Before */}
      {!isFirst && (
        <div
          className={cn(
            'absolute transition-colors duration-300',
            isHorizontal ? 'right-1/2 top-3 h-px w-1/2' : 'left-3 top-0 h-4 w-px',
            isDone ? 'bg-accent' : 'bg-line'
          )}
        />
      )}

      {/* Connector Line - After */}
      {!isLast && (
        <div
          className={cn(
            'absolute transition-colors duration-300',
            isHorizontal ? 'left-1/2 top-3 h-px w-1/2' : 'left-3 top-8 h-full w-px',
            step.status === 'completed' ? 'bg-accent' : 'bg-line'
          )}
        />
      )}

      {/* Node */}
      <div
        className={cn(
          'relative z-10 flex size-6 items-center justify-center rounded-full border-[1.5px] transition-all duration-300',
          step.status === 'completed' && 'border-accent bg-accent',
          step.status === 'current' && 'border-accent bg-studio',
          step.status === 'upcoming' && 'border-line bg-studio'
        )}
      >
        {step.status === 'completed' && (
          <svg
            className="size-3 text-studio"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {step.status === 'current' && (
          <div className="size-2 rounded-full bg-accent" />
        )}
        {step.status === 'upcoming' && (
          <div className="size-2 rounded-full bg-line" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'transition-opacity duration-300',
          isHorizontal ? 'mt-3 px-2 text-center' : 'flex-1 pb-8',
          step.status === 'upcoming' && 'opacity-60'
        )}
      >
        <p
          className={cn(
            'font-mono text-[11px] font-medium uppercase tracking-[.16em]',
            step.status === 'current' ? 'text-accent' : 'text-ink'
          )}
        >
          {step.title}
        </p>
        {step.description && (
          <p className="mt-1 text-xs leading-[1.55] text-ink-soft">
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Progress Bar variant for simpler milestone display
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
            Progress
          </span>
          <span className="font-mono text-[11px] font-medium text-ink">
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-line',
          size === 'sm' && 'h-1',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-3'
        )}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-studio"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

// Milestone bar - horizontal progress with labeled milestones
interface Milestone {
  id: string;
  label: string;
  position: number; // 0-100
}

interface MilestoneBarProps {
  milestones: Milestone[];
  currentProgress: number; // 0-100
  className?: string;
}

export function MilestoneBar({
  milestones,
  currentProgress,
  className,
}: MilestoneBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, currentProgress));

  return (
    <div className={cn('relative w-full pb-2 pt-8', className)}>
      {/* Progress Track */}
      <div className="relative h-2 overflow-visible rounded-full bg-line">
        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-accent transition-all duration-500 ease-studio"
          style={{ width: `${clampedProgress}%` }}
        />

        {/* Milestones */}
        {milestones.map((milestone) => {
          const isPassed = clampedProgress >= milestone.position;
          const isCurrent =
            clampedProgress >= milestone.position - 5 &&
            clampedProgress < milestone.position + 5;

          return (
            <div
              key={milestone.id}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${milestone.position}%` }}
            >
              {/* Milestone Node */}
              <div
                className={cn(
                  'size-4 rounded-full border-[1.5px] transition-all duration-300',
                  isPassed ? 'border-accent bg-accent' : 'border-line bg-studio',
                  isCurrent && 'ring-4 ring-accent/20'
                )}
              />
              {/* Label */}
              <span
                className={cn(
                  'absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap',
                  'font-mono text-[10px] uppercase tracking-[.16em] transition-colors duration-300',
                  isPassed ? 'text-accent' : 'text-ink-soft'
                )}
              >
                {milestone.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
