/**
 * Concept C — the visitor's signature, shared between the hero and the footer.
 * In-memory only: it lives as long as this tab and is never stored or sent.
 */
import { useSyncExternalStore } from 'react';

let current = '';
const listeners = new Set<() => void>();

export function setSignature(name: string): void {
  if (name === current) return;
  current = name;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useSignature(): string {
  return useSyncExternalStore(subscribe, () => current, () => '');
}
