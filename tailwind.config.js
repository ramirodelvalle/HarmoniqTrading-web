/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5B6CFF',
          dark: '#4A57D9',
          light: '#8FA0FF',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(91,108,255,0.35)',
      },
    },
  },
  plugins: [],
}
