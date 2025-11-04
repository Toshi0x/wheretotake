import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        text: 'var(--text)',
        textDim: 'var(--text-dim)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        onAccent: 'var(--on-accent)',
        borderStrong: 'var(--border-strong)',
        borderHover: 'var(--border-hover)',
        placeholder: 'var(--placeholder)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        border: 'var(--border)'
      },
      borderRadius: {
        xl: 'var(--radius)',
        '2xl': 'calc(var(--radius) + 6px)'
      },
      boxShadow: { focus: 'var(--ring)', focusInset: 'var(--ring-inset)', soft: 'var(--shadow)' },
      ringOffsetWidth: { DEFAULT: 'var(--ring)' }
    }
  },
  plugins: [require('@tailwindcss/typography'), plugin(({ addUtilities }) => {
    addUtilities({
      '.glass': {
        backgroundColor: 'color-mix(in srgb, var(--card) 92%, transparent)',
        backdropFilter: 'blur(8px) saturate(1.08)',
        border: '1px solid var(--border)',
        borderRadius: '16px'
      }
    })
  })]
}

export default config
