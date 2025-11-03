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
        bg: 'hsl(var(--bg))',
        card: 'hsl(var(--card))',
        muted: 'hsl(var(--muted))',
        text: 'hsl(var(--text))',
        'text-dim': 'hsl(var(--text-dim))',
        accent: 'hsl(var(--accent))',
        'accent-2': 'hsl(var(--accent-2))',
      },
      borderRadius: {
        xl: 'var(--radius)',
        '2xl': 'calc(var(--radius) + 6px)'
      },
      boxShadow: {
        glow: 'var(--shadow)'
      },
      ringOffsetWidth: {
        DEFAULT: 'var(--ring)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), plugin(({ addUtilities }) => {
    addUtilities({
      '.glass': {
        backgroundColor: 'rgba(17,22,29,0.6)',
        backdropFilter: 'blur(8px) saturate(1.1)'
      }
    })
  })]
}

export default config

