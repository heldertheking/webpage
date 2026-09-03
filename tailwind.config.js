/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens backed by CSS variables (see src/styles/theme.css).
        // Same class names work in both modes — only the variable values change.
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
          sunken: 'rgb(var(--color-surface-sunken) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        edge: {
          DEFAULT: 'rgb(var(--color-edge) / <alpha-value>)',
          strong: 'rgb(var(--color-edge-strong) / <alpha-value>)',
        },
        accent: {
          primary: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
          warn: 'rgb(var(--color-accent-warn) / <alpha-value>)',
          ok: 'rgb(var(--color-accent-ok) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 12px 1px rgb(var(--color-accent-primary) / 0.55)',
        'glow-secondary': '0 0 12px 1px rgb(var(--color-accent-secondary) / 0.55)',
        'glow-warn': '0 0 12px 1px rgb(var(--color-accent-warn) / 0.55)',
        'glow-ok': '0 0 12px 1px rgb(var(--color-accent-ok) / 0.55)',
        panel: 'var(--shadow-panel)',
        'panel-lg': 'var(--shadow-panel-lg)',
      },
      backgroundImage: {
        grid: 'var(--grid-image)',
        'circuit-trace': 'var(--circuit-image)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'led-blink': 'led-blink 1.8s steps(1, end) infinite',
        scan: 'scan 6s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.55, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.35)' },
        },
        'led-blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
      },
      transitionProperty: {
        theme: 'background-color, border-color, color, box-shadow, fill, stroke',
      },
    },
  },
  plugins: [],
}
