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

function TimelineItem({
  step,
  isFirst,
  isLast,
  orientation,
}: TimelineItemProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'relative flex',
        isHorizontal ? 'flex-col items-center flex-1' : 'items-start gap-4'
      )}
    >
      {/* Connector Line - Before */}
      {!isFirst && (
        <div
          className={cn(
            'absolute transition-colors duration-300',
            isHorizontal
              ? 'top-3 right-1/2 h-0.5 w-1/2'
              : 'top-0 left-3 w-0.5 h-4',
            step.status === 'completed' || step.status === 'current'
              ? 'bg-primary'
              : 'bg-surface-border-light dark:bg-surface-border'
          )}
        />
      )}

      {/* Connector Line - After */}
      {!isLast && (
        <div
          className={cn(
            'absolute transition-colors duration-300',
            isHorizontal
              ? 'top-3 left-1/2 h-0.5 w-1/2'
              : 'top-8 left-3 w-0.5 h-full',
            step.status === 'completed'
              ? 'bg-primary'
              : 'bg-surface-border-light dark:bg-surface-border'
          )}
        />
      )}

      {/* Node */}
      <div
        className={cn(
          'relative z-10 flex items-center justify-center',
          'size-6 rounded-full border-2 transition-all duration-300',
          step.status === 'completed' && [
            'bg-primary border-primary',
            'shadow-glow-sm',
          ],
          step.status === 'current' && [
            'bg-white dark:bg-surface-dark border-primary',
            'shadow-glow',
          ],
          step.status === 'upcoming' && [
            'bg-white dark:bg-surface-dark',
            'border-surface-border-light dark:border-surface-border',
          ]
        )}
      >
        {step.status === 'completed' && (
          <svg
            className="size-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {step.status === 'current' && (
          <div className="size-2 rounded-full bg-primary animate-subtle-pulse" />
        )}
        {step.status === 'upcoming' && (
          <div className="size-2 rounded-full bg-surface-border-light dark:bg-surface-border" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'transition-opacity duration-300',
          isHorizontal ? 'mt-3 text-center px-2' : 'flex-1 pb-8',
          step.status === 'upcoming' && 'opacity-60'
        )}
      >
        <p
          className={cn(
            'text-sm font-medium',
            step.status === 'current'
              ? 'text-primary'
              : 'text-slate-900 dark:text-white'
          )}
        >
          {step.title}
        </p>
        {step.description && (
          <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Progress
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-border-light dark:bg-surface-border overflow-hidden',
          size === 'sm' && 'h-1',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-3'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full bg-primary transition-all duration-500 ease-smooth',
            clampedValue === 100 && 'shadow-glow-sm'
          )}
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
    <div className={cn('relative w-full pt-8 pb-2', className)}>
      {/* Progress Track */}
      <div className="relative h-2 rounded-full bg-surface-border-light dark:bg-surface-border overflow-visible">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-500 ease-smooth shadow-glow-sm"
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
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${milestone.position}%` }}
            >
              {/* Milestone Node */}
              <div
                className={cn(
                  'size-4 rounded-full border-2 transition-all duration-300',
                  isPassed
                    ? 'bg-primary border-primary shadow-glow-sm'
                    : 'bg-white dark:bg-surface-dark border-surface-border-light dark:border-surface-border',
                  isCurrent && 'ring-4 ring-primary/20'
                )}
              />
              {/* Label */}
              <span
                className={cn(
                  'absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap',
                  'text-xs font-medium transition-colors duration-300',
                  isPassed
                    ? 'text-primary'
                    : 'text-text-muted-light dark:text-text-muted-dark'
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
