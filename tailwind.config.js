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
      // You can add custom settings like custom colors, fonts, or spacing here.
      // For now, we'll rely on the colors defined in App.jsx.
    },
  },
  plugins: [],
}