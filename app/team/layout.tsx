import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team - DIGITAL @ Cal Poly Pomona',
  description: 'Meet the engineers, designers, and innovators building the future at DIGITAL. Join our executive, hardware, software, or outreach teams.',
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
