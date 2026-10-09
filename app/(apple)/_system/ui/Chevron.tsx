/** Shared UI chevron / play marks (replaces per-file inline SVGs). 16-unit grid, 1.6 stroke, currentColor. */
export function Chevron({ dir = 'right', size = 16 }: { readonly dir?: 'left' | 'right' | 'down' | 'up'; readonly size?: number }) {
  const d = { right: 'M6 3.5 10.5 8 6 12.5', left: 'M10 3.5 5.5 8 10 12.5', down: 'M3.5 6 8 10.5 12.5 6', up: 'M3.5 10 8 5.5 12.5 10' }[dir];
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayMark({ playing = false, size = 16 }: { readonly playing?: boolean; readonly size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" focusable="false">
      {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /> : <path d="M4.5 2.5v11l9-5.5z" fill="currentColor" />}
    </svg>
  );
}
