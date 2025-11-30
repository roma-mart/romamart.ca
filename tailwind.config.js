/** @type {import('tailwindcss').Config} */
export default {
  // This array tells Tailwind where your component files are,
  // so it can scan them for utility classes and generate the necessary CSS.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand colors and fonts
      colors: {
        'brand-navy': '#020178',
        'brand-yellow': '#E4B340',
        'brand-darkgrey': '#242424',
        'brand-black': '#151515'
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}