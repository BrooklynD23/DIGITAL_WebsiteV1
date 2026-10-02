import type { ReactNode } from 'react';
import { fontSignal } from '../_system/fonts';

// World shell: token set + font stack for every signal page. Pages own their content and chrome usage.
export default function SignalWorldLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className={`world-signal ${fontSignal}`} data-world="signal">
      {children}
    </div>
  );
}
