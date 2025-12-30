'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Team' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 ease-smooth',
        scrolled
          ? 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-b border-surface-border-light dark:border-surface-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="px-4 md:px-10 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="size-9 text-primary flex items-center justify-center bg-primary-subtle rounded-xl transition-all duration-300 hover:bg-primary/20 hover:shadow-glow-sm">
            <span className="material-symbols-outlined text-[22px]">memory</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            DIGITAL
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-primary bg-primary-subtle'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary-subtle'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact">
            <Button size="sm">Join Us</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-all duration-300',
            'text-slate-900 dark:text-white',
            'hover:bg-primary-subtle',
            'focus:outline-none focus:ring-2 focus:ring-primary/50'
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
            <span
              className={cn(
                'block h-0.5 w-5 bg-current transition-all duration-300 origin-center',
                mobileMenuOpen && 'rotate-45 translate-y-[3px]'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-5 bg-current transition-all duration-300',
                mobileMenuOpen && 'opacity-0 scale-0'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-5 bg-current transition-all duration-300 origin-center',
                mobileMenuOpen && '-rotate-45 -translate-y-[3px]'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-smooth',
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-surface-border-light dark:border-surface-border bg-background-light dark:bg-background-dark">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  'transform',
                  mobileMenuOpen && 'animate-fade-in-up',
                  pathname === link.href
                    ? 'text-primary bg-primary-subtle'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-primary-subtle hover:text-primary'
                )}
                style={{
                  animationDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                  animationFillMode: 'backwards',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div
              className={cn(
                'mt-2',
                mobileMenuOpen && 'animate-fade-in-up'
              )}
              style={{
                animationDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : '0ms',
                animationFillMode: 'backwards',
              }}
            >
              <Link href="/contact" className="w-full">
                <Button className="w-full" size="lg">Join Us</Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
