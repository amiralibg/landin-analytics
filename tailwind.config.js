/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3500c0',
        secondary: '#4c1d95',
      },
      fontFamily: {
        'vazir': ['Vazirmatn', 'Tahoma', 'sans-serif'],
      }
    },
  },
  plugins: [],
}