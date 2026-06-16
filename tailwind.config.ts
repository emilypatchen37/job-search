import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        card: '#111111',
        'card-hover': '#181818',
        border: '#262626',
        accent: '#8b5cf6',
        'accent-hover': '#7c3aed',
        muted: '#737373',
      },
    },
  },
  plugins: [],
}

export default config
