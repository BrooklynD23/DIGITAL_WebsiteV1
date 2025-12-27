import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - DIGITAL @ Cal Poly Pomona',
  description: 'Get in touch with DIGITAL. Whether you want to join the team, propose a project, or partner with us, we would love to hear from you.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
