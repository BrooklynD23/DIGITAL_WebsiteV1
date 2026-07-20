import clsx from 'clsx';

export interface HUDProps {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly lines: readonly string[];
  readonly accent: string;
  readonly className?: string;
}

export function HUD({ label, title, description, lines, accent, className }: HUDProps) {
  return (
    <div className={clsx('relative', className)}>
      <div className="relative aspect-square w-full max-w-[440px]">
        <div
          className="absolute inset-0 rounded-full border border-[#94A3B8]/30"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(15,23,42,0.08) 55%, rgba(15,23,42,0) 72%)',
          }}
        />
        <div className="absolute inset-[12%] rounded-full border border-[#F1F5F9]/15" />
        <div className="absolute left-1/2 top-1/2 h-[62%] w-px -translate-x-1/2 -translate-y-1/2 bg-[#94A3B8]/35" />
        <div className="absolute left-1/2 top-1/2 h-px w-[62%] -translate-x-1/2 -translate-y-1/2 bg-[#94A3B8]/35" />
        <div className="absolute left-1/2 top-[18%] h-[64%] w-[64%] -translate-x-1/2 rounded-full border border-dashed border-[#94A3B8]/20" />
        <div className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F1F5F9]/70" />
        <div className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: accent }} />
      </div>

      <div className="mt-5 max-w-[34ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">{label}</p>
        <h3 className="mt-3 font-display text-[clamp(28px,3vw,42px)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[#F1F5F9]">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.55] text-[#CBD5E1]">{description}</p>
        <ul className="mt-5 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#CBD5E1]">
          {lines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-[5px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

