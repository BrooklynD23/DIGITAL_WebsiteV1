'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-[24px]">memory</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            DIGITAL
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-lg h-9 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-900 dark:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all"
            >
              Join Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
