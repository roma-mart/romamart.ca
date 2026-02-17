/** @type {import('tailwindcss').Config} */
export default {
  // This array tells Tailwind where your component files are,
  // so it can scan them for utility classes and generate the necessary CSS.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Brand colors (theme-aware via CSS variables)
      colors: {
        'brand-navy': 'var(--color-primary)',
        'brand-yellow': 'var(--color-accent)',
        'brand-darkgrey': 'var(--color-text-muted)',
        'brand-black': 'var(--color-text)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
};
