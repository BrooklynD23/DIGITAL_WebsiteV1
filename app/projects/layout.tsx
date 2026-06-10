import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - DIGITAL @ Cal Poly Pomona',
  description: 'Explore our engineering projects including the flagship Modular Smartphone, embedded systems, robotics, and more.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pt-28">{children}</div>;
}
