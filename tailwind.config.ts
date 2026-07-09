import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16303E',
        amber: '#F15A24',
        paper: '#F7F4EE',
        surface: '#FFFFFF',
        slate: '#48575E',
        success: '#217A52',
      },
      fontFamily: {
        slab: ['var(--font-zilla)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(27, 58, 75, 0.04), 0 6px 20px rgba(27, 58, 75, 0.08)',
        'card-hover': '0 2px 4px rgba(27, 58, 75, 0.06), 0 12px 32px rgba(27, 58, 75, 0.14)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};

export default config;
