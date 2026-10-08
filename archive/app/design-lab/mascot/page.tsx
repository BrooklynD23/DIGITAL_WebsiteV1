import type { Metadata } from 'next';
import MascotDemo from './MascotDemo';

export const metadata: Metadata = {
  title: 'Mascot lab — DIGITAL design lab',
  robots: { index: false, follow: false },
};

export default function MascotLabPage() {
  return <MascotDemo />;
}
