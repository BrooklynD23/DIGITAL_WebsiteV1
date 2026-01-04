import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d7ff2',
          hover: '#0b6dd4',
          light: '#3d9bff',
          subtle: 'rgba(13, 127, 242, 0.1)',
          glow: 'rgba(13, 127, 242, 0.2)',
        },
        'background-light': '#f5f7f8',
        'background-dark': '#101922',
        'surface-dark': '#1a242f',
        'surface-light': '#ffffff',
        'surface-border': '#283039',
        'surface-border-light': '#e5e7eb',
        'text-muted': {
          light: '#6b7280',
          dark: '#9ca3af',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(13, 127, 242, 0.15)',
        'glow': '0 0 20px rgba(13, 127, 242, 0.2)',
        'glow-lg': '0 0 30px rgba(13, 127, 242, 0.25)',
        'lift': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'lift-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
