import type { Metadata } from 'next';
import { phoneV2Metadata } from '@/lib/data/phoneV2';
import { studioFonts } from '@/lib/fonts';

export const metadata: Metadata = {
  title: phoneV2Metadata.title,
  description: phoneV2Metadata.description,
};

export default function ModularSmartphoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${studioFonts.display.variable} ${studioFonts.body.variable} ${studioFonts.mono.variable}`}
    >
      {/* Failure fallback for the loader handoff: if JS never runs, the hero's
          armed (opacity-0) pre-state would hide the headline forever. Un-arm it. */}
      <noscript>
        <style>{'.text-reveal-armed { opacity: 1 !important; }'}</style>
      </noscript>
      {children}
    </div>
  );
}
