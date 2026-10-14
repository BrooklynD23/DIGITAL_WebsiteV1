import { useSyncExternalStore } from 'react';

export type Paper = 'dark' | 'light';

const wideQuery = '(min-width: 900px)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
export const useWide = () => useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
const noop = () => () => {};
/** True after hydration only: controls that need JS stay out of the no-JS markup. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
