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
          warm: 'var(--bg-warm)',
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
        accent: {
          sage: 'var(--accent-sage)',
          'sage-bg': 'var(--accent-sage-bg)',
          terracotta: 'var(--accent-terracotta)',
          'terracotta-bg': 'var(--accent-terracotta-bg)',
          rose: 'var(--accent-rose)',
          'rose-bg': 'var(--accent-rose-bg)',
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
          'var(--font-atkinson)',
          'Atkinson Hyperlegible',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'var(--font-fraunces)',
          'Fraunces',
          'Atkinson Hyperlegible',
          'serif',
        ],
      },
      fontSize: {
        sm: ['calc(0.95rem * var(--font-scale, 1))', { lineHeight: '1.6' }],
        base: ['calc(1.125rem * var(--font-scale, 1))', { lineHeight: '1.7' }],
        lg: ['calc(1.25rem * var(--font-scale, 1))', { lineHeight: '1.7' }],
        xl: ['calc(1.5rem * var(--font-scale, 1))', { lineHeight: '1.5' }],
        '2xl': ['calc(1.875rem * var(--font-scale, 1))', { lineHeight: '1.4' }],
        '3xl': ['calc(2.25rem * var(--font-scale, 1))', { lineHeight: '1.3' }],
        '4xl': ['calc(2.75rem * var(--font-scale, 1))', { lineHeight: '1.2' }],
        '5xl': ['calc(3.5rem * var(--font-scale, 1))', { lineHeight: '1.1' }],
        '6xl': ['calc(4.25rem * var(--font-scale, 1))', { lineHeight: '1.05' }],
        '7xl': ['calc(5rem * var(--font-scale, 1))', { lineHeight: '1' }],
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
    },
  },
  plugins: [],
};

export default config;
