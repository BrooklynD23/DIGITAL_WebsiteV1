import Link from 'next/link';
import s from '../_chrome/site-page.module.css';
import x from './extras.module.css';

export interface Row {
  readonly label: string;
  readonly href: string;
  /** One supporting line under the label. */
  readonly meta?: string;
  /** A second quiet line (status, meeting time). */
  readonly note?: string;
}

/** Hairline link rows from the shell (.rows / .linkRow), with an optional second line. http links open in a new tab. */
export function LinkRows({ rows, className }: { readonly rows: readonly Row[]; readonly className?: string }) {
  return (
    <ul className={className ? `${s.rows} ${className}` : s.rows}>
      {rows.map((r) => {
        const body = (
          <span className={x.rowText}>
            <span className={r.meta || r.note ? x.rowTitle : undefined}>{r.label}</span>
            {r.meta ? <span className={x.rowMeta}>{r.meta}</span> : null}
            {r.note ? <span className={x.rowMeta}>{r.note}</span> : null}
          </span>
        );
        return (
          <li key={r.href + r.label}>
            {r.href.startsWith('http') ? (
              <a className={s.linkRow} href={r.href} target="_blank" rel="noopener noreferrer">{body}</a>
            ) : (
              <Link className={s.linkRow} href={r.href} prefetch={false}>{body}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
