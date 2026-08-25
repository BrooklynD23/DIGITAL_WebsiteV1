import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-dg-bg px-[var(--dg-gutter)] py-24 text-dg-ink">
      <div className="mx-auto max-w-xl text-center">
        <p className="m-0 font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted">
          Error 404
        </p>
        <h1 className="mt-[10px] font-homeSerif text-[clamp(64px,14vw,140px)] font-medium leading-none tracking-[-0.01em]">
          404
        </h1>
        <p className="mx-auto m-0 mt-[10px] max-w-md text-[13px] leading-[1.75] text-dg-muted">
          This page doesn&apos;t exist or has moved. The bench is still where you left it.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-[14px] sm:flex-row">
          <Link
            href="/"
            className="rounded-cta bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg transition-colors duration-200 hover:bg-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
          >
            Go home
          </Link>
          <Link
            href="/projects"
            className="rounded-cta border border-dg-line-hover px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-ink transition-colors duration-200 hover:bg-dg-ink hover:text-dg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
          >
            View projects
          </Link>
        </div>
      </div>
    </div>
  );
}
