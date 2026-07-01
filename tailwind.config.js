/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a2b4a',
        'primary-dark': '#111d33',
        accent: '#e8832a',
        'accent-dark': '#c96e1e',
      },
    },
  },
  plugins: [],
}
