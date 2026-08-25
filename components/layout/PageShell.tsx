import { type ReactNode } from 'react';

interface PageShellProps {
  /** Mono kicker above the title. */
  eyebrow: string;
  /** Serif promise — the page's H1. */
  title: string;
  /** Optional mono metadata row under the intro (e.g. "THURSDAYS · 6 PM"). */
  metaRow?: readonly string[];
  children: ReactNode;
}

/**
 * Shared shell for secondary (non-immersive, non-landing) routes.
 * Applies the landing surface and the page-intro register:
 * eyebrow → serif promise → mono metadata row → content bands.
 */
export function PageShell({ eyebrow, title, metaRow, children }: PageShellProps) {
  return (
    <div className="bg-dg-bg text-dg-ink">
      <header className="px-[var(--dg-gutter)] pb-[clamp(28px,4vh,44px)] pt-[clamp(40px,6vh,72px)] text-center">
        <p className="font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted">
          {eyebrow}
        </p>
        <h1 className="mx-auto mt-[18px] max-w-[var(--dg-heading-max)] font-homeSerif text-[length:var(--dg-type-hero)] font-medium leading-[1.14] tracking-[-0.01em]">
          {title}
        </h1>
        {metaRow && metaRow.length > 0 ? (
          <p className="mt-[16px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-muted">
            {metaRow.join('  ·  ')}
          </p>
        ) : null}
      </header>
      <div className="pb-[clamp(56px,9vh,96px)]">{children}</div>
    </div>
  );
}
