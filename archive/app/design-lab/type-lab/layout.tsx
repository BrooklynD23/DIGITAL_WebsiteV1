import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { FONTSHARE_HREFS, typeLabFontVars } from './fonts';

export const metadata: Metadata = {
  title: 'Type lab — DIGITAL design lab',
  robots: { index: false, follow: false },
};

export default function TypeLabLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      {/* Scoped to this lab route only: Fontshare CSS API (ITF FFL families). */}
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      {FONTSHARE_HREFS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div className={typeLabFontVars}>{children}</div>
    </>
  );
}
