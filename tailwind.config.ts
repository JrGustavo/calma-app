import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          alt: 'var(--bg-alt)',
          elevated: 'var(--bg-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        grammar: {
          DEFAULT: 'var(--grammar-marker)',
          hover: 'var(--grammar-marker-hover)',
          bg: 'var(--grammar-marker-bg)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
        },
        success: {
          muted: 'var(--success-muted)',
        },
        warning: {
          muted: 'var(--warning-muted)',
        },
        system: {
          accent: 'var(--system-accent)',
        },
      },
      fontFamily: {
        sans: [
          'Atkinson Hyperlegible',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        'sm': ['calc(0.95rem * var(--font-scale, 1))', { lineHeight: '1.6' }],
        'base': ['calc(1.125rem * var(--font-scale, 1))', { lineHeight: '1.7' }],
        'lg': ['calc(1.25rem * var(--font-scale, 1))', { lineHeight: '1.7' }],
        'xl': ['calc(1.5rem * var(--font-scale, 1))', { lineHeight: '1.5' }],
        '2xl': ['calc(1.875rem * var(--font-scale, 1))', { lineHeight: '1.4' }],
        '3xl': ['calc(2.25rem * var(--font-scale, 1))', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        normal: '0.02em',
      },
      maxWidth: {
        prose: '65ch',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
