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
        primary: '#0d7ff2',
        'background-light': '#f5f7f8',
        'background-dark': '#101922',
        'surface-dark': '#1a242f',
        'surface-light': '#ffffff',
        'surface-border': '#283039',
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
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
