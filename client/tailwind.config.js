/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#0D1117',
          card: '#161B22',
          border: '#21262D',
          light: '#30363D',
          text: '#F0F6FC',
          muted: '#8B949E'
        },
        saffron: {
          DEFAULT: '#E67E22',
          hover: '#D35400',
          light: '#FEF5EC',
          dark: '#A04000',
          glow: 'rgba(230, 126, 34, 0.25)'
        },
        teal: {
          DEFAULT: '#0D9488',
          light: '#F0FDFA',
          dark: '#0F766E',
          glow: 'rgba(13, 148, 136, 0.25)'
        },
        sandstone: {
          DEFAULT: '#FAF7F2',
          light: '#FDFBF7',
          dark: '#EFE9DE',
          border: '#E5DCD0'
        },
        espresso: {
          DEFAULT: '#2B2118',
          muted: '#635446',
          light: '#8C7A6B'
        },
        terracotta: {
          DEFAULT: '#C85A32',
          hover: '#B34B25',
          light: '#FAEEE9',
          border: '#E8B4A2'
        },
        mustard: {
          DEFAULT: '#D99B26',
          light: '#FEF7E6',
          dark: '#B87E12'
        },
        emerald: {
          DEFAULT: '#2E7D5B',
          light: '#EAF5EF',
          dark: '#215C42'
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      boxShadow: {
        'saffron-glow': '0 0 25px rgba(230, 126, 34, 0.35)',
        'teal-glow': '0 0 25px rgba(13, 148, 136, 0.35)',
        'card-hover': '0 12px 30px -10px rgba(43, 33, 24, 0.12)'
      }
    },
  },
  plugins: [],
}
