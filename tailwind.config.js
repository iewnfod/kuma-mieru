import { heroui } from '@heroui/theme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        'around-md': '0 0 3px #ddd',
        'around-lg': '0 0 5px #ccc',
        'around-md-dark': '0 0 5px #555',
        'around-lg-dark': '0 0 10px #555',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui(), typography()],
};

export default config;
