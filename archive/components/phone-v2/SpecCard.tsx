import clsx from 'clsx';

export interface SpecCardProps {
  readonly heading: string;
  readonly lead?: string;
  readonly lines: readonly string[];
  readonly accent: string;
  readonly className?: string;
  readonly collapsed?: boolean;
  readonly dark?: boolean;
}

export function SpecCard({
  heading,
  lead,
  lines,
  accent,
  className,
  collapsed = false,
  dark = true,
}: SpecCardProps) {
  return (
    <aside
      className={clsx(
        'rounded-[10px] border p-5 shadow-[0_16px_40px_rgba(2,6,23,0.16)]',
        dark
          ? 'border-white/10 bg-[#1E293B] text-[#F1F5F9]'
          : 'border-[#CBD5E1] bg-white text-[#0F172A]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex size-2 rounded-full" style={{ backgroundColor: accent }} />
        <div className="min-w-0">
          <p className={clsx('font-mono text-[10px] uppercase tracking-[0.24em]', dark ? 'text-[#94A3B8]' : 'text-[#475569]')}>
            {heading}
          </p>
          {lead ? (
            <p className={clsx('mt-2 text-[14px] leading-[1.55]', dark ? 'text-[#F1F5F9]' : 'text-[#0F172A]')}>
              {lead}
            </p>
          ) : null}
        </div>
      </div>

      <div className={clsx('mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em]', collapsed && 'mt-3')}>
        {collapsed ? (
          <div className={clsx('rounded border px-3 py-2', dark ? 'border-white/10 text-[#94A3B8]' : 'border-[#CBD5E1] text-[#475569]')}>
            {lines[0]}
          </div>
        ) : (
          lines.map((line) => (
            <div
              key={line}
              className={clsx(
                'rounded border px-3 py-2',
                dark
                  ? 'border-white/10 bg-white/[0.02] text-[#CBD5E1]'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              )}
            >
              {line}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

