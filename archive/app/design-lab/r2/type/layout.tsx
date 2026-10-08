import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { trialFontVars } from './fonts';

export const metadata: Metadata = {
  title: 'R2 type trial — DIGITAL design lab',
  robots: { index: false, follow: false },
};

export default function R2TypeLayout({ children }: { readonly children: ReactNode }) {
  return <div className={trialFontVars}>{children}</div>;
}
