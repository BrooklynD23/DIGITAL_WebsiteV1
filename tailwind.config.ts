import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Landing design system (landing.DESIGN.md) — token namespace.
        dg: {
          bg: 'var(--dg-bg)',
          ink: 'var(--dg-ink)',
          green: 'var(--dg-green)',
          gold: 'var(--dg-gold)',
          'gold-bright': 'var(--dg-gold-bright)',
          dark: 'var(--dg-dark)',
          'dark-hover': 'var(--dg-dark-hover)',
          cream: 'var(--dg-cream)',
          muted: 'var(--dg-muted)',
          'muted-dark': 'var(--dg-muted-dark)',
          card: 'var(--dg-card)',
          'stripe-a': 'var(--dg-stripe-a)',
          'stripe-b': 'var(--dg-stripe-b)',
          'nav-bg': 'var(--dg-nav-bg)',
          'line-hair': 'var(--dg-line-hair)',
          'line-soft': 'var(--dg-line-soft)',
          'line-card': 'var(--dg-line-card)',
          'line-struct': 'var(--dg-line-struct)',
          line: 'var(--dg-line)',
          'line-accent': 'var(--dg-line-accent)',
          'line-hover': 'var(--dg-line-hover)',
          'line-strong': 'var(--dg-line-strong)',
          'ink-45': 'var(--dg-ink-45)',
          'ink-50': 'var(--dg-ink-50)',
          'line-dark': 'var(--dg-line-dark)',
          'line-track': 'var(--dg-line-track)',
          'line-dark-mid': 'var(--dg-line-dark-mid)',
          'line-dark-strong': 'var(--dg-line-dark-strong)',
          'star-dark': 'var(--dg-star-dark)',
        },
        studio: { DEFAULT: '#d6d4d3', lo: '#c4c1c0', hi: '#eceae9' },
        ink: { DEFAULT: '#16161a', soft: '#5d5b59' },
        accent: { DEFAULT: '#d8412f' }, // signal red
        'accent-blue': '#1c6cff', // electric blue (functional)
        line: '#b9b6b4',
      },
      screens: {
        xs: '375px',
        nav: '820px',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        // Landing stack (CSS vars from lib/fonts.ts via next/font)
        homeSerif: ['var(--font-home-serif)', 'Newsreader', 'serif'],
        homeSans: ['var(--font-home-sans)', '"IBM Plex Sans"', 'sans-serif'],
        homeMono: ['var(--font-home-mono)', '"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        cta: '2px',
        'chip-sm': '3px',
        chip: '4px',
        card: '8px',
        plate: '10px',
        lg: '10px',
        full: '9999px',
      },
      maxWidth: { content: '1180px' },
      boxShadow: {
        pill: '0 10px 40px rgba(20,20,26,.12), inset 0 1px 0 rgba(255,255,255,.7)',
        card: '0 14px 40px rgba(20,20,26,.06)',
        active: '0 2px 10px rgba(0,0,0,.07)',
      },
      transitionTimingFunction: { studio: 'cubic-bezier(.22,.61,.36,1)' },
      letterSpacing: { eyebrow: '.22em', label: '.16em', wide: '.3em' },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
