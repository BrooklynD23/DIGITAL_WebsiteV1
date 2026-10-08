import type { ReactNode } from 'react';
import s from '../e.module.css';

/**
 * v2 blank-state grammar. An issue tracker assigns rows; it does not draw signature lines.
 * - Assignee: "Unassigned" (an open seat) or a real name.
 * - OpenChip: an invitation, accent-dashed, usually a link.
 * - Pending: an honest gap with no action, quiet and neutral.
 */
export function Assignee({ name }: { readonly name?: string }) {
  return name ? (
    <span className={s.assignee} data-assigned="true">
      <span className={s.avatar} aria-hidden="true">
        {name
          .replace(/^Dr\.\s*/, '')
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')}
      </span>
      {name}
    </span>
  ) : (
    <span className={s.assignee}>
      <span className={s.avatar} aria-hidden="true" />
      Unassigned
    </span>
  );
}

export function OpenChip({ children, href }: { readonly children: ReactNode; readonly href?: string }) {
  return href ? (
    <a href={href} className={s.openChip}>
      {children}
    </a>
  ) : (
    <span className={s.openChip}>{children}</span>
  );
}

export function Pending({ children }: { readonly children?: ReactNode }) {
  return (
    <span className={s.pendingWrap}>
      <span className={s.pendingChip}>Pending</span>
      {children ? <span className={s.pendingText}>{children}</span> : null}
    </span>
  );
}
