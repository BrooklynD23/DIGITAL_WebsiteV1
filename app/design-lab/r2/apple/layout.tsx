import type { ReactNode } from 'react';
import { fontApple } from '../_system/fonts';

// World shell: token set + font stack for every apple page. Pages own their content and chrome usage.
export default function AppleWorldLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className={`world-apple ${fontApple}`} data-world="apple">
      {children}
    </div>
  );
}
