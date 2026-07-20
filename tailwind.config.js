/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3ED',
          100: '#DCDCD4',
          200: '#D2CCCC',
          300: '#C4C4BC',
          400: '#ACACA5',
          500: '#94948C',
          600: '#9C9C9C',
          700: '#7C7C74',
          800: '#848484',
          900: '#302F2D',
        },
        yandex: {
          DEFAULT: '#FCE000',
        },
      },
      fontFamily: {
        heading: ['Acari Sans', 'sans-serif'],
        body: ['Phénoména', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
