import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: { DEFAULT: '#d6d4d3', lo: '#c4c1c0', hi: '#eceae9' },
        ink: { DEFAULT: '#16161a', soft: '#5d5b59' },
        accent: { DEFAULT: '#d8412f' }, // signal red
        'accent-blue': '#1c6cff', // electric blue (functional)
        line: '#b9b6b4',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { DEFAULT: '4px', lg: '10px', full: '9999px' },
      maxWidth: { content: '1180px' },
      boxShadow: {
        pill: '0 10px 40px rgba(20,20,26,.12), inset 0 1px 0 rgba(255,255,255,.7)',
        card: '0 14px 40px rgba(20,20,26,.06)',
        active: '0 2px 10px rgba(0,0,0,.07)',
      },
      transitionTimingFunction: { studio: 'cubic-bezier(.22,.61,.36,1)' },
      letterSpacing: { eyebrow: '.22em', label: '.16em', wide: '.3em' },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        cue: {
          '0%,100%': { transform: 'scaleX(.3)', opacity: '.4' },
          '50%': { transform: 'scaleX(1)', opacity: '1' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up .8s cubic-bezier(.22,.61,.36,1)',
        cue: 'cue 2.4s cubic-bezier(.22,.61,.36,1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
