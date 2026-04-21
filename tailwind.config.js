/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        deep: 'var(--bg-deep)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        accent: {
          DEFAULT: 'var(--accent-primary)',
          glow: 'var(--accent-glow)',
          dim: 'var(--accent-dim)',
        },
        pulse: {
          DEFAULT: 'var(--pulse-primary)',
          glow: 'var(--pulse-glow)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          faint: 'var(--text-muted)',
        },
        wave: {
          active: 'var(--wave-active)',
          inactive: 'var(--wave-inactive)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        zenith: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        glow: '0 0 32px var(--accent-glow)',
        'glow-sm': '0 0 16px var(--accent-glow)',
        'pulse-glow': '0 0 40px var(--pulse-glow)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 16px var(--accent-glow)' },
          '50%': { boxShadow: '0 0 40px var(--accent-glow)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bar-bounce': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-8px) translateX(4px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        rise: 'rise 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 14s linear infinite',
        'bar-bounce': 'bar-bounce 900ms ease-in-out infinite',
        drift: 'drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
