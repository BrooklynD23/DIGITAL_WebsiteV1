'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { ALL_SEATS, type Seat } from './content';

const STORAGE_KEY = 'dl-f-bench-v1';
export const NAME_MAX = 24;

interface SignState {
  readonly name: string;
  readonly seatId: string | null;
  readonly seat: Seat | null;
  /** false during SSR and before hydration: interactive controls render only when true. */
  readonly ready: boolean;
  readonly setName: (name: string) => void;
  readonly placeTag: (seatId: string | null) => void;
}

const SignContext = createContext<SignState | null>(null);

function cleanName(raw: string): string {
  // Plain text only; React escapes on render. Collapse whitespace, cap length.
  return raw.replace(/\s+/g, ' ').slice(0, NAME_MAX);
}

export function SignProvider({ children }: { readonly children: ReactNode }) {
  const [name, setNameState] = useState('');
  const [seatId, setSeatId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const p = parsed as { name?: unknown; seatId?: unknown };
          if (typeof p.name === 'string') setNameState(cleanName(p.name));
          if (typeof p.seatId === 'string' && ALL_SEATS.some((s) => s.id === p.seatId)) setSeatId(p.seatId);
        }
      }
    } catch {
      // Storage blocked (private mode, previews): the page works without it.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, seatId }));
    } catch {
      // Non-critical convenience; ignore.
    }
  }, [name, seatId, ready]);

  const setName = useCallback((n: string) => setNameState(cleanName(n)), []);
  const placeTag = useCallback((id: string | null) => setSeatId(id), []);

  const value = useMemo<SignState>(
    () => ({
      name,
      seatId,
      seat: ALL_SEATS.find((s) => s.id === seatId) ?? null,
      ready,
      setName,
      placeTag,
    }),
    [name, seatId, ready, setName, placeTag],
  );

  return (
    <SignContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SignContext.Provider>
  );
}

export function useSign(): SignState {
  const ctx = useContext(SignContext);
  if (!ctx) throw new Error('useSign must be used inside <SignProvider>');
  return ctx;
}

/** Inline text that mirrors the visitor's name, with a fallback for SSR / empty. */
export function NameText({ fallback, className }: { readonly fallback: string; readonly className?: string }) {
  const { name } = useSign();
  const trimmed = name.trim();
  return <span className={className} data-empty={trimmed ? undefined : ''}>{trimmed || fallback}</span>;
}
